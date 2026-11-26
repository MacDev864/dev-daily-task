<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useTaskStore } from '~/stores/useTaskStore';

const store = useTaskStore();
const isStandupModalOpen = ref(false);
const blockersInput = ref('');
const isSavingBlockers = ref(false);

onMounted(async () => {
  await store.fetchInitialData();
  if (store.dailyLog) {
    blockersInput.value = store.dailyLog.blockers || '';
  }
});

const handleSaveBlockers = async () => {
  isSavingBlockers.value = true;
  await store.updateBlockers(blockersInput.value);
  isSavingBlockers.value = false;
};
</script>

<template>
  <div class="space-y-6">
    <!-- Focus Header -->
    <div class="bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
          <span>🎯</span> Today's Developer Focus
        </div>
        <h1 class="text-2xl font-bold text-white tracking-tight">
          วางแผนและบันทึกงานประจำวัน
        </h1>
        <p class="text-xs text-slate-400 mt-1">
          วันที่: <span class="font-mono text-slate-200">{{ store.currentDate }}</span> • เวลาประมาณการรวม:
          <span class="font-mono text-amber-400 font-semibold">{{ store.totalEstimatedHours }} ชม.</span>
        </p>
      </div>

      <div class="flex items-center gap-3">
        <button
          @click="isStandupModalOpen = true"
          class="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 transform active:scale-95"
        >
          <span>🚀</span>
          <span>Generate Daily Standup</span>
        </button>
      </div>
    </div>

    <!-- Quick Task Creation -->
    <QuickTaskInput />

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Left Column: Daily Scratchpad & Memory Notes (5 cols) -->
      <div class="lg:col-span-5 space-y-6">
        <DailyNotesWidget />

        <!-- Blockers / Obstacles Section -->
        <div class="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-xl backdrop-blur-sm">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2">
              <span class="text-base">⚠️</span>
              <div>
                <h3 class="text-sm font-semibold text-slate-100">ปัญหาและอุปสรรค (Blockers)</h3>
                <p class="text-[11px] text-slate-400">บันทึกสิ่งที่กำลังติดขัดอยู่ เพื่อรายงานใน Standup</p>
              </div>
            </div>
            <button
              @click="handleSaveBlockers"
              :disabled="isSavingBlockers"
              class="px-3 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs rounded-lg transition-all"
            >
              {{ isSavingBlockers ? 'กำลังบันทึก...' : 'บันทึก' }}
            </button>
          </div>
          <textarea
            v-model="blockersInput"
            rows="3"
            placeholder="เช่น รอ API key จาก DevOps, รอ Review PR จาก Lead..."
            class="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-500/50"
          ></textarea>
        </div>
      </div>

      <!-- Right Column: Today's Tasks Checklist (7 cols) -->
      <div class="lg:col-span-7">
        <div class="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-xl backdrop-blur-sm">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <span class="text-base">📋</span>
              <div>
                <h2 class="text-base font-semibold text-slate-100">รายการงานวันนี้ (Today's Tasks)</h2>
                <p class="text-xs text-slate-400">งานที่อยู่ในสถานะ Todo, In Progress หรือ Done</p>
              </div>
            </div>
            <NuxtLink
              to="/board"
              class="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
            >
              <span>ไปที่ Kanban Board</span>
              <span>➔</span>
            </NuxtLink>
          </div>

          <!-- Tasks List -->
          <div v-if="store.todayTasks.length === 0" class="text-center py-12 text-slate-500 text-xs">
            ยังไม่มีงานสำหรับวันนี้ คลิกสร้างงานด่วนด้านบน หรือแปลงจากบันทึกช่วยจำได้ทันที
          </div>
          <div v-else class="space-y-3 max-h-[550px] overflow-y-auto pr-1">
            <TaskCard
              v-for="task in store.todayTasks"
              :key="task.id"
              :task="task"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Standup Modal -->
    <DailyStandupModal
      :is-open="isStandupModalOpen"
      @close="isStandupModalOpen = false"
    />
  </div>
</template>
