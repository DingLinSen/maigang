import request from '@/config/axios'
// 获取主页列表
export const changeList = (params: any): Promise<IResponse> => {
  return request.get({ url: '/app/accessible_list', params })
}
