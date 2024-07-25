/**
 * Control -考核控制 - API地址
 * @type ALL IS String
 */
const moduleHttp = window.SITE_CONFIG.baseUrl // 模块服务路径
export const API_CONTROL = () => {
  const BASE = 'online/examineControl'
  return Object.assign(
    {
      BASE_LIST: moduleHttp + BASE + '/getByList', // 列表信息
      BASE_DETAILS_INFO: moduleHttp + BASE + '/listAllByExamineIdAndAssId', // id查询
      BASE_STATICAL: 'online/examinePoint/findByAssId', // 考核统计
      BASE_STATICAL_INFO: 'online/examinePoint/findUserPointByParentId', // 考核统计查询id
      BASE_UPDATE: moduleHttp + BASE + '/update', // 编辑/更新
      BASE_SAVE: moduleHttp + BASE + '/save', // 新增
      BASE_DELETE: moduleHttp + BASE + '/offline', // 下线
      BASE_PAPER: moduleHttp + BASE + '/getPaperContent', // 获取试卷内容
      BASE_PAPER_SAVE: moduleHttp + BASE + '/contentExamineUser/save', // 保存试卷
      BASE_PAPER_DETAILS_INFO: moduleHttp + BASE + '/contentExamineUser/findById', // 查询考试试卷内容与得分
      BASE_ASS_DETAILS_INFOL: 'examine/assessmentManagement/findById', // 考核管理根据id查询
      BASE_POINT_SAVE: 'online/examinePoint/save', // 成绩管理新增 主表
      BASE_FINDBYPOINTID: moduleHttp + BASE + '/contentExamineUser/findByPointId', // 根据成绩管理id与用户id查询考试试卷内容与得分
      BASE_POINT_SAVE_SUB: 'online/examineUserPoint/save', // 成绩管理新增 子表
      FINGER_VERIFY: 'ansisdk/AnsiSDK/verify',
      BASE_BEFORE: moduleHttp + BASE + '/getBeforeAuth',
      BASE_ISCER: 'online/examinePoint/findExistByAssId', // 是否认证过
      BASE_UNLOGIN: moduleHttp + BASE + '/getUnLoginExamineUserList', // 考核控制未登录用户
      BASE_SUBMIT: moduleHttp + BASE + '/submit', // 提交答案
      BASE_EXAM_LIST: moduleHttp + BASE + '/getExams', // 考试列表
      BASE_EXAM_CHANGE_SCREEN: moduleHttp + BASE + '/changeScreen' // 计算切屏和退出全屏次数
    },
    {
      LIST_EXPORT_URL: moduleHttp + BASE + '/importExcel', // 导出
      LIST_DOWNLOAD_URL: moduleHttp + BASE + '/downloadTemplate', // 下载模板
      LIST_UPLOAD_URL: moduleHttp + BASE + '/uploadExcel' // 上传
    }
  )
}
