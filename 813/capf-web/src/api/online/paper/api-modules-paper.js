
/**
 * 验证 paperManagement -网上考核-试卷管理  - API请求
 * @param
 * @returns {}
 * @author yxm
 * @date 2022-04-07
 */
import httpRequest from '@/api/httpRequest'
import { API_PAPERMANAGEMENT } from '@/api/online/paper/api-address-paper'

/**
 * 列表参数转换
 * @param {*} params 界面条件参数
 */
export const transListParams = params => {
  return Object.assign({ ...params }, {})
}

/**
 * 获取网上考核-试卷管理 - paperManagement -列表数据
 * @param {*} params 请求参数
 */
export const initPaperManagementList = (params) => {
  return httpRequest.$getList({
    url: API_PAPERMANAGEMENT().BASE_LIST,
    params: transListParams(params)
  })
}

/**
 * 获取网上考核-试卷管理 - paperManagement-根据 id 获取详情信息
 * @param {*} params 请求参数 -- id (roleId)
 */
export const initPaperManagementDetailsById = (params) => {
  return httpRequest.$get({
    url: API_PAPERMANAGEMENT().BASE_DETAILS_INFO + '?id=' + params.id
  })
}

/**
 * 获取网上考核-试卷管理 - paperManagement-保存/编辑
 * @param {*} params 请求参数
 */
export const operatePaperManagementInfo = (formData) => {
  return httpRequest.$request({
    url: formData.isOperate
      ? API_PAPERMANAGEMENT().BASE_UPDATE
      : API_PAPERMANAGEMENT().BASE_SAVE,
    method: formData.isOperate ? 'put' : 'post',
    data: formData
  })
}

/**
 * 获取网上考核-试卷管理 - paperManagement-保存/编辑
 * @param {*} params 请求参数
 */
 export const importSubmitPaperManagementInfo = (formData) => {
  return httpRequest.$request({
    url: API_PAPERMANAGEMENT().BASE_IMPORT,
    method: 'post',
    data: formData
  })
}

/**
 * 获取网上考核-试卷管理 - paperManagement-根据 IDS 删除列表数据
 * @param {*} params 请求参数 ids
 */
export const deletePaperManagementByIds = (params) => {
  return httpRequest.$delete({
    url: API_PAPERMANAGEMENT().BASE_DELETE + '?ids=' + params.ids
  })
}

/**
 * 获取网上考核-试卷管理 - paperManagement-查询所有题库
 * @param {*} params 请求参数
 */
 export const getSource = (params) => {
  return httpRequest.$get({
    url: API_PAPERMANAGEMENT().BASE_BANK
  })
}

/**
 * 获取网上考核-试卷管理 - paperManagement-根据类型获取课目
 * @param {*} params 请求参数 type
 */
 export const getSubjectByType = (params) => {
  return httpRequest.$get({
    url: API_PAPERMANAGEMENT().BASE_SUBJECT + '?type=' + params.type
  })
}

/**
 * 获取网上考核-试卷管理 - paperManagement-获取考试试卷内容
 * @param {*} params 请求参数 type
 */
 export const getPaperContentById = (params) => {
  return httpRequest.$get({
    url: API_PAPERMANAGEMENT().BASE_PAPER_CONTENT + '?paperId=' + params.paperId
  })
}
