import request from '@/config/axios'
import type { PipeSpeedLimitData } from './types'
import { download, downloadJson } from '@/api/common'

const warnUrl = '/safetyProduction/speedLimitDefault'

// 查询列表
export const getPipeSpeedLimitListApi = (data: any): Promise<IResponse> => {
  const page = {
    pageNum: data.pageNum,
    pageSize: data.pageSize
  }
  return request.post({
    url: data.isImport ? '/safetyProduction/speedLimitImport/list' : warnUrl + '/list',
    data,
    params: page
  })
}
// 新增
export const savePipeSpeedLimitApi = (data: Partial<PipeSpeedLimitData>): Promise<IResponse> => {
  return request.post({ url: warnUrl, data })
}

// 修改
export const editPipeSpeedLimitApi = (data: Partial<PipeSpeedLimitData>): Promise<IResponse> => {
  return request.post({ url: warnUrl + '/update', data })
}

// 根据id获取详情
export const getPipeSpeedLimitDetApi = (id: string): Promise<IResponse<PipeSpeedLimitData>> => {
  return request.get({ url: warnUrl + '/getById/' + id })
}

// 删除
export const delPipeSpeedLimitListApi = (data: any): Promise<IResponse> => {
  const params = {
    ids: data.ids.join(',')
  }
  return request.delete({
    url: data.isImport ? '/safetyProduction/speedLimitImport/delete' : warnUrl + '/delete',
    params
  })
}
// 一键删除
export const delAllPipSpeedLimit = (createByName: string): Promise<IResponse> => {
  return request.delete({ url: warnUrl + '/deleteAll?' + 'createByName=' + createByName })
}
// 导出
export const exportPipeSpeedLimitApi = (data: any, name: string) => {
  return downloadJson(
    data.isImport ? '/safetyProduction/speedLimitImport/export' : warnUrl + '/export',
    data,
    name
  )
}
// 下载模板
export const downloadTemplateApi = (data: any) => {
  return download(warnUrl + '/downloadTemplate', data, `管内限速模板.xlsx`)
}
// 导入
export const importPipeSpeedLimitApi = (data: any) => {
  return `${warnUrl}/importData`
}
