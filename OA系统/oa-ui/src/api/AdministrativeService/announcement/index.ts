// 公司公告-制度管理接口
import request from '@/config/axios'

// 公司公告-制度新增
export const addAnnouncementOrInstitution = (data: any): Promise<IResponse> => {
  return request.post({ url: '/oa-administrative/tinfoAnnouncement', data })
}

// 获取公司公告-制度管理信息
export const getAnnouncementOrInstitution = (params: any): Promise<IResponse> => {
  return request.get({ url: '/oa-administrative/tinfoAnnouncement', params })
}

// 根据id获取详情信息
export const getDetailAnnouncementOrInstitution = (params: any): Promise<IResponse> => {
  return request.get({ url: '/oa-administrative/tinfoAnnouncement/findById', params })
}

// 公司公告-制度修改
export const editAnnouncementOrInstitution = (data: any): Promise<IResponse> => {
  return request.put({ url: '/oa-administrative/tinfoAnnouncement', data })
}

// 根据id删除公告，支持批量删除
export const delAnnouncementOrInstitution = (params: any): Promise<IResponse> => {
  return request.delete({ url: '/oa-administrative/tinfoAnnouncement?ids=' + params.id })
}

// 根据id发布公告-制度，支持批量发布
export const publishAnnouncementOrInstitution = (params: any): Promise<IResponse> => {
  return request.post({ url: '/oa-administrative/tinfoAnnouncement/publish', params })
}
// 公司公告-制度撤回
export const revocationAnnouncementOrInstitution = (params: any): Promise<IResponse> => {
  return request.post({ url: '/oa-administrative/tinfoAnnouncement/cancel', params })
}

//查询重要且未读公告与制度
export const getUnreadInfoApi = (): Promise<IResponse> => {
  return request.get({ url: '/oa-administrative/tinfoAnnouncement/qryImportmentUnReadInfomation' })
}

//修改已读状态
export const updateReadFlagApi = (data: any): Promise<IResponse> => {
  return request.post({ url: '/oa-administrative/tinfoAnnouncement/updateFlag', data })
}
