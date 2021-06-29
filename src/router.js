import Vue from 'vue'
import Router from 'vue-router'

const Login = () => import('./views/Login')
const Home = () => import('./views/Home')
const Welcome = () => import('./views/Welcome')

const Users = () => import('./views/user/Users')

const Rights = () => import('./views/power/Rights')
const Roles = () => import('./views/power/Roles')

const Cate = () => import('./views/goods/Cate')
const Params = () => import('./views/goods/Params')

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
    },
    {
      path: '/rights',
      component: Rights
    },
    {
      path: '/roles',
      component: Roles
    },
    {
      path: '/categories',
      component: Cate
    },
    {
      path: '/params',
      component: Params
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
