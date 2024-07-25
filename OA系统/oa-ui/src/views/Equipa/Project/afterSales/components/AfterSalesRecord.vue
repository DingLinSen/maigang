<script setup lang="ts">
import { reactive, unref, ref, inject } from 'vue'
import { ElButton, ElMessage } from 'element-plus'
import { FileUpload } from '@/components/FileUpload' // 文件上传组件
import { saveProgressAfterSalesApi } from '@/api/project/afterSales'
import { useValidator } from '@/hooks/web/useValidator'
const props = defineProps({
  pid: {
    type: String,
    default: ''
  }
})
const sureLoading = ref<boolean>(false)
const emit = defineEmits(['closeDialogClick'])
const formRef = ref<any>()
// callback 类型
type Callback = (error?: string | Error | undefined) => void
// 导入表单校验
const { required, notSpace } = useValidator()
const ruleForm = ref<any>({
  pid: props.pid,
  content: '',
  remark: '',
  type: '4', //	类型  1 进展 2 变更 3 指示 4 售后服务 5 验收
  filePath: ''
})

const rules = reactive({
  content: [
    { required: true, message: '请输入进展', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  remark: [
    { required: false, message: '请输入备注', trigger: 'blur' },
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
    pid: props.pid,
    content: '',
    remark: '',
    type: '4', //1培育 2立项 3实施 4售后
    filePath: ''
  })
}
// 项目进展
const submitEvolve = async () => {
  if (!formRef.value) return
  await formRef.value?.validate(async (valid: any, fields: any) => {
    if (valid) {
      sureLoading.value = true

      const res = await saveProgressAfterSalesApi(ruleForm.value)
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
// 关闭弹窗
const closeDialog = () => {
  emit('closeDialogClick')
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
      <el-form-item label="进展" prop="content">
        <el-input maxlength="500" placeholder="请输入" v-model="ruleForm.content" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
          maxlength="500"
          placeholder="请输入"
          type="textarea"
          autosize
          v-model="ruleForm.remark"
        />
      </el-form-item>
      <el-form-item label="文件" prop="filePath">
        <div class="border-solid w-full">
          <FileUpload
            v-model:modelValue="ruleForm.filePath"
            :disabled="false"
            :limit="1"
            :fileType="['pdf', 'doc', 'docx', 'png', 'jpg', 'xls', 'xlsx', 'zip', 'rar']"
          />
        </div>
      </el-form-item>
    </el-form>
    <div class="flex justify-center">
      <ElButton type="primary" :loading="sureLoading" @click="submitEvolve"> 确定 </ElButton>
      <ElButton @click="closeDialog">取消</ElButton></div
    >
  </section>
</template>
