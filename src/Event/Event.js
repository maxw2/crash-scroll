import _SetPos from './SetPos'
import _Inertia from './Inertia.js'
import _SetEase from './SetEase'
import _Direction from './Direction.js'
import _CustomizeEvent from './CustomizeEvent'


const _Event = function (CScroll) {
    _SetPos(CScroll)
    _Inertia(CScroll)
    _SetEase(CScroll)
    _Direction(CScroll)
    _CustomizeEvent(CScroll)

    CScroll.prototype.event = function () {
        this.addEvent()
    }

    CScroll.prototype.addEvent = function () {
        let that = this
        this.el.addEventListener('touchstart', this.EventTouchStart.bind(that), { passive: false, capture: !!this.$op.capture })
        this.el.addEventListener('touchmove', this.EventTouchMove.bind(that), { passive: false, capture: !!this.$op.capture })
        this.el.addEventListener('touchend', this.EventTouchEnd.bind(that), { passive: false, capture: !!this.$op.capture })
    }

    CScroll.prototype.removeEvent = function () {
        let that = this
        this.el.removeEventListener('touchstart', this.EventTouchStart.bind(that), { passive: false, capture: !!this.$op.capture })
        this.el.removeEventListener('touchmove', this.EventTouchMove.bind(that), { passive: false, capture: !!this.$op.capture })
        this.el.removeEventListener('touchend', this.EventTouchEnd.bind(that), { passive: false, capture: !!this.$op.capture })
    }

    // TouchStart
    CScroll.prototype.EventTouchStart = function (ev) {
        // ev.preventDefault()
        // if (!this.$op.direction || this.$op._swiper) {
            window.cancelAnimationFrame(this.$event.time)
            // window.cancelAnimationFrame(this.$event.timer)
        // }
        this.initiaDirection()

        this._this.dt = ev.timeStamp
        this._this.dx = ev.touches[0].clientX
        this._this.dy = ev.touches[0].clientY

        if (this.$op.direction) this.$op.stopPropagation = true
        this.$event.onTouchStart()
    }
    
    // TouchMove
    CScroll.prototype.EventTouchMove = function (ev) {
        ev.preventDefault()
        // 当前停止还是上层事件停止
        if (this.$op.skipCurrent) return
        if (this.$op.stopPropagation) ev.stopPropagation()
        // 
        if (this.$op._swiper && this.$op.swiper.loop) {
            if (this.loopLock()) return
        }

        this._this.mt = ev.timeStamp
        this._this.mx = ev.touches[0].clientX
        this._this.my = ev.touches[0].clientY

        this._this.vx = this._this.mx - this._this.dx
        this._this.vy = this._this.my - this._this.dy
        this._this.vt = this._this.mt - this._this.dt
        //
        if (this.$op.direction && !this._this.direction) {
            this.direction()
            return
        }

        if (!this.$op._swiper) {
            if (this.$op.scrollX) {
                // 判断是否超出内容区
                this.outSide()
                    ? this.$pos.x += this._this.vx * 0.2 : this.$pos.x += this._this.vx
            } else if (!this.$op.scrollX) {
                this.outSide()
                    ? this.$pos.y += this._this.vy * 0.2 : this.$pos.y += this._this.vy
            }
        } else if (this.$op._swiper) {
            // 自己理解
            if (this._this.num === 0 && !this.$op.swiper.loop) {
                this._this.vx > 0 ?
                    this.$pos.x += this._this.vx * 0.2 : this.$pos.x += this._this.vx
            } else if (this._this.num === this.$dom.swiper.len - 1 && !this.$op.swiper.loop) {
                this._this.vx < 0 ?
                    this.$pos.x += this._this.vx * 0.2 : this.$pos.x += this._this.vx
            } else {
                this.$pos.x += this._this.vx
            }
        }

        if(!this.$op.scrollX && this.$op.sideLock) {
            if(this.$pos.y >= this.$op.sideLock[0] && this.$op.sideLock[0]) {
                this.$pos.y = this.$op.sideLock[0]
                this._setPos()
                return 
            }else if(this.$pos.y <= -(this.$dom.content_h - this.$dom.el_h + this.$op.sideLock[1]) && this.$op.sideLock[1]){
                this.$pos.y = -(this.$dom.content_h - this.$dom.el_h + this.$op.sideLock[1])
                this._setPos()
                return 
            }
        }
        this.setPos()
        this.$event.onTouchMove()

        this._this.dt = this._this.mt
        this._this.dx = this._this.mx
        this._this.dy = this._this.my
    }

    // TouchEnd
    CScroll.prototype.EventTouchEnd = function (ev) {
        // 当前停止还是上层事件停止
        if (this.$op.skipCurrent) return
        if (this.$op.stopPropagation) ev.stopPropagation()
        if (this.$op._swiper) {
            this.changeNum()
        }

        
        this.startInertia()
        this.setEase()
        this.$event.onTouchEnd()
    }




}

export default _Event