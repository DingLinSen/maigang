import request from '@/config/axios'

// 浏览列表
export const getMyBrowseListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/knowledge-mapping/browse/myBrowse', params })
}

// // 下载
export const removeBrowseApi = (data: Partial<any>): Promise<IResponse> => {
  return request.post({
    url: '/knowledge-mapping/browse/remove',
    data,
    headersType: 'multipart/form-data'
  })
}

// // 删除
// export const delDownloadRecordApi = (id: any): Promise<IResponse> => {
//   return request.delete({ url: '/knowledge-mapping/downloadRecords/remove', params: { id } })
// }
