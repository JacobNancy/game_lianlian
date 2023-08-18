// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html
var login =  require('./login');
var config =  require('../config/config');
var share =  require('../share/share');
var rank =  require('../rank/rank');

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
        self = this;
        self.register()
        if(cc.sys.platform == cc.sys.WECHAT_GAME){
            // wx.authorize({
            //     success:res=>{
            //        // this.wxLoading()
            //     },
            // })
            self._rank = new rank();
            self._rank.loadQunRankWidget(self);
        }else{
            cc.director.loadScene(config.loginScene, null);
        }

       // console.log(login)
    },

    start () {

    },
    register(){
        var btn = cc.find("Canvas/loginSuccess/wxLogin");
        console.log(btn)
        btn.on('click',function(event){
            self.wxLoading()
        },self);
        var rebtn = cc.find("Canvas/loginFail/reLogin");
        rebtn.on('click',function(event){
            self.wxLoading()
        },self);
    },
    nameLoading(){
        var nameWidget = cc.find("Canvas/loginSuccess/nameTitle/nameString");
        var edit = nameWidget.getComponent(cc.EditBox)
        config.useName = edit.string
    },
    wxLoading(){
        this.nameLoading()
        wx.login({
            success:res=>{
                
                login.login(res.code,function(res){
                    console.log(res)
                    var launcInfo = wx.getLaunchOptionsSync();
                    console.log("wx.getLaunchOptionsSync::",launcInfo); 

                    if (launcInfo && launcInfo["query"] && launcInfo.query["uid"]){
                        share.addFriend(launcInfo.query["uid"]);
                        if (launcInfo.query["qunId"]){
                            self._rank.getQunRank( launcInfo.query["qunId"] ,function(res){
                                //console.log(res)
                                if(res && res["data"]){
                                    //本地游戏关闭触摸事件
                                    //self.closeTouch()
                                    self.qunRankWidget.active = true
                                    var js = self.qunRankWidget.getComponent('rankQunLayer');
                                    js.init(res.data,function(){
                                        //本地游戏开启触摸事件
                                        //self.openTouch()
                                        cc.director.loadScene(config.loginScene, null);
                                    })
                                }
                            });
                            return ;
                        }                     
                    }                
                    cc.director.loadScene(config.loginScene, null);
                },function(){
                    self.failLogin();
                })

            },
            fail:res=>{
                self.failLogin();
            },
        })
    },
    failLogin(){
        var widget = cc.find("Canvas/loginSuccess");
        widget.active = false;
        widget = cc.find("Canvas/loginFail");
        widget.active = true;
    },
    // update (dt) {},
});
