<script setup lang="ts">
import { reactive, ref } from 'vue';
import { ThumbsUp, ThumbsDown, Send } from 'lucide-vue-next';
import type { CreateReviewPayload } from '../types/game';

const emit = defineEmits<{
  submit: [payload: CreateReviewPayload];
}>();

const form = reactive<CreateReviewPayload>({
  author: '',
  is_recommended: true,
  hours_played: 1,
  text: '',
});

const validationError = ref('');

function handleSubmit() {
  if (!form.author.trim()) {
    validationError.value = 'Введіть ваш нікнейм';
    return;
  }
  if (!form.text.trim()) {
    validationError.value = 'Напишіть текст відгуку';
    return;
  }
  if (form.hours_played < 0 || Number.isNaN(form.hours_played)) {
    validationError.value = 'Кількість годин не може бути від’ємною';
    return;
  }

  validationError.value = '';
  emit('submit', { ...form });
  form.author = '';
  form.hours_played = 1;
  form.text = '';
  form.is_recommended = true;
}
</script>

<template>
  <form
    class="card bg-base-100 border border-base-300 p-5 flex flex-col gap-4"
    @submit.prevent="handleSubmit"
  >
    <h3 class="text-lg font-bold">Написати відгук</h3>

    <div v-if="validationError" class="alert alert-error text-sm py-2">
      {{ validationError }}
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <label class="form-control">
        <span class="label-text text-sm mb-1">Нікнейм автора *</span>
        <input
          v-model="form.author"
          type="text"
          class="input input-bordered w-full"
          placeholder="PlayerOne"
          required
        />
      </label>

      <label class="form-control">
        <span class="label-text text-sm mb-1">Награно годин *</span>
        <input
          v-model.number="form.hours_played"
          type="number"
          step="0.5"
          min="0"
          class="input input-bordered w-full"
          required
        />
      </label>
    </div>

    <div class="flex items-center gap-3">
      <button
        type="button"
        class="btn btn-sm gap-2"
        :class="form.is_recommended ? 'btn-success' : 'btn-outline'"
        @click="form.is_recommended = true"
      >
        <ThumbsUp class="w-4 h-4" />
        Рекомендую
      </button>
      <button
        type="button"
        class="btn btn-sm gap-2"
        :class="!form.is_recommended ? 'btn-error' : 'btn-outline'"
        @click="form.is_recommended = false"
      >
        <ThumbsDown class="w-4 h-4" />
        Не рекомендую
      </button>
    </div>

    <label class="form-control">
      <span class="label-text text-sm mb-1">Текст огляду *</span>
      <textarea
        v-model="form.text"
        class="textarea textarea-bordered w-full"
        rows="3"
        placeholder="Поділіться враженнями від гри..."
        required
      ></textarea>
    </label>

    <div class="flex justify-end">
      <button type="submit" class="btn btn-primary gap-2">
        <Send class="w-4 h-4" />
        Опублікувати
      </button>
    </div>
  </form>
</template>