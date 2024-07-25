import request from '@/config/axios'
import type { TaskData } from './types'

// 获取分页任务管理信息
export const getTaskListApi = (params: any): Promise<IResponse> => {
    return request.get({ url: '/oa-meeting/task/getByList', params })
}

// 新增任务管理信息
export const saveTaskApi = (data: Partial<TaskData>): Promise<IResponse> => {
    return request.post({ url: '/oa-meeting/task', data })
}

// 修改任务管理信息
export const editTaskApi = (data: Partial<TaskData>): Promise<IResponse> => {
    return request.put({ url: '/oa-meeting/task', data })
}

// 查询任务管理信息详细
export const getTaskDetApi = (id: string): Promise<IResponse<TaskData>> => {
    return request.get({ url: '/oa-meeting/task/getById/' + id })
}

// 删除任务管理信息
export const delTaskListApi = (params: any): Promise<IResponse> => {
    return request.delete({ url: '/oa-meeting/task?ids=' + params.id })
}

//任务-完成-激活任务
export const completeTaskApi = (data: Partial<TaskData>): Promise<IResponse> => {
    return request.put({ url: '/oa-meeting/task/complete', data })
}

//获取任务接收人集合
export const getExecutorListApi = (): Promise<IResponse> => {
    return request.get({ url: '/oa-meeting/task/getExecutorList' })
}

//查看任务日志
export const getTaskLogApi = (id: string): Promise<IResponse> => {
    return request.get({ url: '/oa-meeting/task/getTaskLogById?id=' + id })
}

//任务-完成-激活任务
export const receiveOrRefuseTaskApi = (data: Recordable): Promise<IResponse> => {
    return request.put({ url: '/oa-meeting/task/receiveOrRefuse', data })
}