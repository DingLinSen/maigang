import request from '@/config/axios'
import type { PostData } from './types'
import { download } from '@/api/common'

export const getPostListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/system/management/post/list', params })
}

export const savePostApi = (data: Partial<PostData>): Promise<IResponse> => {
  return request.post({ url: '/system/management/post', data })
}

export const editPostApi = (data: Partial<PostData>): Promise<IResponse> => {
  return request.put({ url: '/system/management/post', data })
}

export const getPostDetApi = (id: string): Promise<IResponse<PostData>> => {
  return request.get({ url: '/system/management/post/' + id })
}
// 岗位下拉选
export const getPostOptionSelectApi = (id?: string): Promise<IResponse> => {
  return request.get({ url: '/system/management/post/optionselect' })
}

export const delPostListApi = (ids: string): Promise<IResponse> => {
  return request.delete({ url: '/system/management/post/' + ids })
}

export const exportPostListApi = (data: any) => {
  return download(
    '/system/management/post/export',
    data,
    `岗位管理列表_${new Date().getTime()}.xlsx`
  )
}
