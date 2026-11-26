<script setup lang="ts">
import { ref } from 'vue';

const isStandupModalOpen = ref(false);
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
    <!-- Top Navigation Bar -->
    <header class="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <!-- Logo -->
        <div class="flex items-center gap-6">
          <NuxtLink to="/" class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center shadow-lg font-bold text-white text-base">
              ⚡
            </div>
            <div>
              <span class="font-extrabold text-base tracking-tight text-white">DevTasks</span>
              <span class="text-[10px] ml-1.5 px-2 py-0.5 rounded-full bg-slate-800 text-amber-400 font-mono border border-amber-500/20">
                DAILY LOG
              </span>
            </div>
          </NuxtLink>

          <!-- Nav Links -->
          <nav class="hidden sm:flex items-center gap-1 text-xs font-semibold">
            <NuxtLink
              to="/"
              class="px-3.5 py-2 rounded-xl transition-all"
              active-class="bg-slate-800 text-amber-400 border border-slate-700/60"
            >
              📅 Today's Workspace
            </NuxtLink>
            <NuxtLink
              to="/board"
              class="px-3.5 py-2 rounded-xl transition-all text-slate-400 hover:text-slate-200"
              active-class="bg-slate-800 text-amber-400 border border-slate-700/60"
            >
              📊 Kanban Board
            </NuxtLink>
          </nav>
        </div>

        <!-- Right User / Status Actions -->
        <div class="flex items-center gap-3">
          <div class="hidden md:flex items-center gap-2 text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>MSSQL Connected</span>
          </div>

          <div class="flex items-center gap-2 pl-2 border-l border-slate-800 text-xs">
            <div class="w-7 h-7 rounded-full bg-indigo-600/40 border border-indigo-500/50 flex items-center justify-center font-bold text-indigo-300">
              D1
            </div>
            <span class="hidden sm:inline font-medium text-slate-300">Developer One</span>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content Container -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
      <NuxtPage />
    </main>

    <!-- Footer -->
    <footer class="border-t border-slate-800/60 py-6 text-center text-xs text-slate-500">
      Developer Daily Task & Standup Work Log • Nuxt 3 + NestJS + Microsoft SQL Server
    </footer>
  </div>
</template>
