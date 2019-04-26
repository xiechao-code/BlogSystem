<template>
  <div id="app">
    <div class="box-register">
<!-- 输入手机号 -->
      <input v-model="phone" name="phone" class="r-input" placeholder="登录账号 (11位手机号)" v-on:blur="checkphone" ref="phone"/>
      <Icon id="clear_btn" type="md-close" size="22" v-on:click="clear1"/>

<!-- 输入用户名  -->
      <input v-model="username" name="username" class="r-input" placeholder="昵称 (至少两个字符)" v-on:blur="checkusername" ref="username"/>
      <Icon id="clear_btn" type="md-close" size="22" v-on:click="clear2"/>

<!-- 输入密码 -->
      <input v-model="userpassword" name="userpassword" class="r-input" placeholder="密码 (不低于6位且必须包含字母)" type="password" v-on:blur="checkuserpassword" ref="userpassword"/>
      <Icon id="clear_btn" type="md-close" size="22" v-on:click="clear3"/>
      <!-- 小眼睛图标，控制密码的显示隐藏 -->
      <Icon id="eye_btn" type="ios-eye" size="24" v-on:click="showPassword" v-if="eye"/>
      <!--v-else必须和v-if搭配使用，且v-if的值为false才显示v-else-->
      <Icon id="eye_btn" type="ios-eye" size="24" v-on:click="showPassword" v-else/>

<!-- 注册密码 -->
      <input v-model="confirmpassword" name="confirmpassword" class="r-input" placeholder="确认密码" type="password" v-on:blur="checkconfirmpassword" @keyup.enter="register($event)" ref="confirmpassword"/>
      <Icon id="clear_btn" type="md-close" size="22" v-on:click="clear4"/>

      
      <button type="button" class="signUp"  @click="register($event)"><span>Sign Up</span></button>
    </div>
    <div class="link-register">
      <router-link to="/Login">Back To Sign In !</router-link>
    </div>
    <Alert type="error" show-icon v-show="flag">请确保所有信息均按要求填写！</Alert>
  </div> 
</template>

<script>

export default {
  data(){
    return{
      phone:"",
      username:"",
      userpassword:"",
      confirmpassword:"",  // 以上四个为绑定的表单值
      eye:true,
      flag:false // 控制警告框显示
    }
  },
  methods:{
    clear1(){ //清除填写的用户名
      this.phone=null;
    },
    clear2(){ //清除填写的昵称
      this.username=null;
    },
    clear3(){ //清除填写的密码
      this.userpassword=null;
    },
    clear4(){ //清除填写的确认密码
      this.confirmpassword=null;
    },
    showPassword(){ //点击密码框后的小眼睛，实现密码的显示和隐藏
    //当点击小眼睛，密码框的type变为text，且eye的值改为false，显示第二个眼睛，再次点击切换为上一个type
      const password = this.$refs.userpassword; //获取到密码框
      if(this.eye){
        this.eye=false;
        password.type = "text";
      }else{
        this.eye=true;
        password.type = "password";
      }
    },
    //下面四个为表单验证函数
    checkphone(){ //如果手机号不是数字或不等于11位，框框变红，反之变绿
      //表示以1开头，第二位可能是3/4/5/7/8等的任意一个，在加上后面的\d表示数字[0-9]的9位，总共加起来11位结束
      if(this.phone == null || this.phone.length!=11 || /^1(3|4|5|7|8)\d{9}$/.test(this.phone)==false){
        this.$refs.phone.style.border = '2px solid #ff0000b5';
      }else{
        this.$refs.phone.style.border = '2px solid #00ff00ab';
        return true;
      }
    },
    checkusername(){
      if(this.username==null || this.username.length<2){
        this.$refs.username.style.border = '2px solid #ff0000b5';
      }else{
        this.$refs.username.style.border = '2px solid #00ff00ab';
        return true;
      }
    },
    checkuserpassword(){
      const word = this.userpassword;  //.trim()可以去掉字符串首尾空格
      if(word==null || word.length<6 || (/[A-Za-z]/.test(word))==false){  //设置的密码长度大于6位且包含字母为通过
        this.$refs.userpassword.style.border = '2px solid #ff0000b5';
      }else{
        this.$refs.userpassword.style.border = '2px solid #00ff00ab';
        return true;
      }
    },
    checkconfirmpassword(){
      const word2 = this.confirmpassword;
       if(word2==null || word2!=this.userpassword){ 
        this.$refs.confirmpassword.style.border = '2px solid #ff0000b5';
      }else if(word2 == this.userpassword){
        this.$refs.confirmpassword.style.border = '2px solid #00ff00ab';
        return true;
      }
    },
    register(event){
      if(this.checkphone()&&this.checkusername()&&this.checkuserpassword()&&this.checkconfirmpassword()){
        this.flag=false;  //错误警告框隐藏
        this.$Message.config({  //设置iview警告框距离顶部的距离
                  top: 100
              });
        const msg = this.$Message.loading({  //iview警告框，显示加载中
                    content: '正在注册...',
                    duration: 0
        });
//发起 ajax 请求
        this.$axios.get("/doregister",{
          params:{  //一定要加 params 不染参数传不过去
            "phone":this.phone,
            "username":this.username,
            "password":this.userpassword
          }
          }).then(result => {  //这里必须用箭头函数，this才能指向vue，否则为undefined
              setTimeout(msg, 0); //后台数据返回来了就将，“正在加载”警告框隐藏
              //成功，后通过后台返回的数据显示不同的警告框
              if(result.data.err1){  //用户名已被注册
                this.$Message.error('此用户名已被注册，请重新填写！'); //弹出iview警告框的信息，直接用，只要有这一句
              }else if(result.data.err2){
                this.$Message.error('后台服务器错误！');
              }else if(result.data.err3){
                this.$Message.error('此手机号已被注册过了！');
              }else if(result.data.success){
                //将用户名存入session会话,然后当登录状态为true时store就可以在session中去取用户名
                sessionStorage.setItem("username",JSON.stringify(this.username));
                //调用 store 里的方法，将登录状态 true 传过去，result.data.success来自后台node返回的数据
                this.$store.commit('login',result.data.success);
                // this.$Message.success('注册成功，页面在1秒后跳转...');
                var r = this.$router; //必须在Redirect()外定义路由，否则会报错
                //设置定时器，1s后跳转到我的博客
                    function Redirect() {
                        r.push("/Myblog"); //采用非路由跳转方式会刷新网页，会导致store失效
                    }
                    setTimeout(function () {
                        Redirect();
                    },1000);
                    window.clearTimeout();
              }
          }).catch(function (error) {
              //失败
              console.log(error);
          });
      }else{
        this.flag=true;  //注册失败显示错误警告框
        event.preventDefault();  //阻止元素发生默认的行为（例如，当点击提交按钮时阻止对表单的提交）
      }
    }
  }
}
</script>

<style>
  #app{
    width: 100%;
    height: 669px;
    background-image: url("../assets/images/bg-01.jpg");
    background-position-y: -1px;
    background-size: cover;
    background-attachment: fixed;
  }
  .box-register{
    width: 450px;
    height: 400px;
    margin-left: 36%;
    margin-top: 120px;
    z-index: 1;
    border-radius: 8px;
    box-shadow: 0px 8px 20px rgba(0,0,0,0.5);
    overflow: hidden;
    position: absolute;
    box-sizing: border-box;
    background-color: #00000078;
  }


  .r-input{
    background: #ffffff00;
    border: 0;
    border-bottom: 2px solid #fff;
    box-sizing: border-box;
    display: inline-block;
    height: 40px;
    line-height: 1;
    outline: 0;
    padding: 0 15px;
    transition: all .25s ease;
    width: 70%;
    font-size: 16px;
    color: #fff;
    margin-left: 15%;
    margin-top: 25px;
  }
  .r-input::-webkit-input-placeholder{
    color:#ffffff94;
  }
  .r-input:focus{
    background-color:hsla(0,0%,100%,.28);
  }


  .signUp{
    transition: all .25s ease;
    background: hsla(0,0%,100%,.08);
    border: 1.5px solid hsla(0,0%,100%,.65);
    border-radius: 3px;
    box-shadow: 0 0 8px hsla(0,0%,100%,.3);
    color: #fff;
    display: inline-block;
    font-size: 1rem;
    padding: .78rem 1.3rem;
    width: 70%;
    cursor: pointer;
    margin-left: 15%;
    margin-top: 45px;
  }
  .signUp:hover{
    background-color:hsla(0,0%,100%,.28);
    font-size: 2rem;
  }


  .link-register{
    height: 20px;
    position: relative;
    top: 540px;
    text-align: center;
    text-shadow:5px 2px 6px #000;
  }
  .link-register a{
    color: #ffffff;
    font-weight: bold;
    font-size: 30px;
  }
  .link-register a:hover {
    color: #57a3f3;
  }


  #clear_btn{ /* 输入框清除按钮 */
    position: relative;
    left: -25px;
    cursor: pointer;
    color: #ffffff73;
  }
  #eye_btn{
    position: relative;
    left: -80px;
    cursor: pointer;
    color: #ffffff73;
  }
  #clear_btn:hover{
    color: white;
  }
  #eye_btn:hover{
    color: white;
  }

  #alert_success{
    position: absolute;
    width: 100%;
    top: 84px;
  }
</style>

