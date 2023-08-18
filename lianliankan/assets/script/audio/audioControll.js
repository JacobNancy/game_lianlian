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
        bgAudio:{
            default:null,
            url:cc.AudioClip,
        },
        onTouch:{
            default:null,
            url:cc.AudioClip,
        },
        onXiaochu:{
            default:null,
            url:cc.AudioClip,        
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        self = this;
        // cc.loader.loadRes("audio/ef_xx_touch",cc.AudioClip,function(err,audio){
        //     console.log("audio Load",audio);
        //     cc.audioEngine.play(audio, true, 0.2);
        // })
    },

    start () {

    },
    onStartBgAudio(){
        this._bgAudio = cc.audioEngine.play(this.bgAudio, true, 0.8);
    },
    onCloseBgAudio(){
        cc.audioEngine.stop(this._bgAudio);
    },
    startAudio()
    {
        cc.audioEngine.play(this.onStar, false, 1);
    },
    onTouchAudio(){
        cc.audioEngine.play(this.onTouch, false, 1);
    },
    onXiaochuAudio(){
        cc.audioEngine.play(this.onXiaochu, false, 1);
    },
    // onFailAudio(){
    //     cc.audioEngine.play(this.onFail, false, 1);
    // },
    // onPassAudio(){
    //     cc.audioEngine.play(this.onPass, false, 1);
    // },
    // onNextAudio(){
    //     cc.audioEngine.play(this.onNext, false, 1);
    // },
    // onStarAudio(){
    //     cc.audioEngine.play(this.onStar, false, 1);
    // },
    // onSourceAudio(index){
    //     //console.log("Audio:",index)
    //     if (index>=0 && index < 9){
    //         cc.audioEngine.play(this.sourceAudio[index], false, 1); 
    //     }
    // },
    // update (dt) {},
});
