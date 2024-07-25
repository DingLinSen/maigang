<!-- 加班申请 -->
<script setup lang="ts">
import { ref, unref, reactive, nextTick, getCurrentInstance, provide } from 'vue'
import { propTypes } from '@/utils/propTypes'
import { useValidator } from '@/hooks/web/useValidator'
import { FormSchema } from '@/types/form'
import { useEmitt } from '@/hooks/web/useEmitt'
import { applyOrderApi, getOrderDetailApi, editOrderApi } from '@/api/order'
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
import { getAllUserListApi } from '@/api/user' // 获取所有用户
import { PersonnelSelectionDept } from '@/components/PersonnelSelection'
import { useCache } from '@/hooks/web/useCache'

const { wsCache } = useCache()
const loginUserId = ref<string>(wsCache.get('userInfo').userId) // 登录用户id
const { emitter } = useEmitt()
const { proxy } = getCurrentInstance() as any
const { sys_normal_disable } = proxy.useDict('sys_normal_disable')
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
  let users = [{ userId: loginUserId.value }]
  selectedPersonArray.value.forEach((item: any) => {
    if (loginUserId.value !== item.userId) {
      users.push({ userId: item.userId })
    }
  })
  let notices: any = []
  selectedPersonArraySub.value.forEach((item: any) => {
    notices.push({ userId: item.userId })
  })
  let leave = {
    applyReason: data.applyReason,
    applyType: data.applyType,
    comment: null,
    endDate: moment(data.endDate).format('YYYY-MM-DD HH:mm:ss'),
    files: [],
    remark: null,
    startDate: moment(data.startDate).format('YYYY-MM-DD HH:mm:ss'),
    sumDate: data.sumDate,
    users: users
  }
  let params = {
    type: '3',
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

//加班申请
const addApply = async (data: any, flag: string) => {
  let users = [{ userId: loginUserId.value }]
  selectedPersonArray.value.forEach((item: any) => {
    if (loginUserId.value !== item.userId) {
      users.push({ userId: item.userId })
    }
  })
  let notices: any = []
  selectedPersonArraySub.value.forEach((item: any) => {
    notices.push({ userId: item.userId })
  })
  let leave = {
    applyReason: data.applyReason,
    applyType: data.applyType,
    comment: null,
    endDate: moment(data.endDate).format('YYYY-MM-DD HH:mm:ss'),
    files: [],
    remark: null,
    startDate: moment(data.startDate).format('YYYY-MM-DD HH:mm:ss'),
    sumDate: data.sumDate,
    users: users
  }
  let params = {
    type: '3',
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
    //通知列表刷新
    emitter.emit('order', 'refresh')
    if (flag === '2') {
      emitter.emit('order', 'update')
    }
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
        //新增
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
//打开drawer并初始化
const openDrawer = async (id: string, flag: string) => {
  dialogFlag.value = true
  pageFlag.value = flag
  pageTite.value = flag == 'add' ? props.title : flag == 'edit' ? '编辑' : '详情'
  selectedPersonArray.value = []
  selectedPersonArraySub.value = []
  if (userData.value.length === 0) {
    await getAllUserlist()
  }
  nextTick(() => {
    detailsId.value = id
    pageFlag.value = flag
    getDetailsData()
  })
}

//查询详情
const getDetailsData = async () => {
  if (detailsId.value) {
    const res = await getOrderDetailApi(detailsId.value)
    if (res && res.data) {
      let leave = res.data.leave
      let users = leave.users
      let notices = res.data.notices
      nextTick()
      ruleForm.value = {
        applyType: leave.applyType ? leave.applyType : '',
        startDate: leave.startDate ? moment(leave.startDate).format('YYYY-MM-DD HH:mm:ss') : '',
        endDate: leave.endDate ? moment(leave.endDate).format('YYYY-MM-DD HH:mm:ss') : '',
        sumDate: leave.sumDate ? leave.sumDate : '',
        urgency: res.data.urgency ? String(res.data.urgency) : '',
        applyReason: leave.applyReason ? leave.applyReason : '',
        startEndDate: [
          leave.startDate ? moment(leave.startDate).format('YYYY-MM-DD HH:mm:ss') : '',
          leave.endDate ? moment(leave.endDate).format('YYYY-MM-DD HH:mm:ss') : ''
        ]
      }
      if (users && users.length > 0) {
        selectedPersonArray.value = []
        users.forEach((item: any) => {
          userData.value.forEach((user: any) => {
            if (item.userId === user.userId) {
              // if (pageFlag.value === 'edit') {
              //   if (loginUserId.value !== item.userId) {
              //     selectedPersonArray.value.push(user)
              //   }
              // } else {
              //   selectedPersonArray.value.push(user)
              // }
              selectedPersonArray.value.push(user)
            }
          })
        })
      }
      if (notices && notices.length > 0) {
        selectedPersonArraySub.value = []
        notices.forEach((item: any) => {
          userData.value.forEach((user: any) => {
            if (item.userId === user.userId) {
              selectedPersonArraySub.value.push(user)
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
  resetForm()
}

//加班类型选择
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
  applyType: [{ required: true, message: '请选择加班类型', trigger: 'change' }],
  startEndDate: [{ required: true, message: '请选择起止时间', trigger: 'change' }],
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
    { required: true, message: '请输入加班时长', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    },
    {
      validator: (rule: any, value: string, callback: Callback) => {
        if (/(^[1-9]{1}\d{0,2}$)|(^\d{0,3}[.]{1}[0-9]{1,2}$)/.test(value)) {
          callback()
        } else {
          callback(new Error('请输入大于0且小于1000的数字，小数点后最多两位'))
        }
      },
      trigger: 'blur'
    }
  ],
  urgency: [{ required: true, message: '请选择紧急程度', trigger: 'change' }],
  applyReason: [
    { required: true, message: '请输入加班事由', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
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
        dateDiff(new Date(ruleForm.value.startDate), new Date(ruleForm.value.endDate))
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
        dateDiff(new Date(ruleForm.value.startDate), new Date(ruleForm.value.endDate))
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
      dateDiff(new Date(ruleForm.value.startDate), new Date(ruleForm.value.endDate))
    )
  } else {
    ruleForm.value.startDate = ''
    ruleForm.value.endDate = ''
    ruleForm.value.sumDate = ''
  }
}

const dateDiff = (startTime: any, endTime: any) => {
  if (startTime >= endTime) return 0
  var totalTime = Math.round(((endTime - startTime) / (3600 * 1000)) * 100) / 100
  // var temp = 0 //工时，小时
  // do {
  //   let tempMinutes = startTime.getHours() * 60 + startTime.getMinutes()
  //   //上午9点到12点，算工时
  //   if (tempMinutes >= 9 * 60 && tempMinutes < 12 * 60) {
  //     temp += 0.5
  //   }
  //   //上午14点到18点半，算工时
  //   if (tempMinutes >= 13 * 60 + 30 && tempMinutes < 17 * 60 + 30) {
  //     temp += 0.5
  //   }
  //   startTime.setTime(startTime.getTime() + 0.5 * 3600 * 1000) //每次增加半个小时
  //   if (tempMinutes > 17 * 60 + 30) {
  //     //周六周日
  //     startTime.setDate(startTime.getDate() + 1)
  //     //周六周日直接跳过，初始化为早晨9点
  //     startTime.setHours(9)
  //     startTime.setMinutes(0)
  //   }
  // } while (new Date(startTime).getTime() < new Date(endTime).getTime())
  // Math.round(temp * 10) / 10
  return totalTime
}

//同行人员
const selectedPersonArray = ref<any[]>([])
//添加同行人员
const personnelSelectionRef = ref()
const addPerson = () => {
  selectType.value = 0
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
  if (selectType.value == 1) {
    selectedPersonArraySub.value = []
    checkAllGroup.forEach((item: any) => {
      userData.value.forEach((user: any) => {
        if (item === user.userId) {
          selectedPersonArraySub.value.push(user)
        }
      })
    })
  } else {
    selectedPersonArray.value = []
    checkAllGroup.forEach((item: any) => {
      userData.value.forEach((user: any) => {
        if (item === user.userId) {
          selectedPersonArray.value.push(user)
        }
      })
    })
  }
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

//添加知会人
const selectType = ref<number>(0) // 0代表添加加班人员 1代表添加知会人
const selectedPersonArraySub = ref<any>([])
const addPersonSub = () => {
  selectType.value = 1
  nextTick(() => {
    let checkedKeys: any[] = []
    selectedPersonArraySub.value.forEach((item: any) => {
      checkedKeys.push(item.userId)
    })
    personnelSelectionRef.value.openDialog(checkedKeys)
  })
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
  <Dialog
    ref="elDialogFef"
    class="cultivate-custom"
    v-model="dialogFlag"
    :title="pageTite"
    @closed="resetFormAfterClose"
  >
    <PersonnelSelectionDept ref="personnelSelectionRef" @sure-click="savePerson" />
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
          <el-form-item label="加班类型" prop="applyType">
            <el-select
              placeholder="请选择加班类型"
              style="width: 100%"
              :clearable="true"
              :disabled="pageFlag === 'see'"
              @change="selApplyType"
              v-model="ruleForm.applyType"
            >
              <el-option value="1" label="工作日" />
              <el-option value="2" label="休息日" />
              <el-option value="3" label="节假日" />
              <el-option value="4" label="其他" />
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
              value-format="YYYY-MM-DD HH:mm"
              :disabled="pageFlag === 'see'"
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
              type="datetime"
              v-model="ruleForm.endDate"
              :disabled="pageFlag === 'see'"
              @change="(val) => endDateChange(val)"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="加班时长（一天按7小时计）" prop="sumDate">
            <el-input
              type="text"
              v-model="ruleForm.sumDate"
              :disabled="pageFlag === 'see'"
              placeholder="请输入加班时长"
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
              :disabled="pageFlag === 'see'"
              style="width: 100%"
              placeholder="紧急程度"
              ><template #prefix
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
          <el-form-item label="加班事由" prop="applyReason">
            <el-input
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 8 }"
              maxlength="500"
              :disabled="pageFlag === 'see'"
              v-model="ruleForm.applyReason"
              placeholder="请输入加班事由"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="加班人员">
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

        <el-col :span="24" v-if="pageFlag !== 'see' || selectedPersonArraySub.length">
          <el-form-item label="知会人">
            <div class="div-person-bg">
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
      </el-row>
    </el-form>
    <template #footer>
      <div class="footer">
        <el-button
          class="dialog-btn-sure"
          :loading="loading"
          :disabled="releaseLoading"
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
