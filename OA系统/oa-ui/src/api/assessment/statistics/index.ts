// 售后项目接口
import request from '@/config/axios'
import { downloadDoc } from '@/api/common'

// 首页统计
export const getIndexCountApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/oa-workflow/attendance/indexCount', params })
}

// 查询考勤设置
export const getConfigApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/oa-workflow/attendance/getConfig', params })
}

// 查询考勤管理首页
export const getIndexListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/oa-workflow/attendance/indexList', params })
}

//新增或修改考勤设置
export const auditProjectApi = (data: any): Promise<IResponse> => {
  return request.post({ url: '/oa-workflow/attendance/configAdd', data })
}

// 详情统计
export const getDetailsApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/oa-workflow/attendance/details', params })
}

// 考勤详情统计
export const getDetailsListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/oa-workflow/attendance/detailsList', params })
}

// 根据用户查询所有考勤以及异常信息
export const getAllAttApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/oa-workflow/attendance/getAllAtt', params })
}

//首页导出
export const getIndexExport = (data: any) => {
  return downloadDoc('/oa-workflow/attendance/indexExport', data, `考勤列表.xlsx`)
}

//  部门考勤导出
export const getDetailsDeptExport = (data: any) => {
  return downloadDoc('/oa-workflow/attendance/detailsDeptExport', data, `部门考勤列表.xlsx`)
}

// 工单查询
export const getOrder = (params: any) => {
  return request.get({ url: '/oa-workflow/attendance/getOrder', params })
}

// 详情导出
export const getDetailsExport = (data: any) => {
  return downloadDoc('/oa-workflow/attendance/detailsExport', data, `考勤详情列表.xlsx`)
}
