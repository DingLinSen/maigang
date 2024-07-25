import request from '@/config/axios'
import type { LineAliasData } from './types'
import { download, downloadJson } from '@/api/common'

const warnUrl = '/safetyProduction/lineNameAlias'

// 查询列表
export const getLineAliasListApi = (data: any): Promise<IResponse> => {
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
// 新增
export const saveLineAliasApi = (data: Partial<LineAliasData>): Promise<IResponse> => {
  return request.post({ url: warnUrl + '/save', data })
}

// 修改
export const editLineAliasApi = (data: Partial<LineAliasData>): Promise<IResponse> => {
  return request.put({ url: warnUrl + '/update', data })
}

// 根据id获取详情
export const getLineAliasDetApi = (params: any): Promise<IResponse<LineAliasData>> => {
  return request.get({ url: warnUrl + '/findById', params })
}

// 删除
export const delLineAliasListApi = (ids: string): Promise<IResponse> => {
  const params = { ids: ids }
  return request.delete({ url: warnUrl + '/delete', params })
}
// 导出
export const exportLineAliasApi = (data: any) => {
  return downloadJson(warnUrl + '/exportExcel', data, `线名数据管理.xlsx`)
}
// 下载模板
export const downloadTemplateApi = (data: any) => {
  return download(warnUrl + '/importTemplate', data, `线名数据管理模板.xlsx`)
}
