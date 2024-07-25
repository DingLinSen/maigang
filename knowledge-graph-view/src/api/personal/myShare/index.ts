import request from '@/config/axios'
// 分享列表
export const getMyShareListApi = (params: any): Promise<IResponse> => {
    return request.get({url: '/knowledge-mapping/share/myShare', params})
}
// 分享
export const shareApi = (data: Partial<any>): Promise<IResponse> => {
    return request.post({url: '/knowledge-mapping/share/share', data})
}
// 取消分享
export const cancelShareApi = (data: Partial<any>): Promise<IResponse> => {
    return request.post({
        url: '/knowledge-mapping/share/cancelShare',
        data,
        headersType: 'multipart/form-data'
    })
}
// 根据uuid获取分享信息
export const getByUuidApi = (params: any): Promise<any> => {
    return request.get({url: '/knowledge-mapping/share/getByUuid', params})
}
// // 删除
// export const delDownloadRecordApi = (id: any): Promise<IResponse> => {
//   return request.delete({ url: '/knowledge-mapping/downloadRecords/remove', params: { id } })
// }
