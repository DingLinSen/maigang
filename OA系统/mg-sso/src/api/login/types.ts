export type UserLoginType = {
  username: string
  password: string
  code: string
  uuid: string
}

export type UserType = {
  username: string
  password: string
  role: string
  roleId: string
  clientId: string
  redirectUri: string
  accessToken: string
  uuid: string
  code: string | null
  accessTokenExpireTime: number
  refreshToken: string
  refreshTokenExpireTime: number
  permissions: string | string[]
  user: {
    avatar: string
    name: string
  }
}
export type logType = {
  id: string
  username: string
  clientIp: string
  appCode: string
  appName: string
  eventType: string
  status: Number
  unlocked: string
  description: string
  token: string
  createTime: string
}
