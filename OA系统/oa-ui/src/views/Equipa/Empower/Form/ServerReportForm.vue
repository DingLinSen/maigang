<!-- 权限申报 -->
<script setup lang="ts">
import { ref, nextTick, reactive, getCurrentInstance } from 'vue'
import { propTypes } from '@/utils/propTypes'
import { Dialog } from '@/components/Dialog'
import { useValidator } from '@/hooks/web/useValidator'
import { useEmitt } from '@/hooks/web/useEmitt'
import { getAuthorizeManageDetailApi, authAuthorizeManageApi } from '@/api/empower'
import { ElMessage } from 'element-plus'
import moment from 'moment'

type Callback = (error?: string | Error | undefined) => void
const { required, notSpace } = useValidator()
const { emitter } = useEmitt()
const { proxy } = getCurrentInstance() as any
const { jdk_version } = proxy.useDict('jdk_version')
//弹窗
const elDialogFef = ref()
const detailsId = ref<string>('')
// const pageTitle = ref<string>('')
const pageFlag = ref<string>('')
// 弹窗的开启和关闭
const dialogFlag = ref<any>(false)
//授权期限
const days = ref<number>(0)
//打开drawer并初始化
const openDrawer = async (data: any, type: string) => {
  dialogFlag.value = true
  elDialogFef.value.isFullscreen = false
  pageFlag.value = type
  nextTick(() => {
    detailsId.value = data.id
    ruleForm.value.id = data.id
    days.value = Number(data.days)
    ruleForm.value.systemName = data.systemName
    if (type == 'serverAgain') {
      getDetailsData()
    }
  })
}

//查询详情
const getDetailsData = async () => {
  if (detailsId.value) {
    const res = await getAuthorizeManageDetailApi(detailsId.value)
    if (res && res.data) {
      nextTick()
      let licenseInfo =
        res.data.licenseInfos && res.data.licenseInfos.length ? res.data.licenseInfos[0] : null
      if (licenseInfo) {
        ruleForm.value.jdkVersion = licenseInfo.jdkVersion ? licenseInfo.jdkVersion : ''
        ruleForm.value.authStartTime = licenseInfo.authStartTime
          ? moment(licenseInfo.authStartTime).format('YYYY-MM-DD')
          : ''
        ruleForm.value.authEndTime = licenseInfo.authEndTime
          ? moment(licenseInfo.authEndTime).format('YYYY-MM-DD')
          : ''
        ruleForm.value.serverInfos = licenseInfo.serverInfos ? licenseInfo.serverInfos : []
      }
    }
  }
}

//关闭
const closeDialog = () => {
  dialogFlag.value = false
}

//关闭后清空
const resetFormAfterClose = () => {
  loading.value = false
  dialogFlag.value = false
  if (elDialogFef.value) {
    elDialogFef.value.isFullscreen = false
  }
  resetForm()
  editCount.value = -1
  addFormFlag.value = false
}

//表单数据
const ruleForm = ref<any>({
  id: '',
  jdkVersion: '',
  systemName: '',
  serverInfos: [],
  authStartTime: '',
  authEndTime: '',
  serverInfo: { cpu: '', motherboard: '', ip: '', mac: '' }
})
//清空表单
const resetForm = () => {
  ruleForm.value = {
    id: '',
    jdkVersion: '',
    authStartTime: '',
    authEndTime: '',
    systemName: '',
    serverInfos: [],
    serverInfo: { cpu: '', motherboard: '', ip: '', mac: '' }
  }
}
//表单验证规则
const rules = reactive({
  jdkVersion: [{ required: true, message: '请选择JDK版本', trigger: 'change' }],
  systemName: [{ required: true, message: '请选择平台名称', trigger: 'change' }],
  authStartTime: [{ required: true, message: '请选择证书有效开始日期', trigger: 'change' }],
  authEndTime: [{ required: true, message: '请选择证书有效结束日期', trigger: 'change' }],
  cpu: [
    { required: true, message: '请输入CPU（序列号）', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  motherboard: [
    { required: true, message: '请输入主板（序列号）', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  ip: [
    { required: false, message: '请输入IP地址', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  mac: [
    { required: false, message: '请输入MAC地址', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ]
})

// const addInfo = () => {
//   ruleForm.value.serverInfos.push({ cpu: '', motherboard: '', ip: '', mac: '' })
// }

//删除服务器信息
const deleteInfo = (index: number) => {
  ruleForm.value.serverInfos.splice(index, 1)
}

//确定
//表单
const formRef = ref<any>()
const loading = ref<boolean>(false)
const submit = () => {
  formRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      if (ruleForm.value.serverInfos && ruleForm.value.serverInfos.length) {
        if (addFormFlag.value) {
          if (!serverFormRef.value) return
          await serverFormRef.value?.validate(async (isValid: boolean) => {
            if (isValid) {
              ElMessage.error('请先保存服务器信息')
            }
          })
        } else {
          submitInfo()
        }
      } else {
        if (addFormFlag.value) {
          if (!serverFormRef.value) return
          await serverFormRef.value?.validate(async (isValid: boolean) => {
            if (isValid) {
              ElMessage.error('请先保存服务器信息')
            }
          })
        } else {
          ElMessage.error('请添加服务器信息')
        }
      }
    }
  })
}

const submitInfo = async () => {
  loading.value = true
  let params = {
    authId: ruleForm.value.id,
    jdkVersion: ruleForm.value.jdkVersion,
    authStartTime: moment(ruleForm.value.authStartTime).format('YYYY-MM-DD') + ' 00:00:00',
    authEndTime: moment(ruleForm.value.authEndTime).format('YYYY-MM-DD') + ' 23:59:59',
    serverInfos: ruleForm.value.serverInfos
  }
  const res = await authAuthorizeManageApi(params).finally(() => {
    setTimeout(() => {
      loading.value = false
    }, 200)
  })
  if (res) {
    ElMessage.success('授权成功')
    //通知列表刷新
    emitter.emit('authorize', 'refresh')
    closeDialog()
  }
}

const addFormFlag = ref<boolean>(false)
//添加服务器信息
const addInfo = () => {
  clearFormRow()
  editCount.value = -1
  addFormFlag.value = true
}
// 服务器信息保存
const serverFormRef = ref()
const editCount = ref<any>(-1)
const addFormSub = async () => {
  //表单验证
  if (!serverFormRef.value) return
  await serverFormRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      if (editCount.value > -1) {
        if (ruleForm.value.serverInfos.length) {
          let flag = ruleForm.value.serverInfos.some((v: any) => {
            return (
              ruleForm.value.serverInfo.cpu == v.cpu &&
              ruleForm.value.serverInfo.motherboard == v.motherboard
            )
          })

          if (
            flag &&
            ruleForm.value.serverInfos[editCount.value].cpu != ruleForm.value.serverInfo.cpu &&
            ruleForm.value.serverInfos[editCount.value].motherboard !=
              ruleForm.value.serverInfo.motherboard
          ) {
            ElMessage.error('选择服务器重复，已添加该服务器，请重新编辑！')
            return false
          }
        }
        ruleForm.value.serverInfos[editCount.value].cpu = ruleForm.value.serverInfo.cpu
        ruleForm.value.serverInfos[editCount.value].motherboard =
          ruleForm.value.serverInfo.motherboard
        ruleForm.value.serverInfos[editCount.value].ip = ruleForm.value.serverInfo.ip
        ruleForm.value.serverInfos[editCount.value].mac = ruleForm.value.serverInfo.mac
      } else {
        if (ruleForm.value.serverInfos.length) {
          let flag = ruleForm.value.serverInfos.some((v: any) => {
            return (
              ruleForm.value.serverInfo.cpu == v.cpu &&
              ruleForm.value.serverInfo.motherboard == v.motherboard
            )
          })

          if (flag) {
            ElMessage.error('选择服务器重复，已添加该服务器，请进行编辑！')
            return false
          }
        }
        ruleForm.value.serverInfos.push({
          cpu: ruleForm.value.serverInfo.cpu,
          motherboard: ruleForm.value.serverInfo.motherboard,
          ip: ruleForm.value.serverInfo.ip,
          mac: ruleForm.value.serverInfo.mac
        })
      }
      addFormFlag.value = false
      clearFormRow()
      // console.log('ruleForm.value.serverInfos==>',ruleForm.value.serverInfos)
    }
  })
}

// 清空表格表单数据
const clearFormRow = () => {
  ruleForm.value.serverInfo.cpu = ''
  ruleForm.value.serverInfo.motherboard = ''
  ruleForm.value.serverInfo.ip = ''
  ruleForm.value.serverInfo.mac = ''
}

//編輯
const serverFormEdit = (index: any) => {
  editCount.value = index
  addFormFlag.value = true
  nextTick(() => {
    ruleForm.value.serverInfo.cpu = ruleForm.value.serverInfos[index].cpu
    ruleForm.value.serverInfo.motherboard = ruleForm.value.serverInfos[index].motherboard
    ruleForm.value.serverInfo.ip = ruleForm.value.serverInfos[index].ip
    ruleForm.value.serverInfo.mac = ruleForm.value.serverInfos[index].mac
  })
}

//刪除
const serverFormDel = (index: any) => {
  ruleForm.value.serverInfos.splice(index, 1)
  addFormFlag.value = false
  editCount.value = -1
  clearFormRow()
}

//证书有效期
const startDateChange = (startDate: any) => {
  if (startDate) {
    ruleForm.value.authStartTime = moment(startDate).format('YYYY-MM-DD')
    const date = new Date(startDate)
    date.setDate(date.getDate() + days.value)
    ruleForm.value.authEndTime = moment(date).format('YYYY-MM-DD')
  } else {
    ruleForm.value.authStartTime = ''
    ruleForm.value.authEndTime = ''
  }
}

//禁用昨天以前的日期
const authDateStartLimit = (time: any) => {
  // 获取当前日期
  const currentDate = new Date()
  currentDate.setHours(0, 0, 0, 0)
  // 将时间戳转换为日期对象
  const date = new Date(time)
  return date < currentDate
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
    :maxHeight="'auto'"
    v-model="dialogFlag"
    title="授权申请"
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
      <el-row class="max-h-scroll" :style="contentHeightStyle">
        <el-col :span="12">
          <el-form-item label="平台名称" prop="systemName">
            <el-input
              v-model="ruleForm.systemName"
              placeholder="请输入平台名称"
              maxlength="500"
              disabled
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="JDK版本" prop="jdkVersion">
            <el-select
              placeholder="请选择JDK版本"
              style="width: 100%"
              :clearable="true"
              v-model="ruleForm.jdkVersion"
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
        <el-col :span="24">
          <el-form-item label="证书有效期" prop="authStartTime">
            <div class="w-full flex">
              <el-date-picker
                class="authDateClass"
                v-model="ruleForm.authStartTime"
                :clearable="true"
                placeholder="请选择证书有效开始日期"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                @change="(val) => startDateChange(val)"
                :disabled-date="authDateStartLimit"
                type="date"
              ></el-date-picker>
              <span class="mx-[10px]">至</span>
              <el-date-picker
                class="authDateClass"
                v-model="ruleForm.authEndTime"
                :clearable="true"
                placeholder="请选择证书有效结束日期"
                format="YYYY-MM-DD"
                disabled
                value-format="YYYY-MM-DD"
                type="date"
              ></el-date-picker>
            </div>
          </el-form-item>
        </el-col>

        <el-col :span="24" class="mb-14px">
          <section class="pr-2 bg-white application-addform w-full">
            <div class="flex justify-between mb-[6px] items-center w-full bg-[#EDEEF0] h-44px">
              <p class="font-2xl article-addform-title">服务器信息</p>
              <div class="text-15px text-[#00A0E9] flex items-center items-end">
                <p class="flex items-end items-center cursor-pointer mr-20px" @click="addInfo">
                  <img class="mr-7px" src="@/assets/imgs/icon/add_bar_icon.png" />
                  <span>添加</span>
                </p>
              </div>
            </div>
            <div class="w-full bg-[#F5F6F7]">
              <el-table
                v-if="ruleForm.serverInfos.length"
                class="article-addform-table"
                :data="ruleForm.serverInfos"
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
                <el-table-column label="操作" prop="action" v-if="pageFlag !== 'see'">
                  <template #default="scope">
                    <ElButton
                      class="btn-default"
                      :text="true"
                      @click="serverFormEdit(scope.$index)"
                    >
                      编辑
                    </ElButton>
                    <ElButton class="btn-default" :text="true" @click="serverFormDel(scope.$index)">
                      删除
                    </ElButton>
                  </template>
                </el-table-column>
              </el-table>
              <div class="bg-[#F5F6F7] py-20px" v-if="addFormFlag">
                <div class="bg-[#fff] py-[16px] mx-15px px-20px">
                  <el-form :model="ruleForm.serverInfo" ref="serverFormRef" :rules="rules">
                    <el-row class="pl-[12px] pt-[10px] pb-[10px]">
                      <el-col :span="12">
                        <el-form-item label="CPU（序列号）" prop="cpu">
                          <el-input
                            v-model="ruleForm.serverInfo.cpu"
                            placeholder="请输入CPU（序列号）"
                            maxlength="100"
                          />
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="主板（序列号）" prop="motherboard">
                          <el-input
                            v-model="ruleForm.serverInfo.motherboard"
                            placeholder="请输入主板（序列号）"
                            maxlength="100"
                          />
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="IP地址" prop="ip">
                          <el-input
                            v-model="ruleForm.serverInfo.ip"
                            placeholder="请输入IP地址"
                            maxlength="100"
                          />
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="MAC地址" prop="mac">
                          <el-input
                            v-model="ruleForm.serverInfo.mac"
                            placeholder="请输入MAC地址"
                            maxlength="100"
                          />
                        </el-form-item>
                      </el-col>
                      <el-col :span="24">
                        <!-- <div class="mx-15px px-20px" v-if="index != 0">
                          <div class="delete-btn-class" @click="deleteInfo()"> 点击删除 </div>
                        </div> -->
                        <!-- <div
                          v-if="index != ruleForm.serverInfos.length - 1"
                          class="line-class"
                        ></div> -->
                        <div class="bg-[#fff] py-[16px]" v-if="addFormFlag">
                          <div
                            class="mr-[12px] h-40px border-1 border-[#99D9F6] bg-[#F5FBFE] flex items-center justify-center text-[#00A0E9] cursor-pointer my-2"
                            @click="addFormSub"
                          >
                            点击保存
                          </div>
                        </div>
                      </el-col>
                    </el-row>
                  </el-form>
                </div>
              </div>
            </div>
          </section>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="footer">
        <el-button type="primary" :loading="loading" @click="submit()">确定</el-button>
        <el-button class="mr-[1.67vw]" @click="closeDialog">取消</el-button>
      </div>
    </template>
  </Dialog>
</template>

<style lang="less" scoped>
.article-addform-title {
  padding-left: 10px;
  font-size: 16px;
  font-weight: 600;
  color: #333333;
}
.line-class {
  border-top: 1px dashed #cccccc;
  margin-right: 12px;
  margin-top: 10px;
  margin-bottom: 10px;
}
.delete-btn-class {
  height: 40px;
  border: 1px dashed #ff8b8f;
  border-radius: 2px;
  display: flex;
  justify-content: center;
  cursor: pointer;
  align-items: center;
  color: #f56c6c;
  margin-bottom: 25px;
  margin-right: 14px;
}
.max-h-scroll {
  max-height: 70vh;
  overflow-y: auto;
}
</style>

<style lang="less">
.authDateClass {
  width: 240px !important;
  .el-input__wrapper {
    width: 240px !important;
  }
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

