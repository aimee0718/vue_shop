import Vue from 'vue'
import Router from 'vue-router'

const Login = () => import('./components/Login')
const Home = () => import('./views/Home')

Vue.use(Router)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login,
    meta: {
      name: 'Login'
    }
  },
  {
    path: '/home',
    component: Home,
    meta: {
      name: 'Home'
    }
  }
]
const router = new Router({
  routes: routes,
  mode: 'history'
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
