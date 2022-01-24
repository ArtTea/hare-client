import { createRouter, createWebHashHistory } from 'vue-router'
const Layout = () => import('@/views/layout.vue')
const Home = () => import('@/views/home/home.vue')
const TopCategory = () => import('@/views/category/topcategory.vue')
const SubCategory = () => import('@/views/category/subcategory.vue')
const Goods = () => import('@/views/goods/goods.vue')
const Cart = () => import('@/views/cart/cart.vue')

const Login = () => import('@/views/login/login.vue')
const routes = [
  // 一级路由布置
  {
    path: '/',
    component: Layout,
    children: [
      { path: '/', component: Home },
      { path: '/category/:id', component: TopCategory },
      { path: '/category/sub/:id', component: SubCategory },
      { path: '/product/:id', component: Goods },
      // 商品详情
      { path: '/goods/:id', component: Goods },
      { path: '/cart', component: Cart }
    ]
  },
  { path: '/login', component: Login }
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
