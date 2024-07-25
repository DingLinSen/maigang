<script setup lang="ts">
import { reactive, unref, ref, inject } from 'vue'
import { ElButton, ElMessage } from 'element-plus'
import { FileUpload } from '@/components/FileUpload' // 文件上传组件
import { useValidator } from '@/hooks/web/useValidator'
import { changeStatusImplementApi } from '@/api/project/Implement'
import { useEmitt } from '@/hooks/web/useEmitt'

const props = defineProps({
  pid: {
    type: String,
    default: ''
  },
  changeApplyFlag: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    default: ''
  }
})

const { emitter } = useEmitt()
const sureLoading = ref<boolean>(false)
const emit = defineEmits(['closeDialogClick', 'changeGetDetail'])
const formRef = ref<any>()
// callback 类型
type Callback = (error?: string | Error | undefined) => void
// 导入表单校验
const { required, notSpace } = useValidator()
const ruleForm = ref<any>({
  pid: props.pid,
  reason: '', // 理由
  changeApplyFlag: props.changeApplyFlag //	类型 0 暂停 1 重启 2 终止
})

const options = reactive([
  {
    value: '0',
    label: '暂停'
  },
  {
    value: '1',
    label: '重启'
  },
  {
    value: '2',
    label: '终止'
  }
])

const rules = reactive({
  changeApplyFlag: [{ required: true, message: '请选择状态', trigger: 'blur' }],
  reason: [
    { required: false, message: '请输入理由', trigger: 'blur' },
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
  ruleForm.value = {
    pid: props.pid,
    reason: '', // 理由
    changeApplyFlag: '1'
  }
}
// 项目进展
const submitEvolve = async () => {
  const form = unref(formRef)
  if (!formRef.value) return
  await formRef.value?.validate(async (valid: any, fields: any) => {
    if (valid) {
      sureLoading.value = true
      const res = await changeStatusImplementApi(ruleForm.value)
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
  console.log(form)
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
      <el-form-item label="状态" prop="changeApplyFlag">
        <el-Radio-group v-model="ruleForm.changeApplyFlag">
          <el-Radio v-if="status !== '3'" label="0">暂停</el-Radio>
          <el-Radio label="1">终止</el-Radio>
          <el-Radio label="2" :disabled="status !== '3'">重启</el-Radio>
        </el-Radio-group>
      </el-form-item>
      <el-form-item label="理由" prop="reason">
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
