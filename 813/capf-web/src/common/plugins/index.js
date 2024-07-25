import Vue from 'vue'

import ls from 'store2'
import echarts from 'echarts'

import httpRequest from '@/api/httpRequest'
import VueCookie from 'vue-cookie'

import { isAuth, clearnObject } from '@/utils'
import { handleSaveSubmit } from '@/libs/util'
import { CONST_VALUE } from '@/config/constValue'

import componentPlugins from '_c/components.js'

Vue.prototype.$ls = ls
Vue.prototype.$echarts = echarts

Vue.prototype.$handleValidate = handleSaveSubmit // 表单验证对象
Vue.prototype.$http = httpRequest // ajax请求方法
Vue.prototype.isAuth = isAuth // 权限方法
Vue.prototype.clearnObject = clearnObject // 清空对象

Vue.prototype.CONST_VALUE = CONST_VALUE

Vue.use(VueCookie)
Vue.use(componentPlugins)

/**
 * 获取格式化时间 yyyy-mm-dd
 */
Vue.prototype.formatDate = function(date) {
  var seperator = '-'
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var strDate = date.getDate()

  if (month >= 1 && month <= 9) {
    month = '0' + month
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate
  }
  var currentdate = year + seperator + month + seperator + strDate
  return currentdate
}

/**
 * 获取周时间
 */
Vue.prototype.formatWeekDate = function(data) {
  let formatDateTime
  let Y = data.getFullYear()
  let M = data.getMonth() + 1
  let D = data.getDate()
  let H = data.getHours()
  let Min = data.getMinutes()
  let S = data.getSeconds()
  let W = data.getDay()
  H = H < 10 ? '0' + H : H
  Min = Min < 10 ? '0' + Min : Min
  S = S < 10 ? '0' + S : S
  switch (W) {
    case 0:
      W = '天'
      break
    case 1:
      W = '一'
      break
    case 2:
      W = '二'
      break
    case 3:
      W = '三'
      break
    case 4:
      W = '四'
      break
    case 5:
      W = '五'
      break
    case 6:
      W = '六'
      break
    default:
      break
  }
  formatDateTime =
    Y +
    '年' +
    M +
    '月' +
    D +
    '日 ' +
    ' 星期' +
    W +
    ' ' +
    H +
    ':' +
    Min +
    ':' +
    S
  return formatDateTime
}
