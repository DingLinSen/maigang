// 月报接口
import request from '@/config/axios'

// 月报列表
export const getListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/oa-report/month/list', params })
}

// 发布
export const publishApi = (): any => {
  return '/oa-report/month/publish'
}

// 月报新增
export const saveApi = (data: any): Promise<IResponse> => {
  return request.post({ url: '/oa-report/month/save', data })
}

// 月报修改
export const updateApi = (data: any): Promise<IResponse> => {
  return request.put({ url: '/oa-report/month/update', data })
}

//月报详情
export const getByIdApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/oa-report/month/getById', params })
}

// 根据月份查询周报
export const getWeekSelectApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/oa-report/month/getWeekReportByMonth', params })
}

// 删除
export const deleteByIdApi = (ids: string): Promise<IResponse> => {
  return request.delete({ url: '/oa-report/month/deleteById/' + ids })
}

// 月报审批
export const getAuditApi = (data: any): Promise<IResponse> => {
  return request.post({ url: '/oa-report/month/audit', data })
}

// 考核类型下拉
export const getAssTypeSelectApi = (): Promise<IResponse> => {
  return request.get({ url: '/oa-report/month/assTypeSelect' })
}

// 审批列表
export const getAuditListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/oa-report/month/auditList', params })
}
