<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { Plus, Filter, AlertTriangle } from 'lucide-vue-next';
import { useGames } from '../composables/useGames';
import GameCard from '../components/GameCard.vue';
import CreateGameModal from '../components/CreateGameModal.vue';
import type { CreateGamePayload } from '../types/game';

const router = useRouter();
const { games, isLoading, error, fetchGames, createGame, updateGameDiscount, deleteGame } =
  useGames();

const selectedGenre = ref('All');
const isModalOpen = ref(false);

const genres = [
  'All',
  'RPG',
  'Roguelike',
  'Metroidvania',
  'Platformer',
  'Strategy',
  'Horror',
];

onMounted(() => {
  fetchGames();
});

watch(selectedGenre, (newGenre) => {
  fetchGames(newGenre);
});

function openGame(id: string) {
  router.push({ name: 'GameDetail', params: { id } });
}

async function handleCreateGame(payload: CreateGamePayload) {
  const ok = await createGame(payload);
  if (ok) {
    isModalOpen.value = false;
    if (selectedGenre.value !== 'All' && selectedGenre.value !== payload.genre) {
      selectedGenre.value = 'All';
    }
  }
}
</script>

<template>
  <section class="flex flex-col gap-6">
    <div
      class="flex flex-wrap items-center justify-between gap-4 bg-base-100 p-4 rounded-box border border-base-300"
    >
      <div class="flex items-center gap-3">
        <Filter class="w-5 h-5 text-primary" />
        <select v-model="selectedGenre" class="select select-bordered select-sm">
          <option v-for="g in genres" :key="g" :value="g">
            {{ g === 'All' ? 'Усі жанри' : g }}
          </option>
        </select>
      </div>

      <button class="btn btn-primary btn-sm gap-2" @click="isModalOpen = true">
        <Plus class="w-4 h-4" />
        Додати гру
      </button>
    </div>

    <div v-if="isLoading" class="flex justify-center py-16">
      <span class="loading loading-ring loading-lg text-primary"></span>
    </div>

    <div v-else-if="error" class="alert alert-error">
      <AlertTriangle class="w-5 h-5" />
      <span>{{ error }}</span>
    </div>

    <div
      v-else-if="games.length === 0"
      class="text-center py-16 bg-base-100 rounded-box border border-base-300"
    >
      <p class="text-lg opacity-70">Ігор за обраним фільтром не знайдено</p>
    </div>

    <TransitionGroup
      v-else
      name="list"
      tag="div"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <GameCard
        v-for="game in games"
        :key="game.id"
        :game="game"
        @open="openGame"
        @update-discount="updateGameDiscount"
        @delete="deleteGame"
      />
    </TransitionGroup>

    <CreateGameModal
      :is-open="isModalOpen"
      @close="isModalOpen = false"
      @submit="handleCreateGame"
    />
  </section>
</template>