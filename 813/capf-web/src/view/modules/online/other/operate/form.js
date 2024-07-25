/**
 * 验证 otherexamine - 网上考核-其他考核 - 类对象
 * @param
 * @returns {}
 * @author yxm
 * @date 2022-04-07
 */
module.exports = () => {
  return {
    id: null, // 主键
    name: null, // 考核名称
    deptId: [], // 部门id
    examineType: null, // 考核类型 1结业考核初考 2结业考核补考 3季度考核 4抽考
    subjectId: null, // 课目id
    examineStartDate: null, // 考核时间-开始时间
    examineEndDate: null, // 考核时间-结束时间
    remark: null, // 备注
    file: [],
    deptName: null, // 考核名称
    subjectType: null, // 课目类型
    fileName: null, // 文档名称
    filePath: null, // 文档路径url
    createTime: null, // 创建时间
    createBy: null, // 创建人id
    updateTime: null, // 修改时间
    updateBy: null, // 修改人id
    status: null, // 状态 0正常 1删除
    fillList: [],
    type: null, // 考核类型
    startDate: null
  }
}
