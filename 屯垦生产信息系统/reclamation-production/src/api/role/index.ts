import request from '@/config/axios'
import type { RoleData, DeptRoleTreeData } from './types'
import { download } from '@/api/common'

// 查询角色列表
export const getRoleListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/system/management/role/list', params })
}

// 新增角色
export const saveRoleApi = (data: Partial<RoleData>): Promise<IResponse> => {
  return request.post({ url: '/system/management/role', data })
}

// 修改角色
export const editRoleApi = (data: Partial<RoleData>): Promise<IResponse> => {
  return request.put({ url: '/system/management/role', data })
}

// 查询角色详细
export const getRoleDetApi = (id: string): Promise<IResponse<RoleData>> => {
  return request.get({ url: '/system/management/role/' + id })
}

// 角色下拉选
export const getRoleOptionSelectApi = (): Promise<IResponse<RoleData>> => {
  return request.get({ url: '/system/management/role/optionselect' })
}

// 删除角色
export const delRoleListApi = (ids: string): Promise<IResponse> => {
  return request.delete({ url: '/system/management/role/' + ids })
}

// 角色状态修改
export const chageRoleStatusApi = (data: Partial<RoleData>): Promise<IResponse> => {
  return request.put({ url: '/system/management/role/changeStatus', data })
}

// 角色数据权限
export const dataScopeApi = (data: Partial<RoleData>): Promise<IResponse> => {
  return request.put({ url: '/system/management/role/dataScope', data })
}

// 根据角色ID查询部门树结构
export const getRoleDeptListApi = (params: any): Promise<IResponse<DeptRoleTreeData>> => {
  return request.get({ url: '/system/management/role/deptTree/' + params.id, params })
}

export const exportRoleListApi = (data: any) => {
  return download('/system/management/role/export', data, `角色管理_${new Date().getTime()}.xlsx`)
}

// 查询角色已授权用户列表
export const getRoleUserListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/system/management/role/authUser/allocatedList', params })
}

// 查询角色未授权用户列表
export const getRoleAllUserListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/system/management/role/authUser/unallocatedList', params })
}

// 授权用户选择
export const SelectRoleUserApi = (params: any): Promise<IResponse> => {
  return request.put({ url: '/system/management/role/authUser/selectAll', params })
}

// 取消用户授权角色
export const CancelRoleUserApi = (params: any): Promise<IResponse> => {
  return request.put({ url: '/system/management/role/authUser/cancel', data: params })
}

// 批量取消用户授权角色
export const CancelAllRoleUserApi = (params: any): Promise<IResponse> => {
  return request.put({ url: '/system/management/role/authUser/cancelAll', params })
}
