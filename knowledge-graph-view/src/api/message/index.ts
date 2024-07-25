import request from '@/config/axios'

// 浏览列表
export const getMessageListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/knowledge-mapping/message/list', params })
}

// 已读
export const readApi = (data: Partial<any>): Promise<IResponse> => {
  return request.post({
    url: '/knowledge-mapping/message/read',
    data,
    headersType: 'multipart/form-data'
  })
}

// 全部已读
export const readAllApi = (data: Partial<any>): Promise<IResponse> => {
  return request.post({
    url: '/knowledge-mapping/message/readAll',
    data,
    headersType: 'multipart/form-data'
  })
}
