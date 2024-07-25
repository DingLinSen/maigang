// 公司期刊管理接口
import request from '@/config/axios'

// 获取分页公司期刊信息
export const getCompanyJournalList = (params: any): Promise<IResponse> => {
  return request.get({ url: '/oa-market/companyJournal', params })
}

// 新增公司期刊信息
export const addCompanyJournal = (data: any): Promise<IResponse> => {
  return request.post({ url: '/oa-market/companyJournal', data })
}

// 根据id查询公司期刊信息
export const getDetailCompanyJournal = (id: string): Promise<IResponse> => {
  return request.get({ url: '/oa-market/companyJournal/getById/' + id })
}

// 修改公司期刊信息
export const editCompanyJournal = (data: any): Promise<IResponse> => {
  return request.put({ url: '/oa-market/companyJournal', data })
}

// 删除公司期刊信息
export const delCompanyJournal = (params: any): Promise<IResponse> => {
  return request.delete({ url: '/oa-market/companyJournal?ids=' + params.id })
}

// 根据id修改发布状态
export const updateCompanyJournalStatus = (params: any): Promise<IResponse> => {
  return request.get({ url: '/oa-market/companyJournal/updateStatus', params })
}
