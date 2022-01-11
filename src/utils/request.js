// 1.创建一个新的axios实例

// 导入axios包
import axios from 'axios'
// 导入store数据
import store from '@/store'
// 导入路由
import router from 'vue-router'
// 导出求根地址，原因：其他地方可能有不是通过axios发请求的地方用的到根地址
const baseURL = 'http://pcapi-xiaotuxian-front-devtest.itheima.net/'
const instance = axios.create({
  // axios的基本配置：请求根地址和请求失效时间
  baseURL,
  timeout: 5000
})

// 2.请求拦截器，如果过有token进行数据携带
instance.interceptors.request.use((config) => {
  // 拦截业务逻辑
  // 进行请求配置的修改
  // 获取用户信息
  const { profile } = store.state.user
  // 判断时候存在token字段
  if (profile.token) {
    // 设置token
    config.headers.Authorization = `Bearer ${profile.token}`
  }
  return config
}, (err) => {
  return Promise.reject(err)
})

// 3.响应拦截器，：1.剥离无效数据2.处理失效token
instance.interceptors.response.use((res) => {
  return res.data
}, (err) => {
  // 判断401响应状态码
  if (err.response && err.response.status === 401) {
    // 清空无效token
    store.commit('user/setUser', {})
    // 转跳入登录页面
    // 组件拿当前地址直接用$route.path会导致地址后的参数丢失，使用$route.fullPath会拿到所有参数
    // js模块中使用router.currentRoute==$route，但是router.currentRoute是ref响应是对象，所以===router.currentRoute.value.fullPath
    // 地址栏后有=&特殊符号需要进行转码处理
    const fullPath = encodeURIComponent(router.currentRoute.value.fullPath)
    // 转跳需要传参（当前的路由地址）给登录页码
    router.push('/login?redirectUrl=' + fullPath)
  }
  return Promise.reject(err)
})

// 4.导出一个函数，调用当前的axios实例发请求
export default (url, method, submitData) => {
  return instance({
    url,
    method,
    // 1.如果是get请求，需要用params来接受数据
    // 2.如果是posh请求。需要用data来接受数据
    // [可以设置一个动态参数，通过method来判断请求时GET还是POST
    [method.toUpperCase() === 'GET' ? 'params' : 'data']: submitData
  })
}
