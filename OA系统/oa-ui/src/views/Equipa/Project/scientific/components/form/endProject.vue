<script setup lang="ts">
import { reactive, unref, ref, inject } from 'vue'
import { ElButton, ElMessage } from 'element-plus'
import moment from 'moment'
import { endProjectApi } from '@/api/project/scientific'
import { useValidator } from '@/hooks/web/useValidator'
import { FileUpload } from '@/components/FileUpload' // 文件上传组件

// 获取 父级数据
const detailsData = inject<any>('detailsData')
const getDetailsData = inject<any>('getDetailsData')
const sureLoading = ref<boolean>(false)
const emit = defineEmits(['closeDialogClick', 'changeGetDetail', 'closeDialogSure'])
const formRef = ref<any>()
// callback 类型
type Callback = (error?: string | Error | undefined) => void
// 导入表单校验
const { required, notSpace } = useValidator()
//表单数据
const ruleForm = ref<any>({
  pid: detailsData.value.pid,
  conclusionReason: null,
  summarize: null,
  remark: null,
  conclusionFilePath: ''
})

//表单校验规则
const rules = reactive({
  conclusionReason: [
    { required: true, message: '请输入结题原因', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  summarize: [
    { required: true, message: '请输入研究总结', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  conclusionFilePath: [{ required: true, message: '请上传研究成果', trigger: 'change' }]
})

// 重置表单
const resetForm = () => {
  if (!formRef.value) return
  formRef.value.resetFields()
  ruleForm.value = unref({
    pid: detailsData.value.pid,
    conclusionReason: null,
    summarize: null,
    remark: null,
    conclusionFilePath: ''
  })
}
// 确定事件
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

// 确定完成事件
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
      <el-form-item label="结题原因" prop="conclusionReason" label-width="120">
        <el-input
          maxlength="2000"
          placeholder="请输入"
          type="textarea"
          autosize
          v-model="ruleForm.conclusionReason"
        />
      </el-form-item>
      <el-form-item label="研究总结" prop="summarize" label-width="120">
        <el-input
          maxlength="2000"
          placeholder="请输入"
          type="textarea"
          autosize
          v-model="ruleForm.summarize"
        />
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

      <el-form-item label="研究成果" prop="conclusionFilePath" label-width="120">
        <div class="border-solid w-full">
          <FileUpload
            v-model:modelValue="ruleForm.conclusionFilePath"
            :disabled="false"
            :limit="1"
            :fileSize="2 * 1024"
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
<style lang="less">
.el-p {
  width: 100%;
  .el-input__wrapper {
    width: 100%;
  }
}
</style>
