import { createRouter, createWebHistory } from 'vue-router';
import CatalogView from '../views/CatalogView.vue';
import GameDetailView from '../views/GameDetailView.vue';
import NotFoundView from '../views/NotFoundView.vue';

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Catalog',
      component: CatalogView,
    },
    {
      path: '/games/:id',
      name: 'GameDetail',
      component: GameDetailView,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFoundView,
    },
  ],
});