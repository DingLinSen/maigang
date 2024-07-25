import request from '@/config/axios'
import type { MaintenanceTimeData } from './types'
import { download, downloadGet } from '@/api/common'

const warnUrl = '/safetyProduction/planManage/repairSkylight'

// 查询列表
export const getMaintenanceTimeListApi = (data: any): Promise<IResponse> => {
  const page = {
    pageNum: data.pageNum,
    pageSize: data.pageSize
  }
  return request.post({ url: warnUrl + '/list', data, params: page })
}
// 线名下拉
export const getLineTypeListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: warnUrl + '/getLineDistinctionList', params })
}

// 行别下拉
export const getRowTypeListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: warnUrl + '/getLineTypeList', params })
}
// 新增
export const saveMaintenanceTimeApi = (data: Partial<MaintenanceTimeData>): Promise<IResponse> => {
  return request.post({ url: warnUrl, data })
}

// 修改
export const editMaintenanceTimeApi = (data: Partial<MaintenanceTimeData>): Promise<IResponse> => {
  return request.put({ url: warnUrl, data })
}

// 根据调度通知id获取调度通知信息
export const getMaintenanceTimeDetApi = (id: string): Promise<IResponse<MaintenanceTimeData>> => {
  return request.get({ url: warnUrl + '/findById/' + id })
}

// 删除
export const delMaintenanceTimeListApi = (ids: string): Promise<IResponse> => {
  return request.delete({ url: warnUrl + '/' + ids })
}
// 导出
export const exportMaintenanceTimeApi = (data: any) => {
  return download(warnUrl + '/export', data, `维修天窗_${new Date().getTime()}.xlsx`)
}
// 下载模板
export const downloadTemplateApi = (data: any) => {
  return downloadGet(warnUrl + '/downloadTemplate', data, `维修天窗_${new Date().getTime()}.xlsx`)
}
// 导入
export const importMaintenanceTimeApi = (data: any) => {
  return `${warnUrl}/importData`
}
