import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/result',
    name: 'Result',
    component: () => import('@/views/Result.vue')
  },
  {
    path: '/order/confirm',
    name: 'OrderConfirm',
    component: () => import('@/views/OrderConfirm.vue')
  },
  {
    path: '/orders',
    name: 'Orders',
    component: () => import('@/views/Orders.vue')
  },
  {
    path: '/error',
    name: 'Error',
    component: () => import('@/views/Error.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: '/error?code=404'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.onError((error) => {
  console.error('路由错误:', error)
  window.location.href = '/error?code=500&message=' + encodeURIComponent(error.message)
})

export default router
