import axios from 'axios'
import request from '@/config/axios'
import { service } from '@/config/axios/service'
import { ElMessage, ElLoading } from 'element-plus'
import { blobValidate } from '@/utils/downUtils'
import { saveAs } from 'file-saver'
// 获取菜单
export const getMenuList = (): Promise<IResponse> => {
  return request.get({ url: '/system/management/menu/getRouters' })
}
// 获取部门下拉列表数据
export const getDeptListByLevel = (params: any): Promise<IResponse> => {
  return request.get({ url: '/system/management/dept/selectDepts', params })
}
// 获取全部部门
export const getAllDeptListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/system/management/dept/getAll', params })
}
// 根据父级IDs获取部门列表
export const getDeptListApi = (data: any): Promise<IResponse> => {
  return request.post({
    url: '/system/management/dept/getDeptList',
    data
  })
}
// 根据模块标识查询
export const getWidthByFlagApi = async (params): Promise<IResponse> => {
  return request.get({ url: '/safetyProduction/customWidth/findByFlag', params })
}
// 自定义宽度-新增
export const saveWidthApi = (data: any): Promise<IResponse> => {
  return request.post({ url: '/safetyProduction/customWidth/save', data })
}

// 自定义宽度-修改
export const editWidthApi = (data: any): Promise<IResponse> => {
  return request.put({ url: '/safetyProduction/customWidth/update', data })
}
let downloadLoadingInstance: any
// 下载数据格式化
const downloadInit = (res, filename) => {
  const disposition = res.headers['content-disposition']
  const stringName = disposition ? disposition.split('filename=')[1] : '' // 一般来说，文件名字后端都在返回头里，前后端可以约定文件名前用 @ 符号分隔，便于取值，用其他符号也可以。
  const fileNameType = stringName ? stringName.split('.')[1] : '' // 获取到了后缀名
  const name = stringName ? stringName.split('.')[0] : '' // 获取到文件名（不含后缀）
  // decodeURIComponent(name) ,一般来说后端返回的名字没有转码，需要前端解码utf-8，如果后端转了，就不用转。
  const fileName = name ? `${decodeURIComponent(name)}.${fileNameType}` : ''
  const isBlob = blobValidate(res)
  if (isBlob) {
    const blob = new Blob([res.data])
    saveAs(blob, fileName || filename)
  }
  downloadLoadingInstance.close()
}
// 通用下载方法-post
export const download = async (url: string, params: any, filename: string) => {
  downloadLoadingInstance = ElLoading.service({
    text: '正在下载数据，请稍候',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  return service
    .post(url, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      responseType: 'blob'
    })
    .then(async (res) => {
      downloadInit(res, filename)
    })
    .catch((r) => {
      ElMessage.error('下载文件出现错误，请联系管理员！')
      downloadLoadingInstance.close()
    })
}
// json格式下载
export const downloadJson = async (url: string, params: any, filename: string) => {
  downloadLoadingInstance = ElLoading.service({
    text: '正在下载数据，请稍候',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  const data = params
  return service
    .post(url, data, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'blob'
    })
    .then(async (res) => {
      downloadInit(res, filename)
    })
    .catch((r) => {
      ElMessage.error('下载文件出现错误，请联系管理员！')
      downloadLoadingInstance.close()
    })
}
// get方法下载
export const downloadGet = async (url: string, params: any, filename: string) => {
  downloadLoadingInstance = ElLoading.service({
    text: '正在下载数据，请稍候',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  return service
    .get(url, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      responseType: 'blob',
      params: params
    })
    .then(async (res) => {
      downloadInit(res, filename)
    })
    .catch((r) => {
      ElMessage.error('下载文件出现错误，请联系管理员！')
      downloadLoadingInstance.close()
    })
}

// 通用附件下载
export const downloadFileCommon = async (url: string, params: any, filename: string) => {
  downloadLoadingInstance = ElLoading.service({
    text: '正在下载数据，请稍候',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  const list = url.split('.')
  const type = list[list.length - 1]
  const name = filename.indexOf('.') > -1 ? filename : `${filename}.${type}`
  return axios
    .request({
      method: 'GET',
      url: url,
      responseType: 'blob',
      params: params
    })
    .then((res) => {
      const isBlob = blobValidate(res)
      if (isBlob) {
        const blob = new Blob([res.data])
        saveAs(blob, name)
      }
      downloadLoadingInstance.close()
    })
    .catch((r) => {
      ElMessage.error('下载文件出现错误，请联系管理员！')
      downloadLoadingInstance.close()
    })
  // return service
  //   .get(url, {
  //     responseType: 'blob'
  //   })
  //   .then(async (data) => {
  //     const isBlob = blobValidate(data)
  //     if (isBlob) {
  //       const blob = new Blob([data.data])
  //       saveAs(blob, filename)
  //     }
  //     downloadLoadingInstance.close()
  //   })
  //   .catch((r) => {
  //     console.error(r)
  //     ElMessage.error('下载文件出现错误，请联系管理员！')
  //     downloadLoadingInstance.close()
  //   })
}
let uploadLoadingInstance: any
// 通用导入方法
export const uploldFile = async (url: string, params: any, uploadParams?: any) => {
  uploadLoadingInstance = ElLoading.service({
    text: '正在上传数据，请稍候',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  const formData = new FormData()
  formData.append('file', params.file)
  if (uploadParams) {
    Object.keys(uploadParams).map((key) => {
      formData.append(key, uploadParams[key])
    })
  }
  return new Promise((resolve) => {
    return service
      .post(url, formData)
      .then(async (data) => {
        resolve(data)
        uploadLoadingInstance.close()
      })
      .catch((r) => {
        resolve(r)
        // ElMessage.error('导入文件出现错误，请联系管理员！')
        uploadLoadingInstance.close()
      })
  })
}

// 通用附件上传
export const uploadFileApi = async (params: any) => {
  return uploldFile('/mgdaas-file/upload', params)
}
export const uploldFileCommon = async (url: string, params: any) => {
  uploadLoadingInstance = ElLoading.service({
    text: '正在上传数据，请稍候',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  return new Promise((resolve) => {
    const formData = new FormData()
    formData.append('file', params.file)
    return service
      .post(url, formData)
      .then(async (data) => {
        resolve(data)
        uploadLoadingInstance.close()
      })
      .catch((r) => {
        uploadLoadingInstance.close()
      })
  })
}
