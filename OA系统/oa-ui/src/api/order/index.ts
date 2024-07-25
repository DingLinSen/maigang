import request from '@/config/axios'
import type { WorkOrder } from './types'
import { downloadDoc } from '@/api/common'

//工单申请
export const applyOrderApi = (data: Partial<WorkOrder>): Promise<IResponse> => {
  return request.post({ url: '/oa-workflow/workorder/apply', data })
}
//工单编辑
export const editOrderApi = (data: Partial<WorkOrder>): Promise<IResponse> => {
  return request.put({ url: '/oa-workflow/workorder/edit', data })
}

//工单审批
export const auditOrderApi = (data: any): Promise<IResponse> => {
  return request.post({ url: '/oa-workflow/workorder/audit', data })
}
//工单审批列表
export const getOrderAuditListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/oa-workflow/workorder/auditList', params })
}
//我的工单
export const getMyOrderListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/oa-workflow/workorder/orderList', params })
}
//采购
export const buyApi = (params: any): Promise<IResponse> => {
  return request.post({ url: '/oa-workflow/workorder/buy', params })
}
//工单删除
export const delOrderListApi = (ids: string): Promise<IResponse> => {
  return request.delete({ url: '/oa-workflow/workorder/del?id=' + ids })
}
//归档
export const archiveOrderApi = (data: any): Promise<IResponse> => {
  return request.post({ url: '/oa-workflow/workorder/end', data })
}
//工单详情
export const getOrderDetailApi = (id: string): Promise<IResponse> => {
  return request.get({ url: '/oa-workflow/workorder/getById/' + id })
}
//获取常用
export const getUsages = (): Promise<IResponse> => {
  return request.get({ url: '/oa-workflow/workorder/getUsages' })
}
//领用-外借
export const lendApi = (params: any): Promise<IResponse> => {
  return request.post({ url: '/oa-workflow/workorder/lend', params })
}
//工单发布
export const publishApi = (params: any): Promise<IResponse> => {
  return request.post({ url: '/oa-workflow/workorder/publish', params })
}
//人事驳回编辑重新发起
export const reSubmitApi = (data: any): Promise<IResponse> => {
  return request.post({ url: '/oa-workflow/workorder/reSubmit', data })
}
//设置常用
export const setUsagesApi = (params: any): Promise<IResponse> => {
  return request.post({
    url: '/oa-workflow/workorder/setUsages',
    params
  })
}
//工单撤回
export const withdrawApplyApi = (params: any): Promise<IResponse> => {
  return request.post({ url: '/oa-workflow/workorder/unPublish', params })
}
//导出
export const exportApplyListApi = (data: any, fileName: string) => {
  return downloadDoc(
    '/oa-workflow/workorder/auditExport',
    data,
    fileName + `_${new Date().getTime()}.xlsx`
  )
}
//获取剩余年假和调休
export const getHolidayDurationApi = (): Promise<IResponse> => {
  return request.get({ url: '/oa-workflow/workorder/getResidueLeave' })
}

// 工单管理列表
export const getMyOrderAlltApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/oa-workflow/workorder/orderAll', params })
}

//工单详情
export const getOvertimeRecordApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/oa-workflow/workorder/overtimeSubList/' + params.orderId + '/' + params.userId, params })
}

// 加班结算列表
export const getSettlementListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/oa-workflow/list', params })
}

//加班结算申请
export const applySettlementApi = (params: any): Promise<IResponse> => {
  return request.post({ url: '/oa-workflow/settlementApply', params })
}

//加班批量申请
export const applySettlementBatchApi = (params: any): Promise<IResponse> => {
  return request.post({ url: '/oa-workflow/settlementApplys', params })
}

//撤回加班结算
export const withdrawSettlementApplyApi = (params: any): Promise<IResponse> => {
  return request.post({ url: '/oa-workflow/settlementApplyCancel', params })
}

//加班结算审批
export const auditSettlementOrderApi = (params: any): Promise<IResponse> => {
  return request.post({ url: '/oa-workflow/audit', params })
}

//加班结算审批
export const auditSettlementBatchApi = (params: any): Promise<IResponse> => {
  return request.post({ url: '/oa-workflow/audits', params })
}

//导出
export const exportSettlementListApi = (data: any) => {
  return downloadDoc(
    '/oa-workflow/export',
    data,
    '加班结算' + `_${new Date().getTime()}.xlsx`
  )
}

// 加班批量申请时长统计
export const getSettlementHoursApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/oa-workflow/countHours', params })
}