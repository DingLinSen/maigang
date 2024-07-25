import request from '@/config/axios'
import type { SsoManageType, accessType } from './types'

export const applicationList = (params: any): Promise<IResponse> => {
  return request.get({ url: '/app/list', params })
}
export const deleteList = (data: string): Promise<IResponse> => {
  return request.post({ url: '/app/delete', data })
}
export const getDataById = (id: string): Promise<IResponse<SsoManageType>> => {
  return request.get({ url: '/app/' + id })
}
export const getDataUpdate = (data: Partial<SsoManageType>): Promise<IResponse> => {
  console.log('data', data)
  return request.post({ url: '/app/update', data })
}
export const getDataAdd = (data: Partial<SsoManageType>): Promise<IResponse> => {
  console.log('data', data)
  return request.post({ url: '/app/add', data })
}
//访问关系页面
export const applicationAccessList = (params: any): Promise<IResponse> => {
  return request.get({ url: '/app_access_relation/list', params })
}
export const getAccessDataById = (id: string): Promise<IResponse<accessType>> => {
  return request.get({ url: '/app_access_relation/' + id })
}
export const getAccessDataUpdate = (data: Partial<accessType>): Promise<IResponse> => {
  return request.post({ url: '/app_access_relation/update', data })
}
export const getaccessDataAdd = (data: Partial<accessType>): Promise<IResponse> => {
  return request.post({ url: '/app_access_relation/add', data })
}
export const deleteAccessList = (data: string): Promise<IResponse> => {
  return request.post({ url: '/app_access_relation/delete', data })
}
export const getRoleData = (data: any): Promise<IResponse> => {
  return request.get({ url: '/app_access_relation/roles', data })
}
