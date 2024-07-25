import request from '@/config/axios'

// 列表
export const getGroupListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/knowledge-mapping/group/list', params })
}

// 编辑
export const groupEditApi = (data: any): Promise<IResponse> => {
  return request.put({ url: '/knowledge-mapping/group/edit', data })
}

// 保存
export const groupSaveApi = (data: Partial<any>): Promise<IResponse> => {
  return request.post({ url: '/knowledge-mapping/group/save', data })
}

// 删除
export const delGroupApi = (id: any): Promise<IResponse> => {
  return request.delete({ url: '/knowledge-mapping/group/remove', params: { id } })
}
