import request from '@/config/axios'
import type { IndustryData } from './types'

// 获取分页行业知识信息
export const getKnowledgeListApi = (params: any): Promise<IResponse> => {
    return request.get({ url: '/oa-school/industryKnowledge', params })
}

// 新增行业知识信息
export const saveKnowledgeApi = (data: Partial<IndustryData>): Promise<IResponse> => {
    return request.post({ url: '/oa-school/industryKnowledge', data })
}

// 修改行业知识信息
export const editKnowledgeApi = (data: Partial<IndustryData>): Promise<IResponse> => {
    return request.put({ url: '/oa-school/industryKnowledge', data })
}

// 查询行业知识信息详细
export const getKnowledgeDetApi = (id: string): Promise<IResponse<IndustryData>> => {
    return request.get({ url: '/oa-school/industryKnowledge/getById/' + id })
}

// 删除行业知识信息
export const delKnowledgeListApi = (params: any): Promise<IResponse> => {
    return request.delete({ url: '/oa-school/industryKnowledge?ids=' + params.id })
}