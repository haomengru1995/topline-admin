import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './styles/index.less'
import 'nprogress/nprogress.css'
import axios from 'axios'
import { getUser, removeUser } from '@/utils/auth'
import JSONbig from 'json-bigint'
// axios.defaults.baseURL = 'http://toutiao.course.itcast.cn/mp/v1_0'
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0'

axios.defaults.transformResponse = [function (data) {
  try {
    return JSONbig.parse(data)
  } catch (err) {
    return data
  }
}]
// Axios 请求拦截器：axios 发出去的请求会先经过这里
// config 是本次请求相关的配置对象
axios.interceptors.request.use(config => {
  const user = getUser()
  if (user) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  return config
}, error => {
  // 如果用户token无效，让其跳转到登录页面
  if (error.response.status === 401) {
    removeUser()

    // 跳转到用户登录页面
    router.push({
      name: 'login'
    })
  }
  return Promise.reject(error)
})

// Axios 响应拦截器：axios 收到的响应会先经过这里
axios.interceptors.response.use(response => {
  if (typeof response.data === 'object' && response.data.data) {
    return response.data.data
  } else {
    return response.data
  }
}, error => {
  return Promise.reject(error)
})

Vue.use(ElementUI)

Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
