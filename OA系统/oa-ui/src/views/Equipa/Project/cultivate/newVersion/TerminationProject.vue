<!-- 培育项目-详情/申请项目终止 -->
<script setup lang="ts">
import { reactive, unref, ref } from 'vue'
import { ElButton, ElMessage } from 'element-plus'
import { FileUpload } from '@/components/FileUpload' // 文件上传组件
import { applyEndCultivateApi } from '@/api/project/cultivate'
import { useValidator } from '@/hooks/web/useValidator'

const props = defineProps({
  id: {
    type: String,
    default: ''
  }
})

const sureLoading = ref<boolean>(false)
const emit = defineEmits(['closeDialogClick', 'changeGetDetail'])
const formRef = ref<any>()
const ruleForm = ref<any>({
  pid: props.id,
  reason: ''
})
// callback 类型
type Callback = (error?: string | Error | undefined) => void
const { required, notSpace } = useValidator()
const rules = reactive({
  reason: [
    { required: true, message: '请输入终止理由', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ]
})
// 重置表单
const resetForm = () => {
  if (!formRef.value) return
  formRef.value.resetFields()
  ruleForm.value = unref({
    pid: props.id,
    reason: ''
  })
}
// 项目进展
const submitEvolve = async () => {
  if (!formRef.value) return
  await formRef.value?.validate(async (valid: any, fields: any) => {
    if (valid) {
      sureLoading.value = true
      const res = await applyEndCultivateApi(ruleForm.value)
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
  emit('changeGetDetail')
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
      <el-form-item label="终止理由" prop="reason">
        <el-input
          placeholder="请输入"
          maxlength="500"
          type="textarea"
          autosize
          v-model="ruleForm.reason"
        />
      </el-form-item>
    </el-form>
    <div class="flex justify-center">
      <ElButton type="primary" :loading="sureLoading" @click="submitEvolve"> 确定 </ElButton>
      <ElButton @click="closeDialog">取消</ElButton></div
    >
  </section>
</template>
