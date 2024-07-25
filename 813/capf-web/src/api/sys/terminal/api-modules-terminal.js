
/**
 * 验证 Terminal - 系统管理-终端管理 - API请求
 * @param
 * @returns {}
 * @author yxm
 * @date 2022-04-07
 */
import httpRequest from '@/api/httpRequest'
import { API_TERMINAL } from '@/api/sys/terminal/api-address-terminal'

/**
 * 列表参数转换
 * @param {*} params 界面条件参数
 */
export const transListParams = params => {
  return Object.assign({ ...params }, {})
}

/**
 * 获取系统管理-终端管理 - Terminal -列表数据
 * @param {*} params 请求参数
 */
export const initTerminalList = (params) => {
  return httpRequest.$getList({
    url: API_TERMINAL().BASE_LIST,
    params: transListParams(params)
  })
}

/**
 * 获取系统管理-终端管理 - Terminal-根据 id 获取详情信息
 * @param {*} params 请求参数 -- id (roleId)
 */
export const initTerminalDetailsById = (params) => {
  return httpRequest.$post({
    url: API_TERMINAL().BASE_DETAILS_INFO + '?id=' + params.id
  })
}

/**
 * 获取系统管理-终端管理 - Terminal-保存/编辑
 * @param {*} params 请求参数
 */
export const operateTerminalInfo = (formData) => {
  return httpRequest.$request({
    url: formData.isOperate
      ? API_TERMINAL().BASE_UPDATE
      : API_TERMINAL().BASE_SAVE,
    method: formData.isOperate ? 'post' : 'post',
    data: formData
  })
}
/**
 * 获取系统管理-终端管理 - Terminal-根据 IDS 删除列表数据
 * @param {*} params 请求参数 ids
 */
export const deleteTerminalByIds = (params) => {
  return httpRequest.$post({
    url: API_TERMINAL().BASE_DELETE + '?ids=' + params.ids
  })
}
