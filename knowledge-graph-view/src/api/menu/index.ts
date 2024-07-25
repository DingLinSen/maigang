import request from '@/config/axios'
import type { MenuData, MenuTreeData, MenuRoleTreeData } from './types'

export const getMenuListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/knowledge-mapping/management/menu/list', params })
}

export const saveMenuApi = (data: Partial<MenuData>): Promise<IResponse> => {
  return request.post({ url: '/knowledge-mapping/management/menu', data })
}

export const editMenuApi = (data: Partial<MenuData>): Promise<IResponse> => {
  return request.put({ url: '/knowledge-mapping/management/menu', data })
}

export const getMenuDetApi = (id: string): Promise<IResponse<MenuData>> => {
  return request.get({ url: '/knowledge-mapping/management/menu/' + id })
}

export const delMenuListApi = (ids: string): Promise<IResponse> => {
  return request.delete({ url: '/knowledge-mapping/management/menu/' + ids })
}

export const getTreeSelectApi = (): Promise<IResponse<MenuTreeData[]>> => {
  return request.get({ url: '/knowledge-mapping/management/menu/treeselect' })
}

export const getRoleTreeSelectApi = (id: string): Promise<IResponse<MenuRoleTreeData>> => {
  return request.get({ url: '/knowledge-mapping/management/menu/roleMenuTreeselect/' + id })
}

//根据组件路径获取所有角色权限
export const getRoleMenuApi = (path: string): Promise<IResponse> => {
  return request.get({ url: '/knowledge-mapping/management/menu/getAllRoleMenu?path=' + path })
}
