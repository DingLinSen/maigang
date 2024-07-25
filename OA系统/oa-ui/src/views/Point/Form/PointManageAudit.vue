<!-- 积分管理详情/审核 -->
<script setup lang="ts">
import { ref, unref, reactive, nextTick, getCurrentInstance } from 'vue'
import { propTypes } from '@/utils/propTypes'
import { useValidator } from '@/hooks/web/useValidator'
import { FormSchema } from '@/types/form'
import { useEmitt } from '@/hooks/web/useEmitt'
import moment from 'moment'
import {
  ElMessage,
  ElForm,
  ElFormItem,
  ElRow,
  ElCol,
  ElSelect,
  ElOption,
  ElInput
} from 'element-plus'
import { Dialog } from '@/components/Dialog'
import { PointStep } from '../Step'
import { getAllUserListApi } from '@/api/user' // 获取所有用户
import { getAllDeptListApi } from '@/api/sys/dept'
import { getPointManageDetailApi, auditPointManageApi } from '@/api/point'

const { proxy } = getCurrentInstance() as any
const { human_resources_type } = proxy.useDict('human_resources_type')
const { department_type } = proxy.useDict('department_type')
const { general_type } = proxy.useDict('general_type')
const { emitter } = useEmitt()
// 弹窗的开启和关闭
const dialogFlag = ref<any>(false)
type Callback = (error?: string | Error | undefined) => void

const { required, validateEnglishAndNumber, notSpace } = useValidator()

const props = defineProps({
  title: propTypes.string.def('')
})

const pointTypeArray = ref<any>([])

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
      if (pageFlag.value === 'audit') {
        approveApply(data, '已通过')
      } else if (pageFlag.value === 'archive') {
        approveApply(data, '已归档')
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
      approveApply(data, '已驳回')
    }
  })
}
//请假申请
const approveApply = async (data: any, flag: string) => {
  let params = {
    explain: data.orderExpain,
    applyId: detailsId.value,
    step: flag
  }
  const res = await auditPointManageApi(params)
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
    emitter.emit('pointManage', 'refresh')
    closeDialog()
  }
}

//弹窗
const elDialogFef = ref()
//打开drawer并初始化
const detailsId = ref<string>('')
const pageFlag = ref<string>('') // see 查看 edit 编辑 add 新增

const openDrawer = async (id: string, flag: string) => {
  selectedPersonArray.value = []
  dialogFlag.value = true
  elDialogFef.value.isFullscreen = false
  if (!userData.value.length) {
    await getAllUserlist()
  }
  pointTypeArray.value = human_resources_type.value
    .concat(department_type.value)
    .concat(general_type.value)
  nextTick(() => {
    detailsId.value = id
    pageFlag.value = flag
    dialogTitle.value = flag === 'audit' ? '审核' : flag === 'archive' ? '归档' : '详情'
    getDetailsData()
  })
}

//查询详情
const getDetailsData = async () => {
  if (detailsId.value) {
    const res = await getPointManageDetailApi(detailsId.value)
    if (res && res.data) {
      let audits = res.data.audits
      let users = res.data.users
      nextTick()
      ruleForm.value = {
        type: res.data.type ? res.data.type : '',
        bonusPenalty: res.data.bonusPenalty ? res.data.bonusPenalty : '',
        fraction: res.data.fraction ? res.data.fraction : '',
        applyReason: res.data.applyReason ? res.data.applyReason : ''
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
      flowDatas.value = audits
      // 审核流程
      //部门经理发起的
      if (res.data.flag == '2') {
        //待审核
        if (res.data.status == '1') {
          let arr = [
            {
              roleName: '人力资源部经理',
              createByName: '高敬',
              step: '待审核'
            },
            {
              roleName: '总经理',
              createByName: '张保国',
              step: '待审核'
            },
            {
              roleName: '人力资源部经理',
              createByName: '高敬',
              step: '待归档'
            }
          ]
          flowDatas.value = [...flowDatas.value, ...arr]
        } else if (res.data.status == '2') {
          let arr = [
            {
              roleName: '总经理',
              createByName: '张保国',
              step: '待审核'
            },
            {
              roleName: '人力资源部经理',
              createByName: '高敬',
              step: '待归档'
            }
          ]
          flowDatas.value = [...flowDatas.value, ...arr]
        } else if (res.data.status == '4') {
          let arr = [
            {
              roleName: '人力资源部经理',
              createByName: '高敬',
              step: '待归档'
            }
          ]
          flowDatas.value = [...flowDatas.value, ...arr]
        }
      } else if (res.data.flag == '1') {
        //人力发起的
        if (res.data.status == '1') {
          let arr = [
            {
              roleName: res.data.leaderPost,
              createByName: res.data.leaderName,
              step: '待审核'
            },
            {
              roleName: '人力资源部经理',
              createByName: '高敬',
              step: '待归档'
            }
          ]
          flowDatas.value = [...flowDatas.value, ...arr]
        } else if (res.data.status == '4') {
          let arr = [
            {
              roleName: '人力资源部经理',
              createByName: '高敬',
              step: '待归档'
            }
          ]
          flowDatas.value = [...flowDatas.value, ...arr]
        }
      } else if (res.data.flag == '3') {
        //综合部或者高经理发起的
        if (res.data.status == '1') {
          let arr: any = []
          if (res.data.leaderName !== '高敬') {
            arr.push({
              roleName: '人力资源部经理',
              createByName: '高敬',
              step: '待审核'
            })
          } else {
            arr.push({
              roleName: res.data.leaderPost,
              createByName: res.data.leaderName,
              step: '待审核'
            })
          }
          arr.push({
            roleName: '人力资源部经理',
            createByName: '高敬',
            step: '待归档'
          })
          flowDatas.value = [...flowDatas.value, ...arr]
        } else if (res.data.status == '4') {
          let arr = [
            {
              roleName: '人力资源部经理',
              createByName: '高敬',
              step: '待归档'
            }
          ]
          flowDatas.value = [...flowDatas.value, ...arr]
        }
      }
    }
  }
}

//清空表单
const resetForm = () => {
  ruleForm.value = {
    type: '',
    bonusPenalty: '',
    fraction: '',
    userIds: '',
    applyReason: '',
    orderExpain: ''
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
  selectedPersonArray.value = []
  flowDatas.value = []
  resetForm()
}

//表单数据
const ruleForm = ref<any>({
  type: '',
  bonusPenalty: '',
  fraction: '',
  userIds: '',
  applyReason: '',
  orderExpain: ''
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

const selectedPersonArray = ref<any[]>([])
const userData = ref<any>([])

//获取所有人员
const getAllUserlist = async () => {
  try {
    const { data } = await getAllUserListApi({})
    userData.value = data
  } catch (error) {}
}

getAllUserlist()

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
//人员的默认头像
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
    :maxHeight="'auto'"
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
              <el-form-item label="奖惩项目">
                <el-select
                  placeholder="请选择奖惩项目"
                  style="width: 100%"
                  :clearable="true"
                  disabled
                  v-model="ruleForm.bonusPenalty"
                >
                  <el-option
                    :value="item.value"
                    :label="item.label"
                    v-for="item in pointTypeArray"
                    :key="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="类型">
                <el-select
                  placeholder="请选择类型"
                  style="width: 100%"
                  :clearable="true"
                  disabled
                  v-model="ruleForm.type"
                >
                  <el-option value="1" label="奖分" />
                  <el-option value="2" label="扣分" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="积分">
                <el-input
                  placeholder="请输入积分"
                  maxlength="5"
                  v-model="ruleForm.fraction"
                  disabled
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="添加成员">
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
            <el-col :span="24">
              <el-form-item label="申请理由">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 4, maxRows: 8 }"
                  maxlength="500"
                  disabled
                  v-model="ruleForm.applyReason"
                  placeholder="请输入申请理由"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="pageFlag === 'audit' || pageFlag === 'archive'">
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
          <PointStep :flowDatas="flowDatas" />
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
          v-if="pageFlag === 'audit' || pageFlag === 'archive'"
        >
          通过
        </el-button>

        <el-button
          class="dialog-btn-reject"
          :loading="rejectLoading"
          :disabled="passLoading"
          @click="reject"
          v-if="pageFlag === 'audit' || pageFlag === 'archive'"
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
