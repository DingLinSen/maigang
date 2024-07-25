// 科研项目接口
import request from '@/config/axios'
import type { ScientificData, ScientifictCount, ScientificAudit } from './types'
import { download } from '@/api/common'

// 查询科研列表
export const getScientificListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/oa-project/scientificResearch/list', params })
}
// 科研数据统计
export const countHatchScientificApi = (): Promise<IResponse<ScientifictCount>> => {
  return request.get({ url: '/oa-project/scientificResearch/count' })
}
// 新增科研项目
export const saveScientificApi = (data: Partial<ScientificData>): Promise<IResponse> => {
  return request.post({ url: '/oa-project/scientificResearch/save', data })
}
// 修改科研项目
export const editScientificApi = (data: Partial<ScientificData>): Promise<IResponse> => {
  return request.put({ url: '/oa-project/scientificResearch/edit', data })
}
// 删除科研项目
export const delScientificListApi = (params: any): Promise<IResponse> => {
  return request.delete({ url: '/oa-project/scientificResearch/delete', params })
}
// 查询科研项目详情
export const getScientificApi = (params: any): Promise<IResponse<ScientificData>> => {
  return request.get({
    url: `/oa-project/scientificResearch/getById/${params.id}`,

    headersType: 'x-www-form-urlencoded'
  })
}
//科研审批
export const auditProjectApi = (data: Partial<ScientificAudit>): Promise<IResponse> => {
  return request.post({ url: '/oa-project/scientificResearch/audit', data })
}
// 科研添加项目进展-指示
export const saveProgressScientificApi = (
  data: Partial<ScientificData>
): Promise<IResponse<ScientificData>> => {
  return request.post({ url: '/oa-project/scientificResearch/saveProgress', data })
}
// 负责人变更审批
export const auditChangePrincipalApi = (data: any): Promise<IResponse> => {
  return request.post({ url: '/oa-project/scientificResearch/changePrincipalPersonAudit', data })
}
//负责人变更
export const changePersonScientific = (data: any): Promise<IResponse> => {
  return request.post({
    url: '/oa-project/scientificResearch/changePrincipalPerson',
    data,
    headersType: 'x-www-form-urlencoded'
  })
}
//结题申请
export const endProjectApi = (data: any): Promise<IResponse> => {
  return request.post({ url: '/oa-project/scientificResearch/conclusionApply', data })
}
//结题申请审批
export const endProjectAuditApi = (data: any): Promise<IResponse> => {
  return request.post({ url: '/oa-project/scientificResearch/conclusionAudit', data })
}
//状态变更
export const changeStatusScientificApi = (data: any): Promise<IResponse> => {
  return request.post({ url: '/oa-project/scientificResearch/changeStatus', data })
}
//状态变更审批
export const changeStatusAuditApi = (data: any): Promise<IResponse> => {
  return request.post({ url: '/oa-project/scientificResearch/changeStatusAudit', data })
}
//导出列表
export const exportTableListApi = (data: any) => {
  return download(
    '/oa-project/scientificResearch/exportList',
    data,
    `自研项目_${new Date().getTime()}.xlsx`
  )
}