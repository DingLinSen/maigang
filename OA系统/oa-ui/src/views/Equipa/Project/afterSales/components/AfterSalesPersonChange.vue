<script setup lang="ts">
import { reactive, unref, ref, inject } from 'vue'
import { ElButton, ElMessage } from 'element-plus'
import { changePersonAfterSales } from '@/api/project/afterSales'
import { useEmitt } from '@/hooks/web/useEmitt'

const props = defineProps({
  detailsData: {
    type: Object,
    default: {}
  }
})

const sureLoading = ref<boolean>(false)
const emit = defineEmits(['closeDialogClick'])
const formRef = ref<any>()

const ruleForm = ref<any>({
  pid: props.detailsData.pid,
  principalPerson: props.detailsData.principalPerson // 负责人
})

const after_sales = inject<any>('after_sales')

const rules = reactive({
  principalPerson: [{ required: true, message: '请选择售后负责人', trigger: 'blur' }]
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
      let form_data = new FormData()
      form_data.append('id', ruleForm.value.pid)
      form_data.append('principalPerson', ruleForm.value.principalPerson)
      const res = await changePersonAfterSales(form_data)
        .catch(() => {})
        .finally(() => {
          setTimeout(() => {
            sureLoading.value = false
          }, 200)
        })
      if (res) {
        ElMessage.success('售后负责人变更成功')
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
      <el-form-item label="售后负责人" prop="principalPerson">
        <el-select v-model="ruleForm.principalPerson" placeholder="选择售后负责人" class="w-select">
          <el-option
            v-for="item in after_sales"
            :label="item.label"
            :value="item.value"
            :key="item.value"
          ></el-option
        ></el-select>
      </el-form-item>
    </el-form>
    <div class="flex justify-center">
      <ElButton type="primary" :loading="sureLoading" @click="submitEvolve"> 确定 </ElButton>
      <ElButton @click="closeDialog">取消</ElButton></div
    >
  </section>
</template>
<style lang="less" scoped>
.w-select {
  width: 490px;
}
</style>
