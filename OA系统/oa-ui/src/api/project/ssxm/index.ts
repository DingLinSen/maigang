// 实施项目接口
import request from '@/config/axios'
import type { ImplementData, ImplementCount, ImplementAudit, AfterSalesApply } from './types'
import { downloadDoc, download } from '@/api/common'

// 查询实施列表
export const getImplementListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/oa-project/pmImplementation/list', params })
}

// 实施数据统计
export const countHatchImplementApi = (): Promise<IResponse<ImplementCount>> => {
  return request.get({ url: '/oa-project/pmImplementation/count' })
}

// 实施添加项目进展-指示
export const saveProgressEstablishApi = (
  data: Partial<ImplementData>
): Promise<IResponse<ImplementData>> => {
  return request.post({ url: '/oa-project/pmImplementation/saveProgress', data })
}

// 导出实施表
export const getExportImplementation = (id: any) => {
  return downloadDoc(
    `/oa-project/pmImplementation/export/${id}`,
    null,
    `项目实施表_${new Date().getTime()}.docx`
  )
}

// 查询实施项目详情
export const getEstablishApi = (params: any): Promise<IResponse<ImplementData>> => {
  return request.get({
    url: `/oa-project/pmImplementation/getById/${params.id}`,

    headersType: 'x-www-form-urlencoded'
  })
}

//项目验收
export const acceptanceProjectApi = (data: Partial<ImplementData>): Promise<IResponse> => {
  return request.post({ url: '/oa-project/pmImplementation/accept', data })
}

//转实施审核
export const auditProjectApi = (data: Partial<ImplementData>): Promise<IResponse> => {
  return request.post({ url: '/oa-project/pmImplementation/audit', data })
}

// 项目变更申请
export const changeApplyApi = (data: Partial<ImplementAudit>): Promise<IResponse> => {
  return request.post({ url: '/oa-project/pmImplementation/changeApply', data })
}
// 项目变更审批
export const changeAuditApi = (data: Partial<any>): Promise<IResponse> => {
  return request.post({ url: '/oa-project/pmImplementation/changeAudit', data })
}

// 售后申请
export const afterSalesApplyApi = (data: Partial<AfterSalesApply>): Promise<IResponse> => {
  return request.post({ url: '/oa-project/pmImplementation/afterSalesApply', data })
}

export const exportTableListApi = (data: any) => {
  return download(
    '/oa-project/pmImplementation/exportList',
    data,
    `实施项目_${new Date().getTime()}.xlsx`
  )
}