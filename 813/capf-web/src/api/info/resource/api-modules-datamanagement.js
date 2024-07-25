/**
 * 验证 datamanagement - ${comments} - API请求
 * @param
 * @returns {}
 * @author yxm
 * @date 2022-04-07
 */
import httpRequest from '@/api/httpRequest'
import { API_DATAMANAGEMENT } from '@/api/info/resource/api-address-datamanagement'

/**
 * 列表参数转换
 * @param {*} params 界面条件参数
 */
export const transListParams = params => {
  return Object.assign({ ...params }, {})
}

/**
 * 获取${comments} - datamanagement -列表数据
 * @param {*} params 请求参数
 */
export const initDataManagementList = params => {
  return httpRequest.$getList({
    url: API_DATAMANAGEMENT().BASE_LIST,
    params: transListParams(params)
  })
}

/**
 * 获取${comments} - datamanagement-根据 id 获取详情信息
 * @param {*} params 请求参数 -- id (roleId)
 */
export const initDataManagementDetailsById = params => {
  return httpRequest.$get({
    url: API_DATAMANAGEMENT().BASE_DETAILS_INFO + '?id=' + params.id
  })
}

/**
 * 获取${comments} - datamanagement-根据 id 获取详情信息
 * @param {*} params 请求参数 -- id (roleId)
 */
 export const initSubjectList = params => {
  return httpRequest.$get({
    url: API_DATAMANAGEMENT().BASE_SUBJECT
  })
}

/**
 * 获取${comments} - datamanagement-保存/编辑
 * @param {*} params 请求参数
 */
export const operateDataManagementInfo = formData => {
  return httpRequest.$request({
    url: formData.isOperate
      ? API_DATAMANAGEMENT().BASE_UPDATE
      : API_DATAMANAGEMENT().BASE_SAVE,
    method: 'post',
    data: formData
  })
}
/**
 * 获取${comments} - datamanagement-根据 IDS 删除列表数据
 * @param {*} params 请求参数 ids
 */
export const deleteDataManagementByIds = params => {
  return httpRequest.$delete({
    url: API_DATAMANAGEMENT().BASE_DELETE + '?ids=' + params.ids
  })
}
