
const moduleHttp = window.SITE_CONFIG.baseUrl // 模块服务路径
export const API_UPLOAD = () => {
  const BASE = 'common/upload'
  return Object.assign(
    {
      LIST_EXPORT_URL: moduleHttp + BASE + '/importExcel', // 导出
      LIST_DOWNLOADURL: moduleHttp + BASE + '/downloadNet', // 下载
      LIST_UPLOAD_URL: moduleHttp + BASE + '/uploadExcel' // 上传
    }
  )
}