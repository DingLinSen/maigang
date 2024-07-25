
/**
 * 验证 ExaminationrRoom - 信息管理-考场管理 - API请求
 * @param
 * @returns {}
 * @author yxm
 * @date 2022-04-07
 */
import httpRequest from '@/api/httpRequest'
import { API_ROOM } from '@/api/info/room/api-address-examinationroom.js'

/**
 * 列表参数转换
 * @param {*} params 界面条件参数
 */
export const transListParams = params => {
  return Object.assign({ ...params }, {})
}

/**
 * 获取信息管理-考场管理 - ExaminationrRoom -列表数据
 * @param {*} params 请求参数
 */
export const initExaminationrRoomList = (params) => {
  return httpRequest.$getList({
    url: API_ROOM().BASE_LIST,
    params: transListParams(params)
  })
}

/**
 *获取信息管理-考场管理 - ExaminationrRoom -列表数据-无分页
 * @param {*} params 请求参数
 */
export const initAllExaminationrRoomList = (params) => {
  return httpRequest.$getList({
    url: API_ROOM().BASE_ALL_LIST,
    params: transListParams(params)
  })
}
/**
 * 获取信息管理-考场管理 - ExaminationrRoom-根据 id 获取详情信息
 * @param {*} params 请求参数 -- id (roleId)
 */
export const initExaminationrRoomDetailsById = (params) => {
  return httpRequest.$post({
    url: API_ROOM().BASE_DETAILS_INFO + '?id=' + params.id
  })
}

/**
 * 获取信息管理-考场管理 - ExaminationrRoom-保存/编辑
 * @param {*} params 请求参数
 */
export const operateExaminationrRoomInfo = (formData) => {
  return httpRequest.$request({
    url: formData.isOperate
      ? API_ROOM().BASE_UPDATE
      : API_ROOM().BASE_SAVE,
    method: formData.isOperate ? 'post' : 'post',
    data: formData
  })
}
/**
 * 获取信息管理-考场管理 - ExaminationrRoom-根据 IDS 删除列表数据
 * @param {*} params 请求参数 ids
 */
export const deleteExaminationrRoomByIds = (params) => {
  return httpRequest.$post({
    url: API_ROOM().BASE_DELETE + '?ids=' + params.ids
  })
}
