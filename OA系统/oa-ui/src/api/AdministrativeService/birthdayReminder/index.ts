// 生日提醒接口
import request from '@/config/axios'

// 获取生日列表
export const getBirthList = (params: any): Promise<IResponse> => {
  return request.get({ url: '/oa-personnelmanagement/sys/tInfoEmployeefileDO/birthList', params })
}
