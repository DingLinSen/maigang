/**
 * 验证 tasktrain - 训练任务表 - API请求
 * @param
 * @returns {}
 * @author yxm
 * @date 2022-04-07
 */
import httpRequest from '@/api/httpRequest'
import { API_TASKTRAIN } from '@/api/tasks/api-address-tasktrain'

/**
 * 列表参数转换
 * @param {*} params 界面条件参数
 */
export const transListParams = params => {
  return Object.assign({ ...params }, {})
}

/**
 * 获取训练任务表 - tasktrain -列表数据
 * @param {*} params 请求参数
 */
export const initTaskTrainList = params => {
  return httpRequest.$getList({
    url: API_TASKTRAIN().BASE_LIST,
    params: transListParams(params)
  })
}

/**
 * 获取训练任务表 - tasktrain-根据 id 获取详情信息
 * @param {*} params 请求参数 -- id (roleId)
 */
export const initTaskTrainDetailsById = params => {
  return httpRequest.$get({
    url: API_TASKTRAIN().BASE_DETAILS_INFO + '?id=' + params.id
  })
}

/**
 * 获取人员 - tasktrain-根据 id 获取人员
 * @param {*} params 请求参数 -- id (roleId)
 */
export const initUserByDeptId = params => {
  return httpRequest.$get({
    url: API_TASKTRAIN().BASE_USERS + '?deptId=' + params.id
  })
}

/**
 * 获取训练任务表 - tasktrain-保存/编辑
 * @param {*} params 请求参数
 */
export const operateTaskTrainInfo = formData => {
  return httpRequest.$request({
    url: formData.isOperate
      ? API_TASKTRAIN().BASE_UPDATE
      : API_TASKTRAIN().BASE_SAVE,
    method: formData.isOperate ? 'put' : 'post',
    data: formData
  })
}
/**
 * 获取训练任务表 - TaskTrain-根据 IDS 删除列表数据
 * @param {*} params 请求参数 ids
 */
export const deleteTaskTrainByIds = params => {
  return httpRequest.$delete({
    url: API_TASKTRAIN().BASE_DELETE + '?ids=' + params.ids
  })
}

/**
 * 关闭训练任务 - tasktrain-关闭
 * @param {*} params 请求参数
 */
export const closeTaskTrainInfo = params => {
  return httpRequest.$put({
    url: API_TASKTRAIN().BASE_CLOSE + '?id=' + params.id
  })
}

/**
 * 发布训练任务 - tasktrain-发布
 * @param {*} params 请求参数
 */
export const publishTaskTrainInfo = params => {
  return httpRequest.$post({
    url: API_TASKTRAIN().BASE_PUBLISH + '?id=' + params.id
  })
}

/**
 * 训练任务 - tasktrain-根据 chapterIds 获取时长
 * @param {*} params 请求参数 chapterIds
 */
export const initTasksGetTime = (params) => {
  return httpRequest.$get({
    url: API_TASKTRAIN().BASE_GETTIME + '?chapterIds=' + params.chapterIds
  })
}

/**
 * 训练任务 - tasktrain-根据 subjectIds 获取章节
 * @param {*} params 请求参数 subjectIds
 */
export const initTasksGetChapter = (params) => {
  return httpRequest.$get({
    url: API_TASKTRAIN().BASE_CHAPTER + '?subjectIds=' + params.subjectIds
  })
}

/**
 * 训练任务 - tasktrain-获取下级部门
 * @param {*} params 请求参数 subjectIds
 */
export const getBelowDept = (params) => {
  return httpRequest.$get({
    url: API_TASKTRAIN().BASE_GETDEPT
  })
}

/**
 * 训练任务 - tasktrain-获取已绑定视频或资料的课目
 * @param {*} params 请求参数 subjectIds
 */
export const getSubjectHasSub = (params) => {
  return httpRequest.$get({
    url: API_TASKTRAIN().BASE_SUBJECT + '?type=' + params.type
  })
}
