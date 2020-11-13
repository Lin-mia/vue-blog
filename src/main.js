import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import bus from './utils/bus'
Vue.config.productionTip = false
Vue.config.devtools = true

const whiteList = ['/']
router.beforeEach((to, from, next) => {
  const hasUser = localStorage.getItem('user')
  if (hasUser) {
    next()
  } else if (whiteList.indexOf(to.path) !== -1) {
    setTimeout(function () {
      bus.$emit('showLoginBox')
    }, 1000)
    next()
  } else {
    next('/')
  }
})

new Vue({
  router,
  store,
  render: h => h(App),
  data: function () {
    return {
      user: JSON.parse(localStorage.getItem('user'))
    }
  }
}).$mount('#app')
