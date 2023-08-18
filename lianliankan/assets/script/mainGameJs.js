// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

//微信功能
var userOperate = require('./wx/userOperate/userOperate');
var config = require('./wx/config/config');
var consume = require('./wx/consume/consume');
//本地游戏
var llkCala = require('./llkCala');
var loadingJson = require('./loadingJson');
var loadTexture = require('./loadTexture');
var self = null;
var param = {
    0:{x: 0,y:1},
    1:{x: 0,y:-1},
    2:{x:-1,y:0},
    3:{x:1, y:0}
};
var MAX_TURN = 3;
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
        itemPref:{
            default:null,
            type :cc.Prefab,
        },
        MaxTime:90,
        ConusumeOther: 100,
        ConusumeBomb: 300,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        self = this;
        // 排、列 数量
        self._rowNum = 10;
        self._colNum = 10;
        // 当前关卡地图id
        self._gate = 1; 
        //是否是娱乐关卡      
        self._isGateOpen =  cc.sys.localStorage.getItem('GateOpen');
        if (self._isGateOpen === 'true'){
            
            self._gate =  parseInt( cc.sys.localStorage.getItem('GateIndex'));
        }
        console.log("MainGame_gateOpen",self._isGateOpen,self._gate);
        //秒
        self._totalS = 0;
        self._changeTotalS = 0;
        //
        self._width = 64;
        // 单个卡牌类型最大数量
        self._piceCardMaxNum = 4;
        self._cardNum = 0;
        self._cardArr = new Array();
        // 地图map
        self._mapArr = null;
        // 死锁后转换， Arr 
        self._lockArr = new Array();
        // find 金手指
        self._findArr = new Array();

        self._bar = cc.find("Canvas/top/bar").getComponent(cc.ProgressBar)
        self._llk = new llkCala(self);
        self._gameOver = cc.find("Canvas/gameOver")
        self._isOk = false
        //音效
        self.loadingAudio();
        //微信信息
        self.wxInfo();
        // 金币
        self._gold = 300;
        self._goldLable = cc.find("Canvas/top/addGold/goldBottom/gold").getComponent (cc.Label);
        self.showWXGold();

        //资源图集
        self._textures  = new loadTexture(function(){
            if(self._isOk){
                self.init() ;
            }else{
                self._isOk = true;
            }
        });
        self._loadingJson = new loadingJson(function(){
            if(self._isOk){
                self.init() ;
            }else{
                self._isOk = true;
            }
        },self._gate);
        self.register();
    },
    start () {
        
    },
    loadingAudio(){
        self._audio = self.node.getComponent("audioControll");
        self._audio.onStartBgAudio();

    },
    //微信获取 Gold
    showWXGold(){
        if(cc.sys.platform == cc.sys.WECHAT_GAME){
            self._consume.getGold(self._updateGold);
        }
    },
    showGold(){
        self._goldLable.string = self._gold;
    },
    _updateGold(data){
        self._gold = data.num;
        self.showGold();
    },
    //微信功能
    wxInfo(){
       self._userOperate  = new userOperate();
       self._consume = new consume();
       //self.hongbaoWidget = self._hongbao.loadHongbaoWidget(self);

    },

    // 注册事件
    register(){
        self.openTouch()
    },
    //添加gold
    addWXGold(event,num){
        num = num | 300;
        if(cc.sys.platform == cc.sys.WECHAT_GAME){
            console.log("addWXGold"+ num)
            self._consume.addGold(self._updateGold,num); 
        }
    },
    _flyText(num){
        var textNode = new cc.Node;
        textNode.addComponent(cc.Label);
        textNode.addComponent(cc.LabelOutline);
        var text = textNode.getComponent(cc.Label);
        text.string = "您的金币不足 "+ num ;
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
    //金手指
    fingerTip(){
        self._audio.onTouchAudio();
        if(self._isFinger){
            return;
        }
        if(self._gold >= self.ConusumeOther){
            if(self._findArr.length <= 0)
            {
                return;
            }
            if(cc.sys.platform == cc.sys.WECHAT_GAME){
                self._consume.subGold(self._updateGold,self.ConusumeOther); 
            } 
            if (self._curPoint){
                self._list[self._curPoint.x][self._curPoint.y].setScale(1);
                self._curPoint = null;
            }  
            self._list[self._findArr[0].x][self._findArr[0].y].runAction(cc.repeatForever(cc.sequence(cc.scaleTo(0.15,1.1,1.1),cc.scaleTo(0.15,1,1))));
            self._list[self._findArr[1].x][self._findArr[1].y].runAction(cc.repeatForever(cc.sequence(cc.scaleTo(0.15,1.1,1.1),cc.scaleTo(0.15,1,1))));
            self._isFinger = true;
            self._isBomb = false;
            
        }else{
            self._flyText(self.ConusumeOther);
        }

    },
    // 翻转
    transfor(){
        self._audio.onTouchAudio();
        if(self._gold >= self.ConusumeBomb){
            if(cc.sys.platform == cc.sys.WECHAT_GAME){
                self._consume.subGold(self._updateGold,self.ConusumeBomb); 
            }       
        }else{
            self._flyText(self.ConusumeBomb);
            return;
        }
        if (self._curPoint){
            self._list[self._curPoint.x][self._curPoint.y].setScale(1);
            self._curPoint = null;
        }  
        for(var i = 1; i < self._rowNum+1; i ++ ){
            for(var j = 1; j < self._colNum + 1 ; j++){
                if(self._list[i][j] && self._list[i][j] != 1){
                   self._lockArr.push(cc.p(i,j));
                }
            }
        }
        self.convert();
    },
    // 炸弹
    bombBtn(){
        self._audio.onTouchAudio();
        if(self._isBomb){
            return;
        }
        if(self._gold >= self.ConusumeBomb){
            if(cc.sys.platform == cc.sys.WECHAT_GAME){
                self._consume.subGold(self._updateGold,self.ConusumeBomb); 
            }   
            self._isBomb = true;
            if (self._curPoint){
                self._list[self._curPoint.x][self._curPoint.y].setScale(1);
                self._curPoint = null;
            }            
            self._isFingerShan();    
        }else{
            self._flyText(self.ConusumeBomb);
        }

    },
    openTouch(){
        self.node.on(cc.Node.EventType.TOUCH_START,self._touchEvent,self);
    },
    closeTouch(){
        self.node.off(cc.Node.EventType.TOUCH_START,self._touchEvent,self);
    },
    //  关闭闪烁
    _isFingerShan(){
        if(self._isFinger ){
            self._list[self._findArr[0].x][self._findArr[0].y].stopAllActions();
            self._list[self._findArr[1].x][self._findArr[1].y].stopAllActions();
            self._isFinger = false
        }
    },
    // 炸弹消除
    _bombXiaoChu(point){
        if (!self._isBomb){
            return false;
        }
        if (self._list[point.x][point.y] != 1 ){
            var _type = self._list[point.x][point.y].getComponent('itemPrefabJs').getItemType();   
            self._calaBombXiaochu(_type);  
        }
        return true;
    },
    // 计算消除
    _calaBombXiaochu(_type){
        var bombList = new Array();
        for(var i = 1; i < self._rowNum+1; i ++ ){
            for(var j = 1; j < self._colNum + 1 ; j++){
                if (self._list[i][j] != 1  && 
                    self._list[i][j].getComponent('itemPrefabJs').getItemType() === _type ){ 
                        bombList.push(self._list[i][j]); 
                        self._list[i][j] = 1; 
                } 
            }   
        }    
        self._bombXiaoAction(bombList);
    },
    //炸弹消动作
    _bombXiaoAction(bombList){
        for(var i =0; i< bombList.length;i++){
            var item = bombList[i];
            item.getComponent('itemPrefabJs').runItemBombXiao(bombList[bombList.length-1],function(){
                self.doLock();
            });
        }
        self._isBomb = false;
    },
    _touchEvent(event){
        self._audio.onTouchAudio();
        var point = event.getLocation();

        //console.log(point)
        self._isFingerShan();
        var p =  self.getConvertPosXY(point);
        if(self._bombXiaoChu(p)){
            return;
        }
        if (self._list[p.x][p.y] != 1 ){
            if(self._curPoint)
            {
                if (self._curPoint.x === p.x && self._curPoint.y === p.y){
                    return;
                }
                self._nexPoint = p;
                self.xiaoChu()
            }else{
                self._curPoint = p;
                self._list[self._curPoint.x][self._curPoint.y].setScale(1.1);
            }
            
        }else{
            self._nexPoint = null;
        }
        //console.log(p);
    },
    addMianTime(){
        self._totalS = self.MaxTime + self._totalS
        self._changeTotalS = self._totalS;
        self.unschedule(self.mainTime);
        self.schedule(self.mainTime, 1);
        //self._updateGrade()
    },
    
    mainTime(){
        if (self._totalS < 0) {
            self.unschedule(self.mainTime);
            self.showGameOver()
        }  
        var grade = self._totalS / self._changeTotalS;
        self._bar.progress = grade;
        self._totalS -= 1;   
    },
    loadArrInfo(){
        self._rowNum = self._loadingJson.getWidth();
        self._colNum = self._loadingJson.getHeight();
        self._mapArr = null;    
        self._mapArr = self._loadingJson.getArr();
    },
    // 获取列，行
    getRowNum(){
        return self._rowNum + 2;
    },
    getColNum(){
        return self._colNum + 2;
    },
    init(){
        //清除数据
        self._findArr.splice(0,self._findArr.length);
        self._loadingJson.getNextJsonInfo(self._gate,function(){
            self.loadArrInfo();
            self.initCardNum();   
            self.initLayout();
            self.initArray();  
            self.addMianTime();
            self.doLock();
        });
    },
    //初始化 卡牌种类
    initCardNum(){
        self._totalCardNum = self.getTotalNum()
        self._initRandomCard()
    },
    getTotalNum(){
        var total = 0
        for(var i = 0; i < self._mapArr.length; i++){
            var arr = self._mapArr[i];
            for(var j = 0; j < arr.length; j ++)
            {
                if (self._mapArr[i][j] === 1 ){
                    total += 1;
                }
            }
        }
        //console.log("getTotalNum",self._mapArr,total)
        return total;
    },
    //初始化 布景层
    initLayout(){
        var sizeWin = cc.director.getWinSize();
        //console.log(sizeWin);
        var maxNum = Math.ceil( sizeWin.width/64 );
        //console.log("InitLayout:Size",self._rowNum,maxNum,self._width)
        if (self._rowNum > maxNum){            
            self._width = Math.floor(sizeWin.width/self._rowNum);  
        }
        //原点在中心点
        var p_width =  (sizeWin.width -  (self._rowNum)*self._width)/2 - sizeWin.width/2;
        var p_height = (sizeWin.height - (self._colNum)*self._width)/2 - sizeWin.height/2;
        self._WinPoint = cc.p(p_width + sizeWin.width/2, p_height + sizeWin.height/2);
        //console.log(p_width,p_height, self._width,self._WinPoint);
        self.node.setContentSize ((self._rowNum)*self._width,(self._colNum)*self._width);
        self.node.setPosition(cc.p(p_width,p_height));
        

    },
    // 初始化列表
    initArray(){

        self._list = null;
        self._list = new Array();
        console.log(self._list);        
        for(var i = 0; i < self._rowNum +2 ; i ++)
        {
            self._list[i] = new Array();
            for(var j = 0; j < self._colNum + 2 ; j++){
                self._list[i][j] =  1;
            }
        }
        self._initWidget();
    },
    _initWidget(){
        //var flag = true;
        var index = 0;
        var item = cc.instantiate(self.itemPref);
        self._size = item.getContentSize();
        for(var i = 1; i < self._rowNum+1; i ++ ){
            for(var j = 1; j < self._colNum + 1 ; j++){
                if(self._mapArr[i-1][j-1] === 0){
                    continue;
                }
                var item = cc.instantiate(self.itemPref);
                 var _type = self._cardArr[index];
                 index += 1 ;
                self.node.addChild(item);
                var tex = self._textures.getSpriteFrameByIndex(_type)
                item.getComponent('itemPrefabJs').init({
                    x:i,
                    y:j,
                    type:_type,
                    width :self._width,
                    tex: tex ,
                });
                
                self._list[i][j] =  item ;                
            }   
        }
        //console.log(self._cardArr)
    },
    // 随机卡牌种类
    _initRandomCard(){
        var _type = 1;
        self._cardArr.splice(0,self._cardArr.length)
        for(var i =1 ; i <= self._totalCardNum; i ++){
            _type = Math.ceil(i/4)
            self._cardArr[i-1] = _type;
        }
        //console.log(self._cardArr)
        //随机类型
        for(var i = 0; i < self._cardArr.length; i++){
            var num = Math.floor( Math.random()*self._cardArr.length);
            var temp =  self._cardArr[i]
            self._cardArr[i] = self._cardArr[num]
            self._cardArr[num] = temp
        }
        console.log(self._cardArr)
    },

    // 坐标转换
    getConvertPosXY(point){
       if( !self._WinPoint ){
            return cc.p(0,0);
       } 
       return cc.p(Math.floor( (point.x - self._WinPoint.x) / self._width) + 1, Math.floor( (point.y- self._WinPoint.y) / self._width) + 1);
    },
    // 判断物体是否有或空
    judgeItem(point){
       // console.log(point,self._list[point.x][point.y])
        if(self._list[point.x][point.y] && self._list[point.x][point.y]  === 1  )
        {

           return true; 
        }
        return false;
    },
    // update (dt) {},
    repeat(arr , point){
        for(var i = 0; i < arr.length;i++){
            if (arr[i].x == point.x && arr[i].y == point.y) {
                return false;
            }
        }
        
        return true;
    },
    // 划线
    drawLine(){
        var arr = self._llk.getPointArray();

        var oldArr = new Array();
        var newArr = new Array();
        oldArr = oldArr.concat(arr);
        //oldArr = self.repeat(oldArr);
        //console.log(oldArr,arr);
        var i = 0;
        var first = oldArr[i];
        newArr.push(first);
        while(true){
            i += 1;
            if ( i >= oldArr.length){
                break;
            }
            if ( ( Math.abs( oldArr[i].x - first.x) + Math.abs(oldArr[i].y - first.y))  === 1  && self.repeat(newArr, oldArr[i]) ) {
                first = oldArr[i];
                newArr.push(first);
                i = 0;
            }
            if(newArr.length === oldArr.length){
                break;
            }
        }
        //console.log(newArr)
        var lineWidget = new cc.Node();
        lineWidget.addComponent(cc.Graphics);
        self.node.addChild(lineWidget);
        lineWidget.setAnchorPoint(0,0);
        lineWidget.setContentSize(self._rowNum*self._width,self._colNum*self._width)
        lineWidget.setPosition(0,0);
        var ctx = lineWidget.getComponent(cc.Graphics);
        ctx.strokeColor = cc.color(240 ,215,11);
        ctx.fillColor = cc.color(60,11,15)
        ctx.lineWidth = 3;
    
        for(var i = 0; i < newArr.length -1; i++){
            var curP = newArr[i];
            var nextP = newArr[i+1]
            if( (curP.x - nextP.x) >0 || (curP.y - nextP.y) > 0){
                var temp = curP;
                curP= nextP;
                nextP = temp;
            }

            ctx.moveTo((curP.x-1)*self._width+self._width/2,(curP.y-1)*self._width+self._width/2);
            ctx.lineTo((nextP.x-1)*self._width+self._width/2,(nextP.y-1)*self._width+self._width/2);
            
        }
        ctx.stroke();
        ctx.fill();
        self.node.runAction(cc.sequence(cc.delayTime(0.2),cc.callFunc(function(){
            ctx.clear();
            lineWidget.destroy()
            self._list[self._curPoint.x][self._curPoint.y].destroy();
            self._list[self._nexPoint.x][self._nexPoint.y].destroy();
            self._list[self._curPoint.x][self._curPoint.y] = 1;
            self._list[self._nexPoint.x][self._nexPoint.y] = 1;
            self._curPoint = null;
            self._nexPoint = null;  
            self._audio.onXiaochuAudio();
            self.doLock();
        },self)))
    },
    // 消除 
    xiaoChu(){
        if (self._list[self._curPoint.x][self._curPoint.y] == 1){
            self._curPoint = null;
            self._nexPoint = null;
            return;
        }
        var curJsType = self._list[self._curPoint.x][self._curPoint.y].getComponent('itemPrefabJs').getItemType();
        var nextJsType = self._list[self._nexPoint.x][self._nexPoint.y].getComponent('itemPrefabJs').getItemType();
        if (curJsType === nextJsType){
            var falg =  self._llk.canFadeAway(self._curPoint,self._nexPoint);
            if(falg){
                self.drawLine()           
            }else{
                self._list[self._curPoint.x][self._curPoint.y].setScale(1)
                self._curPoint = null;
                self._nexPoint = null;  
            } 
        }else{
            self._list[self._curPoint.x][self._curPoint.y].setScale(1)
            self._curPoint = null;
            self._nexPoint = null;  
        }    
    },
    // 死锁
    doLock(){
        if (!self.hasXiaochu()){
            if(self._isGateOpen === 'true'){
                var passGate =  parseInt (cc.sys.localStorage.getItem('passGateIndex'));
                if( passGate < self._gate){
                    cc.sys.localStorage.setItem('passGateIndex',self._gate);
                }                
                cc.director.loadScene("gateScene",null);
                return;
            }
            self._gate +=1;          
            self.init();
        }else{
            if (self._gate >= 0){
                var _n = self._gate%5;
                if (_n === 0){
                    //console.log("down")
                    self.down()
                }else if(_n == 1){
                    //console.log("up")
                    self.up()
                }else if(_n == 2){
                    //console.log("left")
                    self.left()
                }else if(_n == 3){
                    //console.log("right")
                    self.right()
                }else{

                }
               
                return;
            }
            // if( self.hasLock()){
            //     self.convert()
            // } 
        }  
    },
    // 是否是最后的消除
    hasXiaochu(){
        for(var i = 1; i < self._rowNum+1; i ++ ){
            for(var j = 1; j < self._colNum + 1 ; j++){
                if(self._list[i][j] && self._list[i][j] != 1){
                    return true;
                }
            }
        } 
        return false;   
    },
    // 是否锁死
    hasLock(){
        //console.log("hasLock")
        self._lockArr.splice(0,self._lockArr.length);
        self._findArr.splice(0,self._findArr.length);
        for(var i = 1; i < self._rowNum+1; i ++ ){
            for(var j = 1; j < self._colNum + 1 ; j++){
                if(self._list[i][j] && self._list[i][j] != 1){
                   //console.log("hasLock",i,j)
                   self._lockArr.push(cc.p(i,j));
                   self._findArr.push(cc.p(i,j));
                   var flag =  self._lock(cc.p(i,j));
                   if (!flag){
                        return false;
                   }
                }
            }
        } 
        return true;
    },
    _lock(point){
        for(var i = point.x ; i < self._rowNum+1; i ++ ){
            for(var j =  1; j < self._colNum + 1 ; j++){
                if(self._list[i][j] && self._list[i][j] != 1 ){
                    if( point.x == i && point.y == j){
                        //continue;
                    }else{
                        var curItem = self._list[point.x][point.y].getComponent('itemPrefabJs');
                        var nexItem = self._list[i][j].getComponent('itemPrefabJs');  
        
                        if(curItem.getItemType() === nexItem.getItemType()){
                            var flag =  self._llk.canFadeAway(point,cc.p(i,j));
                            if (flag){
                                self._findArr.push(cc.p(i,j));
                                return false;
                            }
                        }   
                    }
                }
            }
        }
        self._findArr.pop()
        return true ;
    },
    _findConverItem(){
        var item = null;
        for(var i = 1 ; i < self._rowNum+1; i ++ ){
            for(var j =  1; j < self._colNum + 1 ; j++){
                if(self._list[i][j] && self._list[i][j] != 1 ){ 
                    item = self._list[i][j];
                }   
            }
        } 
        return item; 
    },
    convert(){
        //console.log("convert")
        self.closeTouch()
        var lenght = Math.floor(self._lockArr.length /2)
        for(var i = 0 ; i < lenght ; i ++){
            var ll = Math.floor(Math.random()* lenght);
            if (ll == lenght){
                ll = lenght - 1;
            }
            var next = self._lockArr[ ll + lenght];              
            var start = self._lockArr[i];   
            //console.log(ll,start,next)

            var temp =  self._list[start.x][start.y];
            self._list[start.x][start.y] = self._list[next.x][next.y];
            self._list[next.x][next.y] = temp

            var itemStart =  self._list[start.x][start.y].getComponent('itemPrefabJs');
            var itemNext =  self._list[next.x][next.y].getComponent('itemPrefabJs');      
           
            itemStart.setItemXY(start);
            itemNext.setItemXY(next);
            //items = self._list[start.x][start.y];
        }


        var items = self._findConverItem()
        for(var i = 0 ; i < self._lockArr.length; i ++){
            var start = self._lockArr[i];
            var item =  self._list[start.x][start.y].getComponent('itemPrefabJs');
            item.runItemActions(null,items,function(){
                console.log("openTouch")
                        // 判断转换后是否锁死
                if( self.hasLock()){
                    self.convert()
                    return;
                } 
                self.openTouch()
            })
        }
    },

    //结束
    showGameOver(){
        if(self._gameOver){
            self.closeTouch()
            self._gameOver.active =true;
        }
    },  
    _findLastItem(rowNum, colNum,flag,isLeft){
        //console.log(rowNum,colNum)
        var item = null;
        var x = 0;
        var y = 0;
        if (flag){
            for( var i = 1 ; i < rowNum + 1 ; i ++){
                var num = 0
                for( var j = 1 ; j < colNum +1 ; j ++){
                      //左右移
                    if (isLeft){
                        //console.log("left")
                        x = j;
                        y = i;
                    }else{  // 上下移动
                        x = i;
                        y = j;
                    }
                    //console.log(x,y)
                    if( self._list[x][y] == 1)
                    {
                        num += 1
                    }
                    if ( num > 0 && self._list[x][y] != 1)
                    {   
                        item = self._list[x][y]
                    }
                }
            }
        }else{
            for( var i = rowNum  ; i > 0  ; i --){
                var num = 0
                for( var j = colNum  ; j > 0  ; j --){
                      //左右移
                    if (isLeft){
                        //console.log("left")
                        x = j;
                        y = i;
                    }else{  // 上下移动
                        x = i;
                        y = j;
                    }
                    //console.log(x,y)
                    if( self._list[x][y] == 1)
                    {
                        num += 1
                    }
                    if ( num > 0 && self._list[x][y] != 1)
                    {   
                        item = self._list[x][y]
                    }
                }
            }
        }
        return item;
    },
    //移动
    _baseMove(_rowNum , _colNum,_flag,isLeft){
        var localFlag = false
        var rowNum = _rowNum || self._rowNum;
        var colNum = _colNum || self._colNum;
        var flag = _flag 
        var x = 0;
        var y = 0;
        var items = self._findLastItem(rowNum , colNum  ,flag,isLeft );
        if (flag){
            for( var i = 1 ; i < rowNum + 1 ; i ++){
                var num = 0
                for( var j = 1 ; j < colNum +1 ; j ++){
                      //左右移
                    if (isLeft){
                        x = j;
                        y = i;
                    }else{  // 上下移动
                        x = i;
                        y = j;
                    }
                    if( self._list[x][y] == 1)
                    {
                        num += 1
                    }
                    if ( num > 0 && self._list[x][y] != 1)
                    {   
                        if (!localFlag){
                            localFlag = true
                        }
                        if (isLeft){
                            self._list[x-num][y] = self._list[x][y]
                            self._list[x][y] = 1
                            var _point = cc.p((x -num),(y))
                            var item = self._list[x-num][y].getComponent('itemPrefabJs')
                            item.setItemXY(_point);
                            item.runItemActions(0.2,items,function(){
                                console.log("lall")
                                if( self.hasLock()){
                                    self.convert()
                                }    
                            })
                        }else{
                            self._list[x][y-num] = self._list[x][y]
                            self._list[x][y] = 1
                            var _point = cc.p(x,(y-num))
                            var item = self._list[x][y-num].getComponent('itemPrefabJs')
                            item.setItemXY(_point);
                            item.runItemActions(0.2,items,function(){
                                console.log("lall2")
                                if( self.hasLock()){
                                    self.convert()
                                }    
                            })
                        }
                    }
                }

            }
        }else{
            for( var i = rowNum  ; i > 0  ; i --){
                var num = 0
                for( var j = colNum  ; j > 0  ; j --){
                    //左右移
                    if (isLeft){
                        x = j;
                        y = i;
                    }else{  // 上下移动
                        x = i;
                        y = j;
                    }
                    if( self._list[x][y] == 1)
                    {
                        num += 1
                    }
                    if ( num > 0 && self._list[x][y] != 1)
                    {   
                        if (!localFlag){
                            localFlag = true
                        }
                        if (isLeft){
                            self._list[x+num][y] = self._list[x][y]
                            self._list[x][y] = 1
                            var _point = cc.p((x + num),(y))
                            var item = self._list[x + num][y].getComponent('itemPrefabJs')
                            item.setItemXY(_point);
                            item.runItemActions(0.2,items,function(){
                                console.log("lall")
                                if( self.hasLock()){
                                    self.convert()
                                }    
                            })
                        }else{
                            self._list[x][y+num] = self._list[x][y]
                            self._list[x][y] = 1
                            var _point = cc.p(x,(y+num))
                            var item = self._list[x][y+num].getComponent('itemPrefabJs')
                            item.setItemXY(_point);
                            item.runItemActions(0.2,items,function(){
                                console.log("lall2")
                                if( self.hasLock()){
                                    self.convert()
                                }    
                            })
                        }
                    }
                }
            }
        }
        console.log("localFlag",localFlag)
        if (localFlag){

        }else{
            console.log("not move")
            if( self.hasLock()){
                self.convert()
            }  
        }
    } ,
    down(){
        self._baseMove(self._rowNum, self._colNum, true)

   
    },
    up(){
        self._baseMove(self._rowNum, self._colNum, false);
    },
    left(){
        //console.log(self._colNum,self._rowNum)
        self._baseMove(self._colNum,self._rowNum, true,true);
    }   ,
    right(){
        self._baseMove(self._colNum,self._rowNum,  false,true);
    }  ,                                                                                                                                                                 
    // // 查找 消除 算法 当前弃用
    // _find(point, dir, turn,index){
    //     for(var i = 0; i < 4; i++){
    //         var _tempPoint = param[i];
    //         var temp_x = point.x + _tempPoint.x;
    //         var temp_y = point.y + _tempPoint.y;
    //         ////console.log("temp",temp_x,temp_y);
    //         if (temp_x >= 0 && temp_y >= 0 && temp_x < self._rowNum+2 && temp_y < self._colNum + 2  ){
                
    //             var next_turn = turn;
    //             if (i != dir){
    //                 next_turn = turn + 1
    //             }
    //             if (next_turn <= MAX_TURN){
    //                 if (temp_x === self._nexPoint.x && temp_y === self._nexPoint.y){
    //                     return true;
    //                 }
    //                 if (  self._list[temp_x][temp_y] && self._list[temp_x][temp_y] === 1){                        
    //                     if (self._find( cc.p(temp_x,temp_y), i, next_turn,index + 1)){
    //                         return true;
    //                     } 
    //                 }
    //             }

    //         }
    //     }

	//     return false ;     

    // },
});
