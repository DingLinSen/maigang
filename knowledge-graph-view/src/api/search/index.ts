import request from '@/config/axios'
// 首页检索
export const searchApi = (data: Partial<any>): Promise<any> => {
  return request.post({ url: '/knowledge-mapping/search/search', data })
}
//浏览量增加
export const updateViewNumApi = (params: any): Promise<any> => {
  return request.put({ url: '/knowledge-mapping/title/updateViewNum', params })
}