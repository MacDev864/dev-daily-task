<script setup lang="ts">
import { ref } from 'vue';
import { useTaskStore } from '~/stores/useTaskStore';

const store = useTaskStore();
const title = ref('');
const selectedProjectId = ref<number | null>(null);
const selectedPriorityId = ref<number>(2); // 2 = medium
const estimatedHours = ref<number>(1);
const isExpanded = ref(false);

const handleCreate = async () => {
  if (!title.value.trim()) return;
  const projectId = selectedProjectId.value || store.projects[0]?.id;
  if (!projectId) return;

  await store.createTask({
    project_id: projectId,
    title: title.value.trim(),
    priority_id: selectedPriorityId.value,
    status_id: 2, // 2 = todo
    estimated_hours: estimatedHours.value,
  });

  title.value = '';
  isExpanded.value = false;
};
</script>

<template>
  <div class="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 shadow-lg backdrop-blur-sm">
    <div class="flex items-center justify-between mb-3">
      <span class="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
        <span>⚡</span> สร้างงานใหม่ด่วน (Quick Task)
      </span>
      <button
        @click="isExpanded = !isExpanded"
        class="text-xs text-indigo-400 hover:text-indigo-300"
      >
        {{ isExpanded ? 'ซ่อนตัวเลือก' : 'แสดงตัวเลือกเพิ่มเติม +' }}
      </button>
    </div>

    <form @submit.prevent="handleCreate" class="space-y-3">
      <div class="flex gap-2">
        <input
          v-model="title"
          type="text"
          placeholder="พิมพ์ชื่องานที่ต้องทำ เช่น [AUTH] สร้าง Refresh Token Endpoint..."
          class="flex-1 px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        />
        <button
          type="submit"
          :disabled="!title.trim()"
          class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl transition-all shadow-md"
        >
          สร้าง Task
        </button>
      </div>

      <!-- Expanded fields -->
      <div v-if="isExpanded" class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
        <div>
          <label class="block text-slate-400 mb-1">โปรเจกต์</label>
          <select
            v-model="selectedProjectId"
            class="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200"
          >
            <option v-for="p in store.projects" :key="p.id" :value="p.id">
              [{{ p.code }}] {{ p.name }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-slate-400 mb-1">ความสำคัญ (Priority)</label>
          <select
            v-model="selectedPriorityId"
            class="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200"
          >
            <option v-for="p in store.priorities" :key="p.id" :value="p.id">
              {{ p.code }} ({{ p.name }})
            </option>
          </select>
        </div>
        <div>
          <label class="block text-slate-400 mb-1">เวลาประมาณการ (ชม.)</label>
          <input
            v-model.number="estimatedHours"
            type="number"
            min="0.5"
            step="0.5"
            class="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200"
          />
        </div>
      </div>
    </form>
  </div>
</template>
