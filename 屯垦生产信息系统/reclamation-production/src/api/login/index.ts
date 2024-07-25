import request from '@/config/axios'
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
