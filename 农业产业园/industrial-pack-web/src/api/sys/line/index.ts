import request from '@/config/axios'
import type { LineDataData } from './types'
import { download } from '@/api/common'

const warnUrl = '/system-center/management/lineInfo'

// 查询列表
export const getLineDataListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: warnUrl + '/list', params })
}
// 线名下拉
export const getLineNameListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: warnUrl + '/ineNameList', params })
}
// 新增
export const saveLineDataApi = (data: Partial<LineDataData>): Promise<IResponse> => {
  return request.post({ url: warnUrl, data })
}

// 修改
export const editLineDataApi = (data: Partial<LineDataData>): Promise<IResponse> => {
  return request.put({ url: warnUrl + '/update', data })
}

// 根据id获取详情
export const getLineDataDetApi = (data: any): Promise<IResponse<LineDataData>> => {
  return request.get({ url: warnUrl + '/' + data.lineId })
}

// 删除
export const delLineDataListApi = (ids: string): Promise<IResponse> => {
  return request.delete({ url: warnUrl + '/' + ids })
}
// 导出
export const exportLineDataApi = (data: any) => {
  return download(warnUrl + '/export', data, `线路数据维护.xlsx`)
}
// 下载模板
export const downloadTemplateApi = (data: any) => {
  return download(warnUrl + '/importTemplate', data, `线路数据维护模板.xlsx`)
}
