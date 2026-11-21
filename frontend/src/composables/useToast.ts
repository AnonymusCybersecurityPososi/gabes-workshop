import { ref } from 'vue';

export interface ToastItem {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

const toasts = ref<ToastItem[]>([]);
let nextId = 1;

export function useToast() {
  function showToast(
    message: string,
    type: 'success' | 'error' | 'info' = 'info'
  ) {
    const id = nextId++;
    toasts.value.push({ id, message, type });
    setTimeout(() => {
      toasts.value = toasts.value.filter((t) => t.id !== id);
    }, 3500);
  }

  function dismissToast(id: number) {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  }

  return {
    toasts,
    showToast,
    dismissToast,
  };
}