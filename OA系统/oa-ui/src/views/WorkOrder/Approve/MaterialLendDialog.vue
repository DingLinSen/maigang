<!-- 请假申请 -->
<script setup lang="ts">
import './urgency.less'
import { ref, reactive, getCurrentInstance, unref, nextTick } from 'vue'
import { propTypes } from '@/utils/propTypes'
import { OrderStep } from '../Step'
import { useValidator } from '@/hooks/web/useValidator'
import { useEmitt } from '@/hooks/web/useEmitt'
import { getOrderDetailApi, auditOrderApi, archiveOrderApi, lendApi } from '@/api/order'
import { FileButtonUpload } from '@/components/FileButtonUpload'
import moment from 'moment'
import { useCache } from '@/hooks/web/useCache'
const { wsCache } = useCache()
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

const { emitter } = useEmitt()
const { proxy } = getCurrentInstance() as any
const { materials_type } = proxy.useDict('materials_type')
const { ht } = proxy.useDict('ht')
const { seal } = proxy.useDict('seal')
const flowDatas = ref<any[]>()
const rejectLoading = ref(false)
const passLoading = ref(false)
const lendLoading = ref(false)
const restitutionLoading = ref(false)
const dialogTitle = ref<string>('')

const materials_name_list = ref<any>([])
// 弹窗的开启和关闭
const dialogFlag = ref<Boolean>(false)
type Callback = (error?: string | Error | undefined) => void

const { required, validateEnglishAndNumber, notSpace } = useValidator()

const props = defineProps({
  title: propTypes.string.def('')
})

const pageFlag = ref<string>('add') // see 查看 edit 编辑 add 新增
//表单
const formRef = ref<any>()
//保存等待
const loading = ref(false)

const detailsId = ref<string>('')

//弹窗
const elDialogFef = ref()
//打开drawer并初始化
const openDrawer = (id: string, flag: string) => {
  dialogFlag.value = true
  pageFlag.value = flag
  elDialogFef.value.isFullscreen = false
  dialogTitle.value =
    flag === 'approve'
      ? '审核'
      : flag === 'archive'
      ? '归档'
      : flag === 'restitution'
      ? '归还'
      : flag === 'lend'
      ? '借出'
      : '详情'
  if (id) {
    detailsId.value = id
    getDetailsData()
  }
}

//查询详情
const getDetailsData = async () => {
  if (detailsId.value) {
    const res = await getOrderDetailApi(detailsId.value)
    if (res && res.data) {
      let data = res.data
      ruleForm.value.flag = data.flag
      ruleForm.value.type = data.type
      ruleForm.value.urgency = String(data.urgency)
      ruleForm.value.remark = data.workorderLend.remark

      ruleForm.value.planLendDate = data.workorderLend.planLendDate
      ruleForm.value.planBackDate = data.workorderLend.planBackDate
      if (data.workorderLend.types.length) {
        ruleForm.value.materialsType = data.workorderLend.types.map((v) => {
          return v.materialsType
        })
        materialsTypeChange(ruleForm.value.materialsType)
      }
      if (data.workorderLend.names.length) {
        ruleForm.value.materialsName = data.workorderLend.names.map((v) => {
          return v.materialsName
        })
      }

      ruleForm.value.goodUse = data.workorderLend.goodUse
      if (data.workorderLend.files.length) {
        ruleForm.value.fileUrl = data.workorderLend.files
          .map((v) => {
            return v.fileUrl
          })
          .join(',')
      }
      flowDatas.value = data.audits
      if (data.workorderLend.status == '2' || data.workorderLend.status == '4') {
        let arr = []
        if (
          data.leaderName == '赵桂婷' ||
          data.leaderName == '高敬' ||
          data.leaderName == '张保国'
        ) {
          arr = [
            {
              roleName: '董事长',
              createByName: '张保国',
              orderStep: '待审核'
            },
            {
              roleName: '行政专员',
              createByName: '张路路',
              orderStep: '待借出'
            },
            {
              roleName: '行政专员',
              createByName: '张路路',
              orderStep: '待归还'
            }
          ]
        } else {
          arr = [
            {
              roleName: data.leaderRoleName,
              createByName: data.leaderName,
              orderStep: '待审核'
            },
            {
              roleName: '董事长',
              createByName: '张保国',
              orderStep: '待审核'
            },
            {
              roleName: '行政专员',
              createByName: '张路路',
              orderStep: '待借出'
            },
            {
              roleName: '行政专员',
              createByName: '张路路',
              orderStep: '待归还'
            }
          ]
        }
        flowDatas.value = [...flowDatas.value, ...arr]
      } else if (data.workorderLend.status == '3') {
        let arr = [
          {
            roleName: '董事长',
            createByName: '张保国',
            orderStep: '待审核'
          },
          {
            roleName: '行政专员',
            createByName: '张路路',
            orderStep: '待借出'
          },
          {
            roleName: '行政专员',
            createByName: '张路路',
            orderStep: '待归还'
          }
        ]
        flowDatas.value = [...flowDatas.value, ...arr]
      } else if (data.workorderLend.status == '9') {
        let arr = [
          {
            roleName: '行政专员',
            createByName: '张路路',
            orderStep: '待借出'
          },
          {
            roleName: '行政专员',
            createByName: '张路路',
            orderStep: '待归还'
          }
        ]
        flowDatas.value = [...flowDatas.value, ...arr]
      } else if (
        data.workorderLend.status == '10' ||
        data.workorderLend.status == '5' ||
        data.workorderLend.status == '8'
      ) {
        let arr = [
          {
            roleName: '行政专员',
            createByName: '张路路',
            orderStep: '待归还'
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
    flag: '',
    type: 5,
    materialsType: '',
    planLendDate: '',
    planBackDate: '',
    materialsName: '',
    goodUse: '',
    urgency: '1',
    orderExpain: '',
    fileUrl: ''
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

//表单数据
const ruleForm = ref<any>({
  flag: '',
  type: 5,
  materialsType: '',
  planLendDate: '',
  planBackDate: '',
  materialsName: '',
  goodUse: '',
  urgency: '1',
  fileUrl: ''
})

const rules = reactive({
  goodUse: [
    { required: true, message: '请选择用途', trigger: 'change' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  planLendDate: [
    { required: true, message: '请选择计划借出日期', trigger: 'change' },
    {
      validator: (rule: any, value: string, callback: Callback) => {
        if (ruleForm.value.planBackDate) {
          if (
            new Date(ruleForm.value.planLendDate).getTime() >
            new Date(ruleForm.value.planBackDate).getTime()
          ) {
            callback(new Error('开始时间不得早于计划归还日期'))
          } else {
            callback()
          }
        }
      },
      trigger: 'change'
    }
  ],
  planBackDate: [
    { required: true, message: '请选择计划归还日期', trigger: 'change' },
    {
      validator: (rule: any, value: string, callback: Callback) => {
        if (ruleForm.value.planLendDate) {
          if (
            new Date(ruleForm.value.planLendDate).getTime() >
            new Date(ruleForm.value.planBackDate).getTime()
          ) {
            callback(new Error('结束时间不得晚于计划借出日期'))
          } else {
            callback()
          }
        }
      },
      trigger: 'change'
    }
  ],
  materialsType: [{ required: true, message: '请选择物资类型', trigger: 'change' }],
  materialsName: [{ required: true, message: '请选择物资名称', trigger: 'change' }],
  remark: [
    { required: true, message: '请输入物资外借事由', trigger: 'change' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  urgency: [{ required: true, message: '请选择紧急程度', trigger: 'change' }],
  files: [{ required: true, message: '请上传文件', trigger: 'blur' }],
  orderExpain: [
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ]
})

const materialsTypeChange = (value) => {
  nextTick(() => {
    let list: any = []
    value.forEach((item, index) => {
      if (item == 'ht') {
        ht.value.forEach((element) => {
          list.push(element)
        })
      }
      if (item == 'seal') {
        seal.value.forEach((element) => {
          list.push(element)
        })
      }
      // list = [...proxy.useDict(item)[item].value, ...list]
    })
    console.log('materialsTypeChange==>', list)
    // materials_name_list.value = proxy.useDict(value)[value].value
    materials_name_list.value = list
  })
}

// 审核保存
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
        restitutionLoading.value = false
      }, 200)
    })
  if (res) {
    if (flag === '已驳回') {
      ElMessage.success('驳回成功')
    } else if (flag === '已归还') {
      ElMessage.success('归还成功')
    } else {
      ElMessage.success('保存信息成功')
    }
    //通知列表刷新
    emitter.emit('order', 'refresh')
    closeDialog()
  }
}

//归还
const restitution = async (data: any, flag: string) => {
  if (!formRef.value) return
  await formRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      restitutionLoading.value = true
      let data = ruleForm.value
      archiveOrder(data, '已归还')
    }
  })
}
//借出
const lend = async (data: any, flag: string) => {
  let params = {
    id: detailsId.value
  }
  lendLoading.value = true
  const res = await lendApi(params)
    .catch(() => {})
    .finally(() => {
      setTimeout(() => {
        lendLoading.value = false
      }, 200)
    })
  if (res) {
    ElMessage.success('借出成功')
    //通知列表刷新
    emitter.emit('order', 'refresh')
    closeDialog()
  }
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
      <div class="flex items-start justify-start">
        <el-row class="w-[60%]">
          <el-col :span="24">
            <el-form-item label="用途" prop="goodUse">
              <el-select
                :disabled="true"
                filterable
                v-model="ruleForm.goodUse"
                class="w-full"
                placeholder="请选择用途"
              >
                <el-option value="外借" label="外借" />
                <el-option value="借阅复印" label="借阅复印" />
                <el-option value="其他" label="其他" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计划借出日期" prop="planLendDate">
              <el-date-picker
                type="date"
                :disabled="true"
                value-format="YYYY-MM-DD"
                format="YYYY-MM-DD"
                placeholder="请选择借出日期"
                class="date-picker"
                v-model="ruleForm.planLendDate"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计划归还日期" prop="planBackDate">
              <el-date-picker
                type="date"
                :disabled="true"
                value-format="YYYY-MM-DD"
                format="YYYY-MM-DD"
                placeholder="请选择归还日期"
                class="date-picker"
                v-model="ruleForm.planBackDate"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="物资类型" prop="materialsType">
              <el-select
                multiple
                :max-collapse-tags="3"
                :disabled="true"
                v-model="ruleForm.materialsType"
                @change="materialsTypeChange"
                class="w-full"
                placeholder="请选择物资名称"
              >
                <el-option
                  v-for="item in materials_type"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="物资名称" prop="materialsName">
              <el-select
                :disabled="true"
                multiple
                collapse-tags
                collapse-tags-tooltip
                :max-collapse-tags="3"
                v-model="ruleForm.materialsName"
                class="w-full"
                placeholder="请选择物资名称"
              >
                <el-option
                  v-for="item in materials_name_list"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="物资外借事由" prop="remark">
              <el-input
                :disabled="true"
                type="textarea"
                :rows="4"
                maxlength="500"
                v-model="ruleForm.remark"
                placeholder="请输入物资外借事由"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="紧急程度" prop="urgency">
              <el-select
                :disabled="true"
                v-model="ruleForm.urgency"
                style="width: 100%"
                placeholder="请选择紧急程度"
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
            <el-form-item label="附件" prop="fileUrl">
              <FileButtonUpload
                v-model:modelValue="ruleForm.fileUrl"
                :disabled="true"
                :limit="10"
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
            </el-form-item>
          </el-col>
          <el-col v-if="pageFlag === 'approve' || pageFlag === 'archive'">
            <el-form-item label="" prop="orderExpain">
              <span>审核意见（驳回必填<span class="text-red-500"> *</span>）</span>
              <el-input
                type="textarea"
                :rows="4"
                maxlength="200"
                v-model="ruleForm.orderExpain"
                placeholder="请输入审核意见"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <div class="w-[39%] pl-30px pr-10px">
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
          :disabled="passLoading"
          @click="pass"
          v-if="pageFlag === 'approve' || pageFlag === 'archive'"
        >
          通过
        </el-button>

        <el-button
          class="dialog-btn-sure"
          :loading="lendLoading"
          :disabled="lendLoading"
          @click="lend"
          v-if="pageFlag === 'lend'"
        >
          借出
        </el-button>

        <el-button
          class="dialog-btn-sure"
          :loading="restitutionLoading"
          :disabled="restitutionLoading"
          @click="restitution"
          v-if="pageFlag === 'restitution'"
        >
          归还
        </el-button>

        <el-button
          class="dialog-btn-reject"
          :loading="rejectLoading"
          :disabled="rejectLoading"
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
