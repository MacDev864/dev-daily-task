import { defineStore } from 'pinia';

export interface TaskStatus {
  id: number;
  code: string; // 'backlog', 'todo', 'in_progress', 'in_review', 'done'
  name: string;
  sort_order: number;
  color: string;
}

export interface TaskPriority {
  id: number;
  code: string; // 'low', 'medium', 'high', 'urgent'
  name: string;
  sort_order: number;
  color: string;
}

export interface Project {
  id: number;
  name: string;
  code: string;
  description?: string;
}

export interface Task {
  id: number;
  project_id: number;
  user_id: number;
  status_id: number;
  priority_id: number;
  title: string;
  description?: string;
  issue_key?: string;
  estimated_hours: number;
  due_date?: string;
  project?: Project;
  status?: TaskStatus;
  priority?: TaskPriority;
  created_at: string;
}

export interface DailyNote {
  id: number;
  user_id: number;
  note_date: string;
  content: string;
  is_completed: boolean;
  category: string;
  converted_task_id?: number;
  created_at: string;
}

export interface DailyLog {
  id: number;
  user_id: number;
  log_date: string;
  summary: string;
  blockers: string;
  standup_text?: string;
}

export const useTaskStore = defineStore('tasks', {
  state: () => ({
    tasks: [] as Task[],
    dailyNotes: [] as DailyNote[],
    statuses: [] as TaskStatus[],
    priorities: [] as TaskPriority[],
    projects: [] as Project[],
    dailyLog: null as DailyLog | null,
    currentDate: new Date().toISOString().split('T')[0],
    isLoading: false,
    errorMessage: '',
  }),

  getters: {
    pendingNotes: (state) => state.dailyNotes.filter((n) => !n.is_completed),
    completedNotes: (state) => state.dailyNotes.filter((n) => n.is_completed),
    tasksByStatus: (state) => (statusId: number) =>
      state.tasks.filter((t) => t.status_id === statusId),
    todayTasks: (state) => state.tasks.filter((t) => [2, 3, 5].includes(t.status_id)), // todo, in_progress, done
    totalEstimatedHours: (state) =>
      state.tasks.reduce((sum, t) => sum + Number(t.estimated_hours || 0), 0),
  },

  actions: {
    async fetchInitialData() {
      this.isLoading = true;
      this.errorMessage = '';
      const api = useApi();
      try {
        const [statuses, priorities, projects, notes, tasks, log] = await Promise.all([
          api.get<TaskStatus[]>('/task-statuses').catch(() => []),
          api.get<TaskPriority[]>('/task-priorities').catch(() => []),
          api.get<Project[]>('/projects').catch(() => []),
          api.get<DailyNote[]>('/daily-notes', { date: this.currentDate }).catch(() => []),
          api.get<Task[]>('/tasks').catch(() => []),
          api.get<DailyLog>('/daily-logs/today', { date: this.currentDate }).catch(() => null),
        ]);

        this.statuses = statuses;
        this.priorities = priorities;
        this.projects = projects;
        this.dailyNotes = notes;
        this.tasks = tasks;
        this.dailyLog = log;
      } catch (err: any) {
        this.errorMessage = err.message || 'Failed to load system data';
      } finally {
        this.isLoading = false;
      }
    },

    async fetchTasks() {
      const api = useApi();
      this.tasks = await api.get<Task[]>('/tasks');
    },

    async createTask(payload: {
      project_id: number;
      title: string;
      description?: string;
      priority_id?: number;
      status_id?: number;
      estimated_hours?: number;
    }) {
      const api = useApi();
      const newTask = await api.post<Task>('/tasks', payload);
      this.tasks.unshift(newTask);
      return newTask;
    },

    async updateTaskStatus(taskId: number, statusId: number) {
      const api = useApi();
      const updated = await api.patch<Task>(`/tasks/${taskId}/status`, { status_id: statusId });
      const idx = this.tasks.findIndex((t) => t.id === taskId);
      if (idx !== -1) {
        this.tasks[idx] = updated;
      }
    },

    async deleteTask(taskId: number) {
      const api = useApi();
      await api.delete(`/tasks/${taskId}`);
      this.tasks = this.tasks.filter((t) => t.id !== taskId);
    },

    // --- Daily Scratchpad & Memory Notes (บันทึกช่วยจำ) ---
    async fetchDailyNotes(date?: string) {
      const api = useApi();
      const targetDate = date || this.currentDate;
      this.dailyNotes = await api.get<DailyNote[]>('/daily-notes', { date: targetDate });
    },

    async createDailyNote(content: string, category: string = 'scratchpad') {
      const api = useApi();
      const newNote = await api.post<DailyNote>('/daily-notes', {
        content,
        note_date: this.currentDate,
        category,
      });
      this.dailyNotes.push(newNote);
      return newNote;
    },

    async toggleNoteComplete(noteId: number) {
      const api = useApi();
      const updated = await api.patch<DailyNote>(`/daily-notes/${noteId}/toggle`);
      const idx = this.dailyNotes.findIndex((n) => n.id === noteId);
      if (idx !== -1) {
        this.dailyNotes[idx] = updated;
      }
    },

    async convertNoteToTask(noteId: number, projectId: number, priorityId?: number) {
      const api = useApi();
      const newTask = await api.post<Task>(`/daily-notes/${noteId}/convert-to-task`, {
        project_id: projectId,
        priority_id: priorityId || 2, // 2 = medium
      });
      this.tasks.unshift(newTask);
      // mark note as converted & completed
      const idx = this.dailyNotes.findIndex((n) => n.id === noteId);
      if (idx !== -1) {
        this.dailyNotes[idx].is_completed = true;
        this.dailyNotes[idx].converted_task_id = newTask.id;
      }
      return newTask;
    },

    async deleteDailyNote(noteId: number) {
      const api = useApi();
      await api.delete(`/daily-notes/${noteId}`);
      this.dailyNotes = this.dailyNotes.filter((n) => n.id !== noteId);
    },

    // --- Daily Log & Blockers ---
    async updateBlockers(blockers: string) {
      const api = useApi();
      const updated = await api.post<DailyLog>('/daily-logs/blockers', {
        blockers,
        date: this.currentDate,
      });
      this.dailyLog = updated;
    },

    async generateStandup(): Promise<string> {
      const api = useApi();
      const res = await api.get<{ standup_markdown: string }>('/daily-logs/standup', {
        date: this.currentDate,
      });
      if (this.dailyLog) {
        this.dailyLog.standup_text = res.standup_markdown;
      }
      return res.standup_markdown;
    },
  },
});
