import request from '@/config/axios'
import type { TableData } from './types'

export const getUserInfoApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/system/management/user/getInfo', params })
}

export const getUserListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/system/management/user/getInfo', params })
}
export const getUserDetailApi = (id: string): Promise<IResponse<TableData>> => {
  return request.get({ url: '/example/detail', params: { id } })
}

export const saveUserApi = (data: Partial<TableData>): Promise<IResponse> => {
  return request.post({ url: '/example/save', data })
}

export const updateUserApi = (params: any): Promise<IResponse<TableData>> => {
  return request.put({ url: '/example/detail', params })
}

export const delUserApi = (ids: string[] | number[]): Promise<IResponse> => {
  return request.delete({ url: '/example/delete', data: { ids } })
}
