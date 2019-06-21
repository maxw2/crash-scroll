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
    
}

export default _SetPos