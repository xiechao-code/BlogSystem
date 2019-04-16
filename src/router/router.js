import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/components/Home'
import Login from '@/components/Login'
import Register from '@/components/Register'
import Newnote from '@/components/Newnote'
import Myblog from '@/components/menu/Myblog' //我的博客

Vue.use(Router)

export default new Router({
  mode: 'history',  //去掉url中的#
  routes: [
    {path:'/',redirect:'/Home'},//重定向，默认显示主页
    {path: '/Login',component: Login},
    {path: '/Home',component: Home}, 
    {path: '/Register',component: Register},
    {path: '/Newnote',component: Newnote,meta:{requireAuth:true}},
    {path: '/Myblog',component: Myblog,meta:{requireAuth:true}}
  ],
  linkActiveClass:'ivu-menu-item-active'
})

