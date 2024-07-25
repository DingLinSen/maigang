/**
 * planmonth -${comments} - API地址
 * @type ALL IS String
 */
const moduleHttp = window.SITE_CONFIG.baseUrl // 模块服务路径
export const API_PLANMONTH = () => {
  const BASE = 'train/planMonth'
  return Object.assign(
    {
      BASE_LIST: moduleHttp + BASE + '/getByList', // 列表信息
      BASE_DETAILS_INFO: moduleHttp + BASE + '/findById', // id查询
      BASE_UPDATE: moduleHttp + BASE + '/update', // 编辑/更新
      BASE_SAVE: moduleHttp + BASE + '/save', // 新增
      BASE_DELETE: moduleHttp + BASE + '/delete', // 根据id删除
      BASE_PUBLISH: moduleHttp + BASE + '/updateStatus', // 修改状态
      BASE_CREATEPLAN: moduleHttp + BASE + '/createPlan', // 根据年计划生成月计划
      BASE_GETPLANBYYEAR: moduleHttp + BASE + '/getPlanByYear', // 根据年份查找年计划
      BASE_SAVEBATCH: moduleHttp + BASE + '/saveBatch' // 多条新增
    },
    {
      LIST_EXPORT_URL: moduleHttp + BASE + '/importExcel', // 导出
      LIST_DOWNLOAD_URL: moduleHttp + BASE + '/downloadTemplate', // 下载模板
      LIST_UPLOAD_URL: moduleHttp + BASE + '/uploadExcel' // 上传
    }
  )
}
