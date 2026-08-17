import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/Home.vue'),
      alias: '/home'
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/LoginPage.vue')
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/views/RegisterPage.vue')
    },
     {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('@/views/DashboardPage.vue')
    },
    {
      path: '/profile',
      name: '/Profile',
      component: () => import('@/views/ProfilePage.vue')
    }
  ],
})

export default router
