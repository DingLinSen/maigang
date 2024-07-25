// 公司新闻管理接口
import request from '@/config/axios'

const basePath = import.meta.env.VITE_API_BASEPATH

// 获取分页公司新闻信息
export const getCompanyContentList = (params: any): Promise<IResponse> => {
  return request.get({ url: '/oa-market/companyContent', params })
}

// 新增公司新闻信息
export const addCompanyContent = (data: any): Promise<IResponse> => {
  return request.post({ url: '/oa-market/companyContent', data })
}

// 根据id查询公司新闻信息
export const getDetailCompanyContent = (id: string): Promise<IResponse> => {
  return request.get({ url: '/oa-market/companyContent/getById/' + id })
}

// 修改公司新闻信息
export const editCompanyContent = (data: any): Promise<IResponse> => {
  return request.put({ url: '/oa-market/companyContent', data })
}

// 删除公司新闻信息
export const delCompanyContent = (params: any): Promise<IResponse> => {
  let flag = basePath == 'pro' ? '&flag=0' : ''
  return request.delete({ url: '/oa-market/companyContent?ids=' + params.id + flag })
}

// 根据id修改发布状态
export const updateStatusApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/oa-market/companyContent/updateStatus', params })
}
