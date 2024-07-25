export type TrainData = {
  address: string //培训地址
  assessMethod: string //考核方式（0笔试，1口试，2实际操作）
  assessResult: string //考核结果反馈
  confirmUserId: string | number //确认人
  confirmUserName: string | number //确认人姓名
  content: string | null //培训内容
  createTime: string | null //创建时间
  createUser: string | number //创建人ID
  createUserName: string //创建人姓名
  deptId: string | number //部门id
  deptName: string // 部门名称
  editTime: string // 编辑时间
  editUser: string | number //编辑人ID
  editUserName: string // 修改人姓名
  id: string | number // 主键id
  lecturerUserId: number // 授课人
  lecturerUserName: string // 授课人姓名
  num: string // 
  remark: string // 备注
  subject: string // 培训主题
  teacherUserId: number // 培训老师id
  teacherUserName: string // 培训老师姓名
  trainObject: string // 培训对象
  trainRecordUserDos: [] // 培训人员
  trainTime: string // 培训时间
  type: string // 培训类型（0线上，1线下）
  typeName: string // 培训类型（0线上，1线下）
  openFlag: string // 是否公开 0不公开 1公开
  courseId: string | number
}
