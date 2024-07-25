import httpRequest from '@/api/httpRequest'
import { API_TRAINPROGRAM } from '@/api/trainProgram/api-address-trainProgram.js'

/**
 * 列表参数转换
 * @param {*} params 界面条件参数
 */
export const transListParams = params => {
  return Object.assign({ ...params }, {})
}

/**
 * @param {*} params 请求参数
 */
export const initProgramList = params => {
  return httpRequest.$getList({
    url: API_TRAINPROGRAM().BASE_LIST,
    params: transListParams(params)
  })
}

/**
 * 获取新型经营主体-基本信息表 - company-根据 id 获取详情信息
 * @param {*} params 请求参数 -- id (roleId)
 */
export const initProgramDetailsById = params => {
  return httpRequest.$get({
    url: API_TRAINPROGRAM().BASE_DETAILS_INFO + '?id=' + params.id
  })
}

/**
 * 获取新型经营主体-基本信息表 - company-保存/编辑
 * @param {*} params 请求参数
 */
export const saveProgramInfo = formData => {
  return httpRequest.$request({
    url: API_TRAINPROGRAM().BASE_SAVE,
    method: 'post',
    data: formData
  })
}
/**
 * 获取新型经营主体-基本信息表 - company-根据 IDS 删除列表数据
 * @param {*} params 请求参数 ids
 */
export const deleteProgramByIds = params => {
  return httpRequest.$delete({
    url: API_TRAINPROGRAM().BASE_DELETE + '?ids=' + params.ids
  })
}
