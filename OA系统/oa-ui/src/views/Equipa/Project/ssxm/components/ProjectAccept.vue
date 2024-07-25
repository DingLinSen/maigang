<!--项目验收-->
<script setup lang="ts">
import { reactive, unref, ref } from 'vue'
import { ElButton, ElMessage } from 'element-plus'
import { FileTextUpload } from '@/components/FileTextUpload' // 文件上传组件
import { useValidator } from '@/hooks/web/useValidator'
import moment from 'moment'
import { acceptanceProjectApi } from '@/api/project/ssxm' // 项目验收

const emit = defineEmits(['closeDialogClick', 'closeDialogSure'])

const props = defineProps({
  pid: {
    type: String,
    default: ''
  }
})

const sureLoading = ref<boolean>(false)
const formRef = ref<any>()
// callback 类型
type Callback = (error?: string | Error | undefined) => void
// 导入表单校验
const { required, notSpace } = useValidator()
const rules = reactive({
  acceptDate: [{ required: true, message: '该项为必填项', trigger: 'change' }],
  content: [
    { required: true, message: '请输入验收内容', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  photoFilePath: [{ required: true, message: '该项为必填项', trigger: 'blur' }],
  acceptFilePath: [{ required: true, message: '该项为必填项', trigger: 'blur' }],
  acceptReportFilePath: [{ required: true, message: '该项为必填项', trigger: 'blur' }]
})

const ruleForm = ref<any>({
  pid: props.pid,
  acceptDate: moment(new Date()).format('YYYY-MM-DD'), //验收日期
  content: '',
  remark: '',
  acceptFilePath: '', //验收材料url
  acceptFileReason: '', //验收材料原因
  acceptReportFilePath: '', //验收报告url
  acceptReportFileReason: '', //验收报告原因
  photoFilePath: '', //实施照片url
  photoFileReason: '' //实施照片原因
})
// 关闭弹窗
const closeDialog = () => {
  emit('closeDialogClick')
}

const callbackDetail = () => {
  emit('closeDialogSure')
}

const submitEvolve = async () => {
  if (!formRef.value) return
  await formRef.value?.validate(async (valid: any, fields: any) => {
    if (valid) {
      let data = ruleForm.value
      data.acceptDate = moment(data.acceptDate).format('YYYY-MM-DD')
      sureLoading.value = true
      const res = await acceptanceProjectApi(data)
        .catch(() => {})
        .finally(() => {
          sureLoading.value = false
        })
      if (res) {
        ElMessage.success('信息保存成功')
        callbackDetail()
      }
    }
  })
}
</script>

<template>
  <section class="content-wrap">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="formRef"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="验收时间" prop="acceptDate">
        <div class="el-p">
          <el-date-picker
            type="date"
            placeholder="请选择验收时间"
            style="width: 100%"
            v-model="ruleForm.acceptDate"
          />
        </div>
      </el-form-item>
      <el-form-item label="验收内容" prop="content">
        <el-input
          :maxlength="2000"
          placeholder="请输入"
          v-model="ruleForm.content"
          type="textarea"
          autosize
        />
      </el-form-item>
      <el-form-item
        label="请上传《项目实施照片》"
        prop="photoFilePath"
        label-width="200"
        class="w-full"
      >
        <div
          style="
            width: 100%;
            display: flex;
            vertical-align: middle;
            line-height: normal;
            align-items: center;
          "
        >
          <FileTextUpload
            v-model:modelValue="ruleForm.photoFilePath"
            :disabled="false"
            :limit="1"
            :fileSize="2 * 1024"
            :fileType="['pdf', 'doc', 'docx', 'png', 'jpg', 'xls', 'xlsx', 'zip', 'rar']"
          />
        </div>
      </el-form-item>

      <el-form-item
        label="请上传《验收材料》"
        prop="acceptFilePath"
        label-width="200"
        class="w-full"
      >
        <div
          style="
            width: 100%;
            display: flex;
            vertical-align: middle;
            line-height: normal;
            align-items: center;
          "
        >
          <FileTextUpload
            v-model:modelValue="ruleForm.acceptFilePath"
            :disabled="false"
            :limit="1"
            :fileSize="2 * 1024"
            :fileType="['pdf', 'doc', 'docx', 'png', 'jpg', 'xls', 'xlsx', 'zip', 'rar']"
          />
        </div>
      </el-form-item>

      <el-form-item
        label="请上传《验收报告》"
        prop="acceptReportFilePath"
        label-width="200"
        class="w-full"
      >
        <div
          style="
            width: 100%;
            display: flex;
            vertical-align: middle;
            line-height: normal;
            align-items: center;
          "
        >
          <FileTextUpload
            v-model:modelValue="ruleForm.acceptReportFilePath"
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
    &nbsp;
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
<style lang="less" scoped>
.content-wrap {
  max-height: 600px;
}
</style>
