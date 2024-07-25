
/**
 * 验证 planyear - 计划-年计划表 - API请求
 * @param
 * @returns {}
 * @author yxm
 * @date 2022-04-07
 */
import httpRequest from '@/api/httpRequest'
import { API_PLANYEAR } from '@/api/trainPlan/api-address-planyear'

/**
 * 列表参数转换
 * @param {*} params 界面条件参数
 */
export const transListParams = params => {
  return Object.assign({ ...params }, {})
}

/**
 * 获取计划-年计划表 - planyear -列表数据
 * @param {*} params 请求参数
 */
export const initPlanyearList = (params) => {
  return httpRequest.$getList({
    url: API_PLANYEAR().BASE_LIST,
    params: transListParams(params)
  })
}

/**
 * 获取计划-年计划表 - planyear-根据 id 获取详情信息
 * @param {*} params 请求参数 -- id (roleId)
 */
export const initPlanyearDetailsById = (params) => {
  return httpRequest.$get({
    url: API_PLANYEAR().BASE_DETAILS_INFO + '?id=' + params.id
  })
}

/**
 * 获取计划-年计划表 - planyear-保存/编辑
 * @param {*} params 请求参数
 */
export const operatePlanyearInfo = (formData) => {
  return httpRequest.$post({
    url: formData.isOperate
      ? API_PLANYEAR().BASE_UPDATE
      : API_PLANYEAR().BASE_SAVE,
    // method: formData.isOperate ? 'put' : 'post',
    data: formData
  })
}
/**
 * 获取计划-年计划表 - planyear-根据 IDS 删除列表数据
 * @param {*} params 请求参数 ids
 */
export const deletePlanyearByIds = (params) => {
  return httpRequest.$delete({
    url: API_PLANYEAR().BASE_DELETE + '?ids=' + params.ids
  })
}
/**
 * 获取计划-年计划表 - planyear-根据 subjectId 获取时长
 * @param {*} params 请求参数 subjectId
 */
export const initPlanyearGetTime = (params) => {
  return httpRequest.$get({
    url: API_PLANYEAR().BASE_GETTIME + '?subjectIds=' + params.subjectId
  })
}
/**
 * 获取计划-年计划表 - planyear-根据 status 修改状态
 * @param {*} params 请求参数 status
 */
export const initPlanyearPublish = (formData) => {
  return httpRequest.$post({
    url: API_PLANYEAR().BASE_PUBLISH,
    data: formData
  })
}
