<!-- 通讯录的新增/编辑 -->
<script setup lang="ts">
import { ref, unref, reactive, nextTick, getCurrentInstance, inject } from 'vue'
import { propTypes } from '@/utils/propTypes'
import { useValidator } from '@/hooks/web/useValidator'
import { useEmitt } from '@/hooks/web/useEmitt'
import { ElMessage, ElForm, ElFormItem, ElRow, ElCol, ElInput, ElTreeSelect } from 'element-plus'
import { ElDialog } from '@/components/ElDialog'
import { savePhoneBookApi, editPhoneBookApi, getPhoneBookDetailApi } from '@/api/phone'

const props = defineProps({
  deadline: propTypes.string.def(''),
  details: propTypes.object.def({}),
  index: propTypes.number.def(0)
})
const emit = defineEmits(['sureClick'])
const { emitter } = useEmitt()
// 弹窗的开启和关闭
const dialogFlag = ref<any>(false)
type Callback = (error?: string | Error | undefined) => void

const { required, notSpace, validateEmail, validatePhoneNumber, validateNormalBySearch } =
  useValidator()

//弹窗
const elDialogFef = ref()
//打开drawer并初始化
const openDrawer = () => {
  dialogFlag.value = true
  elDialogFef.value.isFullscreen = false
  if (props.details) {
    setTimeout(() => {
      ruleForm.value = props.details
    }, 200)
  }
}

//表单
const formRef = ref<any>()
//保存等待
const loading = ref(false)
//保存数据
const save = async () => {
  //表单验证
  if (!formRef.value) return
  await formRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      let params = ruleForm.value
      emit('sureClick', props.index, params)
      closeDialog()
    }
  })
}

//表单验证规则
const rules = reactive({
  milestoneTitle: [
    { required: true, message: '请输入里程碑标题', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        validateNormalBySearch(value, callback, '仅支持汉字字母数字'),
      trigger: 'blur'
    }
  ],
  milestoneDeadline: [{ required: true, message: '请选择截止时间', trigger: 'change' }],
  milestoneStatus: [{ required: true, message: '请选择里程碑状态', trigger: 'change' }],
  milestoneDescription: [
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ]
})

//清空表单
const resetForm = () => {
  ruleForm.value = {
    milestoneTitle: '',
    milestoneDeadline: '',
    milestoneStatus: '0',
    milestoneDescription: ''
  }
}

//表单数据
const ruleForm = ref<any>({
  milestoneTitle: '',
  milestoneDeadline: '',
  milestoneStatus: '0',
  milestoneDescription: ''
})

//关闭
const closeDialog = () => {
  dialogFlag.value = false
}

//关闭后清空
const resetFormAfterClose = () => {
  dialogFlag.value = false
  if (elDialogFef.value) {
    elDialogFef.value.isFullscreen = false
  }
  resetForm()
}

const milestoneDeadlinelimit = (time: any) => {
  if (props.deadline) {
    return time.getTime() > new Date(props.deadline).getTime()
  }
  return false
}

defineExpose({
  openDrawer
})
</script>

<template>
  <ElDialog
    ref="elDialogFef"
    class="cultivate-custom"
    v-model="dialogFlag"
    title="里程碑"
    @closed="resetFormAfterClose"
  >
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="formRef"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-row>
        <el-col :span="24">
          <el-form-item label="里程碑标题" prop="milestoneTitle">
            <el-input
              maxlength="30"
              v-model="ruleForm.milestoneTitle"
              placeholder="请输入里程碑标题"
              type="text"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="截止时间" prop="milestoneDeadline">
            <el-date-picker
              v-model="ruleForm.milestoneDeadline"
              :clearable="true"
              style="width: 100%"
              format="YYYY-MM-DD"
              :disabled="pageFlag === 'see'"
              value-format="YYYY-MM-DD"
              placeholder="请选择截止时间"
              :disabled-date="milestoneDeadlinelimit"
              type="date"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="里程碑状态" prop="milestoneStatus">
            <el-radio-group v-model="ruleForm.milestoneStatus">
              <el-radio label="0">未完成</el-radio>
              <el-radio label="1">已完成</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="里程碑描述" prop="milestoneDescription">
            <el-input
              maxlength="200"
              v-model="ruleForm.milestoneDescription"
              placeholder="请输入里程碑描述"
              type="textarea"
              :autosize="{ minRows: 4 }"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="footer">
        <el-button class="dialog-btn-sure" :loading="loading" @click="save"> 确定 </el-button>
        <el-button class="dialog-btn-cancel" @click="resetForm"> 重置 </el-button>
        <el-button class="dialog-btn-cancel" @click="closeDialog"> 取消 </el-button>
      </div>
    </template>
  </ElDialog>
</template>
<style lang="less" scoped>
:deep(.el-input__wrapper) {
  width: 100%;
}
</style>