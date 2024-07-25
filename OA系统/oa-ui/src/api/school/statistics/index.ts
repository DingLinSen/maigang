// 课堂统计接口
import request from '@/config/axios'
import { downloadDoc } from '@/api/common'

// 获取数据统计
export const getDataStartListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/oa-school/tbCourseStat/getDataStat', params })
}

// 获取课堂考核数据统计
export const getCourseStartListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/oa-school/tbCourseStat/getCourseStat', params })
}

// 课堂考核数据统计导出
export const exportCourseStat = (data: any) => {
  return downloadDoc(
    '/oa-school/tbCourseStat/exportCourseStat',
    data,
    data.flag == 0
      ? `任务学习统计.xls`
      : data.flag == 1
      ? `自主学习统计.xls`
      : data.flag == 2
      ? `自主培训统计.xls`
      : `麦港学堂-课堂统计.xls`
  )
}

//获取分页操作记录信息
export const getStudyRecordListApi = (params: any): Promise<any> => {
  return request.get({ url: '/oa-school/tbStudyRecord', params })
}

//操作记录列表导出
export const exportCourseOperateListApi = (data: any) => {
  return downloadDoc('/oa-school/tbStudyRecord/exportList', data, `麦港学堂-课堂统计详情.xls`)
}
