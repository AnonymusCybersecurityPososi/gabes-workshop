<script setup lang="ts">
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-vue-next';
import { useToast } from '../composables/useToast';

const { toasts, dismissToast } = useToast();
</script>

<template>
  <div class="toast toast-end toast-bottom z-50">
    <TransitionGroup name="list">
      <div
        v-for="item in toasts"
        :key="item.id"
        class="alert shadow-lg flex items-center gap-2"
        :class="{
          'alert-success': item.type === 'success',
          'alert-error': item.type === 'error',
          'alert-info': item.type === 'info',
        }"
      >
        <CheckCircle2 v-if="item.type === 'success'" class="w-5 h-5" />
        <AlertCircle v-else-if="item.type === 'error'" class="w-5 h-5" />
        <Info v-else class="w-5 h-5" />
        <span class="text-sm font-medium">{{ item.message }}</span>
        <button
          class="btn btn-ghost btn-xs btn-circle"
          @click="dismissToast(item.id)"
        >
          <X class="w-4 h-4" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>