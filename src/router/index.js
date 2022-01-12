import { createRouter, createWebHashHistory } from 'vue-router'
const Layout = () => import('@/views/layout.vue')
const Home = () => import('@/views/home/home.vue')
const routes = [
  // 一级路由布置
  {
    path: '/',
    component: Layout,
    children: [
      { path: '/', component: Home }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
