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
        sp :{
            default:null,
            type:cc.SpriteFrame
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
        self._passGate = passGate;
    },

    start () {

    },
    init(index){
        this._index = index;
        for(var i = 0; i < 4 ; i++){
            var label = cc.find("item"+(i+1)+"/Label",this.node).getComponent(cc.Label);
            label.string = this._index + i;          
            if(this._index + i <= self._passGate){
                var itemSp = cc.find("item"+(i+1),this.node).getComponent(cc.Sprite);
                if(self.sp){
                    itemSp.spriteFrame = self.sp;
                }
            }
        }
    },
    btnClick(event,i){
        i = parseInt(i);
        console.log("GateIndex",this._index,"lalla",i);
        var passGate =  cc.sys.localStorage.getItem('passGateIndex');
        if(this._index +i > parseInt( passGate) + 1){
            this._flyText();
            return
        }
        cc.sys.localStorage.setItem('GateIndex', this._index+i);
        cc.sys.localStorage.setItem('GateOpen', true);
        cc.director.loadScene("mainGame",null);

    },
    _flyText(num){
        var textNode = new cc.Node;
        textNode.addComponent(cc.Label);
        textNode.addComponent(cc.LabelOutline);
        var text = textNode.getComponent(cc.Label);
        text.string = "请先通关前置关卡，只能选中通关后的下一关卡";
        text.fontSize = 40;
        text.lineHeight = 40;
        textNode.color = cc.color(247,255,43,255);
        var textOutLine = textNode.getComponent(cc.LabelOutline);
        textOutLine.color = cc.color(63,2,2,255);
        textOutLine.width = 2;
        self.node.parent.addChild(textNode);
        var size = self.node.getContentSize();
        //textNode.setPosition(size.width/2,size.height);
        var fadeOut = cc.fadeOut(0.2);
        var move = cc.moveBy(0.2,cc.p(0,400));
        textNode.runAction(cc.sequence(cc.delayTime(0.5), cc.spawn( fadeOut,move),cc.callFunc(function(){
            textNode.destroy();
        },self)))
    },
    // update (dt) {},
});
