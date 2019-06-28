const _CustomizeEvent = function (CScroll) {
    /**
     * @method 添加事件
     * @param {String} type 事件类型
     * @param {Function} func 回调函数
     */
    CScroll.prototype.on = function (type, func) {
        switch (type) {
            case 'onTouchStart':
                this.$event.onTouchStart = ontouchStart(func, this)
                break;
            case 'onTouchMove':
                this.$event.onTouchMove = onTouchMove(func, this)
                break;
            case 'onTouchEnd':
                this.$event.onTouchEnd = onTouchEnd(func, this)
                break;
            case 'onScroll':
                this.$event.onScroll = onScroll(func, this)
                break;
            case 'onSwiper':
                this.$event.onSwiper = onSwiper(func, this)
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
        let funcArr = null
        switch (type) {
            case 'onTouchStart':
                funcArr = this.$event.touchStartFunArr
                break;
            case 'onTouchMove':
                funcArr = this.$event.touchMoveFunArr
                break;
            case 'onTouchEnd':
                funcArr = this.$event.touchEndFunArr
                break;
            case 'onScroll':
                funcArr = this.$event.scrollFunArr
                break;
            case 'onSwiper':
                funcArr = this.$event.scrollFunArr
                break;
            default:
                console.log('输入的事件类型有误')
                return
        }
        for (let i = 0; i < funcArr.length; i++) {
            if (funcArr[i] === func) {
                let fn = funcArr.splice(i, 1)
                console.log(fn)
            }
        }
    }
    /**
     * @method 检查事件代理的函数
     * @param {String} type 事件类型
     */
    CScroll.prototype.checkEvent = function (type) {
        let fn = null
        switch (type) {
            case 'onTouchStart':
                fn = this.$event.touchStartFunArr
                break;
            case 'onTouchMove':
                fn = this.$event.touchMoveFunArr
                break;
            case 'onTouchEnd':
                fn = this.$event.touchEndFunArr
                break;
            case 'onScroll':
                fn = this.$event.scrollFunArr
                break;
            default:
                console.log('输入的事件类型有误')
                return
        }
        return fn
    }

    function ontouchStart(func, that) {
        that.$event.touchEndFunArr.push(func)
        let funcArr = that.$event.touchEndFunArr
        return () => {
            funcArr.forEach(fn => {
                fn(that.$pos, that.el)
            })
        }
    }
    function onTouchMove(func, that) {
        that.$event.touchMoveFunArr.push(func)
        let funcArr = that.$event.touchMoveFunArr
        return () => {
            funcArr.forEach(fn => {
                fn(that.$pos, that.el)
            })
        }
    }
    function onTouchEnd(func, that) {
        that.$event.touchEndFunArr.push(func)
        let funcArr = that.$event.touchEndFunArr
        return () => {
            funcArr.forEach(fn => {
                fn(that.$pos, that.el)
            })
        }
    }
    function onScroll(func, that) {
        that.$event.scrollFunArr.push(func)
        let funcArr = that.$event.scrollFunArr
        return () => {
            funcArr.forEach(fn => {
                fn(that.$pos, that.el)
            })
        }
    }
    function onSwiper(func, that) {
        that.$event.swiperFunArr.push(func)
        let funcArr = that.$event.swiperFunArr
        return () => {
            funcArr.forEach(fn => {
                fn(that.$pos, that.el)
            })
        }
    }

}
export default _CustomizeEvent