/**
 * 验证 tasktrain - 训练任务表 - 类对象
 * @param
 * @returns {}
 * @author yxm
 * @date 2022-04-07
 */
module.exports = () => {
  return {
    id: null, // $column.comments
    taskTimeStart: null, // 任务开始时间
    taskTimeEnd: null, // 任务结束时间
    deptId: null, // 任务单位id
    deptName: null,
    subjectIds: [],
    delFlag: null, // 删除状态 0正常 2删除
    status: null, // 状态 1 未启动 2 进行中
    createBy: null, // 发布人(创建人)
    createTime: null, // 创建时间
    updateBy: null, // 修改人
    dateArray: [],
    userId: null,
    trainTime:null,
    updateTime: null, // 修改时间
    trainFrequency: null,
    effect: null,
    recordSubjectDOS: [
    ],
    userIds: [],
    score: null,
    taskId: null,
    userName: null
  }
}
