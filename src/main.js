import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './styles/index.less'
import 'nprogress/nprogress.css'
import axios from 'axios'
import { getUser } from '@utils/auth'

// axios.defaults.baseURL = 'http://toutiao.course.itcast.cn/mp/v1_0'
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0'

axios.interceptors.request.use(config => {
  const user = getUser()
  if (user) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})

axios.interceptors.response.use(response => {
  return response
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
