import request from '@/config/axios'
import { nextTick } from 'vue'
import { service } from '@/config/axios/service'
import { ElMessage, ElLoading } from 'element-plus'
import { blobValidate } from '@/utils/downUtils'
import { saveAs } from 'file-saver'

// 获取所有字典
export const getDictApi = (): Promise<IResponse> => {
  return request.get({ url: '/system/management/dict/type/list' })
}

// 获取某个字典
export const getDictOneApi = async (type): Promise<IResponse> => {
  return request.get({ url: '/system/management/dict/data/type/' + type })
}

// 获取菜单
export const getMenuList = (): Promise<IResponse> => {
  return request.get({ url: '/system/management/menu/getRouters' })
}
// 公用下载文件
export const docPreview = (): Promise<IResponse> => {
  return request.getFile({ url: '/system/management/menu/getRouters' })
}

let downloadLoadingInstance: any

// 通用下载方法
export const download = async (url: string, params?: any, filename: string) => {
  downloadLoadingInstance = ElLoading.service({
    text: '正在下载数据，请稍候',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  return service
    .post(url, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      responseType: 'blob'
    })
    .then(async (data) => {
      const isBlob = blobValidate(data)
      console.log(isBlob)

      if (isBlob) {
        const blob = new Blob([data.data])
        saveAs(blob, filename)
      }
      downloadLoadingInstance.close()
    })
    .catch((r) => {
      console.error(r)
      ElMessage.error('下载文件出现错误，请联系管理员！')
      downloadLoadingInstance.close()
    })
}
export const downloadDoc = async (url: string, params?: any, filename?: string) => {
  downloadLoadingInstance = ElLoading.service({
    text: '正在下载数据，请稍候',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  let allUrl = url
  if (params) {
    let param = ''
    Object.keys(params).map((key: string) => {
      if (params[key]) {
        if (param) {
          param = param + '&' + key + '=' + params[key]
        } else {
          param = '?' + key + '=' + params[key]
        }
      } else {
        if (param) {
          param = param + '&' + key + '='
        } else {
          param = '?' + key + '='
        }
      }
    })
    allUrl = allUrl + param
  }
  return service
    .get(allUrl, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      responseType: 'blob'
    })
    .then(async (data) => {
      const isBlob = blobValidate(data.data)
      console.log(isBlob)

      if (isBlob) {
        const blob = new Blob([data.data], {
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document;charset=UTF-8'
        })
        saveAs(blob, filename)
      }
      downloadLoadingInstance.close()
    })
    .catch((r) => {
      console.error(r)
      ElMessage.error('下载文件出现错误，请联系管理员！')
      downloadLoadingInstance.close()
    })
}
