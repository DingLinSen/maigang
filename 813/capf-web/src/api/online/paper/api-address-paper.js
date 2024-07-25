/**
 * paperManagement -网上考核-试卷管理 - API地址
 * @type ALL IS String
 */
const moduleHttp = window.SITE_CONFIG.baseUrl // 模块服务路径
export const API_PAPERMANAGEMENT = () => {
  const BASE = 'examine/paperManagement'
  return Object.assign(
    {
      BASE_LIST: moduleHttp + BASE + '/getByList', // 列表信息
      BASE_DETAILS_INFO: moduleHttp + BASE + '/findById', // id查询
      BASE_UPDATE: moduleHttp + BASE + '/update', // 编辑/更新
      BASE_SAVE: moduleHttp + BASE + '/save', // 新增
      BASE_DELETE: moduleHttp + BASE + '/delete', // 根据id删除
      BASE_BANK: moduleHttp + BASE + '/getSource', //查询所有题库
      BASE_SUBJECT: moduleHttp + BASE + '/getSubjectByType', //根据类型获取课目
      BASE_IMPORT: moduleHttp + BASE + '/importSubmit', //导入试卷提交
      BASE_PAPER_CONTENT: moduleHttp + BASE + '/getPaperContent'//获取考试试卷内容
    },
    {
      LIST_EXPORT_URL: moduleHttp + BASE + '/export', // 导出
      LIST_DOWNLOAD_URL: moduleHttp + BASE + '/downloadTemplate', // 下载模板
      LIST_UPLOAD_URL: moduleHttp + BASE + '/importTable' // 上传
    }
  )
}
