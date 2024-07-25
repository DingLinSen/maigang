<!-- 权限申报 -->
<script setup lang="ts">
import { ref, unref, reactive, nextTick, getCurrentInstance, onMounted, computed } from 'vue'
import { propTypes } from '@/utils/propTypes'
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
import { useValidator } from '@/hooks/web/useValidator'
import { getAllUserListApi } from '@/api/user'
import { downloadFile } from '@/utils/index'
import { OrderStep } from './index'
import {
  getAuthorizeManageDetailApi,
  auditAuthorizeManageApi,
  downloadAuthorizeApi
} from '@/api/empower'

type Callback = (error?: string | Error | undefined) => void

const { required, notSpace } = useValidator()
const { proxy } = getCurrentInstance() as any
const { jdk_version } = proxy.useDict('jdk_version')
const { emitter } = useEmitt()
// 弹窗的开启和关闭
const dialogFlag = ref<any>(false)

const props = defineProps({
  title: propTypes.string.def('')
})

const dialogTitle = ref<string>('')
//平台名称集合
const platformArray = ref<any>([{ value: '1', label: '测试' }])
//弹窗
const elDialogFef = ref()
//打开drawer并初始化
const detailsId = ref<string>('')
const pageFlag = ref<string>('') // see 查看 edit 编辑 add 新增

const openDrawer = async (id: string, flag: string) => {
  dialogFlag.value = true
  elDialogFef.value.isFullscreen = false
  nextTick(() => {
    detailsId.value = id
    pageFlag.value = flag
    getDetailsData()
  })
}

//查询详情
const getDetailsData = async () => {
  if (detailsId.value) {
    const res = await getAuthorizeManageDetailApi(detailsId.value)
    if (res && res.data) {
      let audits = res.data.audits
      nextTick()
      ruleForm.value = {
        punter: res.data.punter ? res.data.punter : '',
        type: res.data.type ? res.data.type : '',
        systemName: res.data.systemName ? res.data.systemName : '',
        authStartTime: res.data.authStartTime
          ? moment(res.data.authStartTime).format('YYYY-MM-DD')
          : '',
        authEndTime: res.data.authEndTime ? moment(res.data.authEndTime).format('YYYY-MM-DD') : '',
        applyReason: res.data.applyReason ? res.data.applyReason : '',
        jdkVersion: res.data.jdkVersion ? res.data.jdkVersion : '',
        licenseInfos: res.data.licenseInfos ? res.data.licenseInfos : '',
        fileUrl: res.data.fileUrl ? res.data.fileUrl : '',
        days: res.data.days ? res.data.days : ''
      }
      if (ruleForm.value.licenseInfos.length) {
        ruleForm.value.licenseInfos.forEach((element: any) => {
          if (element.authStartTime && element.authEndTime) {
            element.startEndDate = [element.authStartTime, element.authEndTime]
          } else {
            element.startEndDate = []
          }
        })
      }

      if (res.data.users) {
        selectedPersonArray.value = []
        res.data.users.forEach((item: any) => {
          userData.value.forEach((user: any) => {
            if (item.userId === user.userId) {
              selectedPersonArray.value.push(user)
            }
          })
        })
      }
      flowDatas.value = audits
      // 状态 1未发布 2待审核 3部门经理已审核 4研发负责人已审核 5总经理已审核 6已驳回
      if (res.data.status == '2') {
        let arr: any = []
        if (res.data.leaderName != '张保国') {
          //不是部门经理申请的
          arr = [
            {
              postName: res.data.leaderPost,
              createByName: res.data.leaderName,
              orderStep: '待审核'
            }
          ]
          if (res.data.leaderPost != '技术部总监') {
            //不是研发部申请的
            arr.push({
              postName: '技术部总监',
              createByName: '尹思杰',
              orderStep: '待审核'
            })
          }

          arr.push({
            postName: '董事长',
            createByName: '张保国',
            orderStep: '待审核'
          })
        } else {
          if (res.data.createByName == '尹思杰') {
            //尹总申请的
            arr = [
              {
                postName: res.data.leaderPost,
                createByName: res.data.leaderName,
                orderStep: '待审核'
              }
            ]
          } else {
            //不是尹总申请的
            arr = [
              {
                postName: '技术部总监',
                createByName: '尹思杰',
                orderStep: '待审核'
              },
              {
                postName: res.data.leaderPost,
                createByName: res.data.leaderName,
                orderStep: '待审核'
              }
            ]
          }
        }
        flowDatas.value = [...flowDatas.value, ...arr]
      } else if (res.data.status == '3') {
        let arr: any = []
        if (res.data.leaderPost != '技术部总监') {
          //不是研发部申请的
          arr = [
            {
              postName: '技术部总监',
              createByName: '尹思杰',
              orderStep: '待审核'
            }
          ]
        }
        if (res.data.leaderName != '张保国') {
          //研发部申请的
          arr.push({
            postName: '董事长',
            createByName: '张保国',
            orderStep: '待审核'
          })
        }
        flowDatas.value = [...flowDatas.value, ...arr]
      } else if (res.data.status == '4') {
        let arr = [
          {
            postName: '董事长',
            createByName: '张保国',
            orderStep: '待审核'
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
    id: '',
    punter: '',
    applyReason: '',
    type: '',
    systemName: '',
    startEndDate: [],
    authStartTime: '',
    authEndTime: '',
    urgency: '1',
    userIds: '',
    orderExpain: '',
    jdkVersion: '',
    fileUrl: '',
    days: '',
    licenseInfos: []
  }
  selectedPersonArray.value = []
  flowDatas.value = []
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

//表单数据
const ruleForm = ref<any>({
  id: '',
  punter: '',
  applyReason: '',
  type: '',
  systemName: '',
  startEndDate: [],
  authStartTime: '',
  authEndTime: '',
  urgency: '1',
  userIds: '',
  orderExpain: '',
  jdkVersion: '',
  fileUrl: '',
  days: '',
  licenseInfos: []
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

//人员选择
const selectedPersonArray = ref<any>([])

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
//表单
const formRef = ref<any>()

onMounted(() => {
  getAllUserlist()
})

//审核流程
const flowDatas = ref<any[]>([])

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
      approveApply(data, '已通过')
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

const approveApply = async (data: any, flag: string) => {
  let params = {
    orderExpain: data.orderExpain,
    authId: detailsId.value,
    orderStep: flag
  }
  const res = await auditAuthorizeManageApi(params)
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
    emitter.emit('authorize', 'refresh')
    closeDialog()
  }
}

// 下载文件
const downloadFileAction = async (licenseInfo: any, index: number) => {
  if (index == 0) {
    await downloadAuthorizeApi(licenseInfo.fileUrl, ruleForm.value.systemName)
  }
}

const contentHeightStyle = ref<any>({
  maxHeight: '70vh'
})

//全屏
const toggleFull = (isFullscreen: boolean) => {
  if (isFullscreen) {
    contentHeightStyle.value = {
      maxHeight: '100%'
    }
  } else {
    contentHeightStyle.value = {
      maxHeight: '70vh'
    }
  }
}

defineExpose({
  openDrawer
})
</script>
<template>
  <Dialog
    ref="elDialogFef"
    class="cultivate-custom"
    width="68%"
    :maxHeight="'80%'"
    v-model="dialogFlag"
    :title="title"
    @toggleFull="toggleFull"
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
      <div class="flex w-full max-h-scroll" :style="contentHeightStyle">
        <div class="left-form-class">
          <el-row>
            <el-col :span="12">
              <el-form-item label="客户名称" prop="punter">
                <el-input
                  v-model="ruleForm.punter"
                  disabled
                  placeholder="请输入客户名称"
                  maxlength="200"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="平台类型" prop="type">
                <el-select
                  placeholder="请选择平台类型"
                  style="width: 100%"
                  :clearable="true"
                  disabled
                  v-model="ruleForm.type"
                >
                  <el-option value="agriculture_projects" label="农业" />
                  <el-option value="railway_projects" label="铁路" />
                  <el-option value="military_projects" label="军工" />
                  <el-option value="other_projects" label="其他" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="平台名称" prop="systemName">
                <el-input
                  maxlength="500"
                  disabled
                  v-model="ruleForm.systemName"
                  placeholder="请选择平台名称"
                />
                <!-- <el-select
                  placeholder="请选择平台名称"
                  style="width: 100%"
                  :clearable="true"
                  disabled
                  v-model="ruleForm.platform"
                >
                  <el-option
                    :value="item.value"
                    :label="item.label"
                    v-for="item in platformArray"
                    :key="item.value"
                  />
                </el-select> -->
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="授权期限" prop="startEndDate">
                <el-input v-model="ruleForm.days" disabled placeholder="请输入授权期限">
                  <template #append>天</template></el-input
                >
              </el-form-item>
            </el-col>

            <!-- <el-col :span="12">
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
                  <el-option value="1" class="urgencyClass urgency-low" label="正常" />
                  <el-option value="2" class="urgencyClass urgency-middle" label="重要" />
                  <el-option value="3" class="urgencyClass urgency-high" label="紧急" />
                </el-select>
              </el-form-item>
            </el-col> -->
            <el-col :span="24">
              <el-form-item label="申请理由" prop="applyReason">
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

            <el-col :span="24">
              <el-form-item label="实施人员" prop="userIds">
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
          </el-row>

          <el-row v-if="pageFlag === 'approve'">
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
          <div v-for="(licenseInfo, index) in ruleForm.licenseInfos" :key="index" class="mb-[20px]">
            <el-row v-if="licenseInfo.jdkVersion">
              <el-col :span="12">
                <el-form-item label="JDK版本" prop="jdkVersion">
                  <el-select
                    placeholder="请选择JDK版本"
                    style="width: 100%"
                    :clearable="true"
                    disabled
                    v-model="licenseInfo.jdkVersion"
                  >
                    <el-option
                      :value="item.value"
                      :label="item.label"
                      v-for="item in jdk_version"
                      :key="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="licenseInfo.startEndDate.length">
                <el-form-item label="证书有效期" prop="startEndDate">
                  <el-date-picker
                    v-model="licenseInfo.startEndDate"
                    :clearable="true"
                    placeholder="请选择授权期限"
                    format="YYYY-MM-DD"
                    disabled
                    value-format="YYYY-MM-DD"
                    range-separator="-"
                    start-placeholder="请选择开始日期"
                    end-placeholder="请选择结束日期"
                    type="daterange"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="24" class="mb-14px">
                <section class="pr-2 bg-white application-addform w-full">
                  <div
                    class="flex justify-between mb-[6px] items-center w-full bg-[#EDEEF0] h-44px"
                  >
                    <p class="font-2xl article-addform-title">服务器信息</p>
                  </div>
                  <div class="w-full bg-[#F5F6F7]">
                    <el-table
                      v-if="licenseInfo.serverInfos.length"
                      :data="licenseInfo.serverInfos"
                      class="article-addform-table"
                      maxHeight="190"
                    >
                      <el-table-column prop="cpu" label="CPU（序列号）">
                        <template #default="scope">
                          <span>{{ scope.row.cpu ? scope.row.cpu : '--' }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column prop="motherboard" label="主板（序列号）">
                        <template #default="scope">
                          <span>{{ scope.row.motherboard ? scope.row.motherboard : '--' }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column prop="ip" label="IP地址"
                        ><template #default="scope">
                          <span>{{ scope.row.ip ? scope.row.ip : '--' }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column prop="mac" label="MAC地址"
                        ><template #default="scope">
                          <span>{{ scope.row.mac ? scope.row.mac : '--' }}</span>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </section>
              </el-col>
            </el-row>

            <el-row v-if="licenseInfo.fileUrl">
              <el-col :span="24" class="mb-14px">
                <section class="pr-2 bg-white application-addform w-full">
                  <!-- <div
                    class="flex justify-between mb-[6px] items-center w-full bg-[#EDEEF0] h-44px"
                  >
                    <p class="font-2xl article-addform-title">授权文件</p>
                  </div> -->
                  <div class="file-wrap">
                    <span class="file-name-class" @click="downloadFileAction(licenseInfo, index)">
                      授权文件 {{ licenseInfo.createTime ? licenseInfo.createTime : '' }}
                    </span>
                    <div class="action-wrap" v-if="index == 0">
                      <img
                        src="@/assets/imgs/home/xz_icon.png"
                        style="padding: 10px 0px; margin-left: 12px; cursor: pointer"
                        @click="downloadFileAction(licenseInfo, index)"
                      />
                    </div>
                  </div>
                </section>
              </el-col>
            </el-row>
          </div>
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
          v-if="pageFlag === 'approve'"
        >
          通过
        </el-button>

        <el-button
          class="dialog-btn-reject"
          :loading="rejectLoading"
          :disabled="passLoading"
          @click="reject"
          v-if="pageFlag === 'approve'"
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

.right-form-class {
  width: 39%;
  padding-left: 30px;
  padding-right: 10px;
  // overflow-y: auto;
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
.article-addform-title {
  padding-left: 10px;
  font-size: 16px;
  font-weight: 600;
  color: #333333;
}
.line-class {
  border-top: 1px dashed #cccccc;
  margin-right: 12px;
  margin-left: 12px;
  margin-top: 10px;
  margin-bottom: 10px;
}
.max-h-scroll {
  max-height: 70vh;
  overflow-y: auto;
}
.file-wrap {
  display: flex;
  justify-content: space-between;
  min-height: 36px;
  background: #f9f9f9;
  border: 1px solid #e2e2e2;
  border-radius: 2px;
  padding-left: 12px;
  padding-right: 12px;
  margin-top: 10px;
  align-items: center;
  color: inherit;
}
.file-name-class {
  margin: 6px 0px;
  font-size: 14px;
  color: #444444;
  cursor: pointer;
  max-width: 85%;
}
.file-name-class:hover {
  color: #00a0e9;
}
.action-wrap {
  display: inline-flex;
  margin-right: 5px;
}
</style>
<style lang="less">
.person-popper-class {
  margin-top: -14px !important;
  padding: 0px 4px;
}
.article-addform-table {
  width: 100%;
  font-size: 14px;
  color: #666666;
  .el-table__cell {
    padding: 0;
  }
  tr {
    padding: 0 15px !important;
  }
  thead th {
    height: 40px;
    background: #edeef0 !important;
    border-radius: 2px;
    text-align: center !important;
  }
  tbody td {
    background: #f5f6f7 !important;
    height: 50px !important;
    text-align: center !important;
  }
}
</style>

