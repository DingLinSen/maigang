<script setup lang="ts">
import { reactive, unref, ref } from 'vue'
import { ElButton, ElMessage } from 'element-plus'
import moment from 'moment'
import { endProjectApi } from '@/api/project/afterSales'
import { useValidator } from '@/hooks/web/useValidator'
import { FileUpload } from '@/components/FileUpload' // 文件上传组件

const props = defineProps({
  pid: {
    type: String,
    default: ''
  }
})

const sureLoading = ref<boolean>(false)
const emit = defineEmits(['closeDialogClick', 'closeDialogSure'])
const formRef = ref<any>()
// callback 类型
type Callback = (error?: string | Error | undefined) => void
// 导入表单校验
const { required, notSpace } = useValidator()
const ruleForm = ref<any>({
  pid: props.pid,
  endDate: moment(new Date()).format('YYYY-MM-DD'),
  remark: null,
  endPaymentPath: null
})

const rules = reactive({
  endDate: [{ required: true, message: '该项为必填项', trigger: 'change' }],
  remark: [
    { required: false, message: '请输入备注', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  endPaymentPath: [{ required: true, message: '该项为必填项', trigger: 'change' }]
})

// 重置表单
const resetForm = () => {
  if (!formRef.value) return
  formRef.value.resetFields()
  ruleForm.value = unref({
    pid: props.pid,
    endDate: moment(new Date()).format('YYYY-MM-DD'),
    remark: null,
    endPaymentPath: null
  })
}
// 项目进展
const submitEvolve = async () => {
  if (!formRef.value) return
  await formRef.value?.validate(async (valid: any, fields: any) => {
    if (valid) {
      sureLoading.value = true
      const res = await endProjectApi(ruleForm.value)
        .catch(() => {})
        .finally(() => {
          setTimeout(() => {
            sureLoading.value = false
          }, 200)
        })
      if (res) {
        ElMessage.success('信息保存成功')
        resetForm()
        callbackDetail()
      }
    }
  })
}
// 关闭弹窗
const closeDialog = () => {
  emit('closeDialogClick')
}

const callbackDetail = () => {
  emit('closeDialogSure')
}
</script>

<template>
  <section>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="formRef"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="项目结束时间" prop="endDate" label-width="120">
        <div class="el-p">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            style="width: 100%"
            v-model="ruleForm.endDate"
            popper-class="el-picker-popper-left"
          />
        </div>
      </el-form-item>
      <el-form-item label="尾款汇款记录" prop="endPaymentPath" label-width="120">
        <div class="border-solid w-full">
          <FileUpload
            v-model:modelValue="ruleForm.endPaymentPath"
            :disabled="false"
            :limit="1"
            :fileType="['pdf', 'doc', 'docx', 'png', 'jpg', 'xls', 'xlsx', 'zip', 'rar']"
          />
        </div>
      </el-form-item>
      <el-form-item label="备注" prop="remark" label-width="120">
        <el-input
          maxlength="500"
          placeholder="请输入"
          type="textarea"
          autosize
          v-model="ruleForm.remark"
        />
      </el-form-item>
    </el-form>
    <div class="flex justify-center">
      <ElButton type="primary" :loading="sureLoading" @click="submitEvolve"> 确定 </ElButton>
      <ElButton @click="closeDialog">取消</ElButton></div
    >
  </section>
</template>
<style lang="less">
.el-p {
  width: 100%;
  .el-input__wrapper {
    width: 100%;
  }
}
.el-picker-popper-left {
  margin-left: -12rem !important;
}
</style>