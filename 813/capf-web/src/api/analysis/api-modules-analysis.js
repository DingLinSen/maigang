
import httpRequest from '@/api/httpRequest'
import { API_ANALYSIS } from '@/api/analysis/api-address-analysis'

/**
 * 列表参数转换
 * @param {*} params 界面条件参数
 */
export const transListParams = params => {
  return Object.assign({ ...params }, {})
}

export const initAnalysis = (params) => {
  return httpRequest.$get({
    url: API_ANALYSIS().BASE_GETDATA + '?deptId=' + params.deptId + '&year=' + params.year
  })
}

export const initAnalysisBylist = (params) => {
  return httpRequest.$get({
    url: API_ANALYSIS().BASE_GETUSERPAGEBYLIST + '?deptId=' + params.deptId + '&year=' + params.year
  })
}

export const getLearnTime = (params) => {
  return httpRequest.$get({
    url: API_ANALYSIS().BASE_LEARN,
    params: transListParams(params)
  })
}
