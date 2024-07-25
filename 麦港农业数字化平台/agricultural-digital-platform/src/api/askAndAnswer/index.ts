import request from '@/config/axios'

// 获取分页回答管理信息
export const getAnswerListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/farm-server/farmAnswer', params })
}

// 新增提问
export const saveAnswerApi = (data: Partial<any>): Promise<IResponse> => {
  return request.post({ url: '/farm-server/farmAnswer', data })
}

// 修改提问
export const editAnswerApi = (data: Partial<any>): Promise<IResponse> => {
  return request.put({ url: '/farm-server/farmAnswer', data })
}

// 根据id查询回答管理信息
export const getAnswerDetailApi = (id: string): Promise<IResponse<any>> => {
  return request.get({ url: '/farm-server/farmAnswer/getById/' + id })
}

// 删除回答管理
export const delAnswerApi = (params: any): Promise<IResponse> => {
  return request.delete({ url: '/farm-server/farmAnswer?ids=' + params })
}

// 获取回答详情列表
export const getAnswerDetailListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: 'farm-server/farmAnswer/getAnswerDetailList', params })
}

// 新增回答
export const addAnswerApi = (data: Partial<any>): Promise<IResponse> => {
  return request.post({ url: '/farm-server/farmAnswer/addAnswer', data })
}

// 修改发布状态
export const updateStatusApi = (params: Partial<any>): Promise<IResponse> => {
  console.log(params)

  return request.post({
    url: '/farm-server/farmAnswer/updateStatus',
    params
  })
}
