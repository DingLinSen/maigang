import request from '@/config/axios'
import type { ConstructionPlanData } from './types'
import { download, downloadJson } from '@/api/common'

const warnUrl = '/safetyProduction/buildPlan'

// 查询列表
export const getConstructionPlanListApi = (data: any): Promise<IResponse> => {
  const page = {
    pageNum: data.pageNum,
    pageSize: data.pageSize
  }
  return request.post({
    url: data.isImport ? '/safetyProduction/buildPlanImport/list' : warnUrl + '/list',
    data,
    params: page
  })
}
// 查询列表-数据原件
export const getFileBulidPlanListApi = (data: any): Promise<IResponse> => {
  const page = {
    pageNum: data.pageNum,
    pageSize: data.pageSize
  }
  return request.post({ url: '/safetyProduction/buildPlanImport/list', data, params: page })
}
// 线名下拉
export const getLineTypeListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: warnUrl + '/lineTypeOption', params })
}

// 行别下拉
export const getRowTypeListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: warnUrl + '/rowTypeOption', params })
}
// 上移下移
export const moveSortApi = (params: Partial<ConstructionPlanData>): Promise<IResponse> => {
  return request.post({
    url: params.isImport ? '/safetyProduction/buildPlanImport/moveSort' : warnUrl + '/moveSort',
    params
  })
}
// 新增
export const saveConstructionPlanApi = (
  data: Partial<ConstructionPlanData>
): Promise<IResponse> => {
  return request.post({ url: warnUrl + '/save', data })
}

// 修改
export const editConstructionPlanApi = (
  data: Partial<ConstructionPlanData>
): Promise<IResponse> => {
  return request.post({ url: warnUrl + '/update', data })
}

// 根据id获取详情
export const getConstructionPlanDetApi = (id: string): Promise<IResponse<ConstructionPlanData>> => {
  return request.get({ url: warnUrl + '/getById/' + id })
}

// 删除
export const delConstructionPlanListApi = (data: any): Promise<IResponse> => {
  return request.delete({
    url: data.isImport
      ? '/safetyProduction/buildPlanImport/remove/' + data.ids
      : warnUrl + '/remove/' + data.ids
  })
}
// 导出
export const exportConstructionPlanApi = (data: any, name: string) => {
  return downloadJson(
    data.type === 4 ? '/safetyProduction/buildPlanImport/export' : warnUrl + '/export',
    data,
    name
  )
}
// 下载模板
export const downloadTemplateApi = (data: any) => {
  return download(warnUrl + '/downloadTemplate', data, `施工日计划模板.xlsx`)
}
// 导入
export const importConstructionPlanApi = (data: any) => {
  return `${warnUrl}/importData`
}
