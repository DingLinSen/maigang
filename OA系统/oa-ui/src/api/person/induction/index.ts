// 培育项目接口
import request from '@/config/axios'
import type { InductionData } from './types'

// 入职申请
export const saveInductionApi = (data: Partial<InductionData>): Promise<IResponse> => {
  return request.post({ url: '/oa-personnelmanagement/personal/apply', data })
}

// 入职申请
export const updateInductionApi = (data: Partial<InductionData>): Promise<IResponse> => {
  return request.put({ url: '/oa-personnelmanagement/personal/apply', data })
}

// 修改入职申请状态
export const updateStatusApi = (id: any, status: any): Promise<IResponse> => {
  return request.put({
    url: '/oa-personnelmanagement/personal/apply/updateStatus?id=' + id + '&status=' + status
  })
}

// 获取入职申请数据
export const getInductionApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/oa-personnelmanagement/personal/apply/findById', params })
}

// 查询省
export const getProvinceApi = (): Promise<IResponse> => {
  return request.get({ url: '/oa-personnelmanagement/personal/apply/getProvince' })
}

// 查询城市
export const getCityApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/oa-personnelmanagement/personal/apply/getCity/' + params })
}

// 查询区县
export const getDistrictApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/oa-personnelmanagement/personal/apply/getDistrict/' + params })
}
