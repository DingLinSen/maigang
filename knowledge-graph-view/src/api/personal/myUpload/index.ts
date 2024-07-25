import request from '@/config/axios'
import { useCache } from '@/hooks/web/useCache'
import { download } from '@/api/common'

const { wsCache } = useCache()
import { useAppStore } from '@/store/modules/app'
import axios from 'axios'
import { PATH_URL } from '@/config/axios/service'

const appStore = useAppStore()
// 上传文件
export const uploadFileApi = (data: any, callback) => {
  return axios({
    url: PATH_URL + '/mgdaas-file/upload',
    method: 'post',
    data,
    headers: {
      Authorization: wsCache.get(appStore.getToken)
    },
    //原生获取上传进度的事件
    onUploadProgress: function (progressEvent) {
      callback(progressEvent)
    }
  })
}
// 发布
export const storeAndParseApi = (data: Partial<any>): Promise<any> => {
  return request.post({ url: '/knowledge-mapping/title/storeAndParse', data })
}
// 获取我的上传列表
export const getMyUploadApi = (data: Partial<any>): Promise<any> => {
  const params = {
    pageNum: data.pageNum,
    pageSize: data.pageSize
  }
  return request.post({ url: '/knowledge-mapping/title/list', data, params })
}
// 岗位
export const getPostByUserIdApi = (params: any): Promise<any> => {
  return request.get({ url: '/knowledge-mapping/management/post/getPostByUserId', params })
}
// 批量修改引用次数
export const updateRefCountApi = (data: any, params: any): Promise<IResponse> => {
  return request.put({ url: '/knowledge-mapping/tag/updateRefCount', data, params })
}
// 标签调整
export const updateTagsApi = (data: any): Promise<IResponse> => {
  return request.put({ url: '/knowledge-mapping/title/tagAdjust', data })
}
// 根据id获取详细信息
export const getUploadDetailApi = (params: any): Promise<any> => {
  return request.get({ url: '/knowledge-mapping/title/findById', params })
}
// 根据id获取详细信息（编辑）
export const getUploadEditApi = (params: any): Promise<any> => {
  return request.get({ url: '/knowledge-mapping/title/findByIdForUpdate', params })
}
// 编辑我的上传
export const editUploadApi = (data: any): Promise<any> => {
  return request.put({ url: '/knowledge-mapping/title/update', data })
}
// 下载
export const myUploadDownloadApi = (data: Partial<any>, fileName: string) => {
  return download('/knowledge-mapping/downloadRecords/download', data, fileName)
}
// 删除
export const delMyUploadApi = (params: any): Promise<IResponse> => {
  return request.delete({ url: '/knowledge-mapping/title/delete', params })
}
