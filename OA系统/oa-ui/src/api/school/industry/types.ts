export type IndustryData = {
  createBy: string
  createTime: string//发布时间
  updateBy: string
  updateTime: string
  allStatus: string | number //是否全部人员查看 0是 1否
  describeInfo: string | null //描述
  filePath: string | null //文件路径数组;号分隔
  id: string | number
  industryKnowledgeUserDos: []
  roleAuth: string // 权限标识 0有权限 1无权限
  title: string //标题
  type: string // 类型 1军工 2铁路 3农业 4其他
}
