/**
 * 验证 technical- 专业技术-发报技术 - API请求
 * @param
 * @returns {}
 * @author yxm
 * @date 2022-05-09
 */
import httpRequest from '@/api/httpRequest'
import { API_TRANSMIT } from '@/api/technical/api-address-technical.js'

/**
 * 列表参数转换
 * @param {*} params 界面条件参数
 */
export const transListParams = params => {
  return Object.assign({ ...params }, {})
}

/**
 * 获取发报技术表 - transmit -列表数据 全部数据
 * @param {*} params 请求参数
 */
export const initTransmitList = params => {
  return httpRequest.$getList({
    url: API_TRANSMIT().BASE_LIST,
    params: transListParams(params)
  })
}

/**
 * 获取发报技术表 - transmit-根据 id 获取详情信息
 * @param {*} params 请求参数 -- id (roleId)
 */
export const initTransmitDetailsById = params => {
  return httpRequest.$get({
    url: API_TRANSMIT().BASE_DETAILS_INFO,
    params: transListParams(params)
  })
}

/**
 * 获取发报技术表 - transmit-随机抽取
 * @param {*} params 请求参数 -- id
 */
export const initTransmitExtract = params => {
  return httpRequest.$get({
    url: API_TRANSMIT().BASE_EXTRACT,
    params: transListParams(params)
  })
}
/**
 * 获取发报技术表 - transmit-保存/编辑
 * @param {*} params 请求参数
 */
export const operateTransmitInfo = formData => {
  return httpRequest.$request({
    url: formData.isOperate
      ? API_TRANSMIT().BASE_UPDATE
      : API_TRANSMIT().BASE_SAVE,
    method: 'post',
    data: formData
  })
}
/**
 * 获取发报技术表 - Transmit-根据 IDS 删除列表数据
 * @param {*} params 请求参数 ids
 */
export const offlineControlByIds = params => {
  return httpRequest.$delete({
    url: API_TRANSMIT().BASE_DELETE,
    params: transListParams(params)
  })
}
