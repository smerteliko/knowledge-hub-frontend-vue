// src/router/index.ts (сокращено)

import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Auth/LoginView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/Auth/RegisterView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/create/note',
      name: 'create-note',
      component: () => import('../views/Content/CreateNoteView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/create/link',
      name: 'create-link',
      component: () => import('../views/Content/CreateLinkView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/Profile/ProfileView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/edit/:id',
      name: 'edit-content',
      component: () => import('../views/Content/EditContentView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/item/:id',
      name: 'item-detail',
      component: () => import('../views/Content/DetailView.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.meta.requiresAuth

  if (requiresAuth && !authStore.isLoggedIn) {
    next('/login')
  } else if ((to.name === 'login' || to.name === 'register') && authStore.isLoggedIn) {
    next({ name: 'dashboard' })
  } else {
    next()
  }
})

export default router
