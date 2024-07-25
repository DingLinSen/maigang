<!--立项转实施-->
<script setup lang="ts">
import { Dialog } from '@/components/Dialog'
import { findLastIndex } from '@/utils'
import { Segmentation } from '@/components/Segmentation'
import { ProjectConfirmation } from '../components'
import { FileTextUpload } from '@/components/FileTextUpload' // 文件上传组件
import {
  ElButton,
  ElMessage,
  ElRow,
  ElCol,
  ElInput,
  ElForm,
  ElFormItem,
  FormRules
} from 'element-plus'
import { implementationApplyApi } from '@/api/project/Implement' // 转实施
import { useEmitt } from '@/hooks/web/useEmitt'
import moment from 'moment' // 过滤时间格式组件
import { ref, reactive, unref, nextTick, onMounted, onBeforeMount } from 'vue'
import { getProjectStatusLabel } from '../../config/config'

const props = defineProps({
  detailsData: {
    type: Object,
    default: {}
  }
})

const { emitter } = useEmitt()
const formRef = ref<any>()
const executionDialogVisible = ref(false)
const emit = defineEmits(['closeDialogClick', 'changeGetDetailAndList'])
const confirmData = ref<any>({})

// 表单字段
const formData = ref<any>({
  pid: props.detailsData.pid, // 项目id
  projectTitle: props.detailsData.projectTitle, // 项目名称
  itemNumber: props.detailsData.itemNumber, // 项目编号
  bidUrl: '', //	投标文件地址
  bidResultUrl: '', //投标分析结果地址
  saleContractUrl: '', //	销售合同地址
  bidReason: '', //	投标文件原因
  bidResultReason: '', //	投标结果文件原因
  salesContractReason: '' //	投标分析结果地址
})

// 表单校验
const ruleValidate = ref<FormRules>({
  bidUrl: [{ required: true, message: '该项为必填项', trigger: 'change' }],
  bidResultUrl: [{ required: true, message: '该项为必填项', trigger: 'change' }],
  saleContractUrl: [{ required: true, message: '该项为必填项', trigger: 'change' }],
  bidReason: [{ required: true, message: '该项为必填项', trigger: 'blur' }],
  bidResultReason: [{ required: true, message: '该项为必填项', trigger: 'blur' }],
  salesContractReason: [{ required: true, message: '该项为必填项', trigger: 'blur' }],
  reason: [{ required: true, message: '该项为必填项', trigger: 'blur' }],
  auditTime: [{ required: true, message: '该项为必填项', trigger: 'blur' }],
  status: [{ required: true, message: '该项为必填项', trigger: 'change' }]
})
const sureLoading = ref<boolean>(false)
// 更新父级数据
const changeGetDetailAndList = () => {
  executionDialogVisible.value = false
  emit('changeGetDetailAndList')
}
// 保存
const submitEvolve = async () => {
  if (confirmData.value && Object.keys(confirmData.value).length > 10) {
    let params = {
      contractMoney: confirmData.value.contractMoney,
      contractNumber: confirmData.value.contractNumber,
      contractSignDate: confirmData.value.contractSignDate,
      contractSignUnit: confirmData.value.contractSignUnit,
      implementDept: confirmData.value.implementDept,
      itemNumber: confirmData.value.itemNumber,
      lastUserUnit: confirmData.value.lastUserUnit,
      projectAffiliation: confirmData.value.projectAffiliation,
      projectManager: confirmData.value.projectManager,
      projectTitle: confirmData.value.projectTitle,
      projectTypeCompany: confirmData.value.projectTypeCompany,
      projectTypeIndustry: Number(confirmData.value.projectType) + 1,
      projectType: props.detailsData.projectType,
      projectTypeSales: confirmData.value.projectTypeSales,
      salesManager: confirmData.value.salesManager,
      updateProjectTitle: confirmData.value.updateProjectTitle,
      directCustomerId: confirmData.value.directCustomerId,
      directCustomerContactsId: confirmData.value.directCustomerContactsId,
      finalCustomerId: confirmData.value.finalCustomerId,
      finalCustomerContactsId: confirmData.value.finalCustomerContactsId
    }
    let data = Object.assign(params, formData.value, { pid: props.detailsData.pid })
    if (!formRef.value) return
    await formRef.value?.validate(async (valid: any, fields: any) => {
      if (valid) {
        sureLoading.value = true
        const res = await implementationApplyApi(data)
          .catch(() => {})
          .finally(() => {
            setTimeout(() => {
              sureLoading.value = false
            }, 200)
          })
        if (res) {
          ElMessage.success('信息提交成功')
          resetForm()
          changeGetDetailAndList()
          //通知实施项目列表刷新
          emitter.emit('ssxm', 'refresh')
        }
      }
    })
  } else {
    ElMessage.error('请先填写项目实施确认表')
  }
}

// 填写确认表
const writeConfirmation = () => {
  executionDialogVisible.value = true
  if (
    !(confirmData.value && Object.keys(confirmData.value).length > 10) &&
    props.detailsData.rejectData
  ) {
    confirmData.value = props.detailsData.rejectData
  }
}

const closeDialog = () => {
  emit('closeDialogClick')
}

// 关闭结束转实施
const closePermissionDialog = () => {
  executionDialogVisible.value = false
}

// 重置表单
const resetForm = () => {
  if (!formRef.value) return
  formRef.value.resetFields()
  formData.value = unref({})
  confirmData.value = unref({})
}

const resetConfirmForm = () => {
  resetForm()
  getByRejectData()
}

// 获取文件名称
const getFileName = (name: any) => {
  if (name.lastIndexOf('/') > -1) {
    return name.slice(name.lastIndexOf('/') + 1)
  } else {
    return ''
  }
}

const getByRejectData = () => {
  nextTick(() => {
    // 获取最后一个元素的下标
    let lastIndex = findLastIndex(
      props.detailsData.pmAuditList,
      (item: any) => item.flag === '1' && item.phase === '3'
    )
    if (lastIndex > -1) {
      formData.value.bidUrl = props.detailsData.pmAuditList[lastIndex].bidUrl //	投标文件地址
      formData.value.bidResultUrl = props.detailsData.pmAuditList[lastIndex].bidResultUrl //投标分析结果地址
      formData.value.saleContractUrl = props.detailsData.pmAuditList[lastIndex].saleContractUrl //	销售合同地址
    } else {
      formData.value.bidUrl = '' //	投标文件地址
      formData.value.bidResultUrl = '' //投标分析结果地址
      formData.value.saleContractUrl = '' //	销售合同地址
    }
  })
}

getByRejectData()
onMounted(() => {
  resetForm()
})
onBeforeMount(() => {
  getByRejectData()
})
defineExpose({
  resetForm,
  resetConfirmForm
})
</script>

<template>
  <div class="execution-warp">
    <!-- 基本信息 -->
    <Segmentation title="项目信息" class="projectDebriefing">
      <template #content>
        <ElRow :gutter="16" style="text-align: center" justify="space-between" class="top-row">
          <ElCol :span="3">
            <P class="name-p"> 项目编号 </P>
            <p class="sub-title" :title="detailsData.itemNumber">
              {{ detailsData.itemNumber || '--' }}
            </p>
          </ElCol>
          <ElCol :span="3">
            <P class="name-p"> 项目名称 </P>
            <p class="sub-title" :title="detailsData.projectTitle">
              {{ detailsData.projectTitle || '--' }}
            </p>
          </ElCol>
          <ElCol :span="3">
            <P class="name-p"> 立项时间 </P>
            <p>
              {{ moment(detailsData.createTime).format('YYYY-MM-DD') || '--' }}
            </p>
          </ElCol>

          <ElCol :span="3">
            <P class="name-p"> 预计合同金额 </P>
            <p>
              {{
                (detailsData.predictContractMoney
                  ? detailsData.predictContractMoney + '万元'
                  : '--') || '--'
              }}
            </p>
          </ElCol>
          <ElCol :span="3">
            <P class="name-p"> 预计签约时间 </P>
            <p>
              {{
                (detailsData.milestoneC
                  ? moment(detailsData.milestoneC).format('YYYY-MM')
                  : '--') || '--'
              }}
            </p>
          </ElCol>
          <ElCol :span="3">
            <P class="name-p"> 当前负责人 </P>
            <p>
              {{ detailsData.principalPersonName ? detailsData.principalPersonName : '--' }}
            </p>
          </ElCol>
          <ElCol :span="3">
            <P class="name-p"> 状态 </P>
            <p>
              {{ getProjectStatusLabel('2', detailsData.status) || '--' }}
            </p>
          </ElCol>
        </ElRow>
      </template>
    </Segmentation>
    <!-- 立项转实施 -->
    <Segmentation title="立项转实施" class="projectDebriefing">
      <template #content>
        <div class="apply-title ml-4 mb-6">
          <Icon class="icon-form mr-1" icon="svg-icon:form" />
          <span>申请</span>
        </div>
        <ElForm
          :model="formData"
          :rules="ruleValidate"
          ref="formRef"
          :label-position="'left'"
          class="apply-audit"
          :label-width="80"
        >
          <ElRow class="apply-title ml-4 mb-6">
            <p class="require pr-4">请填写项目实施确认表</p>
            <el-button type="primary" @click="writeConfirmation">点击填写</el-button>
          </ElRow>
          <ElRow class="apply-title ml-4 mb-6">
            <p class="text-[red]"
              >注：请上传.pdf，.doc，.docx，.png，.jpg，.xls，.xlsx，.zip，.rar格式的文件</p
            >
          </ElRow>
          <!-- 投标文件 -->
          <ElRow class="apply-title ml-4">
            <ElFormItem label="请上传《投标文件》" label-width="200" prop="bidUrl" class="w-full">
              <el-input v-model="formData.bidUrl" v-show="false" type="text" />
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
                  v-model:modelValue="formData.bidUrl"
                  :disabled="false"
                  :limit="2"
                  :fileSize="2 * 1024"
                  :fileType="['pdf', 'doc', 'docx', 'png', 'jpg', 'xls', 'xlsx', 'zip', 'rar']"
                />
              </div>
            </ElFormItem>
          </ElRow>
          <ElRow class="apply-title ml-4">
            <ElFormItem
              label="请上传《投标结果分析》"
              prop="bidResultUrl"
              label-width="200"
              class="w-full"
            >
              <el-input v-model="formData.bidResultUrl" v-show="false" type="text" />
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
                  v-model:modelValue="formData.bidResultUrl"
                  :disabled="false"
                  :limit="2"
                  :fileSize="2 * 1024"
                  :fileType="['pdf', 'doc', 'docx', 'png', 'jpg', 'xls', 'xlsx', 'zip', 'rar']"
                />
              </div>
            </ElFormItem>
          </ElRow>
          <ElRow class="apply-title ml-4">
            <ElFormItem
              label="请上传《销售合同》"
              prop="saleContractUrl"
              label-width="200"
              class="w-full"
            >
              <el-input v-model="formData.saleContractUrl" v-show="false" type="text" />
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
                  v-model:modelValue="formData.saleContractUrl"
                  :disabled="false"
                  :limit="2"
                  :fileSize="2 * 1024"
                  :fileType="['pdf', 'doc', 'docx', 'png', 'jpg', 'xls', 'xlsx', 'zip', 'rar']"
                />
              </div>
            </ElFormItem>
          </ElRow>
        </ElForm>
      </template>
    </Segmentation>

    <div class="flex justify-center pt-6">
      <ElButton type="primary" :loading="sureLoading" @click="submitEvolve"> 确定 </ElButton>
      <ElButton @click="closeDialog">取消</ElButton></div
    >

    <!-- 项目计划确认表 -->
    <Dialog
      width="85%"
      v-model="executionDialogVisible"
      :modal="true"
      :append-to-body="true"
      :maxHeight="'auto'"
      :title="'立项转实施'"
    >
      <ProjectConfirmation
        :detailsData="detailsData"
        :newData="confirmData"
        @close-dialog-click="closePermissionDialog"
        v-model:confirmData="confirmData"
      />
    </Dialog>
  </div>
</template>
<style lang="less" scoped>
.apply-audit {
  padding: 0 10px;
}
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
