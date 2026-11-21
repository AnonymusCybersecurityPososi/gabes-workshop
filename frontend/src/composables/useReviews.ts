import { ref } from 'vue';
import { reviewService } from '../services/reviewService';
import { useToast } from './useToast';
import type { CreateReviewPayload, Review } from '../types/game';

export function useReviews() {
  const reviews = ref<Review[]>([]);
  const isLoadingReviews = ref(false);
  const reviewsError = ref<string | null>(null);
  const { showToast } = useToast();

  async function fetchReviews(gameId: string) {
    isLoadingReviews.value = true;
    reviewsError.value = null;
    try {
      reviews.value = await reviewService.getByGameId(gameId);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load reviews';
      reviewsError.value = msg;
      showToast(msg, 'error');
    } finally {
      isLoadingReviews.value = false;
    }
  }

  async function addReview(
    gameId: string,
    payload: CreateReviewPayload
  ): Promise<boolean> {
    try {
      const created = await reviewService.create(gameId, payload);
      reviews.value.unshift(created);
      showToast('Відгук опубліковано', 'success');
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to post review';
      showToast(msg, 'error');
      return false;
    }
  }

  async function deleteReview(reviewId: string): Promise<boolean> {
    try {
      await reviewService.remove(reviewId);
      reviews.value = reviews.value.filter((r) => r.id !== reviewId);
      showToast('Відгук видалено', 'success');
      return true;
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Failed to delete review';
      showToast(msg, 'error');
      return false;
    }
  }

  return {
    reviews,
    isLoadingReviews,
    reviewsError,
    fetchReviews,
    addReview,
    deleteReview,
  };
}