var urls = require('../config/config').urls
var config = require('../config/config')
var util = require('../utils/util');

// export default class share {
//   constructor(){
//     this.shareTicket = ''
//     this.updateShareMenu();
//   };
//   getShareTicket(){
//     return this.shareTicket
//   };
//   shareAppMessage = function(){
//         wx.shareAppMessage( {
//         //title: '转发标题',
//         imageUrl: canvas.toTempFilePathSync({
//           destWidth: 500,
//           destHeight: 400
//         }),
//         success:res=>{
//           console.log(res);
//         },
//         fail:res=>{
//           console.log(res)
//         }
//     });
//   };
//   getShareInfo = function(){
//     wx.getShareInfo({
//       shareTicket: '',
//       success:res=>{
//         console.log(res);
//       },
//       fail:res=>{
//         console.log("shareFail")
//       },
//     });
//   };
//   // 转发后； 点击 转发的卡片 会得到一个shareTicket 通过调用 wx.getShareInfo() 接口传入 shareTicket 可以获取群相关信
//   updateShareMenu = function(){
//     wx.updateShareMenu({
//       withShareTicket: true,
//       success: function(res) {},
//       fail: function(res) {},
//       complete: function(res) {},
//     })
//   };
//   // 主动添加好友 测试用 
//   addFriend = function(){
//     var url = urls.user +"/add_friend"
//     var param = {
//       appid :"wssdf",
//       frienduid :"wadfegs",
//     }//config.getParam();
//     util.request({
//         url: url,
//         data: param,
//         header: { 'content-type': 'application/x-www-form-urlencoded' },
//         method: 'POST',
//         success:res=>{
//             console.log("addFriend Success")
//         }
//     })
//   }
// };



// 转发后； 点击 转发的卡片 会得到一个shareTicket 通过调用 wx.getShareInfo() 接口传入 shareTicket 可以获取群相关信
const  updateShareMenu = function(){
  console.log("updateShareMenu")
  if (cc.sys.platform == cc.sys.WECHAT_GAME){
    wx.updateShareMenu({
      withShareTicket: true,
      success: function(res) {
        console.log("updateShareMenu true res:",res)
      },
      fail: function(res) 
      {
        console.log("updateShareMenu fail res:",res)
      },
      complete: function(res) {},
    })
  }
}(); 
const onShareAppMessage = function(){
  if (cc.sys.platform == cc.sys.WECHAT_GAME){ 
    console.log("onShareAppMessage")
    wx.onShareAppMessage(function (res) {
      console.log("onShareAppMessage",res)
      // 用户点击了“转发”按钮
      return  {
        //title: '转发标题',
        imageUrl: canvas.toTempFilePathSync({
          destWidth: 500,
          destHeight: 400
        }),
        query:{
          key1:123456,
    
        },
        success:res=>{

        if (res.shareTickets) {
            wx.getShareInfo({
              // 请问这里的shareTickets为什么是数组类型，并不允许或出现一次转发多个群组的情况啊
              // 如果是有其他使用情况，还请做说明，指点指点，谢谢。
              shareTicket: res.shareTickets[0],
              success:er=>{
                console.log(er)
              },
              fail() { }
            })
          }
          console.log(res);
        },
        fail:res=>{
          console.log(res)
        }
      }
    })
  }
}();
const shareAppMessage = function(uid,qunId){
  wx.shareAppMessage( {
    //title: '转发标题',
    imageUrl: canvas.toTempFilePathSync({
      destWidth: 500,
      destHeight: 400
    }),
    query:{
      uid: uid || "chen",
      qunId:qunId || "",
    },
    success:res=>{
      console.log("shareAppMessage",res);
    },
    fail:res=>{
      console.log("shareAppMessage fail",res)
    }
  });
};
const getShareInfo = function(){
  wx.getShareInfo({
    shareTicket: '',
    success:res=>{
      console.log(res);
    },
    fail:res=>{
      console.log("shareFail")
    },
  });
};

const addFriend = function(_appID){
  var url = urls.user +"/add_friend"
  var param = {
    appid :_appID,
    frienduid :"chen",
  }//config.getParam();
  util.request({
      url: url,
      data: param,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      method: 'POST',
      success:res=>{
          console.log("addFriend Success")
      }
  })
};
  //分享群
const shareGroup = function(groupid){
    var url = urls.user +"/add_group";
    var param = {
        groupid: groupid,
      };
    util.request({
        url: url,
        data: param,
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        method: 'POST',
        success:res=>{
            console.log("add_group Success")
            var d = res.data;
            console.log(d);
            //util.pay(_price/100, null, null, null);
        },
        fail: function (er) {
            console.error(er);
          }
    })      
};

module.exports = {
  //updateShareMenu: updateShareMenu,
  shareAppMessage: shareAppMessage,
  getShareInfo: getShareInfo,
  addFriend: addFriend,
  shareGroup:shareGroup,


}