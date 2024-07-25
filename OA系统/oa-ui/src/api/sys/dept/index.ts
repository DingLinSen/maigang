import request from '@/config/axios'
import type { TableData } from './types'
// 获取列表数据
export const getTableListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/system/management/dept/list', params })
}
// 获取部门列表 无数据权限
export const getAllDeptListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/system/management/dept/deptSelect', params })
}
// 保存数据
export const saveTableApi = (data: Partial<TableData>): Promise<IResponse> => {
  return request.post({ url: '/system/management/dept', data })
}
// 修改数据
export const updateTableApi = (data: Partial<TableData>): Promise<IResponse> => {
  return request.put({ url: '/system/management/dept', data })
}
// 根据ID获取数据
export const getTableDetApi = (id: string): Promise<IResponse<TableData>> => {
  return request.get({ url: `/system/management/dept/${id}` })
}
// 删除列表数据
export const delTableListApi = (ids: string | number): Promise<IResponse> => {
  return request.delete({ url: `/system/management/dept/${ids}`, data: { ids } })
}
