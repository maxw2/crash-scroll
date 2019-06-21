import _Data from './Data/Data.js'
import _Event from './Event/Event.js'
import _ModeRecogn from './ModeRecogn/ModeRecogn.js';


const CScroll = function (el,options) {
    this.el = el
    this.op = options
    
    this.initData()
    this.modeRecogn()
    this.event()

}

_Data(CScroll)
_ModeRecogn(CScroll)
_Event(CScroll)

// console.dir(CScroll)

export default CScroll