var db = require("../models/db.js");
var md5 = require("../models/md5.js");


//注册业务实现
exports.doRegister = function(req,res){
  var phone = req.query.phone;
  var username = req.query.username;
  var password = req.query.password;
  
  // 首先查询这个用户名是否注册过了
  db.find("blogsystem","users",{"username":username},function(err,result){
    if(err){
      res.send('{"err2":"服务器错误"}'); //服务器错误
      return;
    }
    if(result.length !=0 ){
      res.send('{"err1":"用户名已被注册"}'); //用户名已被注册
      return;
    }
    // 如果此用户名没有注册过，再查询手机号是否被注册过
    db.find("blogsystem","users",{"phone":phone},function(err2,result2){
      if(err2){
        res.send('{"err2":"服务器错误"}'); //服务器错误
        return;
      }
      if(result2.length !=0 ){
        res.send('{"err3":"此手机号已被注册"}'); //此手机号已被注册
        return;
      }
      //如果用户名和手机号都没被注册过,就插入数据库
      //先进行md5密码加密
      password = md5(password);
      db.insertOne("blogsystem","users",{
          "phone":phone,
          "username":username,
          "password":password,
          "avatar":'default_avatar.jpg'
        },function(err3,result3){
          if(err3){
              res.send('{"err2":"服务器错误"}'); //服务器错误
              return;
          }
          res.send('{"success":"true"}'); //登录状态为true
        });
      });
  });
};





//登录业务实现
exports.doLogin = function(req,res,next){
  var username = req.query.username;
  var password = req.query.password;
  
  db.find("blogsystem","users",{"username":username},function(err,result){
    if(err){
      res.send('{"err1":"服务器错误"}'); //服务器错误
      return;
    }
    if(result.length == 0){
      res.send('{"err2":"用户名不存在"}'); //用户名不存在
      return;
    }
    //如果用户存在，就查询数据库比对密码
    //设置md5加密，因为注册时加过密
    password = md5(password);
    if(password == result[0].password){
      res.end('{"success":"true"}');
    }else{
      res.send('{"err3":"密码错误"}');
      return;
    }
  });
}





//发布文章业务实现
exports.doPublishArticle = function(req,res){
  var title = req.query.title;
  var value = req.query.value;
  var author = req.query.author;

  db.insertOne("blogsystem","articles",{
    "title":title,
    "value":value,
    "author":author
  },function(err,result){
    if(err){
        res.send('{"err1":"服务器错误"}'); //服务器错误
        return;
    }
    res.send('{"success":"true"}'); 
  });
}





//发布文章业务实现
exports.doFindArticles = function(req,res){
  var author = req.query.author;
  
  db.find("blogsystem","articles",{"author":author},function(err,result){
    if(err){
        res.send('{"err1":"服务器错误"}'); //服务器错误
        return;
    }
    res.send('{"status":0,"data":'+ result +'"}'); 
  });
}