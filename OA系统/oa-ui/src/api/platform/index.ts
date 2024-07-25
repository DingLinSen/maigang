import request from '@/config/axios'

//分页获取演示平台信息
export const getPlatformListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/oa-school/showPlate', params })
}

//删除演示平台信息
export const delPlatformListApi = (params: any): Promise<IResponse> => {
  return request.delete({ url: '/oa-school/showPlate?ids=' + params.id })
}

//新增演示平台信息
export const savePlatformApi = (data: any): Promise<IResponse> => {
  return request.post({ url: '/oa-school/showPlate', data })
}

//修改演示平台信息
export const editPlatformApi = (data: any): Promise<IResponse> => {
  return request.put({ url: '/oa-school/showPlate', data })
}
//根据id查询演示平台信息
export const getPlatformDetailApi = (id: string): Promise<IResponse> => {
  return request.get({ url: '/oa-school/showPlate/getById/' + id })
}