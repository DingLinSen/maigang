/**
 * 验证 videomanagement - 考核管理表 - 类对象
 * @param
 * @returns {}
 * @author yxm
 * @date 2022-04-07
 */
module.exports = () => {
  return {
    id: null, // 主键
    // startTime: null,
    examinationDescription: null,
    passingMark: null,
    isAuthentication: false,
    isTimeLimit: false,
    // endTime: null,
    paperId: null,
    paperNo: null,
    paperName: null,
    paperType: null,
    createBy: null, // 发布人(创建人)
    examinationDept: null,
    examinationDeptName: null,
    status: null,
    assessmentManagementSubDOS: [],
    createTime: null, // 创建时间
    updateBy: null, // 修改人
    updateTime: null, // 修改时间
    delFlag: null, // 删除标志  (0表示存在 2表示删除)

    // id: null, // 主键
    // startTime: null,
    remark: null,
    totalScore: null,
    score: null,
    passScore: null,
    testDuration: null,
    examinationName: null,
    examDate: [],
    isAuth: false,
    isLimitTime: false,
    examinationTime: [],
    // endTime: null,
    type: null,
    taskUserArray: [],
    // assessmentManagementSubDOS: []
    // paperId: null,
    // paperNo: null,
    // paperName: null,
    // paperType: null,
    // createBy: null, // 发布人(创建人)
    // examinationDept: null,
    // examinationDeptName: null,
    examinationId: null,
    examinationRoomName: null,
    // status: null,
    // createTime: null, // 创建时间
    // updateBy: null, // 修改人
    // updateTime: null, // 修改时间
    // delFlag: null, // 删除标志  (0表示存在 2表示删除)
  }
}
