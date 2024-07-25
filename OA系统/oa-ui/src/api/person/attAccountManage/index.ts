// 培育项目接口,
import request from '@/config/axios'

// 部门树列表-无权限
export const getdeptTreeNoAuthApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/system/management/user/deptTreeNoAuth', params })
}

// 考勤用户列表-无权限
export const getclockingListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/system/management/user/clockingList', params })
}
