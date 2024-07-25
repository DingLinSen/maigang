/**
 * @description 加载mock模块
 *              同步加载依赖MOCK放置VUEX,使用MOCK数据方法先运行导致无MOCK请求结果
 * @author PP
 */
// if (
//   process.env.NODE_ENV !== 'production' ||
//   process.env.VUE_APP_PREVIEW === 'true'
// ) {
//   const files = require.context('./', true, /.js$/).keys()
//   files.forEach(fileName => {
//     if (fileName.indexOf('/modules/') !== -1) {
//       require(`${fileName}`)
//     }
//   })
// }

// import Mock from 'mockjs'
// // 修复 mockjs 相关 bug
// Mock.XHR.prototype.send = (() => {
//   const _send = Mock.XHR.prototype.send
//   return function() {
//     if (!this.match) {
//       this.custom.xhr.responseType = this.responseType || ''
//       this.custom.xhr.timeout = this.timeout || 0
//       this.custom.xhr.withCredentials = this.withCredentials || false
//       this.custom.xhr.onabort = this.onabort || null
//       this.custom.xhr.onerror = this.onerror || null
//       this.custom.xhr.onload = this.onload || null
//       this.custom.xhr.onloadend = this.onloadend || null
//       this.custom.xhr.onloadstart = this.onloadstart || null
//       this.custom.xhr.onprogress = this.onprogress || null
//       this.custom.xhr.onreadystatechange = this.onreadystatechange || null
//       this.custom.xhr.ontimeout = this.ontimeout || null
//     }
//     return _send.apply(this, arguments)
//   }
// })()