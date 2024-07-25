/**
 * 自定义拖拽指令
 */
const dragSwitch = {

    beforeMount(el: any, binding: any,) {
        // 自定义属性，判断是否可拖拽
        if (!binding.value) return
        // 获取自定义指令所在的dom元素
        const dialogHeaderEl = el.querySelector('.dialog_header')
        const dragDom = el.querySelector('.dialog_content')
        dialogHeaderEl.style.cssText += ';cursor:move;'
        dragDom.style.cssText += ';bottom:45px;' //初始化位置

        // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
        const sty = (function () {
            if ((document.body as any).currentStyle) {
                // 在ie下兼容写法
                return (dom: any, attr: any) => dom.currentStyle[attr]
            }
            return (dom: any, attr: any) => getComputedStyle(dom, null)[attr]
        })()
        //判断元素移动还是被点击
        let isMove = false

        dialogHeaderEl.onmousedown = (e: any) => {
            // 鼠标按下，计算当前元素距离可视区的距离
            const disX = e.clientX - dialogHeaderEl.offsetLeft
            const disY = e.clientY - dialogHeaderEl.offsetTop
            const screenWidth = document.body.clientWidth // body当前宽度
            const screenHeight = document.body.clientHeight // 可见区域高度(应为body高度，可某些环境下无法获取)
            const minDragDomLeft = dragDom.offsetLeft
            const maxDragDomLeft = screenWidth
            const dragDomheight = dialogHeaderEl.offsetHeight // 对话框高度
            // console.log('dragDomheight===>', dragDomheight)
            // const maxDragDomLeft = screenWidth - dragDom.offsetLeft - dragDomWidth
            const minDragDomTop = dragDom.offsetTop - 130
            const maxDragDomTop = screenHeight - dragDom.offsetTop - dragDomheight - 45
            // 获取到的值带px 正则匹配替换
            let styL = sty(dragDom, 'left')
            // 为兼容ie
            if (styL === 'auto') styL = '0px'
            let styT = sty(dragDom, 'top')

            // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
            if (styL.includes('%')) {
                styL = +document.body.clientWidth * (+styL.replace(/%/g, '') / 100)
                styT = +document.body.clientHeight * (+styT.replace(/%/g, '') / 100)
            } else {
                styL = +styL.replace(/px/g, '')
                styT = +styT.replace(/px/g, '')
            }

            document.onmousemove = function (e) {
                // 通过事件委托，计算移动的距离
                let left = e.clientX - disX
                let top = e.clientY - disY

                // 边界处理
                if (-(left) > minDragDomLeft) {
                    left = -(minDragDomLeft)
                } else if (left > maxDragDomLeft) {
                    left = maxDragDomLeft
                }

                if (-(top) > minDragDomTop) {
                    top = -(minDragDomTop)
                } else if (top > maxDragDomTop) {
                    top = maxDragDomTop
                }
                // 移动当前元素
                isMove = true
                // dragDom.style.cssText += `;left:${left + styL}px;top:${top + styT}px;` //上下左右都可移动
                dragDom.style.cssText += `top:${top + styT}px;` //上下移动 
                // console.log('top===>', top + styT)
            }
            document.onmouseup = function () {
                document.onmousemove = null
                document.onmouseup = null
            }
            return false
        }
        //元素被点击时执行的点击事件
        dialogHeaderEl.onclick = () => {
            if (isMove) {
                isMove = false
                return
            }
        }
    }
}

/**
 * 定义指令集
 */
const diyVueDirectives = {
    install: function (app: any) {
        app.directive('dragSwitch', dragSwitch) // 注册自定义拖拽指令
    }
}

/**
 * 导出指令集
 */
export default diyVueDirectives