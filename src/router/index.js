import Vue from 'vue'
import Router from 'vue-router'
import diff from '@/pages/diffPage/index'
import document from '@/pages/document/index'
import result from '@/pages/result/index'

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
      path: '/document',
      name: 'document',
      component: document
    },
    {
      path: '/result',
      name: 'result',
      component: result
    }
  ]
})
