import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/components/Home'
import Login from '@/components/Login'
import Register from '@/components/Register'
import Newnote from '@/components/Newnote'
import Myblog from '@/components/menu/Myblog' //我的博客
import Manageblog from '@/components/menu/Manageblog' //博客管理
import Usercenter from '@/components/menu/Usercenter' //个人中心
import Articledetails from '@/components/subcomponents/Articledetails' //文章详情页

Vue.use(Router)

export default new Router({
  mode: 'history',  //去掉url中的#
  routes: [
    {path:'/',redirect:'/Home'},//重定向，默认显示主页
    {path: '/Login',component: Login},
    {path: '/Home',component: Home}, 
    {path: '/Register',component: Register},
    {path: '/Newnote/:id',component: Newnote,meta:{requireAuth:true}},
    {path: '/Myblog',component: Myblog,meta:{requireAuth:true}},
    {path: '/Articledetails/:id',component: Articledetails},  //文章详情路由接收文章id参数
    {path: '/Manageblog',component: Manageblog,meta:{requireAuth:true}},
    {path: '/Usercenter',component: Usercenter,meta:{requireAuth:true}}
  ],
  // linkActiveClass:'ivu-menu-item-active'
})

