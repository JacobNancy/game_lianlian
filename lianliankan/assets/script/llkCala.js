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
export default class LLKCala{
    constructor(target){
        this.init(target)
    }
    init(target){
        this._target = target;
        self = this;
        self._arr = new Array();
    };

    getPointArray(){
        return self._arr;
    }
    setPointArray(arr){
        
    }
    /** 判断是否可连上消失*/
    canFadeAway(first,second)
    {
        self._arr.splice(0,self._arr.length);
        self._arr.push(first)
        if(	self.checkLine(first,second) || 
            self.checkOneCorner(first,second) ||
            self.checkTwoCorner(first,second	))
        {
            //console.log(self._arr)
            return true;
        }
        return false;
    }
    /** 直线连法*/
    checkLine(first, second)
    {
        //console.log("checkLine")
        var dx			=	first.x- second.x
        var dy			=	first.y - second.y;
        var next		=	0;
        //console.log(dx,dy)
        var _Arr = new Array();
        if (dx === 0)
        {
            //console.log("dx")
            for (var i = 0; i < Math.abs(dy); i++)
            {
                if (dy < 0) next++;
                    else	next--;
                var getNext = cc.p(first.x, first.y + next)
                _Arr.push(getNext);
                if (getNext.x == second.x && getNext.y == second.y)
                {   
                    
                    self._arr = self._arr.concat(_Arr);
                    return true;
                }else if (!self._target.judgeItem(getNext))
                {
                    _Arr.splice(0,_Arr.length);
                    break;
                }
            }
        }else if(dy === 0)
        {
            //console.log("dy")
            for (var i = 0; i < Math.abs(dx); i++)
            {
                if (dx < 0) next++;
                else	next--;
                var getNext = cc.p(first.x + next , first.y)
                _Arr.push(getNext);
                if (getNext.x == second.x && getNext.y == second.y)
                {
                    self._arr = self._arr.concat(_Arr);
                    return true;
                }else if (!self._target.judgeItem(getNext))
                {
                    _Arr.splice(0,_Arr.length);
                    break;
                }
            }
        }
        return false;
    }

    /** 一拐点连法*/
    checkOneCorner(first, second)
    {
        //console.log("checkOneCorner")
        var oneCorner = cc.p(first.x, second.y);
        var twoCorner = cc.p(second.x, first.y);

        if (self._target.judgeItem(oneCorner) &&  self.checkLine(first,oneCorner) && self.checkLine(oneCorner,second)){

            return true
        }
        self._arr.splice(1,self._arr.length);
        if( self._target.judgeItem(twoCorner) && self.checkLine(first,twoCorner) && self.checkLine(twoCorner,second))
        {
            //self._arr.push(twoCorner)
            return true;
        }
        return false;
    }

    /** 二拐点连法*/
    checkTwoCorner( first,second)
    {
        //console.log("checkTwoCorner")
        var getIcon	= null;
        var i= 0;
        for ( i = first.x + 1; i < self._target.getRowNum(); i++)
        {
            self._arr.splice(1,self._arr.length)
            getIcon	= cc.p(i,first.y);	
            if (!self._target.judgeItem(getIcon))
            {
                
                break;
            }else if (self.checkOneCorner(getIcon,second))
            {
                self.checkLine(first,getIcon)
                return true;
            }

        }
        for ( i = first.x - 1; i >= 0; i--)
        {
            self._arr.splice(1,self._arr.length)
            getIcon	= cc.p(i,first.y);
            if (!self._target.judgeItem(getIcon))
            {
                break;
            }else if (self.checkOneCorner(getIcon,second))
            {
                self.checkLine(first,getIcon)
                return true;
            }
            
        }
        for ( i = first.y - 1; i >= 0; i--)
        {
            self._arr.splice(1,self._arr.length)
            getIcon	= cc.p(first.x,i);
            if (!self._target.judgeItem(getIcon))
            {
                self._arr.splice(1,self._arr.length)
                break;
            }else if (self.checkOneCorner(getIcon,second))
            {
                self.checkLine(first,getIcon)
                return true;
            }
           
        }
        for ( i = first.y + 1; i < self._target.getColNum(); i++)
        {
            self._arr.splice(1,self._arr.length)
            getIcon	= cc.p(first.x,i);
            if (!self._target.judgeItem(getIcon))
            {
                break;
            }else if (self.checkOneCorner(getIcon,second))
            {
                self.checkLine(first,getIcon)
                return true;
            }
            
        }
        return false;
    }
};


