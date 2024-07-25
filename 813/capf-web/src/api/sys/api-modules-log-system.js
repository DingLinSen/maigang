import httpRequest from '@/api/httpRequest'
import { API_LOG } from '@/api/sys/api-address-sys'

/**
 * 列表参数转换
 * @param {*} params 界面条件参数
 */
export const transListParams = params => {
  return Object.assign({ ...params }, {})
}

/**
 * 获取系统日志表 Log - 列表数据
 * @param {*} params 请求参数
 */
export const initLogList = params => {
  return httpRequest.$getList({
    url: API_LOG().BASE_LIST,
    params: transListParams(params)
  })
}

/**
 * 获取系统日志表 Log - 根据 id 获取详情信息
 * @param {*} params 请求参数 -- id (id)
 */
export const initLogDetailsById = id => {
  return httpRequest.$get({
    url: API_LOG().BASE_DETAILS_INFO,
    params: { id: id }
  })
}

/**
 * 获取系统日志表 Log - 编辑/保存
 * @param {*} params 请求参数
 */
export const operateLogInfo = formData => {
  return httpRequest.$request({
    url: formData.isOperate ? API_LOG().BASE_UPDATE : API_LOG().BASE_SAVE,
    method: formData.isOperate ? 'put' : 'post',
    data: formData
  })
}

/**
 * 获取系统日志表 Log - 根据 IDS 删除列表数据
 * @param {*} params 请求参数 ids
 */
export const deleteLogByIds = ids => {
  return httpRequest.$delete({
    url: API_LOG().BASE_DELETE,
    data: { ids: ids }
  })
}
