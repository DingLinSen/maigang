import request from '@/config/axios'
// id获取详细信息
export const getFindByIdApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/knowledge-mapping/tag/findById', params })
}
// 列表
export const tagListApi = (data: Partial<any>): Promise<IResponse> => {
  let params = {
    pageSize: data.pageSize,
    pageNum: data.pageNum,
    orderByColumn: data.orderByColumn,
    isAsc: data.isAsc
  }
  return request.post({ url: '/knowledge-mapping/tag/list', data, params })
}
// 列表
export const tagListAllApi = (data: Partial<any>): Promise<IResponse> => {
  let params = {
    pageSize: data.pageSize,
    pageNum: data.pageNum,
    orderByColumn: data.orderByColumn,
    isAsc: data.isAsc
  }
  return request.post({ url: '/knowledge-mapping/tag/listAll', data, params })
}
// 查询已审核的标签分类
export const taegptyApi = (data?: Partial<any>): Promise<IResponse> => {
  return request.post({ url: '/knowledge-mapping/tagType/listAll', data })
}
// 新增
export const tagAddApi = (data: Partial<any>): Promise<IResponse> => {
  return request.post({ url: '/knowledge-mapping/tag/save', data })
}
// 修改
export const editKonwledgApi = (data: Partial<any>): Promise<IResponse> => {
  return request.put({ url: '/knowledge-mapping/tag/update', data })
}
export const delKonwledgApi = (ids: any): Promise<IResponse> => {
  return request.delete({ url: '/knowledge-mapping/tag/delete', params: { ids } })
}
