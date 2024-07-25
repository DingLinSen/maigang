import request from '@/config/axios'

// 分享列表
export const getMyShareListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/knowledge-mapping/share/myShare', params })
}

// // 下载
// export const downloadApi = (data: Partial<any>): Promise<IResponse> => {
//   return request.post({ url: '/knowledge-mapping/share/share', data })
// }

// // 删除
// export const delDownloadRecordApi = (id: any): Promise<IResponse> => {
//   return request.delete({ url: '/knowledge-mapping/downloadRecords/remove', params: { id } })
// }
