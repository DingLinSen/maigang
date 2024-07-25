export type MeetingData = {
  bookBy: string | number //预约人ID
  bookByName: string
  bookDateEnd: string //预约结束时间
  bookDateStart: string //预约开始时间
  createBy: number	//创建人ID		
  createByName: string //	创建人		false
  createDate: string //	创建时间		
  deptId: string  //	部门id		
  deptName: string //	部门名称	
  id: string | number //	id		
  meetingContent: string //	会议内容
  meetingroom: string//会议室名称	
  status: string//	状态(1.发布 2.草稿 )		
  summary: string//	会议主题	
  updateBy: string | number //	修改人ID	
  updateByName: string//	修改人	
  updateDate: string//	修改时间
  meetingUserDos: []
}
