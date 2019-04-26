<template>
  <div class="cmt-container">
    <div v-show="islogin">  <!---->
      <Avatar src="https://i.loli.net/2017/08/21/599a521472424.jpg" />
      <Input class="textarea" v-model="value" type="textarea" placeholder="想对作者说点什么..." />
      <Button class="btn" type="error" @click="publishComment">发表评论</Button>
    </div>
    <!-- 评论的内容 -->
    <div class="cmt-list">
      <div class="cmt-item" v-for="(item,i) in comments" v-bind:key="item._id" >
        <Avatar class="avatar" src="https://i.loli.net/2017/08/21/599a521472424.jpg" />
        <span class="content">
          <span class="author">{{item.author}}：</span> 
          {{item.content}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <span class="time">(发布于：<Time :time="item.publishtime" :interval="1" />&nbsp;&nbsp;&nbsp;&nbsp;{{i+1}}楼)</span>  <!--iview时间戳-->
        </span>
        <span class="icon" @click="thumbsup(item._id)"><Icon @click="changeColor($event)" type="md-thumbs-up" /></span>
      </div>
    </div>
    <div class="info" v-show="flag">当前还没有人评论~~~</div>
  </div>
  
</template>

<script>

export default {
  data(){
    return{
      value:'',  //输入的评论内容
      comments:[],
      flag:false,  //用于控制显示没有评论时的div
      islogin:this.$store.state.islogin,
      flag2:true
    }
  },
  created(){
    this.getComments();
  },
  methods:{
    getComments(){  //一进入页面就请求此文章的评论
      this.$axios.get("/dofindcomments",{
        params:{
          'article_id':this.id
        }
      }).then(result=>{
        if(result.data.err1){
          this.$Message.error('内部服务器错误!');
        }else{
          this.comments = result.data;
          if(this.comments == ''){
            this.flag = !this.flag;
          }
        }
      })
    },
    publishComment(){  //点击发表评论,将此文章id,发表评论的作者名和评论内容一起发送到后台
      this.$Message.config({  //设置iview警告框距离顶部的距离
          top: 300
      });
      if(this.value!=''){
        this.$axios.get("/dopublishcomment",{
        params:{
          'article_id':this.id,  //父组件传过来的被评论文章id
          'author':this.$store.state.username,
          'content':this.value
          }
        }).then(result=>{
          if(result.data.err1){
              this.$Message.error('内部服务器错误！');
          }
          if(result.data.success){
              this.value = '';  //评论发布，清空输入框
              this.$Message.success('评论发布成功！');
              this.getComments();
              this.flag = false;
          }
        })
      }else{
        this.$Notice.warning({
            title: '评论内容不能为空！'
        });
      }  
    },
    thumbsup(commentid){  //评论点赞
      this.$axios.get("/doaddthumbsup",{
        params:{
          'comment_id':commentid
        }
      }).then(result=>{
        if(result.data.err1){
          this.$Message.error('内部服务器错误!');
        }
      })
    },
    changeColor(event){  //点赞改变小手的颜色
      var el = event.currentTarget;  //vue中获取当前点击dom元素
      el.style.color='rgb(189, 0, 0)';
    }
  },
  props:["id"] //从父组件Articledetails中传递过来的id,用this.id使用
}
</script>

<style scoped>
.cmt-container{
  background-color:#fff;
  padding:20px;
  margin-top: 1px;
  margin-bottom: 20px;
}
.textarea{
  width: 94%;
  margin-left: 10px;
}
.btn{
  margin-top: 8px;  
  margin-left: 785px;
}
.cmt-list .cmt-item{
  padding:5px;
  border-left:2px solid #ffae5a;
  font-size: 14px;
  margin-top: 8px;
  border-bottom: 1px dashed #e0e0e0;
  position: relative;
}
.info{
  font-size: 14px;
  text-align: center;
  color: #737373;
}
.cmt-list .cmt-item .author{
  display: inline-block;
  font-weight: bold;
  font-family: "华文行楷";
  font-size: 18px;
  color: #424242;
}
.cmt-list .cmt-item .content{
  display: inline-block;
  width: 700px;
  margin-left: 40px;
}
.cmt-list .cmt-item .avatar{
  position: absolute;
  top: 4px;
  width: 24px;
  height: 24px;
  line-height: 24px;
}
.cmt-list .cmt-item .time{
  font-style:italic;
  color: #b9b9b9;
  font-size: 12px;
}
.cmt-list .cmt-item .icon{
  display: inline-block;
  font-size: 20px;
  color: #a0a0a0;
  position: absolute;
  right: 0;
  top: 0;
  transition:all 1s;
}
.cmt-list .cmt-item .icon:hover{
  color:rgb(189, 0, 0);
  cursor:pointer;
}
</style>

