<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<template>
  <div class="flex flex-col items-center justify-center py-20 gap-4">
    <h1 class="text-5xl font-bold text-primary">404</h1>
    <p class="opacity-75">Сторінку не знайдено</p>
    <button class="btn btn-primary btn-sm" @click="router.push({ name: 'Catalog' })">
      Повернутися до каталогу
    </button>
  </div>
</template>