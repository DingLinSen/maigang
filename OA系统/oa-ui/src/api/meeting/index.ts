import request from '@/config/axios'
import type { MeetingData } from './types'

// 获取分页会议预约信息
export const getMeetingListApi = (params: any): Promise<IResponse> => {
    return request.get({ url: '/oa-meeting/meeting/getByList', params })
}

// 新增会议预约信息
export const saveMeetingApi = (data: Partial<MeetingData>): Promise<IResponse> => {
    return request.post({ url: '/oa-meeting/meeting', data })
}

// 修改会议预约信息
export const editMeetingApi = (data: Partial<MeetingData>): Promise<IResponse> => {
    return request.put({ url: '/oa-meeting/meeting', data })
}

// 查询会议预约信息详细
export const getMeetingDetApi = (id: string): Promise<IResponse<MeetingData>> => {
    return request.get({ url: '/oa-meeting/meeting/getById/' + id })
}

// 删除会议预约信息
export const delMeetingListApi = (params: any): Promise<IResponse> => {
    return request.delete({ url: '/oa-meeting/meeting?ids=' + params.id })
}

// 按天查询会议室
export const getMeetingListByDayApi = (params: any): Promise<IResponse> => {
    return request.get({ url: '/oa-meeting/meeting/getByDay', params })
}

// 按周查询会议室
export const getMeetingListByWeekApi = (params: any): Promise<IResponse> => {
    return request.get({ url: '/oa-meeting/meeting/getByWeek', params })
}

// 按月查询会议室
export const getMeetingListByMonthApi = (params: any): Promise<IResponse> => {
    return request.get({ url: '/oa-meeting/meeting/getByMonth', params })
}