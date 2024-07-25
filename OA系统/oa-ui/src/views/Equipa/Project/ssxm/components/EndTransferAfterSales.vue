<!--已回款转售后-->
<script setup lang="ts">
import { Dialog } from '@/components/Dialog'
import { findLastIndex } from '@/utils'
import { AfterSalesPlan } from '../components'
import { Segmentation } from '@/components/Segmentation'
import { FileTextUpload } from '@/components/FileTextUpload' // 文件上传组件
import { ElButton, ElMessage } from 'element-plus'
import { afterSalesApplyApi } from '@/api/project/ssxm' // 售后申请
import { ref, reactive, unref, nextTick } from 'vue'
import FilePreview from '@/views/Components/FilePreview/FilePreview.vue'
import { useEmitt } from '@/hooks/web/useEmitt'
import moment from 'moment'

const props = defineProps({
  detailsData: {
    type: Object,
    default: {}
  }
})

const { emitter } = useEmitt()

const executionDialogVisible = ref(false)
const emit = defineEmits(['closeDialogClick', 'closeDialogSure'])
const confirmData = ref<any>({})
const file = ref({
  bidUrl: '',
  bidResultUrl: '',
  saleContractUrl: ''
}) // 投标文件
const sureLoading = ref<boolean>(false)
const formRef = ref<any>()
const rules = reactive({
  paymentFilePath: [{ required: true, message: '该项为必填项', trigger: 'blur' }]
})

const filterFilePath = (type: string) => {
  let auditLisData = props.detailsData.pmAuditList
  // 获取最后一个申请的索引
  let lastIndex = findLastIndex(
    auditLisData,
    (item: any) => item.flag === '1' && item.phase === '1'
  )
  // 截取最后一个申请之后的数据
  auditLisData = auditLisData.slice(lastIndex, auditLisData.length)
  if (type === 'acceptFilePath') {
    return auditLisData[0].acceptFilePath
  } else if (type === 'acceptReportFilePath') {
    return auditLisData[0].acceptReportFilePath
  } else if (type === 'photoFilePath') {
    return auditLisData[0].photoFilePath
  } else {
    return ''
  }
}
const ruleForm = ref<any>({
  pid: props.detailsData.pid, // 项目id
  projectTitle: props.detailsData.projectTitle, // 项目名称
  itemNumber: props.detailsData.itemNumber, // 项目编号
  paymentFilePath: '', //	回款记录url
  paymentFileReason: '', //	回款记录原因
  acceptFilePath: filterFilePath('acceptFilePath'), //验收材料url
  acceptFileReason: '', //验收材料原因
  acceptReportFilePath: filterFilePath('acceptReportFilePath'), //验收报告url
  acceptReportFileReason: '', //验收报告原因
  photoFilePath: filterFilePath('photoFilePath'), //实施照片url
  photoFileReason: '' //实施照片原因
})

const submitEvolve = async () => {
  if (Object.keys(confirmData.value).length) {
    let params = {
      acceptDate: confirmData.value.acceptDate,
      afterSaleDate: confirmData.value.afterSaleDate,
      afterSaleDeadline: confirmData.value.afterSaleDeadline,
      afterSalePlan: confirmData.value.afterSalePlan,
      afterSalePurpose: confirmData.value.afterSalePurpose,
      afterSaleRequire: confirmData.value.afterSaleRequire,
      afterSaleType: confirmData.value.afterSaleType,
      contractMoney: confirmData.value.contractMoney,
      finalDate: confirmData.value.finalDate,
      finalMoney: confirmData.value.finalMoney,
      itemNumber: confirmData.value.itemNumber,
      ownerName: confirmData.value.ownerName,
      paymentDate: confirmData.value.paymentDate,
      paymentMoney: confirmData.value.paymentMoney,
      paymentRate: confirmData.value.paymentRate,
      pid: confirmData.value.pid,
      pollingDate: confirmData.value.pollingDate,
      pollingDateType: confirmData.value.pollingDateType,
      projectTitle: confirmData.value.projectTitle
    }
    let data = Object.assign(params, ruleForm.value, { pid: props.detailsData.pid })
    if (!formRef.value) return
    await formRef.value?.validate(async (valid: any, fields: any) => {
      if (valid) {
        sureLoading.value = true
        const res = await afterSalesApplyApi(data)
          .catch(() => {})
          .finally(() => {
            sureLoading.value = false
          })
        if (res) {
          ElMessage.success('信息提交成功')
          callbackDetail()
          emitter.emit('afterSales', 'refresh')
        }
      }
    })
  } else {
    ElMessage.error('请先填写项目售后计划书')
  }
}

const callbackDetail = () => {
  emit('closeDialogSure')
}

const closeDialog = () => {
  emit('closeDialogClick')
}

const closePermissionDialog = () => {
  executionDialogVisible.value = false
}

// 获取文件名称
const getFileName = (name: any) => {
  if (name && name.lastIndexOf('/') > -1) {
    return name.slice(name.lastIndexOf('/') + 1)
  } else {
    return ''
  }
}

// 预览弹窗
const previewFile = (fileName: string, path: string) => {
  FilePreviewRef.value.openDialog(fileName, path)
}

const fileNext = (path: any) => {
  let extension = ''
  if (path) {
    extension = path.substring(path.lastIndexOf('.') + 1)
  }
  return extension
}
const FilePreviewRef = ref()

const ProjectConfirmationRef = ref()

//获取项目售后计划书
const getConfirmData = () => {
  if (props.detailsData.rejectData) {
    confirmData.value = props.detailsData.rejectData
  }
}

getConfirmData()

//打开项目售后计划书
const openExecutionDialog = () => {
  executionDialogVisible.value = true
  nextTick(() => {
    if (Object.keys(confirmData.value).length) {
      ProjectConfirmationRef.value.restFromValue(confirmData.value)
    }
  })
}

const fileChange = (url: any) => {
  if (!formRef.value) return
  formRef.value?.validate(async (valid: any, fields: any) => {})
}
</script>

<template>
  <section class="px-8" style="height: 60vh">
    <Dialog
      width="85%"
      v-model="executionDialogVisible"
      :modal="false"
      :maxHeight="'auto'"
      :title="'项目售后计划书'"
    >
      <AfterSalesPlan
        ref="ProjectConfirmationRef"
        :detailsData="detailsData"
        @close-dialog-click="closePermissionDialog"
        v-model:confirmData="confirmData"
      />
    </Dialog>
    <Segmentation title="基本信息" class="projectDebriefing">
      <template #content>
        <ElRow :gutter="16" style="text-align: center" justify="space-between" class="top-row">
          <ElCol :span="2">
            <P class="name-p"> 项目编号 </P>
            <p class="sub-title" :title="detailsData.itemNumber">
              {{ detailsData.itemNumber || '--' }}
            </p>
          </ElCol>
          <ElCol :span="2">
            <P class="name-p"> 项目名称 </P>
            <p class="sub-title" :title="detailsData.projectTitle">
              {{ detailsData.projectTitle || '--' }}
            </p>
          </ElCol>

          <ElCol :span="2">
            <P class="name-p"> 合同签订日期 </P>
            <p class="sub-title" :title="detailsData.contractSignDate">
              {{ moment(detailsData.contractSignDate).format('YYYY-MM-DD') || '--' }}
            </p>
          </ElCol>
          <ElCol :span="2">
            <P class="name-p"> 合同金额 </P>
            <p class="sub-title" :title="detailsData.contractMoney">
              {{ (detailsData.contractMoney ? detailsData.contractMoney + '万元' : '--') || '--' }}
            </p>
          </ElCol>
          <ElCol :span="2">
            <P class="name-p"> 验收时间 </P>
            <p class="sub-title" :title="detailsData.acceptDate">
              {{
                detailsData.acceptDate ? moment(detailsData.acceptDate).format('YYYY-MM-DD') : '--'
              }}
            </p>
          </ElCol>
          <ElCol :span="2">
            <P class="name-p"> 预计回款时间 </P>
            <p class="sub-title" :title="detailsData.predictPaymentDate">
              {{
                detailsData.predictPaymentDate
                  ? moment(detailsData.predictPaymentDate).format('YYYY-MM-DD')
                  : '--'
              }}
            </p>
          </ElCol>

          <ElCol :span="2">
            <P class="name-p"> 项目经理 </P>
            <p class="sub-title" :title="detailsData.projectManagerName">
              {{ detailsData.projectManagerName || '--' }}
            </p>
          </ElCol>
          <ElCol :span="2">
            <P class="name-p"> 销售经理 </P>
            <p class="sub-title" :title="detailsData.salesManagerName">
              {{ detailsData.salesManagerName || '--' }}
            </p>
          </ElCol>
        </ElRow>
      </template>
    </Segmentation>
    <Segmentation title="已回款转售后" class="projectDebriefing">
      <template #content>
        <div class="apply-title ml-4 mb-6">
          <Icon class="icon-form mr-1" icon="svg-icon:form" />
          <span>申请</span>
        </div>

        <ElForm
          :model="ruleForm"
          :rules="rules"
          ref="formRef"
          label-width="100px"
          class="demo-ruleForm"
        >
          <ElRow class="apply-title ml-4 mb-6">
            <p class="require pr-4">请填写项目售后计划书</p>
            <el-button type="primary" @click="openExecutionDialog">点击填写</el-button>
          </ElRow>
          <ElRow class="apply-title ml-4 mb-6">
            <p class="text-[red]"
              >注：请上传.pdf，.doc，.docx，.png，.jpg，.xls，.xlsx，.zip，.rar格式的文件</p
            >
          </ElRow>
          <el-form-item label="请上传《回款记录》" prop="paymentFilePath" label-width="150">
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
                v-model:modelValue="ruleForm.paymentFilePath"
                @change-file-url="fileChange"
                :disabled="false"
                :limit="2"
                :fileType="['pdf', 'doc', 'docx', 'png', 'jpg', 'xls', 'xlsx', 'zip', 'rar']"
              />
            </div>
          </el-form-item>
        </ElForm>
      </template>
    </Segmentation>

    <div class="flex justify-center pt-6">
      <ElButton type="primary" :loading="sureLoading" @click="submitEvolve"> 确定 </ElButton>
      <ElButton @click="closeDialog">取消</ElButton></div
    >
  </section>

  <FilePreview title="预览" ref="FilePreviewRef" />
</template>

<style lang="less" scoped>
.apply-title {
  display: flex;
  align-items: center;
}
.icon-form {
  color: rgb(78, 179, 236);
}

.require::before {
  padding-right: 4px;
  content: '*';
  color: red;
}
:deep(.execution-content .el-card) {
  overflow: auto;
  border: none !important;
  :deep(.el-card__body) {
    background: #fff !important;
  }
}
.drawer-wrap-details {
  background: #fff !important;
}
</style>
