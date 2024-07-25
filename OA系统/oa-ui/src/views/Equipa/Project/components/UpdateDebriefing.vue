<script setup lang="ts">
import { reactive, unref, ref, inject } from 'vue'
import { ElButton, ElMessage } from 'element-plus'
import { FileUpload } from '@/components/FileUpload' // 文件上传组件
import { saveProgressCultivateApi } from '@/api/project/cultivate'
import { saveProgressImplementApi } from '@/api/project/Implement'
import { saveProgressEstablishApi } from '@/api/project/ssxm'
import { saveProgressAfterSalesApi } from '@/api/project/afterSales'
import { useValidator } from '@/hooks/web/useValidator'

// callback 类型
type Callback = (error?: string | Error | undefined) => void
const sureLoading = ref<boolean>(false)
const { notSpace } = useValidator()
const emit = defineEmits(['closeDialogClick', 'changeGetDetail'])
const formRef = ref<any>()
const props = defineProps({
  pid: {
    type: String,
    default: ''
  },
  phase: {
    type: String,
    default: ''
  }
})
const ruleForm = ref<any>({
  pid: props.pid,
  content: '',
  remark: '',
  type: '1', //	类型 1 进展 2 变更 3 指示
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
    type: '1', //	类型 1 进展 2 变更 3 指示
    filePath: ''
  })
}
// 项目进展
const submitEvolve = async () => {
  if (!formRef.value) return
  await formRef.value?.validate(async (valid: any, fields: any) => {
    if (valid) {
      sureLoading.value = true
      let res: any
      if (props.phase == '1') {
        res = await saveProgressCultivateApi(ruleForm.value)
          .catch(() => {})
          .finally(() => {
            setTimeout(() => {
              sureLoading.value = false
            }, 200)
          })
      } else if (props.phase == '2') {
        res = await saveProgressImplementApi(ruleForm.value)
          .catch(() => {})
          .finally(() => {
            setTimeout(() => {
              sureLoading.value = false
            }, 200)
          })
      } else if (props.phase == '3') {
        res = await saveProgressEstablishApi(ruleForm.value)
          .catch(() => {})
          .finally(() => {
            setTimeout(() => {
              sureLoading.value = false
            }, 200)
          })
      } else if (props.phase == '4') {
        res = await saveProgressAfterSalesApi(ruleForm.value)
          .catch(() => {})
          .finally(() => {
            setTimeout(() => {
              sureLoading.value = false
            }, 200)
          })
      }
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
      <el-form-item label="进展" prop="content">
        <el-input placeholder="请输入" maxlength="500" v-model="ruleForm.content" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
          placeholder="请输入"
          maxlength="500"
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
