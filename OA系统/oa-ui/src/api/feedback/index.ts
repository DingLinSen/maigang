import request from '@/config/axios'
import type { FeedbackBean } from './types'

//新增意见反馈信息
export const saveFeedbackApi = (data: Partial<FeedbackBean>): Promise<IResponse> => {
  return request.post({ url: '/system/sysFeedback', data })
}
//修改意见反馈信息
export const editFeedbackApi = (data: Partial<FeedbackBean>): Promise<IResponse> => {
  return request.put({ url: '/system/sysFeedback', data })
}
//删除意见反馈信息
export const delFeedbackListApi = (ids: string): Promise<IResponse> => {
  return request.delete({ url: '/system/sysFeedback?id=' + ids })
}
//修改意见反馈状态
export const auditFeedbackApi = (params: any): Promise<IResponse> => {
  return request.post({ url: '/system/sysFeedback/updateStatus', params })
}
//获取分页意见反馈信息
export const getFeedbackListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/system/sysFeedback', params })
}
//根据id查询意见反馈信息
export const getFeedbackDetailApi = (id: string): Promise<IResponse> => {
  return request.get({ url: '/system/sysFeedback/getById/' + id })
}