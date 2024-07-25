import httpRequest from '@/api/httpRequest'
import { API_ROLE } from '@/api/sys/api-address-sys'

/**
 * 列表参数转换
 * @param {*} params 界面条件参数
 */
export const transListParams = params => {
  return Object.assign({ ...params }, {})
}

/**
 * 获取角色 Role-列表数据
 * @param {*} params 请求参数
 */
export const initRoleList = (params) => {
  return httpRequest.$getList({
    url: API_ROLE().BASE_LIST,
    params: transListParams(params)
  })
}

/**
 * 获取角色 Role-列表数据 获取查询可用的角色
 * @param {*} params 请求参数
 */
export const initAllRoleList = (params) => {
  return httpRequest.$getList({
    url: API_ROLE().BASE_LIST_SEARCH,
    params: transListParams(params)
  })
}

/**
 * 获取角色 Role-根据 id 获取详情信息
 * @param {*} params 请求参数 -- id (roleId)
 */
export const initRoleDetailsById = (params) => {
  return httpRequest.$get({
    url: API_ROLE().BASE_DETAILS_INFO + '?id=' + params.id
  })
}

/**
 * 获取角色 Role-保存、不编辑
 * @param {*} params 请求参数
 */
export const operateRoleInfo = (formData) => {
  return httpRequest.$request({
    url: formData.isOperate
      ? API_ROLE().BASE_UPDATE
      : API_ROLE().BASE_SAVE,
    method: formData.isOperate ? 'put' : 'post',
    data: formData
  })
}
/**
 * 获取角色 Role-根据 IDS 删除列表数据
 * @param {*} params 请求参数 ids
 */
export const deleteRoleByIds = (params) => {
  return httpRequest.$delete({
    url: API_ROLE().BASE_DELETE + '?ids=' + params.ids
  })
}
