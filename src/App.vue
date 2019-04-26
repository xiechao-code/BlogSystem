<template>
  <div class="layout">
    <Layout>
        <Header>
            <Menu mode="horizontal" theme="dark" active-name="1">
                <div class="layout-logo"><img src="../static/icon/star-icon.jpg"><span>STAR博客</span></div>
                <span class="roll">{{msg}}</span>
                <div class="layout-nav" id="nologin_nav" v-if="!islogin">
                    <MenuItem name="1">
                        <router-link to="/home"><Icon type="ios-home"></Icon>
                        首页</router-link>
                    </MenuItem>
                    <MenuItem name="2">
                        <router-link to="/login"><Icon type="md-person"></Icon>
                        登录</router-link>
                    </MenuItem>
                    <MenuItem name="3">
                        <router-link to="/register"><Icon type="md-person-add"></Icon>
                        注册</router-link>
                    </MenuItem>
                </div>

                <div class="layout-nav" v-if="islogin">
                    <MenuItem name="1">
                        <router-link to="/home"><Icon type="ios-home"></Icon>
                        首页</router-link>
                    </MenuItem>
                    <MenuItem name="2">
                        <router-link :to="'/Newnote/' + 0"><Icon type="ios-book"></Icon>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
                        写博客</router-link>
                    </MenuItem>
                    <MenuItem name="3">
                        <router-link to="/myblog"><Avatar/></router-link>
                    </MenuItem>
                    <Submenu name="4">
                      <template slot="title">
                        MENU
                      </template>
                        <MenuGroup title="菜单" class="MenuGroup">
                            <MenuItem name="3-1">个人中心</MenuItem>
                            <MenuItem name="3-2"><router-link to="/myblog" style="color:#515a6e">我的博客</router-link></MenuItem>
                            <MenuItem name="3-3"><router-link to="/Manageblog" style="color:#515a6e">博客管理</router-link></MenuItem>
                            <Divider style="margin: 4px 0;"/>
                            <MenuItem name="3-4"><span @click="unlogin" title="退出登录">注销登录</span></MenuItem>
                        </MenuGroup>
                    </Submenu>
                </div>
            </Menu>
        </Header>
        <!-- <Footer class="layout-footer-center">2019-02 &copy; Built with vue and node.Theme designed by XC.</Footer> -->
    </Layout>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  data(){
    return{
      msg:'专业IT技术分享博客~~~   ',
      intervalid:null , //在data上定义定时器id
      islogin:this.$store.state.islogin
    };
  },
  created(){
    this.Roll(),
    this.iflogin() //一进来就判断登录状态
  },
  methods:{
    Roll(){//实现跑马灯效果（文字滚动）
      //判断计时器id是否为null，为null则表示没启动过，还为停止状态，继续执行以下代码启动计时器，否则终止启动
      if(this.intervalid!=null){return}

      this.intervalid=setInterval(()=>{
        //获取到头的第一个字符
        var start=this.msg.substring(0,1)
        //获取到后面的第所有字符
        var end=this.msg.substring(1)
        //重新拼接得到的新的字符串，并赋值给this.msg
        this.msg=end+start	
      },300)
    },
    iflogin(){  //判断登录状态
      //刷新了页面导致vuex失效了，所以还需要重新判断一下
      this.$store.commit('login',JSON.parse(sessionStorage.getItem("islogin")));
      this.islogin = this.$store.state.islogin;
    },
    unlogin(){  //注销登录，将登录状态为false传回store
      this.$Modal.confirm({  //iview对话框
                            title: "注销登录",
                            content: "点击确认注销登录！",
                            onOk: () => {
                            this.$store.commit('unlogin',false);
                            this.$router.push('/Login');
                            },
                            onCancel: () => {
                            return;
                            }
                          });
    }
  }
}
</script>

<style scoped>
  .layout{
      /* border: 1px solid #d7dde4; */
      background: #f5f7f9;
      position: relative;
      border-radius: 4px;
      overflow: hidden;
  }
  .layout-logo{
    width: 200px;
    height: 64px;
    float: left;
    position: relative;
    left: 100px;
    color: #fff;
    line-height: 64px;
    font-size: 24px;
    font-family: "\534E\6587\884C\6977";
    animation: myanimate 5s linear 1s infinite alternate;/*css3的动画*/
    -webkit-animation: myanimate 5s linear 1s infinite alternate; /* Safari and Chrome */
  }
  @keyframes myanimate{ /*字体颜色从白色变为粉红再变为白色*/
    0%{color:#fff}
    50%{color: pink}
    100%{color: #fff}
  }
  @-webkit-keyframes myanimate /* Safari and Chrome */
  {
    0%{color:#fff}
    50%{color: pink}
    100%{color: #fff}
  }
  .layout-logo img{
    width: 40%;
    float: left;
  }
  #nologin_nav{
    width: 420px;
    height: 100%;
    margin: 0 auto;
    margin-right: -154px;
  }
  .layout-nav{
    width: 410px;
    height: 100%;
    margin: 0 auto;
    margin-right: 55px;
  }
  .layout-footer-center{
      text-align: center;
      background-color: #231f20;
      padding-top: 10px;
     padding-bottom: 10px;
  }
  .ivu-layout-footer {
    color: #a3b4d9;
  }
  .ivu-layout-header {
    background-color: #231f20;
    box-shadow: 0.5px 0.5px 18px 0px #000;
  }
  .ivu-menu-dark {
    background-color: #231f20;
  }
  .ivu-menu-item{
    width:100px;
    text-align: center;
  }
  .ivu-menu-item:hover{
    border-bottom: 4px solid #ff8100;
  }
  a{
    color: #ccd1d6ab;
    height: 60px;
    display: inline-block;
  }
  a:hover{
    color: #fff;
  }
  .router-link-active{
    color: #fff;
  }
  .ivu-menu-item-active{
    border-bottom: 4px solid #ff8100;
  }
  .roll { /*跑马灯字体*/
    margin-left: 130px;
    float: left;
    font-size: 16px;
    color: #8d9dc1;
  }
  .ivu-avatar{
    background-image: url(./assets/avatar/avatar01.jpg);
    background-repeat:no-repeat;
    background-position: center;
    background-size: 100%;  
  }
  .ivu-menu-horizontal .ivu-menu-submenu .ivu-select-dropdown .ivu-menu-item{
    height: 40px;
    width: 107px;
  }
</style>
