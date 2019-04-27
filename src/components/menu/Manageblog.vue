<template>
  <div id="app">
    <div class="container">
      <Alert show-icon closable>公告：本博客系统相关功能，敬请等待完善！</Alert>
      <div>
        <div class="content"></div>
        <Row >
          <div>
              <Tabs type="card">
                  <TabPane label="文章管理" class="tab_1">
                    <li v-for="item in article" v-bind:key="item._id"> <!-- key必须且值唯一 -->
                     <!-- 文章标题 -->
                      <h2>
                        <router-link :to="'/Articledetails/' + item._id" class="title">
                          {{item.title}}
                        </router-link>
                      </h2>
                     <!--文章属性-->  
                      <div class="article-attribute">
                        <span >{{item.article_type}}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                        <span >发布于:<Time :time="item.publishtime" :interval="1" /></span>
                        丨
                        <span>阅读数<span class="badge">{{item.count_read}}</span></span>
                        丨
                        <span>评论数<span class="badge">{{item.count_comment}}</span></span>
                        <div class="options">
                          <router-link :to="'/Articledetails/' + item._id">查看</router-link>丨
                          <span @click="delete_article(item._id)">删除</span>
                        </div>
                      </div>
                    </li>
                  </TabPane>
                  <TabPane label="评论管理">
                    <div>
                      <h2>我的文章评论</h2>
                    </div>
                  </TabPane>
                  <TabPane label="个人分类管理">
                    <Input v-model="value" placeholder="输入分类" style="width:300px"/>
                    <Button type="primary">添加分类</Button>
                  </TabPane>
                  <Button  size="small" slot="extra"><router-link to="/Myblog">查看主页</router-link></Button>
                  <Button  size="small" slot="extra"><router-link :to="'/Newnote/' + 0">Markdown编辑器</router-link></Button>
              </Tabs>
          </div>
        </Row>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      article:[],
      value:''
    }
  },
  created(){
    this.getArticle();
  },
  methods:{
    getArticle(){
      this.article = this.$store.state.article;  //注意：刷新页面会使状态管理器失效
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
              this.$Message.success('文章已删除！');
            }
          })
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
#app .container{
  width: 1000px;
  margin:0 auto;
  height: 800px;
  background-color:#fff;
  padding-top: 20px;
}
.tab_1{
  padding: 15px;
}
.tab_1 li{
  list-style: none;
  line-height: 30px;
  border-bottom: 1px dotted  #ddd;
  padding: 10px 0;
}
.article-attribute{
  color: #aaaaaa;
}
.title{
  font-weight: 500;
  color:#4f4f4f;
}
.title:hover{
  color:#ff7300;
}
.options{
  float: right;
}
.options span{
  color: darkred;
  cursor:pointer;
}
</style>
