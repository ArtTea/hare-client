import { createRouter, createWebHashHistory } from 'vue-router'
const Layout = () => import('@/views/layout.vue')
const Home = () => import('@/views/home/home.vue')
const TopCategory = () => import('@/views/category/topcategory.vue')
const SubCategory = () => import('@/views/category/subcategory.vue')
const routes = [
  // 一级路由布置
  {
    path: '/',
    component: Layout,
    children: [
      { path: '/', component: Home },
      { path: '/category/:id', component: TopCategory },
      { path: '/category/sub/:id', component: SubCategory }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  // 每次切换滚回到页面顶部
  scrollBehavior () {
    // 始终滚动到顶部
    return { left: 0, top: 0 }
  }
})

export default router
