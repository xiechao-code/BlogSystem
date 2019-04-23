<template>
  <div id="app">
    <Input v-model="title" name="title" placeholder="输入文章标题" style="width: 1200px; margin:5px" size="large" />
    <Button type="warning" @click="publishArticle" v-if="flag">发布文章</Button>
    <Button type="error" @click="updateArticle" v-else>保存修改</Button>
    <!-- markdown文本编辑器 -->
    <!-- save为markdown的内置方法之一，即点击保存按钮后的回调事件,它有两个参数value和render，render为HTML格式 -->
    <!-- change为编辑区发生改变时出发的方法 -->
    <mavon-editor v-model="value" @save='saveData' @change="toHtml"/>
  </div>
</template>

<script>

export default {
  data(){
    return{
      title:'', //文章标题
      value:'',  //这个value值就是markdown中文本内容,md格式
      input:'',   //input的值是value转换成HTML格式的值
      id:this.$route.params.id, //如果是点击的编辑按钮跳转过来那么就会带有文章id参数
      flag:true,  //控制显示发布文章按钮还是保存修改按钮
      flag2:true  //用于控制是否关闭路由拦截
    }
  },
  beforeRouteLeave: function(to, from , next){  //设置路由拦截，当点击导航跳转时，先提示用户不会保存数据
        next(false)
        if(this.flag2){  //flag2为true时，代表是点击的发布文章按钮进行的跳转，所以不需要拦截
          this.$Modal.confirm({  //iview对话框
                            title: "系统提示",
                            content: "系统可能不会保留您的更改！",
                            onOk: () => {
                            next();
                            },
                            onCancel: () => {
                            return;
                            }
          });
        }else{
          next(true); 
        }                       
  },
  created(){
    this.findarticle();
  },
  methods:{
    toHtml(value,render){  //编辑区一改变就把html格式给input变量
      this.input = render;
    },
    //点击保存按钮
    saveData(value,render){  //vaule是文本的内容，render是经过解析成HTML格式的内容
      this.$Message.config({  //设置iview警告框距离顶部的距离
          top: 200
        });
      //先判断是否已经输入了标题
      if(this.title==''){
        this.$Message.warning('您还没有输入文章标题哦！');
      }else if(this.value==''){
        this.$Message.warning('文章内容不能为空哦！');
      }else{
        this.$store.state.article_cache = value; //暂时保存文章草稿到store仓储
      }
    },
    //点击发文文章按钮
    publishArticle(){
      this.$Message.config({  //设置iview警告框距离顶部的距离
          top: 200
        });
      //先判断是否已经输入了标题
      if(this.title==''){
        this.$Message.warning('您还没有输入文章标题哦！');
      }else if(this.value==''){
        this.$Message.warning('文章内容不能为空哦！');
      }else{
        //发起ajax将文章标题和内容传递给后台
        this.$axios.get("/dopublisharticle",{
          params:{
            'title':this.title,
            'input':this.input,  //html格式
            'value':this.value,  //md格式
            'author': this.$store.state.username
          }
        }).then(result =>{
          if(result.data.err1){
              this.$Message.error('内部服务器错误！');
          }
          if(result.data.success){
              this.$Message.success('文章发布成功，2s后跳转到个人主页！');
              this.flag2 = !this.flag2;  //不显示弹出框直接跳转路由
              var r = this.$router;
              //设置定时器，2s后跳转到我的博客,否则因为异步会先跳过去
                    function Redirect() {
                        r.push("/Myblog"); 
                    }
                    setTimeout(function () {
                        Redirect();
                    },2000);
                    window.clearTimeout();
            }
        })
      }
    },
    findarticle(){  //查询一篇文章
      if(this.id!=0){  //如果路由跳转时的参数id不等于0，那么就是从文章列表页跳转过来的，所以此文章已存在于数据库中，直接查询显示出来
        this.flag = !this.flag;  //显示保存修改按钮
        this.$axios.get("/dofindarticle",{
          params:{
            'id': this.id
            }
        }).then(result =>{
          if(result.data.err1){
            this.$Message.error('内部服务器错误！');
          }else{
            this.value = result.data[0].value;
            this.title = result.data[0].title;
          }
        })
      }
    },
    updateArticle(){  //修改一篇文章
      this.$Message.config({  //设置iview警告框距离顶部的距离
          top: 200
        });
      //先判断是否已经输入了标题
      if(this.title==''){
        this.$Message.warning('您还没有输入文章标题哦！');
      }else if(this.value==''){
        this.$Message.warning('文章内容不能为空哦！');
      }else{
        //发起ajax将文章标题和内容传递给后台
        this.$axios.get("/doupdatearticle",{
          params:{
            'id': this.id,  //文章id（数据库生成的）
            'title':this.title,
            'input':this.input,  //html格式
            'value':this.value,  //md格式
            'author': this.$store.state.username
          }
        }).then(result =>{
          if(result.data === -1){
              this.$Message.error('内部服务器错误！');
          }
          if(result.data === 1){
              this.$Message.success('文章修改成功，2s后跳转到个人主页！');
              var r = this.$router;
              //设置定时器，2s后跳转到我的博客,否则因为异步会先跳过去
                    function Redirect() {
                        r.push("/Myblog"); 
                    }
                    setTimeout(function () {
                        Redirect();
                    },2000);
                    window.clearTimeout();
            }
        })
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.v-note-wrapper{
  min-height: 650px;
  z-index: 500;
}
</style>
