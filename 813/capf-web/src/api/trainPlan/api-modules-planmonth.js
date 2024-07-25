
/**
 * 验证 planmonth - ${comments} - API请求
 * @param
 * @returns {}
 * @author yxm
 * @date 2022-04-07
 */
import httpRequest from '@/api/httpRequest'
import { API_PLANMONTH } from '@/api/trainPlan/api-address-planmonth'

/**
 * 列表参数转换
 * @param {*} params 界面条件参数
 */
export const transListParams = params => {
  return Object.assign({ ...params }, {})
}

/**
 * 获取${comments} - planmonth -列表数据
 * @param {*} params 请求参数
 */
export const initPlanmonthList = (params) => {
  return httpRequest.$getList({
    url: API_PLANMONTH().BASE_LIST,
    params: transListParams(params)
  })
}

/**
 * 获取${comments} - planmonth-根据 id 获取详情信息
 * @param {*} params 请求参数 -- id (roleId)
 */
export const initPlanmonthDetailsById = (params) => {
  return httpRequest.$get({
    url: API_PLANMONTH().BASE_DETAILS_INFO + '?id=' + params.id
  })
}

/**
 * 获取${comments} - planmonth-保存/编辑
 * @param {*} params 请求参数
 */
export const operatePlanmonthInfo = (formData) => {
  return httpRequest.$request({
    url: formData.isOperate
      ? API_PLANMONTH().BASE_UPDATE
      : API_PLANMONTH().BASE_SAVE,
    method: formData.isOperate ? 'post' : 'post',
    data: formData
  })
}
/**
 * 获取${comments} - planmonth-根据 IDS 删除列表数据
 * @param {*} params 请求参数 ids
 */
export const deletePlanmonthByIds = (params) => {
  return httpRequest.$delete({
    url: API_PLANMONTH().BASE_DELETE + '?ids=' + params.ids
  })
}
/**
 * 获取计划-月计划表 - planyear-根据 status 修改状态
 * @param {*} params 请求参数 status
 */
export const initPlanmonthPublish = (formData) => {
  return httpRequest.$post({
    url: API_PLANMONTH().BASE_PUBLISH,
    data: formData
  })
}
/**
 * 获取计划-月计划表 - planyear-根据 年计划生成月计划
 * @param {*} params 请求参数 planId
 */
export const initPlanmonthCreatePlan = (params) => {
  return httpRequest.$post({
    url: API_PLANMONTH().BASE_CREATEPLAN,
    params: transListParams(params)
  })
}
/**
 * 获取计划-月计划表 - planyear-根据 根据年份查找年计划
 * @param {*} params 请求参数 year
 */
export const initPlanmonthGetPlanByYear = (params) => {
  return httpRequest.$get({
    url: API_PLANMONTH().BASE_GETPLANBYYEAR,
    params: transListParams(params)
  })
}
/**
 * 获取${comments} - planmonth-多条新增保存
 * @param {*} params 请求参数
 */
export const initPlanmonthSaveBatch = (formData) => {
  return httpRequest.$post({
    url: API_PLANMONTH().BASE_SAVEBATCH,
    data: formData
  })
}
