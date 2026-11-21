<script setup lang="ts">
import { computed } from 'vue';
import { Star } from 'lucide-vue-next';
import type { RatingStatus } from '../types/game';

const props = defineProps<{
  status: RatingStatus;
  count: number;
  percentage: number;
}>();

const badgeClass = computed(() => {
  switch (props.status) {
    case 'Overwhelmingly Positive':
      return 'badge-success';
    case 'Positive':
      return 'badge-info';
    case 'Mixed':
      return 'badge-warning';
    case 'Negative':
      return 'badge-error';
    default:
      return 'badge-ghost';
  }
});
</script>

<template>
  <div class="flex items-center gap-2 flex-wrap">
    <span class="badge gap-1 font-medium" :class="badgeClass">
      <Star class="w-3 h-3" />
      {{ status }}
    </span>
    <span class="text-xs opacity-70">
      {{ count }} відг.<template v-if="count > 0"> ({{ percentage }}%)</template>
    </span>
  </div>
</template>