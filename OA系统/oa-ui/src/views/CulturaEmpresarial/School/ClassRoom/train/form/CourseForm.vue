<!-- 通讯录的新增/编辑 -->
<script setup lang="ts">
import { ref, unref, reactive, nextTick, getCurrentInstance, inject, onMounted } from 'vue'
import { propTypes } from '@/utils/propTypes'
import { useValidator } from '@/hooks/web/useValidator'
import { useEmitt } from '@/hooks/web/useEmitt'
import { ElMessage, ElForm, ElFormItem, ElRow, ElCol, ElInput, ElTreeSelect } from 'element-plus'
import { ElDialog } from '@/components/ElDialog'
import { saveSelfTrainApi, editSelfTrainApi, getSelfTrainDetApi } from '@/api/school/train'
import { TrainData } from '@/api/school/train/types'
import {
  saveCourseApi,
  editCourseApi,
  getLecturerListApi,
  getCourseDetApi
} from '@/api/school/course'
import { courseType, courseSecondType, yesOrNo } from '../config'
import { PersonnelSelection } from '@/components/PersonnelSelection'
import { getAllUserListApi } from '@/api/user' // 获取所有用户
import { FileUpload } from '@/components/FileUpload' // 文件上传组件
import { ImgUpload } from '@/components/ImgUpload' // 文件上传组件
import { useCache } from '@/hooks/web/useCache'
import { CourseData } from '@/api/school/course/types'
import moment from 'moment'

const { wsCache } = useCache()
const loginUserId = ref<string>(wsCache.get('userInfo').userId) // 登录用户id
const { emitter } = useEmitt()
const treedata = inject<any>('treedata')
// 弹窗的开启和关闭
const dialogFlag = ref<any>(false)
type Callback = (error?: string | Error | undefined) => void

const { required, notSpace } = useValidator()

const props = defineProps({
  title: propTypes.string.def('')
})
const pageFlag = ref<string>('')
//弹窗
const elDialogFef = ref()
//打开drawer并初始化
const detailsId = ref<string>('')
const pageTitle = ref<string>('')
const courseId = ref<string>('')
const openDrawer = (type: string, id: string) => {
  pageTitle.value =
    type == 'add' ?'新增' : type == 'edit' ? '编辑' : '详情'
  dialogFlag.value = true
  pageFlag.value = type
  isAllSelected.value = true
  elDialogFef.value.isFullscreen = false
  if (!userData.value.length) {
    getAllUserlist()
  }
  nextTick(() => {
    detailsId.value = id
    getDetailsData()
  })
}

//是否可以公开
const canOpen = ref<boolean>(true)

onMounted(() => {
  getLecturerArray()
})
//获取讲师列表
const lecturerArray = ref<any>([])
const getLecturerArray = async () => {
  try {
    const { data } = await getLecturerListApi()
    lecturerArray.value = []
    data.forEach((element: any) => {
      lecturerArray.value.push({ label: element.lecturerName, value: element.id })
    })
  } catch (error) {}
}
//表单
const formRef = ref<any>()
//保存等待
const loading = ref(false)
//保存数据
const saveTrainLoading = ref<boolean>(false)
const saveTrain = async (courseId: string) => {
  //表单验证
  if (!formRef.value) return
  await formRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      loading.value = true
      let trainRecordUserDos: any = []
      if (isAllSelectedSub.value) {
        userData.value.forEach((element: any) => {
          trainRecordUserDos.push({ userId: element.userId })
        })
      } else {
        selectedPersonArraySub.value.forEach((element: any) => {
          trainRecordUserDos.push({ userId: element.userId })
        })
      }
      // console.log(ruleForm.value.deptId, 888)
      let params: Partial<TrainData> = {
        id: '',
        courseId: courseId,
        address: ruleForm.value.address,
        assessMethod: String(ruleForm.value.assessMethod) ? ruleForm.value.assessMethod : '',
        assessResult: ruleForm.value.assessResult ? ruleForm.value.assessResult : '',
        content: ruleForm.value.content ? ruleForm.value.content : '',
        deptId: ruleForm.value.deptId,
        // lecturerUserId: ruleForm.value.lecturerUserId ? ruleForm.value.lecturerUserId : '',
        // teacherUserId: ruleForm.value.lecturerUserId ? ruleForm.value.lecturerUserId : '',
        teacherUserName: ruleForm.value.teacherUserName ? ruleForm.value.teacherUserName : '',
        remark: ruleForm.value.remark ? ruleForm.value.remark : '',
        subject: ruleForm.value.subject ? ruleForm.value.subject : '',
        trainObject: ruleForm.value.trainObject ? ruleForm.value.trainObject : '',
        trainTime: ruleForm.value.trainTime
          ? moment(ruleForm.value.trainTime).format('YYYY-MM-DD')
          : '',
        type: String(ruleForm.value.type) ? ruleForm.value.type : '',
        openFlag: String(ruleForm.value.openFlag) ? ruleForm.value.openFlag : '',
        trainRecordUserDos: trainRecordUserDos
      }
      if (detailsId.value) {
        params.id = detailsId.value
        const res = await editSelfTrainApi(params)
          .catch(() => {})
          .finally(() => {
            setTimeout(() => {
              loading.value = false
            }, 200)
          })
        if (res) {
          ElMessage.success('保存信息成功')
          emitter.emit('train', 'add')
          closeDialog()
        }
      } else {
        const res = await saveSelfTrainApi(params)
          .catch(() => {})
          .finally(() => {
            setTimeout(() => {
              loading.value = false
            }, 200)
          })
        if (res) {
          ElMessage.success('保存信息成功')
          emitter.emit('train', 'add')
          closeDialog()
        }
      }
    }
  })
}

//查询详情
const getDetailsData = async () => {
  if (detailsId.value) {
    const res = await getSelfTrainDetApi(detailsId.value)
    if (res && res.data) {
      ruleForm.value.trainTime = res.data.trainTime
        ? moment(res.data.trainTime).format('YYYY-MM-DD')
        : ''
      ruleForm.value.address = res.data.address ? res.data.address : ''
      ruleForm.value.deptId = res.data.deptId
      userData.value.forEach((element: any) => {
        if (res.data.deptId == element.deptId) {
          userList.value.push(element)
        }
      })
      ruleForm.value.lecturerUserId = res.data.lecturerUserId ? res.data.lecturerUserId : ''
      ruleForm.value.teacherUserName = res.data.teacherUserName ? res.data.teacherUserName : ''
      ruleForm.value.trainObject = res.data.trainObject ? res.data.trainObject : ''
      ruleForm.value.subject = res.data.subject ? res.data.subject : ''
      ruleForm.value.type = String(res.data.type) ? String(res.data.type) : ''
      ruleForm.value.content = res.data.content ? res.data.content : ''
      ruleForm.value.assessMethod = String(res.data.assessMethod)
        ? String(res.data.assessMethod)
        : ''
      ruleForm.value.assessResult = res.data.assessResult ? res.data.assessResult : ''
      ruleForm.value.remark = res.data.remark ? res.data.remark : ''
      ruleForm.value.openFlag = String(res.data.openFlag) ? String(res.data.openFlag) : ''
      canOpen.value = ruleForm.value.openFlag == '1' ? false : true
      ruleForm.value.courseId = res.data.courseId ? String(res.data.courseId) : ''
      courseId.value = ruleForm.value.courseId ? ruleForm.value.courseId : ''
      selectedPersonArraySub.value = []
      let trainRecordUserDos = res.data.trainRecordUserDos
      if (trainRecordUserDos && trainRecordUserDos.length > 0) {
        trainRecordUserDos.forEach((item: any) => {
          userData.value.forEach((user: any) => {
            if (item.userId === user.userId) {
              selectedPersonArraySub.value.push(user)
            }
          })
        })
        if (selectedPersonArraySub.value.length == userData.value.length) {
          ruleForm.value.userIds = '-1'
          isAllSelectedSub.value = true
          indeterminateSub.value = false
        } else {
          isAllSelectedSub.value = false
          indeterminateSub.value = true
          ruleForm.value.userIds = listToString(selectedPersonArraySub.value, ',')
        }
      } else {
        ruleForm.value.userIds = ''
        isAllSelectedSub.value = false
        indeterminateSub.value = false
      }
      getCourseDetailsData()
    }
  }
}

//表单验证规则
const rules = reactive({
  trainTime: [{ required: true, message: '请选择培训时间', trigger: 'change' }],
  address: [
    { required: true, message: '请输入培训地点', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  deptId: [{ required: true, message: '请选择组织部门', trigger: 'change' }],
  lecturerUserId: [{ required: true, message: '请输入培训讲师', trigger: 'blur' }],
  trainObject: [
    { required: true, message: '请输入培训对象', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  subject: [
    { required: true, message: '请输入培训主题', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  type: [{ required: true, message: '请选择培训类型', trigger: 'change' }],
  content: [
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  assessResult: [
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  // userIds: [
  //   {
  //     required: true,
  //     validator: (rule: any, value: string, callback: Callback) => {
  //       if (ruleForm.value.userIds) {
  //         callback()
  //       } else {
  //         callback(new Error('请选择参与人员'))
  //       }
  //     },
  //     trigger: 'change'
  //   }
  // ],
  remark: [
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  courseName: [
    { required: true, message: '请输入课程名称', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  lecturerId: [{ required: true, message: '请选择讲师', trigger: 'change' }],
  type2: [{ required: true, message: '请选择类型', trigger: 'change' }],
  secondType: [{ required: true, message: '请选择二级类型', trigger: 'change' }],
  choicenessStatus: [{ required: true, message: '请选择是否精选课程', trigger: 'change' }],
  outline: [
    { required: true, message: '请输入课程大纲', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  coverUrl: [{ required: true, message: '请上传封面', trigger: 'change' }],
  courseUrl: [{ required: true, message: '请上传课程文件', trigger: 'change' }],
  userIdsSub: [{ required: true, message: '请选择浏览权限', trigger: 'change' }]
})

//清空表单
const resetForm = () => {
  ruleForm.value = {
    id: '',
    trainTime: '',
    address: '',
    deptId: '',
    lecturerUserId: '',
    trainObject: '',
    subject: '',
    type: '',
    content: '',
    assessMethod: '',
    assessResult: '',
    userIds: '',
    remark: '',
    openFlag: '0',
    courseName: '',
    lecturerId: '',
    type2: '',
    secondType: '',
    choicenessStatus: '',
    outline: '',
    coverUrl: '',
    courseUrl: '',
    userIdsSub: ''
  }
}

//表单数据
const ruleForm = ref<any>({
  id: '',
  trainTime: '',
  address: '',
  deptId: '',
  lecturerUserId: '',
  trainObject: '',
  subject: '',
  type: '',
  content: '',
  assessMethod: '',
  assessResult: '',
  userIds: '',
  remark: '',
  openFlag: '0',
  courseName: '',
  lecturerId: '',
  type2: '',
  secondType: '',
  choicenessStatus: '',
  outline: '',
  coverUrl: '',
  courseUrl: '',
  userIdsSub: ''
})

//关闭
const closeDialog = () => {
  dialogFlag.value = false
}

//关闭后清空
const resetFormAfterClose = () => {
  dialogFlag.value = false
  if (elDialogFef.value) {
    elDialogFef.value.isFullscreen = false
  }
  isAllSelected.value = true
  selectedPersonArray.value = []
  isAllSelectedSub.value = false
  selectedPersonArraySub.value = []
  indeterminate.value = false
  indeterminateSub.value = false
  canOpen.value = true
  resetForm()
}

//同行人员
const selectedPersonArray = ref<any[]>([])
//添加同行人员
const personnelSelectionRef = ref()
const addPerson = () => {
  isJoin.value = false
  nextTick(() => {
    let checkedKeys: any[] = []
    selectedPersonArray.value.forEach((item: any) => {
      checkedKeys.push(item.userId)
    })
    personnelSelectionRef.value.openDialog(checkedKeys)
  })
}
//获取所有用户
const userData = ref<any>([])
const getAllUserlist = async () => {
  try {
    const { data } = await getAllUserListApi({})
    userData.value = data
  } catch (error) {}
}
//人员确定
const savePerson = (checkAllGroup: any) => {
  if (isJoin.value) {
    selectedPersonArraySub.value = []
    checkAllGroup.forEach((item: any) => {
      userData.value.forEach((user: any) => {
        if (item === user.userId) {
          selectedPersonArraySub.value.push(user)
        }
      })
    })
    ruleForm.value.userIds = listToString(selectedPersonArraySub.value, ',')
    indeterminateSub.value = selectedPersonArraySub.value && selectedPersonArraySub.value.length > 0
  } else {
    selectedPersonArray.value = []
    checkAllGroup.forEach((item: any) => {
      userData.value.forEach((user: any) => {
        if (item === user.userId) {
          selectedPersonArray.value.push(user)
        }
      })
    })
    ruleForm.value.userIdsSub = listToString(selectedPersonArray.value, ',')
    indeterminate.value = selectedPersonArray.value && selectedPersonArray.value.length > 0
  }
}

// 对象转成指定字符串分隔
const listToString = (list: any[], separator: string | null) => {
  let strs = ''
  separator = separator || ','
  for (let i in list) {
    if (list[i].userId) {
      strs += list[i].userId + separator
    }
  }
  return strs != '' ? strs.substr(0, strs.length - 1) : ''
}
const nameOverflow = (name: string) => {
  let nextName = ''
  if (name && name.length) {
    if (name.length > 3) {
      nextName = name.slice(0, 3) + '...'
    } else {
      nextName = name
    }
  } else {
    nextName = ''
  }
  return nextName
}
const handleCheckAllChange = (val: boolean) => {
  selectedPersonArray.value = []
  indeterminate.value = false
  if (!val) {
    // userData.value.forEach((item: any) => {
    //   if (loginUserId.value === item.userId) {
    //     selectedPersonArray.value.push(item)
    //   }
    // })
    ruleForm.value.userIdsSub = ''
  } else {
    ruleForm.value.userIdsSub = '-1'
  }
}
const isAllSelected = ref<boolean>(false)
const indeterminate = ref<boolean>(false)

//
const userList = ref<any>([])
const handleChange = (value: any) => {
  // userList.value = []
  // ruleForm.value.lecturerUserId = ''
  // let deptId = Array.isArray(value) ? value[value.length - 1] : value
  // userData.value.forEach((element: any) => {
  //   if (deptId == element.deptId) {
  //     userList.value.push(element)
  //   }
  // })
}

//参与人员
const isJoin = ref<boolean>(false)
const selectedPersonArraySub = ref<any[]>([])
const addPersonSub = () => {
  isJoin.value = true
  nextTick(() => {
    let checkedKeys: any[] = []
    selectedPersonArraySub.value.forEach((item: any) => {
      checkedKeys.push(item.userId)
    })
    personnelSelectionRef.value.openDialog(checkedKeys)
  })
}
const handleCheckAllChangeSub = (val: boolean) => {
  selectedPersonArraySub.value = []
  indeterminateSub.value = false
  if (!val) {
    // userData.value.forEach((item: any) => {
    //   if (loginUserId.value === item.userId) {
    //     selectedPersonArraySub.value.push(item)
    //   }
    // })
    // ruleForm.value.userIds = listToString(selectedPersonArraySub.value, ',')
    ruleForm.value.userIds = ''
  } else {
    nextTick(() => {
      ruleForm.value.userIds = '-1'
    })
  }
}
const isAllSelectedSub = ref<boolean>(false)
const indeterminateSub = ref<boolean>(false)

const movie = ref()

//查询课程详情
const getCourseDetailsData = async () => {
  if (courseId.value) {
    const res = await getCourseDetApi(courseId.value)
    if (res && res.data) {
      ruleForm.value.courseName = res.data.courseName
      ruleForm.value.lecturerId = res.data.lecturerId
      ruleForm.value.type2 = String(res.data.type)
      ruleForm.value.secondType = String(res.data.secondType)
      ruleForm.value.choicenessStatus = String(res.data.choicenessStatus)
      ruleForm.value.outline = res.data.outline
      ruleForm.value.coverUrl = res.data.coverUrl
      ruleForm.value.courseUrl = res.data.courseUrl
      selectedPersonArray.value = []
      if (String(res.data.viewStatus) == '0') {
        ruleForm.value.userIdsSub = '-1'
        isAllSelected.value = true
        indeterminate.value = false
      } else {
        isAllSelected.value = false
        if (res.data.tbCourseUserDos && res.data.tbCourseUserDos.length > 0) {
          res.data.tbCourseUserDos.forEach((item: any) => {
            userData.value.forEach((user: any) => {
              if (item.userId === user.userId) {
                selectedPersonArray.value.push(user)
              }
            })
          })
        }
        indeterminate.value = selectedPersonArray.value && selectedPersonArray.value.length > 0
        ruleForm.value.userIdsSub = listToString(selectedPersonArray.value, ',')
      }
    }
  }
}

//保存课程数据
const saveCourse = async () => {
  //表单验证
  if (!formRef.value) return
  await formRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      loading.value = true
      if (ruleForm.value.openFlag == '1') {
        let params: Partial<CourseData> = {
          id: '',
          courseName: ruleForm.value.courseName,
          lecturerId: ruleForm.value.lecturerId,
          type: String(ruleForm.value.type2),
          secondType: String(ruleForm.value.secondType),
          choicenessStatus: String(ruleForm.value.choicenessStatus),
          outline: ruleForm.value.outline,
          coverUrl: ruleForm.value.coverUrl,
          courseUrl: ruleForm.value.courseUrl,
          videoTime: 0,
          viewStatus: isAllSelected.value ? '0' : '1',
          tbCourseUserDos: []
        }
        if (movie.value && params.courseUrl) {
          params.videoTime = movie.value.duration
        } else {
          params.videoTime = 0
        }
        let tbCourseUserDos: any = []
        selectedPersonArray.value.forEach((item) => {
          tbCourseUserDos.push({ userId: item.userId })
        })
        // 1自定义 0全员可见
        if (params.viewStatus === '0') {
          params.tbCourseUserDos = []
        } else {
          params.tbCourseUserDos = tbCourseUserDos
        }
        if (courseId.value && detailsId.value) {
          params.id = courseId.value
          const res = await editCourseApi(params)
            .catch(() => {})
            .finally(() => {
              loading.value = false
            })
          if (res) {
            console.log()
            emitter.emit('course', 'add')
            setTimeout(() => {
              saveTrain(courseId.value)
            }, 200)
          }
        } else {
          const res = await saveCourseApi(params)
            .catch(() => {})
            .finally(() => {
              loading.value = false
            })
          if (res) {
            emitter.emit('course', 'add')
            setTimeout(() => {
              saveTrain(String(res.data))
            }, 200)
          }
        }
      } else {
        saveTrain('')
      }
    }
  })
}

const openFlagChange = (value: any) => {
  if (value == 1) {
    nextTick()
    if (isAllSelected) {
      ruleForm.value.userIdsSub = '-1'
    } else {
      ruleForm.value.userIdsSub = listToString(selectedPersonArray.value, ',')
    }
  }
}
const setDefaultImage = async (e: any) => {
  const avatar = await import('@/assets/imgs/avatar.jpg')
  e.target.src = avatar.default
}
defineExpose({
  openDrawer
})
</script>

<template>
  <ElDialog
    ref="elDialogFef"
    class="cultivate-custom"
    v-model="dialogFlag"
    :title="pageTitle"
    @closed="resetFormAfterClose"
  >
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="formRef"
      label-position="top"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-row>
        <el-col :span="24">
          <el-form-item label="培训时间" prop="trainTime">
            <el-date-picker
              v-model="ruleForm.trainTime"
              :clearable="true"
              style="width: 100%"
              format="YYYY-MM-DD"
              :disabled="pageFlag === 'see'"
              value-format="YYYY-MM-DD"
              placeholder="请选择培训时间"
              type="date"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="培训地点" prop="address">
            <el-input
              maxlength="50"
              v-model="ruleForm.address"
              placeholder="请输入培训地点"
              :disabled="pageFlag === 'see'"
              type="text"
            />
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="组织部门" prop="deptId">
            <el-tree-select
              v-model="ruleForm.deptId"
              style="width: 100%"
              nodeKey="deptId"
              :filterable="true"
              :disabled="pageFlag === 'see'"
              check-strictly
              value-key="deptId"
              :props="{ label: 'deptName' }"
              :controlsPosition="'right'"
              :data="treedata"
              @change="handleChange"
            />
          </el-form-item>
        </el-col>
        <el-col>
          <!-- <el-form-item label="培训讲师" prop="lecturerUserId">
            <el-select
              placeholder="请选择培训讲师"
              style="width: 100%"
              :clearable="true"
              :filterable="true"
              :disabled="pageFlag === 'see' || !ruleForm.deptId || ruleForm.deptId.length == 0"
              v-model="ruleForm.lecturerUserId"
            >
              <el-option
                :value="item.userId"
                :label="item.nickName"
                v-for="item in userList"
                :key="item.userId"
              />
            </el-select>
          </el-form-item> -->
          <el-form-item label="培训讲师" prop="teacherUserName">
            <el-input
              maxlength="20"
              v-model="ruleForm.teacherUserName"
              placeholder="请输入培训讲师"
              :disabled="pageFlag === 'see'"
              type="text"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="培训对象" prop="trainObject">
            <el-input
              maxlength="200"
              v-model="ruleForm.trainObject"
              placeholder="请输入培训对象"
              :disabled="pageFlag === 'see'"
              type="text"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="培训主题" prop="subject">
            <el-input
              maxlength="200"
              v-model="ruleForm.subject"
              placeholder="请输入培训主题"
              :disabled="pageFlag === 'see'"
              type="text"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="培训类型" prop="type">
            <el-select
              placeholder="请选择培训类型"
              style="width: 100%"
              :clearable="true"
              :filterable="true"
              :disabled="pageFlag === 'see'"
              v-model="ruleForm.type"
            >
              <el-option value="0" label="线上" />
              <el-option value="1" label="线下" />
              <el-option value="2" label="内训" />
              <el-option value="3" label="外训" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="主要内容" prop="content">
            <el-input
              type="textarea"
              autosize
              maxlength="500"
              :disabled="pageFlag === 'see'"
              v-model="ruleForm.content"
              placeholder="请输入主要内容"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="考核方式" prop="assessMethod">
            <el-Radio-group v-model="ruleForm.assessMethod" :disabled="pageFlag === 'see'">
              <el-Radio label="0">笔试</el-Radio>
              <el-Radio label="1">口试</el-Radio>
              <el-Radio label="2">实际操作</el-Radio>
            </el-Radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="考核结果反馈" prop="assessResult">
            <el-input
              type="textarea"
              autosize
              maxlength="500"
              :disabled="pageFlag === 'see'"
              v-model="ruleForm.assessResult"
              placeholder="请输入考核结果反馈"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="参与人员" prop="userIds">
            <el-input v-model="ruleForm.userIds" v-show="false" type="text" />
            <div class="check-all-class">
              <el-checkbox
                v-model="isAllSelectedSub"
                :indeterminate="indeterminateSub"
                @change="handleCheckAllChangeSub"
                style="float: right"
                :disabled="pageFlag === 'see'"
                >全体人员</el-checkbox
              >
            </div>
            <div class="div-person-bg" v-show="!isAllSelectedSub">
              <div v-for="user in selectedPersonArraySub" :key="user.userId" class="inline-grid">
                <el-tooltip
                  effect="dark"
                  :content="user.nickName"
                  placement="bottom-start"
                  :show-arrow="false"
                  popper-class="person-popper-class"
                >
                  <img
                    v-if="user.avatar && user.avatar !== ''"
                    :src="user.avatar"
                    class="person-bg"
                    @error="setDefaultImage"
                  />
                  <img v-else src="@/assets/imgs/avatar.jpg" class="person-bg" />
                </el-tooltip>
                <span class="user-name-class">{{ nameOverflow(user.nickName) }}</span>
              </div>
              <div class="add-person-bg" @click="addPersonSub" v-if="pageFlag !== 'see'">
                <img src="@/assets/imgs/icon/add_icon.png" />
              </div>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input
              maxlength="500"
              v-model="ruleForm.remark"
              placeholder="请输入备注"
              :disabled="pageFlag === 'see'"
              type="textarea"
              autosize
            />
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="是否公开" prop="openFlag">
            <el-switch
              v-model="ruleForm.openFlag"
              :disabled="pageFlag === 'see' || (pageFlag == 'edit' && !canOpen)"
              active-value="1"
              inactive-value="0"
              @change="openFlagChange"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="ruleForm.openFlag == '1'">
        <el-col :span="24">
          <el-form-item label="课程名称" prop="courseName">
            <el-input
              maxlength="200"
              v-model="ruleForm.courseName"
              placeholder="请输入课程名称"
              :disabled="pageFlag === 'see'"
              type="text"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="讲师" prop="lecturerId">
            <el-select
              placeholder="请选择讲师"
              style="width: 100%"
              :clearable="true"
              :filterable="true"
              :disabled="pageFlag === 'see'"
              v-model="ruleForm.lecturerId"
            >
              <el-option
                :value="item.value"
                :label="item.label"
                v-for="item in lecturerArray"
                :key="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="类型" prop="type2">
            <el-select
              placeholder="请选择类型"
              style="width: 100%"
              :clearable="true"
              :filterable="true"
              :disabled="pageFlag === 'see'"
              v-model="ruleForm.type2"
            >
              <el-option
                :value="item.value"
                :label="item.label"
                v-for="item in courseType"
                :key="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="二级类型" prop="secondType">
            <el-select
              placeholder="请选择二级类型"
              style="width: 100%"
              :clearable="true"
              :filterable="true"
              :disabled="pageFlag === 'see'"
              v-model="ruleForm.secondType"
            >
              <el-option
                :value="item.value"
                :label="item.label"
                v-for="item in courseSecondType"
                :key="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="精选课程" prop="choicenessStatus">
            <el-select
              placeholder="请选择是否精选课程"
              style="width: 100%"
              :clearable="true"
              :filterable="true"
              :disabled="pageFlag === 'see'"
              v-model="ruleForm.choicenessStatus"
            >
              <el-option
                :value="item.value"
                :label="item.label"
                v-for="item in yesOrNo"
                :key="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="课程大纲" prop="outline">
            <el-input
              type="textarea"
              autosize
              maxlength="1000"
              :disabled="pageFlag === 'see'"
              v-model="ruleForm.outline"
              placeholder="请输入课程大纲"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="封面" prop="coverUrl">
            <div
              style="
                width: 100%;
                display: flex;
                vertical-align: middle;
                line-height: normal;
                align-items: center;
              "
            >
              <ImgUpload
                v-model:modelValue="ruleForm.coverUrl"
                :limit="2"
                :disabled="pageFlag === 'see'"
                :fileType="['png', 'jpg', 'jpeg']"
              />
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="课程文件" prop="courseUrl">
            <div
              style="
                width: 100%;
                display: flex;
                vertical-align: middle;
                line-height: normal;
                align-items: center;
              "
            >
              <FileUpload
                v-model:modelValue="ruleForm.courseUrl"
                :limit="1"
                style="width: 100%"
                :fileSize="2 * 1024"
                :disabled="pageFlag === 'see'"
                :fileType="['webm', 'ogg', 'mp4']"
              />
            </div>
            <div v-if="ruleForm.courseUrl">
              <video
                :src="ruleForm.courseUrl ? ruleForm.courseUrl : ''"
                controls
                id="videoPlayer"
                ref="movie"
                :poster="ruleForm.coverUrl ? String(ruleForm.coverUrl) : ''"
                class="video-class"
                controlslist="nodownload noremoteplayback"
                :disablePictureInPicture="true"
                v-show="false"
              >
                您的浏览器不支持 video 标签。
              </video>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="浏览权限" prop="userIdsSub">
            <el-input v-model="ruleForm.userIdsSub" v-show="false" type="text" />
            <div class="check-all-class">
              <el-checkbox
                v-model="isAllSelected"
                @change="handleCheckAllChange"
                :indeterminate="indeterminate"
                style="float: right"
                :disabled="pageFlag === 'see'"
                >全体人员</el-checkbox
              >
            </div>
            <div class="div-person-bg" v-show="!isAllSelected">
              <div v-for="user in selectedPersonArray" :key="user.userId" class="inline-grid">
                <el-tooltip
                  effect="dark"
                  :content="user.nickName"
                  placement="bottom-start"
                  :show-arrow="false"
                  popper-class="person-popper-class"
                >
                  <img
                    v-if="user.avatar && user.avatar !== ''"
                    :src="user.avatar"
                    class="person-bg"
                    @error="setDefaultImage"
                  />
                  <img v-else src="@/assets/imgs/avatar.jpg" class="person-bg" />
                </el-tooltip>
                <span class="user-name-class">{{ nameOverflow(user.nickName) }}</span>
              </div>
              <div class="add-person-bg" @click="addPerson" v-if="pageFlag !== 'see'">
                <img src="@/assets/imgs/icon/add_icon.png" />
              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="footer">
        <el-button class="dialog-btn-sure" :loading="loading" @click="saveCourse"> 确定 </el-button>
        <el-button class="dialog-btn-cancel" @click="closeDialog"> 取消 </el-button>
      </div>
    </template>
  </ElDialog>
  <PersonnelSelection ref="personnelSelectionRef" @sure-click="savePerson" />
</template>
<style lang="less" scoped>
.video-class{
  object-fit: cover; height: 20px;
}
:deep(.el-input__wrapper) {
  width: 100% !important;
}
.add-person-bg {
  width: 40px;
  height: 40px;
  float: left;
  margin-left: 8px;
  margin-bottom: 8px;
  background-color: #ebeced;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.person-bg {
  width: 40px;
  height: 40px;
  float: left;
  margin-left: 8px;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.div-person-bg {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}
.check-all-class {
  margin-top: -35px;
  width: 100%;
}
.user-name-class {
  width: 100%;
  text-align: center;
}
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
<style lang="less">
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
