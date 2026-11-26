<script setup lang="ts">
import { computed } from 'vue';
import { useTaskStore, type Task } from '~/stores/useTaskStore';

const props = defineProps<{ task: Task }>();
const store = useTaskStore();

const statusColor = computed(() => {
  return props.task.status?.color || '#94a3b8';
});

const priorityColor = computed(() => {
  return props.task.priority?.color || '#64748b';
});

const handleStatusChange = async (event: Event) => {
  const target = event.target as HTMLSelectElement;
  const newStatusId = parseInt(target.value, 10);
  await store.updateTaskStatus(props.task.id, newStatusId);
};
</script>

<template>
  <div
    class="bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 rounded-xl p-3.5 shadow-md hover:shadow-lg transition-all flex flex-col justify-between gap-3 group"
  >
    <div>
      <!-- Top Badges -->
      <div class="flex items-center justify-between gap-2 mb-2 text-[11px]">
        <span
          class="font-mono font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60"
        >
          {{ task.project?.code || 'TASK' }}
        </span>
        <span
          :style="{ color: priorityColor, borderColor: `${priorityColor}40`, backgroundColor: `${priorityColor}15` }"
          class="font-medium px-2 py-0.5 rounded border text-[10px] uppercase tracking-wide"
        >
          {{ task.priority?.code || 'medium' }}
        </span>
      </div>

      <!-- Title -->
      <h4 class="text-sm font-semibold text-slate-100 group-hover:text-amber-400 transition-colors line-clamp-2">
        {{ task.title }}
      </h4>

      <!-- Description preview if available -->
      <p v-if="task.description" class="text-xs text-slate-400 mt-1 line-clamp-1">
        {{ task.description }}
      </p>
    </div>

    <!-- Bottom metadata & Status Selector -->
    <div class="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2 text-xs">
      <div class="text-slate-400 text-[11px] flex items-center gap-1">
        <span>⏱️</span>
        <span>{{ task.estimated_hours || 0 }}h</span>
      </div>

      <!-- Quick Status Dropdown (Values are numeric IDs 1..5, labeled with lowercase code) -->
      <div class="flex items-center gap-1.5">
        <select
          :value="task.status_id"
          @change="handleStatusChange"
          :style="{ borderColor: `${statusColor}50` }"
          class="bg-slate-950 text-slate-200 border rounded-lg px-2 py-1 text-[11px] font-medium focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
        >
          <option
            v-for="s in store.statuses"
            :key="s.id"
            :value="s.id"
          >
            {{ s.code }} ({{ s.name }})
          </option>
        </select>
        <button
          @click="store.deleteTask(task.id)"
          class="text-slate-500 hover:text-rose-400 p-1 rounded"
          title="ลบ Task"
        >
          ✕
        </button>
      </div>
    </div>
  </div>
</template>
