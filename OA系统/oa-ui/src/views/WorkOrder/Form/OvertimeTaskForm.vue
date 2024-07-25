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
        <!-- <el-col :span="24">
          <el-form-item label="任务类型" prop="type">
            <el-select
              placeholder="请选择任务类型"
              style="width: 100%"
              :clearable="true"
              :disabled="pageFlag === 'see'"
              v-model="ruleForm.type"
            >
              <el-option value="1" label="工作日" />
              <el-option value="2" label="休息日" />
              <el-option value="3" label="节假日" />
              <el-option value="4" label="其他" />
            </el-select>
          </el-form-item>
        </el-col> -->
        <el-col :span="24">
          <el-form-item label="任务描述" prop="reason">
            <el-input
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 8 }"
              maxlength="200"
              :disabled="pageFlag === 'see'"
              v-model="ruleForm.reason"
              placeholder="请输入任务描述"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="任务日期" prop="taskDate">
            <el-date-picker
              v-model="ruleForm.taskDate"
              :clearable="true"
              placeholder="请选择任务日期"
              format="YYYY-MM-DD"
              :disabled="pageFlag === 'see'"
              value-format="YYYY-MM-DD"
              range-separator="-"
              start-placeholder="请选择开始日期"
              end-placeholder="请选择结束日期"
              @change="(val) => startEndDateChange(val)"
              type="daterange"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="紧急程度" prop="urgency">
            <el-select
              v-model="ruleForm.urgency"
              :disabled="pageFlag === 'see'"
              style="width: 100%"
              placeholder="紧急程度"
            >
              <template #prefix>
                <div
                  class="sel-urgency-class"
                  :class="
                    ruleForm.urgency === '1'
                      ? 'sel-urgency-low'
                      : ruleForm.urgency === '2'
                      ? 'sel-urgency-middle'
                      : 'sel-urgency-high'
                  "
                ></div>
              </template>
              <el-option value="1" class="urgencyClass urgency-low" label="正常" />
              <el-option value="2" class="urgencyClass urgency-middle" label="重要" />
              <el-option value="3" class="urgencyClass urgency-high" label="紧急" />
            </el-select>
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
<script setup lang="ts">
import { nextTick, reactive, ref } from 'vue'
import { Dialog } from '@/components/Dialog'
import { useCache } from '@/hooks/web/useCache'
import { useValidator } from '@/hooks/web/useValidator'
import moment from 'moment'
import { getAllUserListApi } from '@/api/user' // 获取所有用户
import { PersonnelSelectionDept } from '@/components/PersonnelSelection'
import { applyOrderApi, getOrderDetailApi, editOrderApi } from '@/api/order'
import { ElMessage } from 'element-plus'
import { useEmitt } from '@/hooks/web/useEmitt'

const { wsCache } = useCache()
const { emitter } = useEmitt()
const loginUser = ref<any>(wsCache.get('userInfo')) // 登录用户信息
type Callback = (error?: string | Error | undefined) => void
const { required, validateEnglishAndNumber, notSpace } = useValidator()
const setDefaultImage = async (e: any) => {
  const avatar = await import('@/assets/imgs/avatar.jpg')
  e.target.src = avatar.default
}
//获取所有用户
const userData = ref<any>([])
const getAllUserlist = async () => {
  try {
    const { data } = await getAllUserListApi({})
    userData.value = data
  } catch (error) {}
}

//表单数据
const ruleForm = ref<any>({
  type: '',
  reason: '',
  taskDate: [],
  startDate: '',
  endDate: '',
  urgency: '1',
  users: ''
})

//清空表单
const resetForm = () => {
  ruleForm.value = {
    type: '',
    reason: '',
    taskDate: [],
    startDate: '',
    endDate: '',
    urgency: '1',
    users: ''
  }
}

//弹窗
const elDialogFef = ref()
// 弹窗的开启和关闭
const dialogFlag = ref<any>(false)
const detailsId = ref<string>('')
const pageFlag = ref<string>('') // see 查看 edit 编辑 add 新增
const pageTite = ref<string>('')
//打开drawer并初始化
const openDrawer = async (id: string, flag: string) => {
  dialogFlag.value = true
  pageFlag.value = flag
  elDialogFef.value.isFullscreen = false
  pageTite.value = flag == 'add' ? '加班任务' : flag == 'edit' ? '编辑' : '详情'
  selectedPersonArray.value = []
  if (userData.value.length === 0) {
    await getAllUserlist()
  }
  nextTick(() => {
    detailsId.value = id
    pageFlag.value = flag
    getDetailsData()
  })
}

const getDetailsData = async () => {
  if (detailsId.value) {
    const res = await getOrderDetailApi(detailsId.value)
    if (res && res.data) {
      let workorderOvertime = res.data.workorderOvertime
      let users = workorderOvertime.users
      nextTick()
      ruleForm.value = {
        type: workorderOvertime.type ? workorderOvertime.type : '',
        urgency: res.data.urgency ? String(res.data.urgency) : '',
        reason: workorderOvertime.reason ? workorderOvertime.reason : '',
        startDate: workorderOvertime.startDate ? workorderOvertime.startDate : '',
        endDate: workorderOvertime.endDate ? workorderOvertime.endDate : '',
        taskDate: [
          workorderOvertime.startDate
            ? moment(workorderOvertime.startDate).format('YYYY-MM-DD')
            : '',
          workorderOvertime.endDate ? moment(workorderOvertime.endDate).format('YYYY-MM-DD') : ''
        ]
      }
      if (users && users.length > 0) {
        selectedPersonArray.value = []
        users.forEach((item: any) => {
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

const startEndDateChange = (date: any) => {
  if (date) {
    let startDate = date[0]
    if (startDate) {
      ruleForm.value.startDate = moment(new Date(startDate)).format('YYYY-MM-DD')
    }
    let endDate = date[1]
    if (endDate) {
      ruleForm.value.endDate = moment(new Date(endDate)).format('YYYY-MM-DD')
    }
  } else {
    ruleForm.value.startDate = ''
    ruleForm.value.endDate = ''
  }
}

//关闭
const closeDialog = () => {
  dialogFlag.value = false
}

//关闭后清空
const resetFormAfterClose = () => {
  dialogFlag.value = false
  selectedPersonArray.value = []
  if (elDialogFef.value) {
    elDialogFef.value.isFullscreen = false
  }
  resetForm()
}

//表单验证规则
const rules = reactive({
  type: [{ required: true, message: '请选择任务类型', trigger: 'change' }],
  taskDate: [{ required: true, message: '请选择任务日期', trigger: 'change' }],
  urgency: [{ required: true, message: '请选择紧急程度', trigger: 'change' }],
  reason: [
    { required: true, message: '请输入任务描述', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ]
})

//表单
const formRef = ref<any>()
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

//新增
const addApply = async (data: any, flag: string) => {
  let users: any[] = []
  selectedPersonArray.value.forEach((item: any) => {
    users.push({ userId: item.userId })
  })
  let workorderOvertime = {
    reason: data.reason,
    type: data.type,
    startDate: data.startDate,
    endDate: data.endDate,
    users: users
  }
  let params = {
    type: '10',
    urgency: data.urgency,
    flag: flag,
    workorderOvertime: workorderOvertime
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

//编辑
const editApply = async (data: any, flag: string) => {
  let users: any[] = []
  selectedPersonArray.value.forEach((item: any) => {
    users.push({ userId: item.userId })
  })
  let workorderOvertime = {
    reason: data.reason,
    type: data.type,
    startDate: data.startDate,
    endDate: data.endDate,
    users: users
  }
  let params = {
    type: '10',
    urgency: data.urgency,
    flag: flag,
    id: detailsId.value,
    workorderOvertime: workorderOvertime
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

//同行人员
const selectedPersonArray = ref<any[]>([])
//添加同行人员
const personnelSelectionRef = ref()
const addPerson = () => {
  nextTick(() => {
    let checkedKeys: any[] = []
    selectedPersonArray.value.forEach((item: any) => {
      checkedKeys.push(item.userId)
    })
    personnelSelectionRef.value.openDialog(checkedKeys)
  })
}

//人员确定
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

defineExpose({
  openDrawer
})
</script>
<style lang="less" scoped>
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
