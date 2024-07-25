<template>
  <section>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="formRef"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-row>
        <el-col :span="24">
          <el-form-item label="变更事由" prop="remark">
            <el-input
              placeholder="请输入"
              maxlength="500"
              type="textarea"
              :autosize="{ minRows: 4 }"
              v-model="ruleForm.remark"
            />
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="里程碑1" prop="milestoneA">
            <el-date-picker
              class="milestone-date-class"
              style="width: 100%"
              format="YYYY-MM"
              type="month"
              placeholder="选择日期"
              v-model="ruleForm.milestoneA"
              :disabled="milestone1"
            />
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="里程碑2" prop="milestoneB">
            <el-date-picker
              format="YYYY-MM"
              type="month"
              class="milestone-date-class"
              style="width: 100%"
              placeholder="选择日期"
              v-model="ruleForm.milestoneB"
              :disabled="milestone2"
            />
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="里程碑3" prop="milestoneC">
            <el-date-picker
              format="YYYY-MM"
              type="month"
              class="milestone-date-class"
              style="width: 100%"
              placeholder="选择日期"
              v-model="ruleForm.milestoneC"
              :disabled="milestone3"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="flex justify-center">
      <ElButton type="primary" :loading="sureLoading" @click="submitEvolve"> 确定 </ElButton>
      <ElButton @click="closeDialog">取消</ElButton></div
    >
  </section>
</template>
  <script setup lang="ts">
import { reactive, unref, ref, inject } from 'vue'
import { useEmitt } from '@/hooks/web/useEmitt'
import { useValidator } from '@/hooks/web/useValidator'
import { ElMessage } from 'element-plus'
import moment from 'moment'
import { changeMilestoneApi, changePrincipalPersonAuditApi } from '@/api/project/Implement'

const props = defineProps({
  detailsData: {
    type: Object,
    default: {}
  }
})

const { emitter } = useEmitt()
const sureLoading = ref<boolean>(false)
const emit = defineEmits(['closeDialogClick'])
const formRef = ref<any>()
// callback 类型
type Callback = (error?: string | Error | undefined) => void
// 导入表单校验
const { required, notSpace } = useValidator()

const ruleForm = ref<any>({
  id: props.detailsData.pid,
  remark: '',
  milestoneA: props.detailsData.milestoneA,
  milestoneB: props.detailsData.milestoneB,
  milestoneC: props.detailsData.milestoneC
})
//里程碑1是否确认
const milestone1 = ref<boolean>(false)
//里程碑2是否确认
const milestone2 = ref<boolean>(false)
//里程碑3是否确认
const milestone3 = ref<boolean>(false)
//判断里程碑是否确认
const checkMilestone = () => {
  milestone1.value = props.detailsData.milestoneList?.some((item: any) => {
    return item.type === '1'
  })
  milestone2.value = props.detailsData.milestoneList?.some((item: any) => {
    return item.type === '2'
  })
  milestone3.value = props.detailsData.milestoneList?.some((item: any) => {
    return item.type === '3'
  })
}
checkMilestone()

const rules = reactive({
  remark: [
    { required: true, message: '该项为必填项' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  milestoneA: [{ required: true, message: '该项为必填项', trigger: 'change' }],
  milestoneB: [{ required: true, message: '该项为必填项', trigger: 'change' }],
  milestoneC: [{ required: true, message: '该项为必填项', trigger: 'change' }]
})

// 关闭弹窗
const closeDialog = () => {
  emit('closeDialogClick')
}

//修改里程碑时间
const submitEvolve = async () => {
  if (!formRef.value) return
  await formRef.value?.validate(async (valid: any, fields: any) => {
    if (valid) {
      sureLoading.value = true
      ruleForm.value.milestoneA = moment(getMonthLast(ruleForm.value.milestoneA)).format(
        'YYYY-MM-DD'
      )
      ruleForm.value.milestoneB = moment(getMonthLast(ruleForm.value.milestoneB)).format(
        'YYYY-MM-DD'
      )
      ruleForm.value.milestoneC = moment(getMonthLast(ruleForm.value.milestoneC)).format(
        'YYYY-MM-DD'
      )
      let form_data = new FormData()
      form_data.append('id', ruleForm.value.id)
      form_data.append('milestoneA', ruleForm.value.milestoneA)
      form_data.append('milestoneB', ruleForm.value.milestoneB)
      form_data.append('milestoneC', ruleForm.value.milestoneC)
      form_data.append('changeMilestoneReason', ruleForm.value.remark)
      const res = await changeMilestoneApi(form_data)
        .catch(() => {})
        .finally(() => {
          setTimeout(() => {
            sureLoading.value = false
          }, 200)
        })
      if (res) {
        ElMessage.success('信息保存成功')
        closeDialog()
        resetForm()
      }
    }
  })
}

// 获取某月最后一天
const getMonthLast = (timestamp: any) => {
  let date: any = timestamp ? new Date(timestamp) : new Date()
  let year: any = date.getFullYear()
  let month: any = date.getMonth()
  // day为0表示获取上一个月最后一天，所以month+1
  // 86300表示一天秒数，最后日期为 23:59:59
  return (new Date(year, month + 1, 0) / 1000 + 86399) * 1000
}

// 重置表单
const resetForm = () => {
  if (!formRef.value) return
  formRef.value.resetFields()
  ruleForm.value = unref({
    id: props.detailsData.pid,
    remark: '',
    milestoneA: props.detailsData.milestoneA,
    milestoneB: props.detailsData.milestoneB,
    milestoneC: props.detailsData.milestoneC
  })
}
</script>
  
<style lang="less" scoped>
:deep(.milestone-popper .el-popper) {
  max-width: 100px !important;
}
</style>
  
<style lang="less">
.milestone-date-class {
  .el-input__wrapper {
    width: 100% !important;
  }
}
</style>