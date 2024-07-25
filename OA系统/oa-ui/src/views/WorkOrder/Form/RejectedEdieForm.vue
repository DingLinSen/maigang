<!-- 人资驳回后的补充 -->
<script setup lang="ts">
import { ref, unref, reactive, nextTick, getCurrentInstance, provide } from 'vue'
import { propTypes } from '@/utils/propTypes'
import { useValidator } from '@/hooks/web/useValidator'
import { useEmitt } from '@/hooks/web/useEmitt'
import { ElMessage, ElForm, ElFormItem, ElRow, ElCol, ElInput } from 'element-plus'
import { ElDialog } from '@/components/ElDialog'
import { FileButtonUpload } from '@/components/FileButtonUpload' // 文件上传组件
import { reSubmitApi, getOrderDetailApi } from '@/api/order'

const { emitter } = useEmitt()
// 弹窗的开启和关闭
const dialogFlag = ref<any>(false)
type Callback = (error?: string | Error | undefined) => void

const { required, validateEnglishAndNumber, notSpace } = useValidator()

const props = defineProps({
  title: propTypes.string.def('')
})

//弹窗
const elDialogFef = ref()
//打开drawer并初始化
const detailsId = ref<string>('')
//是否需要上传文件
const fileFlag = ref<boolean>(true)
const openDrawer = (id: string, flag: boolean) => {
  dialogFlag.value = true
  elDialogFef.value.isFullscreen = false
  fileFlag.value = flag
  nextTick(() => {
    detailsId.value = id
    filePathArray.value = []
    // getDetailsData()
  })
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
      loading.value = true
      if (ruleForm.value.uploadFile) {
        filePathArray.value.push(ruleForm.value.uploadFile)
      }
      let files: any[] = []
      filePathArray.value.forEach((item: any) => {
        files.push({ fileUrl: item })
      })

      let params = {
        orderId: detailsId.value,
        detailedReasons: ruleForm.value.detailedReasons ? ruleForm.value.detailedReasons : '',
        files: files
      }
      const res = await reSubmitApi(params)
        .catch(() => {})
        .finally(() => {
          setTimeout(() => {
            loading.value = false
          }, 200)
        })
      if (res) {
        ElMessage.success('保存信息成功')
        //通知列表刷新
        emitter.emit('order', 'refresh')
        emitter.emit('order', 'update')
        closeDialog()
      }
    }
  })
}

const filePathArray = ref<any[]>([])
//查询详情
const getDetailsData = async () => {
  if (detailsId.value) {
    const res = await getOrderDetailApi(detailsId.value)
    if (res && res.data) {
      let leave = res.data.leave
      let files = leave.files
      if (files && files.length > 0) {
        files.forEach((element: any) => {
          filePathArray.value.push(element.fileUrl)
        })
      }
    }
  }
}

//表单验证规则
const rules = reactive({
  detailedReasons: [
    { required: true, message: '请输入详细事由', trigger: 'blur' },
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
    id: '',
    detailedReasons: '',
    uploadFile: ''
  }
}

//表单数据
const ruleForm = ref<any>({
  id: '',
  detailedReasons: '',
  uploadFile: ''
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
defineExpose({
  openDrawer
})
</script>

<template>
  <ElDialog
    ref="elDialogFef"
    class="cultivate-custom"
    v-model="dialogFlag"
    :title="props.title"
    @closed="resetFormAfterClose"
  >
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="formRef"
      label-position="top"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-row>
        <el-col :span="24">
          <el-form-item label="详细事由" prop="detailedReasons">
            <el-input
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 8 }"
              maxlength="200"
              v-model="ruleForm.detailedReasons"
              placeholder="请输入详细事由"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="fileFlag">
          <el-form-item label="上传附件" prop="uploadFile">
            <div
              style="
                width: 100%;
                display: flex;
                vertical-align: middle;
                line-height: normal;
                align-items: center;
              "
            >
              <FileButtonUpload
                v-model:modelValue="ruleForm.uploadFile"
                :disabled="pageFlag === 'see'"
                v-if="pageFlag !== 'see'"
                :limit="1"
                :fileType="['pdf', 'doc', 'docx', 'png', 'jpg', 'xls', 'xlsx', 'zip', 'rar']"
              />
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="footer">
        <el-button class="dialog-btn-sure" :loading="loading" @click="save"> 确定 </el-button>
        <el-button class="dialog-btn-cancel" @click="closeDialog"> 取消 </el-button>
      </div>
    </template>
  </ElDialog>
</template>
  