import request from '@/config/axios'
import { download } from '@/api/common'

// 查询操作日志列表
export const getOperateLogListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/log-center/log/logs', params })
}

// 删除操作日志
export const delOperateLogListApi = (ids: string): Promise<IResponse> => {
  return request.delete({ url: '/system-center/management/operlog/' + ids })
}

// 清空操作日志
export const cleanOperateLogApi = (): Promise<IResponse> => {
  return request.delete({ url: '/system-center/management/operlog/clean' })
}

//导出
export const exportOperateLogApi = (data: any) => {
  return download(
    '/system-center/management/operlog/export',
    data,
    `操作日志列表_${new Date().getTime()}.xlsx`
  )
}
