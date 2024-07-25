<!-- 项目管理-售后项目- 实施审批界面-->
<script setup lang="ts">
import moment from 'moment'
import { ref, unref, reactive, nextTick } from 'vue'
import { ElButton, ElMessage, FormRules, ElLink } from 'element-plus'
import { Dialog } from '@/components/Dialog'
import { propTypes } from '@/utils/propTypes'
import { ProjectStep } from '@/views/Components/ProjectStep'
import { DrawerWrap } from '@/components/DrawerWrapDetailsSub'
import { Segmentation } from '@/components/Segmentation'
import { useValidator } from '@/hooks/web/useValidator'
import {
  getAfterSalesApi,
  auditProjectApi,
  changePrincipalPersonAuditApi,
  endProjectAuditApi
} from '@/api/project/afterSales'
import { AfterSalesPlanForm } from '../../components'
import FilePreview from '@/views/Components/FilePreview/FilePreview.vue'
import { useCache } from '@/hooks/web/useCache'
import { getProjectStatusLabel } from '../../config/config'

const { wsCache } = useCache()
const loginUserName = ref<string>(wsCache.get('userInfo').nickName)

// 导入表单校验
const { required } = useValidator()

const emit = defineEmits(['changeGetDetailAndList'])

// 父组件传递数据
const props = defineProps({
  title: propTypes.string.def(''),
  isAction: propTypes.string.def('')
})

let detailsData = ref<any>({
  acceptDate: '', //验收时间
  afterSaleDate: '', //售后期限
  afterSaleDeadline: '', //售后截止日期
  afterSalePerson: '', //售后负责人
  afterSalePersonName: '', //售后负责人
  afterSalePlan: '', //售后服务计划
  afterSalePurpose: '', //售后服务目的
  afterSaleRequire: '', //售后服务要求
  afterSaleType: '', //售后服务类型 1本部门 2 研发中心
  audit: false, //
  auditSort: '', //转售后审批流程序号 0 未审批 1销售经理上级已审批 2销售经理上级驳回 3 总经理已审批 4总经理驳回
  beginTime: '', //
  createBy: '',
  createTime: '',
  endTime: '',
  finalDate: '', //	尾款时间
  finalMoney: '', //	尾款金额
  id: '',
  itemNumber: '',
  leaders: '',
  ownerName: '', //	用户名称
  params: null,
  paymentDate: '', //回款时间
  paymentFilePath: '',
  paymentMoney: '', //回款金额
  paymentRate: '', //已回款比例
  phase: '',
  pid: '',
  pmAuditList: [],
  pmProgressList: [],
  pollingDate: '', //巡检开始时间
  pollingDateType: '', //巡检时间 1 每周 2 每月 3 每季度 4 每年
  projectAffiliation: '', //项目属性1直签、2转签
  projectTitle: '',
  projectType: '',
  remark: '',
  salesManager: '', //销售经理
  salesManagerLeader: '', //销售经理
  salesManagerLeaderName: '', //销售经理
  salesManagerName: '', //销售经理
  status: '', //1实施转售后审批中，2售后中，3项目结束，4项目结束审批中
  updateBy: '', //
  updateTime: '', //
  year: null
})

const auditNewList = ref<any>([])
const implementDialog = ref<any>()

// 表单
const formData = ref<any>({
  status: '1',
  reason: null,
  auditTime: '',
  workflowInstanceId: null
})

// 表单校验
const ruleValidate = reactive<FormRules>({
  reason: [{ required: true, message: '该项为必填项', trigger: 'blur' }],
  auditTime: [{ required: true, message: '该项为必填项', trigger: 'blur' }],
  status: [{ required: true, message: '该项为必填项', trigger: 'change' }]
})

const nowStep = ref<number>(2) // 当前步骤

// 接收所有的步骤
const stepsList = ref<any>([])

// 项目实施确认表的弹窗
const dialogImplementVisible = ref(false)

// 弹窗名称
const dialogTitle = ref<string>('')
// 获取文件名后缀
const fileNext = (path: any) => {
  let extension = ''
  if (path) {
    extension = path.substring(path.lastIndexOf('.') + 1)
  }
  return extension
}
// 获取文件名称
const getFileName = (name: string | string[]) => {
  if (name && name.lastIndexOf('/') > -1) {
    return name.slice(name.lastIndexOf('/') + 1)
  } else {
    return ''
  }
}
// 弹窗关闭
const closeDialog = () => {
  document.getElementsByTagName('body')[0].className = ''
  document.getElementsByTagName('body')[0].style.width = '100%'
}

const formRef = ref<any>()

const isShow = ref<boolean>(false)

const loading = ref(false)
//保存数据
const save = async () => {
  //表单验证
  await formRef.value?.validate(async (isValid) => {
    if (isValid) {
      loading.value = true
      if (detailsData.value.status == '5') {
        let params: any = {
          pid: detailsData.value.pid,
          status: formData.value.status, // 1 同意 2 驳回
          reason: formData.value.reason
        }
        const res = await changePrincipalPersonAuditApi(params)
          .catch(() => {})
          .finally(() => {
            setTimeout(() => {
              loading.value = false
            }, 200)
          })
        if (res && res.code === '00000') {
          formRef.value?.resetFields()
          formData.value.reason = null
          ElMessage.success('保存信息成功')
          emit('changeGetDetailAndList')
          closeDrawer()
        } else {
          emit('changeGetDetailAndList')
        }
      } else if (detailsData.value.status == '4') {
        let params: any = {
          pid: detailsData.value.pid,
          flag: '2', // 1 申请 2 审核 3 确认
          status: formData.value.status, // 1 同意 2 驳回
          content: formData.value.status === '1' ? '同意' : '驳回', // 内容
          reason: formData.value.reason // 1 同意 2 驳回
        }
        const res = await endProjectAuditApi(params)
          .catch(() => {})
          .finally(() => {
            setTimeout(() => {
              loading.value = false
            }, 200)
          })
        if (res && res.code === '00000') {
          formRef.value?.resetFields()
          formData.value.reason = null
          ElMessage.success('保存信息成功')
          emit('changeGetDetailAndList')
          closeDrawer()
        } else {
          emit('changeGetDetailAndList')
        }
      } else {
        let params: any = {
          pid: detailsData.value.pid,
          flag: '2', // 1 申请 2 审核 3 确认
          status: formData.value.status, // 1 同意 2 驳回
          content: formData.value.status === '1' ? '同意' : '驳回', // 内容
          reason: formData.value.reason // 1 同意 2 驳回
        }
        const res = await auditProjectApi(params)
          .catch(() => {})
          .finally(() => {
            setTimeout(() => {
              loading.value = false
            }, 200)
          })
        if (res && res.code === '00000') {
          formRef.value?.resetFields()
          ElMessage.success('保存信息成功')
          formData.value.reason = null
          emit('changeGetDetailAndList')
          closeDrawer()
        } else {
          emit('changeGetDetailAndList')
        }
      }
    }
  })
}

const pageTite = ref<string>('')
const isFlag = ref<string>('')
const drawerWrap = ref<any>()
const detailsId = ref<string>('')

//打开drawer并初始化
const openDrawer = (flag: string, id: string) => {
  //重置表单
  detailsId.value = ''
  formRef.value?.resetFields()
  formData.value.reason = null
  isFlag.value = flag

  pageTite.value = flag === 'audit' ? '审批' : '审批进程'
  drawerWrap.value.isShow = true
  if (id) {
    getDetailsData(id)
  }
}

//关闭drawer
const closeDrawer = () => {
  drawerWrap.value.isShow = false
}
// 从最后一个开始查找符合条件的索引
const findLastIndex = (array: any, cb) => {
  if (!Array.isArray(array)) {
    return -1
  }
  if (array.length === 0) {
    return -1
  }
  for (var i = array.length - 1; i >= 0; i--) {
    const item = array[i]
    if (cb.call(null, item, i, array)) {
      return i
    }
  }
  return -1
}
const changeContent = ref('')

//获取详情
const getDetailsData = async (id: string) => {
  detailsId.value = id
  let params = {
    id: id
  }

  // type '审批类型(1 培育审批 2 项目终止审批 3 立项审批 4 里程碑审批
  // 5 项目状态变更审批 6 负责人变更审批 7 实施审批 8 实施变更审批 9 售后审批 10 售后结束审批 -1 里程碑1 -2 里程碑2 -3 里程碑3)',
  // phase 阶段 1培育 2立项 3实施 4售后',
  // flag 记录类型(1申请 2审核 3 确认
  const res: any = await getAfterSalesApi(params)

  if (res && res.data) {
    detailsData.value = res.data
    let data = res.data
    changeContent.value = ''
    stepsList.value = []

    // 截取最后一个申请
    let auditLisData = res.data.pmAuditList

    // 获取最后一个申请的索引
    let lastIndex = findLastIndex(
      auditLisData,
      (item: any) => item.flag === '1' && item.phase === '4'
    )
    // 截取最后一个申请之后的数据
    auditLisData = auditLisData.slice(lastIndex, auditLisData.length)
    auditNewList.value = auditLisData
    // 遍历进程
    auditLisData.forEach((item: any) => {
      var b = ''
      if (item.type === '1') {
        b = '培育审批'
      } else if (item.type === '2') {
        b = '项目终止审批'
      } else if (item.type === '3') {
        b = '立项审批'
      } else if (item.type === '4') {
        b = '里程碑审批'
      } else if (item.type === '5') {
        b = '项目状态变更审批'
      } else if (item.type === '6') {
        b = '销售经理变更审批'
        changeContent.value = item.content ? item.content : ''
      } else if (item.type === '7') {
        b = '实施审批'
      } else if (item.type === '8') {
        b = '实施变更审批'
      } else if (item.type === '9') {
        b = '售后审批'
      } else if (item.type === '10') {
        b = '售后结束审批'
      } else if (item.type === '-1') {
        b = '里程碑1'
      } else if (item.type === '-2') {
        b = '里程碑2'
      } else if (item.type === '-3') {
        b = '里程碑3'
      }

      var c = ''
      // 申请
      if (item.flag === '1') {
        c = '发起了' + detailsData.value.projectTitle + b + '申请'
      } else if (item.flag === '2') {
        // 审核
        if (!item.status && item.status !== '') {
          c = '待审批'
        } else {
          if (item.phase === '1') {
            c =
              item.createByName +
              (item.status === '1' ? '同意了' : '驳回了') +
              detailsData.value.projectTitle +
              b +
              '申请' +
              '，建议/理由：' +
              (item.reason ? item.reason : '--')
          } else if (item.phase === '2') {
            c =
              item.createByName +
              (item.status === '1' ? '同意了' : '驳回了') +
              detailsData.value.projectTitle +
              b +
              '申请' +
              '，建议/理由：' +
              (item.reason ? item.reason : '--')
          } else if (item.phase === '3') {
            c =
              item.createByName +
              (item.status === '1' ? '同意了' : '驳回了') +
              detailsData.value.projectTitle +
              b +
              '申请' +
              '，建议/理由：' +
              (item.reason ? item.reason : '--')
          } else if (item.phase === '4') {
            c =
              item.createByName +
              (item.status === '1' ? '同意了' : '驳回了') +
              detailsData.value.projectTitle +
              b +
              '申请' +
              '，建议/理由：' +
              (item.reason ? item.reason : '--')
          }
        }
      } else if (item.flag === '3') {
        // 确认
        if (item.phase === '1') {
          c =
            item.createByName +
            (item.status === '1' ? '同意了' : '驳回了') +
            detailsData.value.projectTitle +
            b +
            '申请' +
            '，建议/理由：' +
            (item.reason ? item.reason : '--')
        } else if (item.phase === '2') {
          c =
            item.createByName +
            (item.status === '1' ? '同意了' : '驳回了') +
            detailsData.value.projectTitle +
            b +
            '申请' +
            '，建议/理由：' +
            (item.reason ? item.reason : '--')
        } else if (item.phase === '3') {
          c = '结束转实施申请，已补充。'
        }
      }

      stepsList.value.push({
        status: '', // wait、process、finish、error，
        title: item.auditDate ? item.createByName + ' ' + item.auditDate : item.createByName,
        content: c,
        icon: ''
      })
    })
    if (detailsData.value.file) {
      formData.value.photoFilePath = detailsData.value.file.photoFilePath //实施照片url
      formData.value.acceptFilePath = detailsData.value.file.acceptFilePath //验收材料url
      formData.value.acceptReportFilePath = detailsData.value.file.acceptReportFilePath //	验收报告url
      formData.value.paymentFilePath = detailsData.value.file.paymentFilePath //	回款记录url
      formData.value.endPaymentPath = detailsData.value.file.endPaymentPath //	尾款汇款记录url
    }
    // projectManagerName 项目经理
    // salesManagerName 销售经理
    // 转售后审批流程序号 auditSort 转售后审批流程序号 0 未审批 1销售经理上级已审批 2销售经理上级驳回 3 总经理已审批 4总经理驳回
    if (detailsData.value.status == '1') {
      if (res.data.auditSort === '0' || !res.data.auditSort) {
        stepsList.value.push({
          status: '', // wait、process、finish、error，
          title: data.salesManagerLeaderName,
          content: '售后申请，待审批。',
          icon: ''
        })
        if (data.salesManagerLeaderName !== '张保国') {
          stepsList.value.push({
            status: '', // wait、process、finish、error，
            title: '张保国',
            content: '售后申请，待审批。',
            icon: ''
          })
        }
      }
      // 销售经理上级已审批
      if (data.auditSort === '1') {
        stepsList.value.push({
          status: '', // wait、process、finish、error，
          title: '张保国',
          content: '售后申请，待审批。',
          icon: ''
        })
      }
    } else if (detailsData.value.status == '5') {
      stepsList.value.push({
        status: '', // wait、process、finish、error，
        title: detailsData.value.salesManagerLeaderName,
        content: '销售经理变更审批申请，待审批。',
        icon: ''
      })
    } else if (detailsData.value.status == '4') {
      if (res.data.auditSort === '3' || !res.data.auditSort) {
        stepsList.value.push({
          status: '', // wait、process、finish、error，
          title: data.salesManagerLeaderName,
          content: '售后结束申请，待审批。',
          icon: ''
        })
      }
    }
    // 判断进度是否是审批状态
    // 获取最后一个元素的下标

    nowStep.value =
      auditLisData.filter((item: any) => {
        if (item.flag === '2' && !item.status) {
          return
        } else {
          return item
        }
      }).length - 1
  }
}

// 展开收齐申请表
const checkApply = () => {
  implementDialog.value.isFullscreen = false
  dialogImplementVisible.value = true
}

// 超出显示...
const nameOverflow = (name: string, length: number) => {
  let nextName = ''
  if (name && name.length) {
    if (name.length > length) {
      nextName = name.slice(0, length) + '...'
    } else {
      nextName = name
    }
  } else {
    nextName = ''
  }
  return nextName
}

// 预览弹窗
const previewFile = (fileName: string, path: string) => {
  FilePreviewRef.value.openDialog(fileName, path)
}
const FilePreviewRef = ref()

const getAfterSalePersonName = () => {
  let userName = '--'
  if (detailsData.value.afterSaleType === '1') {
    userName = detailsData.value.salesManagerName
  } else {
    if (detailsData.value.afterSalePersonName) {
      userName = detailsData.value.afterSalePersonName
    } else {
      userName = '售后技术服务组'
    }
  }
  return userName
}

const closeDrawerWrap = () => {}

defineExpose({
  isShow,
  openDrawer
})
</script>

<template>
  <DrawerWrap
    :title="pageTite"
    :isShow="isShow"
    ref="drawerWrap"
    @closeDrawerWrap="closeDrawerWrap"
  >
    <!-- 内容区域 -->
    <template #content>
      <Segmentation title="项目信息">
        <template #content>
          <ElForm :model="detailsData" class="top-row">
            <ElRow :gutter="16" style="text-align: center" justify="space-between">
              <ElCol :span="6">
                <el-form-item label="项目编号：">
                  {{ detailsData.itemNumber || '--' }}</el-form-item
                >
              </ElCol>
              <ElCol :span="6">
                <el-form-item label="项目名称：">
                  <p :title="detailsData.projectTitle" class="ellipsis-p-class">{{
                    detailsData.projectTitle || '--'
                  }}</p>
                </el-form-item>
              </ElCol>
              <ElCol :span="6">
                <el-form-item label="用户名称：">
                  <p class="ellipsis-p-class" :title="detailsData.ownerName">{{
                    detailsData.ownerName || '--'
                  }}</p>
                </el-form-item>
              </ElCol>
              <ElCol :span="6">
                <el-form-item label="售后期限：">
                  <p class="ellipsis-p-class">{{ detailsData.afterSaleDate || '--' }}</p>
                </el-form-item>
              </ElCol>
              <ElCol :span="6">
                <el-form-item label="售后截至日期：">
                  <p class="ellipsis-p-class">
                    {{
                      detailsData.afterSaleDeadline
                        ? moment(detailsData.afterSaleDeadline).format('YYYY-MM-DD')
                        : '--'
                    }}
                  </p></el-form-item
                >
              </ElCol>
              <ElCol :span="6">
                <el-form-item label="巡检开始时间："
                  ><p class="ellipsis-p-class">
                    {{
                      detailsData.pollingDate
                        ? moment(detailsData.pollingDate).format('YYYY-MM-DD')
                        : '--'
                    }}</p
                  ></el-form-item
                >
              </ElCol>
              <ElCol :span="6">
                <el-form-item label="售后负责人："
                  ><p class="ellipsis-p-class"> {{ getAfterSalePersonName() }}</p></el-form-item
                ></ElCol
              >
              <ElCol :span="6">
                <el-form-item label="状态：">
                  <el-tag
                    class="mt-1"
                    :type="
                      detailsData.status === '0'
                        ? 'success'
                        : detailsData.status === '1'
                        ? 'primary'
                        : detailsData.status === '2'
                        ? 'success'
                        : detailsData.status === '3' || detailsData.status === '6'
                        ? 'info'
                        : detailsData.status === '4'
                        ? 'warning'
                        : 'danger'
                    "
                  >
                    {{ getProjectStatusLabel('4', detailsData.status) || '--' }}
                  </el-tag>
                </el-form-item>
              </ElCol>
            </ElRow>
          </ElForm>
        </template>
      </Segmentation>

      <div v-if="isFlag !== 'process'">
        <Segmentation title="申请信息">
          <template #content>
            <div class="draw-wrap">
              <p class="title-p" v-if="detailsData.status === '1'"
                >申请
                <span style="font-weight: 600">{{
                  nameOverflow(detailsData.projectTitle, 30)
                }}</span>
                项目实施转售后。</p
              >
              <p class="title-p" v-if="detailsData.status === '5'"
                >申请
                <span style="font-weight: 600">{{
                  nameOverflow(detailsData.projectTitle, 30)
                }}</span>
                销售经理变更。</p
              >
              <p class="title-p" v-if="detailsData.status === '4'"
                >申请
                <span style="font-weight: 600">{{
                  nameOverflow(detailsData.projectTitle, 30)
                }}</span>
                项目结束。</p
              >
              <div class="apply-wrap" v-if="detailsData.status === '1'">
                <p class="content-p">
                  内容：申请 {{ detailsData.projectTitle }} 项目实施转售后，附件：<span></span>
                  <span class="file-name" @click="checkApply">查看《售后服务计划》</span>
                  <span v-if="formData.photoFilePath">
                    <ElLink
                      v-if="
                        fileNext(formData.photoFilePath) === 'doc' ||
                        fileNext(formData.photoFilePath) === 'zip' ||
                        fileNext(formData.photoFilePath) === 'rar' ||
                        fileNext(formData.photoFilePath) === 'xls'
                      "
                      :underline="false"
                      target="_blank"
                      :href="`${formData.photoFilePath}`"
                    >
                      <p style="cursor: pointer; color: rgb(0, 160, 233)"> 、《项目实施照片》 </p>
                    </ElLink>
                    <ElLink v-else :underline="false" target="_blank">
                      <p
                        style="cursor: pointer; color: rgb(0, 160, 233)"
                        @click="previewFile(formData.photoFilePath, formData.photoFilePath)"
                      >
                        、《项目实施照片》</p
                      >
                    </ElLink>
                  </span>
                  <span
                    v-if="
                      detailsData.pmApprovalAuditDO && detailsData.pmApprovalAuditDO.photoFileReason
                    "
                    >、无《项目实施照片》原因：{{
                      detailsData.pmApprovalAuditDO.photoFileReason
                    }}</span
                  >
                  <span v-if="formData.acceptFilePath">
                    <ElLink
                      v-if="
                        fileNext(formData.acceptFilePath) === 'doc' ||
                        fileNext(formData.acceptFilePath) === 'zip' ||
                        fileNext(formData.acceptFilePath) === 'rar' ||
                        fileNext(formData.acceptFilePath) === 'xls'
                      "
                      :underline="false"
                      target="_blank"
                      :href="`${formData.acceptFilePath}`"
                    >
                      <p style="cursor: pointer; color: rgb(0, 160, 233)"> 、《验收材料》 </p>
                    </ElLink>
                    <ElLink v-else :underline="false" target="_blank">
                      <p
                        style="cursor: pointer; color: rgb(0, 160, 233)"
                        @click="previewFile(formData.acceptFilePath, formData.acceptFilePath)"
                      >
                        、《验收材料》</p
                      >
                    </ElLink>
                  </span>
                  <span
                    v-if="
                      detailsData.pmApprovalAuditDO &&
                      detailsData.pmApprovalAuditDO.acceptFileReason
                    "
                    >、无《验收材料》原因：{{
                      detailsData.pmApprovalAuditDO.acceptFileReason
                    }}</span
                  >
                  <span v-if="formData.acceptReportFilePath">
                    <ElLink
                      v-if="
                        fileNext(formData.acceptReportFilePath) === 'doc' ||
                        fileNext(formData.acceptReportFilePath) === 'zip' ||
                        fileNext(formData.acceptReportFilePath) === 'rar' ||
                        fileNext(formData.acceptReportFilePath) === 'xls'
                      "
                      :underline="false"
                      target="_blank"
                      :href="`${formData.acceptReportFilePath}`"
                    >
                      <p style="cursor: pointer; color: rgb(0, 160, 233)"> 、《验收报告》 </p>
                    </ElLink>
                    <ElLink v-else :underline="false" target="_blank">
                      <p
                        style="cursor: pointer; color: rgb(0, 160, 233)"
                        @click="
                          previewFile(formData.acceptReportFilePath, formData.acceptReportFilePath)
                        "
                      >
                        、《验收报告》</p
                      >
                    </ElLink>
                  </span>
                  <span
                    v-if="
                      detailsData.pmApprovalAuditDO &&
                      detailsData.pmApprovalAuditDO.acceptReportFileReason
                    "
                    >、无《验收报告》原因：{{
                      detailsData.pmApprovalAuditDO.acceptReportFileReason
                    }}</span
                  >
                  <span v-if="formData.paymentFilePath">
                    <ElLink
                      v-if="
                        fileNext(formData.paymentFilePath) === 'doc' ||
                        fileNext(formData.paymentFilePath) === 'zip' ||
                        fileNext(formData.paymentFilePath) === 'rar' ||
                        fileNext(formData.paymentFilePath) === 'xls'
                      "
                      :underline="false"
                      target="_blank"
                      :href="`${formData.paymentFilePath}`"
                    >
                      <p style="cursor: pointer; color: rgb(0, 160, 233)"> 、《回款记录》 </p>
                    </ElLink>
                    <ElLink v-else :underline="false" target="_blank">
                      <p
                        style="cursor: pointer; color: rgb(0, 160, 233)"
                        @click="previewFile(formData.paymentFilePath, formData.paymentFilePath)"
                      >
                        、《回款记录》</p
                      >
                    </ElLink>
                  </span>
                  <span
                    v-if="
                      detailsData.pmApprovalAuditDO &&
                      detailsData.pmApprovalAuditDO.paymentFileReason
                    "
                    >、无《回款记录》原因：{{
                      detailsData.pmApprovalAuditDO.paymentFileReason
                    }}</span
                  >
                </p>
                <p style="color: #666666">
                  申请人：{{
                    auditNewList.length ? auditNewList[0].createByName : '--' || '--'
                  }}
                  &nbsp; 申请时间：{{
                    detailsData.auditTime ||
                    moment(detailsData.auditTime).format('YYYY-MM-DD') ||
                    '--'
                  }}
                </p>
              </div>
              <div v-if="detailsData.status === '5'" class="apply-wrap">
                <p>变更事由：{{ changeContent }}</p>
              </div>
              <div class="apply-wrap" v-if="detailsData.status === '4'">
                <p class="remark-p">
                  备注：{{
                    auditNewList.length
                      ? auditNewList[0].remark
                        ? auditNewList[0].remark
                        : '--'
                      : '--'
                  }}
                </p>
                <p style="color: #666666">
                  申请人：{{
                    auditNewList.length ? auditNewList[0].createByName : '--' || '--'
                  }}
                  &nbsp; 申请时间：{{
                    detailsData.auditTime ||
                    moment(detailsData.auditTime).format('YYYY-MM-DD') ||
                    '--'
                  }}
                </p>
                <p v-if="formData.endPaymentPath">
                  附件：
                  <span>
                    <ElLink
                      v-if="
                        fileNext(formData.endPaymentPath) === 'doc' ||
                        fileNext(formData.endPaymentPath) === 'zip' ||
                        fileNext(formData.endPaymentPath) === 'rar' ||
                        fileNext(formData.endPaymentPath) === 'xls'
                      "
                      :underline="false"
                      target="_blank"
                      :href="`${formData.endPaymentPath}`"
                    >
                      <p style="cursor: pointer; color: rgb(0, 160, 233)"> 《尾款汇款记录》 </p>
                    </ElLink>
                    <ElLink v-else :underline="false" target="_blank">
                      <p
                        style="cursor: pointer; color: rgb(0, 160, 233)"
                        @click="previewFile(formData.endPaymentPath, formData.endPaymentPath)"
                      >
                        《尾款汇款记录》</p
                      >
                    </ElLink>
                  </span>
                </p>
              </div>
            </div>
          </template>
        </Segmentation>
      </div>

      <!--分管负责人审批 -->
      <Segmentation
        :title="loginUserName === '张保国' ? '总经理审批' : '分管负责人审批'"
        :isShowtitle="isFlag !== 'process'"
      >
        <template #content>
          <div class="form-wrap" v-if="isFlag !== 'process'">
            <ElForm
              :model="formData"
              :rules="ruleValidate"
              ref="formRef"
              class="apply-audit"
              :label-width="85"
            >
              <!-- 0同意，1驳回 -->
              <ElFormItem label="是否同意" prop="status" label-width="90">
                <ElRadioGroup v-model="formData.status">
                  <ElRadio label="1">同意</ElRadio> <ElRadio label="2">驳回</ElRadio>
                </ElRadioGroup>
              </ElFormItem>
              <ElFormItem
                v-if="formData.status == '2'"
                label="建议/理由"
                prop="reason"
                label-width="90"
                :required="true"
              >
                <ElInput
                  v-model.trim="formData.reason"
                  type="textarea"
                  :autosize="{ minRows: 3, maxRows: 10 }"
                  placeholder="请输入建议/理由"
                  :maxlength="500"
                />
              </ElFormItem>
              <ElFormItem v-else label="建议/理由" prop="reason" label-width="90" :required="false">
                <ElInput
                  v-model.trim="formData.reason"
                  type="textarea"
                  :autosize="{ minRows: 3, maxRows: 10 }"
                  placeholder="请输入建议/理由"
                  :maxlength="500"
                />
              </ElFormItem>
            </ElForm>
            <div class="flex justify-center items-center mt-26px pb-20px">
              <el-button :loading="loading" class="project-btn-sure" @click="save"> 提交</el-button>
              <el-button class="project-btn-cancel" @click="closeDrawer"> 取消</el-button>
            </div>
          </div>
          <div v-if="isFlag !== 'process'" class="line-class"></div>
          <!-- 步骤条 -->
          <div class="steps-wrap">
            <ProjectStep :steps="stepsList" :active="nowStep" />
          </div>
        </template>
      </Segmentation>
      <FilePreview title="预览" ref="FilePreviewRef" />
    </template>
  </DrawerWrap>
  <Dialog
    width="85%"
    append-to-body
    v-model="dialogImplementVisible"
    :maxHeight="'auto'"
    ref="implementDialog"
    title="售后服务计划"
    @closed="closeDialog"
  >
    <AfterSalesPlanForm :detailsData="detailsData" :border="false" />
  </Dialog>
</template>

<style lang="less" scoped>
.apply-audit{
  padding: 0px 10px;
}
.remark-p {
  line-height: 18px;
  color: #666666;
  width: 100%;
  word-wrap: break-word;
  padding: 9px 0px;
}
.content-p {
  line-height: 36px;
  color: #666666;
}
.title-p {
  padding: 0 10px;
  line-height: 36px;
}
:deep(.el-input-group__append) {
  background-color: white;
  width: 35px;
}

.name-p {
  color: #999999;
}
.sub-title {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}
.top-row {
  margin-left: 25px !important;
  margin-right: 25px !important;
  padding: 0px !important;

  p {
    font-size: 14px !important;
    line-height: 32px;
  }
}
.draw-wrap {
  padding: 0 10px;
  font-size: 14px !important;
  margin-bottom: 15px;
  &:last-child {
    border-bottom: none;
    .apply-wrap {
      border-bottom: none;
    }
  }
  .apply-wrap {
    padding: 0 10px;
    border-bottom: 1px solid rgba(217, 221, 231, 0.8);

    p {
      line-height: 36px;
    }
    .reason-li {
      margin: 0px 0;
      padding: 15px 5px 20px 5px;
      color: #999999;
      p {
        line-height: 34px;
        color: #999999;
      }
      span {
        display: inline-block;
      }
    }
    .apply-info {
      font-size: 14px;
      color: #666666;
      margin: 10px 6px;
      border: 1px solid rgba(217, 221, 231, 0.8);
      padding: 15px 15px;
      border-radius: 4px;
      p {
        display: flex;
        margin: 3px;
      }
      .title-span {
        font-weight: bold;
        min-width: 108px;
        display: inline-block;
        text-align: right;
      }
      div {
        display: flex;
        justify-content: space-between;
        margin-right: 10%;
        p {
          width: 23.5%;
        }
      }
    }
  }
}
.file-name {
  cursor: pointer;
  color: #00a0e9;
  word-wrap: break-word;
}
.form-wrap {
  // border-top: 1px solid rgba(217, 221, 231, 0.8);
  // // margin: 15px 0px;
  // padding: 10px 15px;
  // margin-top: 10px;
}
.steps-wrap {
  margin: 0px 45px 0px 45px;
  padding: 25px 0px;
}

:deep(.el-step__main) {
  width: 100%;
  word-wrap: break-word;
  margin-bottom: 20px;
}
.line-class {
  margin: 0px 45px 0px 45px;
  height: 1px;
  background: #eceef0;
}
.ellipsis-p-class {
  width: 100%;
  white-space: nowrap;
  text-align: left;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
