<!-- 出差申请详情/审核 -->
<script setup lang="ts">
import { ref, unref, reactive, nextTick, getCurrentInstance } from 'vue'
import { propTypes } from '@/utils/propTypes'
import { useValidator } from '@/hooks/web/useValidator'
import { FormSchema } from '@/types/form'
import { useEmitt } from '@/hooks/web/useEmitt'
import { getOrderDetailApi, auditOrderApi, archiveOrderApi } from '@/api/order'
import { getAllUserListApi } from '@/api/user' // 获取所有用户
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
import { OrderStep } from '../Step'
import { FileButtonUpload } from '@/components/FileButtonUpload' // 文件上传组件

const { emitter } = useEmitt()
const { proxy } = getCurrentInstance() as any
const { go_out_type } = proxy.useDict('go_out_type')
// 弹窗的开启和关闭
const dialogFlag = ref<any>(false)
type Callback = (error?: string | Error | undefined) => void

const { required, validateEnglishAndNumber, notSpace } = useValidator()

const props = defineProps({
  title: propTypes.string.def('')
})
const dialogTitle = ref<string>('')
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
//弹窗
const elDialogFef = ref()
//打开drawer并初始化
const detailsId = ref<string>('')
const pageFlag = ref<string>('') // see 查看 edit 编辑 add 新增

const openDrawer = async (id: string, flag: string) => {
  dialogFlag.value = true
  elDialogFef.value.isFullscreen = false
  selectedPersonArray.value = []
  selectedPersonArraySub.value = []
  filePathArray.value = []
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

//获取所有用户
const userData = ref<any>([])
const getAllUserlist = async () => {
  try {
    const { data } = await getAllUserListApi({})
    userData.value = data
  } catch (error) {}
}
//同行人员
const selectedPersonArray = ref<any[]>([])
const filePathArray = ref<any[]>([])
//查询详情
const getDetailsData = async () => {
  if (detailsId.value) {
    const res = await getOrderDetailApi(detailsId.value)
    if (res && res.data) {
      let leave = res.data.leave
      let users = leave.users
      let audits = res.data.audits
      let notices = res.data.notices
      nextTick()
      let files = leave.files
      filePathArray.value = []
      if (files && files.length > 0) {
        files.forEach((element: any) => {
          filePathArray.value.push(element.fileUrl)
        })
      }
      ruleForm.value = {
        applyType: leave.applyType ? leave.applyType : '',
        startDate: leave.startDate ? moment(leave.startDate).format('YYYY-MM-DD HH:mm:ss') : '',
        endDate: leave.endDate ? moment(leave.endDate).format('YYYY-MM-DD HH:mm:ss') : '',
        sumDate: leave.sumDate ? leave.sumDate : '',
        urgency: res.data.urgency ? String(res.data.urgency) : '',
        applyReason: leave.applyReason ? leave.applyReason : '',
        detailedReasons: leave.detailedReasons ? leave.detailedReasons : '',
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
      flowDatas.value = audits
      if (res.data.leave.status == '2' || res.data.leave.status == '4') {
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
        res.data.leave.status == '3' ||
        res.data.leave.status == '5' ||
        res.data.leave.status == '8'
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
    applyType: '',
    startDate: '',
    endDate: '',
    sumDate: '',
    urgency: '1',
    detailedReasons: '',
    applyReason: '',
    uploadFile: '',
    orderExpain: '',
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
  passLoading.value = false
  rejectLoading.value = false
  if (elDialogFef.value) {
    elDialogFef.value.isFullscreen = false
  }
  resetForm()
  flowDatas.value = []
  filePathArray.value = []
  selectedPersonArraySub.value = []
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
  detailedReasons: '',
  applyReason: '',
  uploadFile: '',
  orderExpain: '',
  startEndDate: []
})
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
//审核流程
const flowDatas = ref<any[]>([])
//知会人
const selectedPersonArraySub = ref<any>([])
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
    width="68%"
    class="cultivate-custom"
    v-model="dialogFlag"
    :title="dialogTitle"
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
      <div class="flex w-full">
        <div class="left-form-class">
          <el-row>
            <el-col :span="24">
              <el-form-item label="出差类型" prop="applyType">
                <el-select
                  placeholder="请选择出差类型"
                  style="width: 100%"
                  :clearable="true"
                  disabled
                  @change="selApplyType"
                  v-model="ruleForm.applyType"
                >
                  <el-option
                    v-for="item in go_out_type"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label"
                  />
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
                  disabled
                  value-format="YYYY-MM-DD HH:mm"
                  range-separator="-"
                  start-placeholder="请选择开始时间"
                  end-placeholder="请选择结束时间"
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
                  disabled
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
                  disabled
                  v-model="ruleForm.endDate"
                  @change="(val) => endDateChange(val)"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="出差天数" prop="sumDate">
                <el-input
                  type="text"
                  v-model="ruleForm.sumDate"
                  placeholder="请输入出差天数"
                  disabled
                  maxlength="6"
                >
                  <template #append>天</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="紧急程度" prop="urgency">
                <el-select
                  v-model="ruleForm.urgency"
                  style="width: 100%"
                  placeholder="紧急程度"
                  disabled
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
              <el-form-item label="出差事由" prop="applyReason">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 4, maxRows: 8 }"
                  maxlength="500"
                  v-model="ruleForm.applyReason"
                  placeholder="请输入出差事由"
                  disabled
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="出差人员">
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
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="24" v-if="selectedPersonArraySub.length">
              <el-form-item label="知会人">
                <div class="div-person-bg">
                  <div
                    v-for="user in selectedPersonArraySub"
                    :key="user.userId"
                    class="inline-grid"
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
            <el-col :span="24" v-if="ruleForm.detailedReasons">
              <el-form-item label="补充详细事由" prop="detailedReasons">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 4, maxRows: 8 }"
                  maxlength="200"
                  disabled
                  v-model="ruleForm.detailedReasons"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24" v-if="filePathArray.length > 0">
              <el-form-item label="附件" prop="uploadFile">
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
                    v-model:modelValue="filePathArray"
                    disabled
                    :limit="1"
                    :fileType="['pdf', 'doc', 'docx', 'png', 'jpg', 'xls', 'xlsx', 'zip', 'rar']"
                  />
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

<style lang="less" scoped>
.red {
  color: red;
}

.left-form-class {
  width: 60%;
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
.div-person-bg {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
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
