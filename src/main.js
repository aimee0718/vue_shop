import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from './network/axios'
import ElementUI from 'element-ui'
import TreeTable from 'vue-table-with-tree-grid'

import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'

Vue.use(ElementUI)

Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.component('tree-table', TreeTable)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
