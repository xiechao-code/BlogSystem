var express = require("express");
var http = require("http");
var controller = require("../controller/controller.js");
var app = express();
// var session = require("express-session");

//跨域设置  后期删
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:8081"); //为了跨域保持session，所以指定地址，不能用*
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials', true); 
  next();
});


//使用session
// app.use(session({
//   secret: "keyboard cat",
//   resave: false,
//   saveUninitialized: true
// }));


app.get("/doregister",controller.doRegister); //注册业务
app.get("/dologin",controller.doLogin);  //登录业务
app.get("/dopublisharticle",controller.doPublishArticle);  //发布文章业务
app.get("/dofindarticles",controller.doFindArticles);  //查询用户的文章
app.get("/dodeletearticle",controller.doDeleteArticle);  //删除用户的文章
app.get("/dofindarticle",controller.doFindArticle);  //查询一篇文章
app.get("/doupdatearticle",controller.doUpdateArticle);  //修改一篇文章
app.get("/doshoworiginal",controller.doShowOriginal);  //只看原创
app.get("/dofindallarticles",controller.doFindAllArticles);  //查询所有文章
app.get("/dopublishcomment",controller.doPublishComment);  //发表评论
app.get("/dofindcomments",controller.doFindComments);  //查询一篇文章的所有评论
app.get("/dofindarticlecomments",controller.doFindArticleComments); //得到一个用户所有评论
app.get("/getarticlecount",controller.getArticleCount); //得到所有文章条数
app.get("/doaddthumbsup",controller.doAddThumbsup); //给评论点赞
app.get("/dochangeuserdate",controller.doChangeUserDate); //给评论点赞
app.get("/dofinduserdata",controller.doFindUserData); //给评论点赞
app.get("/dodeletecomments",controller.doDeleteComments); //删除评论
app.post("/dosetavatar",controller.doSetAvatar); //上传头像
app.get("/dofindusers",controller.doFindUsers); //上传头像

  


//以下为node程序异常捕获，如果不捕获，那么遇到异常node就会终止程序
process.on('uncaughtException', function (err) {    
  console.log(err); 
}); 
http.createServer(function(req, res){    
    try {       
       mvcHandler(req, res);    
      }catch(e){ 
        res.writeHead(200); 
        res.end('Server Error');} 
      }).listen(3030, "127.0.0.1"); 


app.listen(3030);
