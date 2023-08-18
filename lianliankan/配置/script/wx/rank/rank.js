var urls = require('../config/config').urls
var config = require('../config/config')
var util = require('../utils/util');

//// 类版本 全局函数太多可以使用类版本
export default class rank {
    // 类似构成函数
    constructor(){
  
    }; 
    /* *******添加rankLayer *******
    **target为self（this）
    **name 为你自己设置（默认rankWidget）
    */
    loadRankWidget = function(target,name){
        cc.loader.loadRes("wx/rankRes/rankWidget",cc.Prefab,function(err,prefab){
                console.log("rankWidget",prefab)
                var rankWidget = cc.instantiate(prefab);
                target.node.addChild(rankWidget);
                //适配高 宽
                var _size = rankWidget.getContentSize();
                var tagSize = target.node.getContentSize();
                var scaleX = tagSize.width/_size.width;
                var scaleY = tagSize.height/_size.height;
                    rankWidget.setScale(scaleX,1)
                rankWidget.setPosition(cc.p(0,0))
                
                rankWidget.active = false;
                name = name || "rankWidget"
                target[name] = rankWidget;
            })
    };
    // 获取群排行榜
    loadQunRankWidget = function(target,name){
        cc.loader.loadRes("wx/rankRes/qunRank",cc.Prefab,function(err,prefab){
                console.log("qunRank",prefab)
                var qunRankWidget = cc.instantiate(prefab);
                target.node.addChild(qunRankWidget);
                //适配高 宽
                var _size = qunRankWidget.getContentSize();
                var tagSize = target.node.getContentSize();
                var scaleX = tagSize.width/_size.width;
                var scaleY = tagSize.height/_size.height;
                qunRankWidget.setScale(scaleX,1)
                qunRankWidget.setPosition(cc.p(0,0))
                
                qunRankWidget.active = false;
                name = name || "qunRankWidget"
                target[name] = qunRankWidget;
            })
    };
    //获取好友rank
    getFriendRank = function(callBack){
        var url = urls.user +"/friendrank"
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
    // 获取世界rank
    getWorldRank = function(callBack){
        var url = urls.user +"/worldrank"
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
    // 获取rank  好友跟世界rank 一起
    // 现在使用此方法（以上两种弃用）
    getRank = function(callBack){
        var url = urls.user +"/rank"
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
            fail:res=>{

            },
        })
    }   
    // 获取群排名
    getQunRank = function(groupId, callBack){
        var url = urls.user +"/grouprank"
        var param = {
            groupid:groupId,
        }//config.getParam();
        util.request({
            url: url,
            data: param,
            method: 'GET',
            success:res=>{
                //服务器存储的用户数据
                console.log("getQunRank",res)
                if (callBack && typeof callBack == 'function') callBack(res.data)
            },
            fail:res=>{

            },
        })
    } 

};
/////////////////////////////////////////////////////
/////全局变量版本//////////////////////////////////
//////////////////////////////////////////////////
// const loadRankWidget = function(target){
//     cc.loader.loadRes("wx/rankRes/rankWidget",cc.Prefab,function(err,prefab){
//                 console.log(prefab)
//                 var rankWidget = cc.instantiate(prefab);
//                 target.node.addChild(rankWidget);
//                 rankWidget.active = false;
//                 target.rankWidget = rankWidget;
//             })
//   };
//   const getFriendRank = function(callBack){
//     var url = urls.user +"/friendrank"
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
//     })
// }

// const getWorldRank = function(callBack){
//     var url = urls.user +"/worldrank"
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
//     })
// }

// const getRank = function(callBack){
//   var url = urls.user +"/rank"
//   var param = {}//config.getParam();
//   util.request({
//       url: url,
//       data: param,
//       method: 'GET',
//       success:res=>{
//           //服务器存储的用户数据
//           console.log(res)
//           if (callBack && typeof callBack == 'function') callBack(res.data)
//       },
//       fail:res=>{

//       },
//   })
// }

//   module.exports = {
//     loadRankWidget: loadRankWidget,
//     getFriendRank:getFriendRank,
//     getWorldRank:getWorldRank,  
//     getRank:getRank,
//   }

