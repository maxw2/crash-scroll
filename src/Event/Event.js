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
        window.cancelAnimationFrame(this.$event.time)
        // if (!this.$op.direction) window.cancelAnimationFrame(this.$event.timer)
        this.initiaDirection()
        /**
         * 
         */
        this._this.vx = null,
        this._this.vy = null,
        this._this.vt = null

        /**
         * 
         */
        this._this.dt = ev.timeStamp
        this._this.dx = ev.touches[0].clientX
        this._this.dy = ev.touches[0].clientY

        /**
         * 
         */
        if (this.$op.direction) this.$op.stopPropagation = true
       
        this.$event.onTouchStart()
    }

    // TouchMove
    CScroll.prototype.EventTouchMove = function (ev) {
        /**
         * touchesMove
         * 处理数据
         */
        ev.preventDefault()
        // 当前停止还是上层事件停止
        if (this.$op.skipCurrent) return
        if (this.$op.stopPropagation) ev.stopPropagation()

        // swiper loop 滑动锁
        if (this.$op._swiper && this.$op.swiper.loop) {
            if (this.loopLock()) return
        }

        // 移动数据
        this._this.mt = ev.timeStamp
        this._this.mx = ev.touches[0].clientX
        this._this.my = ev.touches[0].clientY
        this._this.vx = this._this.mx - this._this.dx
        this._this.vy = this._this.my - this._this.dy
        this._this.vt = this._this.mt - this._this.dt
 
        // 方向滑动判定
        if (this.$op.direction && !this._this.direction) {
            this.direction()
            return
        }

        // 如果子元素
        if (this.$op.direction && this._this.direction === this.$op.direction){
            window.cancelAnimationFrame(this.$event.timer)
        }else if(!this.$op.direction ){
            window.cancelAnimationFrame(this.$event.timer)
        }
        
        /**
         * touchesMove 
         * 执行阶段
         */

        // scroll滑动
        if (!this.$op._swiper) {
            if (this.$op.scrollX) {
                // 判断是否超出内容区
                this.outSide()
                    ? this.$pos.x += this._this.vx * 0.2 : this.$pos.x += this._this.vx
            } else if (!this.$op.scrollX) {
                this.outSide()
                    ? this.$pos.y += this._this.vy * 0.2 : this.$pos.y += this._this.vy
            }


        // swiper滑动
        } else if (this.$op._swiper) {
            // swiper不为循环滑动
            if (this._this.num === 0 && !this.$op.swiper.loop) {
                // 
                this._this.vx > 0 && this.$pos.x >= -this.$dom.scroll_L ?
                    this.$pos.x += this._this.vx * 0.2 : this.$pos.x += this._this.vx
            } else if (this._this.num === this.$dom.swiper.len - 1 && !this.$op.swiper.loop) {
                // 
                this._this.vx < 0 && this.$pos.x <= -this.$dom.scroll_R ?
                    this.$pos.x += this._this.vx * 0.2 : this.$pos.x += this._this.vx

                    // swiper 为循环滑动
            } else {
                this.$pos.x += this._this.vx
            }
        }

        // 区域锁 会修改$pos
        this.sideLock()



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