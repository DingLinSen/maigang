/**
 * 验证 recordsubject - 课目统计 - API请求
 * @param
 * @returns {}
 * @author yxm
 * @date 2022-04-07
 */
import httpRequest from '@/api/httpRequest'
import { API_RECORDSUBJECT } from '@/api/statistics/subject/api-address-subject'

/**
 * 列表参数转换
 * @param {*} params 界面条件参数
 */
export const transListParams = params => {
  return Object.assign({ ...params }, {})
}

/**
 * 获取课目统计 - recordsubject -列表数据
 * @param {*} params 请求参数
 */
export const initRecordSubjectList = params => {
  return httpRequest.$getList({
    url: API_RECORDSUBJECT().BASE_LIST,
    params: transListParams(params)
  })
}

/**
 * 获取课目统计 - recordsubject-根据 id 获取详情信息
 * @param {*} params 请求参数 -- id (roleId)
 */
export const initRecordSubjectDetailsById = params => {
  return httpRequest.$get({
    url: API_RECORDSUBJECT().BASE_DETAILS_INFO + '?id=' + params.id
  })
}

/**
 * 获取课目统计 - recordsubject-保存/编辑
 * @param {*} params 请求参数
 */
export const operateRecordSubjectInfo = formData => {
  return httpRequest.$request({
    url: formData.isOperate
      ? API_RECORDSUBJECT().BASE_UPDATE
      : API_RECORDSUBJECT().BASE_SAVE,
    method: formData.isOperate ? 'put' : 'post',
    data: formData
  })
}

/**
 * 获取课目统计 - recordsubject-保存/编辑
 * @param {*} params 请求参数
 */
 export const initAllSubjectData = params => {
  return httpRequest.$get({
    url: API_RECORDSUBJECT().BASE_SUBJECT
  })
}

/**
 * 获取课目统计 - recordsubject-根据 IDS 删除列表数据
 * @param {*} params 请求参数 ids
 */
 export const deleteRecordSubjectByIds = params => {
  return httpRequest.$delete({
    url: API_RECORDSUBJECT().BASE_DELETE + '?ids=' + params.ids
  })
}

