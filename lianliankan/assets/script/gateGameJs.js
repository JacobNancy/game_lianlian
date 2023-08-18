// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html
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
        pageView:{
            default:null,
            type:cc.Node,
        },
        gateItemsPref:{
            default :null,
            type:cc.Prefab,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        self = this;
        var passGate =  cc.sys.localStorage.getItem('passGateIndex');
        if(passGate == null){
            cc.sys.localStorage.setItem('passGateIndex',0);
            passGate = 0;
        }
        self._pageGate = parseInt(passGate);
        self._maxNum = 4;
        var _size = self.node.getContentSize();
        for(var i = 0; i< self._maxNum; i++){
            var item = cc.instantiate(self.gateItemsPref);
            self.pageView.addChild(item);
            item.setPosition(_size.width*i,0);
            var gatePrefScript = item.getComponent('gateItemPrefabJs');
            gatePrefScript.init(i);
        }  
        self._page = cc.find("pageView",self.node).getComponent(cc.PageView);
        self._curIndex = cc.find("curIndex",self.node).getComponent(cc.Label);
        
    },

    start () {
        self.curPageIndex()
    },
    curPageIndex(){
        var num = Math.floor(self._pageGate/16);
        self._page.setCurrentPageIndex(num);
        var index = parseInt(self._page.getCurrentPageIndex())+1;
        self._curIndex.string = index+"/"+self._maxNum;
    },
    backBtnClick(){
        cc.director.loadScene("loading",null);
    },
    // update (dt) {},
});
