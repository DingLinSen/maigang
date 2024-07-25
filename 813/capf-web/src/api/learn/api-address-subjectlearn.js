/**
 * subjectlearn -课目学习主表 - API地址
 * @type ALL IS String
 */
const moduleHttp = window.SITE_CONFIG.baseUrl // 模块服务路径
export const API_SUBJECT = () => {
  const BASE = 'learn/subjectLearn'
  return Object.assign(
    {
      BASE_LIST: moduleHttp + BASE + '/getByList', // 列表信息
      BASE_DETAILS_INFO: moduleHttp + BASE + '/findByStOrZdRole', // id查询
      BASE_DETAILS_INFO_SUB: moduleHttp + BASE + '/findByZdRole', // 支队和普通用户
      BASE_LOG: moduleHttp + BASE + '/learnLog', // 支队和普通用户
      BASE_UPDATE: moduleHttp + BASE + '/updateLearnSub', // 编辑/更新
      BASE_SAVE: moduleHttp + BASE + '/save', // 新增
      BASE_DELETE: moduleHttp + BASE + '/delete', // 根据id删除
      BASE_LEARN: moduleHttp + BASE + '/learnDetailList' // 学习页面
    },
    {
      LIST_EXPORT_URL: moduleHttp + BASE + '/importExcel', // 导出
      LIST_DOWNLOAD_URL: moduleHttp + BASE + '/downloadTemplate', // 下载模板
      LIST_UPLOAD_URL: moduleHttp + BASE + '/uploadExcel' // 上传
    }
  )
}
export const API_SUBJECT_PHOTO = () => {
  const BASE = 'learn/subjectLearnPhoto'
  return Object.assign(
    {
      BASE_LIST: moduleHttp + BASE + '/getByList', // 列表信息
      BASE_DETAILS_INFO: moduleHttp + BASE + '/findById', // id查询
      BASE_UPDATE: moduleHttp + BASE + '/update', // 编辑/更新
      BASE_SAVE: moduleHttp + BASE + '/save', // 新增
      BASE_DELETE: moduleHttp + BASE + '/delete', // 根据id删除
      BASE_LEARN: moduleHttp + BASE + '/learnDetailList' // 学习页面
    },
    {
      LIST_EXPORT_URL: moduleHttp + BASE + '/importExcel', // 导出
      LIST_DOWNLOAD_URL: moduleHttp + BASE + '/downloadTemplate', // 下载模板
      LIST_UPLOAD_URL: moduleHttp + BASE + '/uploadExcel' // 上传
    }
  )
}
