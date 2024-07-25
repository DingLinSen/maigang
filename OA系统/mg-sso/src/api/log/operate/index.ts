import request from '@/config/axios'
import { download } from '@/api/common'

// 查询操作日志列表
export const getOperateLogListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/system/management/operlog/list', params })
}

// 删除操作日志
export const delOperateLogListApi = (ids: string): Promise<IResponse> => {
  return request.delete({ url: '/system/management/operlog/' + ids })
}

// 清空操作日志
export const cleanOperateLogApi = (): Promise<IResponse> => {
  return request.delete({ url: '/system/management/operlog/clean' })
}

//导出
export const exportOperateLogApi = (data: any) => {
  return download('/system/management/operlog/export', data, `operlog_${new Date().getTime()}.xlsx`)
}