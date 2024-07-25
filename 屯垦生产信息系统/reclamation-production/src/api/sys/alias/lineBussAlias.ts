import request from '@/config/axios'
import type { LineBussAliasData } from './types'
import { download, downloadJson } from '@/api/common'

const warnUrl = '/safetyProduction/lineBussNameAlias'

// 查询列表
export const getLineBussAliasListApi = (data: any): Promise<IResponse> => {
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
export const saveLineBussAliasApi = (data: Partial<LineBussAliasData>): Promise<IResponse> => {
  return request.post({ url: warnUrl + '/save', data })
}

// 修改
export const editLineBussAliasApi = (data: Partial<LineBussAliasData>): Promise<IResponse> => {
  return request.put({ url: warnUrl + '/update', data })
}

// 根据id获取详情
export const getLineBussAliasDetApi = (params: any): Promise<IResponse<LineBussAliasData>> => {
  return request.get({ url: warnUrl + '/findById', params })
}

// 删除
export const delLineBussAliasListApi = (ids: string): Promise<IResponse> => {
  const params = { ids: ids }
  return request.delete({ url: warnUrl + '/delete', params })
}
// 导出
export const exportLineBussAliasApi = (data: any) => {
  return downloadJson(warnUrl + '/exportExcel', data, `行别数据管理.xlsx`)
}
// 下载模板
export const downloadTemplateApi = (data: any) => {
  return download(warnUrl + '/importTemplate', data, `行别数据管理模板.xlsx`)
}
