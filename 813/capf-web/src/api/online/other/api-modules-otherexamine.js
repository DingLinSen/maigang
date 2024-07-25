
/**
 * 验证 otherexamine - 网上考核-其他考核 - API请求
 * @param
 * @returns {}
 * @author yxm
 * @date 2022-04-07
 */
import httpRequest from '@/api/httpRequest'
import { API_OTHEREXAMINE } from '@/api/online/other/api-address-otherexamine'

/**
 * 列表参数转换
 * @param {*} params 界面条件参数
 */
export const transListParams = params => {
  return Object.assign({ ...params }, {})
}

/**
 * 获取网上考核-其他考核 - otherexamine -列表数据
 * @param {*} params 请求参数
 */
export const initOtherExamineList = (params) => {
  return httpRequest.$getList({
    url: API_OTHEREXAMINE().BASE_LIST,
    params: transListParams(params)
  })
}

/**
 * 获取网上考核-其他考核 - otherexamine-根据 id 获取详情信息
 * @param {*} params 请求参数 -- id (roleId)
 */
export const initOtherExamineDetailsById = (params) => {
  return httpRequest.$get({
    url: API_OTHEREXAMINE().BASE_DETAILS_INFO + '?id=' + params.id
  })
}

/**
 * 获取网上考核-其他考核 - otherexamine-保存/编辑
 * @param {*} params 请求参数
 */
export const operateOtherExamineInfo = (formData) => {
  return httpRequest.$request({
    url: formData.isOperate
      ? API_OTHEREXAMINE().BASE_UPDATE
      : API_OTHEREXAMINE().BASE_SAVEEXCEL,
    method: formData.isOperate ? 'put' : 'post',
    data: formData
  })
}
/**
 * 获取网上考核-其他考核 - otherexamine-根据 IDS 删除列表数据
 * @param {*} params 请求参数 ids
 */
export const deleteOtherExamineByIds = (params) => {
  return httpRequest.$delete({
    url: API_OTHEREXAMINE().BASE_DELETE + '?ids=' + params.ids
  })
}
/** 导出模板
 * @param {*} params
 */
export const getFormTemplate = FormData => {
  return httpRequest.$getFile({
    url: API_OTHEREXAMINE().LIST_DOWNLOAD_URL,
    FormData: FormData
  })
}
