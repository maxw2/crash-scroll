 
const _Direction = function (CScroll) {
    /**
     * @method 判断方向
     * @return {Boolean}
     */
    CScroll.prototype.direction = function () {
        let direction = this.$op.direction
        let vx = this._this.vx
        let vy = this._this.vy
        if (direction === 'X' || direction === 'x') {
            if (Math.abs(this._this.vx) > 5) {
                if (Math.abs(vx) > Math.abs(vy)) {
                    this.$op.stopPropagation = true
                    this.$op.skipCurrent = false
                    this._this.direction = 'x'
                } else {
                    this.$op.stopPropagation = false
                    this.$op.skipCurrent = true
                    this._this.direction = false
                }
            } else if (direction === 'Y' || direction === 'y') {
                if (Math.abs(this._this.vx) > 5) {
                    if (Math.abs(vy) > Math.abs(vx)) {
                        this.$op.stopPropagation = false
                        this.$op.skipCurrent = true
                        this._this.direction = 'y'
                    } else {
                        this.$op.stopPropagation = true
                        this.$op.skipCurrent = false
                        this._this.direction = false
                    }

                }
            }
        }
    }
    /**
     * @method 初始化私有数值
     */
    CScroll.prototype.initiaDirection = function () {
        this.$op.skipCurrent = false
        this.$op.stopPropagation = false
        this._this.direction = false
    }

}

export default _Direction