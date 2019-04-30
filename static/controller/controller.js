var db = require("../models/db.js");
var md5 = require("../models/md5.js");
var sd = require("silly-datetime"); //时间格式化
var mongoose = require("mongoose"); //将字符将id转换为mongodb的ObjectID型需要的包
var formidable = require("formidable");  //导入处理文件上传的管理模块
var path = require("path");  //用于上传头像保存文件
var fs = require("fs");


//注册业务实现
exports.doRegister = function(req,res){
  var phone = req.query.phone;
  var username = req.query.username;
  var password = req.query.password;
  var ttt = sd.format(new Date(),'YYYY/MM/DD HH:mm:ss');
  
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
          "avatar":'default_avatar.jpg',
          "registertime":ttt
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
  var input = req.query.input;
  var ttt = sd.format(new Date(),'YYYY/MM/DD HH:mm:ss');
  var article_type = req.query.article_type;
  var blog_type = req.query.blog_type;

  db.insertOne("blogsystem","articles",{
    "title":title,
    "value":value,
    "input":input,
    "author":author,
    "publishtime":ttt,
    "count_read":0,
    "count_comment":0,
    "article_type" :article_type,
    "blog_type":blog_type
  },function(err,result){
    if(err){
        res.send('{"err1":"服务器错误"}'); //服务器错误
        return;
    }
    res.send('{"success":"true"}'); 
  });
}





//查询全部所有用户文章业务实现,只查询最新的15条文章显示
exports.doFindAllArticles = function(req,res){
  
  db.find("blogsystem","articles",{},{"pageamount":15,"sort":{"publishtime":-1}},function(err,result){
    if(err){
        res.send('{"err1":"服务器错误"}'); //服务器错误
        return;
    }
    res.send(result); 
  })
}





//查询某个用户的所有文章业务实现
exports.doFindArticles = function(req,res){
  var author = req.query.author;
  var pageamount = req.query.pageamount;
  var sorttype = req.query.sorttype;

  if(sorttype == 'publishtime'){
      //默认显示5条文章，以时间倒序排序
    db.find("blogsystem","articles",{"author":author},{"pageamount":pageamount,"sort":{"publishtime":-1}},function(err,result){
      if(err){
          res.send('{"err1":"服务器错误"}'); //服务器错误
          return;
      }
      res.send(result); //结果是一个数组对象[ { _id: 5cb5aa2bfdc24d20c4802a42,title: '测试1',value: '# 标题\n内容',author: '张松' } ]
    })
  }else if(sorttype == 'count_read'){  //按照访问量排序
    db.find("blogsystem","articles",{"author":author},{"pageamount":pageamount,"sort":{"count_read":-1}},function(err,result){
      if(err){
          res.send('{"err1":"服务器错误"}'); //服务器错误
          return;
      }
      res.send(result); 
    })
  } 
}




//查询某个用户所有原创文章业务实现
exports.doShowOriginal = function(req,res){
  var author = req.query.author;
  var pageamount = req.query.pageamount;
  
  db.find("blogsystem","articles",{"author":author,"article_type":'原创'},{"pageamount":pageamount,"sort":{"publishtime":-1}},function(err,result){
    if(err){
        res.send('{"err1":"服务器错误"}'); //服务器错误
        return;
    }
    res.send(result); //结果是一个数组对象[ { _id: 5cb5aa2bfdc24d20c4802a42,title: '测试1',value: '# 标题\n内容',author: '张松' } ]
  })
}





//删除文章业务实现
exports.doDeleteArticle = function(req,res){
  var article_id = req.query.article_id;

  db.deleteMany("blogsystem","articles",{"_id":mongoose.Types.ObjectId(article_id)},function(err,result){
    if(err){
      res.send('{"err":"错误"}');
      return;
    }
    res.send("1"); //成功删除
  })
}





//修改一篇文章业务实现
exports.doUpdateArticle = function(req,res){
  var article_id = req.query.id;
  var title = req.query.title;
  var value = req.query.value;
  var author = req.query.author;
  var input = req.query.input;
  var ttt = sd.format(new Date(),'YYYY/MM/DD HH:mm:ss');
  
  db.updateMany("blogsystem","articles",{"_id":mongoose.Types.ObjectId(article_id)},{$set:{
    "title":title,
    "value":value,
    "input":input,
    "author":author,
    "publishtime":ttt,
    "count_read":0,
    "count_comment":0
  }},function(err,result){
    if(err){
        res.send('-1'); //服务器错误
        return;
    }
    res.send('1'); 
  })
}





//查询一篇文章业务实现
exports.doFindArticle = function(req,res){
  var article_id = req.query.id;
  
  db.find("blogsystem","articles",{"_id":mongoose.Types.ObjectId(article_id)},function(err,result){
    if(err){
        res.send('{"err1":"服务器错误"}'); //服务器错误
        return;
    }
    result[0].count_read++;  //阅读数加一
    db.updateMany("blogsystem","articles",{"_id":mongoose.Types.ObjectId(article_id)},{$set:{
      "count_read":result[0].count_read
    }},function(err,result){
      if(err){
          res.send('-1'); //服务器错误
          return;
      }
    })
    res.send(result); 
  })

}





//发布评论业务实现
//整个业务实现为，1.先通过被评论文章的id，查询文章表，得到此文章的评论数，然后加一；
//2.通过评论人的用户名查询用户资料表，得到此用户的昵称，用于显示谁做出的评论
//3.将评论数据插入评论表
//4.更新文章表的此文章的评论数
exports.doPublishComment = function(req,res){
  var article_id = req.query.article_id;
  var content = req.query.content;
  var author_cmt = req.query.author_cmt;  //发布评论的人
  var ttt = sd.format(new Date(),'YYYY/MM/DD HH:mm:ss');

  // 查询得到这篇文章的评论数，加一后更新
  db.find("blogsystem","articles",{"_id":mongoose.Types.ObjectId(article_id)},function(err,result1){
    if(err){
        res.send('{"err1":"服务器错误"}'); //服务器错误
        return;
    }
    db.find("blogsystem","userdata",{"username":author_cmt},function(err,result4){
      if(err){
          res.send('{"err1":"服务器错误"}'); //服务器错误
          return;
      }
      var nickname = result4[0].nickname;
      var author = result1[0].author;
    result1[0].count_comment++;  //评论数加一
    db.insertOne("blogsystem","comments",{
      "content":content,
      "author_cmt":nickname,  //评论这篇文章的作者的昵称
      "author":author,  //创作这篇文章的作者
      "publishtime":ttt,
      "article_id":article_id, //并非数据库自动创建的id，而是被评论文章的id
      "thumbsup_count":0
    },function(err,result3){
      if(err){
          res.send('{"err1":"服务器错误"}'); //服务器错误
          return;
      }
      db.updateMany("blogsystem","articles",{"_id":mongoose.Types.ObjectId(article_id)},{$set:{
        "count_comment":result1[0].count_comment
      }},function(err,result2){
        if(err){
            res.send('-1'); //服务器错误
            return;
        }
        res.send('{"success":"true"}');
      })
    });
    }) 
  })
}





//查询一篇文章的所有评论业务实现
exports.doFindComments = function(req,res){
  var article_id = req.query.article_id;
  db.find("blogsystem","comments",{"article_id":article_id},{"sort":{"publishtime":-1}},function(err,result){
    if(err){
        res.send('{"err1":"服务器错误"}'); //服务器错误
        return;
    }
    res.send(result); 
  })
}





//查询一个用户的所有评论业务实现
exports.doFindArticleComments = function(req,res){
  var author = req.query.author;
  db.find("blogsystem","comments",{"author":author},function(err,result){
    if(err){
        res.send('{"err1":"服务器错误"}'); //服务器错误
        return;
    }
    res.send(result); 
  })
}




//得到用户所有文章，不加条数限制
exports.getArticleCount = function(req,res){
  var author = req.query.author;

  db.find("blogsystem","articles",{"author":author},function(err,result){
    if(err){
        res.send('{"err1":"服务器错误"}'); //服务器错误
        return;
    }
    res.send(result); 
  })
};





//点赞
exports.doAddThumbsup = function(req,res){
  var comment_id = req.query.comment_id;

  db.find("blogsystem","comments",{"_id":mongoose.Types.ObjectId(comment_id)},function(err,result){
    if(err){
        res.send('{"err1":"服务器错误"}'); //服务器错误
        return;
    }
    result[0].thumbsup_count++;
    db.updateMany("blogsystem","comments",{"_id":mongoose.Types.ObjectId(comment_id)},{$set:{
      "thumbsup_count":result[0].thumbsup_count
    }},function(err,result){
      if(err){
          res.send('-1'); //服务器错误
          return;
      }
    })
    res.send(result); 
  })
};





//插入用户资料
exports.doChangeUserDate = function(req,res){
  var nickname = req.query.nickname;
  var truename = req.query.truename;
  var job = req.query.job;
  var sex = req.query.sex;
  var birthday = req.query.birthday;
  var Industry = req.query.Industry;
  var introduction = req.query.introduction;
  var username = req.query.username;
  var ttt = sd.format(birthday,'YYYY/MM/DD');

  db.find("blogsystem","userdata",{"username":username},function(err,result){
    if(err){
        res.send('{"err1":"服务器错误"}'); //服务器错误
        return;
    }
    if(result.length==0){
      db.insertOne("blogsystem","userdata",{
        'nickname':nickname,
        'truename':truename,
        'job':job,
        'sex':sex,
        'birthday':ttt,
        'Industry':Industry,
        'introduction':introduction,
        'username':username
      },function(err,resut){
        if(err){
          res.send('-1')
          return;
        }
        res.send('1');
      })
    }else{
      db.updateMany("blogsystem","userdata",{"username":username},{$set:{
        'nickname':nickname,
        'truename':truename,
        'job':job,
        'sex':sex,
        'birthday':ttt,
        'Industry':Industry,
        'introduction':introduction
      }},function(err,result){
        if(err){
          res.send('-1')
          return;
        }
        res.send('2');
      })  
    }
  }) 
}




//得到用户个人资料
exports.doFindUserData = function(req,res){
  var username = req.query.username;

  db.find("blogsystem","userdata",{"username":username},function(err,result){
    if(err){
        res.send('{"err1":"服务器错误"}'); //服务器错误
        return;
    }
    res.send(result); 
  })
};





//上传头像业务
exports.doSetAvatar = function(req,res){
  var form = new formidable.IncomingForm();
  //设置上传到哪个文件夹
  form.uploadDir = path.normalize(__dirname + "/../avatar");
  form.parse(req,function(err,fields,files){
    // console.log(fields); 输出为{ username: '谢超' } 文本内容。files为文件,如图片。
    //改名和添加后缀
    var oldpath = files.file.path;
    //前面部分是地址，后面是文件名
    var newpath = path.normalize(__dirname + "/../avatar") + "/" + fields.username + ".jpg";
    fs.rename(oldpath,newpath,function(err){
      if(err){
          res.send("上传失败!");
          return;
      }
      //更改数据库当前用户的avatar为上传的图片
      db.updateMany("blogsystem","users",{username:fields.username},{$set:{"avatar":fields.username + ".jpg"}},function(err,result){
          res.send("1");
      });
    });
  })
};




//得到用户头像
exports.doFindUsers = function(req,res){
  var username = req.query.username;

  db.find("blogsystem","users",{"username":username},function(err,result){
    if(err){
        res.send('{"err1":"服务器错误"}'); //服务器错误
        return;
    }
    res.send(result); 
  })
};