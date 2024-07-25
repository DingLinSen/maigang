/**
 * 验证 recordweek - 周训练档案表 - API请求
 * @param
 * @returns {}
 * @author yxm
 * @date 2022-04-07
 */
import httpRequest from '@/api/httpRequest'
import { API_RECORDWEEK } from '@/api/statistics/week/api-address-week'

/**
 * 列表参数转换
 * @param {*} params 界面条件参数
 */
export const transListParams = params => {
  return Object.assign({ ...params }, {})
}

/**
 * 获取周训练档案表 - recordweek -列表数据
 * @param {*} params 请求参数
 */
export const initRecordWeekList = params => {
  return httpRequest.$getList({
    url: API_RECORDWEEK().BASE_LIST,
    params: transListParams(params)
  })
}

/**
 * 获取周训练档案表 - recordweek-根据 id 获取详情信息
 * @param {*} params 请求参数 -- id (roleId)
 */
export const initRecordWeekDetailsById = params => {
  return httpRequest.$get({
    url: API_RECORDWEEK().BASE_DETAILS_INFO + '?id=' + params.id
  })
}

/**
 * 获取周训练档案表 - recordweek-保存/编辑
 * @param {*} params 请求参数
 */
export const operateRecordWeekInfo = formData => {
  return httpRequest.$request({
    url: formData.isOperate
      ? API_RECORDWEEK().BASE_UPDATE
      : API_RECORDWEEK().BASE_SAVE,
    method: formData.isOperate ? 'put' : 'post',
    data: formData
  })
}

/**
 * 获取周训练档案表 - recordweek-保存/编辑
 * @param {*} params 请求参数
 */
 export const initAllSubjectData = params => {
  return httpRequest.$get({
    url: API_RECORDWEEK().BASE_SUBJECT
  })
}

/**
 * 获取周训练档案表 - recordweek-根据 IDS 删除列表数据
 * @param {*} params 请求参数 ids
 */
 export const deleteRecordWeekByIds = params => {
  return httpRequest.$delete({
    url: API_RECORDWEEK().BASE_DELETE + '?ids=' + params.ids
  })
}

