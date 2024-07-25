// 考核类型管理接口
import request from '@/config/axios'

// 考核类型新增
export const addAssessmentType = (data: any): Promise<IResponse> => {
  return request.post({ url: '/oa-administrative/assessmentType', data })
}

// 获取考核类型管理信息
export const getAssessmentTypeList = (params: any): Promise<IResponse> => {
  return request.get({ url: '/oa-administrative/assessmentType', params })
}

// 根据id删除,支持批量删除
export const delAssessmentType = (params: any): Promise<IResponse> => {
  return request.delete({ url: '/oa-administrative/assessmentType?ids=' + params.id })
}

// 根据id获取详情信息
export const getDetailAssessmentType = (params: any): Promise<IResponse> => {
  return request.get({ url: '/oa-administrative/assessmentType/findById', params })
}

// 考核类型修改
export const editAssessmentType = (data: any): Promise<IResponse> => {
  return request.put({ url: '/oa-administrative/assessmentType', data })
}

// 考核类型状态修改
export const changeStatus = (params: any): Promise<IResponse> => {
  return request.post({ url: '/oa-administrative/assessmentType/changeStatus', params })
}
