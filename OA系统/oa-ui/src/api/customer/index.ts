import request from '@/config/axios'

//分页获取客户管理信息
export const getCustomerListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/oa-project/customer/list', params })
}
//删除客户管理信息
export const delCustomerListApi = (params: any): Promise<IResponse> => {
  return request.delete({ url: '/oa-project/customer/remove?id=' + params })
}
//新增客户管理信息
export const saveCustomerApi = (data: any): Promise<IResponse> => {
  return request.post({ url: '/oa-project/customer/save', data })
}
//编辑客户管理信息
export const editCustomerApi = (data: any): Promise<IResponse> => {
  return request.put({ url: '/oa-project/customer/update', data })
}
//根据id查询客户管理信息
export const getCustomerDetailApi = (id: string): Promise<IResponse> => {
  return request.get({ url: '/oa-project/customer/getById?id=' + id })
}
//审批
export const auditCustomerApi = (data: any): Promise<IResponse> => {
  return request.post({ url: '/oa-project/customer/audit', data })
}

//根据联系人id判断是否可以删除
export const checkContactDelApi = (id: string): Promise<IResponse> => {
  return request.get({ url: '/oa-project/customer/canBeDelByContactsId?contactsId=' + id })
}



