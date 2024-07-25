import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosResponse,
  AxiosError
} from 'axios'
import { h } from 'vue'

import qs from 'qs'
import { config } from './config'
import { ElMessage, ElMessageBox, ElScrollbar } from 'element-plus'
import { useCache } from '@/hooks/web/useCache'
import router from './../../router'

const { result_code, base_url } = config

export const PATH_URL = base_url[import.meta.env.VITE_API_BASEPATH]
// 创建axios实例
const service: AxiosInstance = axios.create({
  baseURL: PATH_URL, // api 的 base_url
  timeout: config.request_timeout // 请求超时时间
})
const { wsCache } = useCache()
// request拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.headers['Authorization'] = wsCache.get('Admin-Token') // 请求头带上token
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
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  (response: AxiosResponse<any>) => {
    // const data = response.config.data ? JSON.parse(response.config.data) : null
    if (response.config.responseType === 'blob') {
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
          ElMessage.error(data.tip || data.message || '用户无权限，请联系系统管理员！')
          wsCache.clear()
          router.replace({
            path: '/login'
          })
          break
        case '402':
          ElMessage.error(data.tip || data.message || '用户未登录，请重新登录！')
          break
        case '403':
          ElMessage.error(data.tip || data.message || '用户无权限')
          break
        case '500':
          ElMessage.error(data.tip || data.message || '服务器内部错误，请联系系统管理员！')
          break
        case '100400':
          ElMessage.error(data.tip || data.message || 'token错误，请重新登录！')
          break
        case '100401':
          ElMessage.error(data.tip || data.message || '用户不存在，请联系管理员！')
          break
        case '100402':
          ElMessage.error(data.tip || data.message || '有导入失败项！')
          break
        case 'A0406':
          const tips = data.tip || data.message || '有导入失败项！'
          if (tips.length < 1000) {
            ElMessage({
              showClose: true,
              message: tips,
              type: 'error',
              duration: 0
            })
          } else {
            ElMessageBox({
              title: '提示',
              message: h(
                ElScrollbar,
                {
                  style: {
                    height: '80vh',
                    overflow: 'hidden'
                  }
                },
                [
                  h(
                    'div',
                    {
                      style: {
                        height: '100%',
                        overflowY: 'scroll'
                      }
                    },
                    tips
                  )
                ]
              ),
              customClass: 'import-tip'
            })
          }

          // ElNotification({
          //   title: '提示',
          //   message: data.tip || data.message || '有导入失败项！',
          //   duration: 0
          // })
          break
        case 'A0201':
          ElMessage.error(data.tip || data.message || '用户名不存在/密码错误')
          break
        default:
          if (data.tip || data.message) {
            ElMessage.error(data.tip || data.message)
          } else {
            ElMessage.error('服务请求失败, 内部系统异常！')
          }

          break
      }
      return Promise.reject(data)
    } else {
      ElMessage.error('服务请求失败, 内部系统异常！')
    }
  },
  (error: AxiosError) => {
    ElMessage.error(error.message)
    // wsCache.clear()
    // router.replace({
    //   path: '/login'
    // })
    return Promise.reject(error)
  }
)

export { service }
