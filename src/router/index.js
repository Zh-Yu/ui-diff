import Vue from 'vue'
import Router from 'vue-router'
import diff from '@/pages/diffPage/index'
import wiki from '@/pages/wiki/index'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: diff
    },
    {
      path: '/diff',
      name: 'diff',
      component: diff
    },
    {
      path: '/wiki',
      name: 'wiki',
      component: wiki
    }
  ]
})
