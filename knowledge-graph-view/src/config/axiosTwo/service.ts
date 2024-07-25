import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosResponse,
  AxiosError
} from 'axios'

import qs from 'qs'
import { config } from './config'
import { ElMessage } from 'element-plus'
import { useCache } from '@/hooks/web/useCache'
import { removeRoken } from '@/utils/removeRoken'
import router from '../../router'
import { useCookies } from 'vue3-cookies'
import { useAppStore } from '@/store/modules/app'
const { result_code, base_url } = config
const loginClientId = import.meta.env.VITE_WS_BASE_CLIENTID
const loginUrl = import.meta.env.VITE_WS_BASE_LOGIN_URL
export const PATH_URL = base_url[import.meta.env.VITE_API_BASEPATH]
const appStore = useAppStore()
// 获取cookies
const { cookies } = useCookies()

// 创建axios实例
const service: AxiosInstance = axios.create({
  baseURL: PATH_URL, // api 的 base_url
  timeout: config.request_timeout // 请求超时时间
})
const { wsCache } = useCache()
// request拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = cookies.get('access_token')
    wsCache.set(appStore.getToken, token)
    config.headers['Authorization'] = wsCache.get('access_token') // 请求头带上token
    if (
      config.method === 'post' &&
      (config.headers as AxiosRequestHeaders)['Content-Type'] ===
        'application/x-www-form-urlencoded'
    ) {
      config.data = qs.stringify(config.data)
    }
    // ;(config.headers as AxiosRequestHeaders)['Token'] = 'test test'
    // get参数编码
    if (config.method === 'get' && config.params) {
      let url = config.url as string
      url += '?'
      const keys = Object.keys(config.params)
      for (const key of keys) {
        if (config.params[key] !== void 0 && config.params[key] !== null) {
          url += `${key}=${encodeURIComponent(config.params[key])}&`
        }
      }
      url = url.substring(0, url.length - 1)
      config.params = {}
      config.url = url
    }
    return config
  },
  (error: AxiosError) => {
    // Do something with request error
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  (response: AxiosResponse<any>) => {
    if (
      response.config.responseType === 'blob' ||
      response.headers['content-type'] ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document;charset=UTF-8'
    ) {
      // 如果是文件流，直接过
      return response
    } else if (response.data) {
      if (response.data.code === result_code) {
        return response.data
      }
      const data = response.data
      switch (data.code) {
        case '400':
          ElMessage.error(data.tip || data.message || '参数异常')
          break
        case '401':
          // 如果sso退出登录后，接口code返回401使用此方法
          //清空cookies中的数据，然后跳转到sso登录页,并传递logout=true此变量来让sso清空cookie
          ElMessage.error(data.tip || data.message || '用户无权限，请联系系统管理员！')
          removeRoken()
          // router.replace({
          //   path: '/login'
          // })
          break
        case '402':
          ElMessage.error(data.tip || data.message || '用户未登录，请重新登录！')
          removeRoken()
          break
        case '403':
          ElMessage.error(data.tip || data.message || '用户无权限')
          removeRoken()
          break
        case '500':
          ElMessage.error(data.tip || data.message || '服务器内部错误，请联系系统管理员！')
          removeRoken()
          break
        case '100400':
          ElMessage.error(data.tip || data.message || 'token错误，请重新登录！')
          removeRoken()
          break
        case '100401':
          ElMessage.error(data.tip || data.message || '用户不存在，请联系管理员！')
          break
        case '100402':
          ElMessage.error(data.tip || data.message || '有导入失败项！')
          break
        case 'A0201':
          ElMessage.error(data.tip || data.message || '用户名不存在/密码错误')
          break
        default:
          ElMessage.error(data.tip || data.message)
          break
      }
      return Promise.reject(data)
    } else {
      ElMessage.error('服务请求失败, 内部系统异常！')
    }
  },
  (error: AxiosError) => {
    console.log('err' + error) // for debug
    ElMessage.error(error.message)
    return Promise.reject(error)
  }
)

export { service }
