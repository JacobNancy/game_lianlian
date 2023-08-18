// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html
var rank = require('./rank')
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
        tongle1:{
            default:null,
            type:cc.Toggle,
        },
        tongle2:{
            default:null,
            type:cc.Toggle,
        },
        rankScroll:{
            default:null,
            type:cc.Node,
        },
        listItem :{
            default:null,
            type:cc.Prefab,
        },
        rScroll:{
            default:null,
            type:cc.Node,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        self = this;
        self._friendsData = null;
        self._worldsData = null;
        self._friendsBests = new Array();
        self._worldsBests = new Array();
        self._myRank = 0;
        self._scrolll2 = cc.find("rankScroll2",self.node);
        self._content2 = cc.find("rankScroll2/view/content",self.node);
        self.register()
    },
    register(){
        var backbtn = cc.find("backBtn",self.node);
        backbtn.on('click',function(event){
            if(self._callBack){
                self._callBack()
            }
            self.node.active = false
        },self)
    },
    start () {

    },
    createItem(i,info){
        ////console.log(info)
        var _item = cc.instantiate(self.listItem);
        var itemJs = _item.getComponent('item')
       // //console.log(itemJs)
        itemJs.init(info,i);
        return _item ;
    },
    init(data,callbacks){
        //console.log(data)
        self._friendsData = data.friendRank;
        self._worldsData = data.worldRank
        // self._friendsData = new Array();
        // self._worldsData = new Array();
        // var value = data.friendRank[0]
        // for(let i = 0; i< 100; i++){
        //     self._friendsData.push(value)
        //     self._worldsData.push(value) 
        // }
        // self._myRank = data.myRank
        self._callBack = callbacks
        //我的排名
        var myRnakWidget = cc.find("myRankBg/myRank",self.node)
        myRnakWidget.getComponent(cc.Label).string = "我的排名："+ self._myRank
        self.initBestsData()
        self._initScroll(self.rankScroll,self._friendsData.length,self._friendsData);
        self._initScroll(self._content2,self._worldsData.length,self._worldsData);
        self._scrolll2.active = false;
    },
    initBestsData()
    {
        self._friendsBests.splice(0,self._friendsBests.length)
        self._worldsBests.splice(0,self._worldsBests.length)
        for(let i = 0; i < 3 ; i++){
            var value = self._friendsData.shift()
            var value2 = self._worldsData.shift()
            if(typeof(value) !="undefined"){ 
                self._friendsBests.push(value) 
            }
            if(typeof(value2) !="undefined"){ 
                self._worldsBests.push(value) 
            }
        }
        ////console.log(self._friendsBests)
        self._initBestsView(self._friendsBests)
    },
    _initBestsView(list){
        for(let i = 0; i < 3 ; i++){
            var value = list[i];
            if(typeof(value) !="undefined"){ 
                self._initBest(i +1,value)
            }
        }      
    },
    _initBest(index, value){
        var path = "rank_"+index
        //这些都无用
        var _rank = cc.find(path,self.node);
        ////console.log("_InitBest rank",_rank)
        var name = cc.find("name",_rank);
        
        ////console.log("_InitBest",name)
        name = name.getComponent(cc.Label)
        var grade = cc.find("grade",_rank);
        grade = grade.getComponent(cc.Label)
        var location = cc.find("location",_rank);
        location = location.getComponent(cc.Label)
        var image = cc.find("mask/image",_rank);
        image = image.getComponent(cc.Sprite)

        name.string = value.name || "";
        grade.string = value.score || 0 ;
        //获取人物头像
        var texture = value.portrait;
        if (!texture){
            return
        }
        texture = texture.split("/0",1); 
        texture = texture + "/64";
        cc.loader.load({url:texture, type:'png'},function(err,texture){
            ////console.log("loadUrl",texture instanceof cc.Texture2D)
            var spriteFrame = new cc.SpriteFrame();
            spriteFrame.setTexture(texture)
            image.spriteFrame = spriteFrame

        })

    },
    _initScroll(_scroll, num, data){
        var _height = 0
        var content = _scroll
        
        for(let i = 0 ; i < num;i ++){
            var item = self.createItem(i,data[i])       
            content.addChild(item)
            if (_height === 0){
                ////console.log("item")
                _height = item.getContentSize().height
            }
            item.setPosition(0,- i * _height - _height/2)
            ////console.log(item.getPosition())

        };
        var contentSize = content.getContentSize()
        if (_height*num > contentSize.height){
            ////console.log("setSize")
            content.setContentSize (contentSize.width, _height*num)
        }
        contentSize = content.getContentSize()

        ////console.log(contentSize)
    },
    checkTongle1(){
        self._initBestsView(self._friendsBests)
        self.rScroll.active = true;
        self._scrolll2.active = false;
        //self._scrolll2.getComponent(cc.ScrollView).scrollToTop(0.1);
        // self.rankScroll.removeAllChildren()
        // self._initBestsView(self._friendsBests)
        // self._initScroll(self.rankScroll,self._friendsData.length,self._friendsData);
        // ////console.log("checkTongle1")
        // self.rScroll.getComponent(cc.ScrollView).scrollToTop(0.1);
        
    },
    checkTongle2(){

        self._initBestsView(self._worldsBests) 
        self.rScroll.active = false;
        self._scrolll2.active = true;
        //self.rScroll.getComponent(cc.ScrollView).scrollToTop(0.1);
        // self.rankScroll.removeAllChildren()
        // if (self._worldsData){
        //     self._initBestsView(self._worldsBests)        
        //     self._initScroll(self.rankScroll,self._worldsData.length,self._worldsData);
        //     self.rScroll.getComponent(cc.ScrollView).scrollToTop(0.1);
        // }


    }
    // update (dt) {},
});
