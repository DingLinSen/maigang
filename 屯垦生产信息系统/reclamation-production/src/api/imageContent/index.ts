import request from '@/config/axios'

// 获取首页图文内容
export const getImageContentListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/farm-server/farmHomePage', params })
}

// 添加首页图文内容
export const addImageContentApi = (data: Partial<any>): Promise<IResponse> => {
  return request.post({ url: '/farm-server/farmHomePage', data })
}

// 修改首页图文内容
export const editImageContentApi = (data: Partial<any>): Promise<IResponse> => {
  return request.put({ url: '/farm-server/farmHomePage', data })
}

// 获取首页图文详情
export const getImageContentDetailApi = (id: string): Promise<IResponse<any>> => {
  return request.get({ url: '/farm-server/farmHomePage/getById/' + id })
}

// 删除首页图文内容
export const delImageContentApi = (params: any): Promise<IResponse> => {
  return request.delete({ url: '/farm-server/farmHomePage?ids=' + params })
}
