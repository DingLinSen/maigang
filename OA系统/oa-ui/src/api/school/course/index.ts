import request from '@/config/axios'
import type { CourseData } from './types'

// 获取分页课程信息
export const getCourseListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/oa-school/tbCourse', params })
}

// 新增课程信息
export const saveCourseApi = (data: Partial<CourseData>): Promise<IResponse> => {
  return request.post({ url: '/oa-school/tbCourse', data })
}

// 修改课程信息
export const editCourseApi = (data: Partial<CourseData>): Promise<IResponse> => {
  return request.put({ url: '/oa-school/tbCourse', data })
}

// 查询课程信息详细
export const getCourseDetApi = (id: string): Promise<IResponse> => {
  return request.get({ url: '/oa-school/tbCourse/getById/' + id })
}

// 删除课程信息
export const delCourseListApi = (params: any): Promise<IResponse> => {
  return request.delete({ url: '/oa-school/tbCourse?ids=' + params.id })
}

//任务学习-自主学习所有上架的课程和讲师
export const getCourseAndLecturerApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/oa-school/tbCourse/getCourseAndLecturer', params })
}

//根据类别查询内训外训课程(分页)
export const getCourseByTypeApi = (params: any): Promise<any> => {
  return request.get({ url: '/oa-school/tbCourse/getCourseByType', params })
}

// 根据课程id查询课程详情
export const getCourseInfoApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/oa-school/tbCourse/getCourseInfoById', params })
}

// 获取课程集合
export const getCourseListAllApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/oa-school/tbCourse/getCourseListAll', params })
}

//首页查询所有上架的课程和讲师
export const getCourseIndexInfoApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/oa-school/tbCourse/getIndexInfo', params })
}

//查询所有上架讲师信息
export const getLecturerListApi = (): Promise<IResponse> => {
  return request.get({ url: '/oa-school/tbCourse/getLecturer' })
}
//任务学习和自主学习(分页)
export const getTaskAndActiveListApi = (params: any): Promise<any> => {
  return request.get({ url: '/oa-school/tbCourse/taskAndActive', params })
}
//添加评论
export const addAssessComment = (data: Partial<CourseData>): Promise<IResponse> => {
  return request.post({ url: '/oa-school/tbAssessComment', data })
}
// 删除评论
export const delAssessComment = (params: any): Promise<IResponse> => {
  return request.delete({ url: '/oa-school/tbAssessComment', params })
}
//添加评分
export const addScore = (data: Partial<CourseData>): Promise<IResponse> => {
  return request.post({ url: '/oa-school/tbAssessComment/addScore', data })
}
// 记录观看时长
export const CourseLookTimeApi = (data: Partial<CourseData>): Promise<IResponse> => {
  return request.post({ url: '/oa-school/tbCourseLook', data })
}
//新增操作记录信息
export const AddStudyRecordApi = (data: Partial<CourseData>): Promise<IResponse> => {
  return request.post({ url: '/oa-school/tbStudyRecord', data })
}
