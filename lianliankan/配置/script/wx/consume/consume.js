var urls = require('../config/config').urls
var config = require('../config/config')
var util = require('../utils/util');

//// 类版本 全局函数太多可以使用类版本
export default class consume {
    // 类似构成函数
    constructor(){
  
    }; 
    //  loadHongbaoWidget = function(target){
    //     cc.loader.loadRes("wx/hongbao/hongbaoWidget",cc.Prefab,function(err,prefab){
    //                 console.log(prefab)
    //                 var hongbaoWidget = cc.instantiate(prefab);
    //                 target.node.addChild(hongbaoWidget);
    //                 hongbaoWidget.active = false;
    //                 target.hongbaoWidget = hongbaoWidget;
    //             })
    //   };
    
      getGold = function(callBack){
        var url = urls.user +"/get_gold";
        var param = {
          };
        util.request({
            url: url,
            data: param,
            method: 'get',
            success:res=>{
                console.log("getGold Success")
                
                console.log(res.data);
                if (callBack && typeof callBack == 'function') callBack(res.data.data)
            },
            fail: function (er) {
                console.error(er);
              }
        })    
      };
      addGold = function(callBack,_num){
        var url = urls.user +"/add_gold";
        var param = {
            num:_num,
          };
        util.request({
            url: url,
            data: param,
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            method: 'POST',
            success:res=>{
                console.log("addGold Success")
                console.log(res.data);
                if (callBack && typeof callBack == 'function') callBack(res.data.data)
            },
            fail: function (er) {
                console.error(er);
              }
        })
      };
      subGold = function(callBack,_num){
        var url = urls.user +"/sub_gold";
        var param = {
            num:_num,
          };
        util.request({
            url: url,
            data: param,
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            method: 'POST',
            success:res=>{
                console.log("getGold Success")

                console.log(res.data);
                if (callBack && typeof callBack == 'function') callBack(res.data.data)
            },
            fail: function (er) {
                console.error(er);
              }
        })    
      };
}

