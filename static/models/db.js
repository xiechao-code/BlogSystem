//这个模块里封装了所有对数据库的常用操作
var MongoClient = require('mongodb').MongoClient;
//不管数据库的什么操作，都是先连接数据库，所以我们可以把连接数据库封装成为函数

//封装一个连接数据库的内部函数，提供给下面的函数使用
function _connectDB(callback){
    var url = 'mongodb://localhost:27017/';
    //连接数据库
    MongoClient.connect(url,{useNewUrlParser:true}, function(err, client) {
        if(err){
            console.log(err);
            callback(err,null);
            return;
        }
        // console.log("数据库连接成功！");
        callback(err,client); //把client参数暴露出去
    });
};



//封装插入数据函数
//向外暴露一个插入数据函数,提供给外部使用，接收 数据库名、集合名、数据参数
exports.insertOne = function(dbName,collectionName,json,callback){
    if(arguments.length!==4){
        console.log("insertOne函数需要接受4个参数！");
        return;
    }
    //调用数据库连接成功函数_connectDB（），取得 client 参数进行操作
    _connectDB(function(err,client){
        //获得要操作的数据库名
        var db = client.db(dbName);
        db.collection(collectionName).insertOne(json,function(err,result){
            callback(err,result);
            client.close();
        });
    });
};



//封装查询数据函数
//下面的参数分别是 数据库名、集合名、查询条件、C、D
exports.find = function(dbName,collectionName,json,C,D){
    if(arguments.length===4){
        //如果接受到的参数个数是4，那么就表示没有传{"pageamount":10,"page":page}的值，因为用户想显示所有查询
        //这时，就把C给callback,D没有传
        var callback = C;
        var skipnumber = 0;
        var limit = 0;
    }else if(arguments.length===5){
        //当传了5个参数，这时，就把C给args,D给callback
        var callback = D;
        var args = C;
        //应该省略的条数
        var skipnumber = args.pageamount * args.page || 0;
        //数目限制
        var limit = parseInt(args.pageamount) || 0;
        //排序方式
        var sort = args.sort || {};
    }else{
        throw new Error("find 函数的参数个数，必须是 4 个，或者 5 个！");
        return;
    }

    //连接数据库之后，进行查询操作
    _connectDB(function(err,client){

        var db = client.db(dbName);
        // toArray 可以将查询结果保存为一个数组
        //.sort({"id":1})可以对查询结果根据id排序，1为升序，-1为倒序
        //.skip() 表示忽略的数据
        //.limit() 表示限制输出几条数据
        //.sort() 表示排序方式，1正序，-1倒序
        db.collection(collectionName).find(json).skip(skipnumber).limit(limit).sort(sort).toArray(function(err,result) {
            callback(err,result); //外部可以通过回调得到result
            client.close();
        });
    });
};



//封装删除数据函数
exports.deleteMany = function(dbName,collectionName,json,callback){
    _connectDB(function(err,client){
        var db = client.db(dbName);

        db.collection(collectionName).deleteMany(json, function(err, result) {
            if(err){
                console.error(err);
            }else{
                //console.log("删除数据成功！");
                callback(err,result);
                client.close();
            }
        });
    });
};




//封装更新数据函数
exports.updateMany = function(dbName,collectionName,json1,json2,callback){
    _connectDB(function(err,client){
        var db = client.db(dbName);

        db.collection(collectionName).updateMany(json1,json2,function(err,result){
            if(err) throw err;
            //console.log("数据更新成功!");
            callback(err,result);
            client.close();
        });

    });
};