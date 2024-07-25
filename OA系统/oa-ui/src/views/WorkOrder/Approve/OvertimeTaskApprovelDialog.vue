<template>
  <Dialog
    ref="elDialogFef"
    width="68%"
    class="cultivate-custom"
    v-model="dialogFlag"
    :title="dialogTitle"
    @closed="resetFormAfterClose"
  >
    <OvertimeRecordDialog ref="overtimeRecordDialogRef" />
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="formRef"
      label-position="top"
      label-width="100px"
      class="demo-ruleForm"
    >
      <div class="flex w-full">
        <div class="left-form-class">
          <el-row>
            <!-- <el-col :span="24">
              <el-form-item label="任务类型" prop="type">
                <el-select
                  placeholder="请选择任务类型"
                  style="width: 100%"
                  :clearable="true"
                  disabled
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
                  disabled
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
                  disabled
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
                  disabled
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
                  <div
                    v-for="user in selectedPersonArray"
                    :key="user.userId"
                    class="inline-grid"
                    :style="{ cursor: ruleForm.status === '7' ? 'pointer' : '' }"
                    @click="seeRecord(user.userId)"
                  >
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
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="pageFlag === 'approve' || pageFlag === 'archive'">
            <el-col :span="24">
              <el-form-item label="" prop="orderExpain">
                <span>审核意见（驳回必填<span class="red"> *</span>）</span>
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 4, maxRows: 8 }"
                  maxlength="200"
                  v-model="ruleForm.orderExpain"
                  placeholder="请输入审核意见"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="right-form-class">
          <p>审批记录</p>
          <OrderStep :flowDatas="flowDatas" />
        </div>
      </div>
    </el-form>

    <template #footer>
      <div class="footer">
        <el-button
          class="dialog-btn-sure"
          :loading="passLoading"
          :disabled="rejectLoading"
          @click="pass"
          v-if="pageFlag === 'approve' || pageFlag === 'archive'"
        >
          通过
        </el-button>

        <el-button
          class="dialog-btn-reject"
          :loading="rejectLoading"
          :disabled="passLoading"
          @click="reject"
          v-if="pageFlag === 'approve' || pageFlag === 'archive'"
          plain
        >
          驳回
        </el-button>
        <el-button class="dialog-btn-cancel" @click="closeDialog" v-if="pageFlag === 'see'">
          取消
        </el-button>
      </div>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { nextTick, reactive, ref } from 'vue'
import { Dialog } from '@/components/Dialog'
import { getAllUserListApi } from '@/api/user' // 获取所有用户
import { ElMessage } from 'element-plus'
import { useEmitt } from '@/hooks/web/useEmitt'
import { useValidator } from '@/hooks/web/useValidator'
import { OvertimeRecordDialog } from './index'
import { archiveOrderApi, auditOrderApi, getOrderDetailApi } from '@/api/order'
import moment from 'moment'
import { OrderStep } from '../Step'

type Callback = (error?: string | Error | undefined) => void

const overtimeRecordDialogRef = ref()
const setDefaultImage = async (e: any) => {
  const avatar = await import('@/assets/imgs/avatar.jpg')
  e.target.src = avatar.default
}
const { required, validateEnglishAndNumber, notSpace } = useValidator()
const { emitter } = useEmitt()
//弹窗
const elDialogFef = ref()
// 弹窗的开启和关闭
const dialogFlag = ref<any>(false)
const detailsId = ref<string>('')
const pageFlag = ref<string>('') // see 查看 edit 编辑 add 新增
const dialogTitle = ref<string>('')
//获取所有用户
const selectedPersonArray = ref<any[]>([])
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
  status: '',
  users: '',
  orderExpain: ''
})

//审核流程
const flowDatas = ref<any[]>([])

const openDrawer = async (id: string, flag: string) => {
  dialogFlag.value = true
  elDialogFef.value.isFullscreen = false
  selectedPersonArray.value = []
  if (userData.value.length === 0) {
    await getAllUserlist()
  }
  nextTick(() => {
    detailsId.value = id
    pageFlag.value = flag
    dialogTitle.value = flag === 'approve' ? '审核' : flag === 'archive' ? '归档' : '详情'
    getDetailsData()
  })
}

//查询详情
const getDetailsData = async () => {
  if (detailsId.value) {
    const res = await getOrderDetailApi(detailsId.value)
    if (res && res.data) {
      let workorderOvertime = res.data.workorderOvertime
      let users = workorderOvertime.users
      let audits = res.data.audits
      nextTick()
      ruleForm.value = {
        status: workorderOvertime.status ? workorderOvertime.status : '',
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
      // 审核流程
      flowDatas.value = audits
      if (res.data.workorderOvertime.status == '2' || res.data.workorderOvertime.status == '4') {
        let arr = [
          {
            roleName: res.data.leaderRoleName,
            createByName: res.data.leaderName,
            orderStep: '待审核'
          },
          {
            roleName: '人力资源部经理',
            createByName: '高敬',
            orderStep: '待归档'
          }
        ]
        flowDatas.value = [...flowDatas.value, ...arr]
      } else if (
        res.data.workorderOvertime.status == '5' ||
        res.data.workorderOvertime.status == '8'
      ) {
        let arr = [
          {
            roleName: '人力资源部经理',
            createByName: '高敬',
            orderStep: '待归档'
          }
        ]
        flowDatas.value = [...flowDatas.value, ...arr]
      }
    }
  }
}

//清空表单
const resetForm = () => {
  ruleForm.value = {
    type: '',
    reason: '',
    taskDate: [],
    startDate: '',
    endDate: '',
    urgency: '1',
    users: '',
    status: '',
    orderExpain: ''
  }
}

//表单
const formRef = ref<any>()
//保存等待
const passLoading = ref(false)
//保存数据
const pass = async () => {
  //表单验证
  if (!formRef.value) return
  await formRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      passLoading.value = true
      let data = ruleForm.value
      if (pageFlag.value === 'approve') {
        approveApply(data, '已通过')
      } else if (pageFlag.value === 'archive') {
        archiveOrder(data, '已归档')
      }
    }
  })
}

const rejectLoading = ref(false)
//保存数据
const reject = async () => {
  //表单验证
  if (!ruleForm.value.orderExpain) {
    ElMessage.error('请输入审核意见')
    return
  }
  if (!formRef.value) return
  await formRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      rejectLoading.value = true
      let data = ruleForm.value
      if (pageFlag.value === 'approve') {
        approveApply(data, '已驳回')
      } else if (pageFlag.value === 'archive') {
        archiveOrder(data, '已驳回')
      }
    }
  })
}
//请假申请
const approveApply = async (data: any, flag: string) => {
  let params = {
    orderExpain: data.orderExpain,
    orderId: detailsId.value,
    orderStep: flag
  }
  const res = await auditOrderApi(params)
    .catch(() => {})
    .finally(() => {
      setTimeout(() => {
        rejectLoading.value = false
        passLoading.value = false
      }, 200)
    })
  if (res) {
    if (flag === '已驳回') {
      ElMessage.success('驳回成功')
    } else {
      ElMessage.success('保存信息成功')
    }
    //通知列表刷新
    emitter.emit('order', 'refresh')
    closeDialog()
  }
}

const archiveOrder = async (data: any, flag: string) => {
  let params = {
    orderExpain: data.orderExpain,
    orderId: detailsId.value,
    orderStep: flag
  }
  const res = await archiveOrderApi(params)
    .catch(() => {})
    .finally(() => {
      setTimeout(() => {
        rejectLoading.value = false
        passLoading.value = false
      }, 200)
    })
  if (res) {
    if (flag === '已驳回') {
      ElMessage.success('驳回成功')
    } else {
      ElMessage.success('保存信息成功')
    }
    //通知列表刷新
    emitter.emit('order', 'refresh')
    closeDialog()
  }
}

//关闭
const closeDialog = () => {
  dialogFlag.value = false
}

//关闭后清空
const resetFormAfterClose = () => {
  dialogFlag.value = false
  passLoading.value = false
  rejectLoading.value = false
  if (elDialogFef.value) {
    elDialogFef.value.isFullscreen = false
  }
  flowDatas.value = []
  selectedPersonArray.value = []
  resetForm()
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

//表单验证规则
const rules = reactive({
  orderExpain: [
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ]
})

const seeRecord = (id: any) => {
  if (ruleForm.value.status == '7') {
    let param: any = { userId: id, orderId: detailsId.value }
    overtimeRecordDialogRef.value.openDrawer(param)
  }
}

defineExpose({
  openDrawer
})
</script>
<style lang="less" scoped>
.red {
  color: red;
}

.left-form-class {
  width: 60%;
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
.right-form-class {
  width: 39%;
  padding-left: 30px;
  padding-right: 10px;
  overflow-y: auto;
}

.right-title-p-class {
  width: 100%;
  color: #333333;
  font-size: 15px;
  font-family: 'Alibaba PuHuiTi M';
  font-weight: 400;
}

.right-title-p-class {
  width: 100%;
  color: #333333;
  font-size: 15px;
  font-family: 'Alibaba PuHuiTi M';
  font-weight: 400;
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
