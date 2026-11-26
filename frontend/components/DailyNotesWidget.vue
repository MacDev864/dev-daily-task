<script setup lang="ts">
import { ref } from 'vue';
import { useTaskStore } from '~/stores/useTaskStore';

const store = useTaskStore();
const noteInput = ref('');
const selectedProjectForConvert = ref<number | null>(null);
const convertingNoteId = ref<number | null>(null);
const activeTab = ref<'pending' | 'completed'>('pending');

const handleAddNote = async () => {
  if (!noteInput.value.trim()) return;
  await store.createDailyNote(noteInput.value.trim());
  noteInput.value = '';
};

const handleToggle = async (id: number) => {
  await store.toggleNoteComplete(id);
};

const openConvert = (noteId: number) => {
  convertingNoteId.value = noteId;
  selectedProjectForConvert.value = store.projects[0]?.id || null;
};

const handleConvert = async (noteId: number) => {
  if (!selectedProjectForConvert.value) return;
  await store.convertNoteToTask(noteId, selectedProjectForConvert.value);
  convertingNoteId.value = null;
};
</script>

<template>
  <div class="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-xl backdrop-blur-sm">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center space-x-2">
        <div class="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm">
          📝
        </div>
        <div>
          <h2 class="text-base font-semibold text-slate-100">บันทึกช่วยจำ / สิ่งที่ต้องทำประจำวัน</h2>
          <p class="text-xs text-slate-400">Daily Scratchpad & Quick Reminders (กันลืม)</p>
        </div>
      </div>
      <span class="text-xs px-2.5 py-1 rounded-full bg-slate-700/70 text-slate-300 font-medium">
        {{ store.pendingNotes.length }} ค้างอยู่
      </span>
    </div>

    <!-- Quick Add Input -->
    <div class="mb-4">
      <form @submit.prevent="handleAddNote" class="flex gap-2">
        <input
          v-model="noteInput"
          type="text"
          placeholder="พิมพ์บันทึกกันลืมสั้นๆ เช่น ตรวจ PR #104, เทส staging บ่ายสาม แล้วกด Enter..."
          class="flex-1 px-3.5 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
        />
        <button
          type="submit"
          :disabled="!noteInput.trim()"
          class="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-semibold text-sm rounded-xl transition-all shadow-md flex items-center gap-1.5"
        >
          <span>เพิ่ม</span>
          <span class="text-xs">↵</span>
        </button>
      </form>
    </div>

    <!-- Tabs -->
    <div class="flex items-center gap-2 border-b border-slate-700/60 pb-2 mb-3 text-xs">
      <button
        @click="activeTab = 'pending'"
        :class="[
          'px-3 py-1.5 rounded-lg transition-all font-medium',
          activeTab === 'pending'
            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
            : 'text-slate-400 hover:text-slate-200'
        ]"
      >
        สิ่งที่ต้องทำ ({{ store.pendingNotes.length }})
      </button>
      <button
        @click="activeTab = 'completed'"
        :class="[
          'px-3 py-1.5 rounded-lg transition-all font-medium',
          activeTab === 'completed'
            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
            : 'text-slate-400 hover:text-slate-200'
        ]"
      >
        ทำเสร็จแล้ว ({{ store.completedNotes.length }})
      </button>
    </div>

    <!-- Notes List -->
    <div class="space-y-2 max-h-72 overflow-y-auto pr-1">
      <div
        v-if="(activeTab === 'pending' ? store.pendingNotes : store.completedNotes).length === 0"
        class="text-center py-6 text-xs text-slate-500"
      >
        {{ activeTab === 'pending' ? 'ไม่มีบันทึกค้างอยู่ สามารถพิมพ์เพิ่มได้เลย' : 'ยังไม่มีบันทึกที่ทำเสร็จ' }}
      </div>

      <div
        v-for="note in (activeTab === 'pending' ? store.pendingNotes : store.completedNotes)"
        :key="note.id"
        class="group flex items-start justify-between gap-3 p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 transition-all"
      >
        <div class="flex items-start gap-2.5 flex-1 min-w-0">
          <input
            type="checkbox"
            :checked="note.is_completed"
            @change="handleToggle(note.id)"
            class="mt-1 w-4 h-4 rounded text-amber-500 bg-slate-800 border-slate-700 focus:ring-0 focus:ring-offset-0 cursor-pointer"
          />
          <div class="flex-1">
            <span
              :class="[
                'text-sm transition-all',
                note.is_completed ? 'line-through text-slate-500' : 'text-slate-200'
              ]"
            >
              {{ note.content }}
            </span>
            <div v-if="note.converted_task_id" class="text-[10px] text-emerald-400/80 mt-0.5">
              ✓ แปลงเป็น Task แล้ว (#{{ note.converted_task_id }})
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center gap-1.5 opacity-80 group-hover:opacity-100">
          <button
            v-if="!note.converted_task_id && !note.is_completed"
            @click="openConvert(note.id)"
            title="แปลงเป็น Task ทางการ"
            class="px-2 py-1 text-[11px] rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 transition-all"
          >
            ➔ Task
          </button>
          <button
            @click="store.deleteDailyNote(note.id)"
            title="ลบ"
            class="p-1 text-slate-500 hover:text-rose-400 transition-all rounded"
          >
            ✕
          </button>
        </div>

        <!-- Inline Convert Modal/Dropdown -->
        <div
          v-if="convertingNoteId === note.id"
          class="w-full mt-2 p-2.5 bg-slate-800 rounded-lg border border-indigo-500/40 text-xs"
        >
          <div class="font-medium text-indigo-300 mb-1.5">เลือกโปรเจกต์สำหรับสร้าง Task:</div>
          <div class="flex gap-2">
            <select
              v-model="selectedProjectForConvert"
              class="flex-1 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs"
            >
              <option v-for="p in store.projects" :key="p.id" :value="p.id">
                [{{ p.code }}] {{ p.name }}
              </option>
            </select>
            <button
              @click="handleConvert(note.id)"
              class="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-medium"
            >
              ยืนยัน
            </button>
            <button
              @click="convertingNoteId = null"
              class="px-2 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded"
            >
              ยกเลิก
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
