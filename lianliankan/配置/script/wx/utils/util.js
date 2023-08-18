var tokenMgr = require('tokenMgr');
var urls = require('../config/config').urls;
var md5 = require('md5');
var config = require('../config/config');

const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

const randomStr = n => { 
    const chars = "0123456789abcdefghijklmnopqrstuvwxyz".split('');
    var res = "";
    for (var i = 0; i < n; i++) {
        res = res + chars[(Math.random() * 1e3 | 0) % chars.length];
    }
    return res;
}

const request = p => {
    var url = p.url;
    var data = p.data || {};
    var header = p.header || {};
    var method = p.method || 'GET';
    var dataType = p.dataType || "";
    var success = p.success || function(res) {};
    var fail = p.fail || function(err) {};
    var complete = p.complete || function() {};
    if (tokenMgr.checkToken()) {
        header.token = tokenMgr.getToken();
    }
    console.log(url,p,header.token)
    wx.request({
        url: url,
        data: data,
        header: header,
        method: method,
        dataType: dataType,
        success: function(res) {
            if(res.data["token"]){                
                tokenMgr.setToken(res.data.token);
            }
             success(res);
        },
        fail: function(res){
          console.log("fail",res)
        },
        complete: complete
    })
}

const key = config.config.appsecret;
const appId = config.config.appid;

/**
 * 微信支付签名
 * @param {*代签名object} p
 */
const sign = p => {
    var list = new Array();
    for (var item in p) {
        var type = typeof p[item];
        if (type == "string" || type == "number") {
            var tmp = item + "=" + p[item];
            list.push(tmp);
        }
    }
    list.sort(function(o0, o1) {
        return o0 > o1;
    });
    list.push("key=" + key);
    var res = list.join("&");
    console.log("sign_source:" + res);
    return md5.md5(res);
}

const getXMLNodeValue = function(node_name, xml) {
    console.log("xml:" + xml);
    var tmp = xml.split("<" + node_name + ">")
    var _tmp = tmp[1].split("</" + node_name + ">")
    return _tmp[0]
};

const randomString = function() {
    var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    var maxPos = chars.length;
    var pwd = '';
    for (var i = 0; i < 32; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
};

const createTimeStamp = function() {
    return parseInt(new Date().getTime() / 1000) + ''
};

/**
 * 微信支付
 * @param {*} fee 支付额度，单位分
 * @param {*} success 支付成功
 * @param {*} fail 支付失败
 * @param {*} complete 支付完成
 */
const _pay = function(fee, success, fail, complete) {
    fee = fee || 1;
    success = success || function(res) {};
    fail = fail || function() {};
    complete = complete || function() {};

    const url_unifiedOrder = urls.unifiedOrder;
    const wx_unifiedOrder = "https://api.mch.weixin.qq.com/pay/unifiedorder";
    this.request({
        url: url_unifiedOrder,
        data: {
            fee: fee
        },
        success: function(res) {
            console.log("UNIFIEDORDER:" + JSON.stringify(res));
            wx.request({
                url: wx_unifiedOrder,
                data: res.data,
                method: "POST",
                success: function(res) {
                    var xml = res.data;
                    var return_code = getXMLNodeValue('return_code', xml.toString("utf-8"));
                    var returnCode = return_code.split('[')[2].split(']')[0];
                    if (returnCode == 'FAIL') {
                        var err_code_des = getXMLNodeValue('err_code_des', res.data.toString("utf-8"))
                        var errDes = err_code_des.split('[')[2].split(']')[0]
                        fail();
                    } else {
                        var prepay_id = getXMLNodeValue('prepay_id', res.data.toString("utf-8"));
                        var tmp = prepay_id.split('[');
                        var tmp1 = tmp[2].split(']');
                        var timeStamp = createTimeStamp(); //时间戳
                        var nonceStr = randomString(); //随机数
                        var dat = {
                            appId: appId,
                            nonceStr: nonceStr,
                            package: "prepay_id=" + tmp1[0],
                            signType: "MD5",
                            timeStamp: timeStamp,
                        };
                        dat.paySign = sign(dat).toUpperCase();
                        wx.requestPayment({
                            timeStamp: dat.timeStamp,
                            nonceStr: dat.nonceStr,
                            package: dat.package,
                            signType: dat.signType,
                            paySign: dat.paySign,
                            success: success,
                            fail: fail,
                            complete: complete
                        });
                    }
                },
                fail: function() {},
                complete: function() {}
            });
        },
        fail: function() {},
        complete: function() {}
    });
}

/**
 * 微信支付
 * @param {*} fee 支付额度，单位分
 * @param {*} success 支付成功
 * @param {*} fail 支付失败
 * @param {*} complete 支付完成
 */
const pay = function (fee, success, fail, complete) {
  fee = fee || 1;
  success = success || function (res) { };
  fail = fail || function () { };
  complete = complete || function () { };

  this.request({
    url: urls.pay,
    method: "POST",
    data: {
      fee: fee
    },
    success: function (res) {
        var d = res.data;
        console.log("pay response:" + JSON.stringify(d));
        if (d && d.ecode == 0)
        {
          var dat = d.data.args;
          console.log(dat)
          wx.requestPayment({
            timeStamp: dat.timeStamp,
            nonceStr: dat.nonceStr,
            package: dat.package,
            signType: dat.signType,
            paySign: dat.paySign,
            success: success,
            fail: fail,
            complete: complete
          });
        }
    },
    fail: function () { },
    complete: function () { }
  });
}



module.exports = {
    formatTime: formatTime,
    randomStr: randomStr,
    randomString: randomString,
    request: request,
    sign: sign,
    pay: pay,

}