/**
 * 验证 planmonth - ${comments} - 类对象
 * @param
 * @returns {}
 * @author yxm
 * @date 2022-04-07
 */
module.exports = () => {
  return {
    id: null, // $column.comments
    type: null, // 计划类型 1 年计划
    subjectId: [], // 课目id
    name: null, // 计划名称
    timeLimitStart: null, // 计划开始时限
    timeLimitEnd: null, // 计划结束时限
    timeLimit: null, // 计划期限
    deptId: [], // 计划单位id
    personType: '', // 人员类型
    target: null, // 目标
    createBy: null, // 发布人(创建人)
    createTime: null, // 创建时间
    updateBy: null, // 修改人
    updateTime: null, // 修改时间
    delFlag: null, // 删除标志  (0表示存在 2表示删除)
    subjectIds: [], // 计划单位
    totalTime: null, // 总时长
    deptName: null,
    status: null // 状态 1 待发布 2 待审核 3 已审核 4 已完成
  }
}
