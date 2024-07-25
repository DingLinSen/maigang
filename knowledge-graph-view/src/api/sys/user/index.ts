import request from '@/config/axios'
import type { TableData } from './types'

// export const getOaUserInfoApi = (params: any): Promise<IResponse> => {
//   return request.get({ url: '/system/management/user/getInfo', params })
// }

export const getUserInfoApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/system/management/user/getInfo', params })
}

export const getUserListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/knowledge-mapping/management/user/getInfo', params })
}

// 管理员列表
export const getManagerListApi = (params?: any): Promise<IResponse> => {
  return request.get({ url: '/knowledge-mapping/management/user/managerList', params })
}
// 根据id获取用户信息
export const getUserInfoApiById = (): Promise<IResponse<TableData>> => {
  return request.get({ url: '/system/management/user/getInfo' })
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

export const addCheck = (data: Partial<TableData>): Promise<IResponse> => {
  return request.post({ url: '/knowledge-mapping/management/user/addCheckExists', data })
}
