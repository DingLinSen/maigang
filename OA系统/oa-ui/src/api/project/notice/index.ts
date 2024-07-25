import request from '@/config/axios'

// 查询项目管理弹窗
export const getUnreadProjectInfoApi = (): Promise<IResponse> => {
    return request.get({ url: '/oa-project/up/getUp' })
}

//弹窗已读
export const updateProjectInfoApi = (id: string): Promise<IResponse> => {
    return request.get({ url: '/oa-project/up/read/' + id })
}