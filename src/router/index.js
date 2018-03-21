import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import goods from '@/components/goods/goods'
import seller from '@/components/seller/seller'
import ratings from '@/components/ratings/ratings'
Vue.use(Router)

export default new Router({
  mode: 'history',
  linkActiveClass:'active',
  routes: [
    {
      path: '/seller',
      component: seller
    },
    {
      path: '/goods',
      component: goods
    },
    {
      path: '/ratings',
      component: ratings
    },
  ]
})