<script setup lang="ts">
import { ref } from 'vue';
import { useTaskStore } from '~/stores/useTaskStore';

const props = defineProps<{ isOpen: boolean }>();
const emit = defineEmits(['close']);
const store = useTaskStore();

const standupText = ref('');
const isGenerating = ref(false);
const isCopied = ref(false);

const generate = async () => {
  isGenerating.value = true;
  standupText.value = await store.generateStandup();
  isGenerating.value = false;
};

const copyToClipboard = async () => {
  if (!standupText.value) return;
  await navigator.clipboard.writeText(standupText.value);
  isCopied.value = true;
  setTimeout(() => {
    isCopied.value = false;
  }, 2500);
};

// Auto generate when opened
watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      generate();
    }
  }
);
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
  >
    <div
      class="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
    >
      <!-- Modal Header -->
      <div class="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="text-xl">🚀</span>
          <div>
            <h3 class="font-bold text-slate-100">Daily Standup Assistant</h3>
            <p class="text-xs text-slate-400">สร้างรายงานประจำวัน (Yesterday / Today / Blockers) อัตโนมัติ</p>
          </div>
        </div>
        <button
          @click="emit('close')"
          class="text-slate-400 hover:text-slate-100 text-lg p-1 rounded-lg hover:bg-slate-800"
        >
          ✕
        </button>
      </div>

      <!-- Modal Body -->
      <div class="p-6 flex-1 overflow-y-auto">
        <div v-if="isGenerating" class="text-center py-12 text-slate-400 text-sm">
          ⏳ กำลังประมวลผลข้อมูลงานและโน้ตประจำวัน...
        </div>
        <div v-else>
          <div class="flex justify-between items-center mb-2">
            <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Markdown Preview (Ready for Slack / Teams)
            </span>
            <button
              @click="generate"
              class="text-xs text-indigo-400 hover:text-indigo-300 underline"
            >
              🔄 Refresh สรุปใหม่
            </button>
          </div>
          <textarea
            v-model="standupText"
            rows="12"
            class="w-full font-mono text-xs p-4 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          ></textarea>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="px-6 py-4 border-t border-slate-800 bg-slate-900/50 flex justify-between items-center">
        <span class="text-xs text-slate-500">
          คัดลอกแล้วนำไปแปะในแชททีมได้ทันที
        </span>
        <div class="flex gap-2">
          <button
            @click="emit('close')"
            class="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 rounded-xl hover:bg-slate-800 transition-all"
          >
            ปิด
          </button>
          <button
            @click="copyToClipboard"
            class="px-5 py-2 text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl shadow-lg transition-all flex items-center gap-1.5"
          >
            <span>{{ isCopied ? '✓ คัดลอกสำเร็จ!' : '📋 Copy for Slack / Teams' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
