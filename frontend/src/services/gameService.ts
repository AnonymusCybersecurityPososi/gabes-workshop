import { baseApi } from '../api/baseApi';
import type { CreateGamePayload, Game } from '../types/game';

class GameService {
  async getAll(genre?: string): Promise<Game[]> {
    const params = genre && genre !== 'All' ? { genre } : undefined;
    const response = await baseApi.get<Game[]>('/games', { params });
    return response.data;
  }

  async getById(id: string): Promise<Game> {
    const response = await baseApi.get<Game>(`/games/${id}`);
    return response.data;
  }

  async create(payload: CreateGamePayload): Promise<Game> {
    const response = await baseApi.post<Game>('/games', payload);
    return response.data;
  }

  async updateDiscount(id: string, discount: number): Promise<Game> {
    const response = await baseApi.patch<Game>(`/games/${id}/discount`, {
      discount,
    });
    return response.data;
  }

  async remove(id: string): Promise<void> {
    await baseApi.delete(`/games/${id}`);
  }
}

export const gameService = new GameService();