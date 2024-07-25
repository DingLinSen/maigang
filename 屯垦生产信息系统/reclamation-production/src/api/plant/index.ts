import request from '@/config/axios'

// 获取分页种植方案信息
export const getPlantListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/farm-server/farmPlantScheme', params })
}

// 新增种植方案
export const savePlantApi = (data: Partial<any>): Promise<IResponse> => {
  return request.post({ url: '/farm-server/farmPlantScheme', data })
}

// 修改种植方案
export const editPlantApi = (data: Partial<any>): Promise<IResponse> => {
  return request.put({ url: '/farm-server/farmPlantScheme', data })
}

// 根据id查询种植方案管理信息
export const getPlantApi = (id: string): Promise<IResponse<any>> => {
  return request.get({ url: '/farm-server/farmPlantScheme/getById/' + id })
}

// 删除种植方案管理
export const delPlantApi = (params: any): Promise<IResponse> => {
  return request.delete({ url: '/farm-server/farmPlantScheme?ids=' + params })
}
