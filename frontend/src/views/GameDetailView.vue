<script setup lang="ts">
import { computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  Clock,
  Trash2,
  AlertTriangle,
} from 'lucide-vue-next';
import { useGames } from '../composables/useGames';
import { useReviews } from '../composables/useReviews';
import RatingBadge from '../components/RatingBadge.vue';
import ReviewForm from '../components/ReviewForm.vue';
import type { CreateReviewPayload } from '../types/game';

const route = useRoute();
const router = useRouter();

const { selectedGame, isLoading, error, fetchGameById } = useGames();
const { reviews, isLoadingReviews, fetchReviews, addReview, deleteReview } =
  useReviews();

const finalPrice = computed(() => {
  if (!selectedGame.value) return '0.00';
  const discounted =
    selectedGame.value.price * (1 - selectedGame.value.discount / 100);
  return discounted.toFixed(2);
});

watch(
  () => route.params.id,
  (newId) => {
    if (typeof newId === 'string' && newId) {
      fetchGameById(newId);
      fetchReviews(newId);
    }
  },
  { immediate: true }
);

async function handleAddReview(payload: CreateReviewPayload) {
  const id = String(route.params.id);
  const ok = await addReview(id, payload);
  if (ok) {
    await fetchGameById(id);
  }
}

async function handleDeleteReview(reviewId: string) {
  const id = String(route.params.id);
  const ok = await deleteReview(reviewId);
  if (ok) {
    await fetchGameById(id);
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
</script>

<template>
  <section class="flex flex-col gap-6">
    <div>
      <button
        class="btn btn-ghost btn-sm gap-2"
        @click="router.push({ name: 'Catalog' })"
      >
        <ArrowLeft class="w-4 h-4" />
        Назад до каталогу
      </button>
    </div>

    <div v-if="isLoading && !selectedGame" class="flex justify-center py-16">
      <span class="loading loading-ring loading-lg text-primary"></span>
    </div>

    <div v-else-if="error && !selectedGame" class="alert alert-error">
      <AlertTriangle class="w-5 h-5" />
      <span>{{ error }}</span>
    </div>

    <template v-else-if="selectedGame">
      <div
        class="card lg:card-side bg-base-100 shadow-lg border border-base-300 overflow-hidden"
      >
        <figure class="lg:w-1/2 bg-base-300">
          <img
            :src="selectedGame.image_url"
            :alt="selectedGame.title"
            class="w-full h-full object-cover min-h-64"
          />
        </figure>
        <div class="card-body lg:w-1/2 gap-4">
          <div class="flex items-center justify-between gap-2">
            <span class="badge badge-neutral">{{ selectedGame.genre }}</span>
            <span class="text-sm opacity-70">{{ selectedGame.developer }}</span>
          </div>

          <h1 class="text-3xl font-bold">{{ selectedGame.title }}</h1>

          <RatingBadge
            :status="selectedGame.rating_status"
            :count="selectedGame.review_count"
            :percentage="selectedGame.positive_percentage"
          />

          <p class="text-sm leading-relaxed opacity-85">
            {{ selectedGame.description }}
          </p>

          <div class="mt-auto pt-4 border-t border-base-300 flex items-center gap-3">
            <template v-if="selectedGame.discount > 0">
              <span class="badge badge-accent badge-lg font-bold">
                -{{ selectedGame.discount }}%
              </span>
              <span class="line-through text-sm opacity-60">
                ${{ selectedGame.price.toFixed(2) }}
              </span>
              <span class="text-2xl font-bold text-accent">${{ finalPrice }}</span>
            </template>
            <template v-else>
              <span class="text-2xl font-bold">
                ${{ selectedGame.price.toFixed(2) }}
              </span>
            </template>
          </div>
        </div>
      </div>

      <ReviewForm @submit="handleAddReview" />

      <div class="flex flex-col gap-4">
        <h2 class="text-xl font-bold">
          Відгуки гравців ({{ reviews.length }})
        </h2>

        <div v-if="isLoadingReviews" class="flex justify-center py-8">
          <span class="loading loading-spinner loading-md text-primary"></span>
        </div>

        <div
          v-else-if="reviews.length === 0"
          class="bg-base-100 border border-base-300 rounded-box p-6 text-center opacity-70"
        >
          Поки що немає жодного відгуку. Станьте першим!
        </div>

        <TransitionGroup v-else name="list" tag="div" class="flex flex-col gap-3">
          <div
            v-for="review in reviews"
            :key="review.id"
            class="card bg-base-100 border border-base-300 p-4 gap-3"
          >
            <div class="flex items-center justify-between flex-wrap gap-2">
              <div class="flex items-center gap-3">
                <span
                  class="badge gap-1"
                  :class="review.is_recommended ? 'badge-success' : 'badge-error'"
                >
                  <ThumbsUp v-if="review.is_recommended" class="w-3.5 h-3.5" />
                  <ThumbsDown v-else class="w-3.5 h-3.5" />
                  {{ review.is_recommended ? 'Рекомендую' : 'Не рекомендую' }}
                </span>
                <span class="font-bold">{{ review.author }}</span>
                <span class="text-xs opacity-70 flex items-center gap-1">
                  <Clock class="w-3.5 h-3.5" />
                  {{ review.hours_played }} год.
                </span>
              </div>

              <div class="flex items-center gap-3">
                <span class="text-xs opacity-60">
                  {{ formatDate(review.created_at) }}
                </span>
                <button
                  class="btn btn-ghost btn-xs text-error"
                  title="Видалити відгук"
                  @click="handleDeleteReview(review.id)"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </div>

            <p class="text-sm opacity-90">{{ review.text }}</p>
          </div>
        </TransitionGroup>
      </div>
    </template>
  </section>
</template>