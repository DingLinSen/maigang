<!--确认里程碑-->
<script setup lang="ts">
import { reactive, unref, ref } from 'vue'
import { ElButton, ElMessage } from 'element-plus'
import { FileUpload } from '@/components/FileUpload' // 文件上传组件
import { useValidator } from '@/hooks/web/useValidator'
import { saveMilestoneImplementApi } from '@/api/project/Implement' // 获取信息
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
// callback 类型
type Callback = (error?: string | Error | undefined) => void
// 导入表单校验
const { required, notSpace } = useValidator()
const ruleForm = ref<any>({
  pid: props.detailsData.pid,
  content: '',
  remark: '',
  region: '',
  flag: 0,
  status: 0,
  type: '', //	类型 1 里程碑1 2 里程碑2 3 里程碑3
  filePath: ''
})

const options = ref([
  {
    value: 1,
    label: '里程碑1'
  },
  {
    value: 2,
    label: '里程碑2'
  },
  {
    value: 3,
    label: '里程碑3'
  }
])

let milestoneSubA = !props.detailsData.milestoneList?.length

if (milestoneSubA) {
  options.value = [
    {
      value: 1,
      label: '里程碑1'
    }
  ]
}

let milestoneSubB = props.detailsData.milestoneList?.some((item) => {
  return item.type === '1'
})
if (milestoneSubB) {
  options.value = [
    {
      value: 2,
      label: '里程碑2'
    }
  ]
}
let milestoneSubC = props.detailsData.milestoneList?.some((item) => {
  return item.type === '2'
})
if (milestoneSubC) {
  options.value = [
    {
      value: 3,
      label: '里程碑3'
    }
  ]
}

let milestoneSubD = props.detailsData.milestoneList?.some((item) => {
  return item.type === '3'
})

console.log(milestoneSubA, milestoneSubB, milestoneSubC, milestoneSubD)

const rules = reactive({
  type: [{ required: true, message: '请选择里程碑', trigger: 'blur' }],
  remark: [
    { required: false, message: '请输入内容' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    },
    {
      min: 0,
      max: 500,
      message: '长度在0到500字符以内',
      trigger: 'blur'
    }
  ],
  content: [
    { required: true, message: '请输入内容' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    },
    {
      min: 0,
      max: 500,
      message: '长度在0到500字符以内',
      trigger: 'blur'
    }
  ]
})

// 重置表单
const resetForm = () => {
  if (!formRef.value) return
  formRef.value.resetFields()
  ruleForm.value = unref({
    pid: props.detailsData.pid,
    content: '',
    remark: '',
    flag: 0,
    status: 0,
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
      console.log('formRef', ruleForm)
      const res = await saveMilestoneImplementApi(ruleForm.value)
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
      <el-form-item label="里程碑" prop="type">
        <el-select
          class="w-full"
          :disabled="milestoneSubD"
          :popper-append-to-body="false"
          v-model="ruleForm.type"
          placeholder="请选择"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <el-input
          maxlength="500"
          typr="textarea"
          placeholder="请输入"
          autosize
          v-model="ruleForm.content"
        />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
          maxlength="500"
          type="textarea"
          placeholder="请输入"
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
<style lang="less" scoped>
:deep(.milestone-popper .el-popper) {
  max-width: 100px !important;
}
</style>
