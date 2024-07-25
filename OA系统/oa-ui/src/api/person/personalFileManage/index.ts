// 员工档案列表接口
import request from '@/config/axios'
import type { InfoEmployeefileData } from './types'
import { downloadDoc } from '@/api/common'

//列表
export const getInfoEmployeefileListApi = (params: InfoEmployeefileData): Promise<IResponse> => {
  return request.get({ url: '/oa-personnelmanagement/sys/tInfoEmployeefileDO', params })
}

// 导出
export const exportEmployeefileListApi = (data: any, flieName: string) => {
  return downloadDoc(
    '/oa-personnelmanagement/sys/tInfoEmployeefileDO/exportEmployeeFile/' + data,
    null,
    `${flieName}个人档案.xlsx`
  )
}

export const delInfoEmployeefileListApi = (ids: string): Promise<IResponse> => {
  return request.delete({ url: '/oa-personnelmanagement/sys/tInfoEmployeefileDO?ids=' + ids })
}

//查询个人生日详情
export const birthApi = (): Promise<IResponse> => {
  return request.get({ url: '/oa-personnelmanagement/sys/tInfoEmployeefileDO/personBirthday' })
}

