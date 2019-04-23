<template>
  <div id="app">
    <div class="container">
      <div class="article_content" v-html="article"></div>
    </div>
  </div>
</template>



<script>
export default{
  data(){
    return{
      article:[],
      id:this.$route.params.id  //将url地址中传递过来的id值，挂载到data上，方便以后调用
    }
  },
  created(){
    this.findarticle();
  },
  methods:{
    findarticle(){  //查询一篇文章
      this.$axios.get("/dofindarticle",{
        params:{
          'id': this.id
          }
        }).then(result =>{
          if(result.data.err1){
            this.$Message.error('内部服务器错误！');
          }else{
            this.article = result.data[0].input;
          }
        })
    }
  }
}
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style >
#app{
  background-image: url(../../assets/images/bg-02.jpg);
  background-attachment: fixed;  /* 设置背景图片固定，不随页面滚动 */
  height:668px;
}
.container{
  width: 1200px;
  margin: 0 auto;
  margin-top: 20px;
}
.article_content{
  width: 75%;
  padding: 20px;
  float: right;
  background-color: #fff;
}
.article_content p{
  font-size: 16px;
  color: #505050;
  font-family: "微软雅黑";
}
.article_content h1{
  font-size: 26px;
  color: #4f4f4f;
  margin: 8px 0 16px;
}
.article_content h2{
  font-size: 24px;
  color: #4f4f4f;
  margin: 8px 0 16px;
}
.article_content h3{
  font-size: 22px;
  color: #4f4f4f;
  margin: 8px 0 16px;
}
.article_content h4{
  font-size: 20px;
  color: #4f4f4f;
  margin: 8px 0 16px;
}
.article_content h5{
  font-size: 18px;
  color: #4f4f4f;
  margin: 8px 0 16px;
}
.article_content h6{
  font-size: 16px;
  color: #4f4f4f;
  margin: 8px 0 16px;
}
.article_content hr{
  border: 0.5px solid #d4d4d4;
  margin: 10px 0;
}
    
</style>
