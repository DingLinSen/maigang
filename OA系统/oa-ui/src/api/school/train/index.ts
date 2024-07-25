import request from '@/config/axios'
import type { TrainData } from './types'
import { downloadDoc } from '@/api/common'

// 获取分页自主培训信息
export const getSelfTrainListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/oa-school/trainRecord/getByList', params })
}

// 新增自主培训信息
export const saveSelfTrainApi = (data: Partial<TrainData>): Promise<IResponse> => {
  return request.post({ url: '/oa-school/trainRecord', data })
}

// 修改自主培训信息
export const editSelfTrainApi = (data: Partial<TrainData>): Promise<IResponse> => {
  return request.put({ url: '/oa-school/trainRecord/update', data })
}

// 查询自主培训信息详细
export const getSelfTrainDetApi = (id: string): Promise<IResponse> => {
  return request.get({ url: '/oa-school/trainRecord/findById?id=' + id })
}

// 删除自主培训信息
export const delSelfTrainListApi = (params: any): Promise<IResponse> => {
  return request.delete({ url: '/oa-school/trainRecord/delete?ids=' + params.id })
}

//导出
export const exportTrainApi = (data: any, fileName: string) => {
    return downloadDoc(
        '/oa-school/trainRecord/exportTrain',
        data,
        fileName + `_${new Date().getTime()}.xlsx`
    )
}

//培训列表导出
export const exportTrainListApi = (data: any) => {
    return downloadDoc(
        '/oa-school/trainRecord/exportList',
        data,
        '自主培训' + `_${new Date().getTime()}.xlsx`
    )
}
