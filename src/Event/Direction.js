
const _Direction = function (CScroll) {
    /**
     * @method 判断方向
     * @return {Boolean}
     */
    CScroll.prototype.direction = function () {
        let direction = this.$op.direction
        
        if(direction === 'X' || direction === 'x'){
            if(Math.abs(this._this.vx) > 1) {
                console.log('x')
                this.$op.stopPropagation = true
                this.$op.skipCurrent = false
                this._this.direction = true
                
            }else{
                console.log('y')
                this.$op.stopPropagation = false
                this.$op.skipCurrent = true
                this._this.direction = true
            }
        }else if (direction === 'Y' || direction === 'y') {
            if(Math.abs(this._this.vx) > 1) {
                this.$op.stopPropagation = false
                this.$op.skipCurrent = true
                this._this.direction = true
            }else {
                this.$op.stopPropagation = true
                this.$op.skipCurrent = false
                this._this.direction = true
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