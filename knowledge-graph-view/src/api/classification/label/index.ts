import request from '@/config/axios'

// id获取详细信息
export const getFindByIdApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/knowledge-mapping/tagType/findById', params })
}

// 列表
export const tagTypeListApi = (data: Partial<any>): Promise<IResponse> => {
  let params = {
    pageSize: data.pageSize,
    pageNum: data.pageNum
  }
  return request.post({ url: '/knowledge-mapping/tagType/list', data, params })
}

// 批量
export const batchOperatorApi = (data: any): Promise<IResponse> => {
  return request.put({ url: '/knowledge-mapping/tagType/batchOperator', data })
}
// 新增
export const tagTypeAddApi = (data: Partial<any>): Promise<IResponse> => {
  return request.post({ url: '/knowledge-mapping/tagType/save', data })
}
// 查询已审核的标签分类
export const taegptyApi = (data: Partial<any>): Promise<IResponse> => {
  return request.post({ url: '/knowledge-mapping/tagType/listAll', data })
}

// 修改
export const editKonwledgApi = (data: Partial<any>): Promise<IResponse> => {
  return request.put({ url: '/knowledge-mapping/tagType/update', data })
}

// 待办
export const todoListApi = (data: Partial<any>): Promise<IResponse> => {
  let params = {
    pageSize: data.pageSize,
    pageNum: data.pageNum
  }
  return request.post({ url: '/knowledge-mapping/tagType/todoList', data, params })
}

export const delKonwledgApi = (ids: any): Promise<IResponse> => {
  return request.delete({ url: '/knowledge-mapping/tagType/delete', params: { ids } })
}
