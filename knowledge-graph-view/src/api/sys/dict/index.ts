import request from '@/config/axios'
import type { TableData } from './types'
// 获取列表数据
export const getTableListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/knowledge-mapping/management/notice/list', params })
}
// 保存数据
export const saveTableApi = (data: Partial<TableData>): Promise<IResponse> => {
  return request.post({ url: '/knowledge-mapping/management/dict/type', data })
}
// 修改数据
export const updateTableApi = (data: Partial<TableData>): Promise<IResponse> => {
  return request.put({ url: '/knowledge-mapping/management/dict/type', data })
}
// 根据ID获取数据
export const getTableDetApi = (id: string): Promise<IResponse<TableData>> => {
  return request.get({ url: '/knowledge-mapping/management/dict/type', params: { id } })
}
// 删除列表数据
export const delTableListApi = (ids: string[] | number[]): Promise<IResponse> => {
  return request.post({ url: '/example/delete', data: { ids } })
}
