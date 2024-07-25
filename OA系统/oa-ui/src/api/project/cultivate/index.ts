// 培育项目接口
import request from '@/config/axios'
import type { CultivateData, DeptRoleTreeData } from './types'
import { download } from '@/api/common'

// 查询培育项目列表
export const getCultivateListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/oa-project/pm/list', params })
}

// 新增培育项目
export const saveCultivateApi = (data: Partial<CultivateData>): Promise<IResponse> => {
  return request.post({ url: '/oa-project/pm/save', data })
}
// 重新发起申请
export const resetSaveCultivateApi = (data: Partial<CultivateData>): Promise<IResponse> => {
  return request.post({ url: '/oa-project/pm/restartWorkflow', data })
}

// 修改培育项目
export const editCultivateApi = (
  restartWorkflow: any,
  data: Partial<CultivateData>
): Promise<IResponse> => {
  return request.post({ url: `/oa-project/pm/update?restartWorkflow=${restartWorkflow}`, data })
}

// 查询培育项目详情
export const getCultivateApi = (params: any): Promise<IResponse<CultivateData>> => {
  return request.get({
    url: '/oa-project/pm/getById',
    params,
    headersType: 'x-www-form-urlencoded'
  })
}

// 删除培育项目
export const delCultivateListApi = (params: any): Promise<IResponse> => {
  return request.delete({ url: '/oa-project/pm/delete', params })
}

// 添加审批记录
export const addAuditCultivateApi = (data: Partial<CultivateData>): Promise<IResponse> => {
  return request.post({ url: '/oa-project/pm/save', data })
}

// 申请项目终止
export const applyEndCultivateApi = (data: Partial<any>): Promise<any> => {
  return request.post({ url: '/oa-project/pm/applyEnd', data })
}

// 立项申请
export const approvalApplyCultivateApi = (data: Partial<any>): Promise<IResponse> => {
  return request.post({ url: '/oa-project/pm/approvalApply', data })
}

// 审批日志列表
export const getAuditListCultivateApi = (params: any): Promise<IResponse<CultivateData>> => {
  return request.get({ url: '/oa-project/pm/auditList', params })
}

// 培育添加项目进展-指示
export const saveProgressCultivateApi = (data: any): Promise<IResponse<CultivateData>> => {
  return request.post({ url: '/oa-project/pm/saveProgress', data })
}

// 负责人变更
export const changePrincipalPersonCultivateApi = (
  params: any
): Promise<IResponse<CultivateData>> => {
  return request.get({ url: '/oa-project/pm/changePrincipalPerson', params })
}

//负责人变更审批
export const changePrincipalPersonAuditApi = (
  data: any
): Promise<IResponse> => {
  return request.post({ url: '/oa-project/pm/changePrincipalPersonAudit', data })
}

// 培育数据统计
export const countHatchCultivateApi = (): Promise<IResponse<CultivateData>> => {
  return request.get({ url: '/oa-project/pm/countHatch' })
}

// 导出文件
export const exportRoleListApi = (data: any) => {
  return download('/system/management/role/export', data, `post_${new Date().getTime()}.xlsx`)
}

export const exportTableListApi = (data: any) => {
  return download(
    '/oa-project/pm/export',
    data,
    `培育项目_${new Date().getTime()}.xlsx`
  )
}