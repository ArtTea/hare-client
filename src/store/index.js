import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import cart from './modules/cart.js'
import user from './modules/user.js'
import caregory from './modules/caregory.js'
export default createStore({
  modules: {
    caregory,
    user,
    cart
  },
  plugins: [
    // 默认存储在localstorage
    createPersistedState({
    // 指定本地储存的名字
      key: 'eribbit-client-pc-store',
      // 指定要缓存的模块
      paths: ['user', 'cart']
    })
  ]
})
