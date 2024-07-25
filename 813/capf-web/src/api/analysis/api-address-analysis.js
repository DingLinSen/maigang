const moduleHttp = window.SITE_CONFIG.baseUrl // 模块服务路径
export const API_ANALYSIS = () => {
  const BASE = 'trainAnalysis'
  return Object.assign(
    {
      BASE_GETDATA: moduleHttp + BASE + '/getData', // 年度训练分析
      BASE_GETUSERPAGEBYLIST: moduleHttp + BASE + '/getUserPageByList', // 编辑/更新

      BASE_LEARN: moduleHttp + BASE + '/learAnalysis' // 课目学习时长分析
    }
  )
}
