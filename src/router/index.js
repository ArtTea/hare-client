import { createRouter, createWebHashHistory } from 'vue-router'
import store from '@/store'
import { h } from 'vue'
const Layout = () => import('@/views/layout.vue')
const Home = () => import('@/views/home/home.vue')
const TopCategory = () => import('@/views/category/topcategory.vue')
const SubCategory = () => import('@/views/category/subcategory.vue')
const Goods = () => import('@/views/goods/goods.vue')
const Cart = () => import('@/views/cart/cart.vue')

const Login = () => import('@/views/login/login.vue')
const CheckOut = () => import('@/views/member/pay/checkout.vue')
const Pay = () => import('@/views/member/pay/index')
const PayResult = () => import('@/views/member/pay/component/result.vue')
const MenberLayOut = () => import('@/views/member/Layout.vue')
const MenberHome = () => import('@/views/member/home/home.vue')
const MenberOrder = () => import('@/views/member/order/index.vue')
const MenberOrderDetail = () => import('@/views/member/order/detail.vue')
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
      { path: '/cart', component: Cart },
      { path: '/cart', component: Cart },
      // 支付
      { path: '/member/checkout', component: CheckOut },
      { path: '/member/pay', component: Pay },
      { path: 'pay/callback', component: PayResult },
      // 个人中心
      {
        path: '/menber',
        component: MenberLayOut,
        children: [
          { path: '/menber', component: MenberHome },
          // { path: '/menber/order', component: MenberOrder },
          // { path: '/menber/order/:id', component: MenberOrderDetail }
          {
            path: '/menber/order',
            component: { render: () => h(<router-view />) },
            children: [
              { path: '', component: MenberOrder },
              { path: ':id', component: MenberOrderDetail }
            ]
          }

        ]
      }
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

// 前置导航守卫
router.beforeEach((to, from, next) => {
  const { profile } = store.state.user
  if (!profile.token && to.path.startsWith('/member')) {
    return next('/login?redirectUrl=' + encodeURIComponent(to.path))
  }
  next()
})
export default router
