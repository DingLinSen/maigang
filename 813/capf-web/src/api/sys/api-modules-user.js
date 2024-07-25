import httpRequest from '@/api/httpRequest'
import { API_USER } from '@/api/sys/api-address-sys'

/**
 * 获取系统用户 User-列表数据
 * @param {*} params 请求参数
 */
export const initUserList = params => {
  return httpRequest.$get({
    url: API_USER().BASE_LIST,
    params: params
  })
}

/**
 * 获取系统用户 User-根据 id 获取详情信息
 * @param {*} params 请求参数 -- id (userId)
 */
export const initUserDetailsById = params => {
  return httpRequest.$get({
    url: API_USER().BASE_DETAILS_INFO,
    params: params
  })
}

/**
 * 系统用户 user - 编辑/保存
 * @param {*} params 请求参数
 */
export const operateUserInfo = (formData) => {
  return httpRequest.$request({
    url: formData.isOperate
      ? API_USER().BASE_UPDATE
      : API_USER().BASE_SAVE,
    method: formData.isOperate ? 'put' : 'post',
    data: formData
  })
}

/**
 * 系统用户 -- 删除用户
 */
export const deleteUserByIds = params => {
  return httpRequest.$delete({
    url: API_USER().BASE_DELETE + '?' + 'ids' + '=' + params.ids
  })
}
/**
 * 系统用户 -- 修改密码
 */
export const changePassword = params => {
  return httpRequest.$post({
    url: encodeURI(
      API_USER().BASE_PASSWORD
    ),
    data: params
  })
}

/**
 * 系统用户 user -修改用户状态，启用或是禁用
 * @param {*} params 请求参数
 */
export const operateUserStatus = (formData) => {
  return httpRequest.$request({
    url: API_USER().BASE_STATUS,
    method: 'put',
    data: formData
  })
}
