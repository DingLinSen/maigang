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
  uuid: string
  permissions: string | string[]
}
