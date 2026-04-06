import { createRouter, createWebHistory } from 'vue-router'
import Landing from '@/views/Landing.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Landing',
      component: Landing
    },
    {
      path: '/diagnostic',
      name: 'Diagnostic',
      component: () => import('@/views/DiagnosticView.vue')
    }
  ],
  scrollBehavior(to) {
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  }
})

export default router
