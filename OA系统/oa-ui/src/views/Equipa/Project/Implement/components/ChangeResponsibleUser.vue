<script setup lang="ts">
import { reactive, unref, ref, inject } from 'vue'
import { ElButton, ElMessage } from 'element-plus'
import { changePrincipalPersonImplementApi } from '@/api/project/Implement'
import { useEmitt } from '@/hooks/web/useEmitt'

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

const ruleForm = ref<any>({
  pid: props.detailsData.pid,
  principalPerson: props.detailsData.principalPerson // 负责人
})

const options = inject<any>('principalTree')

const rules = reactive({
  principalPerson: [{ required: true, message: '请选择负责人', trigger: 'blur' }]
})

// 重置表单
const resetForm = () => {
  if (!formRef.value) return
  formRef.value.resetFields()
  ruleForm.value = unref({
    pid: props.detailsData.pid,
    principalPerson: props.detailsData.principalPerson // 负责人
  })
}
// 项目进展
const submitEvolve = async () => {
  if (!formRef.value) return
  await formRef.value?.validate(async (valid: any, fields: any) => {
    if (valid) {
      sureLoading.value = true
      ruleForm.value.principalPerson =
        typeof ruleForm.value.principalPerson === 'number' && !isNaN(ruleForm.value.principalPerson)
          ? [ruleForm.value.principalPerson]
          : ruleForm.value.principalPerson[ruleForm.value.principalPerson.length - 1] + ''
      let form_data = new FormData()
      form_data.append('id', ruleForm.value.pid)
      form_data.append('principalPerson', ruleForm.value.principalPerson)
      const res = await changePrincipalPersonImplementApi(form_data)
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
const handleChange = () => {}
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
      <el-form-item label="负责人" prop="principalPerson">
        <el-cascader
          v-model="ruleForm.principalPerson"
          style="width: 100%"
          :filterable="true"
          :disabled="false"
          :props="{ label: 'deptName', value: 'deptId' }"
          :controlsPosition="'right'"
          :options="options"
          @change="handleChange"
        />
      </el-form-item>
    </el-form>
    <div class="flex justify-center">
      <ElButton type="primary" :loading="sureLoading" @click="submitEvolve"> 确定 </ElButton>
      <ElButton @click="closeDialog">取消</ElButton></div
    >
  </section>
</template>
