import request from '@/config/axios'

// 回收站列表
export const getRecycleListApi = (data: any): Promise<IResponse> => {
  let params = {
    pageNum: data.pageNum,
    pageSize: data.pageSize
  }
  return request.post({ url: '/knowledge-mapping/title/recycleList', data, params })
}

// 还原
export const restoreApi = (params: Partial<any>): Promise<IResponse> => {
  return request.put({ url: '/knowledge-mapping/title/restore', params })
}

// 清空回收站
export const delRecordApi = (userName: any): Promise<IResponse> => {
  return request.delete({ url: '/knowledge-mapping/title/delAll?userName=' + userName })
}
