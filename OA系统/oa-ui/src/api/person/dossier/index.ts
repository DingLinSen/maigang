// 培育项目接口,
import request from '@/config/axios'
import type { InfoEmployeefileData } from './types'

// 新增个人档案
export const saveInfoEmployeefileApi = (
  data: Partial<InfoEmployeefileData>
): Promise<IResponse> => {
  return request.post({ url: '/oa-personnelmanagement/sys/tInfoEmployeefileDO', data })
}

// 修改个人档案
export const updateInfoEmployeefileApi = (
  data: Partial<InfoEmployeefileData>
): Promise<IResponse> => {
  return request.put({ url: '/oa-personnelmanagement/sys/tInfoEmployeefileDO', data })
}

// 修改个人档案状态
export const updateStatusApi = (id: any, status: any): Promise<IResponse> => {
  return request.put({
    url:
      '/oa-personnelmanagement/sys/tInfoEmployeefileDO/updateStatus?id=' + id + '&status=' + status
  })
}

// 获取入职申请数据
export const getInfoEmployeefileApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/oa-personnelmanagement/sys/tInfoEmployeefileDO/findById/' + params })
}

//UserId 获取入职申请数据
export const getPersonalApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/oa-personnelmanagement/personal/apply/findByUserId', params })
}

//UserId 获取个人档案数据
export const getInfoEmployeefileUserIdApi = (params: any): Promise<IResponse> => {
  return request.get({
    url: '/oa-personnelmanagement/sys/tInfoEmployeefileDO/qryByUserId?userId=' + params
  })
}
