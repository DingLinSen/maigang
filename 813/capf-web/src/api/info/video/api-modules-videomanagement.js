/**
 * 验证 videomanagement - 视频管理表 - API请求
 * @param
 * @returns {}
 * @author yxm
 * @date 2022-04-07
 */
import httpRequest from '@/api/httpRequest'
import { API_VIDEOMANAGEMENT } from '@/api/info/video/api-address-videomanagement'

/**
 * 列表参数转换
 * @param {*} params 界面条件参数
 */
export const transListParams = params => {
  return Object.assign({ ...params }, {})
}

/**
 * 获取视频管理表 - videomanagement -列表数据
 * @param {*} params 请求参数
 */
export const initVideoManagementList = params => {
  return httpRequest.$getList({
    url: API_VIDEOMANAGEMENT().BASE_LIST,
    params: transListParams(params)
  })
}

/**
 * 获取视频管理表 - videomanagement-根据 id 获取详情信息
 * @param {*} params 请求参数 -- id (roleId)
 */
export const initVideoManagementDetailsById = params => {
  return httpRequest.$get({
    url: API_VIDEOMANAGEMENT().BASE_DETAILS_INFO + '?id=' + params.id
  })
}

/**
 * 获取视频管理表 - videomanagement-保存/编辑
 * @param {*} params 请求参数
 */
export const operateVideoManagementInfo = formData => {
  return httpRequest.$request({
    url: formData.isOperate
      ? API_VIDEOMANAGEMENT().BASE_UPDATE
      : API_VIDEOMANAGEMENT().BASE_SAVE,
    method: 'post',
    data: formData
  })
}
/**
 * 获取视频管理表 - VideoManagement-根据 IDS 删除列表数据
 * @param {*} params 请求参数 ids
 */
export const deleteVideoManagementByIds = params => {
  return httpRequest.$delete({
    url: API_VIDEOMANAGEMENT().BASE_DELETE + '?ids=' + params.ids
  })
}
