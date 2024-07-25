<script setup lang="ts">
import { reactive, unref, ref, inject } from 'vue'
import { ElButton, ElMessage } from 'element-plus'
import { changePersonScientific } from '@/api/project/scientific'
import { useEmitt } from '@/hooks/web/useEmitt'

const { emitter } = useEmitt()
//父级数据
const detailsData = inject<any>('detailsData')
const sureLoading = ref<boolean>(false)
const emit = defineEmits(['closeDialogClick', 'changeGetDetail'])
const formRef = ref<any>()

//表单数据
const ruleForm = ref<any>({
  pid: detailsData.value.pid,
  principalPerson: detailsData.value.principalPerson // 负责人
})

//人员数据集合
const options = inject<any>('principalTree')

//表单验证规则
const rules = reactive({
  principalPerson: [{ required: true, message: '请选择负责人', trigger: 'blur' }]
})

// 重置表单
const resetForm = () => {
  if (!formRef.value) return
  formRef.value.resetFields()
  ruleForm.value = unref({
    pid: detailsData.value.pid,
    principalPerson: detailsData.value.principalPerson // 负责人
  })
}

// 确定事件
const submitEvolve = async () => {
  console.log(ruleForm)
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
      const res = await changePersonScientific(form_data)
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
        //通知列表刷新数据
        emitter.emit('kyxm', 'refresh')
      }
    }
  })
}
//人员选择变化事件
const handleChange = () => {}
// 关闭弹窗
const closeDialog = () => {
  emit('closeDialogClick')
}
//通知详情页面刷新数据
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
