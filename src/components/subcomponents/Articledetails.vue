<template>
  <div id="app">
    <div class="container">
      <div class="article_content" v-highlight> <!--v-highlight为自定义的代码高亮组件-->
        <div class="head">
          <div>
            <h2><span class="article-type">{{article_type}}</span>{{title}}</h2>
            <span>{{time}}</span><span>作者:{{author}}</span><span>阅读数:{{count_read}}</span><span>分类:{{blog_type}}</span>
          </div>
        </div>
        <hr style="margin: 15px 0;">
        <div v-html="input"></div>
      </div>
      <!-- 评论组件 -->
      <!-- 将文章id传给评论子组件 -->
      <comment :id="this.id"></comment>
    </div>
  </div>
</template>



<script>
// 导入评论子组件
import comment from './comment.vue';

export default{
  data(){
    return{
      input:[],
      id:this.$route.params.id,  //将url地址中传递过来的id值，挂载到data上，方便以后调用
      title:'',
      author:'',
      time:'',
      count_read:'',
      article_type:'',
      blog_type:''
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
            this.input = result.data[0].input;
            this.title = result.data[0].title;
            this.time = result.data[0].publishtime;
            this.author = result.data[0].author;
            this.count_read = result.data[0].count_read;
            this.article_type = result.data[0].article_type;
            this.blog_type = result.data[0].blog_type;
          }
        })
    }
  },
  components:{  //注册子组件
    'comment':comment
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
  width: 60%;
  margin: 0 auto;
  margin-top: 20px;
}
.article_content{
  width: 100%;
  padding: 20px;
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
.article_content li{
  font-size: 16px;
}
.article_content pre{
  font-size: 1.2em;
}
.article_content .head{
  width: 100%;
  background-color: #2d272b;
  height: 100px;
  padding: 10px;
  border-radius: 5px;
}
.head h2{
  color:#eaeaea;
}
.head span{
  font-size: 15px;
  margin-right:20px;
  color:#c1c1c1;
}  
.head .article-type{
  color: #ca0c16;
  border: 1px solid #eaeaea;
  font-size: 12px;
  border-radius: 15%;
  position: relative;
  top: -2px;
  padding: 1px;
} 
</style>
