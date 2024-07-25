import request from '@/config/axios'

// 列表
export const getDownloadRecordApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/knowledge-mapping/downloadRecords/list', params })
}

// 下载
export const downloadApi = (data: Partial<any>): Promise<IResponse> => {
  return request.post({ url: '/knowledge-mapping/downloadRecords/download', data })
}

// 删除
export const delDownloadRecordApi = (ids: any): Promise<IResponse> => {
  return request.delete({ url: '/knowledge-mapping/downloadRecords/remove?ids=' + ids })
}
