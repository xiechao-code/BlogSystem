import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state:{
    islogin:false, //登录状态
    username:"",  //用户名
    avatar:"",  //用户头像
    article_cache:"",  //文章草稿
    article:[]  //文章数组
  },
  mutations:{
    login(state,is_login){  //接收组件中传过来的is_login的值，如果为true表示登录
        state.islogin = is_login;
        state.username = JSON.parse(sessionStorage.getItem("username"));
        //JSON.stringify() 方法是将一个JavaScript值(对象或者数组)转换为一个 JSON字符串
        sessionStorage.setItem("islogin",JSON.stringify(is_login));
    },
    unlogin(state,is_login){  //接收组件中传过来的is_login的值，如果为true表示登录
      state.islogin = is_login;
      sessionStorage.setItem("islogin",JSON.stringify(is_login));
    }
  }
});