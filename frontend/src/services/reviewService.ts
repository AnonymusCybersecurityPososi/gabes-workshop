import { baseApi } from '../api/baseApi';
import type { CreateReviewPayload, Review } from '../types/game';

class ReviewService {
  async getByGameId(gameId: string): Promise<Review[]> {
    const response = await baseApi.get<Review[]>(`/games/${gameId}/reviews`);
    return response.data;
  }

  async create(gameId: string, payload: CreateReviewPayload): Promise<Review> {
    const response = await baseApi.post<Review>(
      `/games/${gameId}/reviews`,
      payload
    );
    return response.data;
  }

  async remove(reviewId: string): Promise<void> {
    await baseApi.delete(`/reviews/${reviewId}`);
  }
}

export const reviewService = new ReviewService();