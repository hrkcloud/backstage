import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  { //登录界面
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  { //首页布局界面
    path: '/layout',
    name: 'Layout',
    component: () => import('../views/layout/index.vue')
  }
]

const router = new VueRouter({
  routes
})

// router导航守卫
router.beforeEach((to,from,next) => {
  // 如果是去登录页面 直接放行
  if(to.path == '/login') return next()
  // 否则就是去跳转其他页面,需要判断缓存中是否有token
  const tokenStr = window.sessionStorage.getItem('token')
  // 判断token是否存在
  if(!tokenStr) return next('/login') //不存在的情况下让他返回登录页面
  // 存在的情况下,放行
  next()
})

export default router
