<script setup lang="ts">
import { reactive, ref } from 'vue';
import { X, Plus } from 'lucide-vue-next';
import type { CreateGamePayload } from '../types/game';

defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  close: [];
  submit: [payload: CreateGamePayload];
}>();

const form = reactive<CreateGamePayload>({
  title: '',
  genre: 'RPG',
  price: 19.99,
  discount: 0,
  developer: '',
  image_url: '',
  description: '',
});

const validationError = ref('');

function resetForm() {
  form.title = '';
  form.genre = 'RPG';
  form.price = 19.99;
  form.discount = 0;
  form.developer = '';
  form.image_url = '';
  form.description = '';
  validationError.value = '';
}

function handleSubmit() {
  if (!form.title.trim()) {
    validationError.value = 'Введіть назву гри';
    return;
  }
  if (!form.genre.trim()) {
    validationError.value = 'Вкажіть жанр';
    return;
  }
  if (form.price <= 0 || Number.isNaN(form.price)) {
    validationError.value = 'Ціна має бути більшою за 0';
    return;
  }
  if (form.discount < 0 || form.discount > 90) {
    validationError.value = 'Знижка має бути від 0 до 90%';
    return;
  }

  validationError.value = '';
  emit('submit', { ...form });
  resetForm();
}
</script>

<template>
  <dialog class="modal" :class="{ 'modal-open': isOpen }">
    <div class="modal-box max-w-lg bg-base-100">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-bold text-lg">Додати нову інді-гру</h3>
        <button class="btn btn-ghost btn-sm btn-circle" @click="emit('close')">
          <X class="w-4 h-4" />
        </button>
      </div>

      <div v-if="validationError" class="alert alert-error mb-4 text-sm py-2">
        {{ validationError }}
      </div>

      <form class="flex flex-col gap-3" @submit.prevent="handleSubmit">
        <label class="form-control w-full">
          <span class="label-text text-sm mb-1">Назва гри *</span>
          <input
            v-model="form.title"
            type="text"
            class="input input-bordered w-full"
            placeholder="Celeste"
            required
          />
        </label>

        <div class="grid grid-cols-2 gap-3">
          <label class="form-control w-full">
            <span class="label-text text-sm mb-1">Жанр *</span>
            <select v-model="form.genre" class="select select-bordered w-full">
              <option value="RPG">RPG</option>
              <option value="Roguelike">Roguelike</option>
              <option value="Metroidvania">Metroidvania</option>
              <option value="Platformer">Platformer</option>
              <option value="Strategy">Strategy</option>
              <option value="Horror">Horror</option>
            </select>
          </label>

          <label class="form-control w-full">
            <span class="label-text text-sm mb-1">Розробник</span>
            <input
              v-model="form.developer"
              type="text"
              class="input input-bordered w-full"
              placeholder="Maddy Makes Games"
            />
          </label>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <label class="form-control w-full">
            <span class="label-text text-sm mb-1">Базова ціна ($) *</span>
            <input
              v-model.number="form.price"
              type="number"
              step="0.01"
              min="0.01"
              class="input input-bordered w-full"
              required
            />
          </label>

          <label class="form-control w-full">
            <span class="label-text text-sm mb-1">Знижка (0-90%)</span>
            <input
              v-model.number="form.discount"
              type="number"
              min="0"
              max="90"
              class="input input-bordered w-full"
            />
          </label>
        </div>

        <label class="form-control w-full">
          <span class="label-text text-sm mb-1">Посилання на обкладинку</span>
          <input
            v-model="form.image_url"
            type="url"
            class="input input-bordered w-full"
            placeholder="https://..."
          />
        </label>

        <label class="form-control w-full">
          <span class="label-text text-sm mb-1">Опис</span>
          <textarea
            v-model="form.description"
            class="textarea textarea-bordered w-full"
            rows="3"
            placeholder="Короткий опис гри..."
          ></textarea>
        </label>

        <div class="modal-action">
          <button type="button" class="btn btn-ghost" @click="emit('close')">
            Скасувати
          </button>
          <button type="submit" class="btn btn-primary gap-1">
            <Plus class="w-4 h-4" />
            Створити
          </button>
        </div>
      </form>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button @click="emit('close')">close</button>
    </form>
  </dialog>
</template>