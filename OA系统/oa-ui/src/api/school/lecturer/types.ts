export type LecturerData = {
  createUser: string | number
  createTime: string//发布时间
  editUser: string | number
  editTime: string
  headUrl: string | number //头像路径
  id: string | number
  courseList: []
  lecturerInfo: string // 讲师介绍
  lecturerName: string //讲师姓名
  lecturerPost: string // 讲师职称
  sort: number // 
  status: number // 状态（-1删除、0上架、1下架）
}
