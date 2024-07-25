// v-dialogDrag: 弹窗拖拽属性 （重点！！！ 给模态框添加这个属性模态框就能拖拽了）
const dialogDrag = { // 属性名称dialogDrag，前面加v- 使用
    beforeMount(el: any, binding: any) {
        if (!binding.value) return
        const dialogHeaderEl = el.querySelector('.el-dialog__header')
        if (!dialogHeaderEl) {
            return
        }
        const dragDom = el.querySelector('.el-dialog')
        dialogHeaderEl.style.cssText += ';cursor:move;'
        dragDom.style.cssText += ';top:0px;'

        // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
        const getStyle = (function () {
            if ((document.body as any).currentStyle) {
                // 在ie下兼容写法
                return (dom: any, attr: any) => dom.currentStyle[attr]
            }
            return (dom: any, attr: any) => getComputedStyle(dom, null)[attr]
        })()

        dialogHeaderEl.onmousedown = (e: any) => {
            // 鼠标按下，计算当前元素距离可视区的距离
            const disX = e.clientX - dialogHeaderEl.offsetLeft
            const disY = e.clientY - dialogHeaderEl.offsetTop

            const dragDomWidth = dragDom.offsetWidth
            // const dragDomHeight = dragDom.offsetHeight

            const overlay = document.querySelector('.el-overlay-dialog')
            const screenWidth = overlay.clientWidth 
            const screenHeight = overlay.clientHeight
            console.log('overlay==>',overlay.clientWidth )

            const minDragDomLeft = dragDom.offsetLeft
            const maxDragDomLeft = screenWidth - dragDom.offsetLeft - dragDomWidth

            const minDragDomTop = dragDom.offsetTop
            // const maxDragDomTop = screenHeight - dragDom.offsetTop - dragDomHeight
            const maxDragDomTop = screenHeight - dragDom.offsetTop// 不需要-dragDomHeight

            // 获取到的值带px 正则匹配替换
            let styL = getStyle(dragDom, 'left')
            let styT = getStyle(dragDom, 'top')

            if (styL.includes('%')) {
                styL = +overlay.clientWidth * (+styL.replace(/\%/g, '') / 100)
                styT = +overlay.clientHeight * (+styT.replace(/\%/g, '') / 100)
            } else {
                styL = +styL.replace(/\px/g, '')
                styT = +styT.replace(/\px/g, '')
            }

            document.onmousemove = function (e: any) {
                // 通过事件委托，计算移动的距离
                let left = e.clientX - disX
                let top = e.clientY - disY

                // 边界处理
                if (-(left) > minDragDomLeft) {
                    left = -minDragDomLeft
                } else if (left > maxDragDomLeft) {
                    left = maxDragDomLeft
                }

                if (-(top) > minDragDomTop) {
                    top = -minDragDomTop
                } else if (top > maxDragDomTop) {
                    top = maxDragDomTop
                }

                // 移动当前元素
                dragDom.style.cssText += `;left:${left + styL}px;top:${top + styT}px;`

                // // emit onDrag event
                // vnode.child.$emit('dragDialog')
            }

            document.onmouseup = function (e: any) {
                document.onmousemove = null
                document.onmouseup = null
            }
        }
    }

}

/**
 * 定义指令集
 */
const diyDialogDrag = {
    install: function (app: any) {
        app.directive('dialogDrag', dialogDrag) // 注册自定义拖拽指令
    }
}

/**
 * 导出指令集
 */
export default diyDialogDrag