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
            sideLock: [null,null,null,null],                  // 锁定边界 [top,right,bottom,left]
            // Swipe
            _swiper: false,
            swiper: {                       // 开启Swipe
                btn: false,                 // 分页按键
                loop: false,                // 无缝滑动
                autoPlay: false,            // 自动播放;
                threshold: 0.5              // 是否滚动到下一个元素 百分比
            }
        }
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
        }
        // 移动坐标
        this.$pos = {
            x: 0,
            y: 0,
            num: 0,                         //目前只能非循环显示
        }
        //私有变量
        this._this = {
            dt: null,
            dx: null,
            dy: null,
            mt: null,
            mx: null,
            my: null,
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
        }

        // 函数绑定数据
        this.$event = {
            //Event                         //  修改this指针  指向构造函数
            start: null,                    //  绑定EventTouchStart 
            move: null,                     //  绑定EventTouchMove
            end: null,                      //  绑定EventTouchEnd
            onSwiper: new Function,         //  swiper事件          
            onScroll: new Function,         //  scroll事件
            onTouchStart: new Function,     //  touchDown事件
            onTouchMove: new Function,      //  touchMove事件
            onTouchEnd: new Function,       //  touchUp事件
            swiperFunArr:[],                //  swiper事件数组
            scrollFunArr: [],               //  scroll事件数组
            touchStartFunArr: [],           //  touchstart事件数组
            touchMoveFunArr: [],            //  touchmove事件数组
            touchEndFunArr: [],             //  touchend事件数组
            // onPullDown: function () {},     //pullDown事件
            // onPullUp: function () {},       //pullUp事件
            time: null,                      //惯性计时器
            timer: null,                     //回弹计时器
        }

    }
}

export default _Defalut