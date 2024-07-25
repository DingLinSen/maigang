import request from '@/config/axios'

//分页获取通讯录信息
export const getPhoneBookListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/system/outPhone', params })
}

//删除通讯录信息
export const delPhoneBookListApi = (params: any): Promise<IResponse> => {
  return request.delete({ url: '/system/outPhone?ids=' + params.id })
}

//新增通讯录信息
export const savePhoneBookApi = (data: any): Promise<IResponse> => {
  return request.post({ url: '/system/outPhone', data })
}

//修改通讯录信息
export const editPhoneBookApi = (data: any): Promise<IResponse> => {
  return request.put({ url: '/system/outPhone', data })
}
//根据id查询通讯录信息
export const getPhoneBookDetailApi = (id: string): Promise<IResponse> => {
  return request.get({ url: '/system/outPhone/getById/' + id })
}