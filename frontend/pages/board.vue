<script setup lang="ts">
import { onMounted } from 'vue';
import { useTaskStore } from '~/stores/useTaskStore';

const store = useTaskStore();

onMounted(async () => {
  if (store.statuses.length === 0) {
    await store.fetchInitialData();
  }
});
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white tracking-tight">Kanban Task Board</h1>
        <p class="text-xs text-slate-400 mt-0.5">
          ภาพรวมงานทั้งหมด แบ่งตามสถานะ (backlog ➔ todo ➔ in_progress ➔ in_review ➔ done)
        </p>
      </div>
      <NuxtLink
        to="/"
        class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-all flex items-center gap-1.5"
      >
        <span>⬅️ กลับหน้า Today's Workspace</span>
      </NuxtLink>
    </div>

    <!-- 5 Columns Board -->
    <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
      <div
        v-for="status in store.statuses"
        :key="status.id"
        class="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-3.5 flex flex-col min-h-[600px] shadow-lg backdrop-blur-sm"
      >
        <!-- Column Header -->
        <div class="flex items-center justify-between pb-3 mb-3 border-b border-slate-700/60">
          <div class="flex items-center gap-2">
            <span
              class="w-2.5 h-2.5 rounded-full"
              :style="{ backgroundColor: status.color }"
            ></span>
            <span class="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
              {{ status.code }}
            </span>
          </div>
          <span
            class="text-[11px] px-2 py-0.5 rounded-full font-mono font-semibold bg-slate-900 text-slate-400"
          >
            {{ store.tasksByStatus(status.id).length }}
          </span>
        </div>

        <!-- Task Cards in this column -->
        <div class="space-y-2.5 flex-1 overflow-y-auto pr-0.5">
          <div
            v-if="store.tasksByStatus(status.id).length === 0"
            class="h-32 border-2 border-dashed border-slate-800/80 rounded-xl flex items-center justify-center text-slate-600 text-xs"
          >
            ว่าง
          </div>
          <TaskCard
            v-for="task in store.tasksByStatus(status.id)"
            :key="task.id"
            :task="task"
          />
        </div>
      </div>
    </div>
  </div>
</template>
