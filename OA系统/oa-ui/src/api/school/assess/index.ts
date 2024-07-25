// 课程考核管理接口
import request from '@/config/axios'
import { AssessData } from '@/api/school/assess/types'

// 查询考核记录列表
export const getCourseAssessListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/oa-school/tbCourseAssess', params })
}

// 新增考核
export const saveCourseAssessApi = (data: Partial<AssessData>): Promise<IResponse> => {
  return request.post({ url: '/oa-school/tbCourseAssess', data })
}

// 根据ID删除信息
export const delCourseAssessListApi = (params: any): Promise<IResponse> => {
  return request.delete({ url: '/oa-school/tbCourseAssess/delete?ids=' + params.id })
}

// 根据ID查询考核记录信息
export const getCourseAssessApi = (params: any): Promise<IResponse<AssessData>> => {
  return request.get({ url: '/oa-school/tbCourseAssess/getById', params })
}

// 根据课程Id查询拥有浏览权限的未考核人员
export const notCourseAssessApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/oa-school/tbCourseAssess/getInfoById', params })
}

//查询用户截止日前一天未考核课程
export const getAccessWarmingInfoApi = (): Promise<IResponse> => {
  return request.get({ url: '/oa-school/tbCourseAssess/qryNearEnd' })
}

//修改已读状态
export const updateWarmingReadApi = (params: any): Promise<IResponse> => {
  return request.post({ url: '/oa-school/tbCourseAssess/updateFlag', params })
}
