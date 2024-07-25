import request from '@/config/axios'
import type { MenuData, MenuTreeData, MenuRoleTreeData } from './types'

export const getMenuListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/system/management/menu/list', params })
}

export const saveMenuApi = (data: Partial<MenuData>): Promise<IResponse> => {
  return request.post({ url: '/system/management/menu', data })
}

export const editMenuApi = (data: Partial<MenuData>): Promise<IResponse> => {
  return request.put({ url: '/system/management/menu', data })
}

export const getMenuDetApi = (id: string): Promise<IResponse<MenuData>> => {
  return request.get({ url: '/system/management/menu/' + id })
}

export const delMenuListApi = (ids: string): Promise<IResponse> => {
  return request.delete({ url: '/system/management/menu/' + ids })
}

// 状态修改
export const chageMenuStatusApi = (data: Partial<MenuData>): Promise<IResponse> => {
  return request.put({ url: '/system/management/menu/changeStatus', data })
}

export const getTreeSelectApi = (): Promise<IResponse<MenuTreeData[]>> => {
  return request.get({ url: '/system/management/menu/treeselect' })
}

export const getRoleTreeSelectApi = (id: string): Promise<IResponse<MenuRoleTreeData>> => {
  return request.get({ url: '/system/management/menu/roleMenuTreeselect/' + id })
}
