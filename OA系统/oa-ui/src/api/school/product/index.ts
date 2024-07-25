//产品方案接口
import request from '@/config/axios'

// 上传文件夹级联目录与文件
export const uploadFolderOrFileDrag = (data: any): Promise<IResponse> => {
  return request.post({ url: '/oa-administrative/upload/uploadFolderOrFileDrag', data })
}

// 根据id查询文件夹与文件列表 或 根据文件名模糊查询
export const getFilesListApi = (params: any): Promise<IResponse> => {
  return request.get({
    url: '/oa-administrative/mgPropertyRightsPlan/qryPropertyRightsPlanById',
    params
  })
}
// 批量文件夹或文件删除
export const deleteBatchFolderOrFile = (params: any): Promise<IResponse> => {
  return request.delete({ url: '/oa-administrative/upload/deleteBatchFolderOrFile', params })
}

// 下载
export const downloadFolderOrFile = (params: any): Promise<IResponse> => {
  return request.get({
    url: '/upload/downloadFolderOrFile',
    params
  })
}
