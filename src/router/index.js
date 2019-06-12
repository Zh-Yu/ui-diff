import Vue from 'vue'
import Router from 'vue-router'
import diffPage from '@/pages/diffPage/index'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'diffPage',
      component: diffPage
    }
  ]
})
