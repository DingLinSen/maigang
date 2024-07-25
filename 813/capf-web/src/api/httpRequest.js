import Vue from 'vue'
import axios from 'axios'
import router from '@/router'
import qs from 'qs'
import merge from 'lodash/merge'
import { clearLoginInfo } from '@/utils'
import { Message, Spin } from 'iview'
// 控制服务报错
var showTipInfo = true // 在失去服务之后控制只会出现一次错误类的提示信息

const http = axios.create({
  timeout: 1000 * 30,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
    // 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
  }
})
/**
 * 默认请求头
 */
// http.defaults.headers.common['token'] = Vue.cookie ? Vue.cookie.get('token') : null

/**
 * 请求拦截
 */
http.interceptors.request.use(
  config => {
    config.headers['token'] = Vue.cookie.get(Vue.prototype.CONST_VALUE.TOKEN) // 请求头带上token
    config.headers['x-auth-token'] = Vue.cookie.get(
      Vue.prototype.CONST_VALUE.TOKEN
    )
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

/**
 * 响应拦截
 */
http.interceptors.response.use(
  response => {
    Spin.hide()
    response.data = Object.assign(response.data, {
      status: false
    })
    let backData = response.data
    if (backData.httpCode !== 200) {
      switch (backData.httpCode) {
        case 400: // ①返回参数异常②用户名或密码错误③用户锁定
          // 其他类型异常，如果需要单独处理参照token失效方式
          showTipInfo = true
          if (backData.code === 0) {
            response.data.status = true
          } else {
            if(showTipInfo) {
              Message.error(backData.msg || '参数异常')
            }
          }
          break
        case 401: // 返回用户无权限
          showTipInfo = true
          if(showTipInfo) {
            Message.error(backData.msg || '用户无权限，请联系系统管理员！')
          }
          showTipInfo = false
          clearLoginInfo()
          setTimeout(() => {
            router.replace({ name: 'login' })
          }, 100)
          break
        case 402: // 返回用户未登录
          if(showTipInfo) {
            Message.error(backData.msg || '用户未登录，请重新登录！')
          }
          Vue.cookie.set('loginUserInfo', '')
          clearLoginInfo()
          showTipInfo = false
          setTimeout(() => {
            router.replace({ name: 'login' })
          }, 500)
          break
        case 405: // 验证码错误，用户名被占用 // 返回执行失败
          showTipInfo = true
          if(showTipInfo) {
            Message.error(backData.msg)
          }
          showTipInfo = false
          break
        case 500:
          if(showTipInfo) {
            Message.error(backData.msg || '服务器内部错误, 请联系系统管理员！')
          }
          showTipInfo = false
          // clearLoginInfo()
          // setTimeout(() => {
          //   router.replace({ name: 'login' })
          // }, 500)
          break
        case 100400: // token错误
          if(showTipInfo) {
            Message.error(backData.msg || 'token错误，请重新登录！')
          }
          showTipInfo = false
          Vue.cookie.set('loginUserInfo', '')
          clearLoginInfo()
          setTimeout(() => {
            router.replace({ name: 'login' })
          }, 500)
          break
        case 100401:
          if(showTipInfo) {
            Message.error(backData.msg || '用户不存在,请联系管理员！')
          }
          showTipInfo = false
          break
        case 100402: // 导入失败项
          Message.waring({
            content: backData.msg || '有导入失败项！',
            duration: 10,
            closable: true
          })
          break
        default:
          if(showTipInfo) {
            Message.error(backData.msg || '用户不存在,请联系管理员！')
          }
          clearLoginInfo()
          setTimeout(() => {
            router.replace({ name: 'login' })
          }, 500)
          showTipInfo = false
          break
      }
    } else {
      // 请求结果正确
      response.data.status = true
    }
    return response
  },
  error => {
    this.$Spin.hide()
    if(error.message.includes('timeout')) { // 判断请求异常信息中是否含有超时timeout字符串
      if(showTipInfo) {
        Message.error('系统开小差了~')
      }
      showTipInfo = false
      return Promise.reject(error)
    }else{
      if(showTipInfo) {
        Message.error('服务请求失败, 内部系统异常！')
      }
      showTipInfo = false
      // Vue.cookie.set('loginUserInfo', '')
      // setTimeout(() => {
      //   router.replace({ name: 'login' })
      // }, 500)
    }
    return Promise.reject(error)
  }
)

/**
 * 发起 request 请求
 * @param {*} options 请求参数
 */
http.$request = options => {
  options.url = http.mergeUrl(options.url)
  options.method = options.method || 'post'
  return http(options)
}

/**
 * 发起 GET 请求
 * @param {*} options 请求参数
 */
http.$get = options => {
  options.url = http.mergeUrl(options.url)
  options.method = 'GET'
  return http(options)
}

/**
 * 发起 GET 请求下载文件
 * @param {*} options 请求参数
 */
http.$getFile = options => {
  options.url = http.mergeUrl(options.url)
  options.params = http.getData(options.params)
  options.method = 'GET'
  options.responseType = 'blob'
  return http(options)
}

/**
 * 发起 POST 请求
 * @param {*} options 请求参数
 */
http.$post = options => {
  options.url = http.mergeUrl(options.url)
  options.data = http.postData(options.data, false, options.contentType)
  options.method = 'POST'
  return http(options)
}

/**
 * 发起 POST 请求分页列表
 * @param {*} options 请求参数
 */
http.$postList = options => {
  options.url = http.mergeUrl(options.url)
  options.data = http.postData(options.data)
  options.method = 'POST'
  return http(options)
}
/**  添加！！
 * 发起 put 请求
 * @param {*} options 请求参数
 */
http.$put = options => {
  options.url = http.mergeUrl(options.url)
  options.data = http.putData(options.data)
  options.method = 'PUT'
  return http(options)
}
/**  添加！！
 * 发起 delete 请求
 * @param {*} options 请求参数
 */
http.$delete = options => {
  options.url = http.mergeUrl(options.url)
  options.data = http.deleteData(options.data)
  options.method = 'DELETE'
  return http(options)
}

/**
 * 发起 GET 请求分页列表
 * @param {*} options 请求参数
 */
http.$getList = options => {
  options.url = http.mergeUrl(options.url)
  options.params = http.getData(options.params)
  options.method = 'GET'
  return http(options)
}

/**
 * 请求地址处理
 * @param {*} actionName action方法名称
 */
http.mergeUrl = actionName => {
  // 判断接口是否包含http 请求， 如果包含使用原有请求路径
  if (actionName.indexOf('http') !== -1 || actionName.indexOf('https') !== -1) {
    return actionName
  }
  // 非生产环境 && 开启代理, 接口前缀统一使用[/proxyApi/]前缀做代理拦截!
  return (
    (process.env.NODE_ENV !== 'production' && process.env.OPEN_PROXY
      ? '/proxyApi/'
      : window.SITE_CONFIG.baseUrl) + actionName
  )
}

/**
 * get请求参数处理
 * @param {*} params 参数对象
 * @param {*} openDefultParams 是否开启默认参数?
 */
http.getData = (
  params = {},
  openDefultParams = false,
  contentType = 'json'
) => {
  var defaults = {
    t: new Date().getTime()
  }
  if (params && params.currentPage) {
    params = Object.assign(params, {
      page: params.currentPage || null,
      limit: params.showCount || null,
      showCount: params.showCount || null,
      currentPage: params.currentPage || null,
      orderKey: params.orderKey || null, // 字段名称
      orderType: params.orderType || null, // 排序方式
      orderNumber: params.orderNumber || null
    })
  }
  params = openDefultParams ? merge(defaults, params) : params
  return params
}

/**
 * post请求数据处理
 * @param {*} data 数据对象
 * @param {*} openDefultdata 是否开启默认数据?
 * @param {*} contentType 数据格式
 *  json: 'application/json; charset=utf-8'
 *  form: 'application/x-www-form-urlencoded; charset=utf-8'
 */
http.postData = (data = {}, openDefultdata = false, contentType = 'json') => {
  var defaults = {
    t: new Date().getTime()
  }
  if (data && data.currentPage) {
    data = Object.assign(data, {
      page: data.currentPage || null,
      limit: data.showCount || null,
      showCount: data.showCount || null,
      currentPage: data.currentPage || null,
      orderKey: data.orderKey || null, // 字段名称
      orderType: data.orderType || null, // 排序方式
      orderNumber: data.orderNumber || null
    })
  }
  data = openDefultdata ? merge(defaults, data) : data
  return contentType === 'json' ? JSON.stringify(data) : qs.stringify(data)
}
// 添加！！！
http.putData = (data = {}, openDefultdata = false, contentType = 'json') => {
  var defaults = {
    t: new Date().getTime()
  }
  if (data && data.currentPage) {
    data = Object.assign(data, {
      page: data.currentPage || null,
      limit: data.showCount || null,
      showCount: data.showCount || null,
      currentPage: data.currentPage || null,
      orderKey: data.orderKey || null, // 字段名称
      orderType: data.orderType || null, // 排序方式
      orderNumber: data.orderNumber || null
    })
  }
  data = openDefultdata ? merge(defaults, data) : data
  return contentType === 'json' ? JSON.stringify(data) : qs.stringify(data)
}
// 添加！！
http.deleteData = (data = {}, openDefultdata = false, contentType = 'json') => {
  var defaults = {
    t: new Date().getTime()
  }
  if (data && data.currentPage) {
    data = Object.assign(data, {
      page: data.currentPage || null,
      limit: data.showCount || null,
      showCount: data.showCount || null,
      currentPage: data.currentPage || null,
      orderKey: data.orderKey || null, // 字段名称
      orderType: data.orderType || null, // 排序方式
      orderNumber: data.orderNumber || null
    })
  }
  data = openDefultdata ? merge(defaults, data) : data
  return contentType === 'json' ? JSON.stringify(data) : qs.stringify(data)
}
/**
 * 发起 GET 请求下载文件
 * @param {*} options 请求参数
 */
http.$getFiles = (options) => {
  options.url = http.mergeUrl(options.url)
  options.params = http.getData(options.params)
  options.method = 'GET'
  options.responseType = 'arraybuffer'
  return http(options)
}
export default http
