import request from '@/config/axios'
import type { VersionInfo } from './types'

//版本申请
export const addVersionApi = (data: Partial<VersionInfo>): Promise<IResponse> => {
  return request.post({ url: '/knowledge-mapping/sysVersion', data })
}
//版本编辑
export const editVersionApi = (data: Partial<VersionInfo>): Promise<IResponse> => {
  return request.put({ url: '/knowledge-mapping/sysVersion', data })
}
//版本删除
export const delVersionListApi = (ids: string): Promise<IResponse> => {
  return request.delete({ url: '/knowledge-mapping/sysVersion?ids=' + ids })
}
//版本详情
export const getVersionDetailApi = (id: string): Promise<IResponse> => {
  return request.get({ url: '/knowledge-mapping/sysVersion/getById/' + id })
}
//修改系统版本发布状态
export const updateStatusApi = (params: any): Promise<IResponse> => {
  return request.post({ url: '/knowledge-mapping/sysVersion/updateStatus', params })
}
//获取分页系统版本信息
export const getVersionListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/knowledge-mapping/sysVersion', params })
}
//获取当前最新发布版本
export const getNewVersionDetailApi = (): Promise<IResponse> => {
  return request.get({ url: '/knowledge-mapping/sysVersion/getNewVersion' })
}
