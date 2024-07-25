import httpRequest from '@/api/httpRequest'
import { API_UPLOAD } from '@/api/upload/api-address-upload.js'

/**
 * 列表参数转换
 * @param {*} params 界面条件参数
 */
export const transListParams = params => {
  return Object.assign({ ...params }, {})
}

// 下载文件接口
export const downloadFile = params => {
  return httpRequest.$get({
    url: API_UPLOAD().LIST_DOWNLOADURL,
    params: transListParams(params)
  })
}
