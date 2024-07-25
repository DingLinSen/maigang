// 会议室预约接口
import request from '@/config/axios'
// 新增会议室信息
export const addMeetingApi = (data: any): Promise<IResponse> => {
  return request.post({ url: '/oa-meeting/meeting', data })
}
// 按天查询会议室
export const getMeetingDayApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/oa-meeting/meeting/getByDay', params })
}
// 根据id查询会议室信息
export const getDetailMeetingApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/oa-meeting/meeting/getById/' + params })
}
// 修改会议室信息
export const editMeetingApi = (data: any): Promise<IResponse> => {
  return request.put({ url: '/oa-meeting/meeting', data })
}
// 删除会议室
export const delMeetingApi = (params: any): Promise<IResponse> => {
  return request.delete({ url: '/oa-meeting/meeting?ids=' + params })
}
// 按月查询会议室
export const getMeetingMonthApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/oa-meeting/meeting/getByMonth', params })
}
// 按周查询会议室
export const getMeetingWeekApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/oa-meeting/meeting/getByWeek', params })
}
