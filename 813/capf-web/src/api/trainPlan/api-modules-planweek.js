/**
 * 验证 planweek - 计划-周计划表 - API请求
 * @param
 * @returns {}
 * @author yxm
 * @date 2022-04-07
 */
import httpRequest from '@/api/httpRequest'
import { API_PLANWEEK } from '@/api/trainPlan/api-address-planweek'

/**
 * 列表参数转换
 * @param {*} params 界面条件参数
 */
export const transListParams = params => {
  return Object.assign({ ...params }, {})
}

/**
 * 获取计划-周计划表 - planweek -列表数据
 * @param {*} params 请求参数
 */
export const initPlanweekList = params => {
  return httpRequest.$getList({
    url: API_PLANWEEK().BASE_LIST,
    params: transListParams(params)
  })
}

/**
 * 获取计划-周计划表 - planweek-根据 id 获取详情信息
 * @param {*} params 请求参数 -- id (roleId)
 */
export const initPlanweekDetailsById = params => {
  return httpRequest.$get({
    url: API_PLANWEEK().BASE_DETAILS_INFO + '?id=' + params.id
  })
}

/**
 * 获取计划-周计划表 - planweek-保存/编辑
 * @param {*} params 请求参数
 */
export const operatePlanweekInfo = formData => {
  return httpRequest.$request({
    url: formData.isOperate
      ? API_PLANWEEK().BASE_UPDATE
      : API_PLANWEEK().BASE_SAVE,
    method: formData.isOperate ? 'post' : 'post',
    data: formData
  })
}
/**
 * 获取计划-周计划表 - planweek-根据 IDS 删除列表数据
 * @param {*} params 请求参数 ids
 */
export const deletePlanweekByIds = params => {
  return httpRequest.$delete({
    url: API_PLANWEEK().BASE_DELETE + '?ids=' + params.ids
  })
}
/**
 * 获取计划-周计划表 - planweek-根据 status 修改状态
 * @param {*} params 请求参数 status
 */
export const initPlanWeekStatus = formData => {
  return httpRequest.$post({
    url: API_PLANWEEK().BASE_STATUS,
    data: formData
  })
}
/**
 * 获取计划-周计划表 - planweek-根据 publish 发布
 * @param {*} params 请求参数 status
 */
export const initPlanWeekPublish = params => {
  return httpRequest.$post({
    url: API_PLANWEEK().BASE_PUBLISH + '?id=' + params.id
    // data: formData
  })
}
/**
 * 获取计划-周计划表 - planweek-根据 revoke 发布
 * @param {*} params 请求参数 status
 */
export const initPlanWeekRevoke = params => {
  return httpRequest.$post({
    url: API_PLANWEEK().BASE_REVOKE + '?id=' + params.id
    // data: formData
  })
}
/**
 * 获取计划-月计划表 - planweek-根据 年计划生成月计划
 * @param {*} params 请求参数 planId
 */
export const initPlanweekCreatePlan = params => {
  return httpRequest.$post({
    url: API_PLANWEEK().BASE_CREATEPLAN,
    params: transListParams(params)
  })
}
/**
 * 获取计划-月计划表 - planweek-根据 根据年份查找年计划
 * @param {*} params 请求参数 year
 */
export const initPlanweekGetPlanByYear = params => {
  return httpRequest.$get({
    url: API_PLANWEEK().BASE_GETPLANBYYEAR,
    params: transListParams(params)
  })
}
/**
 * 获取${comments} - planweek-多条新增保存
 * @param {*} params 请求参数
 */
export const initPlanweekSaveBatch = formData => {
  return httpRequest.$post({
    url: API_PLANWEEK().BASE_SAVEBATCH,
    data: formData
  })
}

/**
 * 获取${comments} - planweek-获取所有考核
 * @param {*} params 请求参数
 */
export const getAllAssessmentList = params => {
  return httpRequest.$get({
    url: API_PLANWEEK().BASE_ASS + '?deptId=' + params.deptId
    // data: formData
  })
}
