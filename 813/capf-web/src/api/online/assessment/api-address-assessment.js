/**
 * paperManagement -网上考核-考核管理 - API地址
 * @type ALL IS String
 */
const moduleHttp = window.SITE_CONFIG.baseUrl // 模块服务路径
export const API_ASSESSMENTMANAGEMENT = () => {
  const BASE = 'examine/assessmentManagement'
  return Object.assign(
    {
      BASE_LIST: moduleHttp + BASE + '/getByList', // 列表信息
      BASE_DETAILS_INFO: moduleHttp + BASE + '/findById', // id查询
      BASE_UPDATE: moduleHttp + BASE + '/update', // 编辑/更新
      BASE_SAVE: moduleHttp + BASE + '/save', // 新增
      BASE_DELETE: moduleHttp + BASE + '/delete', // 根据id删除
      BASE_PAPER: moduleHttp + BASE + '/getPaper', // 获取所有试卷
      BASE_ROOM: moduleHttp + BASE + '/getRoom', // 获取所有考场
      BASE_DEPT: moduleHttp + BASE + '/getBelowDeptAndUser', // 获取自己以及下级部门
    },
    {
      LIST_EXPORT_URL: moduleHttp + BASE + '/export', // 导出
      LIST_DOWNLOAD_URL: moduleHttp + BASE + '/downloadTemplate', // 下载模板
      LIST_UPLOAD_URL: moduleHttp + BASE + '/uploadExcel' // 上传
    }
  )
}
