
/**
 * 验证 titlemanagement - 题库管理表 - API请求
 * @param
 * @returns {}
 * @author yxm
 * @date 2022-04-07
 */
import httpRequest from '@/api/httpRequest'
import { API_TITLEMANAGEMENT } from '@/api/info/question/api-address-titlemanagement'

/**
 * 列表参数转换
 * @param {*} params 界面条件参数
 */
export const transListParams = params => {
  return Object.assign({ ...params }, {})
}

/**
 * 获取题库管理表 - titlemanagement -列表数据
 * @param {*} params 请求参数
 */
export const initTitleManagementList = (params) => {
  return httpRequest.$getList({
    url: API_TITLEMANAGEMENT().BASE_LIST,
    params: transListParams(params)
  })
}

/**
 * 获取题库管理表 - titlemanagement-根据 id 获取详情信息
 * @param {*} params 请求参数 -- id (roleId)
 */
export const initTitleManagementDetailsById = (params) => {
  return httpRequest.$get({
    url: API_TITLEMANAGEMENT().BASE_DETAILS_INFO + '?id=' + params.id
  })
}

/**
 * 获取题库管理表 - titlemanagement-保存/编辑
 * @param {*} params 请求参数
 */
export const operateTitleManagementInfo = (formData) => {
  return httpRequest.$request({
    url: formData.isOperate
      ? API_TITLEMANAGEMENT().BASE_UPDATE
      : API_TITLEMANAGEMENT().BASE_SAVE,
    method: 'post',
    data: formData
  })
}
/**
 * 获取题库管理表 - titlemanagement-根据 IDS 删除列表数据
 * @param {*} params 请求参数 ids
 */
export const deleteTitleManagementByIds = (params) => {
  return httpRequest.$delete({
    url: API_TITLEMANAGEMENT().BASE_DELETE + '?ids=' + params.ids
  })
}
