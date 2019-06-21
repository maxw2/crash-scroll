const _Inertia = function (CScroll) {

    CScroll.prototype.startInertia = function () {
        //option 设置
        if (!this.$op.inertia) return
        //  双重判断是否开启惯性滑动
        let time = this._this.ut - this._this.mt
        time < 40 ? this._this.ine = true : this._this.ine = false
        // 超出区域禁止惯性滑动
        if (this.outSide()) this._this.ine = false

        this.calcInertia()
    }

    CScroll.prototype.calcInertia = function () {
        //  计算惯性滑动距离 
        if (this._this.ine) {
            if (this.$op.scrollX) {
                this._this.friction = (this._this.vt * this._this.vx + this._this.vx) * 0.1
            } else {
                this._this.friction = (this._this.vt * this._this.vy + this._this.vy) * 0.1
            }
            this.setInertia()
        }
    }

    CScroll.prototype.setInertia = function () {
        if (!this.$op.inertia) return
        let a = null
        // 如果friction惯性值小于1 退出函数
        if (Math.abs(this._this.friction) < 1) {
            window.cancelAnimationFrame(this.$event.time)
            this.setEase()
            return
        }
        //判断是否超出内容区
        if (this.outSide()) {
            this._this.friction -= this._this.friction * 0.2
            a = this._this.friction - this._this.friction * 0.2
        } else {
            this._this.friction -= this._this.friction * 0.1
            a = this._this.friction - this._this.friction * 0.1
        }

        if (this.$op.scrollX) {
            this.$pos.x += a
        } else {
            this.$pos.y += a
        }

        this.setPos()
        this.$event.time = window.requestAnimationFrame(this.setInertia.bind(this))
    }
}

export default _Inertia

