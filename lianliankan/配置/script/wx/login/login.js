var urls = require('../config/config').urls
var config = require('../config/config')
var util = require('../utils/util');
var userOperate = require('../userOperate/userOperate');
userOperate = new userOperate();
// 获取用户信息
const getUseInfo = function(){
  if(cc.sys.platform == cc.sys.WECHAT_GAME){
      wx.getUserInfo({
          success:res=>{
              console.log(res)
              config.userInfo = res.userInfo            
              userOperate.setUserInfo()
          },
      })
  }
}();

const login = function (code, success,fail) {
  // var param = {
  //   appid: config.config.appid,
  //   logintype: "wxin",
  //   noncestr: util.randomString(),
  // };
  // param["appsign"] = util.sign(param);
  // param["js_code"] = code;
  var param = config.getParam();
  param["appsign"] = util.sign(param);
  param["uid"] = config.useName;
  param["js_code"] = code;
  util.request({
    url: urls.login,
    data: param,
    success: function (res) {
      console.log(res)
      var d = res.data;
      if (d && (d.ecode == 0 || d.ecode == 2)) {
        if(res.data["uid"]){
          config.UID = res.data["uid"] ;
        }
        if (success && typeof success == 'function') success();
      } else {
        var msg = "server login fail." + JSON.stringify(res);
        if (fail && typeof fail == 'function') fail();
        // wx.reportAnalytics("login_error", {
        //   "server_login_error": msg
        // });
       // console.log(msg);
      }
    },
    fail: function (er) {
      console.error(er);
    }
  });
}
module.exports = {
  login: login,
}