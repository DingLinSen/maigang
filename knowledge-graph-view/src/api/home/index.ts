import request from '@/config/axios'

// 浏览列表
export const getHomeTotalApi = (params?: any): Promise<IResponse> => {
  return request.get({ url: '/knowledge-mapping/search/total', params })
}
