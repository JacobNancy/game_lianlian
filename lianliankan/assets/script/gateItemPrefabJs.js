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
        items:{
            default:null,
            type:cc.Prefab,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        self = this;
        // self._items = new Array();
        // var _size = self.node.getContentSize();
        // for(var i =0; i< 4 ; i++){
        //     var _items = cc.instantiate(self.items);
        //     self._items.push(_items);
        //     self.node.addChild(_items);
        //     _items.setPosition(0,_size.height/2 - ((i*150)+75));
        // }
        // console.log("GateItemPrefabJs+onLoad");
    },

    start () {

    },
    init(index){
        self._items = new Array();
        var _size = self.node.getContentSize();
        for(var i =0; i< 4 ; i++){
            var _items = cc.instantiate(self.items);
            self._items.push(_items);
            self.node.addChild(_items);
            _items.setPosition(0,_size.height/2 - ((i*150)+75));
        }
        console.log("GateItemPrefabJs");
        for(var i = 0; i < this._items.length;i++){
            var item = this._items[i];
            var scpt = item.getComponent('gateBtnPref'); 
            scpt.init(index*16+i*4+1);
        }
    },
    // update (dt) {},
});
