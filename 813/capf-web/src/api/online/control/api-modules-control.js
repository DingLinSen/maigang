/**
 * 验证 AccessControl- 考核控制管理表 - API请求
 * @param
 * @returns {}
 * @author yxm
 * @date 2022-05-09
 */
import httpRequest from '@/api/httpRequest'
import { API_CONTROL } from '@/api/online/control/api-address-control'

/**
 * 列表参数转换
 * @param {*} params 界面条件参数
 */
export const transListParams = params => {
  return Object.assign({ ...params }, {})
}

/**
 * 获取考核控制表 - accessControl -列表数据 全部数据
 * @param {*} params 请求参数
 */
export const initAccessControlList = params => {
  return httpRequest.$getList({
    url: API_CONTROL().BASE_LIST,
    params: transListParams(params)
  })
}

/**
 * 获取考核控制表 - accessControl-根据 id 获取详情信息
 * @param {*} params 请求参数 -- id (roleId)
 */
export const initAccessControlDetailsById = params => {
  return httpRequest.$get({
    url: API_CONTROL().BASE_DETAILS_INFO,
    params: transListParams(params)
  })
}

/**
 * 获取考核控制表 - accessControl-保存/编辑
 * @param {*} params 请求参数
 */
export const operateAccessControlInfo = formData => {
  return httpRequest.$request({
    url: formData.isOperate
      ? API_CONTROL().BASE_UPDATE
      : API_CONTROL().BASE_SAVE,
    method: 'post',
    data: formData
  })
}
/**
 * 获取考核控制表 - AccessControl-根据 IDS 删除列表数据
 * @param {*} params 请求参数 ids
 */
export const offlineControlByIds = params => {
  return httpRequest.$delete({
    url: API_CONTROL().BASE_DELETE,
    params: transListParams(params)
  })
}
// -----------------------训练考核-------------------------
/**
 * 获取考核控制表 - accessControl-获取试卷内容
 * @param {*} params 请求参数 -- id (roleId)
 */
export const initAccessPaperDetails = params => {
  return httpRequest.$get({
    url: API_CONTROL().BASE_PAPER,
    params: transListParams(params)
  })
}

/**
 * 获取考核控制表 - accessControl-根据 id 获取详情信息 作答过的
 * @param {*} params 请求参数 -- id (roleId)
 */
export const initAccessPaperDetailsById = params => {
  return httpRequest.$get({
    url: API_CONTROL().BASE_PAPER_DETAILS_INFO,
    params: transListParams(params)
  })
}
/**
 * 获取考试列表 - accessControl-根据 id 获取详情信息 作答过的
 * @param {*} params 请求参数 -- id (roleId)
 */
export const initExamList = params => {
  return httpRequest.$get({
    url: API_CONTROL().BASE_EXAM_LIST,
    params: transListParams(params)
  })
}
/**
 * 获取考核控制表 - accessControl-保存/编辑
 * @param {*} params 请求参数
 */
export const operateAccessControlPaperInfo = formData => {
  return httpRequest.$request({
    url: API_CONTROL().BASE_PAPER_SAVE,
    method: 'post',
    data: formData
  })
}
/**
 * 计算切屏和退出全屏次数
 * @param {*} params 请求参数
 */
export const changeScreen = formData => {
  return httpRequest.$request({
    url: API_CONTROL().BASE_EXAM_CHANGE_SCREEN,
    method: 'post',
    data: formData
  })
}
/**
 * 提交答案 - accessControl
 * @param {*} params 请求参数
 */
export const submitAnswer = formData => {
  return httpRequest.$request({
    url: API_CONTROL().BASE_SUBMIT,
    method: 'post',
    data: formData
  })
}
/**
 * 获取考核控制表 - accessControl-保存/编辑
 * @param {*} params 请求参数
 */
export const initStaticalList = params => {
  return httpRequest.$get({
    url: API_CONTROL().BASE_STATICAL,
    params: transListParams(params)
  })
}

/**
 * 获取考核控制表 - accessControl-根据 id 获取详情信息
 * @param {*} params 请求参数 -- id (roleId)
 */
export const initStaticalListDetailsById = params => {
  return httpRequest.$get({
    url: API_CONTROL().BASE_STATICAL_INFO,
    params: transListParams(params)
  })
}
/**
 * 获取考核控制表-考核管理 - accessControl-根据 id 获取详情信息
 * @param {*} params 请求参数 -- id (roleId)
 */
export const initAssessmentManagementDetailsById = params => {
  return httpRequest.$get({
    url: API_CONTROL().BASE_ASS_DETAILS_INFOL,
    params: transListParams(params)
  })
}
/**
 * 获取考核控制表-考核管理 - accessControl-根据 id 获取详情信息
 * @param {*} params 请求参数 -- id (roleId)
 */
export const initAssessmentIsStatical = params => {
  return httpRequest.$get({
    url: API_CONTROL().BASE_ISCER,
    params: transListParams(params)
  })
}
/**
 * 获取考核控制表-考核管理 - accessControl-根据 id 获取详情信息
 * @param {*} params 请求参数 -- id (roleId)
 */
export const initUnloginList = params => {
  return httpRequest.$get({
    url: API_CONTROL().BASE_UNLOGIN,
    params: transListParams(params)
  })
}

// 成绩管理信息增
/**
 * 获取考核控制表 - accessControl-保存/编辑主表
 * @param {*} params 请求参数
 */
export const operatePointInfo = formData => {
  return httpRequest.$request({
    url: API_CONTROL().BASE_POINT_SAVE,
    method: 'post',
    data: formData
  })
}
// 成绩管理信息增
/**
 * 获取考核控制表 - accessControl-保存/编辑子表
 * @param {*} params 请求参数
 */
export const operatePointInfoSub = formData => {
  return httpRequest.$request({
    url: API_CONTROL().BASE_POINT_SAVE_SUB,
    method: 'post',
    data: formData
  })
}
// 成绩管理信息增
/**
 * 获取考核控制表 - 验证指纹信息
 * @param {*} params 请求参数
 */
export const validationFingerprint = params => {
  return httpRequest.$get({
    url: API_CONTROL().FINGER_VERIFY,
    params: transListParams(params)
  })
}
/**
 * 获取考核控制表-考核管理 - accessControl-等待认证前获取信息
 * @param {*} params 请求参数 -- id (roleId)
 */
export const initBeforeAuthById = params => {
  return httpRequest.$get({
    url: API_CONTROL().BASE_BEFORE,
    params: transListParams(params)
  })
}
// ======================其他考核
/**
 * 获取考核控制表-考核管理 - accessControl-根据成绩管理id与用户id查询考试试卷内容与得分
 * @param {*} params 请求参数 --
 */
export const initFindByPointId = params => {
  return httpRequest.$get({
    url: API_CONTROL().BASE_FINDBYPOINTID,
    params: transListParams(params)
  })
}
