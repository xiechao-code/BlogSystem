<template>
  <div id="app">
    <a name="backtop" href="javascript:void()"></a>
    <div class="container">
      <h1 class="title-blog">{{username}} 的博客</h1>
<!----------------------------------------------------------------------------------------->
      <div class="left-box">
        <div class="box1">
          <router-link to="/usercenter"><img class="avatar" src="../../assets/avatar/avatar01.jpg" alt="avatar" title="去往个人中心"></router-link>
          <span>{{username}}</span>
        </div>
        <divider />
        <div class="box2">
          <dl>
            <dt>原创</dt>
            <dd>{{original_count}}</dd>
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
            <dd>{{comment_count}}</dd>
          </dl>
        </div>
        <div class="box3"  v-show="!flag">
          <Card :bordered="false">
            <p slot="title">热门文章</p>
            <p class="hot_article" v-for="item in article" v-bind:key="item._id">
                <router-link :to="'/Articledetails/' + item._id">
                  {{item.title}}
                </router-link><br>
                <span>阅读数：{{item.count_read}}</span>
            </p>
            <div class="" v-show="flag">这家伙很懒，什么都没写~~~</div>
          </Card>
        </div>
        <!-- 二维码 -->
        <div class="box4">
          <div class="QR-code">
            <div class="QR-code1">
              <a href="http://www.github.com/xiechao-code" target="_blank">
                <img src="../../assets/images/Github.png">
              </a>
              <p>Github</p>
            </div>
            <div class="QR-code2">
              <a href="http://www.gitee.com/xiechao_code" target="_blank">
                <img src="../../assets/images/Gitee.png">
              </a>
              <p>Gitee</p>
            </div> 
          </div>
          <div class="box-info">
            <p>
              <a href="http://www.cyberpolice.cn/" target="_blank">网路110报警服务</a><br>
              <a href="http://www.cdjubao.gov.cn/" target="_blank">成都互联网违法和不良信息举报中心</a><br>  
            </p>
            <p>
              <a href="http://www.12377.cn/" target="_blank">中国互联网举报中心</a><br>
              <a href="https://download.csdn.net/index.php/tutelage/" target="_blank">家长监护</a>
            </p>
          </div>
        </div>
      </div>      
<!----------------------------------------------------------------------------------------->
      <div class="right-box">
        <div>
          <ul class="articl-list" >
            <li class="top-li">
              <span @click="showOriginal"><Checkbox v-model="single"> 只看原创</Checkbox></span>
              <div class="sort-type">
                <span>排序:</span>
                <a href="javascript:void(0);" class="one" @click="changeSortType('publishtime')">按更新时间 (默认)</a >
                <a href="javascript:void(0);" class="two" @click="changeSortType('count_read')">按访问量</a >
                <router-link to="/Manageblog"><Button icon="md-settings" size="small">管理博客</Button></router-link>
              </div>
            </li>
            <li v-for="item in article" v-bind:key="item._id"> <!-- key必须且值唯一 -->
                <!-- 文章标题 -->
                  <h2>
                    <router-link :to="'/Articledetails/' + item._id">
                      <span class="article-type">{{item.article_type}}</span>&nbsp;{{item.title}}
                    </router-link>
                  </h2>
                <!--文章内容-->
                  <router-link :to="'/Articledetails/' + item._id">
                    <div class="content">{{ToText(item.input)}}</div>
                  </router-link> 
                <!--文章属性-->  
                  <div class="article-attribute">
                    <span style="color:#6b6b6b">发布于:<Time :time="item.publishtime" :interval="1" /></span>
                    丨
                    <span>阅读数<span class="badge">{{item.count_read}}</span></span>
                    丨
                    <span>评论数<span class="badge" style="background-color:#5cb85cd4">{{item.count_comment}}</span></span>
                  </div>
                <!--文章操作按钮-->
                  <div class="article-option" >
                    <div>
                    <Button type="warning" size="small" ghost><router-link :to="'/Newnote/' + item._id" tag="span">编辑</router-link></Button>
                    <Button type="error" size="small" ghost @click="delete_article(item._id)">删除</Button>
                    </div>
                  </div>
            </li>
          </ul>
          <div class="null" v-show="flag">这家伙很懒，什么都没写~~~</div>
        </div>
        <Button type="error" long @click="showmore" class="more-btn">查看更多</Button>
        <a href="#backtop" id="backtopbtn" title="返回顶部"><Icon type="md-arrow-round-up" /></a>
      </div>
    </div>
  </div>
</template>

<script>
 
export default {
  data(){
    return{
      article:[],  //文章数组
      article2:[],  //原创文章数组
      single:false,  //只看原创选择框
      pageamount:'6', //文章显示条数,初始6条
      original_count:'0', //原创数
      flag:false,  //用于控制“这家伙很懒，什么都没写~~~”div显示
      sorttype:'publishtime' , //默认按照更新时间排序
      username:this.$store.state.username,
      articlecount:'', //用户所有文章数量
      comment_count:'0' //评论数
    }
  },
  created(){
    this.findArticles();  //查询此用户所有文章
    this.findOriginal();  //查询用户所有原创文章
    this.getArticleCount();  //查询用户所有文章，不限制查询条数，主要用于得到文章条数
    this.findArticleComment();
  },
  methods:{
    findArticles(){
      this.$Message.config({  //设置iview警告框距离顶部的距离
        top: 300
      });
      const msg = this.$Message.loading({
                    content: '拼命加载中...',
                    duration: 0
                });
      //发起ajax读取数据库中当前用户的文章
      this.$axios.get("/dofindarticles",{
        params:{
          'author': this.$store.state.username,
          'pageamount':this.pageamount,
          'sorttype':this.sorttype
          }
        }).then(result =>{
          if(result.data.err1){
            this.$Message.error('内部服务器错误！');
          }else{
            setTimeout(msg,0); //后台数据返回，关闭加载中提示框
            if(result.data.length!=0){
              this.article = result.data;
              this.$store.state.article = result.data;  //将文章数组存入store仓储，共多个页面使用
            }else if(result.data.length==0){
              this.flag = true;
              this.article = result.data;
            }
          }
        })
    },
    findOriginal(){  //查询原创文章
      this.$axios.get("/doshoworiginal",{
        params:{
          'author': this.$store.state.username,
          'pageamount':'50'
          }
        }).then(result =>{
          if(result.data.err1){
            this.$Message.error('内部服务器错误！');
          }else{
            this.article2 = result.data;
            this.original_count = this.article2.length;
          }
        })
    },
    findArticleComment(){  //查询用户评论
      this.$axios.get("/dofindarticlecomments",{
        params:{
          'author': this.$store.state.username,
          }
        }).then(result =>{
          if(result.data.err1){
            this.$Message.error('内部服务器错误！');
          }else{
            this.comment_count = result.data.length;
          }
        })
    },
    showOriginal(){  //只显示原创
      this.single = !this.single;
      if(this.single==true){
        this.article = this.article2;
      }else{
        this.findArticles();
      }  
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
    },
    showmore(){  //点击查看更多按钮
      this.$Notice.config({
        top:600
      });
      this.pageamount = this.pageamount+6;
      if(this.article.length == this.articlecount){  //如果当前已显示的文章条数等于总的条数
        this.$Notice.info({
          title: '告诉你，我是有底线的！',
        });
      }else{
        this.findArticles();
      } 
    },
    changeSortType(sorttype){  //改变排序方式
      this.sorttype = sorttype;
      this.findArticles();
    },
    getArticleCount(){  //得到文章条数
      this.$axios.get("/getarticlecount",{
            params:{
              'author': this.$store.state.username
            }
          }).then(result =>{
            if(result.data.err1){
              this.$Message.error('该服务器错误！');
            }
            this.articlecount = result.data.length;
      })
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
/* 左边第三个盒子 */
.left-box .box3{
  margin-top: 40px;
  background-color: white;
  height: 332px;
  overflow: hidden;
}
.left-box .box3 .hot_article{
  margin-bottom: 8px;
  line-height: 18px;
}
.left-box .box3 .hot_article a{
  color: #ffa200;
}
.left-box .box3 .hot_article span{
  font-size: 12px;
  color: #8c8c8c;;
}
.ivu-card-head {  /*卡片头样式*/
  border-bottom: 1px solid #e8eaec;
  padding: 12px 16px;
  line-height: 1;
  background-color: #f8f8f8;
}


/* 左边第四个盒子 */
.left-box .box4{
  margin-top: 10px;
  background-color: white;
  height: 300px;
  padding: 25px;
}
.left-box .box4 .QR-code{
  height: 120px;
}
.left-box .box4 .QR-code .QR-code1{
  width: 100px;
  height:100px;
  float: left;
  border: 1px solid #ccc;
  padding: 2px;
  text-align: center;
  font-size: 16px;
  color: #524949;
}
.left-box .box4 .QR-code .QR-code2{
  width: 100px;
  height:100px;
  float: right;
  border: 1px solid #ccc;
  padding: 2px;
  text-align: center;
  font-size: 16px;
  color: #524949;
}
.left-box .box4 .QR-code img{
  width:100%;
}
.left-box .box4 .box-info{
  margin-top: 20px;
  border-top: 1px solid #ddd;
  padding: 10px 0;
  line-height: 25px;
}
.left-box .box4 .box-info a{
  color: #656565;
  font-size: 14px;
}
.left-box .box4 .box-info a:hover{
  color:#ffa200;
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
  padding: 12px 24px 14px 24px;
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
.sort-type {      /*排序按钮*/
  font-size:14px;
}
.sort-type a{
  margin-left: 30px;
}
.sort-type a:link{
  color:#525252;
}
.sort-type a:visited{
  color:#ffa202;
}
.sort-type a:hover{
  color:#ffa202;
}
.right-box .articl-list li .article-type{  /*原创小徽标*/
  color: #ca0c16;
  border: 1px solid #f4ced0;
  font-size: 12px;
  border-radius: 15%;
  position: relative;
  top: -2px;
  padding: 1px;
}
::-webkit-scrollbar {  /*隐藏滚动条*/
     width: 0 !important;
}
#backtopbtn{
  font-size: 20px;
  color: #fff;
  position: absolute;
  right: 30px;
  bottom:30px;
  width: 45px;
  height: 45px;
  background-color: #000;
  text-align: center;
  line-height: 45px;
}
.null{  /*显示什么都没写的div*/
  height: 400px;
  background-color: #fff;
  margin-top: 1px;
  text-align: center;
  line-height: 400px;
  font-size: 30px;
  color: #ff5e00;
  font-family: "微软雅黑";
  font-weight: bold;
}
.more-btn{
  margin-bottom: 25px;
  color: #262626;
  background-color: #ffffff;
  border-color: #fefefe;
  border-radius: 0;
}
.more-btn:hover{
  text-decoration: none;
  background-color: #ffb83d;
  border-color: #ffb83d;
}
</style>
