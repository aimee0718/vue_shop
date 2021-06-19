import Vue from 'vue'
import Router from 'vue-router'

const Login = () => import('./views/Login')
const Home = () => import('./views/Home')
const Users = () => import('./views/user/Users')
const Welcome = () => import('./views/Welcome')

Vue.use(Router)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/Welcome',
    children: [{
      path: '/Welcome',
      component: Welcome
    },
    {
      path: '/users',
      component: Users
    }]
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
