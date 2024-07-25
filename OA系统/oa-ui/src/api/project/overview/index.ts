import request from '@/config/axios'
// import type { ImplementData, ImplementCount, ImplementAudit, AfterSalesApply } from './types'

// 项目数量统计
export const countApi = (): any => {
  return request.get({ url: '/oa-project/index/count' })
}

// 下侧四卡片
export const topApi = (params: any): any => {
  return request.get({ url: '/oa-project/index/top', params })
}

// 代办列表
export const getBacklogListApi = (params: any): any => {
  return request.get({ url: '/oa-project/index/backlogList', params })
}

// 消息列表
export const getNoticeListApi = (params: any): any => {
  return request.get({ url: '/oa-project/index/noticeList', params })
}

// 文件列表
export const filesApi = (params: any): any => {
  return request.get({ url: '/oa-project/index/files', params })
}

// 项目统计列表
export const getProjectListApi = (params: any): any => {
  return request.get({ url: '/oa-project/index/list', params })
}

// 预警列表
export const getProjectWarnListApi = (params: any): any => {
  return request.get({ url: '/oa-project/index/warnList', params })
}

// 代办已读
export const backlogReadApi = (data: any): Promise<IResponse> => {
  return request.post({ url: '/oa-project/index/backlogRead', data })
}

// 消息已读
export const readApi = (data: any): Promise<IResponse> => {
  return request.post({
    url: '/oa-project/index/read',
    data,
    headersType: 'multipart/form-data'
  })
}

// 消息已读
export const allReadApi = (data: any): Promise<IResponse> => {
  return request.post({ url: '/oa-project/index/readAll', data })
}

// 首页消息已读
export const messageReadApi = (data: any): Promise<IResponse> => {
  return request.post({ url: '/message-center/management/message/read', data })
}
