<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Percent, Trash2, ExternalLink } from 'lucide-vue-next';
import RatingBadge from './RatingBadge.vue';
import type { Game } from '../types/game';

const props = defineProps<{
  game: Game;
}>();

const emit = defineEmits<{
  open: [id: string];
  updateDiscount: [id: string, discount: number];
  delete: [id: string];
}>();

const localDiscount = ref(props.game.discount);
const isEditingDiscount = ref(false);

watch(
  () => props.game.discount,
  (val) => {
    localDiscount.value = val;
  }
);

const finalPrice = computed(() => {
  const discounted = props.game.price * (1 - props.game.discount / 100);
  return discounted.toFixed(2);
});

function applyDiscount() {
  const clamped = Math.min(90, Math.max(0, Number(localDiscount.value) || 0));
  emit('updateDiscount', props.game.id, clamped);
  isEditingDiscount.value = false;
}
</script>

<template>
  <div class="card bg-base-100 shadow-md border border-base-300 overflow-hidden">
    <figure class="h-44 bg-base-300 relative cursor-pointer" @click="emit('open', game.id)">
      <img
        :src="game.image_url"
        :alt="game.title"
        class="w-full h-full object-cover"
      />
      <span class="badge badge-neutral absolute top-3 left-3">
        {{ game.genre }}
      </span>
    </figure>

    <div class="card-body p-4 gap-3">
      <div>
        <h2
          class="card-title text-lg cursor-pointer hover:text-primary transition-colors"
          @click="emit('open', game.id)"
        >
          {{ game.title }}
        </h2>
        <p class="text-xs opacity-70">{{ game.developer }}</p>
      </div>

      <RatingBadge
        :status="game.rating_status"
        :count="game.review_count"
        :percentage="game.positive_percentage"
      />

      <div class="flex items-center justify-between pt-2 border-t border-base-300">
        <div class="flex items-center gap-2">
          <template v-if="game.discount > 0">
            <span class="badge badge-accent font-bold">-{{ game.discount }}%</span>
            <span class="line-through text-xs opacity-60">${{ game.price.toFixed(2) }}</span>
            <span class="text-lg font-bold text-accent">${{ finalPrice }}</span>
          </template>
          <template v-else>
            <span class="text-lg font-bold">${{ game.price.toFixed(2) }}</span>
          </template>
        </div>

        <div class="flex items-center gap-1">
          <button
            class="btn btn-ghost btn-xs"
            title="Змінити знижку"
            @click="isEditingDiscount = !isEditingDiscount"
          >
            <Percent class="w-4 h-4" />
          </button>
          <button
            class="btn btn-ghost btn-xs text-error"
            title="Видалити гру"
            @click="emit('delete', game.id)"
          >
            <Trash2 class="w-4 h-4" />
          </button>
          <button
            class="btn btn-primary btn-xs"
            @click="emit('open', game.id)"
          >
            <ExternalLink class="w-3.5 h-3.5" />
            Огляд
          </button>
        </div>
      </div>

      <div
        v-if="isEditingDiscount"
        class="flex items-center gap-2 pt-2 border-t border-base-300"
      >
        <input
          v-model.number="localDiscount"
          type="number"
          min="0"
          max="90"
          class="input input-bordered input-xs w-24"
          placeholder="0-90%"
        />
        <button class="btn btn-accent btn-xs" @click="applyDiscount">
          Зберегти
        </button>
      </div>
    </div>
  </div>
</template>