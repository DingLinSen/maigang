// import type { Plugin } from 'vue'
import axios from 'axios'

/**
 *
 * @param component 需要注册的组件
 * @param alias 组件别名
 * @returns any
 */
export const withInstall = <T>(component: T, alias?: string) => {
  const comp = component as any
  comp.install = (app: any) => {
    app.component(comp.name || comp.displayName, component)
    if (alias) {
      app.config.globalProperties[alias] = component
    }
  }
  return component as T & Plugin
}
/**
 * @param str 需要转下划线的驼峰字符串
 * @returns 字符串下划线
 */
export const humpToUnderline = (str: string): string => {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase()
}
/**
 * @param str 需要转驼峰的下划线字符串
 * @returns 字符串驼峰
 */
export const underlineToHump = (str: string): string => {
  if (!str) return ''
  return str.replace(/\-(\w)/g, (_, letter: string) => {
    return letter.toUpperCase()
  })
}
export const setCssVar = (prop: string, val: any, dom = document.documentElement) => {
  dom.style.setProperty(prop, val)
}
/**
 * 查找数组对象的某个下标
 * @param {Array} ary 查找的数组
 * @param {Functon} fn 判断的方法
 */
// eslint-disable-next-line
export const findIndex = <T = Recordable>(ary: Array<T>, fn: Fn): number => {
  if (ary.findIndex) {
    return ary.findIndex(fn)
  }
  let index = -1
  ary.some((item: T, i: number, ary: Array<T>) => {
    const ret: T = fn(item, i, ary)
    if (ret) {
      index = i
      return ret
    }
  })
  return index
}
export const trim = (str: string) => {
  return str.replace(/(^\s*)|(\s*$)/g, '')
}
/**
 * @param {Date | number | string} time 需要转换的时间
 * @param {String} fmt 需要转换的格式 如 yyyy-MM-dd、yyyy-MM-dd HH:mm:ss
 */
export function formatTime(time: Date | number | string, fmt: string) {
  if (!time) return ''
  else {
    const date = new Date(time)
    const o = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'H+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds(),
      'q+': Math.floor((date.getMonth() + 3) / 3),
      S: date.getMilliseconds()
    }
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (const k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
        )
      }
    }
    return fmt
  }
}
/**
 * 生成随机字符串
 */
export function toAnyString() {
  const str: string = 'xxxxx-xxxxx-4xxxx-yxxxx-xxxxx'.replace(/[xy]/g, (c: string) => {
    const r: number = (Math.random() * 16) | 0
    const v: number = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString()
  })
  return str
}
// 验证是否外部地址
export function isExternal(path: string) {
  return /^(https?:|mailto:|tel:)/.test(path)
}
// 复制文本
export function copy(text: string) {
  const input = document.createElement('textarea')
  input.value = text
  document.body.appendChild(input)
  input.select()
  document.execCommand('copy')
  document.body.removeChild(input)
}
// 下载文件
export const downloadFile = (filePath: any, fileName: any) => {
  axios
    .request({
      method: 'GET', //这个不解释了吧
      url: filePath, //路径
      responseType: 'blob' //告诉服务器想到的响应格式
    })
    .then((res) => {
      const blob = new Blob([res.data])
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.download = fileName
      a.href = url
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      //释放一个通过 URL.createObjectURL() 方法创建的 URL,防止内存泄漏
      URL.revokeObjectURL(url)
    })
}
// 计算文件大小
export const fileSize = (row: any) => {
  let fileSize = row
  let value = '--'
  if (typeof fileSize === 'undefined' || fileSize === null || fileSize === '' || fileSize == 0) {
  } else {
    fileSize = parseInt(fileSize)
    if (fileSize < 1024) {
      value = fileSize + 'B'
    } else if (fileSize >= 1024 && fileSize < 1024 * 1024) {
      fileSize = parseFloat(fileSize / 1024).toFixed(1)
      value = fileSize + 'KB'
    } else if (fileSize >= 1024 * 1024 && fileSize < 1024 * 1024 * 1024) {
      fileSize = parseFloat(fileSize / (1024 * 1024)).toFixed(1)
      value = fileSize + 'MB'
    } else if (fileSize >= 1024 * 1024 * 1024 && fileSize < 1024 * 1024 * 1024 * 1024) {
      fileSize = parseFloat(fileSize / (1024 * 1024 * 1024)).toFixed(1)
      value = fileSize + 'GB'
    }
  }
  return value
}
// 从最后一个开始查找符合条件的索引
export const findLastIndex = (array: any, cb) => {
  if (!Array.isArray(array)) {
    return -1
  }
  if (array.length === 0) {
    return -1
  }
  for (let i = array.length - 1; i >= 0; i--) {
    const item = array[i]
    if (cb.call(null, item, i, array)) {
      return i
    }
  }
  return -1
}
export const setAvatarImage = async (e: any) => {
  const avatar = await import('@/assets/imgs/classroom/avatar.png')
  e.target.src = avatar.default
}
export const setBannerImage = async (e: any) => {
  const avatar = await import('@/assets/imgs/classroom/fm_default.png')
  e.target.src = avatar.default
}
