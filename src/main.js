import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './styles/index.less'
import 'nprogress/nprogress.css'
import axios from 'axios'

// axios.defaults.baseURL = 'http://toutiao.course.itcast.cn/mp/v1_0'
axios.defaults.baseURL = 'http://toutiao.course.itcast.cn/mp/v1_0'

Vue.use(ElementUI)

Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
