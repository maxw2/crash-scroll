const _SetEase = function (CScroll) {
    
    CScroll.prototype.setEase = function () {
        let time = 0.2
        if (this.cancelEase()) {
            if (this.$op._swiper && this.$op.swiper.loop) {
                this.loopJump()
                return
            }
        }

        if (this.$op.scrollX) {
            //Left
            if (this.outSide('left')) {
                let a = this.$pos.x - this.$dom.scroll_L
                this.$pos.x -= a * time
                if (this.$pos.x - this.$dom.scroll_L < 1) this.$pos.x = this.$dom.scroll_L
                this.setPos(this.$pos.x)
                this.$event.timer = window.requestAnimationFrame(this.setEase.bind(this))
            }
            // Right  
            if (this.outSide('right')) {
                let a = this.$pos.x + this.$dom.scroll_R
                this.$pos.x -= a * time
                if (Math.abs(this.$pos.x) - this.$dom.scroll_R < 1) this.$pos.x = -this.$dom.scroll_R
                this.setPos(this.$pos.x)
                this.$event.timer = window.requestAnimationFrame(this.setEase.bind(this))
            }
        } else {
            //Top
            if (this.outSide('top')) {
                let a = this.$pos.y - this.$dom.scroll_T // 回弹距离
                this.$pos.y -= a * time
                if (Math.abs(this.$pos.y) - this.$dom.scroll_T < 1) this.$pos.y = this.$dom.scroll_T // 校准定位 
                this.setPos(this.$pos.y)
                this.$event.timer = window.requestAnimationFrame(this.setEase.bind(this))
            }
            //Bottom
            if (this.outSide('bottom')) {
                let a = this.$pos.y + this.$dom.scroll_B  // 回弹距离
                this.$pos.y -= a * time
                if (Math.abs(this.$pos.y) - this.$dom.scroll_B < 1) this.$pos.y = -this.$dom.scroll_B // 校准定位
                this.setPos(this.$pos.y)
                this.$event.timer = window.requestAnimationFrame(this.setEase.bind(this))
            }
        }
    }
    /**
     * @method 取消回弹函数
     */
    CScroll.prototype.cancelEase = function(){
        if (this.$op.scrollX) {
            if (this.$pos.x === this.$dom.scroll_L || this.$pos.x === -this.$dom.scroll_R) {
                window.cancelAnimationFrame(this.$event.timer)
                return true
            }
        } else {
            if (this.$pos.y === this.$dom.scroll_T || this.$pos.y === -this.$dom.scroll_B) {
                window.cancelAnimationFrame(this.$event.timer)
                return true
            }
        }
    }
}

export default _SetEase