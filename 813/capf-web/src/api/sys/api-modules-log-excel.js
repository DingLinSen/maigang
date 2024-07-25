import httpRequest from '@/api/httpRequest'
import { API_BULKIMPORTLOG } from '@/api/sys/api-address-sys'

/**
 * 列表参数转换
 * @param {*} params 界面条件参数
 */
export const transListParams = params => {
  return Object.assign({ ...params }, {})
}

/**
 * 获取批量导入日志表 Bulkimportlog - 列表数据
 * @param {*} params 请求参数
 */
export const initBulkimportlogList = params => {
  return httpRequest.$getList({
    url: API_BULKIMPORTLOG().BASE_LIST,
    params: transListParams(params)
  })
}

/**
 * 获取批量导入日志表 Bulkimportlog - 根据 id 获取详情信息
 * @param {*} params 请求参数 -- id (id)
 */
export const initBulkimportlogDetailsById = id => {
  return httpRequest.$get({
    url: API_BULKIMPORTLOG().BASE_DETAILS_INFO,
    params: { id: id }
  })
}

/**
 * 获取批量导入日志表 Bulkimportlog - 编辑/保存
 * @param {*} params 请求参数
 */
export const operateBulkimportlogInfo = formData => {
  return httpRequest.$request({
    url: formData.isOperate
      ? API_BULKIMPORTLOG().BASE_UPDATE
      : API_BULKIMPORTLOG().BASE_SAVE,
    method: formData.isOperate ? 'put' : 'post',
    data: formData
  })
}

/**
 * 获取批量导入日志表 Bulkimportlog - 根据 IDS 删除列表数据
 * @param {*} params 请求参数 ids
 */
export const deleteBulkimportlogByIds = ids => {
  return httpRequest.$delete({
    url: API_BULKIMPORTLOG().BASE_DELETE,
    data: { ids: ids }
  })
}
