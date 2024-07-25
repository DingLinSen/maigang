/**
 * tasktrain -训练任务表 - API地址
 * @type ALL IS String
 */
const moduleHttp = window.SITE_CONFIG.baseUrl // 模块服务路径
export const API_TASKTRAIN = () => {
  const BASE = 'train/taskTrain'
  return Object.assign(
    {
      BASE_LIST: moduleHttp + BASE + '/getByList', // 列表信息
      BASE_DETAILS_INFO: moduleHttp + BASE + '/findById', // id查询
      BASE_UPDATE: moduleHttp + BASE + '/update', // 编辑/更新
      BASE_SAVE: moduleHttp + BASE + '/save', // 新增
      BASE_DELETE: moduleHttp + BASE + '/delete', // 根据id删除
      BASE_USERS: moduleHttp + BASE + '/getUserByDept', // 根据部门获取所有人员
      BASE_PUBLISH: moduleHttp + BASE + '/release', // 发布
      BASE_CLOSE: moduleHttp + BASE + '/close', // 关闭
      BASE_CHAPTER: moduleHttp + BASE + '/getChapterBySubjectIds', // 根据多个课目获取章节
      BASE_GETTIME: moduleHttp + BASE + '/getTotalTimeByChapter', // 根据多个课目获取章节
      BASE_GETDEPT: moduleHttp + BASE + '/getBelowDept', // 获取下级部门
      BASE_SUBJECT: moduleHttp + BASE + '/getSubjectHasSub' // 获取已绑定视频或资料的课目

    },
    {
      LIST_EXPORT_URL: moduleHttp + BASE + '/export', // 导出
      LIST_DOWNLOAD_URL: moduleHttp + BASE + '/downloadTemplate', // 下载模板
      LIST_UPLOAD_URL: moduleHttp + BASE + '/uploadExcel' // 上传
    }
  )
}
