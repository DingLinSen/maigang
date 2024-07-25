import request from '@/config/axios'
import type { OperationPlanData } from './types'
import { download } from '@/api/common'

const warnUrl = '/safetyProduction/planManage/runPlan'

// 查询列表
export const getOperationPlanListApi = (data: any): Promise<IResponse> => {
  const page = {
    pageNum: data.pageNum,
    pageSize: data.pageSize
  }
  return request.post({ url: warnUrl + '/list', data, params: page })
}

// 申请类型信息下拉
export const getApplyTypeListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: warnUrl + '/getRequestTrainInformationList', params })
}

// 类型下拉
export const getTypeListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: warnUrl + '/getTypeList', params })
}

// 新增
export const saveOperationPlanApi = (data: Partial<OperationPlanData>): Promise<IResponse> => {
  return request.post({ url: warnUrl, data })
}

// 修改
export const editOperationPlanApi = (data: Partial<OperationPlanData>): Promise<IResponse> => {
  return request.put({ url: warnUrl, data })
}

// 根据调度通知id获取调度通知信息
export const getOperationPlanDetApi = (id: string): Promise<IResponse<OperationPlanData>> => {
  return request.get({ url: warnUrl + '/findById/' + id })
}

// 删除
export const delOperationPlanListApi = (ids: string): Promise<IResponse> => {
  return request.delete({ url: warnUrl + '/' + ids })
}
// 导出
export const exportOperationPlanListApi = (data: any) => {
  return download(warnUrl + '/export', data, `运行计划_${new Date().getTime()}.xlsx`)
}
// 下载模板
export const downloadTemplateApi = (data: any) => {
  return download(warnUrl + '/downloadTemplate', data, `运行计划_${new Date().getTime()}.xlsx`)
}
