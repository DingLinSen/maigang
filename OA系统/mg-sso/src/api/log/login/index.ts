import request from '@/config/axios'
import { download } from '@/api/common'

// 查询登录日志列表
export const getLogininforListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/system/management/logininfor/list', params })
}

// 删除登录日志
export const delLogininforListApi = (ids: string): Promise<IResponse> => {
  return request.delete({ url: '/system/management/logininfor/' + ids })
}

// 清空登录日志
export const cleanLogininforApi = (): Promise<IResponse> => {
  return request.delete({ url: '/system/management/logininfor/clean' })
}

// 解锁用户登录状态
export const unlockLogininforApi = (userName: string): Promise<IResponse> => {
  return request.get({ url: '/system/management/logininfor/unlock/' + userName })
}

//导出
export const exportLogininforApi = (data: any) => {
  return download('/system/management/logininfor/export', data, `logininfor_${new Date().getTime()}.xlsx`)
}