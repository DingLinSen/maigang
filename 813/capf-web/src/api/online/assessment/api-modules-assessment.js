
/**
 * 验证 AssessmentManagement -网上考核-试卷管理  - API请求
 * @param
 * @returns {}
 * @author yxm
 * @date 2022-04-07
 */
import httpRequest from '@/api/httpRequest'
import { API_ASSESSMENTMANAGEMENT } from '@/api/online/assessment/api-address-assessment'

/**
 * 列表参数转换
 * @param {*} params 界面条件参数
 */
export const transListParams = params => {
  return Object.assign({ ...params }, {})
}

/**
 * 获取网上考核-试卷管理 - assessmentManagement -列表数据
 * @param {*} params 请求参数
 */
export const initAssessmentManagementList = (params) => {
  return httpRequest.$getList({
    url: API_ASSESSMENTMANAGEMENT().BASE_LIST,
    params: transListParams(params)
  })
}

/**
 * 获取网上考核-试卷管理 - assessmentManagement-根据 id 获取详情信息
 * @param {*} params 请求参数 -- id (roleId)
 */
export const initAssessmentManagementDetailsById = (params) => {
  return httpRequest.$get({
    url: API_ASSESSMENTMANAGEMENT().BASE_DETAILS_INFO + '?id=' + params.id
  })
}

/**
 * 获取自己以及下级部门-试卷管理 - assessmentManagement-获取
 * @param {*} params 请求参数
 */
export const getAssessmentManagementDept = (params) => {
  return httpRequest.$get({
    url: API_ASSESSMENTMANAGEMENT().BASE_DEPT
  })
}

/**
 * 获取网上考核-试卷管理 - assessmentManagement-保存/编辑
 * @param {*} params 请求参数
 */
export const operateAssessmentManagementInfo = (formData) => {
  return httpRequest.$request({
    url: formData.isOperate
      ? API_ASSESSMENTMANAGEMENT().BASE_UPDATE
      : API_ASSESSMENTMANAGEMENT().BASE_SAVE,
    method: formData.isOperate ? 'put' : 'post',
    data: formData
  })
}
/**
 * 获取网上考核-试卷管理 - assessmentManagement-根据 IDS 删除列表数据
 * @param {*} params 请求参数 ids
 */
export const deleteAssessmentManagementByIds = (params) => {
  return httpRequest.$delete({
    url: API_ASSESSMENTMANAGEMENT().BASE_DELETE + '?ids=' + params.ids
  })
}

/**
 * 获取网上考核-试卷管理 - assessmentManagement- 获取所有试卷
 * @param {*} params 请求参数 -- id (roleId)
 */
 export const initAllPaper = (params) => {
  return httpRequest.$get({
    url: API_ASSESSMENTMANAGEMENT().BASE_PAPER
  })
}

/**
 * 获取网上考核-试卷管理 - assessmentManagement- 获取所有考场
 * @param {*} params 请求参数 -- id (roleId)
 */
 export const initAllRoom = (params) => {
  return httpRequest.$get({
    url: API_ASSESSMENTMANAGEMENT().BASE_ROOM
  })
}
