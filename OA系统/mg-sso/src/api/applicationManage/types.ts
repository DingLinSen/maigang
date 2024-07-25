export type SsoManageType = {
  id: string
  appDesc: string
  name: string
  clientId: string
  uriList: Array<[]>
  enabled: any
  defaultRedirectUri: string
  owner: string
  icon: string
  createTime: string | null
  publiced: any
}
export type accessType = {
  id: string
  roleId: number | null
  relation: number
  appId: number | null
}
