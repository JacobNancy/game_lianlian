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
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        self = this;
        self._x = 0;
        self._y = 0;
        //console.log("ItemPrefeb")
        //self._size = self.node.getContentSize()

    },
    
    start () {

    },
    init(data){
        //console.log(data.width);
        self._x = data.x;
        self._y = data.y;
        self._type = data.type;
        self._width = data.width;
        //console.log(self._type)
        self._spriteNode = cc.find("itemsp",this.node);
        self._sprite = self._spriteNode.getComponent(cc.Sprite); 
        
        //console.log(tex);
        self._sprite.spriteFrame = data.tex;
        self.node.setContentSize(data.width,data.width);
        self._spriteNode.setContentSize(data.width,data.width);
        self.node.setPosition((self._x - 1) *data.width, (self._y -1 )*data.width);
        
    },
    getItemType(){
        //console.log("getItemType",self._type,this._type)
        return this._type;
    },
    getItemXY(){
        return cc.p(this._x,this._y);
    },
    setItemXY(point){
        this._x = point.x;
        this._y = point.y;
    },
    runItemActions(time,item,callback){
        time = time || 0.1;
        var point = cc.p((this._x - 1) *this._width, (this._y -1 )*this._width)
        //console.log("runItemActions",this,item)
        this.node.runAction(cc.sequence( cc.moveTo(time,point),cc.callFunc(function(){
            this.node.setPosition((this._x - 1) *this._width, (this._y -1 )*this._width);   
            //console.log(item)  
            if(item){
                
                var _p = item.getComponent('itemPrefabJs').getItemXY()
                //console.log("runItem",this.node, item, _p, this._x,this._y);
                if (_p.x == this._x && _p.y == this._y){
                    if (callback){
                        callback();
                    }
                }
            }   
        },this)))
    },
    runItemBombXiao(item, callbacks){
        var scale1 = cc.scaleTo(0.1,1.2);
        var scale2 = cc.scaleTo(0.1,1);
        var fadeout = cc.fadeOut(0.15);
        this.node.runAction(cc.sequence(scale1,scale2,scale1,cc.spawn(scale2,fadeout),cc.callFunc(function(){
            
            if(item){
                
                var _p = item.getComponent('itemPrefabJs').getItemXY()
                //console.log("runItem",this.node, item, _p, this._x,this._y);
                if (_p.x == this._x && _p.y == this._y){
                    if (callbacks){
                        callbacks();
                    }
                }
            }
            this.node.destroy();
        },this)));
    }
    // update (dt) {},
});
