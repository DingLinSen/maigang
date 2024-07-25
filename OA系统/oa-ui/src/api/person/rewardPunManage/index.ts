// 奖惩列表接口
import request from '@/config/axios'
// import type { InfoBonuspenaltData } from './types'
import { download } from '@/api/common'

//列表
export const getInfoBonuspenaltListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/oa-personnelmanagement/tInfoBonuspenalty', params })
}

export const saveInfoBonuspenaltApi = (data: any): Promise<IResponse> => {
  return request.post({ url: '/oa-personnelmanagement/tInfoBonuspenalty', data })
}

export const updateInfoBonuspenaltApi = (data: any): Promise<IResponse> => {
  return request.put({ url: '/oa-personnelmanagement/tInfoBonuspenalty', data })
}

export const getInfoBonuspenaltApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/oa-personnelmanagement/tInfoBonuspenalty/getById/' + params })
}

export const delInfoBonuspenaltListApi = (ids: string): Promise<IResponse> => {
  return request.delete({ url: '/oa-personnelmanagement/tInfoBonuspenalty?ids=' + ids })
}
