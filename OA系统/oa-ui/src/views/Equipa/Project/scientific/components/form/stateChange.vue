<script setup lang="ts">
import { reactive, unref, ref, inject } from 'vue'
import { ElButton, ElMessage } from 'element-plus'
import { FileUpload } from '@/components/FileUpload' // 文件上传组件
import { useValidator } from '@/hooks/web/useValidator'
import { changeStatusScientificApi } from '@/api/project/scientific' //状态变更
import { useEmitt } from '@/hooks/web/useEmitt'

const { emitter } = useEmitt()
//父级数据
const detailsData = inject<any>('detailsData')
const sureLoading = ref<boolean>(false)
const emit = defineEmits(['closeDialogClick', 'changeGetDetail'])
const formRef = ref<any>()
// callback 类型
type Callback = (error?: string | Error | undefined) => void
// 导入表单校验
const { required, notSpace } = useValidator()

//表单数据
const ruleForm = ref<any>({
  pid: detailsData.value.pid,
  reason: '', // 理由
  changeApplyFlag:
    detailsData.value.status === '8' ? '' : detailsData.value.status === '7' ? '1' : '' //	类型 0 暂停 1 重启 2 终止
})

//项目状态集合
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

//表单验证规则
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
  ruleForm.value = unref({
    pid: detailsData.value.pid,
    reason: '', // 理由
    changeApplyFlag: '1'
  })
}

// 确定事件
const submitEvolve = async () => {
  const form = unref(formRef)
  if (!formRef.value) return
  await formRef.value?.validate(async (valid: any, fields: any) => {
    if (valid) {
      sureLoading.value = true
      const res = await changeStatusScientificApi(ruleForm.value)
        .catch(() => {})
        .finally(() => {
          setTimeout(() => {
            sureLoading.value = false
          }, 200)
        })

      if (res) {
        ElMessage.success('信息保存成功')
        resetForm()
        closeDialog()
        emitter.emit('kyxm', 'refresh')
      }
    }
  })
  console.log(form)
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
      <el-form-item label="状态" prop="changeApplyFlag">
        <el-Radio-group v-model="ruleForm.changeApplyFlag">
          <el-Radio v-if="detailsData.status !== '8'" label="0">暂停</el-Radio>
          <el-Radio label="1">终止</el-Radio>
          <el-Radio label="2" :disabled="detailsData.status !== '8'">重启</el-Radio>
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
