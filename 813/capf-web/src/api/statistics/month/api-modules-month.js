/**
 * 验证 RecordMonth - 月训练档案表 - API请求
 * @param
 * @returns {}
 * @author yxm
 * @date 2022-04-07
 */
import httpRequest from '@/api/httpRequest'
import { API_RECORDMONTH } from '@/api/statistics/month/api-address-month'

/**
 * 列表参数转换
 * @param {*} params 界面条件参数
 */
export const transListParams = params => {
  return Object.assign({ ...params }, {})
}

/**
 * 获取月训练档案表 - RecordMonth -列表数据
 * @param {*} params 请求参数
 */
export const initRecordMonthList = params => {
  return httpRequest.$getList({
    url: API_RECORDMONTH().BASE_LIST,
    params: transListParams(params)
  })
}

/**
 * 获取月训练档案表 - RecordMonth-根据 id 获取详情信息
 * @param {*} params 请求参数 -- id (roleId)
 */
export const initRecordMonthDetailsById = params => {
  return httpRequest.$get({
    url: API_RECORDMONTH().BASE_DETAILS_INFO + '?id=' + params.id
  })
}

/**
 * 获取月训练档案表 - RecordMonth-保存/编辑
 * @param {*} params 请求参数
 */
export const operateRecordMonthInfo = formData => {
  return httpRequest.$request({
    url: formData.isOperate
      ? API_RECORDMONTH().BASE_UPDATE
      : API_RECORDMONTH().BASE_SAVE,
    method: formData.isOperate ? 'put' : 'post',
    data: formData
  })
}

/**
 * 获取月训练档案表 - RecordMonth-根据 IDS 删除列表数据
 * @param {*} params 请求参数 ids
 */
 export const deleteRecordMonthByIds = params => {
  return httpRequest.$delete({
    url: API_RECORDMONTH().BASE_DELETE + '?ids=' + params.ids
  })
}

