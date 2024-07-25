
/**
 * 验证 examinepoint - 网上考核-成绩管理 - API请求
 * @param
 * @returns {}
 * @author yxm
 * @date 2022-04-07
 */
import httpRequest from '@/api/httpRequest'
import { API_EXAMINEPOINT } from '@/api/online/achievement/api-address-examinepoint'

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
export const initExaminePointList = (params) => {
  return httpRequest.$getList({
    url: API_EXAMINEPOINT().BASE_LIST,
    params: transListParams(params)
  })
}

/**
 * 获取网上考核-成绩管理 - examinepoint-根据 id 获取详情信息
 * @param {*} params 请求参数 -- id (roleId)
 */
export const initexaminepointDetailsById = (params) => {
  return httpRequest.$get({
    url: API_EXAMINEPOINT().BASE_DETAILS_INFO + '?id=' + params.id
  })
}

/**
 * 获取网上考核-成绩管理 - examinepoint-保存/编辑
 * @param {*} params 请求参数
 */
export const operateexaminepointInfo = (formData) => {
  return httpRequest.$request({
    url: formData.isOperate
      ? API_EXAMINEPOINT().BASE_UPDATE
      : API_EXAMINEPOINT().BASE_SAVE,
    method: formData.isOperate ? 'put' : 'post',
    data: formData
  })
}
/**
 * 获取网上考核-成绩管理 - examinepoint-根据 IDS 删除列表数据
 * @param {*} params 请求参数 ids
 */
export const deleteExaminePointByIds = (params) => {
  return httpRequest.$delete({
    url: API_EXAMINEPOINT().BASE_DELETE + '?ids=' + params.ids
  })
}
/**
 * 获取网上考核-成绩管理 - examinepoint-查看
 * @param {*} params 请求参数 ids
 */
export const parentIdExaminePointByIds = (params) => {
  return httpRequest.$get({
    url: API_EXAMINEPOINT().BASE_PARENTID + '?parentId=' + params.parentId
  })
}
