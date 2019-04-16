var crypto = require("crypto");  //md5密码加密需要的包，node内置的
//模块整体向外暴露为一个函数，用于密码加密
module.exports = function (mingma) {
    var md5 = crypto.createHash("md5");
    var password = md5.update(mingma).digest("base64");
    return password;
};