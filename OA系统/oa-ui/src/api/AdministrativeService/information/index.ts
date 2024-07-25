// 系统公司资料管理接口
import request from '@/config/axios'

// 新增公司资料信息
export const addCompanyInformationApi = (data: any): Promise<IResponse> => {
  return request.post({ url: '/oa-administrative/companyInformation', data })
}

// 获取分页公司资料信息
export const getCompanyInformationListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/oa-administrative/companyInformation', params })
}

// 根据id查询公司资料信息
export const getDetailCompanyInformationApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/oa-administrative/companyInformation/getById/' + params })
}

// 修改公司资料信息
export const editCompanyInformationApi = (data: any): Promise<IResponse> => {
  return request.put({ url: '/oa-administrative/companyInformation', data })
}

// 删除公司资料信息
export const delCompanyInformationApi = (ids: string): Promise<IResponse> => {
  return request.delete({ url: '/oa-administrative/companyInformation?ids=' + ids })
}
