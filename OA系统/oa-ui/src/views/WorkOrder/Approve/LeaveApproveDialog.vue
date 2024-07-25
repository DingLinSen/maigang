<!-- 请假申请详情/审核 -->
<script setup lang="ts">
import { ref, unref, reactive, nextTick, getCurrentInstance } from 'vue'
import { propTypes } from '@/utils/propTypes'
import { useValidator } from '@/hooks/web/useValidator'
import { FormSchema } from '@/types/form'
import { useEmitt } from '@/hooks/web/useEmitt'
import { getOrderDetailApi, auditOrderApi, archiveOrderApi } from '@/api/order'
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
  ElInput,
  ElLoading
} from 'element-plus'
import { Dialog } from '@/components/Dialog'
import { OrderStep } from '../Step'
import { FileButtonUpload } from '@/components/FileButtonUpload' // 文件上传组件
import { getAllUserListApi } from '@/api/user' // 获取所有用户

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
  filePathArray.value = []
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

const filePathArray = ref<any[]>([])
//查询详情
const getDetailsData = async () => {
  if (detailsId.value) {
    // let loadingInstance = ElLoading.service({
    //   target: '.demo-ruleForm',
    //   lock: true,
    //   text: '加载中'
    // })
    const res = await getOrderDetailApi(detailsId.value)
    // .finally(() => {
    //   loadingInstance.close()
    // })
    if (res && res.data) {
      let leave = res.data.leave
      let files = leave.files
      let notices = res.data.notices
      filePathArray.value = []
      if (files && files.length > 0) {
        files.forEach((element: any) => {
          filePathArray.value.push(element.fileUrl)
        })
      }
      let audits = res.data.audits
      nextTick()
      ruleForm.value = {
        applyType: leave.applyType ? leave.applyType : '',
        startDate: leave.startDate ? moment(leave.startDate).format('YYYY-MM-DD HH:mm:ss') : '',
        endDate: leave.endDate ? moment(leave.endDate).format('YYYY-MM-DD HH:mm:ss') : '',
        sumDate: leave.sumDate ? leave.sumDate : '',
        urgency: res.data.urgency ? String(res.data.urgency) : '',
        applyReason: leave.applyReason ? leave.applyReason : '',
        detailedReasons: leave.detailedReasons ? leave.detailedReasons : '',
        uploadFile: '',
        orderExpain: '',
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
      flowDatas.value = audits

      // 审核流程
      if (
        (res.data.leave.status == '2' || res.data.leave.status == '4') &&
        ruleForm.value.sumDate <= 14
      ) {
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
        (res.data.leave.status == '2' || res.data.leave.status == '4') &&
        ruleForm.value.sumDate > 14
      ) {
        let arr: any = []
        if (res.data.leaderName !== '张保国') {
          arr = [
            {
              roleName: res.data.leaderRoleName,
              createByName: res.data.leaderName,
              orderStep: '待审核'
            },
            {
              roleName: '董事长',
              createByName: '张保国',
              orderStep: '待审核'
            },
            {
              roleName: '人力资源部经理',
              createByName: '高敬',
              orderStep: '待归档'
            }
          ]
        } else {
          arr = [
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
        }

        flowDatas.value = [...flowDatas.value, ...arr]
      } else if (res.data.leave.status == '3') {
        let arr = [
          {
            roleName: '董事长',
            createByName: '张保国',
            orderStep: '待审核'
          },
          {
            roleName: '人力资源部经理',
            createByName: '高敬',
            orderStep: '待归档'
          }
        ]
        flowDatas.value = [...flowDatas.value, ...arr]
      } else if (res.data.leave.status == '5' || res.data.leave.status == '8') {
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
  flowDatas.value = []
  filePathArray.value = []
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
  detailedReasons: '',
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

//审核流程
const flowDatas = ref<any[]>([])

//获取所有用户
const selectedPersonArray = ref<any[]>([])
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
  <Dialog
    ref="elDialogFef"
    width="68%"
    class="cultivate-custom"
    v-model="dialogFlag"
    :title="dialogTitle"
    v-loading="loading"
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
              <el-form-item label="请假类型" prop="applyType">
                <el-select
                  placeholder="请选择请假类型"
                  style="width: 100%"
                  :clearable="true"
                  disabled
                  @change="selApplyType"
                  v-model="ruleForm.applyType"
                >
                  <el-option
                    :value="item.value"
                    :label="item.label"
                    v-for="item in leave_type"
                    :key="item.value"
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
                  disabled
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
                  disabled
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
                  disabled
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
                  disabled
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
                  <el-option value="1" label="正常" />
                  <el-option value="2" label="重要" />
                  <el-option value="3" label="紧急" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="请假事由" prop="applyReason">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 4, maxRows: 8 }"
                  maxlength="500"
                  disabled
                  v-model="ruleForm.applyReason"
                  placeholder="请输入请假事由"
                />
              </el-form-item>
            </el-col>

            <el-col :span="24" v-if="selectedPersonArray.length">
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
            <el-col :span="24">
              <el-form-item label="附件">
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
