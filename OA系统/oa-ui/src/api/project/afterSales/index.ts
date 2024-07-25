// 售后项目接口
import request from '@/config/axios'
import { downloadDoc, download } from '@/api/common'
import type { AfterSalesData, AfterSalesAudit, AfterSalestCount } from './types'

// 查询售后列表
export const getAfterSalesListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/oa-project/afterSales/list', params })
}
// 售后数据统计
export const countHatchAfterSalesApi = (): Promise<IResponse<AfterSalestCount>> => {
  return request.get({ url: '/oa-project/afterSales/count' })
}


// 查询售后项目详情
export const getAfterSalesApi = (params: any): Promise<IResponse<AfterSalesData>> => {
  return request.get({
    url: `/oa-project/afterSales/getById/${params.id}`,

    headersType: 'x-www-form-urlencoded'
  })
}

//转售后审核
export const auditProjectApi = (data: Partial<AfterSalesAudit>): Promise<IResponse> => {
  return request.post({ url: '/oa-project/afterSales/audit', data })
}

// 导出售后计划书
export const getExportAfterSales = (id: any) => {
  return downloadDoc(
    `/oa-project/afterSales/exportWord/${id}`,
    null,
    `售后计划书_${new Date().getTime()}.docx`
  )
}


// 售后添加项目进展-指示
export const saveProgressAfterSalesApi = (
  data: Partial<AfterSalesData>
): Promise<IResponse<AfterSalesData>> => {
  return request.post({ url: '/oa-project/afterSales/saveProgress', data })
}

// 负责人变更
export const changePrincipalPersonAfterSales = (data: any): Promise<IResponse> => {
  return request.post({
    url: '/oa-project/afterSales/changePrincipalPerson',
    data,
    headersType: 'x-www-form-urlencoded'
  })
}

//销售经理变更审批
export const changePrincipalPersonAuditApi = (
  data: any
): Promise<IResponse> => {
  return request.post({ url: '/oa-project/afterSales/changePrincipalPersonAudit', data })
}

// 负责人变更
export const changePersonAfterSales = (data: any): Promise<IResponse> => {
  return request.post({
    url: '/oa-project/afterSales/changeAfterSalesPerson',
    data,
    headersType: 'x-www-form-urlencoded'
  })
}


//项目结束申请
export const endProjectApi = (data: Partial<AfterSalesAudit>): Promise<IResponse> => {
  return request.post({ url: '/oa-project/afterSales/endApply', data })
}

//项目结束审批
export const endProjectAuditApi = (data: Partial<AfterSalesAudit>): Promise<IResponse> => {
  return request.post({ url: '/oa-project/afterSales/endAudit', data })
}

export const exportTableListApi = (data: any) => {
  return download(
    '/oa-project/afterSales/exportList',
    data,
    `售后项目_${new Date().getTime()}.xlsx`
  )
}