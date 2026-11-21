<script setup lang="ts">
import { Gamepad2 } from 'lucide-vue-next';
import ToastContainer from './components/ToastContainer.vue';
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <header class="navbar bg-base-100 border-b border-base-300 px-6">
      <div class="max-w-6xl w-full mx-auto flex items-center justify-between">
        <RouterLink
          :to="{ name: 'Catalog' }"
          class="flex items-center gap-2 text-xl font-bold text-primary"
        >
          <Gamepad2 class="w-6 h-6" />
          <span>Gabe's Workshop</span>
        </RouterLink>
        <span class="text-xs opacity-60">Indie Store & Reviews</span>
      </div>
    </header>

    <main class="max-w-6xl w-full mx-auto p-6 flex-1">
      <RouterView />
    </main>

    <ToastContainer />
  </div>
</template>