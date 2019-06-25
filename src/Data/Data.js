import _Defalut from './Defalut.js'
 
const _Data = function (CScroll) {
    _Defalut(CScroll)

    /**
     * @method 初始化数据
     */
    CScroll.prototype.initData = function () {
        this.defalut()
        this.$op = this.extend(this.defalut_option, this.op)
        this.initDom()
    }

    /**
     * @method 初始化Dom数值
     */
    CScroll.prototype.initDom = function () {
        this.$dom.el = this.el
        this.$dom.el_content = this.el.firstElementChild
        let el_h = this.$dom.el.clientHeight
        let el_w = this.$dom.el.clientWidth
        let content_h = this.$dom.el_content.clientHeight
        let content_w = this.$dom.el_content.clientWidth
        let bar_h = el_h / content_h * el_h

        this.$dom.el_h = el_h
        this.$dom.el_w = el_w
        this.$dom.content_h = content_h
        this.$dom.content_w = content_w
        this.$dom.bar_h = bar_h
        this.$dom.scroll_T = 0
        this.$dom.scroll_B = this.$dom.content_h - this.$dom.el_h
        this.$dom.scroll_L = 0
        this.$dom.scroll_R = this.$dom.content_w - this.$dom.el_w
    }

    /**
     * @method 合并传入的设置
     * @param  {Object} defalut 初始设置
     * @param  {Object} options 外部传入设置  
     * @return {Object}         返回合并后的设置
     */
    CScroll.prototype.extend = function (defalut, options) {
        // Object.assign 使用源对象的getter与setter 故不使用
        //
        let def = defalut
        let opt = options

        for (const key in opt) {
            if (opt.hasOwnProperty(key)) {
                let val = opt[key]
                // 
                if (Array.isArray(val)) {
                    def[key] = val
                } else if (typeof val === 'object') {
                    def[key] = this.extend(def[key], opt[key])
                } else {
                    def[key] = val
                }
            }
        }
        return def
    }
    /**
     * @method 刷新Dom数据
     */
    CScroll.prototype.refresh = function () {
        this.initDom()
        this.modeRecogn()
        this._setPos()
    }
    /**
     * @method 初始化pos位置
     */
    CScroll.prototype.initSetPos = function (){
        this.$pos.x = 0
        this.$pos.y = 0
        this._setPos()
    }
}

export default _Data