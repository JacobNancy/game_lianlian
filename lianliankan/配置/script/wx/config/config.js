
const base_url = "https://gamecenter.phonecoolgame.com";

var url_login = base_url + "/login"; //用户登录
var url_user = base_url + "/user"; //用户信息
var url_hongbao = base_url + "/hongbao"; //红包信息
var url_pay = base_url + "/pay/unifiedOrder"; //支付
//var config_appid = "wx883487a153f7db2a";
//var config_appsecret = "6873f4ccbfe3f36f2ee3a0a8566fe023";
var config_appid = "wx6f71b573a7454d2f";
var config_appsecret = "d885975acfe0f15a2856c7caee6555d4";

//loading Scene
var loginScene = "loading"; // 登录 scene
var rankTag= 2005; // 排行榜target
const getParam = function(){
    var util = require('../utils/util')
    return {
        appid: config_appid,
        logintype: "freein",
        noncestr: util.randomString(),
      };
}

module.exports = {
    urls: {
        login: url_login,
        user: url_user,
        hongbao: url_hongbao,
        pay: url_pay
    },
    config: {
        appid: config_appid,
        appsecret: config_appsecret
    },
    getParam:getParam,
    
    userInfo:'',
    loginScene:loginScene,
    rankTag:rankTag,
    //暂时替代资源
    useName:'',
    UID :'',

}