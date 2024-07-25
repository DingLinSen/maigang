import httpRequest from '@/api/httpRequest'
import { API_DEPT } from '@/api/sys/api-address-sys'

/**
 * 列表参数转换
 * @param {*} params 界面条件参数
 */
export const transListParams = params => {
  return Object.assign({ ...params }, {})
}

/**
 * 获取部门 dept-列表数据
 * @param {*} params 请求参数
 */
export const initDeptList = (params) => {
  return httpRequest.$getList({
    url: API_DEPT().BASE_LIST,
    params: transListParams(params)
  })
}
/**
 * 获取部门 dept-列表数据--全部
 * @param {*} params 请求参数
 */
export const initAllDeptList = (params) => {
  return httpRequest.$getList({
    url: API_DEPT().BASE_LIST_All,
    params: transListParams(params)
  })
}

/**
 * 获取部门 dept-根据 id 获取详情信息
 * @param {*} params 请求参数 -- id (roleId)
 */
export const initDeptDetailsById = (params) => {
  return httpRequest.$post({
    url: API_DEPT().BASE_DETAILS_INFO + '?id=' + params.id
  })
}

/**
 * 获取部门 dept-保存、不编辑
 * @param {*} params 请求参数
 */
export const operateDeptInfo = (formData) => {
  return httpRequest.$request({
    url: formData.isOperate
      ? API_DEPT().BASE_UPDATE
      : API_DEPT().BASE_SAVE,
    method: formData.isOperate ? 'post' : 'post',
    data: formData
  })
}
/**
 * 获取部门 dept-根据 IDS 删除列表数据
 * @param {*} params 请求参数 ids
 */
export const deleteDeptByIds = (params) => {
  return httpRequest.$post({
    url: API_DEPT().BASE_DELETE + '?ids=' + params.ids
  })
}
