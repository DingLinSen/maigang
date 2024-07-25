// 常用接口
import request from '@/config/axios'

// 所有常用
export const getCommonUseListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/system/oftenUse/list', params })
}
// 我的常用
export const getMyOftenUseApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/system/oftenUse/myOftenUse', params })
}
// 移出常用
export const getRemoveOftenUseApi = (params: any): Promise<IResponse> => {
  return request.post({ url: '/system/oftenUse/remove', params })
}
// 保存常用
export const getSaveOftenUseApi = (params: any): Promise<IResponse> => {
  return request.post({ url: '/system/oftenUse/save', params })
}
