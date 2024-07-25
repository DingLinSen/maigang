//版本信息
export type VersionInfo = {
  versionNumber: string | null //版本号
  createBy: string | number | null
  createTime: string | null
  createByName: string | null
  updateBy: string | number | null
  updateTime: string | null
  id: number
  publishTime: string | null // 	发布时间
  status: string | null //发布状态:0未发布 1已发布 2撤回
  versionDescription: string | null //版本说明
}

