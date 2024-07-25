import request from '@/config/axios'
import { downloadDoc } from '@/api/common'

//新增授权管理信息
export const saveAuthorizeManageApi = (data: any): Promise<IResponse> => {
  return request.post({ url: '/license-manager/auth/save', data })
}
//修改授权管理信息
export const editAuthorizeManageApi = (data: any): Promise<IResponse> => {
  return request.put({ url: '/license-manager/auth/edit', data })
}
//删除授权管理信息
export const delAuthorizeManageListApi = (ids: string): Promise<IResponse> => {
  return request.delete({ url: '/license-manager/auth/delete?id=' + ids })
}
//获取分页授权管理信息
export const getAuthorizeManageListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/license-manager/auth/list', params })
}
//根据id查询授权管理信息
export const getAuthorizeManageDetailApi = (id: string): Promise<IResponse> => {
  return request.get({ url: '/license-manager/auth/getById?id=' + id })
}
//审批授权管理信息
export const auditAuthorizeManageApi = (data: any): Promise<IResponse> => {
  return request.post({ url: '/license-manager/auth/audit', data })
}
//证书生成
export const authAuthorizeManageApi = (data: any): Promise<IResponse> => {
  return request.post({ url: '/license-manager/auth/authGenerate', data })
}
//发布
export const publishAuthorizeManageApi = (params: any): Promise<IResponse> => {
  return request.post({ url: '/license-manager/auth/publish', params })
}
//撤回
export const withdrawAuthorizeManageApi = (params: any): Promise<IResponse> => {
  return request.post({ url: '/license-manager/auth/unPublish', params })
}
//下载授权文件
export const downloadAuthorizeApi = (id: any, fileName: string) => {
  return downloadDoc(
    `/license-manager/license/${id}/download`,
    {},
    fileName + `授权文件_${new Date().getTime()}.lic`
  )
}