// 培育项目接口
import request from '@/config/axios'
import type { EmployData } from './types'
import { downloadDoc } from '@/api/common'

// 入职申请列表
export const getEmployListApi = (params: EmployData): Promise<IResponse> => {
  return request.get({ url: '/oa-personnelmanagement/personal/apply', params })
}

// 导出
export const exportEmployListApi = (data: any, flieName) => {
  return downloadDoc(
    '/oa-personnelmanagement/personal/apply/exportApply/' + data,
    null,
    `${flieName}入职申请表.xlsx`
  )
}

export const delEmployListApi = (ids: string): Promise<IResponse> => {
  return request.delete({ url: '/oa-personnelmanagement/personal/apply' + ids })
}
