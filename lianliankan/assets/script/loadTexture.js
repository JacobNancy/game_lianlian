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
export default class loadTexture{
    constructor(callback){
        self = this;
        self._callBack = callback;
        self.init();

    }
    init(){
        cc.loader.loadResDir("res", cc.SpriteFrame, function (err, assets) {
            console.log(assets);
            self.resources = assets;
            if(self._callBack){
                self._callBack();
            }
        })
    }
    getSpriteFrameByIndex(index){
        return self.resources[index];
    }
}