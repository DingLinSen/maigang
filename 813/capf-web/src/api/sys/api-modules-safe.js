
/**
 * 验证 Safe - 安全设置 - API请求
 * @param
 * @returns {}
 * @author yxm
 * @date 2022-04-08
 */
import httpRequest from '@/api/httpRequest'
import { API_SAFE } from '@/api/sys/api-address-sys'

/**
 * 列表参数转换
 * @param {*} params 界面条件参数
 */
export const transListParams = params => {
  return Object.assign({ ...params }, {})
}

/**
 * 获取安全设置 - syssafe -列表数据
 * @param {*} params 请求参数
 */
export const initSafeList = (params) => {
  return httpRequest.$getList({
    url: API_SAFE().BASE_LIST,
    params: transListParams(params)
  })
}

/**
 * 获取安全设置 - Safe-根据 id 获取详情信息
 * @param {*} params 请求参数 -- id (roleId)
 */
export const initSafeDetailsById = (params) => {
  return httpRequest.$post({
    url: API_SAFE().BASE_DETAILS_INFO + '?id=' + params.id
  })
}

/**
 * 获取安全设置 - Safe-保存/编辑
 * @param {*} params 请求参数
 */
export const operateSafeInfo = (formData) => {
  return httpRequest.$request({
    url: formData.isOperate
      ? API_SAFE().BASE_UPDATE
      : API_SAFE().BASE_SAVE,
    method: formData.isOperate ? 'post' : 'post',
    data: formData
  })
}
/**
 * 获取安全设置 - Safe-根据 IDS 删除列表数据
 * @param {*} params 请求参数 ids
 */
export const deleteSafeByIds = (params) => {
  return httpRequest.$post({
    url: API_SAFE().BASE_DELETE + '?ids=' + params.ids
  })
}
