<template>
  <div id="app"><!--外层面板，设置背景图片-->
    <div class="box">
      <input v-model="username" name="username" placeholder="账号"/>
      <Icon id="clear_btn" type="md-close" size="22" v-on:click="clear1"/>

      <input v-model="userpassword" name="userpassword" placeholder="密码" type="password"  ref="password" @keyup.enter="signIn"/>
      <Icon id="clear_btn" type="md-close" size="22" v-on:click="clear2"/>
      <!-- 小眼睛图标，控制密码的显示隐藏 -->
      <Icon id="eye_btn" type="ios-eye" size="24" v-on:click="showPassword" v-if="eye"/>
      <Icon id="eye_btn" type="ios-eye" size="24" v-on:click="showPassword" v-else/>

      <button type="button" class="sign" v-on:click="signIn"><span>Sign In</span></button>
    </div>
    <div class="link">
      <p>还没有账号？&nbsp;&nbsp;&nbsp;<router-link to="/register">Sign Up !</router-link></p>
    </div>
  </div> 
</template>

<script>
export default {
  data(){
    return{
      username:null,
      userpassword:null,
      eye:null
    }
  },
  methods:{
    signIn(){ //鼠标点击登录按钮
      this.$Message.config({  //设置iview警告框距离顶部的距离
        top: 100
      });

      if(this.username!=null && this.userpassword!=null){
        const msg = this.$Message.loading({  //iview警告框，显示加载中
                    content: 'Logining...',
                    duration: 0
        });
//如果用户名和密码都不为空就发起ajax将数据给后台判断是否正确
        this.$axios.get("/dologin",{
          params:{  //一定要加 params 不染参数传不过去
            "username":this.username,
            "password":this.userpassword
          }
          }).then(result => {  //这里必须用箭头函数，this才能指向vue，否则为undefined
            setTimeout(msg,0);  //后台数据返回来了就将，“正在登录”警告框隐藏
            if(result.data.err1){
              this.$Message.error('内部服务器错误！');
            }
            if(result.data.err2){
              this.$Message.error('此用户不存在！');
            }
            if(result.data.err3){
              this.$Message.error('密码错误！');
            }
            if(result.data.success){
              //将用户名存入session会话
              sessionStorage.setItem("username",JSON.stringify(this.username));
              //调用 store 里的方法，将登录状态 true 传过去，result.data.success来自后台node返回的数据
              this.$store.commit('login',result.data.success);
              this.$Message.success('登陆成功，页面在1秒后跳转...');
              var r = this.$router;
              //设置定时器，1s后跳转到我的博客
                    function Redirect() {
                        r.push("/Myblog"); 
                    }
                    setTimeout(function () {
                        Redirect();
                    },1000);
                    window.clearTimeout();
            }
          }).catch(function (error) {
              //失败
              this.$Message.error(error);
          });
      }else{
        this.$Message.error('请确保用户名和密码均已填写！');
      }
    },
    clear1(){ //清除填写的用户名
      this.username=null;
    },
    clear2(){ //清除填写的密码
      this.userpassword=null;
    },
    showPassword(){ //点击密码框后的小眼睛，实现密码的显示和隐藏
      //当点击小眼睛，密码框的type变为text，且eye的值改为false，显示第二个眼睛，再次点击切换为上一个type
      const password = this.$refs.password; //获取到密码框
      if(this.eye){
        this.eye=false;
        password.type = "text";
      }else{
        this.eye=true;
        password.type = "password";
      }
    }
  }
  
}
</script>

<style scoped>
  #app{
    width: 100%;
    height: 669px;
    background-image: url("../assets/images/bg-01.jpg");
    background-position-y: -1px;
    background-size: cover;
    background-attachment: fixed;  /* 设置背景图片固定，不随页面滚动 */
  }
  .box{
    width: 450px;
    height: 300px;
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
  
  input{ /* 输入框样式 */
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
  input::-webkit-input-placeholder{
    color:#ffffff94;
  }
  input:focus{
    background-color:hsla(0,0%,100%,.28);
  }

  
  .sign{
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
  .sign:hover{
    background-color:hsla(0,0%,100%,.28);
    font-size: 2rem;
  }


  .link{
    height: 20px;
    position: relative;
    top: 450px;
    color: #ffffff;
    font-size: 20px;
    text-align: center;
    text-shadow:5px 2px 6px #000;
  }
  .link a{
    color: #ffffff;
    font-weight: bold;
    font-size: 30px;
  }
  .link a:hover {
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
</style>


