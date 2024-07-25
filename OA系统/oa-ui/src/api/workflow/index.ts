// 工作流程 -- api
import request from '@/config/axios'
import type { UserData, DeptTreeData } from './types'
import { download } from '@/api/common'

// 获取流程数据列表(分页)
export const getworkflowListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/oa-workflow/management/workflow/list', params })
}

// 处理流程
export const completeWorkflowrApi = (instanceId: any, data: any): Promise<IResponse> => {
  return request.post({
    url: `/oa-workflow/management/workflow/complete/${instanceId}`,
    data
    // headersType: ''
  })
}

// 删除流程
export const delWorkflowrListApi = (ids: string): Promise<IResponse> => {
  return request.delete({ url: '/oa-workflow/management/workflow/delete/' + ids })
}

// 修改
export const editUserApi = (data: Partial<UserData>): Promise<IResponse> => {
  return request.put({ url: '/system/management/user', data })
}

// 根据id获取用户信息
export const getUserInfoApi = (id: string): Promise<IResponse<UserData>> => {
  return request.get({ url: '/system/management/user/' + id })
}
// 新增获取岗位和角色
export const getUserSelectApi = (): Promise<IResponse<UserData>> => {
  return request.get({ url: '/system/management/user/' })
}

// 根据用户id获取分配角色信息
export const getAuthRoleInfoApi = (id: number): Promise<IResponse<UserData>> => {
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

export const dataScopeApi = (data: Partial<UserData>): Promise<IResponse> => {
  return request.put({ url: '/system/management/role/dataScope', data })
}

// 获取部门树
export const getUserDeptListApi = (): Promise<IResponse<DeptTreeData>> => {
  return request.get({ url: '/system/management/user/deptTree' })
}

export const exportUserListApi = (data: any) => {
  return download('/system/management/role/export', data, `user_${new Date().getTime()}.xlsx`)
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
