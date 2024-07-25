import request from '@/config/axios'

// 获取分页农课堂信息
export const getFarmCourseListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/farm-server/farmCourse', params })
}

// 添加农课堂
export const saveFarmCourseApi = (data: Partial<any>): Promise<IResponse> => {
  return request.post({ url: '/farm-server/farmCourse', data })
}

// 修改农课堂
export const editFarmCourseApi = (data: Partial<any>): Promise<IResponse> => {
  return request.put({ url: '/farm-server/farmCourse', data })
}

// 根据id查询农课堂信息
export const getFarmCourseApi = (id: string): Promise<IResponse<any>> => {
  return request.get({ url: '/farm-server/farmCourse/getById/' + id })
}

// 删除农课堂
export const delFarmCourseApi = (params: any): Promise<IResponse> => {
  return request.delete({ url: '/farm-server/farmCourse?ids=' + params })
}
