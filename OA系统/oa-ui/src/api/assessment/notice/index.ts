import request from '@/config/axios'

// 查询项目管理弹窗
export const getUnreadAssessInfoApi = (): Promise<IResponse> => {
    return request.get({ url: '/oa-report/up/getUp' })
}

//弹窗已读
export const updateAssessInfoApi = (id: string): Promise<IResponse> => {
    return request.get({ url: '/oa-report/up/read/' + id })
}