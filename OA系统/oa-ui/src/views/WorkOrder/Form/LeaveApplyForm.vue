<!-- 请假申请 -->
<script setup lang="ts">
import { ref, unref, reactive, nextTick, getCurrentInstance } from 'vue'
import { propTypes } from '@/utils/propTypes'
import { useValidator } from '@/hooks/web/useValidator'
import { FormSchema } from '@/types/form'
import { useEmitt } from '@/hooks/web/useEmitt'
import { applyOrderApi, getOrderDetailApi, editOrderApi, getHolidayDurationApi } from '@/api/order'
import moment from 'moment'
import {
  ElMessage,
  ElForm,
  ElFormItem,
  ElRow,
  ElCol,
  ElDatePicker,
  ElSelect,
  ElOption,
  ElInput
} from 'element-plus'
import { Dialog } from '@/components/Dialog'
import { FileButtonUpload } from '@/components/FileButtonUpload' // 文件上传组件
import { useCache } from '@/hooks/web/useCache'
import { PersonnelSelection } from '@/components/PersonnelSelection'
import { getAllUserListApi } from '@/api/user' // 获取所有用户

const { wsCache } = useCache()
const loginUserId = ref<string>(wsCache.get('userInfo').userId) // 登录用户id
const { emitter } = useEmitt()
const { proxy } = getCurrentInstance() as any
const { leave_type } = proxy.useDict('leave_type')
// 弹窗的开启和关闭
const dialogFlag = ref<any>(false)
type Callback = (error?: string | Error | undefined) => void

const { required, validateEnglishAndNumber, notSpace } = useValidator()

const props = defineProps({
  title: propTypes.string.def('')
})
//表单
const formRef = ref<any>()
//保存等待
const loading = ref(false)
//保存数据
const save = async () => {
  //表单验证
  if (!formRef.value) return
  await formRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      loading.value = true
      let data = ruleForm.value
      if (pageFlag.value === 'add') {
        //新增
        addApply(data, '1')
      } else {
        //编辑
        editApply(data, '1')
      }
    }
  })
}

//编辑
const editApply = async (data: any, flag: string) => {
  let filePathTempArray: any[] = []
  if (data.uploadFile) {
    filePathTempArray.push({ fileUrl: data.uploadFile })
  }
  let notices: any = []
  selectedPersonArray.value.forEach((item: any) => {
    notices.push({ userId: item.userId })
  })
  let leave = {
    applyReason: data.applyReason,
    applyType: data.applyType,
    comment: null,
    endDate: moment(data.endDate).format('YYYY-MM-DD HH:mm:ss'),
    files: filePathTempArray,
    remark: null,
    startDate: moment(data.startDate).format('YYYY-MM-DD HH:mm:ss'),
    sumDate: data.sumDate,
    users: [{ userId: loginUserId.value }]
  }
  let params = {
    type: '1',
    urgency: data.urgency,
    flag: flag,
    leave: leave,
    id: detailsId.value,
    notices: notices
  }
  const res = await editOrderApi(params)
    .catch(() => {})
    .finally(() => {
      setTimeout(() => {
        loading.value = false
        releaseLoading.value = false
      }, 200)
    })
  if (res) {
    if (flag === '1') {
      ElMessage.success('保存信息成功')
    } else {
      ElMessage.success('发布信息成功')
    }
    //通知列表刷新
    emitter.emit('order', 'refresh')
    if (flag === '2') {
      emitter.emit('order', 'update')
    }
    closeDialog()
  }
}

//请假申请
const addApply = async (data: any, flag: string) => {
  let filePathTempArray: any[] = []
  if (data.uploadFile) {
    filePathTempArray.push({ fileUrl: data.uploadFile })
  }
  let notices: any = []
  selectedPersonArray.value.forEach((item: any) => {
    notices.push({ userId: item.userId })
  })
  let leave = {
    applyReason: data.applyReason,
    applyType: data.applyType,
    comment: null,
    endDate: moment(data.endDate).format('YYYY-MM-DD HH:mm:ss'),
    files: filePathTempArray,
    remark: null,
    startDate: moment(data.startDate).format('YYYY-MM-DD HH:mm:ss'),
    sumDate: data.sumDate,
    users: [{ userId: loginUserId.value }]
  }
  let params = {
    type: '1',
    urgency: data.urgency,
    flag: flag,
    leave: leave,
    notices: notices
  }
  const res = await applyOrderApi(params)
    .catch(() => {})
    .finally(() => {
      setTimeout(() => {
        loading.value = false
        releaseLoading.value = false
      }, 200)
    })
  if (res) {
    if (flag === '1') {
      ElMessage.success('保存信息成功')
    } else {
      ElMessage.success('发布信息成功')
    }
    if (flag === '2') {
      emitter.emit('order', 'update')
    }
    //通知列表刷新
    emitter.emit('order', 'refresh')
    closeDialog()
  }
}

//发布等待
const releaseLoading = ref(false)
//保存数据
const releaseApply = async () => {
  //表单验证
  if (!formRef.value) return
  await formRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      releaseLoading.value = true
      let data = ruleForm.value
      if (pageFlag.value === 'add') {
        addApply(data, '2')
      } else {
        //编辑
        editApply(data, '2')
      }
    }
  })
}

//弹窗
const elDialogFef = ref()
//打开drawer并初始化
const detailsId = ref<string>('')
const pageFlag = ref<string>('') // see 查看 edit 编辑 add 新增
const pageTite = ref<string>('')
const openDrawer = async (id: string, flag: string) => {
  dialogFlag.value = true
  elDialogFef.value.isFullscreen = false
  pageTite.value = flag == 'add' ? props.title : flag == 'edit' ? '编辑' : '详情'
  if (userData.value.length === 0) {
    await getAllUserlist()
  }
  nextTick(() => {
    detailsId.value = id
    pageFlag.value = flag
    getUserHolidayDuration()
    getDetailsData()
  })
}

//查询详情
const getDetailsData = async () => {
  if (detailsId.value) {
    const res = await getOrderDetailApi(detailsId.value)
    if (res && res.data) {
      let leave = res.data.leave
      let files = leave.files
      let notices = res.data.notices
      let uploadFile = ''
      if (files && files.length > 0) {
        uploadFile = files[0].fileUrl
      }
      nextTick()
      ruleForm.value = {
        applyType: leave.applyType ? leave.applyType : '',
        startDate: leave.startDate ? moment(leave.startDate).format('YYYY-MM-DD HH:mm:ss') : '',
        endDate: leave.endDate ? moment(leave.endDate).format('YYYY-MM-DD HH:mm:ss') : '',
        sumDate: leave.sumDate ? leave.sumDate : '',
        urgency: res.data.urgency ? String(res.data.urgency) : '',
        applyReason: leave.applyReason ? leave.applyReason : '',
        uploadFile: uploadFile,
        startEndDate: [
          leave.startDate ? moment(leave.startDate).format('YYYY-MM-DD HH:mm:ss') : '',
          leave.endDate ? moment(leave.endDate).format('YYYY-MM-DD HH:mm:ss') : ''
        ]
      }
      if (notices && notices.length > 0) {
        selectedPersonArray.value = []
        notices.forEach((item: any) => {
          userData.value.forEach((user: any) => {
            if (item.userId === user.userId) {
              selectedPersonArray.value.push(user)
            }
          })
        })
      }
    }
  }
}

//清空表单
const resetForm = () => {
  ruleForm.value = {
    applyType: '',
    startDate: '',
    endDate: '',
    sumDate: '',
    urgency: '1',
    applyReason: '',
    uploadFile: '',
    startEndDate: []
  }
}

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
  selectedPersonArray.value = []
  resetForm()
}

//请假类型选择
const selApplyType = (value: any) => {}

//表单数据
const ruleForm = ref<any>({
  applyType: '',
  startDate: '',
  endDate: '',
  sumDate: '',
  urgency: '1',
  applyReason: '',
  uploadFile: '',
  startEndDate: []
})
//表单验证规则
const rules = reactive({
  applyType: [{ required: true, message: '请选择请假类型', trigger: 'change' }],
  startEndDate: [
    { required: true, message: '请选择起止时间', trigger: 'change' },
    {
      validator: (rule: any, value: string, callback: Callback) => {
        if (value) {
          if (ruleForm.value.applyType === '3' && Number(ruleForm.value.sumDate) < 7) {
            callback(new Error('年假申请不得少于7小时'))
          } else if (ruleForm.value.applyType === '2' && Number(ruleForm.value.sumDate) < 3) {
            callback(new Error('调休申请不得少于3小时'))
          } else if (ruleForm.value.applyType === '1' && Number(ruleForm.value.sumDate) < 1) {
            callback(new Error('事假申请不得少于1小时'))
          } else if (ruleForm.value.applyType === '9' && Number(ruleForm.value.sumDate) < 1) {
            callback(new Error('病假申请不得少于1小时'))
          } else {
            callback()
          }
        }
      },
      trigger: 'change'
    }
  ],
  startDate: [
    { required: true, message: '请选择开始时间', trigger: 'change' },
    {
      validator: (rule: any, value: string, callback: Callback) => {
        if (value) {
          let time = moment(new Date(value)).format('HH:mm')
          if (time === '00:00') {
            let dateSelect = moment(new Date(value)).format('YYYY-MM-DD')
            ruleForm.value.startDate =
              moment(new Date(dateSelect)).format('YYYY-MM-DD') + ' ' + '09:00:00'
          }
          if (ruleForm.value.endDate) {
            if (
              new Date(ruleForm.value.startDate).getTime() >
              new Date(ruleForm.value.endDate).getTime()
            ) {
              callback(new Error('开始时间不得早于结束时间'))
            } else {
              callback()
            }
          }
        }
      },
      trigger: 'change'
    }
  ],
  endDate: [
    { required: true, message: '请选择结束时间', trigger: 'change' },
    {
      validator: (rule: any, value: string, callback: Callback) => {
        if (value) {
          let time = moment(new Date(value)).format('HH:mm')
          if (time === '00:00') {
            let dateSelect = moment(new Date(value)).format('YYYY-MM-DD')
            ruleForm.value.endDate =
              moment(new Date(dateSelect)).format('YYYY-MM-DD') + ' ' + '17:30:00'
          }
          if (ruleForm.value.startDate) {
            if (
              new Date(ruleForm.value.startDate).getTime() >
              new Date(ruleForm.value.endDate).getTime()
            ) {
              callback(new Error('结束时间不得晚于开始时间'))
            } else {
              callback()
            }
          }
        }
      },
      trigger: 'change'
    }
  ],
  sumDate: [
    { required: true, message: '请输入请假时长', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    },
    {
      validator: (rule: any, value: string, callback: Callback) => {
        if (/(^[1-9]{1}\d{0,2}$)|(^\d{0,3}[.]{1}[0-9]{1,2}$)/.test(value)) {
          if (ruleForm.value.applyType === '2' && Number(value) > relaxDay.value) {
            callback(new Error('调休剩余时间不足'))
          } else if (ruleForm.value.applyType === '3' && Number(value) > yearDay.value) {
            callback(new Error('年假剩余时间不足'))
          } else if (ruleForm.value.applyType === '3' && Number(value) < 7) {
            callback(new Error('年假申请不得少于7小时'))
          } else if (ruleForm.value.applyType === '2' && Number(value) < 3) {
            callback(new Error('调休申请不得少于3小时'))
          } else if (ruleForm.value.applyType === '1' && Number(value) < 1) {
            callback(new Error('事假申请不得少于1小时'))
          } else if (ruleForm.value.applyType === '9' && Number(value) < 1) {
            callback(new Error('病假申请不得少于1小时'))
          } else {
            callback()
          }
        } else {
          callback(new Error('请输入大于0且小于1000的数字，小数点后最多两位'))
        }
      },
      trigger: 'blur'
    }
  ],
  urgency: [{ required: true, message: '请选择紧急程度', trigger: 'change' }],
  applyReason: [
    { required: true, message: '请输入请假事由', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  uploadFile: [
    {
      validator: (rule: any, value: string, callback: Callback) => {
        if (
          ruleForm.value.applyType === '9' ||
          ruleForm.value.applyType === '4' ||
          ruleForm.value.applyType === '5'
        ) {
          if (value) {
            callback()
          } else {
            callback(new Error('请上传附件'))
          }
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
})
//开始时间选择
const startDateChange = (date: any) => {
  if (date) {
    let time = moment(new Date(date)).format('HH:mm')
    if (time === '00:00') {
      let dateSelect = moment(new Date(date)).format('YYYY-MM-DD')
      ruleForm.value.startDate =
        moment(new Date(dateSelect)).format('YYYY-MM-DD') + ' ' + '09:00:00'
    }
    if (
      ruleForm.value.endDate &&
      new Date(ruleForm.value.startDate).getTime() < new Date(ruleForm.value.endDate).getTime()
    ) {
      ruleForm.value.sumDate = String(
        dateDiffNoWeekDay(new Date(ruleForm.value.startDate), new Date(ruleForm.value.endDate))
      )
    }
  }
}

//结束时间选择
const endDateChange = (date: any) => {
  if (date) {
    let dateSelect = moment(new Date(date)).format('YYYY-MM-DD')
    let time = moment(new Date(date)).format('HH:mm')
    if (time === '00:00') {
      ruleForm.value.endDate = moment(new Date(dateSelect)).format('YYYY-MM-DD') + ' ' + '17:30:00'
    }
    if (
      ruleForm.value.startDate &&
      new Date(ruleForm.value.endDate).getTime() > new Date(ruleForm.value.startDate).getTime()
    ) {
      ruleForm.value.sumDate = String(
        dateDiffNoWeekDay(new Date(ruleForm.value.startDate), new Date(ruleForm.value.endDate))
      )
    }
  }
}

const startEndDateChange = (date: any) => {
  if (date) {
    let startDate = date[0]
    if (startDate) {
      let time = moment(new Date(startDate)).format('HH:mm')
      if (time === '00:00') {
        let dateSelect = moment(new Date(startDate)).format('YYYY-MM-DD')
        ruleForm.value.startDate =
          moment(new Date(dateSelect)).format('YYYY-MM-DD') + ' ' + '09:00:00'
      } else {
        ruleForm.value.startDate = moment(new Date(startDate)).format('YYYY-MM-DD HH:mm:ss')
      }
    }
    let endDate = date[1]
    if (endDate) {
      let dateSelect = moment(new Date(endDate)).format('YYYY-MM-DD')
      let time = moment(new Date(endDate)).format('HH:mm')
      if (time === '00:00') {
        ruleForm.value.endDate =
          moment(new Date(dateSelect)).format('YYYY-MM-DD') + ' ' + '17:30:00'
      } else {
        ruleForm.value.endDate = moment(new Date(endDate)).format('YYYY-MM-DD HH:mm:ss')
      }
    }
    date.splice(0, 1, ruleForm.value.startDate)
    date.splice(1, 1, ruleForm.value.endDate)
    ruleForm.value.sumDate = String(
      dateDiffNoWeekDay(new Date(ruleForm.value.startDate), new Date(ruleForm.value.endDate))
    )
  } else {
    ruleForm.value.startDate = ''
    ruleForm.value.endDate = ''
    ruleForm.value.sumDate = ''
  }
}
//调休小时
const relaxDay = ref<number>(0)
//年假小时
const yearDay = ref<number>(0)
//计算请假时长
const dateDiffNoWeekDay = (startTime: any, endTime: any) => {
  if (startTime >= endTime) return 0
  //1,分钟取整
  //2，计算总天数
  var totalTime = 0 //工时，天数
  if (startTime.getDay() == 6 || startTime.getDay() == 0) {
    if (endTime.getDate() > startTime.getDate()) {
      totalTime = endTime.getDate() - startTime.getDate()
    } else {
      totalTime = Math.floor((endTime - startTime) / (3600 * 1000) / 24)
    }
  } else {
    totalTime = Math.floor((endTime - startTime) / (3600 * 1000) / 24)
  }
  //3,拿初始值赋值给一个临时变量
  var tempStartTime = new Date()
  tempStartTime.setTime(startTime.getTime())
  //4,计算出总天数
  while (tempStartTime.getTime() < endTime.getTime()) {
    if (tempStartTime.getDay() == 6 || tempStartTime.getDay() == 0) {
      //周六或者周日减去
      totalTime--
    }
    tempStartTime.setDate(tempStartTime.getDate() + 1)
  }
  //5,计算出总小时数
  var temp = 0 //工时，小时
  do {
    if (startTime.getDay() == 6 || startTime.getDay() == 0) {
      //周六周日
      startTime.setDate(startTime.getDate() + 1)
      //周六周日直接跳过，初始化为早晨9点
      startTime.setHours(9)
      startTime.setMinutes(0)
      continue
    }

    let tempMinutes = startTime.getHours() * 60 + startTime.getMinutes()
    //上午9点到12点，算工时
    if (tempMinutes >= 9 * 60 && tempMinutes < 12 * 60) {
      temp += 0.001
    }
    //上午14点到18点半，算工时
    if (tempMinutes >= 13 * 60 + 30 && tempMinutes < 17 * 60 + 30) {
      temp += 0.001
    }
    startTime.setTime(startTime.getTime() + 0.01 * 3600 * 1000) //每次增加半个小时
  } while (
    startTime.getHours() * 60 + startTime.getMinutes() !=
      endTime.getHours() * 60 + endTime.getMinutes() &&
    new Date(startTime).getTime() < new Date(endTime).getTime()
  )
  {
    totalTime += Math.floor(temp / 0.7)
    totalTime += temp % 0.7
    totalTime = Math.round(totalTime * 1000) / 1000
  }
  var days = Math.floor(totalTime)
  var hours = Math.round((totalTime - days) * 1000) / 100

  return days * 7 + hours > 0 ? days * 7 + hours : 0
}
//获取调休时长和年假时长
const getUserHolidayDuration = async () => {
  const res = await getHolidayDurationApi()
  if (res && res.data) {
    res.data.forEach((element: any) => {
      if (element.type === '1') {
        yearDay.value = element.hours
      } else if (element.type === '2') {
        relaxDay.value = element.hours
      }
    })
  }
}

//添加知会人
const addPerson = () => {
  nextTick(() => {
    let checkedKeys: any[] = []
    selectedPersonArray.value.forEach((item: any) => {
      checkedKeys.push(item.userId)
    })
    personnelSelectionRef.value.openDialog(checkedKeys)
  })
}
const personnelSelectionRef = ref()
const selectedPersonArray = ref<any[]>([])
const savePerson = (checkAllGroup: any) => {
  selectedPersonArray.value = []
  checkAllGroup.forEach((item: any) => {
    userData.value.forEach((user: any) => {
      if (item === user.userId) {
        selectedPersonArray.value.push(user)
      }
    })
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

const setDefaultImage = async (e: any) => {
  const avatar = await import('@/assets/imgs/avatar.jpg')
  e.target.src = avatar.default
}
defineExpose({
  openDrawer
})
</script>

<template>
  <PersonnelSelection ref="personnelSelectionRef" @sure-click="savePerson" />
  <Dialog
    ref="elDialogFef"
    class="cultivate-custom"
    v-model="dialogFlag"
    :title="pageTite"
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
          <el-form-item label="请假类型" prop="applyType">
            <el-select
              placeholder="请选择请假类型"
              style="width: 100%"
              :clearable="true"
              :disabled="pageFlag === 'see'"
              @change="selApplyType"
              v-model="ruleForm.applyType"
            >
              <el-option
                :value="item.value"
                :label="item.label"
                v-for="item in leave_type"
                :disabled="
                  (item.value === '2' && relaxDay == 0) || (item.value === '3' && yearDay == 0)
                "
                :key="item.value"
              >
                <span v-if="item.value === '2' || item.value === '3'">{{ item.label }}</span>
                <span v-if="item.value === '2'" style="float: right; color: #ccc">{{
                  '剩余' + relaxDay + '小时'
                }}</span>
                <span v-if="item.value === '3'" style="float: right; color: #ccc">{{
                  '剩余' + yearDay + '小时'
                }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="起止时间" prop="startEndDate">
            <el-date-picker
              v-model="ruleForm.startEndDate"
              :clearable="true"
              placeholder="请选择开始时间"
              format="YYYY-MM-DD HH:mm"
              :disabled="pageFlag === 'see'"
              value-format="YYYY-MM-DD HH:mm"
              range-separator="-"
              start-placeholder="请选择开始时间"
              end-placeholder="请选择结束时间"
              @change="(val) => startEndDateChange(val)"
              type="datetimerange"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="false">
          <el-form-item label="开始时间" prop="startDate">
            <el-date-picker
              v-model="ruleForm.startDate"
              :clearable="true"
              placeholder="请选择开始时间"
              format="YYYY-MM-DD HH:mm"
              :disabled="pageFlag === 'see'"
              value-format="YYYY-MM-DD HH:mm"
              @change="(val) => startDateChange(val)"
              type="datetime"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="false">
          <el-form-item label="结束时间" prop="endDate">
            <el-date-picker
              :clearable="true"
              placeholder="请选择结束时间"
              format="YYYY-MM-DD HH:mm"
              value-format="YYYY-MM-DD HH:mm"
              :disabled="pageFlag === 'see'"
              type="datetime"
              v-model="ruleForm.endDate"
              @change="(val) => endDateChange(val)"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="请假时长（一天按7小时计）" prop="sumDate">
            <el-input
              type="text"
              v-model="ruleForm.sumDate"
              placeholder="请输入请假时长"
              :disabled="pageFlag === 'see'"
              maxlength="6"
            >
              <template #append>小时</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="紧急程度" prop="urgency">
            <el-select
              v-model="ruleForm.urgency"
              style="width: 100%"
              :disabled="pageFlag === 'see'"
              placeholder="紧急程度"
            >
              <template #prefix
                ><div
                  class="sel-urgency-class"
                  :class="
                    ruleForm.urgency === '1'
                      ? 'sel-urgency-low'
                      : ruleForm.urgency === '2'
                      ? 'sel-urgency-middle'
                      : 'sel-urgency-high'
                  "
                ></div
              ></template>
              <el-option value="1" class="urgencyClass urgency-low" label="正常" />
              <el-option value="2" class="urgencyClass urgency-middle" label="重要" />
              <el-option value="3" class="urgencyClass urgency-high" label="紧急" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="请假事由" prop="applyReason">
            <el-input
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 8 }"
              maxlength="500"
              :disabled="pageFlag === 'see'"
              v-model="ruleForm.applyReason"
              placeholder="请输入请假事由"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="pageFlag !== 'see' || selectedPersonArray.length">
          <el-form-item label="知会人">
            <div class="div-person-bg">
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
        <el-col :span="24">
          <el-form-item
            label="上传附件"
            prop="uploadFile"
            :required="
              ruleForm.applyType === '9' || ruleForm.applyType === '4' || ruleForm.applyType === '5'
            "
          >
            <div
              style="
                width: 100%;
                display: flex;
                vertical-align: middle;
                line-height: normal;
                align-items: center;
              "
            >
              <FileButtonUpload
                v-model:modelValue="ruleForm.uploadFile"
                :disabled="pageFlag === 'see'"
                :limit="1"
                :fileSize="100"
                :fileType="[
                  'pdf',
                  'doc',
                  'docx',
                  'png',
                  'jpg',
                  'jpeg',
                  'bmp',
                  'xls',
                  'xlsx',
                  'zip',
                  'rar'
                ]"
              />
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="footer">
        <el-button
          class="dialog-btn-sure"
          :disabled="releaseLoading"
          :loading="loading"
          @click="save"
          v-if="pageFlag !== 'see'"
        >
          暂存
        </el-button>
        <el-button
          class="dialog-btn-sure"
          :disabled="loading"
          :loading="releaseLoading"
          @click="releaseApply"
          v-if="pageFlag !== 'see'"
        >
          发布
        </el-button>
        <el-button class="dialog-btn-cancel" @click="closeDialog"> 取消 </el-button>
      </div>
    </template>
  </Dialog>
</template>

<style lang="less" scoped>
:deep(.el-input-group__append) {
  background-color: white;
  width: 35px;
}
.urgencyClass {
  display: flex;
  align-items: center;
  &:before {
    content: ' ';
    display: inline-block;
    margin-right: 12px;
    width: 20px;
    height: 20px;
    border-radius: 4px;
  }
}
.urgency-low:before {
  background-color: #80c36a;
}
.urgency-middle:before {
  background-color: #eeb915;
}
.urgency-high:before {
  background-color: #df3c2f;
}
.sel-urgency-class {
  content: ' ';
  display: inline-block;
  margin-right: 0.16rem;
  width: 12px;
  height: 12px;
  vertical-align: text-bottom;
  border-radius: 4px;
}

.sel-urgency-low {
  background-color: #80c36a;
}

.sel-urgency-middle {
  background-color: #eeb915;
}

.sel-urgency-high {
  background-color: #df3c2f;
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
.user-name-class {
  width: 100%;
  text-align: center;
}
</style>
<style>
.person-popper-class {
  margin-top: -14px !important;
  padding: 0px 4px;
}
</style>
