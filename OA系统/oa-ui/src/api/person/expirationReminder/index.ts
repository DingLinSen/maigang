// 到期提醒接口
import request from '@/config/axios'
// import type { InfoBonuspenaltData } from './types'
// import { download } from '@/api/common'

//列表
export const getExpireListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/oa-personnelmanagement/sys/tInfoEmployeefileDO/expire', params })
}

// 到期
export const putExpireListApi = (params: any): Promise<IResponse> => {
  return request.put({ url: '/oa-personnelmanagement/sys/tInfoEmployeefileDO/expire', params })
}
