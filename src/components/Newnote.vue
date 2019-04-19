<template>
  <div id="app">
    <Input v-model="title" name="title" placeholder="输入文章标题" style="width: 1200px; margin:5px" size="large" />
    <Button type="warning" @click="publishArticle">发布文章</Button>
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
      id:this.$route.params.id //如果是点击的编辑按钮跳转过来那么就会带有文章id参数
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
      // this.input = this.value;
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
      if(this.id!=0){
        this.$axios.get("/dofindarticle",{
        params:{
          'id': this.id
          }
        }).then(result =>{
          if(result.data.err1){
            this.$Message.error('内部服务器错误！');
          }else{
            this.value = result.data[0].value;
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
