// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

//var rank = require('./rank')
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
            type:cc.ScrollView,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        self = this;
        self._listData = new Array();
        // self._friendsData = null;
        
        // self._worldsData = null;
         self._bestsData = new Array();
        // self._worldsBests = new Array();
        self._myRank = 0;
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
        ////console.log(itemJs)
        itemJs.init(info,i);
        return _item ;
    },
    init(data,callbacks){
        //console.log(data)

        self._listData.splice(0,self._listData.length)

        var value = data;
        ////console.log(value);
        for(let i = 0; i< value.length; i++){
            self._listData[i] = value[i];
        }
        self._myRank = data.myRank
        self._callBack = callbacks
        //我的排名
        var myRnakWidget = cc.find("myRankBg/myRank",self.node)
        myRnakWidget.getComponent(cc.Label).string = "我的排名："+ self._myRank
        self.initBestsData()
        self._initScroll(self.rankScroll,self._listData.length,self._listData);
    },
    initBestsData()
    {
        self._bestsData.splice(0,self._listData)
        for(let i = 0; i < 3 ; i++){
            var value = self._listData.shift()
            if(typeof(value) !="undefined"){ 
                self._bestsData.push(value) 
            }
        }
        //console.log(self._bestsData)
        self._initBestsView(self._bestsData)
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

        //console.log(contentSize)
    },
    // update (dt) {},
});
