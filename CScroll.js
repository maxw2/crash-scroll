var CScroll = (function () {
    'use strict';

    const _Defalut = function (CScroll) {
        CScroll.prototype.defalut = function () {
            this.defalut_option = {
                scrollX: false,                 // X轴滑动
                scrollBar: false,               // 显示滚动条
                inertia: true,                  // 惯性滑动
                capture: false,                 // 开启捕获
                stopPropagation: false,         // 阻止事件传播
                skipCurrent: false,             // 跳过当前事件 不执行
                direction: false,               // 滑动方向
                // 待调试
                scrollType: 0,                  // scroll开启 0.不开启 1.防抖 2.节流 3.正常
                sideLock: null,                  // 锁定边界 [top,left]  
                // Swipe
                _swiper: false,
                swiper: {                       // 开启Swipe
                    btn: false,                 // 分页按键
                    loop: false,                // 无缝滑动
                    autoPlay: false,            // 自动播放
                    threshold: 0.5              // 是否滚动到下一个元素 百分比
                }
            };
            this.$dom = {
                // Element
                // el: el,                         // scroll元素
                el_content: null,               // 滚动区域元素
                el_bar: null,                   // 滚动条元素
                // Data
                el_w: null,
                el_h: null,
                content_w: null,
                content_h: null,
                bar_h: null,
                scroll_T: null,                 // Top
                scroll_B: null,                 // Bottom
                scroll_L: null,                 // Left
                scroll_R: null,                 // Right
                // Swiper
                swiper: {
                    el_childs: null,            // 所有子元素
                    el_frist: null,             // 第一个元素
                    el_last: null,              // 最后一个元素
                    el_btn: null,               // 分页元素
                    len: null,                  // 轮播图元素数量
                }
            };
            // 移动坐标
            this.$pos = {
                x: 0,
                y: 0,
                num: 0,                         //目前只能非循环显示
            };
            //私有变量
            this._this = {
                dt: null,
                dx: null,
                dy: null,
                mt: null,
                mx: null,
                my: null,
                ut: null,
                vx: null,                       //mx - dx
                vy: null,                       //my - dy
                vt: null,                       //mt - dt
                ine: false,                     //判断是否惯性滑动
                friction: null,                 //惯性值
                num: 0,                         //swiper 当前元素指针
                loopLock: false,                //无缝滑动锁       
                pullDown: false,
                pullUp: false,
                direction: false,               // 是否执行过direction函数 并且显示direction方向
            };

            // 函数绑定数据
            this.$event = {
                //Event                         //  修改this指针  指向构造函数
                start: null,                    //  绑定EventTouchStart 
                move: null,                     //  绑定EventTouchMove
                end: null,                      //  绑定EventTouchEnd
                onScroll: new Function,         //  scroll事件
                onTouchStart: new Function,     //  touchDown事件
                onTouchMove: new Function,      //  touchMove事件
                onTouchEnd: new Function,       //  touchUp事件
                scrollFunArr: [],               //  scroll事件数组
                touchStartFunArr: [],           //  touchstart事件数组
                touchMoveFunArr: [],            //  touchmove事件数组
                touchEndFunArr: [],             //  touchend事件数组
                // onPullDown: function () {},     //pullDown事件
                // onPullUp: function () {},       //pullUp事件
                time: null,                      //惯性计时器
                timer: null,                     //回弹计时器
            };

        };
    };

    const _Data = function (CScroll) {
        _Defalut(CScroll);

        /**
         * @method 初始化数据
         */
        CScroll.prototype.initData = function () {
            this.defalut();
            this.$op = this.extend(this.defalut_option, this.op);
            this.initDom();
        };

        /**
         * @method 初始化Dom数值
         */
        CScroll.prototype.initDom = function () {
            this.$dom.el = this.el;
            this.$dom.el_content = this.el.firstElementChild;
            let el_h = this.$dom.el.clientHeight;
            let el_w = this.$dom.el.clientWidth;
            let content_h = this.$dom.el_content.clientHeight;
            let content_w = this.$dom.el_content.clientWidth;
            let bar_h = el_h / content_h * el_h;

            this.$dom.el_h = el_h;
            this.$dom.el_w = el_w;
            this.$dom.content_h = content_h;
            this.$dom.content_w = content_w;
            this.$dom.bar_h = bar_h;
            this.$dom.scroll_T = 0;
            this.$dom.scroll_B = this.$dom.content_h - this.$dom.el_h;
            this.$dom.scroll_L = 0;
            this.$dom.scroll_R = this.$dom.content_w - this.$dom.el_w;
        };

        /**
         * @method 合并传入的设置
         * @param  {Object} defalut 初始设置
         * @param  {Object} options 外部传入设置  
         * @return {Object}         返回合并后的设置
         */
        CScroll.prototype.extend = function (defalut, options) {
            // Object.assign 使用源对象的getter与setter 故不使用
            //
            let def = defalut;
            let opt = options;

            for (const key in opt) {
                if (opt.hasOwnProperty(key)) {
                    let val = opt[key];
                    // 
                    if (Array.isArray(val)) {
                        def[key] = val;
                    } else if (typeof val === 'object') {
                        def[key] = this.extend(def[key], opt[key]);
                    } else {
                        def[key] = val;
                    }
                }
            }
            return def
        };
        /**
         * @method 刷新Dom数据
         */
        CScroll.prototype.refresh = function () {
            this.initDom();
            this.modeRecogn();
            this._setPos();
        };
        /**
         * @method 初始化pos位置
         */
        CScroll.prototype.initSetPos = function (){
            this.$pos.x = 0;
            this.$pos.y = 0;
            this._setPos();
        };
    };

    const _SetPos = function (CScroll) {
        //
        CScroll.prototype.setPos = function () {

            let content = this.$dom.el_content;
            let bar = this.$dom.el_bar;
            
            if (this.$op.scrollX) {
                content.style.transform = 'translateX(' + this.$pos.x + 'px) translateZ(0px)';
            } else {
                content.style.transform = 'translateY(' + this.$pos.y + 'px) translateZ(0px)';
                if (bar) {
                    bar.style.top = -this.$pos.y / this.$dom.content_h * this.$dom.el_h + 'px';
                }
            }

            this.$event.onScroll();
        };
        //
        CScroll.prototype._setPos = function () {
            let content = this.$dom.el_content;
            let bar = this.$dom.el_bar;

            if (this.$op.scrollX) {
                content.style.transform = 'translateX(' + this.$pos.x + 'px) translateZ(0px)';
            } else {
                content.style.transform = 'translateY(' + this.$pos.y + 'px) translateZ(0px)';
                if (bar) {
                    bar.style.top = -this.$pos.y / this.$dom.content_h * this.$dom.el_h + 'px';
                }
            }
        };

        /**
         *  @method 判断是否超出内容区
         *  @param  {String} val            输入方向判断位置 如不输入则判断两个方向
         *  @return {Boolean}               返回boolean 
         */
        CScroll.prototype.outSide = function (val) {
            let a = Boolean;
            if (this.$op.scrollX) {
                switch (val) {
                    case 'left':
                        this.$pos.x > this.$dom.scroll_L
                            ? a = true : a = false;
                        break;
                    case 'right':
                        this.$pos.x < -this.$dom.scroll_R
                            ? a = true : a = false;
                        break;
                    default:
                        (this.$pos.x > this.$dom.scroll_L || this.$pos.x < -this.$dom.scroll_R)
                            ? a = true : a = false;
                }
            } else {
                switch (val) {
                    case 'top':
                        this.$pos.y > this.$dom.scroll_T
                            ? a = true : a = false;
                        break;
                    case 'bottom':
                        this.$pos.y < -this.$dom.scroll_B
                            ? a = true : a = false;
                        break;
                    default:
                        (this.$pos.y > this.$dom.scroll_T || this.$pos.y < -this.$dom.scroll_B)
                            ? a = true : a = false;
                }
            }

            return a
        };
        
    };

    const _Inertia = function (CScroll) {

        CScroll.prototype.startInertia = function () {
            //option 设置
            if (!this.$op.inertia) return
            //  双重判断是否开启惯性滑动
            let time = this._this.ut - this._this.mt;
            time < 40 ? this._this.ine = true : this._this.ine = false;
            // 超出区域禁止惯性滑动
            if (this.outSide()) this._this.ine = false;

            this.calcInertia();
        };

        CScroll.prototype.calcInertia = function () {
            //  计算惯性滑动距离 
            if (this._this.ine) {
                if (this.$op.scrollX) {
                    this._this.friction = (this._this.vt * this._this.vx + this._this.vx) * 0.1;
                } else {
                    this._this.friction = (this._this.vt * this._this.vy + this._this.vy) * 0.1;
                }
                this.setInertia();
            }
        };

        CScroll.prototype.setInertia = function () {
            if (!this.$op.inertia) return
            let a = null;
            // 如果friction惯性值小于1 退出函数
            if (Math.abs(this._this.friction) < 1) {
                window.cancelAnimationFrame(this.$event.time);
                this.setEase();
                return
            }
            //判断是否超出内容区
            if (this.outSide()) {
                this._this.friction -= this._this.friction * 0.2;
                a = this._this.friction - this._this.friction * 0.2;
            } else {
                this._this.friction -= this._this.friction * 0.1;
                a = this._this.friction - this._this.friction * 0.1;
            }

            if (this.$op.scrollX) {
                this.$pos.x += a;
            } else {
                this.$pos.y += a;
            }

            this.setPos();
            this.$event.time = window.requestAnimationFrame(this.setInertia.bind(this));
        };
    };

    const _SetEase = function (CScroll) {
        
        CScroll.prototype.setEase = function () {
            let time = 0.3;
            if (this.cancelEase()) {
                if (this.$op._swiper && this.$op.swiper.loop) {
                    this.loopJump();
                    return
                }
            }

            if (this.$op.scrollX) {
                //Left
                if (this.outSide('left')) {
                    let a = this.$pos.x - this.$dom.scroll_L;
                    this.$pos.x -= a * time;
                    if (this.$pos.x - this.$dom.scroll_L < 1) this.$pos.x = this.$dom.scroll_L;
                    this.setPos(this.$pos.x);
                    this.$event.timer = window.requestAnimationFrame(this.setEase.bind(this));
                }
                // Right  
                if (this.outSide('right')) {
                    let a = this.$pos.x + this.$dom.scroll_R;
                    this.$pos.x -= a * time;
                    if (Math.abs(this.$pos.x) - this.$dom.scroll_R < 1) this.$pos.x = -this.$dom.scroll_R;
                    this.setPos(this.$pos.x);
                    this.$event.timer = window.requestAnimationFrame(this.setEase.bind(this));
                }
            } else {
                //Top
                if (this.outSide('top')) {
                    let a = this.$pos.y - this.$dom.scroll_T; // 回弹距离
                    this.$pos.y -= a * time;
                    if (Math.abs(this.$pos.y) - this.$dom.scroll_T < 1) this.$pos.y = this.$dom.scroll_T; // 校准定位 
                    this.setPos(this.$pos.y);
                    this.$event.timer = window.requestAnimationFrame(this.setEase.bind(this));
                }
                //Bottom
                if (this.outSide('bottom')) {
                    let a = this.$pos.y + this.$dom.scroll_B;  // 回弹距离
                    this.$pos.y -= a * time;
                    if (Math.abs(this.$pos.y) - this.$dom.scroll_B < 1) this.$pos.y = -this.$dom.scroll_B; // 校准定位
                    this.setPos(this.$pos.y);
                    this.$event.timer = window.requestAnimationFrame(this.setEase.bind(this));
                }
            }
        };
        /**
         * @method 取消回弹函数
         */
        CScroll.prototype.cancelEase = function(){
            if (this.$op.scrollX) {
                if (this.$pos.x === this.$dom.scroll_L || this.$pos.x === -this.$dom.scroll_R) {
                    window.cancelAnimationFrame(this.$event.timer);
                    return true
                }
            } else {
                if (this.$pos.y === this.$dom.scroll_T || this.$pos.y === -this.$dom.scroll_B) {
                    window.cancelAnimationFrame(this.$event.timer);
                    return true
                }
            }
        };
    };

    const _Direction = function (CScroll) {
        /**
         * @method 判断方向
         * @return {Boolean}
         */
        CScroll.prototype.direction = function () {
            let direction = this.$op.direction;
            let vx = this._this.vx;
            let vy = this._this.vy;
            if (direction === 'X' || direction === 'x') {
                if (Math.abs(this._this.vx) > 2) {
                    if (Math.abs(vx) > Math.abs(vy)) {
                        this.$op.stopPropagation = true;
                        this.$op.skipCurrent = false;
                        this._this.direction = 'x';
                    } else {
                        this.$op.stopPropagation = false;
                        this.$op.skipCurrent = true;
                        this._this.direction = false;
                    }
                } else if (direction === 'Y' || direction === 'y') {
                    if (Math.abs(this._this.vx) > 2) {
                        if (Math.abs(vy) > Math.abs(vx)) {
                            this.$op.stopPropagation = false;
                            this.$op.skipCurrent = true;
                            this._this.direction = 'y';
                        } else {
                            this.$op.stopPropagation = true;
                            this.$op.skipCurrent = false;
                            this._this.direction = false;
                        }

                    }
                } 
            }
        };
        /**
         * @method 初始化私有数值
         */
        CScroll.prototype.initiaDirection = function () {
            this.$op.skipCurrent = false;
            this.$op.stopPropagation = false;
            this._this.direction = false;
        };

    };

    const _CustomizeEvent = function (CScroll) {
        /**
         * @method 添加事件
         * @param {String} type 事件类型
         * @param {Function} func 回调函数
         */
        CScroll.prototype.on = function (type, func) {
            switch (type) {
                case 'onTouchStart':
                    this.$event.onTouchStart = touchStartFunArr(func, this);
                    break;
                case 'onTouchMove':
                    this.$event.onTouchMove = addTouchMoveFun(func, this);
                    break;
                case 'onTouchEnd':
                    this.$event.onTouchEnd = touchEndFunArr(func, this);
                    break;
                case 'onScroll':
                    this.$event.onScroll = addScroll(func, this);
                    break;
                default:
                    console.log('输入有效事件');
                    break;
            }
        };
        /**
         * @method 移除事件
         * @param {String} type 事件类型
         * @param {Function} func 回调函数
         */
        CScroll.prototype.removeOn = function (type, func) {
            switch (type){
                case 'onTouchStart':
                    break;
                case 'onTouchMove':
                    break;
                case 'onTouchEnd':
                    this.$event.touchEndFunArr;
            }
            let typeEvent = this.$event[type];
            if(typeEvent){
                console.log(typeEvent);
                typeEvent.map((val,index)=>{
                    if(func === val){
                        typeEvent.splice(index,1);
                    }else{
                        console.log('removeOn:未找到对应函数');
                    }
                });
            }
        };
        // CScroll.prototype.checkEvent = function (type) {
        //     switch (type) {
        //         case 'onTouchStart':
        //             return touchStartFun
        //         case 'onTouchMove':
        //             return touchMoveFun
        //         case 'onTouchEnd':
        //             return touchEndFun
        //         case 'onScroll':
        //             return scrollFun
        //         default:
        //             console.log('输入Type')
        //             break
        //     }
        // }

        function touchStartFunArr(func, that) {
            that.$event.touchEndFunArr.push(func);
            let funcArr = that.$event.touchEndFunArr;
            return () => {
                funcArr.forEach(fn => {
                    fn(that.$pos, that.el);
                });
            }
        }
        function addTouchMoveFun(func, that) {
            that.$event.touchMoveFunArr.push(func);
            let funcArr = that.$event.touchMoveFunArr;
            return () => {
                funcArr.forEach(fn => {
                    fn(that.$pos, that.el);
                });
            }
        }
        function touchEndFunArr(func, that) {
            that.$event.touchEndFunArr.push(func);
            let funcArr = that.$event.touchEndFunArr;
            return () => {
                funcArr.forEach(fn => {
                    fn.call(that.$pos, that.el,that);
                });
            }
        }
        function addScroll(func, that) {
            that.$event.scrollFunArr.push(func);
            let funcArr = that.$event.scrollFunArr;
            return () => {
                funcArr.forEach(fn => {
                    fn(that.$pos, that.el);
                });
            }
        }

    };

    const _Event = function (CScroll) {
        _SetPos(CScroll);
        _Inertia(CScroll);
        _SetEase(CScroll);
        _Direction(CScroll);
        _CustomizeEvent(CScroll);

        CScroll.prototype.event = function () {
            this.addEvent();
        };

        CScroll.prototype.addEvent = function () {
            let that = this;
            this.el.addEventListener('touchstart', this.EventTouchStart.bind(that), { passive: false, capture: !!this.$op.capture });
            this.el.addEventListener('touchmove', this.EventTouchMove.bind(that), { passive: false, capture: !!this.$op.capture });
            this.el.addEventListener('touchend', this.EventTouchEnd.bind(that), { passive: false, capture: !!this.$op.capture });
        };

        CScroll.prototype.removeEvent = function () {
            let that = this;
            this.el.removeEventListener('touchstart', this.EventTouchStart.bind(that), { passive: false, capture: !!this.$op.capture });
            this.el.removeEventListener('touchmove', this.EventTouchMove.bind(that), { passive: false, capture: !!this.$op.capture });
            this.el.removeEventListener('touchend', this.EventTouchEnd.bind(that), { passive: false, capture: !!this.$op.capture });
        };

        // TouchStart
        CScroll.prototype.EventTouchStart = function (ev) {
            ev.preventDefault();

            window.cancelAnimationFrame(this.$event.time);
            // if (!this.$op.direction) window.cancelAnimationFrame(this.$event.timer)

            this.initiaDirection();

            /**
             * 
             */
            this._this.dt = ev.timeStamp;
            this._this.dx = ev.touches[0].clientX;
            this._this.dy = ev.touches[0].clientY;

            /**
             * 
             */
            if (this.$op.direction) this.$op.stopPropagation = true;

            this.$event.onTouchStart();
        };

        // TouchMove
        CScroll.prototype.EventTouchMove = function (ev) {
            /**
             * touchesMove
             * 处理数据
             */
            ev.preventDefault();
            // 当前停止还是上层事件停止
            if (this.$op.skipCurrent) return
            if (this.$op.stopPropagation) ev.stopPropagation();

            // swiper loop 滑动锁
            if (this.$op._swiper && this.$op.swiper.loop) {
                if (this.loopLock()) return
            }

            // 移动数据
            this._this.mt = ev.timeStamp;
            this._this.mx = ev.touches[0].clientX;
            this._this.my = ev.touches[0].clientY;
            this._this.vx = this._this.mx - this._this.dx;
            this._this.vy = this._this.my - this._this.dy;
            this._this.vt = this._this.mt - this._this.dt;

            // 方向滑动判定
            if (this.$op.direction && !this._this.direction) {
                this.direction();
                return
            }
            // 如果子元素
            if (this.$op.direction && this._this.direction === this.$op.direction){
                window.cancelAnimationFrame(this.$event.timer);
            }else if(!this.$op.direction ){
                window.cancelAnimationFrame(this.$event.timer);
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
                        ? this.$pos.x += this._this.vx * 0.2 : this.$pos.x += this._this.vx;
                } else if (!this.$op.scrollX) {
                    this.outSide()
                        ? this.$pos.y += this._this.vy * 0.2 : this.$pos.y += this._this.vy;
                }
            } else if (this.$op._swiper) {
                // 自己理解
                if (this._this.num === 0 && !this.$op.swiper.loop) {
                    this._this.vx > 0 ?
                        this.$pos.x += this._this.vx * 0.2 : this.$pos.x += this._this.vx;
                } else if (this._this.num === this.$dom.swiper.len - 1 && !this.$op.swiper.loop) {
                    this._this.vx < 0 ?
                        this.$pos.x += this._this.vx * 0.2 : this.$pos.x += this._this.vx;
                } else {
                    this.$pos.x += this._this.vx;
                }
            }

            if (!this.$op.scrollX && this.$op.sideLock) {
                if (this.$pos.y >= this.$op.sideLock[0] && this.$op.sideLock[0]) {
                    this.$pos.y = this.$op.sideLock[0];
                    this._setPos();
                    return
                } else if (this.$pos.y <= -(this.$dom.content_h - this.$dom.el_h + this.$op.sideLock[1]) && this.$op.sideLock[1]) {
                    this.$pos.y = -(this.$dom.content_h - this.$dom.el_h + this.$op.sideLock[1]);
                    this._setPos();
                    return
                }
            }
            this.setPos();
            this.$event.onTouchMove();

            this._this.dt = this._this.mt;
            this._this.dx = this._this.mx;
            this._this.dy = this._this.my;
        };

        // TouchEnd
        CScroll.prototype.EventTouchEnd = function (ev) {
            // 当前停止还是上层事件停止
            if (this.$op.skipCurrent) return
            if (this.$op.stopPropagation) ev.stopPropagation();
            if (this.$op._swiper) {
                this.changeNum();
            }


            this.startInertia();
            this.setEase();
            this.$event.onTouchEnd();
        };




    };

    const _Scroll = function (CScroll) {
        CScroll.prototype.scroll = function () {
            createBar(this);

        };
        function createBar (that) {
            if (!that.$op.scrollBar) return
            if (!checkBar(that)) {
                that.$dom.el_bar = document.createElement('div');
                that.$dom.el_bar.setAttribute('class', 'scroll_bar');
                that.$dom.el.appendChild(that.$dom.el_bar);
            }
            that.$dom.el_bar.style.position = 'absolute';
            that.$dom.el_bar.style.top = 0 + 'px';
            that.$dom.el_bar.style.right = 3 + 'px';
            that.$dom.el_bar.style.width = 2 + 'px';
            that.$dom.el_bar.style.height = that.$dom.bar_h + 'px';
            that.$dom.el_bar.style.background = 'gray';
        }
        /**
         * @method 检查是否已经创建ScrollBar
         * @return {Boolean} 
         */
        function checkBar (that) {
            let child = that.$dom.el.childNodes;
            let len = child.length;

            for (let i = 0; i < len; i++) {
                if (child[i].nodeType === 1) {
                    let clas = child[i].getAttribute('class');
                    if (clas === 'scroll_bar') {
                        that.$dom.el_bar = child[i];
                        return true
                    }

                }
            }
            return false
        }
    };

    const _Swiper = function (CScroll) {
        CScroll.prototype.swiper = function () {
            removeLoop(this);
            initData(this);
            createLoop(this);
            createBtn(this);


        };

        function initData(that) {
            let swiper = that.$dom.swiper;
            swiper.el_childs = eleChildNodes(that.$dom.el_content.childNodes);
            swiper.len = swiper.el_childs.length;
            swiper.el_frist = swiper.el_childs[0];
            swiper.el_last = swiper.el_childs[swiper.len - 1];
            that.$dom.el_content.style.width = 100 * swiper.len + '%';
            that.$dom.content_w = that.$dom.el_content.clientWidth;

            function eleChildNodes(node) {
                let arr = [];
                for (let i = 0; i < node.length; i++) {
                    if (node[i].nodeType === 1) {
                        arr.push(node[i]);
                    }
                }
                return arr
            }
        }
        function createLoop(that) {
            if (!that.$op._swiper || !that.$op.swiper.loop) return
            if (!that.$dom.swiper.el_frist || !that.$dom.swiper.el_last) return
            let frist = that.$dom.swiper.el_frist.cloneNode(true);
            let last = that.$dom.swiper.el_last.cloneNode(true);

            that.$dom.swiper.el_frist = that.$dom.el_content.insertBefore(last, that.$dom.swiper.el_childs[0]);
            that.$dom.swiper.el_last = that.$dom.el_content.appendChild(frist);

            that.$dom.el_content.style.width = 100 * (that.$dom.swiper.len + 2) + '%';
            that.$pos.x = -that.$dom.el_w;
            that.setPos();
        }
        function removeLoop(that) {
            let swiper = that.$dom.swiper;
            if (!that.$op._swiper || !that.$op.swiper.loop) return
            if (!that.$dom.swiper.el_last || !that.$dom.swiper.el_frist) return

            that.$dom.el_content.removeChild(swiper.el_frist);
            that.$dom.el_content.removeChild(swiper.el_last);

        }
        function createBtn(that) {
            if (!that.$op._swiper && !that.$op.swiper.btn) return
        }
        /**
         * @method 切换图片数页 
         */
        CScroll.prototype.changeNum = function () {
            let thr = this.$op.swiper.threshold;
            let _this = this._this;

            if (this.$op.scrollX) {
                let a = Math.abs(this.$pos.x / this.$dom.el_w);
                let b = a - Math.floor(a);
                // 取消调用组建
                if (!this.$op.swiper.loop) {
                    if (_this.num === 0) {
                        if (_this.vx > 0) return
                    }
                    if (_this.num === this.$dom.swiper.len - 1) {
                        if (_this.vx < 0) return
                    }
                }
                // 如果向左滑动
                if (_this.vx > 0) {
                    if (b > thr) {
                        _this.num = Math.ceil(a);
                        
                    } else if (b <= thr) {
                        _this.num = Math.floor(a);
                    }
                    // 向右滑动
                } else {
                    if (b > 1 - thr) {
                        _this.num = Math.ceil(a);
                    } else if (b <= 1 - thr) {
                        _this.num = Math.floor(a);
                    }
                }
            }
            this.$pos.num = _this.num;
            this.changeSide();
        };
        /**
         * @method 通过切换左右边距以切换图片
         */
        CScroll.prototype.changeSide = function () {
            this.$pos.num = this._this.num;
            let num = this._this.num;
            this.$dom.scroll_L = -this.$dom.el_w * num;
            this.$dom.scroll_R = -this.$dom.scroll_L;
        };
        /**
         * @method 开启循环模式，跳转页面
         */
        CScroll.prototype.loopJump = function () {
            // 由于左右间距被修改过
            // 所以需要重新定位content的左右距离
            let fX = 0;
            let lX = this.$dom.content_w + this.$dom.el_w;
            // 第一个页面
            // 跳转至倒数第二个
            if (this.$pos.x === fX || this._this.num === 0) {
                let x = this.$dom.el_w * (this.$dom.swiper.len);
                this.$pos.x = -x;
                this._this.num = this.$dom.swiper.len - 1;
                this._this.loopLock = false;
                // 最后一个页面
                // 跳转至第二个
            } else if (this.$pos.x === -lX || this._this.num === this.$dom.swiper.len + 1) {
                let x = this.$dom.el_w;
                this.$pos.x = -x;
                this._this.num = 0;
                this._this.loopLock = false;
            }
            this.setPos();
        };
        /**
         * @method 跳转完毕前禁止滑动
         * @return {Boolean}
         */
        CScroll.prototype.loopLock = function () {
            // 是否开启loopLock 阻止滑动
            if (this.$op.swiper && this.$op.swiper.loop && this.$op._swiper) {
                let lX = 0;
                let rX = this.$dom.content_w + this.$dom.el_w;

                if (this.$pos.x > -lX ) {
                    this._this.loopLock = true;
                } else if (this.$pos.x < -rX) {
                    this._this.loopLock = true;
                } else {
                    this._this.loopLock = false;
                }
                return this._this.loopLock
            }
            
        };


    };

    const _ModeRecogn = function (CScroll) {
        _Scroll(CScroll);
        _Swiper(CScroll);

        CScroll.prototype.modeRecogn = function() {
            let op = this.op;
            for (const key in op) {
                if (op.hasOwnProperty(key)) {
                    switch (key) {
                        case 'swiper':
                            if (!op[key]) return
                            this.$op._swiper = true;
                            this.swiper();
                            return
                        default:
                            this.scroll();
                            break;
                    }
                }
            }
        };
    };

    const CScroll = function (el,options) {
        this.el = el;
        this.op = options;
        
        this.initData();
        this.modeRecogn();
        this.event();

    };

    _Data(CScroll);
    _ModeRecogn(CScroll);
    _Event(CScroll);

    return CScroll;

}());
