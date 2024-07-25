/**
 * UI组件, IVIEW UI组件库
 *
 * 使用:
 *  1. 根据需要去引入使用组件
 *
 * 注意:
 *  1. 实际情况最好按需引入
 */
import Vue from 'vue'
// import iView from 'iview'
// import 'iview/dist/styles/iview.css'
// view-design
import iView from 'view-design'
import 'view-design/dist/styles/iview.css'

iView.Message.config({
  duration: 3
})

iView.LoadingBar.config({
  color: '#f0ad4e',
  failedColor: '#f0ad4e',
  height: 5
})
Vue.use(iView)

Vue.prototype.$message = iView.Message
