export type CourseData = {
  assessStatus: string | number //考核状态（0否 1是）
  average: string | number//平均分
  choicenessStatus: string | number //精选状态（0否 1是）
  commentFlag: boolean //是否评分过
  courseFileName: string//课程文件名称
  courseName: string//课程名称
  courseNo: string//课程编号
  courseUrl: string // 课程文件路径
  coverName: string //视频封面名称
  coverUrl: string // 视频封面路径
  createDate: string // 创建日期
  createTime: string //  创建时间
  createUser: string | number // 创建人ID
  delay: string | number  // 延误状态 0正常，1延误
  editTime: string // 编辑时间
  editUser: string | number // 编辑人ID
  endDate: string // 结束时间
  id: string | number  // 
  lecturerId: string | number // 讲师ID
  lecturerName: string //讲师名
  likeCount: string | number//点赞数
  likeFlag: boolean //是否点过赞
  outline: string //课程大纲
  progress: string | number//完成进度（进程）
  secondType: string | number//二级类别（0管理类，1技能类，2其他
  tbAssessCommentDos: [] //
  tbCourseUserDos: [] //用户id集合(权限)
  userCourseFlag: string | number //用户课程状态 (0任务学习，1自主学习)
  userViewStatus: string | number //用户完成状态 （0未完成，1已完成）
  userViewTime: string | number //用户观看时长
  videoTime: string | number //视频时长
  type: string | number //类别(0内训，1外训)
  viewCount: string | number //课程浏览数
  viewStatus: string | number //浏览状态（0全员可见，1自定义当前在职成员
  viewTime: string | number //观看时长
  status: number // 状态（-1删除、0上架、1下架）
  flag: number // 0 任务学习 1 自主学习
  courseId: string | number  // 
  score: string | number  //评分
}
