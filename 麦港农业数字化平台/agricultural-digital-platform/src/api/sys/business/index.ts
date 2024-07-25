import request from '@/config/axios'
import type { BusinessDataData } from './types'
import { download } from '@/api/common'

const warnUrl = '/system-center/tManageBoundInfo'

// 查询列表
export const getBusinessDataListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: warnUrl + '/list', params })
}
// 新增
export const saveBusinessDataApi = (data: Partial<BusinessDataData>): Promise<IResponse> => {
  return request.post({ url: warnUrl + '/save', data })
}

// 修改
export const editBusinessDataApi = (data: Partial<BusinessDataData>): Promise<IResponse> => {
  return request.put({ url: warnUrl + '/edit', data })
}

// 根据id获取详情
export const getBusinessDataDetApi = (params: any): Promise<IResponse<BusinessDataData>> => {
  return request.get({ url: warnUrl + '/findById', params })
}

// 删除
export const delBusinessDataListApi = (ids: any): Promise<IResponse> => {
  return request.delete({ url: warnUrl + '/delete', params: { ids: ids } })
}
// 导出
export const exportBusinessDataApi = (data: any) => {
  return download(warnUrl + '/export', data, `管界数据维护.xlsx`)
}
// 下载模板
export const downloadTemplateApi = (data: any) => {
  return download(warnUrl + '/importTemplate', data, `管界数据维护模板.xlsx`)
}
