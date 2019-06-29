import Vue from 'vue'
import Router from 'vue-router'
import nprogress from 'nprogress'
import { getUser } from '@/utils/auth'

Vue.use(Router)
const router = new Router({
  routes: [
    {
      path: '/',
      component: () => import('@/views/layout'),
      children: [
        {
          name: 'home',
          path: '',
          component: () => import('@/views/home')
        },
        {
          name: 'publish',
          path: '/publish',
          component: () => import('@/views/publish')
        },
        {
          name: 'article',
          path: '/article',
          component: () => import('@/views/article')
        }
      ]
    },
    {
      name: 'login',
      path: '/login',
      component: () => import('@/views/login')
    }
  ]
})
router.beforeEach((to, from, next) => {
  nprogress.start()
  // const userInfo = window.localStorage.getItem('user_info')
  const userInfo = getUser()
  if (to.path !== '/login') {
    if (!userInfo) {
      if (from.path === '/login') {
        nprogress.done()
      }
      next({ name: 'login' })
    } else {
      next()
    }
  } else {
    if (!userInfo) {
      next()
    } else {
      window.location.href = '/#/'
      window.location.reload()
    }
  }
})
router.afterEach((to, from) => {
  nprogress.done()
})
export default router
