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
          <h2>{{article_title}}</h2>
          <p></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      article_title:""
    }
  },
  created(){
    // this.findArticles();
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
          }
          if(result.data.status==0){
              this.article_title = result.data.data.title;
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
.right-box{
  width: 890px;
  height: 200px;
  background-color: white;
  float: right;
}
.avatar{
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
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
</style>
