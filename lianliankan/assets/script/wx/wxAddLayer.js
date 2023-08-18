// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html
var rank =  require('./rank/rank');
var share = require('./share/share')
var hongbao =  require('./hongbao/hongbao')
var self = null;
cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        self =  this;
        self._hongbao = new hongbao();
        self._rank = new rank();
        // wx 添加排行榜 rank layer
        self._rank.loadRankWidget(self);
        self._hongbao.loadHongbaoWidget(self);
    },

    start () {

    },
    rankBtn(){
        if(cc.sys.platform == cc.sys.WECHAT_GAME){
            self._rank.getRank(function(res){
                //console.log(res)
                if(res && res["data"]){
                    //本地游戏关闭触摸事件
                    //self.closeTouch()
                    self.rankWidget.active = true
                    var js = self.rankWidget.getComponent('rankLayer');
                    js.init(res.data,function(){
                        //本地游戏开启触摸事件
                        //self.openTouch()
                    })
                }
            });
        }
    },
    shareBtn(){
        if(cc.sys.platform == cc.sys.WECHAT_GAME){
            share.shareAppMessage()
        }
    },
    shareQunBtn(){
        if(cc.sys.platform == cc.sys.WECHAT_GAME){
            share.shareGroup("lalala");
        }
    },
    hongbaoBtn(){
        //红包功能未完成 需要开发后调试
        // if(cc.sys.platform == cc.sys.WECHAT_GAME){
        //     self.closeTouch()
        //     var js = self.hongbaoWidget.getComponent('hongbaoLayer');
        //     js.init(self)    
        // }
    },
    // update (dt) {},
});
