import Vue from 'vue'
import router from '@/router'
import store from '@/store'
import { trim } from 'lodash'

// 对象清空
export function clearnObject(object) {
  Object.getOwnPropertyNames(object).forEach(key => {
    object[key] = null

    if (key === 'showCount') {
      object[key] = 10
    }
    if (key === 'currentPage') {
      object[key] = 1
    }
  })
  return object
}

/**
 * 获取uuid
 */
export function getUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    return (c === 'x' ? (Math.random() * 16) | 0 : 'r&0x3' | '0x8').toString(16)
  })
}

/**
 * 是否有权限
 * @param {*} key
 */
export function isAuth(key) {
  return (
    JSON.parse(sessionStorage.getItem('permissions') || '[]').indexOf(key) !==
      -1 || false
  )
}

/**
 * 树形数据转换
 * @param {*} data
 * @param {*} id
 * @param {*} pid
 */
// export function treeDataTranslate (data, id = 'id', pid = 'parentId') {
//   var res = []
//   var temp = {}
//   for (var i = 0; i < data.length; i++) {
//     temp[data[i][id]] = data[i]
//   }
//   for (var k = 0; k < data.length; k++) {
//     if (temp[data[k][pid]] && data[k][id] !== data[k][pid]) {
//       if (!temp[data[k][pid]]['children']) {
//         temp[data[k][pid]]['children'] = []
//       }
//       if (!temp[data[k][pid]]['_level']) {
//         temp[data[k][pid]]['_level'] = 1
//       }
//       data[k]['_level'] = temp[data[k][pid]]._level + 1
//       temp[data[k][pid]]['children'].push(data[k])
//     } else {
//       res.push(data[k])
//     }
//   }
//   return res
// }
export function treeDataTranslate(data, id = 'id', pid = 'parentId') {
  var res = []
  var temp = {}
  for (var i = 0; i < data.length; i++) {
    data[i].id = data[i][id]
    temp[data[i][id]] = data[i]
  }
  for (var k = 0; k < data.length; k++) {
    if (temp[data[k][pid]] && data[k][id] !== data[k][pid]) {
      if (!temp[data[k][pid]]['children']) {
        temp[data[k][pid]]['children'] = []
        temp[data[k][pid]]['list'] = []
      }
      if (!temp[data[k][pid]]['_level']) {
        temp[data[k][pid]]['_level'] = 1
      }
      data[k]['_level'] = temp[data[k][pid]]._level + 1
      temp[data[k][pid]]['children'].push(data[k])
      // 判断三级菜单子级，根据数据里的type值做显隐判断
      if (temp[data[k][pid]].type !== 1) {
        temp[data[k][pid]]['list'].push(data[k])
      }
    } else {
      res.push(data[k])
    }
  }
  return res
}
export function treeDataTranslateOpen(data, id = 'id', pid = 'parentId') { // 打开子集
  var res = []
  var temp = {}
  for (var i = 0; i < data.length; i++) {
    data[i].id = data[i][id]
    temp[data[i][id]] = data[i]
  }
  for (var k = 0; k < data.length; k++) {
    if (temp[data[k][pid]] && data[k][id] !== data[k][pid]) {
      temp[data[k][pid]]['_showChildren'] = true
      if (!temp[data[k][pid]]['children']) {
        temp[data[k][pid]]['children'] = []
        temp[data[k][pid]]['list'] = []
      }
      if (!temp[data[k][pid]]['_level']) {
        temp[data[k][pid]]['_level'] = 1
      }
      data[k]['_level'] = temp[data[k][pid]]._level + 1
      temp[data[k][pid]]['children'].push(data[k])
      // 判断三级菜单子级，根据数据里的type值做显隐判断
      if (temp[data[k][pid]].type !== 1) {
        temp[data[k][pid]]['list'].push(data[k])
      }
    } else {
      res.push(data[k])
    }
  }
  return res
}
/**
 * 根据某个值的大小排序（从小到大）
 */
export function sortByKey(array, key) {
  return array.sort(function(a, b) {
    var x = a[key]
    var y = b[key]
    return x < y ? -1 : x > y ? 1 : 0
  })
}
/**
 * 根据某个值的大小排序(从大到小)
 */
export function sortByKeyFlashback(array, key) {
  return array.sort(function(a, b) {
    var x = a[key]
    var y = b[key]
    // return x < y ? -1 : x > y ? 1 : 0
    return x > y ? -1 : x < y ? 1 : 0
  })
}
/**
 * 清除登录信息
 */
export function clearLoginInfo() {
  Vue.cookie.delete('token')
  store.commit('resetStore')
  router.options.isAddDynamicMenuRoutes = false
}
/**
 * 将选中的时间遍历成周一
 */
export function getMonday(val) {
  var mondayVal = null
  var nowDate = Date.now()
  switch (val) {
    case 'Sunday':
      mondayVal = nowDate - 86400000 * 6
      break
    case 'Saturday':
      mondayVal = nowDate - 86400000 * 5
      break
    case 'Friday':
      mondayVal = nowDate - 86400000 * 4
      break
    case 'Thursday':
      mondayVal = nowDate - 86400000 * 3
      break
    case 'Wednesday':
      mondayVal = nowDate - 86400000 * 2
      break
    case 'Tuesday':
      mondayVal = nowDate - 86400000 * 1
      break
    case 'Monday':
      mondayVal = nowDate
      break
    default:
      break
  }
  return mondayVal
  // this.mondayVal = this.$moment(this.mondayVal).format('YYYY-MM-DD') + ' ' + '00:00:00'
}
/**
 * 将日期转换为第几周
 */
export function getWeekIndexInMonth(t) {
  if (t === undefined) {
    t = new Date()
  } else if (t instanceof Date) {
    var _t = new Date()
    _t.setYear(t.getFullYear())
    _t.setMonth(t.getMonth())
    _t.setDate(t.getDate())

    var date1 = _t.getDate() // 给定的日期是几号

    _t.setDate(1)
    var d = _t.getDay() // 1. 得到当前的1号是星期几。
    var fisrtWeekend = d
    if (d === 0) {
      fisrtWeekend = 1
      // 1号就是星期天
    } else {
      fisrtWeekend = 7 - d + 1 // 第一周的周未是几号
    }

    if (date1 <= fisrtWeekend) {
      return 1
    } else {
      return 1 + Math.ceil((date1 - fisrtWeekend) / 7)
    }
  } else {
  }
}
/**
 * 根据仅支持汉字中英文字符数字等 src\view\modules\plantMonitor\history\equipment\index.vue 特殊处理
 */
// export function supportNormal(params) { // 记得修改页面的特殊情况
//   var obj = params
//   var values = Object.keys(obj).map(function (e) { return obj[e] })
//   var isPass = true
//   values.forEach(item => {
//     let strs = item
//     if(item) {
//       if (!(/^[A-Za-z0-9\u4e00-\u9fa5]+$/gi.test(strs))) {
//         isPass = false
//       }
//     }
//   })
//   params = {
//     isPass: isPass,
//     message: '请不要输入特殊字符或纯空格执行查询操作'
//   }
//   return params
// }
// /**
//  * 根据仅支持汉字中英文字符数字等 src\view\modules\plantMonitor\history\equipment\index.vue 特殊处理
//  */
export function supportNormal(params) { // 记得修改页面的特殊情况
  var obj = params
  var values = Object.keys(obj).map(function (e) { return obj[e] })
  var isPass = true
  values.forEach(item => {
    let strs = item
    if(item) {
      if(typeof (item) === 'string') {
        if (!(/^[A-Za-z0-9\u4e00-\u9fa5]+$/gi.test(strs.trim()))) {
          isPass = false
        }
      }
    }
  })
  var searchParams = new Object()
  for(let key in params) {
    if(typeof (params[key]) === 'string') {
      searchParams[key] = params[key].trim()
    }else{
      searchParams[key] = params[key]
    }
  }
  params = {
    isPass: isPass,
    message: '请不要输入特殊字符或纯空格执行查询操作',
    searchParams: searchParams
  }
  return params
}
