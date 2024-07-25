import httpRequest from '@/api/httpRequest'
import { API_EXAMINEUSERPOINT } from '@/api/online/examine/api-address-examineUserpoint'

/**
 * 列表参数转换
 * @param {*} params 界面条件参数
 */
export const transListParams = params => {
  return Object.assign({ ...params }, {})
}

/**
 * 获取网上考核-成绩管理 - examinepoint -列表数据
 * @param {*} params 请求参数
 */
export const initExamineUserPointList = (params) => {
  return httpRequest.$getList({
    url: API_EXAMINEUSERPOINT().BASE_LIST,
    params: transListParams(params)
  })
}