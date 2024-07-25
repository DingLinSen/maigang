import request from '@/config/axios'
import type { infoTypeSettingData } from './types'
import { download, downloadJson } from '@/api/common'
const warnUrl = '/safetyProduction/infoTypeSetting'
export const getInfoTypeSettingApi = (data: any): Promise<IResponse> => {
  const page = {
    pageNum: data.pageNum,
    pageSize: data.pageSize
  }
  return request.post({ url: warnUrl + '/list', data, params: page })
}
// 新增
export const saveBridgeInfoApi = (data: Partial<infoTypeSettingData>): Promise<IResponse> => {
  return request.post({ url: warnUrl + '', data })
}

// 修改
export const editBridgeInfoApi = (data: Partial<infoTypeSettingData>): Promise<IResponse> => {
  return request.post({ url: warnUrl + '/update', data })
}

// 根据id获取详情
export const getBridgeInfoDetApi = (id: string): Promise<IResponse<infoTypeSettingData>> => {
  return request.get({ url: warnUrl + '/getById/' + id })
}
// 查询所有
export const getInfoTypeAllApi = (params: any): Promise<IResponse<infoTypeSettingData>> => {
  return request.post({ url: warnUrl + '/listAll', params })
}
// 删除
export const delBridgeInfoListApi = (ids: string): Promise<IResponse> => {
  return request.delete({ url: warnUrl + '/delete?ids=' + ids })
}
// 导出
export const exportBridgeInfoApi = (data: any) => {
  return downloadJson(warnUrl + '/export', data, `信息类型数据设置.xlsx`)
}
// 下载模板
export const downloadTemplateApi = (data: any) => {
  return download(warnUrl + '/downloadTemplate', data, `桥梁信息维护模板.xlsx`)
}
// 导入
export const importBridgeInfoApi = (data: any) => {
  return `${warnUrl}/importData`
}
