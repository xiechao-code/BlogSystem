import Vue from 'vue'
import App from './App.vue'
import router from './router/router.js'
import axios from 'axios'
import iview from 'iview'
import store from './store/store.js'  //store状态管理对象
import 'iview/dist/styles/iview.css' //导入iview框架样式
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import hljs from 'highlight.js' //导入代码高亮文件
import 'highlight.js/styles/monokai-sublime.css'  //导入代码高亮样式


Vue.use(iview) //注册iview框架
Vue.use(store);
Vue.use(mavonEditor);  //注册markdown编辑器
Vue.prototype.$axios = axios; //将axios写入vue的原型，这样就能更简单的使用,就可以直接 this.$axios 来使用。
axios.defaults.withCredentials=true;  //跨域保存session有用
axios.defaults.baseURL = "http://localhost:3030"; //设置跨域访问，打包的时候直接删掉，默认基础路径在这里配置
Vue.config.productionTip = false



//配置全局路由守卫验证路由是否需要登录
router.beforeEach((to, from, next) => {
   if (to.matched.some(record => record.meta.requireAuth)){ // 判断该路由是否需要登录权限
       if (JSON.parse(sessionStorage.getItem("islogin"))!=false && JSON.parse(sessionStorage.getItem("islogin"))!=null) { // 判断当前是否登录
        next(); //如果登录了next()就表示允许跳转到要去的路由
       }
       else { //否则就跳转到下面的登录界面
        next({
        path: '/login',
        query: {redirect: to.fullPath} // 将跳转的路由path作为参数，登录成功后跳转到该路由
        })
       }
   }
   else {  //如果该路由不需要登录验证就直接允许跳转
   next();
   }
  });


//自定义一个代码高亮指令
Vue.directive('highlight',function (el) {
  let highlight = el.querySelectorAll('pre code');
  highlight.forEach((block)=>{
      hljs.highlightBlock(block)
  })
})




new Vue({
  el: '#app',
  router,
  store,  //挂载store状态管理对象
  components: { App },
  template: '<App/>'
})





