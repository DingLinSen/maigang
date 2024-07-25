import request from '@/config/axios'
import type { LecturerData } from './types'

// 获取分页讲师信息
export const getLecturerListApi = (params: any): Promise<any> => {
    return request.get({ url: '/oa-school/tbLecturer', params })
}

// 新增讲师信息
export const saveLecturerApi = (data: Partial<LecturerData>): Promise<IResponse> => {
    return request.post({ url: '/oa-school/tbLecturer', data })
}

// 修改讲师信息
export const editLecturerApi = (data: Partial<LecturerData>): Promise<IResponse> => {
    return request.put({ url: '/oa-school/tbLecturer', data })
}

// 查询讲师信息详细
export const getLecturerDetApi = (id: string): Promise<IResponse<LecturerData>> => {
    return request.get({ url: '/oa-school/tbLecturer/getById/' + id })
}

// 删除讲师信息
export const delLecturerListApi = (params: any): Promise<IResponse> => {
    return request.delete({ url: '/oa-school/tbLecturer?ids=' + params.id })
}

// 根据id查询讲师所有课程信息
export const getCourseByLecturerApi = (id: string): Promise<IResponse> => {
    return request.get({ url: '/oa-school/tbLecturer/getCourseByLecturerId?lecturerId=' + id })
}
// 视频详情点赞和取消点赞
export const assessLikeApi = (params: any): Promise<IResponse> => {
    return request.post({ url: '/oa-school/tbAssessLike/like', params })
}