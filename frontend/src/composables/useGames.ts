import { ref } from 'vue';
import { gameService } from '../services/gameService';
import { useToast } from './useToast';
import type { CreateGamePayload, Game } from '../types/game';

export function useGames() {
  const games = ref<Game[]>([]);
  const selectedGame = ref<Game | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const { showToast } = useToast();

  async function fetchGames(genre?: string) {
    isLoading.value = true;
    error.value = null;
    try {
      games.value = await gameService.getAll(genre);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error loading games';
      error.value = msg;
      showToast(msg, 'error');
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchGameById(id: string) {
    isLoading.value = true;
    error.value = null;
    try {
      selectedGame.value = await gameService.getById(id);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Game not found';
      error.value = msg;
      selectedGame.value = null;
      showToast(msg, 'error');
    } finally {
      isLoading.value = false;
    }
  }

  async function createGame(payload: CreateGamePayload): Promise<boolean> {
    error.value = null;
    try {
      const created = await gameService.create(payload);
      games.value.push(created);
      showToast(`Гру "${created.title}" додано до каталогу`, 'success');
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to create game';
      showToast(msg, 'error');
      return false;
    }
  }

  async function updateGameDiscount(id: string, discount: number) {
    try {
      const updated = await gameService.updateDiscount(id, discount);
      games.value = games.value.map((g) => (g.id === id ? updated : g));
      if (selectedGame.value?.id === id) {
        selectedGame.value = updated;
      }
      showToast(`Знижку оновлено до ${discount}%`, 'success');
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Failed to update discount';
      showToast(msg, 'error');
    }
  }

  async function deleteGame(id: string): Promise<boolean> {
    try {
      await gameService.remove(id);
      games.value = games.value.filter((g) => g.id !== id);
      if (selectedGame.value?.id === id) {
        selectedGame.value = null;
      }
      showToast('Гру та пов’язані відгуки видалено', 'success');
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to delete game';
      showToast(msg, 'error');
      return false;
    }
  }

  return {
    games,
    selectedGame,
    isLoading,
    error,
    fetchGames,
    fetchGameById,
    createGame,
    updateGameDiscount,
    deleteGame,
  };
}