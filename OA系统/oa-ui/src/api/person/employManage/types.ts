// 入职数据
export type InductionData = {
  address: string
  applyPost: string
  belief: string
  birth: string
  city: string
  cityName: string
  createBy: number
  createTime: string
  delStatus: string
  deptId: number
  deptName: string
  district: string
  districtName: string
  eeno: string
  email: string
  emergencyContactPerson: string
  emergencyContactPhone: string
  encodeFlag: number
  family: string
  healthCondition: string
  hobbies: string
  id: number
  idcard: string
  integratedSkill: string
  liveAddress: string
  maritalStatus: number
  mobile: string
  name: string
  nation: string
  parentsPhone: string
  personalEmail: string
  personalPhone: string
  politicCountenance: string
  province: string
  provinceName: string
  role: string
  roleFlag: string
  salaryExpectation: string
  sex: number
  sexName: string
  status: number
  updateBy: number
  updateTime: string
  userId: number
  withParentsLive: number
  withParentsLiveName: string
}

export type EmployData = {
  beginTime: string
  createBy: string
  createTime: string
  endTime: string
  name: string
  params: object
  remark: string
  roleFlag: string
  searchValue: string
  status: string | number
  updateBy: string
  updateTime: string
}
