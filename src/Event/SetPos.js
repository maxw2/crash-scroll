const _SetPos = function (CScroll) {
    //
    CScroll.prototype.setPos = function () {

        let content = this.$dom.el_content
        let bar = this.$dom.el_bar

        if (this.$op.scrollX) {
            content.style.transform = 'translateX(' + this.$pos.x + 'px) translateZ(0px)'
        } else {
            content.style.transform = 'translateY(' + this.$pos.y + 'px) translateZ(0px)'
            if (bar) {
                bar.style.top = -this.$pos.y / this.$dom.content_h * this.$dom.el_h + 'px'
            }
        }

        this.$event.onScroll()
    }
    //
    CScroll.prototype._setPos = function () {
        let content = this.$dom.el_content
        let bar = this.$dom.el_bar

        if (this.$op.scrollX) {
            content.style.transform = 'translateX(' + this.$pos.x + 'px) translateZ(0px)'
        } else {
            content.style.transform = 'translateY(' + this.$pos.y + 'px) translateZ(0px)'
            if (bar) {
                bar.style.top = -this.$pos.y / this.$dom.content_h * this.$dom.el_h + 'px'
            }
        }
    }

    /**
     *  @method 判断是否超出内容区
     *  @param  {String} val            输入方向判断位置 如不输入则判断两个方向
     *  @return {Boolean}               返回boolean 
     */
    CScroll.prototype.outSide = function (val) {
        let a = Boolean
        if (this.$op.scrollX) {
            switch (val) {
                case 'left':
                    this.$pos.x > this.$dom.scroll_L
                        ? a = true : a = false
                    break;
                case 'right':
                    this.$pos.x < -this.$dom.scroll_R
                        ? a = true : a = false
                    break;
                default:
                    (this.$pos.x > this.$dom.scroll_L || this.$pos.x < -this.$dom.scroll_R)
                        ? a = true : a = false
            }
        } else {
            switch (val) {
                case 'top':
                    this.$pos.y > this.$dom.scroll_T
                        ? a = true : a = false
                    break;
                case 'bottom':
                    this.$pos.y < -this.$dom.scroll_B
                        ? a = true : a = false
                    break;
                default:
                    (this.$pos.y > this.$dom.scroll_T || this.$pos.y < -this.$dom.scroll_B)
                        ? a = true : a = false
            }
        }

        return a
    }

    /**
     * @method 判断是否执行区域锁  // 会修改全局数据
     * @return {Boolean}
     */
    CScroll.prototype.sideLock = function () {
        let top = this.$op.sideLock[0]
        let right = this.$op.sideLock[1]
        let bottom = this.$op.sideLock[2]
        let left = this.$op.sideLock[3]

        if (this.$op.scrollX) {
            if (this.$pos.x >= left && left) {
                this.$pos.x = left
                return true
            } else if (this.$pos.x <= right && right) {
                this.$pos.x = right
                return true
            }
        } else if (!this.$op.scrollX) {
            if (this.$pos.y >= top && top) {
                this.$pos.y = top
                return true
            } else if (this.$pos.y <= bottom && bottom) {
                this.$pos.y = bottom
                return true
            }
        }

        return false

    }

    /** 
     * 需要重写
     * @method  scroll跳转
     * @param   {Number}    to    // 跳转的坐标
     * @param   {Number}    time  // 时间
     */
    CScroll.prototype.scrollTo = function (to, time) {
        let posTo = to
        let distance = null
        let timeNum = time || 0.01
 
        if (this.$op.scrollX) {
            distance = posTo - this.$pos.x
        } else if (!this.$op.scrollX) {
            distance = posTo - this.$pos.y
        }


        scrollToPos.call(this, distance, to)


        function scrollToPos(distance, to) {
            let _time = null
            let posTo = to
            
            if (this.$op.scrollX && Math.abs(this.$pos.x) === Math.abs(posTo)) {
                window.cancelAnimationFrame(_time)
                return
            } else if (!this.$op.scrollX && Math.abs(this.$pos.y) === Math.abs(posTo)) {
                window.cancelAnimationFrame(_time)
                return
            }


            if (this.$op.scrollX) {
                this.$pos.x += distance * timeNum
            } else if (!this.$op.scrollX) {
                this.$pos.y += distance * timeNum
            }
            this._setPos()
            _time = window.requestAnimationFrame(scrollToPos.bind(this, distance, to))
        }




    }



}

export default _SetPos