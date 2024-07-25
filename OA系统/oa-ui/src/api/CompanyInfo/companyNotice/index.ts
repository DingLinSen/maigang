import request from '@/config/axios'

export const getTinfoAnnouncementApi = (params): Promise<IResponse> => {
  return request.get({ url: '/oa-administrative/tinfoAnnouncement', params })
}
