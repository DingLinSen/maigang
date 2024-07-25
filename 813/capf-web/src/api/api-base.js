import httpRequest from '@/api/httpRequest'
import { API_BASE } from '@/api/api-address'
import { getToken } from '@/libs/util'
import axios from 'axios'

/**
 * 获取省市区集合
 * @param {*} params 请求参数
 */
export const initCityAreaList = params => {
  return httpRequest.$get({
    url: API_BASE.BASE_AREA_CITY,
    params: params
  })
}
/**
 * 验证码
 * @param {*} params 请求参数
 */
export const checkValidateCode = params => {
  return httpRequest.$get({
    url: API_BASE.CHECK_CODE + '?validateCode=' + params.captcha
  })
}
/**
 * 用户登录
 * @param {*} params 请求参数
 */
export const userLogin = params => {
  return httpRequest.$post({
    url: API_BASE.USER_LOGIN,
    // url: 'sysUser/login', // mock数据
    data: params
  })
}
/**
 * 更新获取登录用户信息
 * @param {*} token 请求参数
 */
export const initUserInfo = token => {
  return httpRequest.$post({
    url: API_BASE.USERINFO,
    params: {
      token
    }
  })
}

/**
 * 用户退出
 * @param {*} token 请求参数
 */
export const userLogout = token => {
  return httpRequest.$get({
    url: API_BASE.USER_LOGOUT
  })
}

/**
 * 修改密码
 * @param {*} params 请求参数
 */
export const userEditPWD = params => {
  const data = {
    password: params.password,
    new_password: params.passwd
  }
  return httpRequest.$post({
    url: API_BASE.EDITPWD,
    data: data
  })
}

/**
 * 获取基本代码档
 * @param {*} params 请求参数
 */
export const initBaseCodeInfo = params => {
  return httpRequest.$post({
    url: API_BASE.BASECODE
  })
}

/**
 * 导出EXCEL文件接口
 * @param {} url 路径
 */
export const exportFile = url => {
  // window.location.href = window.SITE_CONFIG.baseUrl + url
  window.location.href = url.startsWith('http')
    ? url
    : window.SITE_CONFIG.baseUrl + url
  // let blob = new Blob([window.SITE_CONFIG.downFileUrl + url], {
  //   type: "application/msword"
  // })
  // let urls = URL.createObjectURL(blob)
  // let link = document.createElement('a')
  // link.setAttribute("href", urls)
  // link.setAttribute("download", `word.docx`)
  // link.style.visibility = 'hidden'
  // document.body.appendChild(link)
  // link.click()
  // document.body.removeChild(link)
}
export const exportFileWithName = (url, fileName) => {
  axios.defaults.withCredentials = true
  axios
    .get(
      window.SITE_CONFIG.baseUrl +
        API_BASE.DOWNLOAD +
        '?fileName=' +
        fileName +
        '&path=' +
        window.SITE_CONFIG.downFileUrl +
        url.replace(/\\/g, '/'),
      {
        headers: {
          token: getToken(),
          'Content-Type': 'application/json; application/octet-stream'
        },
        responseType: 'arraybuffer'
      }
    )
    .then(res => {
      if (res.data) {
        let blob = new Blob([res.data])
        let urls = URL.createObjectURL(blob)
        let link = document.createElement('a')
        link.setAttribute('href', urls)
        link.setAttribute('download', fileName)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    })
    .catch(() => {})
}

export const exportFileWithNameSub = (url, fileName) => {
  axios.defaults.withCredentials = true
  axios
    .get(url.startsWith('http') ? url : window.SITE_CONFIG.baseUrl + url, {
      headers: {
        token: getToken(),
        'Content-Type': 'application/json; application/octet-stream'
      },
      responseType: 'arraybuffer'
    })
    .then(res => {
      if (res.data) {
        let blob = new Blob([res.data])
        let urls = URL.createObjectURL(blob)
        let link = document.createElement('a')
        link.setAttribute('href', urls)
        link.setAttribute('download', fileName)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    })
    .catch(() => {})
}
/**
 * 下载模板
 * @param {} url 路径
 */
export const exportModelFile = (url, token) => {
  window.location.href = url + '?token=' + getToken()
}
/**
 * 上传图片（公共）
 * @param {*} params 请求参数
 */
export const uploadImgs = data => {
  return httpRequest.$post({
    url: API_BASE.UPLOAD_IMG,
    data: data
  })
}

export const docPreview = params => {
  return httpRequest.$getFiles({
    url: window.SITE_CONFIG.downFileUrl + params.path
    // 'common/upload/downloadNet',
    // params: params
  })
}

export const docPreviewSub = params => {
  return httpRequest.$getFiles({
    url: window.SITE_CONFIG.baseUrl + 'common/upload/downloadNet',
    params: params
  })
}
/**
 * 下载PDF文件-根据 path 获取文件流
 * @param {*} params 请求参数 id
 */
export const downloadStreamByPath = params => {
  var subUrl = ''
  if (params.sysName) {
    subUrl = '?sysName=' + params.sysName + '&path' + '=' + params.path
  } else {
    subUrl = '?' + 'path' + '=' + params.path
  }
  return httpRequest.$getFile({
    url: API_BASE.DOWNLOAD + subUrl
  })
}
