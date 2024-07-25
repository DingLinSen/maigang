import request from '@/config/axios'
import type { UserType, logType } from './types'

interface RoleParams {
  roleName: string
}
// 获取验证码
export const getCode = (): Promise<IResponse> => {
  return request.get({ url: '/code' })
}
// 登录
// export const loginApi = (data: UserType): Promise<IResponse<UserType>> => {
//   return request.post({ url: '/auth/management/login', data })
// }
export const loginApi = (data: UserType): Promise<IResponse<UserType>> => {
  return request.post({ url: '/oauth/authorize', data })
}
export const getTokenApi = (params: UserType): Promise<IResponse<UserType>> => {
  return request.get({ url: '/oauth/access_token', params })
}
// 退出登录
// export const loginOutApi = (): Promise<IResponse> => {
//   return request.delete({ url: '/auth/management/logout' })
// }
export const loginOutApi = (): Promise<IResponse<string>> => {
  return request.post({ url: '/oauth/logout' })
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
// 日志解锁账号
export const accessLogApi = (params: logType): Promise<IResponse> => {
  return request.get({ url: '/access_log/list', params })
}
// 解锁账号
export const unLocktApi = (params: string | undefined): Promise<IResponse> => {
  return request.post({ url: '/access_log/unlock/' + params })
}
export const getTestRoleApi = (params: RoleParams): Promise<IResponse<string[]>> => {
  return request.get({ url: '/role/list', params })
}
