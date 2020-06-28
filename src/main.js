import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import 'element-ui/lib/theme-chalk/index.css'; //element-ui样式
import './plugins/element-ui.js' //引入element-ui组件
import './assets/fonts/iconfont.css' //引入字体图标

Vue.config.productionTip = false
// 将axios挂载到vue原型上
Vue.prototype.$http = axios
//接口基准地址
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// axios请求拦截器
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
