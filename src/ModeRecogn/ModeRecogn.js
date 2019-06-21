import _Scroll from './Scroll.js'
import _Swiper from './Swiper.js'

const _ModeRecogn = function (CScroll) {
    _Scroll(CScroll)
    _Swiper(CScroll)

    CScroll.prototype.modeRecogn = function() {
        let op = this.op
        for (const key in op) {
            if (op.hasOwnProperty(key)) {
                switch (key) {
                    case 'swiper':
                        if (!op[key]) return
                        this.$op._swiper = true
                        this.swiper()
                        return
                    default:
                        this.scroll()
                        break;
                }
            }
        }
    }
}

export default _ModeRecogn