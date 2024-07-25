/**
 * 验证 SubjectManagement - 课目管理表 - API请求
 * @param
 * @returns {}
 * @author yxm
 * @date 2022-04-07
 */
import httpRequest from '@/api/httpRequest'
import { API_SUBJECTMANAGEMENT } from '@/api/info/subject/api-address-subjectmanagement'

/**
 * 列表参数转换
 * @param {*} params 界面条件参数
 */
export const transListParams = params => {
  return Object.assign({ ...params }, {})
}

/**
 * 获取课目管理表 - subjectmanagement -列表数据
 * @param {*} params 请求参数
 */
export const initSubjectManagementList = params => {
  return httpRequest.$getList({
    url: API_SUBJECTMANAGEMENT().BASE_LIST,
    params: transListParams(params)
  })
}

/**
 * 获取课目管理表 - SubjectManagement-根据 id 获取详情信息
 * @param {*} params 请求参数 -- id (roleId)
 */
export const initSubjectManagementDetailsById = params => {
  return httpRequest.$get({
    url: API_SUBJECTMANAGEMENT().BASE_DETAILS_INFO + '?id=' + params.id
  })
}

/**
 * 获取课目管理表 - SubjectManagement-保存/编辑
 * @param {*} params 请求参数
 */
export const operateSubjectManagementInfo = formData => {
  return httpRequest.$request({
    url: formData.isOperate
      ? API_SUBJECTMANAGEMENT().BASE_UPDATE
      : API_SUBJECTMANAGEMENT().BASE_SAVE,
    method: 'post',
    data: formData
  })
}
/**
 * 获取课目管理表 - SubjectManagement-根据 IDS 删除列表数据
 * @param {*} params 请求参数 ids
 */
export const deleteSubjectManagementByIds = params => {
  return httpRequest.$delete({
    url: API_SUBJECTMANAGEMENT().BASE_DELETE + '?ids=' + params.ids
  })
}
