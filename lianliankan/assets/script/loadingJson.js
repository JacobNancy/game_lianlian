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
export default class loadingJson{
    constructor(callBack,index){
        self = this;
        self._callBack = callBack;
        self._info = {};
        //被选中List
        self._select = index | 1;
        if(self._callBack){
            self._callBack();
            self._callBack = null;
        }        
        return
        self.loadJson(index);
    }
    loadJson(index){
        //index = index | 1;
        if(self._select> 12){
            self._select = 12;
        }
        var path = "data/Trigger_1_"+self._select
        cc.loader.loadRes(path,function(err,data){
            //console.log(data);
            self.newLoad(data);
            //self.load(data)
            // var n =  JSON.stringify(data);
            // console.log("JSon.Stringify",n)
            
            if (self._callBack) {
                self._callBack();
                self._callBack = null;
            }
            
        })
    };
    newLoad(str){
        if(str == null){
            return;
        }
        console.log(str,str.width_grid);
        self._info.list = str.distribute;
        self._info.width = str.width_grid;
        self._info.height = str.height_grid;
    }
    setObjectIndex(index){
        self._select = index;
        self.loadJson();
    }
    getNextJsonInfo(index,callbacks){
        if (index == null){
            index = 1;
        }
        self._select = index ;
        self._callBack = callbacks
        self.loadJson();
    }
    // 获得宽度
    getWidth(){
       return self._info.width; 
    }
    // 获得高度
    getHeight(){
        return self._info.height; 
    }
    // 获得数组
    getArr(){
        return self._info.list;
    }
    getInfoByIndex(index){
        return self._info[index]
    }
    
}
