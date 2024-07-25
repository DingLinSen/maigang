import request from '@/config/axios'
import type { DictData, DictTypeData } from './types'
import { download } from '@/api/common'

export const getDictListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/system-center/management/dict/type/list', params })
}

export const saveDictApi = (data: Partial<DictData>): Promise<IResponse> => {
  return request.post({ url: '/system-center/management/dict/type', data })
}

export const editDictApi = (data: Partial<DictData>): Promise<IResponse> => {
  return request.put({ url: '/system-center/management/dict/type', data })
}

export const getDictDetApi = (id: string): Promise<IResponse<DictData>> => {
  return request.get({ url: '/system-center/management/dict/type/' + id })
}

export const delDictListApi = (ids: string): Promise<IResponse> => {
  return request.delete({ url: '/system-center/management/dict/type/' + ids })
}

// 根据字典类型查询字典数据信息
export const getDictsApi = (dictType: string): Promise<IResponse<DictTypeData[]>> => {
  return request.get({ url: '/system-center/management/dict/data/type/' + dictType })
}

// 刷新字典缓存
export const refreshCacheApi = (): Promise<IResponse> => {
  return request.delete({ url: '/system-center/management/dict/type/refreshCache' })
}

export const exportDictListApi = (data: any) => {
  return download(
    '/system-center/management/dict/type/export',
    data,
    `字典管理列表_${new Date().getTime()}.xlsx`
  )
}

export const getDictDataListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: 'system-center/management/dict/data/list', params })
}

export const saveDictDataApi = (data: Partial<DictTypeData>): Promise<IResponse> => {
  return request.post({ url: '/system-center/management/dict/data', data })
}

export const editDictDataApi = (data: Partial<DictTypeData>): Promise<IResponse> => {
  return request.put({ url: '/system-center/management/dict/data', data })
}

export const delDictDataListApi = (ids: string): Promise<IResponse> => {
  return request.delete({ url: '/system-center/management/dict/data/' + ids })
}

// 获取字典选择框列表
export const getDictOptionApi = (): Promise<IResponse> => {
  return request.get({ url: '/system-center/management/dict/type/optionselect' })
}

export const exportDictDataListApi = (data: any) => {
  return download(
    '/system-center/management/dict/data/export',
    data,
    `字典数据列表_data_${new Date().getTime()}.xlsx`
  )
}
