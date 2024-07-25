// 用户管理 -- api
import request from '@/config/axios'
import type { UserData, DeptTreeData } from './types'
import { download } from '@/api/common'

// 获取用户数据列表(分页)
export const getUserListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/system/management/user/list', params })
}
// 获取app用户列表

export const getAppUserListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/system/management/user/appUserList', params })
}

// 新增
export const saveUserApi = (data: Partial<UserData>): Promise<IResponse> => {
  return request.post({ url: '/system/management/user', data })
}

// 修改
export const editUserApi = (data: Partial<UserData>): Promise<IResponse> => {
  return request.put({ url: '/system/management/user', data })
}

// 根据id获取用户信息
export const getUserInfoApi = (id: string | undefined): Promise<IResponse<UserData>> => {
  return request.get({ url: '/system/management/user/' + id })
}
// 新增获取岗位和角色
export const getUserSelectApi = (params: any): Promise<IResponse<UserData>> => {
  return request.get({ url: '/system/management/user/', params })
}

// 根据用户id获取分配角色信息
export const getAuthRoleInfoApi = (id: number | string): Promise<IResponse<UserData>> => {
  return request.get({ url: '/system/management/user/authRole/' + id })
}
// 根据用户id保存分配角色信息
export const getSubmitAuthRoleInfoApi = (data: Partial<UserData>): Promise<IResponse> => {
  return request.put({
    url: '/system/management/user/authRole',
    data,
    headersType: 'application/x-www-form-urlencoded'
  })
}
// 批量调整部门
export const batchChangeDeptApi = (data: any): Promise<IResponse> => {
  return request.post({
    url: '/system/management/user/updateDepts',
    params: data
  })
}
// 删除
export const delUserListApi = (ids: string): Promise<IResponse> => {
  return request.delete({ url: '/system/management/user/' + ids })
}

// 修改用户状态
export const chageUserStatusApi = (data: Partial<UserData>): Promise<IResponse> => {
  return request.put({ url: '/system/management/user/changeStatus', data })
}
// 重置密码
export const resetPassWord = (data: Partial<UserData>): Promise<IResponse> => {
  return request.put({ url: '/system/management/user/resetPwd', data })
}
// 重置密码
export const batchResetPassWord = (data: Partial<UserData>): Promise<IResponse> => {
  return request.put({ url: '/system/management/user/resetPwds', data })
}
export const dataScopeApi = (data: Partial<UserData>): Promise<IResponse> => {
  return request.put({ url: '/system/management/role/dataScope', data })
}

// 获取部门树
export const getUserDeptListApi = (params: any): Promise<IResponse<DeptTreeData>> => {
  return request.get({ url: '/system/management/user/deptTree', params })
}

export const exportUserListApi = (data: any) => {
  return download('/system/management/user/export', data, `user_${new Date().getTime()}.xlsx`)
}

// 用户头像上传
export const uploadAvatarApi = (data: any): Promise<IResponse> => {
  return request.post({
    url: '/system/management/user/profile/avatar',
    data: data,
    headersType: 'multipart/form-data; boundary=----WebKitFormBoundaryBJa1VA8XEFgXAltY'
  })
}

// 查询用户个人信息
export const getUserProfileApi = (): Promise<IResponse> => {
  return request.get({ url: '/system/management/user/profile' })
}

// 修改用户个人信息
export const updateUserProfileApi = (data: any): Promise<IResponse> => {
  return request.put({ url: '/system/management/user/profile', data: data })
}

export const updateUserPwdApi = (data: any): Promise<IResponse> => {
  return request.put({ url: '/system/management/user/profile/updatePwd', params: data })
}
