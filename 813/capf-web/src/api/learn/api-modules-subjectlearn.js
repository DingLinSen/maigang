
/**
 * 验证 Subjectlearn - 课目学习主表 - API请求
 * @param
 * @returns {}
 * @author yxm
 * @date 2022-04-07
 */
import httpRequest from '@/api/httpRequest'
import { API_SUBJECT, API_SUBJECT_PHOTO } from '@/api/learn/api-address-subjectlearn.js'

/**
 * 列表参数转换
 * @param {*} params 界面条件参数
 */
export const transListParams = params => {
  return Object.assign({ ...params }, {})
}

/**
 * 获取课目学习主表 - Subjectlearn -列表数据
 * @param {*} params 请求参数
 */
export const initSubjectlearnList = (params) => {
  return httpRequest.$getList({
    url: API_SUBJECT().BASE_LIST,
    params: transListParams(params)
  })
}

/**
 * 获取课目学习主表 - Subjectlearn -列表数据
 * @param {*} params 请求参数
 */
export const initSubjectlearn = (params) => {
  return httpRequest.$get({
    url: API_SUBJECT().BASE_LEARN,
    params: transListParams(params)
  })
}

/**
 * 获取课目学习主表 - Subjectlearn-根据 id 获取详情信息
 * @param {*} params 请求参数 -- id (roleId)
 */
export const initSubjectlearnDetailsById = (params) => {
  return httpRequest.$get({
    url: API_SUBJECT().BASE_DETAILS_INFO,
    params: transListParams(params)
  })
}
/**
 * 获取课目学习主表 - Subjectlearn-根据 id 获取详情信息 支队和普通用户
 * @param {*} params 请求参数 -- id (roleId)
 */
export const initSubjectlearnDetailsByIdSub = (params) => {
  return httpRequest.$get({
    url: API_SUBJECT().BASE_DETAILS_INFO_SUB,
    params: transListParams(params)
  })
}
/**
 * 获取课目学习主表 - Subjectlearn- 学习日志
 * @param {*} params 请求参数 -- id (roleId)
 */
export const initSubjectlearnLog = (params) => {
  return httpRequest.$get({
    url: API_SUBJECT().BASE_LOG,
    params: transListParams(params)
  })
}

/**
 * 获取课目学习主表 - Subjectlearn-保存/编辑
 * @param {*} params 请求参数
 */
export const operateSubjectlearnInfo = (formData) => {
  return httpRequest.$request({
    url: formData.isOperate
      ? API_SUBJECT().BASE_UPDATE
      : API_SUBJECT().BASE_SAVE,
    method: formData.isOperate ? 'put' : 'post',
    data: formData
  })
}
/**
 * 获取课目学习主表 - Subjectlearn-根据 IDS 删除列表数据
 * @param {*} params 请求参数 ids
 */
export const deleteSubjectlearnByIds = (params) => {
  return httpRequest.$delete({
    url: API_SUBJECT().BASE_DELETE + '?ids=' + params.ids
  })
}
/**
 * 获取课目学习主表 - Subjectlearn-保存/编辑-学习是的图片
 * @param {*} params 请求参数
 */
// 1 学习拍照 2 考试照片
export const operateSubjectlearnPhotoInfo = (formData) => {
  return httpRequest.$request({
    url: formData.isOperate
      ? API_SUBJECT_PHOTO().BASE_UPDATE
      : API_SUBJECT_PHOTO().BASE_SAVE,
    method: formData.isOperate ? 'put' : 'post',
    data: formData
  })
}
