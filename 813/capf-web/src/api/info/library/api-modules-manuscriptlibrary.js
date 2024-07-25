
/**
 * 验证 manuscriptlibrary - 稿库管理表 - API请求
 * @param
 * @returns {}
 * @author yxm
 * @date 2022-04-07
 */
 import httpRequest from '@/api/httpRequest'
 import { API_MANUSCRIPTLIBRARY } from '@/api/info/library/api-address-manuscriptlibrary'
 
 /**
  * 列表参数转换
  * @param {*} params 界面条件参数
  */
 export const transListParams = params => {
   return Object.assign({ ...params }, {})
 }
 
 /**
  * 获取稿库管理表 - manuscriptlibrary -列表数据
  * @param {*} params 请求参数
  */
 export const initManuscriptLibraryList = (params) => {
   return httpRequest.$getList({
     url: API_MANUSCRIPTLIBRARY().BASE_LIST,
     params: transListParams(params)
   })
 }
 
 /**
  * 获取稿库管理表 - manuscriptlibrary-根据 id 获取详情信息
  * @param {*} params 请求参数 -- id (roleId)
  */
 export const initManuscriptLibraryDetailsById = (params) => {
   return httpRequest.$get({
     url: API_MANUSCRIPTLIBRARY().BASE_DETAILS_INFO + '?id=' + params.id
   })
 }
 
 /**
  * 获取稿库管理表 - ManuscriptLibrary-保存/编辑
  * @param {*} params 请求参数
  */
 export const operateManuscriptLibraryInfo = (formData) => {
   return httpRequest.$request({
     url: formData.isOperate
       ? API_MANUSCRIPTLIBRARY().BASE_UPDATE
       : API_MANUSCRIPTLIBRARY().BASE_SAVE,
     method: 'post',
     data: formData
   })
 }
 /**
  * 获取稿库管理表 - manuscriptlibrary-根据 IDS 删除列表数据
  * @param {*} params 请求参数 ids
  */
 export const deleteManuscriptLibraryByIds = (params) => {
   return httpRequest.$delete({
     url: API_MANUSCRIPTLIBRARY().BASE_DELETE + '?ids=' + params.ids
   })
 }
 