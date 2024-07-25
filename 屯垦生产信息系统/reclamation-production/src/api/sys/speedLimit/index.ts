import request from '@/config/axios'
import type { PipeSpeedLimitData } from './types'
import { download, downloadJson } from '@/api/common'

const warnUrl = '/safetyProduction/speedLimit'

// 查询列表
export const getPipeSpeedLimitListApi = (data: any): Promise<IResponse> => {
  const page = {
    pageNum: data.pageNum,
    pageSize: data.pageSize
  }
  return request.post({
    url: warnUrl + '/list',
    data,
    params: page
  })
}
// 线名下拉
export const getLineNameListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: warnUrl + '/getLineNameList', params })
}
// 行别下拉
export const getLineBussNameListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: warnUrl + '/getLineBussNameList', params })
}
// 新增
export const savePipeSpeedLimitApi = (data: Partial<PipeSpeedLimitData>): Promise<IResponse> => {
  return request.post({ url: warnUrl + '/save', data })
}

// 修改
export const editPipeSpeedLimitApi = (data: Partial<PipeSpeedLimitData>): Promise<IResponse> => {
  return request.put({ url: warnUrl + '/update', data })
}

// 根据id获取详情
export const getPipeSpeedLimitDetApi = (params: any): Promise<IResponse<PipeSpeedLimitData>> => {
  return request.get({ url: warnUrl + '/findById', params })
}

// 删除
export const delPipeSpeedLimitListApi = (ids: string): Promise<IResponse> => {
  const params = { ids: ids }
  return request.delete({ url: warnUrl + '/delete', params })
}
// 导出
export const exportPipeSpeedLimitApi = (data: any) => {
  return downloadJson(warnUrl + '/exportExcel', data, `管内限速数据维护.xlsx`)
}
// 下载模板
export const downloadTemplateApi = (data: any) => {
  return download(warnUrl + '/importTemplate', data, `管内限速数据维护模板.xlsx`)
}
