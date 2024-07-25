// 日报接口
import request from '@/config/axios'

// 日报列表
export const getListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/oa-report/daily/list', params })
}

// 日报详情
export const getByIdApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/oa-report/daily/getById', params })
}

// 日报保存
export const saveApi = (data: any): Promise<IResponse> => {
  return request.post({ url: '/oa-report/daily/save', data })
}

// 日报修改
export const updateApi = (data: any): Promise<IResponse> => {
  return request.put({ url: '/oa-report/daily/update', data })
}

// 周报下拉
export const getWeekSelectApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/oa-report/daily/weekSelect', params })
}

// 删除
export const deleteByIdApi = (ids: string): Promise<IResponse> => {
  return request.delete({ url: '/oa-report/daily/deleteById/' + ids })
}
