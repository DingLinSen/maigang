import request from '@/config/axios'
import type { NoticeData } from './types'

// 查询公告列表
export const getNoticeListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/system-center/management/notice/list', params })
}

// 新增公告
export const saveNoticeApi = (data: Partial<NoticeData>): Promise<IResponse> => {
  return request.post({ url: '/system-center/management/notice', data })
}

// 修改公告
export const editNoticeApi = (data: Partial<NoticeData>): Promise<IResponse> => {
  return request.put({ url: '/system-center/management/notice', data })
}

// 查询公告详细
export const getNoticeDetApi = (id: string): Promise<IResponse<NoticeData>> => {
  return request.get({ url: '/system-center/management/notice/' + id })
}

// 删除公告
export const delNoticeListApi = (ids: string): Promise<IResponse> => {
  return request.delete({ url: '/system-center/management/notice/' + ids })
}
