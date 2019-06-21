const _CustomizeEvent = function (CScroll) {
    /**
     * @method 添加事件
     * @param {String} type 事件类型
     * @param {Function} func 回调函数
     */
    CScroll.prototype.on = function (type, func) {
        switch (type) {
            case 'onTouchStart':
                this.$event.onTouchStart = touchStartFunArr(func, this)
                break;
            case 'onTouchMove':
                this.$event.onTouchMove = addTouchMoveFun(func, this)
                break;
            case 'onTouchEnd':
                this.$event.onTouchEnd = touchEndFunArr(func, this)
                break;
            case 'onScroll':
                this.$event.onScroll = addScroll(func, this)
                break;
            default:
                console.log('输入有效事件')
                break;
        }
    }
    /**
     * @method 移除事件
     * @param {String} type 事件类型
     * @param {Function} func 回调函数
     */
    CScroll.prototype.removeOn = function (type, func) {
        switch (type){
            case 'onTouchStart':
                break;
            case 'onTouchMove':
                break;
            case 'onTouchEnd':
                this.$event.touchEndFunArr
        }
        let typeEvent = this.$event[type]
        if(typeEvent){
            console.log(typeEvent)
            typeEvent.map((val,index)=>{
                if(func === val){
                    typeEvent.splice(index,1)
                }else{
                    console.log('removeOn:未找到对应函数')
                }
            })
        }
    }
    // CScroll.prototype.checkEvent = function (type) {
    //     switch (type) {
    //         case 'onTouchStart':
    //             return touchStartFun
    //         case 'onTouchMove':
    //             return touchMoveFun
    //         case 'onTouchEnd':
    //             return touchEndFun
    //         case 'onScroll':
    //             return scrollFun
    //         default:
    //             console.log('输入Type')
    //             break
    //     }
    // }

    function touchStartFunArr(func, that) {
        that.$event.touchEndFunArr.push(func)
        let funcArr = that.$event.touchEndFunArr
        return () => {
            funcArr.forEach(fn => {
                fn(that.$pos, that.el)
            })
        }
    }
    function addTouchMoveFun(func, that) {
        that.$event.touchMoveFunArr.push(func)
        let funcArr = that.$event.touchMoveFunArr
        return () => {
            funcArr.forEach(fn => {
                fn(that.$pos, that.el)
            })
        }
    }
    function touchEndFunArr(func, that) {
        that.$event.touchEndFunArr.push(func)
        let funcArr = that.$event.touchEndFunArr
        return () => {
            funcArr.forEach(fn => {
                fn.call(that.$pos, that.el,that)
            })
        }
    }
    function addScroll(func, that) {
        that.$event.scrollFunArr.push(func)
        let funcArr = that.$event.scrollFunArr
        return () => {
            funcArr.forEach(fn => {
                fn(that.$pos, that.el)
            })
        }
    }

}
export default _CustomizeEvent