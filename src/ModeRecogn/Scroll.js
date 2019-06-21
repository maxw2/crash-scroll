const _Scroll = function (CScroll) {
    CScroll.prototype.scroll = function () {
        createBar(this)

    }
    function createBar (that) {
        if (!that.$op.scrollBar) return
        if (!checkBar(that)) {
            that.$dom.el_bar = document.createElement('div')
            that.$dom.el_bar.setAttribute('class', 'scroll_bar')
            that.$dom.el.appendChild(that.$dom.el_bar)
        }
        that.$dom.el_bar.style.position = 'absolute'
        that.$dom.el_bar.style.top = 0 + 'px'
        that.$dom.el_bar.style.right = 3 + 'px'
        that.$dom.el_bar.style.width = 2 + 'px'
        that.$dom.el_bar.style.height = that.$dom.bar_h + 'px'
        that.$dom.el_bar.style.background = 'gray'
    }
    /**
     * @method 检查是否已经创建ScrollBar
     * @return {Boolean} 
     */
    function checkBar (that) {
        let child = that.$dom.el.childNodes
        let len = child.length

        for (let i = 0; i < len; i++) {
            if (child[i].nodeType === 1) {
                let clas = child[i].getAttribute('class')
                if (clas === 'scroll_bar') {
                    that.$dom.el_bar = child[i]
                    return true
                }

            }
        }
        return false
    }
}


export default _Scroll