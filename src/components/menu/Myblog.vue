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
            <li class="top-li">
              <Checkbox v-model="single"> 只看原创</Checkbox>
              <router-link to="/Manageblog"><Button icon="md-settings" size="small">管理博客</Button></router-link>
            </li>
            <li v-for="item in article" v-bind:key="item._id"> <!-- key必须且值唯一 -->
                <!-- 文章标题 -->
                  <h2>
                    <router-link :to="'/Articledetails/' + item._id">
                      <span class="article-type">原</span>&nbsp;{{item.title}}
                    </router-link>
                  </h2>
                <!--文章内容-->
                  <router-link :to="'/Articledetails/' + item._id">
                    <div class="content">{{ToText(item.input)}}</div>
                  </router-link> 
                <!--文章属性-->  
                  <div class="article-attribute">
                    <span style="color:#6b6b6b">{{item.publishtime}}</span>
                    丨
                    <span>阅读数<span class="badge">{{item.count_read}}</span></span>
                    丨
                    <span>评论数<span class="badge" style="background-color:#5cb85cd4">{{item.count_comment}}</span></span>
                  </div>
                <!--文章操作按钮-->
                  <div class="article-option" >
                    <div>
                    <Button type="warning" size="small" ghost><router-link :to="'/Newnote/' + item._id">编辑</router-link></Button>
                    <Button type="error" size="small" ghost @click="delete_article(item._id)">删除</Button>
                    </div>
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
      article:[],  //文章数组
      single:false  //只看原创选择框
    }
  },
  created(){
    this.findArticles();  //查询所有文章
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
    },
    delete_article(id){ //删除文章
      this.$Modal.confirm({  //iview对话框
        title: "提示",
        content: "确定要删除当前文章？",
        onOk: () => {
          this.$axios.get("/dodeletearticle",{
            params:{
              'article_id':id
            }
          }).then(result =>{
            if(result.data.err){
              this.$Message.error('该服务器错误！');
            }
            if(result.data===1){
              this.$Message.success('该文章已删除！');
              this.findArticles(); //再调用一次获取文章可以实现局部刷新
            }
          })
        },
        onCancel: () => {
        return;
        }
      });
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
#app{
  width: 100%;
  height: 1000px;
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
  border-top: 1px solid black;
  padding: 12px 24px 12px 24px;
  font-family: "微软雅黑";
}
.right-box .articl-list li:hover{
  background-color: #f5f6f7;
}
.right-box .articl-list li h2{
  margin-bottom: 6px;
  font-size: 18px;
  line-height: 24px;
  display: inline-block;
}
.right-box .articl-list li h2 a{
  color: #3d3d3d;
  transition: color .1s ease;
}
.right-box .articl-list li h2 a:hover{
  color: #ec8329;
}
.right-box .articl-list li .content{
  color: #9a9a9a;
  font-size: 14px;
  height: 42px;
  white-space: normal;  /*文本自动处理换行*/
  letter-spacing:1px;
  /* 以下设置文本超出显示省略号 */
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.right-box .articl-list li .article-attribute{  /*文章的时间，阅读数，评论数*/
  color: #999;
  font-size: 14px;
  padding-top:8px;
  width: 400px;
  float: left;
}
.right-box .articl-list li .article-attribute .badge{ /*徽章*/
  display: inline-block;
  width: 24px;
  height: 16px;
  background: #ffb83c;
  border-radius: 8px;
  text-align: center;
  line-height: 16px;
  color: #fff;
  margin-left: 4px;
}
.right-box .articl-list li .article-option{  /*编辑删除操作按钮*/
  width: 100px;
  display: inline-block;
  position: relative;
  left: 355px;
  top: 6px;
  visibility: hidden;
}
.right-box .articl-list li:hover .article-option{ /*鼠标移到li里面，编辑删除按钮显示*/
  visibility:visible;
}
.right-box .articl-list .top-li{
  display: flex; /*弹性布局，垂直居中，两端对齐*/
  justify-content: space-between;
  align-items: center;
}
.right-box .articl-list li .article-type{  /*原创小徽标*/
  color: #ca0c16;
  border: 1px solid #f4ced0;
  display: inline-block;
  width: 26px;
  height: 26px;
  line-height: 26px;
  text-align: center;
  font-size: 12px;
  border-radius: 50%;
  position: relative;
  top: -1px;
}
</style>
