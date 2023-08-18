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

    //  getRank = function(callBack){
    //     var url = urls.user +"/get_rank"
    //     var param = {}//config.getParam();
    //     util.request({
    //         url: url,
    //         data: param,
    //         method: 'GET',
    //         success:res=>{
    //             //服务器存储的用户数据
    //             console.log(res)
    //             if (callBack && typeof callBack == 'function') callBack(res.data)
    //         },
    //         fail:res=>{

    //         },
    //     })
    // }

    getUserData = function(){
        var url = urls.user +"/get_user";
        var param = {};//config.getParam();
        util.request({
            url: url,
            data: param,
            method: 'GET',
            success:res=>{
                //服务器存储的用户数据
                console.log(res)
            },
        })
    }
    getTuiguangUrl = function(){
        var url = urls.user +"/get_tuiguangUrl"
        var param = {}//config.getParam();
        util.request({
            url: url,
            data: param,
            method: 'GET',
            success:res=>{
                //服务器存储的用户数据
                console.log(res)
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