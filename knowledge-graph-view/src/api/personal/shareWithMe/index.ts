import request from '@/config/axios'

// 分享列表
export const getShareMeApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/knowledge-mapping/share/shareMe', params })
}

// 分享
// export const shareMeApi = (data: Partial<any>): Promise<IResponse> => {
//   return request.post({ url: '/knowledge-mapping/share/shareMe', data })
// }

// // 删除
// export const delDownloadRecordApi = (id: any): Promise<IResponse> => {
//   return request.delete({ url: '/knowledge-mapping/downloadRecords/remove', params: { id } })
// }
