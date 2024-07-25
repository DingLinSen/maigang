import request from '@/config/axios'
import type { ConstructionMonthPlanData } from './types'
import { download, downloadJson } from '@/api/common'

const warnUrl = '/safetyProduction/buildPlanMonth'

// 查询列表
export const getConstructionMonthPlanListApi = (data: any): Promise<IResponse> => {
  const page = {
    pageNum: data.pageNum,
    pageSize: data.pageSize
  }
  return request.post({
    url: data.isImport ? '/safetyProduction/buildPlanMonthImport/list' : warnUrl + '/list',
    data,
    params: page
  })
}
// 线名下拉
export const getLineTypeListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: warnUrl + '/lineTypeOption', params })
}

// 行别下拉
export const getRowTypeListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: warnUrl + '/rowTypeOption', params })
}
// 新增
export const saveConstructionMonthPlanApi = (
  data: Partial<ConstructionMonthPlanData>
): Promise<IResponse> => {
  return request.post({ url: warnUrl + '/save', data })
}

// 修改
export const editConstructionMonthPlanApi = (
  data: Partial<ConstructionMonthPlanData>
): Promise<IResponse> => {
  return request.post({ url: warnUrl + '/update', data })
}

// 根据id获取详情
export const getConstructionMonthPlanDetApi = (
  id: string
): Promise<IResponse<ConstructionMonthPlanData>> => {
  return request.get({ url: warnUrl + '/getById/' + id })
}

// 删除
export const delConstructionMonthPlanListApi = (data: any): Promise<IResponse> => {
  const params = {
    ids: data.ids.join(',')
  }
  return request.delete({
    url: data.isImport ? '/safetyProduction/buildPlanMonthImport/delete' : warnUrl + '/delete',
    params
  })
}
// 导出
export const exportConstructionMonthPlanApi = (data: any, name: string) => {
  return downloadJson(
    data.isImport ? '/safetyProduction/buildPlanMonthImport/export' : warnUrl + '/export',
    data,
    name
  )
}
// 下载模板
export const downloadTemplateApi = (data: any) => {
  return download(warnUrl + '/downloadTemplate', data, `施工月计划模板.xlsx`)
}
// 导入
export const importConstructionMonthPlanApi = (data: any) => {
  return `${warnUrl}/importData`
}
