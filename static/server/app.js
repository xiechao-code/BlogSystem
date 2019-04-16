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