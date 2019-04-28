<template>
  <div class="hello">
    <div class="head">
      <h2>STAR博客</h2>
      <p>一个专业的IT技术分享交流博客~~~</p>
    </div>
    <div v-show="flag" style="height:680px"></div>
    <ul>
      <li  v-for="item in articles" v-bind:key="item._id">
          <p slot="title" class="article_title"><router-link :to="'/Articledetails/' + item._id">{{item.title}}</router-link></p>
          <p class="article_content">摘要：{{ToText(item.input)}}</p>
          <p class="article_attr">
            <span>作者：{{item.author}}丨发布时间：<Time :time="item.publishtime" :interval="1" /></span>
            <span style="float: right;color:#f9a35b;">阅读数：{{item.count_read}}丨评论数：{{item.count_comment}}</span>
          </p>    
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data(){
    return{
      articles:[],
      flag:true
    }
  },
  created(){
    this.findAllArticles();
  },
  methods:{
    findAllArticles(){
      this.$Message.config({  //设置iview警告框距离顶部的距离
        top: 300
      });
      const msg = this.$Message.loading({
                    content: '拼命加载中...',
                    duration: 0
                });

      this.$axios.get("/dofindallarticles",{
        params:{
          }
        }).then(result =>{
          if(result.data.err1){
            this.$Message.error('内部服务器错误！');
          }else{
            setTimeout(msg, 0);
            this.flag = false;
            this.articles = result.data;
          }
        })
    },
    ToText(HTML){  //这个方法的功能是将html格式转换为纯文本
      var input = HTML;
      return input.replace(/<(style|script|iframe)[^>]*?>[\s\S]+?<\/\1\s*>/gi,'').replace(/<[^>]+?>/g,'').replace(/\s+/g,' ').replace(/ /g,' ').replace(/>/g,' ');  
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hello{
  background-image: url('../assets/images/bg-02.jpg');
  background-repeat:repeat; 
  padding-top: 20px;
}
ul{
  width: 900px;
  margin: 0 auto;
  list-style: none;
}
ul li{
  padding: 20px;
  border-left: 15px solid #fbd0ac;
  background-color: #fff;
  transition: all .2s linear;
  border-bottom: 1px solid #e2e2e2;
  cursor:pointer;
} 
ul li:hover{
  transform: translate3d(-2px,0,0);
  box-shadow: 0 15px 30px rgba(0,0,0,.1);
  /* background-color: #edfbf6; */
}
.article_title a{
    color: #424242;
    font-size: 18px;
    font-weight: bold;
}
.article_title a:hover{
  color: #ff8a12;
}
.article_content{
  color: #8e8e8e;
  font-size: 14px;
  height: 40px;
  white-space: normal;  /*文本自动处理换行*/
  letter-spacing:1px;
  /* 以下设置文本超出显示省略号 */
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  margin-bottom:8px;
}
.article_attr{
  font-size: 14px;
}
.ivu-carousel{
  width: 900px;
  height: 300px;
  margin: 0 auto;
}
.hello .head{
  margin: 0 auto;
  background-image: url(../assets/images/bg-03.jpg);
  height: 180px;
  background-position: center;
  background-repeat: no-repeat;
  width: 900px;
  padding: 20px;
}
.hello .head h2{
    color: #3c3c3c;
    font-family: "华文行楷";
    font-size: 35px;
}
.hello .head p{
  font-size: 16px;
  font-family: "华文行楷";
}
</style>
