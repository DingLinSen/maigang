export type TaskData = {
  completionDate: string  //完成时间
  createTime: string
  createUser: number	//创建人ID	
  createUserName: string //	创建人		false
  deadline: string //截止时间
  delay: string | number//	延误状态 0正常，1延误
  deptId: string | number//	部门ID
  description: string  //	任务描述	
  executor: number //	执行人Id
  executorName: string  //	执行人
  fileName: string  //	任务附件名
  filePath: string  //	任务附件路径
  id: string | number //	id		
  jobStatus: number //	在职状态	
  mgTaskConnectUserDos: [] //	协同人集合
  mgTaskLogDos: []//任务日志
  status: string//	任务状态 0未完成，1已完成，3待接受(新建任务后初始状态)，4已拒绝，5已驳回，6已归档	
  mgTaskMilestoneDos: []//	里程碑
  readStatus: string
  subordinateUserId: string
  title: string // 任务标题
  updateUser: string | number //	修改人ID	
  updateUserName: string//	修改人	
  updateTime: string//	修改时间
  userId: number
}
