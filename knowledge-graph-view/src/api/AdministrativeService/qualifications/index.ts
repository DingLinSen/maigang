// 公司资质接口
import request from '@/config/axios'
import { useCache } from '@/hooks/web/useCache'

const { wsCache } = useCache()
import { useAppStore } from '@/store/modules/app'
import axios from 'axios'
import { PATH_URL } from '@/config/axios/service'

const appStore = useAppStore()

// 上传文件夹级联目录与文件
export const uploadFolderOrFileDrag = (data: any, callback) => {
  axios({
    url: PATH_URL + '/oa-administrative/upload/uploadFolderOrFileDrag',
    method: 'post',
    data,
    headers: {
      Authorization: wsCache.get(appStore.getToken)
    },
    //原生获取上传进度的事件
    onUploadProgress: function (progressEvent) {
      const loaded = progressEvent.loaded
      const total = progressEvent.total
      callback(loaded, total)
    }
  })
}

// 根据id查询文件夹与文件列表 或 根据文件名模糊查询
export const getFilesListApi = (params: any): Promise<IResponse> => {
  return request.get({
    url: '/oa-administrative/mgCompanyQualificationFiles/qryMgCompanyQualificationFilesById',
    params
  })
}

// 批量文件夹或文件删除
export const deleteBatchFolderOrFile = (params: any): Promise<IResponse> => {
  return request.delete({ url: '/oa-administrative/upload/deleteBatchFolderOrFile', params })
}

// 下载
export const downloadFolderOrFile = (params: any, data: any): Promise<IResponse> => {
  return request
    .get({
      url: data.url,
      params,
      headers: {
        Authorization: wsCache.get(appStore.getToken)
      },
      responseType: 'blob'
    })
    .then((res) => {
      const blob = new Blob([res.data])
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.download = data.fileName
      a.href = url
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      //释放一个通过 URL.createObjectURL() 方法创建的 URL,防止内存泄漏
      URL.revokeObjectURL(url)
    })
}
// 批量下载
export const downloadBatchFolderOrFile = (data: any): Promise<IResponse> => {
  return request
    .post({
      url: '/mgdaas-file/downloadBatchFolderOrFile',
      data,
      headers: {
        Authorization: wsCache.get(appStore.getToken)
      },
      responseType: 'blob'
    })
    .then((res) => {
      const blob = new Blob([res.data])
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.download = '批量下载.zip'
      a.href = url
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      //释放一个通过 URL.createObjectURL() 方法创建的 URL,防止内存泄漏
      URL.revokeObjectURL(url)
    })
}
