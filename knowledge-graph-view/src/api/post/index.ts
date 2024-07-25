import request from '@/config/axios'
import type { PostData } from './types'
import { download } from '@/api/common'

export const getPostListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/knowledge-mapping/management/post/list', params })
}

export const savePostApi = (data: Partial<PostData>): Promise<IResponse> => {
  return request.post({ url: '/knowledge-mapping/management/post', data })
}

export const editPostApi = (data: Partial<PostData>): Promise<IResponse> => {
  return request.put({ url: '/knowledge-mapping/management/post', data })
}

export const getPostDetApi = (id: string): Promise<IResponse<PostData>> => {
  return request.get({ url: '/knowledge-mapping/management/post/' + id })
}
// 岗位下拉选
export const getPostOptionSelectApi = (id?: string): Promise<IResponse> => {
  return request.get({ url: '/knowledge-mapping/management/post/optionselect' })
}

export const delPostListApi = (ids: string): Promise<IResponse> => {
  return request.delete({ url: '/knowledge-mapping/management/post/' + ids })
}

export const exportPostListApi = (data: any) => {
  return download(
    '/knowledge-mapping/management/post/export',
    data,
    `岗位管理列表_${new Date().getTime()}.xlsx`
  )
}
