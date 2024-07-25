// 培育项目接口
import request from '@/config/axios'
import type { ImplementData, DeptRoleTreeData, changePrincipal } from './types'
import { downloadDoc, download } from '@/api/common'

// 查询立项列表
export const getImplementListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/oa-project/pmApproval/list', params })
}

// 导出立项表
export const getExportApproval = (id: any) => {
  return downloadDoc(
    `/oa-project/pmApproval/exportApproval/${id}`,
    null,
    `项目立项表_${new Date().getTime()}.docx`
  )
}

// // 新增培育项目
// export const saveCultivateApi = (data: Partial<CultivateData>): Promise<IResponse> => {
//   return request.post({ url: '/oa-project/pm/save', data })
// }

// 修改培育项目
export const editImplementApi = (data: Partial<ImplementData>): Promise<IResponse> => {
  return request.put({ url: '/oa-project/pmApproval/update', data })
}

// 立项变更
export const applyEndImplementApi = (data: Partial<ImplementData>): Promise<IResponse> => {
  return request.post({ url: '/oa-project/pmApproval/changeStatus', data })
}

// 查询立项项目详情
export const getImplementApi = (params: any): Promise<IResponse<ImplementData>> => {
  return request.get({
    url: '/oa-project/pmApproval/getById',
    params,
    headersType: 'x-www-form-urlencoded'
  })
}

// // 删除培育项目
// export const delCultivateListApi = (params: any): Promise<IResponse> => {
//   return request.delete({ url: '/oa-project/pm/delete', params })
// }

// 立项状态变更
export const changeStatusImplementApi = (data: Partial<ImplementData>): Promise<IResponse> => {
  return request.post({ url: '/oa-project/pmApproval/changeStatus', data })
}

// 负责人变更
export const changePrincipalPersonImplementApi = (data: any): Promise<IResponse> => {
  return request.post({
    url: '/oa-project/pmApproval/changePrincipalPerson',
    data,
    headersType: 'x-www-form-urlencoded'
  })
}

//立项负责人变更审批
export const changePrincipalPersonAuditApi = (
  data: any
): Promise<IResponse> => {
  return request.post({ url: '/oa-project/pmApproval/changePrincipalPersonAudit', data })
}

// 里程碑变更
export const changeMilestoneApi = (data: any): Promise<IResponse> => {
  return request.post({
    url: '/oa-project/pmApproval/changeMilestone',
    data,
    headersType: 'x-www-form-urlencoded'
  })
}

//里程碑变更审批
export const changeMilestoneAuditApi = (
  data: any
): Promise<IResponse> => {
  return request.post({ url: '/oa-project/pmApproval/changeMilestoneAudit', data })
}

// // 申请项目终止
// export const applyEndCultivateApi = (data: Partial<CultivateData>): Promise<IResponse> => {
//   return request.post({ url: '/oa-project/pm/applyEnd', data })
// }

// 实施申请
export const implementationApplyApi = (data: Partial<any>): Promise<IResponse> => {
  return request.post({ url: '/oa-project/pmApproval/implementationApply', data })
}

// // 审批日志列表
// export const getAuditListCultivateApi = (params: any): Promise<IResponse<CultivateData>> => {
//   return request.get({ url: '/oa-project/pm/auditList', params })
// }

// 立项添加项目进展-指示
export const saveProgressImplementApi = (
  data: Partial<ImplementData>
): Promise<IResponse<ImplementData>> => {
  return request.post({ url: '/oa-project/pmApproval/saveProgress', data })
}

// 确认里程碑
export const saveMilestoneImplementApi = (
  data: Partial<ImplementData>
): Promise<IResponse<ImplementData>> => {
  return request.post({ url: '/oa-project/pmApproval/saveMilestone', data })
}

// // 负责人变更
// export const changePrincipalPersonCultivateApi = (
//   params: any
// ): Promise<IResponse<CultivateData>> => {
//   return request.get({ url: '/oa-project/pm/changePrincipalPerson', params })
// }

// 立项数据统计
export const countHatchImplementApi = (): Promise<IResponse<ImplementData>> => {
  return request.get({ url: '/oa-project/pmApproval/countApproval' })
}

// // 导出文件
// export const exportRoleListApi = (data: any) => {
//   return download('/system/management/role/export', data, `post_${new Date().getTime()}.xlsx`)
// }
export const exportTableListApi = (data: any) => {
  return download(
    '/oa-project/pmApproval/export',
    data,
    `立项项目_${new Date().getTime()}.xlsx`
  )
}