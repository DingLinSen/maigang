export type UserLoginType = {
  username: string
  password: string
  code: string
  uuid: string
}

export type UserType = {
  username: string
  accessToken: string
  accessTokenExpireTime: number
  refreshToken: string
  refreshTokenExpireTime: number
  password: string
  role: string
  code: string | null
  roleId: string
  uuid: string
  permissions: string | string[]
}
