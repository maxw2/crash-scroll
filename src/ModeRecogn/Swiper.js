
const _Swiper = function (CScroll) {
    CScroll.prototype.swiper = function () {
        removeLoop(this)
        initData(this)
        createLoop(this)
        createBtn(this)


    }

    function initData(that) {
        let swiper = that.$dom.swiper
        swiper.el_childs = eleChildNodes(that.$dom.el_content.childNodes)
        swiper.len = swiper.el_childs.length
        swiper.el_frist = swiper.el_childs[0]
        swiper.el_last = swiper.el_childs[swiper.len - 1]
        that.$dom.el_content.style.width = 100 * swiper.len + '%'
        that.$dom.content_w = that.$dom.el_content.clientWidth
        //loop 循环
        // if(swiper.loop) that._this.num = 1

        //
        function eleChildNodes(node) {
            let arr = []
            for (let i = 0; i < node.length; i++) {
                if (node[i].nodeType === 1) {
                    arr.push(node[i])
                }
            }
            return arr
        }
    }
    function createLoop(that) {
        if (!that.$op._swiper || !that.$op.swiper.loop) return
        if (!that.$dom.swiper.el_frist || !that.$dom.swiper.el_last) return
        let frist = that.$dom.swiper.el_frist.cloneNode(true)
        let last = that.$dom.swiper.el_last.cloneNode(true)

        that.$dom.swiper.el_frist = that.$dom.el_content.insertBefore(last, that.$dom.swiper.el_childs[0])
        that.$dom.swiper.el_last = that.$dom.el_content.appendChild(frist)

        that.$dom.el_content.style.width = 100 * (that.$dom.swiper.len + 2) + '%'
        that.$pos.x = -that.$dom.el_w
        that.setPos()
    }
    function removeLoop(that) {
        let swiper = that.$dom.swiper
        if (!that.$op._swiper || !that.$op.swiper.loop) return
        if (!that.$dom.swiper.el_last || !that.$dom.swiper.el_frist) return

        that.$dom.el_content.removeChild(swiper.el_frist)
        that.$dom.el_content.removeChild(swiper.el_last)

    }
    function createBtn(that) {
        if (!that.$op._swiper && !that.$op.swiper.btn) return
    }
    /**
     * @method 切换图片数页 
     */
    CScroll.prototype.changeNum = function () {
        let thr = this.$op.swiper.threshold
        let _this = this._this

        if (this.$op.scrollX) {
            let a = Math.abs(this.$pos.x / this.$dom.el_w)
            let b = a - Math.floor(a)
            // 取消调用组建
            // if (!this.$op.swiper.loop) {
            //     if (_this.num === 0) {
            //         if (_this.vx > 0) return
            //     }
            //     if (_this.num === this.$dom.swiper.len - 1) {
            //         if (_this.vx < 0) return
            //     }
            // }

            // 判断图片的左右滑动 如果判断thr
            // 如果向左滑动
            if (_this.vx > 0) {
                if (b > thr) {
                    _this.num = Math.ceil(a)

                } else if (b <= thr) {
                    _this.num = Math.floor(a)
                }
                // 向右滑动
            } else {
                if (b > 1 - thr) {
                    _this.num = Math.ceil(a)
                } else if (b <= 1 - thr) {
                    _this.num = Math.floor(a)
                }
            }
        }
        //
        //
        if (this.$op.swiper.loop) {
            this.$pos.num = this._this.num - 1
        } else if (!this.$op.swiper.loop) {
            this.$pos.num = this._this.num
            this.$event.onSwiper()
        }
        this.changeSide()
    }
    /**
     * @method 通过切换左右边距以切换图片
     */
    CScroll.prototype.changeSide = function () {
        let num = this._this.num
        this.$dom.scroll_L = -this.$dom.el_w * num
        this.$dom.scroll_R = -this.$dom.scroll_L
    }
    /**
     * @method 开启循环模式，跳转页面
     */
    CScroll.prototype.loopJump = function () {
        // 由于左右间距被修改过
        // 所以需要重新定位content的左右距离
        let fX = 0
        let lX = this.$dom.content_w + this.$dom.el_w
        // 第一个页面
        // 跳转至倒数第二个
        if (this.$pos.x === fX || this._this.num === 0) {
            let x = this.$dom.el_w * (this.$dom.swiper.len)
            this.$pos.x = -x
            this._this.num = this.$dom.swiper.len - 1
            this._this.loopLock = false
            this.$pos.num = this._this.num
            // 最后一个页面
            // 跳转至第二个
        } else if (this.$pos.x === -lX || this._this.num === this.$dom.swiper.len + 1) {
            let x = this.$dom.el_w
            this.$pos.x = -x
            this._this.num = 0
            this._this.loopLock = false
            this.$pos.num = this._this.num
        }
        // this.$pos.num = this._this.num
        if (this.$op.swiper.loop) this.$event.onSwiper()
        this.setPos()
    }
    /**
     * @method 跳转完毕前禁止滑动
     * @return {Boolean}
     */
    CScroll.prototype.loopLock = function () {
        // 是否开启loopLock 阻止滑动
        if (this.$op.swiper && this.$op.swiper.loop && this.$op._swiper) {
            let lX = 0
            let rX = this.$dom.content_w + this.$dom.el_w

            if (this.$pos.x > -lX) {
                this._this.loopLock = true
            } else if (this.$pos.x < -rX) {
                this._this.loopLock = true
            } else {
                this._this.loopLock = false
            }
            return this._this.loopLock
        }

    }


}

export default _Swiper