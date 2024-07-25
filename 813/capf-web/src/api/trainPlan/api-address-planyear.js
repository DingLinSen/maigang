/**
 * planyear -计划-年计划表 - API地址
 * @type ALL IS String
 */
const moduleHttp = window.SITE_CONFIG.baseUrl // 模块服务路径
export const API_PLANYEAR = () => {
  const BASE = 'train/planYear'
  return Object.assign(
    {
      BASE_LIST: moduleHttp + BASE + '/getByList', // 列表信息
      BASE_DETAILS_INFO: moduleHttp + BASE + '/findById', // id查询
      BASE_UPDATE: moduleHttp + BASE + '/update', // 编辑/更新
      BASE_SAVE: moduleHttp + BASE + '/save', // 新增
      BASE_DELETE: moduleHttp + BASE + '/delete', // 根据id删除
      BASE_GETTIME: moduleHttp + BASE + '/getTotalTime', // 课目时长
      BASE_PUBLISH: moduleHttp + BASE + '/updateStatus' // 修改状态
    },
    {
      LIST_EXPORT_URL: moduleHttp + BASE + '/importExcel', // 导出
      LIST_DOWNLOAD_URL: moduleHttp + BASE + '/downloadTemplate', // 下载模板
      LIST_UPLOAD_URL: moduleHttp + BASE + '/uploadExcel' // 上传
    }
  )
}
