// 周报接口
import request from '@/config/axios'

// 周报列表
export const getListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/oa-report/week/list', params })
}

// 发布
export const publishApi = (): any => {
  return '/oa-report/week/publish'
}

// 发布设置headersType版
export const publishHeadersTypeApi = (data: any): Promise<IResponse> => {
  return request.post({
    url: '/oa-project/index/read',
    data,
    headersType: 'multipart/form-data'
  })
}

// 周报新增
export const saveApi = (data: any): Promise<IResponse> => {
  return request.post({ url: '/oa-report/week/save', data })
}

// 周报修改
export const updateApi = (data: any): Promise<IResponse> => {
  return request.put({ url: '/oa-report/week/update', data })
}

// 周报详情
export const getByIdApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/oa-report/week/getById', params })
}

// 获取上周计划和绑定日报
export const getWeekSelectApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/oa-report/week/getLastWeekReport', params })
}

// 删除
export const deleteByIdApi = (ids: string): Promise<IResponse> => {
  return request.delete({ url: '/oa-report/week/deleteById/' + ids })
}

// 周报审批
export const getAuditApi = (data: any): Promise<IResponse> => {
  return request.post({ url: '/oa-report/week/audit', data })
}

// 月报下拉
export const getMonthSelectApi = (params?: any): Promise<IResponse> => {
  return request.get({ url: '/oa-report/week/monthSelect', params })
}

// 关联
export const getLastWeekReportApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/oa-report/week/getLastWeekReport', params })
}
