///////////////////////////////////////////
//定义 用户操作  上传数据或拉取数据
/////////////////////////////////////////////

var urls = require('../config/config').urls
var config = require('../config/config')
var util = require('../utils/util');

//// 类版本 全局函数太多可以使用类版本
export default class userOperate {
  // 类似构成函数
  constructor(){

  }; 
  
    // 上传 分数
    setScore = function(_score){
        var url = urls.user +"/set_score"
        var param = {}//config.getParam();
        param["score"] = _score;
        util.request({
            url: url,
            data: param,
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            method: 'POST',
            success:res=>{
                console.log("setScore Success")
            }
        })
    }
    // 上传 个人数据
    setBlob = function(blob){
        var url = urls.user +"/set_blob"
        var param = {}//config.getParam();
        param["blob"] = blob;
        util.request({
            url: url,
            data: param,
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            method: 'POST',
        })
    }

    setUserInfo = function(){
        var url = urls.user +"/setuserinfo";
        var param = {};//config.getParam();
        //console.log(config.userInfo)
        param["portrait"] = config.userInfo.avatarUrl
        param["name"] = config.userInfo.nickName
        param["geo"] = config.userInfo.city
        util.request({
            url: url,
            data: param,
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            method: 'POST',
        })
    }
    // 获取 用户信息 
    /*res.data{
        createdate:"2018-01-23T07:53:22.647Z"
        getHongBaos:[]
        gold:-3023814
        name:"lll"
        portrait:"https://wx.qlogo.cn/mmopen/vi_32/icK2dToXWiaDxeazRtSmUJsHdIQQCfOp9icNHo5Clb3VPc8TMx3Seoer8S8QqWQ9gqehf1RRFIJk6Jlialyibx60YJg/0"
        score:24
        sendHongBaos:(2) [{…}, {…}]
        tuiguangScore:0
        tuiguangToday:[]
        uid:"lala"
        __v:0
        _id:"5a66ddd9f2edc4294f82b05b9e"
    }
    */
    getUserData = function(callBack){
        var url = urls.user +"/get_user";
        var param = {};//config.getParam();
        util.request({
            url: url,
            data: param,
            method: 'GET',
            success:res=>{
                //服务器存储的用户数据
                console.log("getUserData",res)
                if (callBack && typeof callBack == 'function') callBack(res.data)
            },
        })
    }
    getTuiguangUrl = function(callBack){
        var url = urls.user +"/get_tuiguangUrl"
        var param = {}//config.getParam();
        util.request({
            url: url,
            data: param,
            method: 'GET',
            success:res=>{
                //服务器存储的用户数据
                console.log(res)
                if (callBack && typeof callBack == 'function') callBack(res.data)
            },
        })
    } 
};
/////////////////////////////////////////////////////
/////全局变量版本//////////////////////////////////
//////////////////////////////////////////////////
// // 上传 分数
// const setScore = function(_score){
//     var url = urls.user +"/set_score"
//     var param = {}//config.getParam();
//     param["score"] = _score;
//     util.request({
//         url: url,
//         data: param,
//         header: { 'content-type': 'application/x-www-form-urlencoded' },
//         method: 'POST',
//         success:res=>{
//             console.log("setScore Success")
//         }
//     })
// }
// // 上传 个人数据
// const setBlob = function(blob){
//     var url = urls.user +"/set_blob"
//     var param = {}//config.getParam();
//     param["blob"] = blob;
//     util.request({
//         url: url,
//         data: param,
//         header: { 'content-type': 'application/x-www-form-urlencoded' },
//         method: 'POST',
//     })
// }

// const setUserInfo = function(){
//     var url = urls.user +"/setuserinfo";
//     var param = {};//config.getParam();
//     //console.log(config.userInfo)
//     param["portrait"] = config.userInfo.avatarUrl
//     param["name"] = config.userInfo.nickName
//     param["geo"] = config.userInfo.city
//     util.request({
//         url: url,
//         data: param,
//         header: { 'content-type': 'application/x-www-form-urlencoded' },
//         method: 'POST',
//     })
// }

// // const getRank = function(callBack){
// //     var url = urls.user +"/get_rank"
// //     var param = {}//config.getParam();
// //     util.request({
// //         url: url,
// //         data: param,
// //         method: 'GET',
// //         success:res=>{
// //             //服务器存储的用户数据
// //             console.log(res)
// //             if (callBack && typeof callBack == 'function') callBack(res.data)
// //         },
// //         fail:res=>{

// //         },
// //     })
// // }

// const getUserData = function(){
//     var url = urls.user +"/get_user";
//     var param = {};//config.getParam();
//     util.request({
//         url: url,
//         data: param,
//         method: 'GET',
//         success:res=>{
//             //服务器存储的用户数据
//             console.log(res)
//         },
//     })
// }
// const getTuiguangUrl = function(){
//     var url = urls.user +"/get_tuiguangUrl"
//     var param = {}//config.getParam();
//     util.request({
//         url: url,
//         data: param,
//         method: 'GET',
//         success:res=>{
//             //服务器存储的用户数据
//             console.log(res)
//         },
//     })
// }
// module.exports = {
//     setScore: setScore,
//     setBlob: setBlob,
//     //getRank: getRank,
//     getUserData: getUserData,
//     getTuiguangUrl: getTuiguangUrl,
//     setUserInfo:setUserInfo,

//   }