import router from './router'

const baseSize = 14
// 设置 rem 函数
function setRem() {
  // 当前页面宽度相对于 1920宽的缩放比例，可根据自己需要修改。
  const docEle = document.documentElement
  const scale = docEle.clientWidth / 1920
  // 设置页面根节点字体大小（“Math.min(scale, 5)” 指最高放大比例为5，可根据实际业务需求调整）
  const scalSize = baseSize * scale
  const fontSize = Math.ceil(scalSize.toFixed(2))
  const scalNum = docEle.clientWidth / docEle.clientHeight
  console.log('scalNum=>', scalNum)

  console.log('scalSize=>', scalSize)
  if (scalSize < 10) {
    docEle.style.fontSize = `11px`
  } else if (scalSize < 14 && scalNum < 1.85) {
    docEle.style.fontSize = `${fontSize + 1}px`
  } else {
    docEle.style.fontSize = `${fontSize}px`
  }
  //   if (scalSize > baseSize) {
  //     docEle.style.fontSize = `${scalSize.toFixed(2)}px`
  //   } else {
  //     docEle.style.fontSize = `${baseSize}px`
  //   }
}
// 初始化
setRem()
// 改变窗口大小时重新设置 `rem` 加上防抖
// let timeout
// window.onresize = function () {
//   clearTimeout(timeout)
//   timeout = setTimeout(setRem(), 100)
// }

// const resetRem = () => {
//   location.reload()
//   // router.replace('/home')
// }
window.addEventListener('resize', setRem)
// window.addEventListener('resize', resetRem)
