import Vue from 'vue'
import App from './App.vue'
import router from './router'

import ElementUI from 'element-ui'
import axios from 'axios'

import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'

// 配置请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.use(ElementUI)
Vue.prototype.$http = axios
Vue.config.productionTip = false



new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
