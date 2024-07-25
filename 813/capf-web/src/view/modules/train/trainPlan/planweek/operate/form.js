/**
 * 验证 planweek - 计划-周计划表 - 类对象
 * @param
 * @returns {}
 * @author yxm
 * @date 2022-04-07
 */
module.exports = () => {
  return {
    id: null, // $column.comments
    type: null, // 计划类型 1 年计划
    name: null, // 计划名称
    timeLimit: null, // 计划期限
    deptId: null, // 计划单位id
    personType: '', // 人员类型
    target: null, // 目标
    createBy: null, // 发布人(创建人)
    createTime: null, // 创建时间
    updateBy: null, // 修改人
    updateTime: null, // 修改时间
    delFlag: null, // 删除标志  (0表示存在 2表示删除)
    status: null, // 状态 1 待发布 2 待审核 3 已审核 4 已完成
    assessment: null, // 是否考核 1 考核 2 不考核
    assessmentId: null,
    assessmentTime: null, // 考核时间
    paperId: null, // 试卷id
    subjectId: [], // 课目id
    timeLimitStart: null, // 计划期限开始时间
    timeLimitEnd: null, // 计划期限结束时间
    deptName: null,
    subjectIds: []
  }
}
