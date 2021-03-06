import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import UI from '@/components/library/index.js'
// 1.重置样式库
import 'normalize.css'

// 2.自己项目的重置样和公共样式表
import '@/assets/style/common.less'
// 导入模拟接口Mockjs
import '@/mock'
createApp(App).use(store).use(router).use(UI).mount('#app')
