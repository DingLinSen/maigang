<!--售后计划书-->
<script setup lang="ts">
import { reactive, unref, ref } from 'vue'
import { ElButton, ElMessage, ElForm, ElFormItem, ElDatePicker } from 'element-plus'
import moment from 'moment'
import { useValidator } from '@/hooks/web/useValidator'
import { pollingDateType } from '../../config/config'

const props = defineProps({
  detailsData: {
    type: Object,
    default: {}
  }
})

const { required, notSpace } = useValidator()
// callback 类型
type Callback = (error?: string | Error | undefined) => void
const emit = defineEmits(['update:confirmData', 'closeDialogClick'])
// 获取验收日期
const getAcceptDate = () => {
  let acceptDate = ''
  if (
    props.detailsData &&
    props.detailsData.pmProgressList &&
    props.detailsData.pmProgressList.length > 0
  ) {
    props.detailsData.pmProgressList.forEach((item: any) => {
      if (item.type === '5') {
        acceptDate = item.acceptDate
      }
    })
  }
  return acceptDate
}

const ruleForm = ref<any>({
  pid: props.detailsData.pid, // 项目名称
  itemNumber: props.detailsData.itemNumber,
  projectTitle: props.detailsData.projectTitle, // 项目名称
  ownerName: props.detailsData.directCustomerName
    ? props.detailsData.directCustomerName
    : props.detailsData.lastUserUnit, // 	最终用户名称
  contractMoney: props.detailsData.contractMoney, // 	合同金额
  acceptDate: getAcceptDate(), // 验收日期
  paymentDate: moment(new Date()).format('YYYY-MM-DD'), // 回款日期
  paymentMoney: '', //回款金额
  finalDate: '', //尾款时间
  finalMoney: '', //尾款金额
  paymentRate: '', //已回款比例
  afterSaleDate: '', //售后期限
  afterSaleDeadline: '', //售后截止日期
  pollingDate: '', //巡检开始时间
  pollingDateType: '', //巡检时间 1 每周 2  每月 3  每季度 4 每年
  afterSaleRequire: '', //售后服务要求
  afterSalePurpose: '', //售后服务目的
  afterSalePlan: '', //售后服务计划
  afterSaleType: '1' //售后服务类型 1本部门 2 研发中心
})

const formRef = ref<any>()
const sureLoading = ref<boolean>(false)

const rules = reactive({
  projectTitle: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
  ownerName: [
    { required: true, message: '请输入最终用户名称', trigger: 'blur' },
    {
      min: 0,
      max: 200,
      message: '长度在0到200字符以内',
      trigger: 'blur'
    }
  ],
  acceptDate: [{ required: true, message: '该项为必填项', trigger: 'change' }],
  paymentDate: [{ required: true, message: '该项为必填项', trigger: 'change' }],
  finalDate: [{ required: true, message: '请选择尾款时间', trigger: 'change' }],
  afterSaleDeadline: [{ required: true, message: '请选择售后截止日期', trigger: 'change' }],
  pollingDate: [{ required: true, message: '请选择巡检开始时间', trigger: 'change' }],
  pollingDateType: [{ required: true, message: '请选择巡检周期', trigger: 'change' }],
  afterSaleType: [{ required: true, message: '请选择售后服务部门', trigger: 'change' }],
  afterSaleDate: [
    { required: true, message: '请输入售后期限', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  afterSaleRequire: [
    { required: true, message: '请输入售后服务要求', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  afterSalePlan: [
    { required: false, message: '请输入售后服务计划', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  afterSalePurpose: [
    { required: false, message: '请输入售后服务目的', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  contractNumber: [
    { required: true, message: '请输入项目编号', trigger: 'blur' },
    {
      min: 0,
      max: 200,
      message: '长度在0到200字符以内',
      trigger: 'blur'
    }
  ],
  paymentMoney: [
    { required: true, message: '请输入回款金额（万元）', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) => {
        if (/(^[1-9]{1}\d{0,4}$)|(^[0-9]{1}\d{0,4}[.]{1}[0-9]{1,6}$)/.test(value)) {
          if (Number.parseFloat(value) > Number.parseFloat(props.detailsData.contractMoney)) {
            callback(new Error('回款金额不能大于合同金额'))
          } else {
            callback()
          }
        } else {
          callback(new Error('请输入大于0小于100000之间的数字，小数点后最多六位'))
        }
      },
      trigger: 'blur'
    }
  ]
})

// 项目进展
const submitEvolve = async () => {
  if (!formRef.value) return
  await formRef.value?.validate(async (valid: any, fields: any) => {
    if (valid) {
      sureLoading.value = true
      ruleForm.value.paymentDate = moment(ruleForm.value.paymentDate).format('YYYY-MM-DD')
      ruleForm.value.finalDate = moment(ruleForm.value.finalDate).format('YYYY-MM-DD')
      ruleForm.value.afterSaleDeadline = moment(ruleForm.value.afterSaleDeadline).format(
        'YYYY-MM-DD'
      )
      ruleForm.value.pollingDate = moment(ruleForm.value.pollingDate).format('YYYY-MM-DD')
      ruleForm.value.acceptDate = moment(ruleForm.value.acceptDate).format('YYYY-MM-DD')
      emit('update:confirmData', ruleForm.value)
      closeDialog()
    }
  })
}
// 关闭弹窗
const closeDialog = () => {
  emit('closeDialogClick')
}

const paymentMoneyChange = (num: any) => {
  if (num) {
    if (/(^[1-9]{1}\d{0,4}$)|(^[0-9]{1}\d{0,4}[.]{1}[0-9]{1,6}$)/.test(num)) {
      if (Number.parseFloat(num) > Number.parseFloat(props.detailsData.contractMoney)) {
        return
      }
      let contractMoney = Number.parseFloat(props.detailsData.contractMoney)
      let paymentMoney = Number.parseFloat(num)
      ruleForm.value.finalMoney = parseFloat(floatSub(contractMoney, paymentMoney))
      let rate = (paymentMoney / contractMoney) * 100
      ruleForm.value.paymentRate = Math.round(rate)
    }
  } else {
    ruleForm.value.finalMoney = ''
    ruleForm.value.paymentRate = ''
  }
}

//浮点数减法运算
const floatSub = (arg1: any, arg2: any) => {
  let r1: number, r2: number, m: number, n: number
  try {
    r1 = arg1.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  m = Math.pow(10, Math.max(r1, r2))
  //动态控制精度长度
  n = Math.max(r1, r2)
  return ((arg1 * m - arg2 * m) / m).toFixed(n)
}

const restFromValue = (formData: any) => {
  if (formData) {
    ruleForm.value.pid = formData.pid // 项目名称
    ruleForm.value.itemNumber = formData.itemNumber
    ruleForm.value.projectTitle = props.detailsData.projectTitle // 项目名称
    ruleForm.value.ownerName = formData.ownerName // 	最终用户名称
    ruleForm.value.contractMoney = formData.contractMoney // 	合同金额
    ruleForm.value.acceptDate = formData.acceptDate // 验收日期
    ruleForm.value.paymentDate = formData.paymentDate // 回款日期
    ruleForm.value.paymentMoney = formData.paymentMoney //回款金额
    ruleForm.value.finalDate = formData.finalDate //尾款时间
    ruleForm.value.finalMoney = formData.finalMoney //尾款金额
    ruleForm.value.paymentRate = formData.paymentRate //已回款比例
    ruleForm.value.afterSaleDate = formData.afterSaleDate //售后期限
    ruleForm.value.afterSaleDeadline = formData.afterSaleDeadline //售后截止日期
    ruleForm.value.pollingDate = formData.pollingDate //巡检开始时间
    ruleForm.value.pollingDateType = formData.pollingDateType //巡检时间 1 每周 2  每月 3  每季度 4 每年
    ruleForm.value.afterSaleRequire = formData.afterSaleRequire //售后服务要求
    ruleForm.value.afterSalePurpose = formData.afterSalePurpose //售后服务目的
    ruleForm.value.afterSalePlan = formData.afterSalePlan //售后服务计划
    ruleForm.value.afterSaleType = formData.afterSaleType //售后服务类型 1本部门 2 研发中心
  }
}

defineExpose({ restFromValue })
</script>

<template>
  <section class="w-4/5 overflow-x-hidden" style="max-height: 60vh; width: 100%">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="formRef"
      label-width="150px"
      class="demo-ruleForm"
    >
      <el-row>
        <el-col :span="12" class="padding-right">
          <el-form-item label="项目名称" prop="projectTitle" class="w-full">
            <el-Input disabled placeholder="请输入" v-model="ruleForm.projectTitle" />
          </el-form-item>
        </el-col>
        <el-col :span="12" class="padding-right">
          <el-form-item label="用户名称" prop="ownerName" class="w-full">
            <el-Input placeholder="请输入" v-model="ruleForm.ownerName" disabled />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12" class="padding-right">
          <el-form-item label="验收日期" prop="acceptDate" class="w-full">
            <div class="el-p">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                disabled
                style="width: 100%"
                v-model="ruleForm.acceptDate"
              />
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="padding-right">
          <el-form-item label="回款日期" prop="paymentDate" class="w-full">
            <div class="el-p">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                style="width: 100%"
                v-model="ruleForm.paymentDate"
              />
            </div>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12" class="padding-right">
          <el-form-item label="回款金额（万元）" prop="paymentMoney" class="w-full">
            <el-Input
              placeholder="请输入"
              v-model="ruleForm.paymentMoney"
              maxlength="13"
              @change="paymentMoneyChange"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12" class="padding-right">
          <el-form-item label="尾款时间" prop="finalDate" class="w-full">
            <div class="el-p">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                style="width: 100%"
                v-model="ruleForm.finalDate"
              />
            </div>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12" class="padding-right">
          <el-form-item label="尾款金额（万元）" prop="finalMoney" class="w-full">
            <el-Input placeholder="请输入" v-model="ruleForm.finalMoney" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12" class="padding-right">
          <el-form-item label="已回款比例（%）" prop="paymentRate" class="w-full">
            <el-Input placeholder="请输入" v-model="ruleForm.paymentRate" disabled />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12" class="padding-right">
          <el-form-item label="售后期限" prop="afterSaleDate" class="w-full">
            <el-Input placeholder="请输入" v-model="ruleForm.afterSaleDate" maxlength="10" />
          </el-form-item>
        </el-col>
        <el-col :span="12" class="padding-right">
          <el-form-item label="售后截至时间" prop="afterSaleDeadline" class="w-full">
            <div class="el-p">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                style="width: 100%"
                v-model="ruleForm.afterSaleDeadline"
              />
            </div>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12" class="padding-right">
          <el-form-item label="巡检开始时间" prop="pollingDate" class="w-full">
            <div class="el-p">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                style="width: 100%"
                v-model="ruleForm.pollingDate"
              />
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="padding-right">
          <el-form-item label="巡检周期" prop="pollingDateType" class="w-full">
            <el-select
              v-model="ruleForm.pollingDateType"
              placeholder="选择巡检周期"
              style="width: 100%"
              popper-class="select-popper-style"
            >
              <el-option
                :value="item.value"
                :label="item.label"
                v-for="(item, index) in pollingDateType"
                :key="index"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-form-item label="售后服务部门" prop="afterSaleType" class="w-full">
          <el-Radio-group v-model="ruleForm.afterSaleType">
            <el-Radio label="1">本部门</el-Radio>
            <el-Radio label="2">研发中心</el-Radio>
          </el-Radio-group>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="售后服务要求" prop="afterSaleRequire" class="w-full">
          <el-Input
            maxlength="1000"
            placeholder="请输入"
            type="textarea"
            autosize
            v-model="ruleForm.afterSaleRequire"
          />
        </el-form-item>
      </el-row>

      <el-row>
        <el-form-item label="售后服务目的" prop="afterSalePurpose" class="w-full">
          <el-Input
            maxlength="1000"
            placeholder="请输入"
            type="textarea"
            autosize
            v-model="ruleForm.afterSalePurpose"
          />
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="售后服务计划" prop="afterSalePlan" class="w-full">
          <el-Input
            maxlength="2000"
            placeholder="请输入"
            type="textarea"
            autosize
            v-model="ruleForm.afterSalePlan"
          />
        </el-form-item>
      </el-row>
    </el-form>
    <div class="flex justify-center">
      <ElButton type="primary" :loading="sureLoading" @click="submitEvolve"> 确定 </ElButton>
      <ElButton @click="closeDialog">取消</ElButton></div
    >
  </section>
</template>

<style lang="less">
.cancellation {
  margin-bottom: 0 !important;
}
.el-p {
  width: 100%;
  .el-input__wrapper {
    width: 100%;
  }
}
.padding-right {
  padding-right: 12px;
}
.select-popper-style {
  min-width: 490px !important;
}
</style>
