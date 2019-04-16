<template>
  <div id="app">
    <div class="container">
      <h1 class="title-blog">{{this.$store.state.username}} 的博客</h1>
<!----------------------------------------------------------------------------------------->
      <div class="left-box">
        <div class="box1">
          <router-link to="/usercenter"><img class="avatar" src="../../assets/avatar/avatar01.jpg" alt="avatar" title="去往个人中心"></router-link>
          <span>{{this.$store.state.username}}</span>
        </div>
        <divider />
        <div class="box2">
          <dl>
            <dt>原创</dt>
            <dd>2</dd>
          </dl>
          <dl>
            <dt>粉丝</dt>
            <dd>0</dd>
          </dl>
          <dl>
            <dt>喜欢</dt>
            <dd>0</dd>
          </dl>
          <dl>
            <dt>评论</dt>
            <dd>0</dd>
          </dl>
        </div>
        <div class="box3">
          <Card :bordered="false">
            <p slot="title">归档</p>
            <p>2019年4月</p>
          </Card>
        </div>
      </div>      
<!----------------------------------------------------------------------------------------->
      <div class="right-box">
        <div>
          <ul class="articl-list">
            <li v-for="item in article" v-bind:key="item._id"> <!-- key必须且值唯一 -->
              <h2>{{item.title}}</h2>
              <p class="content">{{item.value}}</p>   <!--文章内容-->
              <div class="article-attribute">
                <span style="color:#6b6b6b">{{item.publishtime}}</span>
                丨
                <span>阅读数0</span>
                丨
                <span>评论数0</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      article:[]
    }
  },
  created(){
    this.findArticles();
  },
  methods:{
    findArticles(){
      //发起ajax读取数据库中当前用户的文章
      this.$axios.get("/dofindarticles",{
        params:{
          'author': this.$store.state.username
          }
        }).then(result =>{
          if(result.data.err1){
            this.$Message.error('内部服务器错误！');
          }else{
            this.article = result.data;
          }
        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#app{
  width: 100%;
  height: 599px;
  background-image: url(../../assets/images/bg-02.jpg);
  background-attachment: fixed;  /* 设置背景图片固定，不随页面滚动 */
}
.title-blog{
  height: 100px;
  line-height: 100px;
  color: #ffa200;
}
.container{
  width:1200px;
  margin: 0 auto;
}


/* 左边第一个盒子 */
.left-box{
  width: 300px;
  height: 180px;
  background-color: white;
  float: left;
}
.left-box .box1{
  padding: 15px;
  height:50px;
}
.left-box .box1 span{
  height: 50px;
  line-height: 50px;
  display: inline-block;
  color: #3d3d3d;
  font-weight: 700;
  overflow: hidden;
  font-size: 18px;
  width: 150px;
  margin-left: 10px;
  font-family: "微软雅黑";
  word-wrap: break-word;/*允许长单词换行到下一行*/
}
.avatar{
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
/* 左边第二个盒子 */
.left-box .box2{
  padding: 15px;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  height:50px;
  display: flex;
  flex-direction: row;  /*横向从左到右排列==左对齐*/
  justify-content:space-around;  /*两端间距对齐*/
}
.left-box .box2 dd{
  font-weight: 600;
  color:#3d3d3d;
}
.left-box .box3{
  margin-top: 40px;
  background-color: white;
}
.ivu-card-head {  /*卡片头样式*/
  border-bottom: 1px solid #e8eaec;
  padding: 12px 16px;
  line-height: 1;
  background-color: #f8f8f8;
}

/* 右边文章列表部分 */
.right-box{
  width: 890px;
  height: 200px;
  float: right;
}
.right-box .articl-list li{
  list-style: none;
  background-color: #fff;
  border-bottom: 1px solid black;
  padding: 12px 24px 12px 24px;
  font-family: "微软雅黑";
}
.right-box .articl-list li h2{
  margin-bottom: 6px;
  font-size: 18px;
  line-height: 24px;
  color: #3d3d3d;
  display: inline-block;
}
.right-box .articl-list li .content{
  color: #999;
  font-size: 14px;
}
.right-box .articl-list li .article-attribute{
  color: #999;
  font-size: 14px;
  padding-top:6px;
}
</style>
