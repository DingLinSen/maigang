// 周报接口
import request from '@/config/axios'
import { downloadDoc } from '@/api/common'

// 考核数据列表
export const getListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/oa-report/assessmentReport/assessmentList', params })
}

// 考核数据报表详情列表
export const getDetailListApi = (params: any): any => {
  return request.get({ url: '/oa-report/assessmentReport/assessmentDetailList', params })
}

//考核数据统计报表导出
export const getAssessmentExport = (data: any) => {
  return downloadDoc('/oa-report/assessmentReport/exportAssessment', data, `考核统计数据信息.xlsx`)
}

//考核数据详情报表
export const getAssessmentDetailExport = (data: any) => {
  return downloadDoc(
    '/oa-report/assessmentReport/exportAssessmentDetail',
    data,
    `考核数据扣分详情.xlsx`
  )
}
