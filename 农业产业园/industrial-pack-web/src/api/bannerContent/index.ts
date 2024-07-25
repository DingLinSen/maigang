import request from '@/config/axios'

// 获取首页Banner信息
export const getBannerContentListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/farm-server/farmBanner', params })
}

// 添加首页Banner内容
export const addBannerContentApi = (data: Partial<any>): Promise<IResponse> => {
  return request.post({ url: '/farm-server/farmBanner', data })
}

// 修改首页Banner内容
export const editBannerContentApi = (data: Partial<any>): Promise<IResponse> => {
  return request.put({ url: '/farm-server/farmBanner', data })
}

// 获取首页Banner详情
export const getBannerContentDetailApi = (id: string): Promise<IResponse<any>> => {
  return request.get({ url: '/farm-server/farmBanner/getById/' + id })
}

// 删除首页Banner内容
export const delBannerContentApi = (params: any): Promise<IResponse> => {
  return request.delete({ url: '/farm-server/farmBanner?ids=' + params })
}
