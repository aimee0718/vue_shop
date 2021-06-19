import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from './network/axios'
import ElementUI from 'element-ui'


import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'

Vue.use(ElementUI)

Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
