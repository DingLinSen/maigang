import request from '@/config/axios'

// 获取分页作物信息

export const getCropLevelListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/farm-server/farmCropLevel', params })
}

// 添加作物
export const saveCropLevelApi = (data: Partial<any>): Promise<IResponse> => {
  return request.post({ url: '/farm-server/farmCropLevel', data })
}

// 修改作物
export const editCropLevelApi = (data: Partial<any>): Promise<IResponse> => {
  return request.put({ url: '/farm-server/farmCropLevel', data })
}

// 根据id查询作物信息
export const getCropLevelApi = (id: string): Promise<IResponse<any>> => {
  return request.get({ url: '/farm-server/farmCropLevel/getById/' + id })
}

// 获取作物列表
export const getCropLevelDetailApi = (params: any): Promise<IResponse<any>> => {
  return request.get({ url: '/farm-server/farmCropLevel/getByList', params })
}

// 删除作物
export const delCropLevelApi = (params: any): Promise<IResponse> => {
  return request.delete({ url: '/farm-server/farmCropLevel?ids=' + params })
}
