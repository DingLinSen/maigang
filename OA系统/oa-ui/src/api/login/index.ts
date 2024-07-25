import request from '@/config/axios'
import requestTwo from '@/config/axiosTwo'
import type { UserType } from './types'

interface RoleParams {
  roleName: string
}
// 获取验证码
export const getCode = (): Promise<IResponse> => {
  return request.get({ url: '/code' })
}
// 登录
export const loginApi = (data: UserType): Promise<IResponse<UserType>> => {
  return request.post({ url: '/auth/management/login', data })
}
// 退出登录
export const loginOutApi = (): Promise<IResponse> => {
  return request.delete({ url: '/auth/management/logout' })
}
// 退出登录
// export const loginOutApi = (): Promise<IResponse<string>> => {
//   return requestTwo.post({ url: '/oauth/logout' })
// }
// 通过code获取token
export const getTokenApi = (params: UserType): Promise<IResponse<UserType>> => {
  return request.get({ url: '/auth/management/access_token', params })
}
export const getUserListApi = ({ params }: AxiosConfig) => {
  return request.get<{
    code: string
    data: {
      list: UserType[]
      total: number
    }
  }>({ url: '/user/list', params })
}

export const getAdminRoleApi = (
  params: RoleParams
): Promise<IResponse<AppCustomRouteRecordRaw[]>> => {
  return request.get({ url: '/role/list', params })
}

export const getTestRoleApi = (params: RoleParams): Promise<IResponse<string[]>> => {
  return request.get({ url: '/role/list', params })
}
