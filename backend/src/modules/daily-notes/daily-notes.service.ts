import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DailyNote } from '../../database/entities/daily-note.entity';
import { Task } from '../../database/entities/task.entity';
import { CreateDailyNoteDto, UpdateDailyNoteDto, ConvertNoteToTaskDto } from './dto/daily-note.dto';

@Injectable()
export class DailyNotesService {
  constructor(
    @InjectRepository(DailyNote)
    private readonly noteRepo: Repository<DailyNote>,
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
  ) {}

  async getNotes(userId: number, date?: string): Promise<DailyNote[]> {
    const targetDate = date || new Date().toISOString().split('T')[0];
    return this.noteRepo.find({
      where: { user_id: userId, note_date: targetDate },
      order: { is_completed: 'ASC', created_at: 'ASC' },
      relations: ['converted_task'],
    });
  }

  async createNote(userId: number, dto: CreateDailyNoteDto): Promise<DailyNote> {
    const note_date = dto.note_date || new Date().toISOString().split('T')[0];
    const note = this.noteRepo.create({
      user_id: userId,
      content: dto.content,
      note_date,
      category: dto.category || 'scratchpad',
      reminder_time: dto.reminder_time,
      is_completed: false,
    });
    return this.noteRepo.save(note);
  }

  async updateNote(userId: number, id: number, dto: UpdateDailyNoteDto): Promise<DailyNote> {
    const note = await this.noteRepo.findOne({ where: { id, user_id: userId } });
    if (!note) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }

    if (dto.content !== undefined) note.content = dto.content;
    if (dto.is_completed !== undefined) note.is_completed = dto.is_completed;
    if (dto.category !== undefined) note.category = dto.category;
    if (dto.reminder_time !== undefined) note.reminder_time = dto.reminder_time;

    return this.noteRepo.save(note);
  }

  async toggleComplete(userId: number, id: number): Promise<DailyNote> {
    const note = await this.noteRepo.findOne({ where: { id, user_id: userId } });
    if (!note) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }
    note.is_completed = !note.is_completed;
    return this.noteRepo.save(note);
  }

  async convertToTask(userId: number, noteId: number, dto: ConvertNoteToTaskDto): Promise<Task> {
    const note = await this.noteRepo.findOne({ where: { id: noteId, user_id: userId } });
    if (!note) {
      throw new NotFoundException(`Note with ID ${noteId} not found`);
    }

    // Default status: 2 (todo), Default priority: 2 (medium) or provided
    const task = this.taskRepo.create({
      project_id: dto.project_id,
      user_id: userId,
      status_id: 2, // 'todo'
      priority_id: dto.priority_id || 2, // 'medium'
      title: note.content,
      description: `Converted from daily memo note on ${note.note_date}`,
      estimated_hours: dto.estimated_hours || 1,
    });

    const savedTask = await this.taskRepo.save(task);

    // Link note to task and mark as completed
    note.converted_task_id = savedTask.id;
    note.is_completed = true;
    await this.noteRepo.save(note);

    return savedTask;
  }

  async deleteNote(userId: number, id: number): Promise<void> {
    const result = await this.noteRepo.delete({ id, user_id: userId });
    if (result.affected === 0) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }
  }
}
