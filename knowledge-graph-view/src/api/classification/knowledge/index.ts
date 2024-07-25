import request from '@/config/axios'
// id获取详细信息
export const getFindByIdApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/knowledge-mapping/knowledgeType/findById', params })
}
// 列表
export const tagTypeListApi = (data: Partial<any>): Promise<IResponse> => {
  let params = {
    pageSize: data.pageSize,
    pageNum: data.pageNum
  }
  return request.post({ url: '/knowledge-mapping/knowledgeType/list', data, params })
}
// 列表
export const tagTypeListAllApi = (): Promise<IResponse> => {
  return request.post({ url: '/knowledge-mapping/knowledgeType/listAll' })
}
// 批量
export const batchOperatorApi = (data: any): Promise<IResponse> => {
  return request.put({ url: '/knowledge-mapping/knowledgeType/batchOperator', data })
}
// 新增
export const tagTypeAddApi = (data: Partial<any>): Promise<IResponse> => {
  return request.post({ url: '/knowledge-mapping/knowledgeType/save', data })
}
// 修改
export const editKonwledgApi = (data: Partial<any>): Promise<IResponse> => {
  return request.put({ url: '/knowledge-mapping/knowledgeType/update', data })
}
// 待办
export const todoListApi = (data: Partial<any>): Promise<IResponse> => {
  let params = {
    pageSize: data.pageSize,
    pageNum: data.pageNum
  }
  return request.post({ url: '/knowledge-mapping/knowledgeType/todoList', data, params })
}
export const delKonwledgApi = (ids: any): Promise<IResponse> => {
  return request.delete({ url: '/knowledge-mapping/knowledgeType/delete', params: { ids } })
}
