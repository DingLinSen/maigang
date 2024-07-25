import request from '@/config/axios'

// 收藏列表
export const getMyCollectionApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/knowledge-mapping/collection/myCollection', params })
}

// 取消收藏
export const closeCollectionApi = (data: Partial<any>): Promise<IResponse> => {
  return request.post({
    url: '/knowledge-mapping/share/collection',
    data,
    headersType: 'multipart/form-data'
  })
}

// 消息已读
// export const readApi = (data: any): Promise<IResponse> => {
//   return request.post({
//     url: '/oa-project/index/read',
//     data,
//     headersType: 'multipart/form-data'
//   })
// }

// // 删除
// export const delDownloadRecordApi = (id: any): Promise<IResponse> => {
//   return request.delete({ url: '/knowledge-mapping/downloadRecords/remove', params: { id } })
// }
