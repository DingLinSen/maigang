<!-- 项目管理-实施项目- 实施审批界面-->
<script setup lang="ts">
import moment from 'moment'
import { ref, unref, reactive, nextTick, computed } from 'vue'
import {
  ElButton,
  ElMessage,
  ElRow,
  ElCol,
  ElForm,
  ElFormItem,
  FormRules,
  ElDatePicker,
  ElRadioGroup,
  ElRadio
} from 'element-plus'
import { Dialog } from '@/components/Dialog'
import { propTypes } from '@/utils/propTypes'
import { DrawerWrap } from '@/components/DrawerWrapDetailsSub'
import { Segmentation } from '@/components/Segmentation'
import { useValidator } from '@/hooks/web/useValidator'
import { ImplementData } from '@/api/project/Implement/types'
import { getEstablishApi, changeAuditApi } from '@/api/project/ssxm'
import { ProjectStep } from '@/views/Components/ProjectStep'
import { ImplementForm, EstablishForm } from '../../components'
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
  id: '',
  fileList: '',
  createBy: '',
  createTime: '',
  ownerName: '',
  planContent: '',
  estimatedAmount: undefined,
  createByName: '',
  updateBy: '',
  updateTime: '',
  remark: '',
  filePath: '',
  status: '',
  flag: false,
  pyzxm: null,
  pyspz: null,
  jszz: null,
  jzz: null,
  address: '',
  delFlag: '',
  itemNumber: '',
  lat: '',
  llng: '',
  pmAuditList: [],
  pmProgressList: [],
  principalPersonName: '',
  phase: '',
  projectTitle: '',
  projectType: '',
  province: '',
  year: '',
  roleId: '',
  roleName: '',
  roleKey: '',
  roleSort: null,
  dataScope: '',
  menuCheckStrictly: false,
  deptCheckStrictly: false,
  workflowInstanceId: null,
  menuIds: [],
  deptIds: [],
  permissions: '',
  admin: false,
  predictContractMoney: '',
  bidUrl: '',
  bidResultUrl: '',
  saleContractUrl: ''
})

const auditNewList = ref<any>([])
const implementDialog = ref<any>()
const approvalDialog = ref<any>()

// 表单
const formData = ref<any>({
  status: '1',
  reason: null,
  auditTime: '',
  content: '',
  workflowInstanceId: null
})

// 表单校验
const ruleValidate = reactive<FormRules>({
  reason: [{ required: true, message: '该项为必填项', trigger: 'blur' }],
  auditTime: [{ required: true, message: '该项为必填项', trigger: 'blur' }],
  status: [
    {
      required: true,
      message: '该项为必填项',
      trigger: 'change'
    }
  ]
})

const nowStep = ref<number>(2) // 当前步骤

// 接收所有的步骤
const stepsList = ref<any>([])

// 立项申请表的弹窗
const dialogApprovalVisible = ref(false)
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
const dialogHeight = ref('60vh')
const closeDialog = () => {
  document.getElementsByTagName('body')[0].className = ''
  document.getElementsByTagName('body')[0].style.width = '100%'
  dialogHeight.value = '60vh'
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
      let params: any = {
        pid: detailsData.value.pid,
        flag: '2', // 1 申请 2 审核 3 确认
        status: formData.value.status, // 1 同意 2 驳回
        content: formData.value.status === '1' ? '同意' : '驳回', // 内容
        reason: formData.value.reason // 1 同意 2 驳回
      }
      const res = await changeAuditApi(params)
        .catch(() => {})
        .finally(() => {
          loading.value = false
        })
      console.log(res)
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
  pageTite.value = flag === 'changeAudit' ? '审批' : '审批进程'
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
  const res: any = await getEstablishApi(params)

  if (res && res.data) {
    detailsData.value = res.data
    let approvalData: any = res.data.approval
    implementData.value = res.data.approval
    implementData.value.projectTitle = detailsData.value.projectTitle
    implementData.value.itemNumber = detailsData.value.itemNumber
    implementData.value.projectApprovalTime = approvalData.projectApprovalTime
      ? moment(approvalData.projectApprovalTime).format('YYYY-MM-DD')
      : ''
    implementData.value.salesPerson = approvalData.salesPerson
      ? Number(approvalData.salesPerson)
      : ''
    implementData.value.preSalesPerson = approvalData.preSalesPerson
      ? Number(approvalData.preSalesPerson)
      : ''
    implementData.value.relatedDeptPerson = approvalData.relatedDeptPerson
      ? Number(approvalData.relatedDeptPerson)
      : ''
    detailsData.value.projectTeam =
      detailsData.value.projectTeam && detailsData.value.projectTeam !== ''
        ? getFilterTeam(detailsData.value.projectTeam)
        : [{ name: '', duty: '' }]
    let data = res.data
    stepsList.value = []
    formData.value.bidUrl = ''
    formData.value.bidResultUrl = ''
    formData.value.saleContractUrl = ''
    nextTick(() => {
      // 获取最后一个元素的下标
      let lastIndex = detailsData.value.pmAuditList.findLastIndex(
        (item: any) => item.flag === '1' && item.phase === '3' && item.type === '7'
      )
      formData.value.bidUrl = detailsData.value.pmAuditList[lastIndex].bidUrl //	投标文件地址
      formData.value.bidResultUrl = detailsData.value.pmAuditList[lastIndex].bidResultUrl //投标分析结果地址
      formData.value.saleContractUrl = detailsData.value.pmAuditList[lastIndex].saleContractUrl //	销售合同地址
    })
    // 截取最后一个申请
    let auditLisData: any = detailsData.value.pmAuditList
    // 获取最后一个申请的索引
    let lastIndex = findLastIndex(
      auditLisData,
      (item: any) => item.flag === '1' && item.phase === '3'
    )
    // 截取最后一个申请之后的数据
    auditLisData = auditLisData.slice(lastIndex, auditLisData.length)
    auditNewList.value = auditLisData
    // 遍历进程
    if (auditLisData.length) {
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
          b = '负责人变更审批'
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
          formData.value.content = item.content
          c = '发起了' + detailsData.value.projectTitle + b + '申请 '
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
    }

    // projectManagerName 项目经理
    // salesManagerName 销售经理
    // 转实施审批流程序号 auditSort 1项目经理已确认，2销售经理已确认，3项目经理上级已确认 ，
    // 4销售经理上级已确认， 5项目经理上级已驳回，6销售经理上级已驳回 ,
    // 7 总经理已确认， 8 总经理已驳回',

    // 变更申请 未审批时 ----项目经理发起
    if (res.data.changeSort === '1') {
      stepsList.value.push({
        status: '', // wait、process、finish、error，
        title: data.projectManagerLeaderName,
        content: '项目变更申请，待审批。',
        icon: ''
      })
      stepsList.value.push({
        status: '', // wait、process、finish、error，
        title: '张保国',
        content: '项目变更申请，待审批。',
        icon: ''
      })
    }

    // // 变更申请 未审批时 ----销售经理发起
    if (data.changeSort === '2') {
      stepsList.value.push({
        status: '', // wait、process、finish、error，
        title: data.salesManagerLeaderName,
        content: '项目变更申请，待审批。',
        icon: ''
      })
      stepsList.value.push({
        status: '', // wait、process、finish、error，
        title: '张保国',
        content: '项目变更申请，待审批。',
        icon: ''
      })
    }
    // // 变更申请 未审批时 ----上级负责人已确认
    if (data.changeSort === '3' || data.changeSort === '4') {
      stepsList.value.push({
        status: '', // wait、process、finish、error，
        title: '张保国',
        content: '项目变更申请，待审批。',
        icon: ''
      })
    }

    res.data.milestoneList?.forEach((item) => {
      let b = ''
      if (item.type === '1') {
        b = '里程碑1'
      } else if (item.type === '2') {
        b = '里程碑2'
      } else if (item.type === '3') {
        b = '里程碑3'
      }

      let c = ''
      if (item.flag === '0') {
        c = '发起' + detailsData.value.projectTitle + b + '申请'
      } else if (item.flag === '1') {
        if (!item.status && item.status !== '') {
          c = '待审批'
        } else {
          c =
            item.createByName +
            (item.status == 2 ? '同意了' : '驳回了') +
            detailsData.value.projectTitle +
            b +
            '申请' +
            '，建议/理由：' +
            (item.reason ? item.reason : '--')
        }
      }
    })

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

    // 0培育审批中，1进展中，2结束转立项审批中，3结束转立项，4结束终止审批中，5结束终止
    // stepsList
  }
}

// 拆分显示项目组成员职责
const getFilterTeam = (str: any) => {
  console.log(str)
  let teamList: any = []
  str.split(',').forEach((item: any) => {
    teamList.push({ name: item.split('：')[0], duty: item.split('：')[1] })
  })
  return teamList
}
const implementData = ref<any>({})
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

const toImplement = () => {
  dialogApprovalVisible.value = true
}

const dialogStyle = computed(() => {
  return {
    height: unref(dialogHeight)
  }
})

const toggleFull = (isFull: boolean) => {
  if (isFull) {
    dialogHeight.value = '100%'
  } else {
    dialogHeight.value = '60vh'
  }
}

defineExpose({
  isShow,
  openDrawer
})
</script>

<template>
  <DrawerWrap :title="pageTite" :isShow="isShow" ref="drawerWrap">
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
                <el-form-item label="合同签订日期：">
                  <p class="ellipsis-p-class">{{
                    detailsData.contractSignDate
                      ? moment(detailsData.contractSignDate).format('YYYY-MM-DD')
                      : '--'
                  }}</p>
                </el-form-item>
              </ElCol>
              <ElCol :span="6">
                <el-form-item label="合同金额：">
                  <p class="ellipsis-p-class">{{
                    detailsData.contractMoney ? detailsData.contractMoney + '万元' : '--'
                  }}</p>
                </el-form-item>
              </ElCol>
              <ElCol :span="6">
                <el-form-item label="预计验收日期：">
                  <p class="ellipsis-p-class">{{
                    detailsData.predictAcceptDate
                      ? moment(detailsData.predictAcceptDate).format('YYYY-MM')
                      : '--'
                  }}</p></el-form-item
                >
              </ElCol>
              <ElCol :span="6">
                <el-form-item label="预计回款日期："
                  ><p class="ellipsis-p-class">{{
                    detailsData.predictPaymentDate
                      ? moment(detailsData.predictPaymentDate).format('YYYY-MM')
                      : '--'
                  }}</p></el-form-item
                >
              </ElCol>
              <ElCol :span="6">
                <el-form-item label="项目经理："
                  ><p class="ellipsis-p-class">{{
                    detailsData.projectManagerName ? detailsData.projectManagerName : '--'
                  }}</p></el-form-item
                >
              </ElCol>
              <ElCol :span="6">
                <el-form-item label="销售经理："
                  ><p class="ellipsis-p-class">{{
                    detailsData.salesManagerName ? detailsData.salesManagerName : '--'
                  }}</p></el-form-item
                >
              </ElCol>
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
                        : detailsData.status === '3'
                        ? 'info'
                        : detailsData.status === '4' || detailsData.status === '6'
                        ? 'warning'
                        : detailsData.status === '5'
                        ? 'danger'
                        : 'danger'
                    "
                  >
                    <!-- 0培育审批中，1进展中，2结束转立项审批中，3结束转立项，4结束终止审批中，5结束终止 -->
                    {{ getProjectStatusLabel('3', detailsData.status) || '--' }}
                  </el-tag>
                </el-form-item>
              </ElCol>
            </ElRow>
          </ElForm>
        </template>
      </Segmentation>
      <div v-if="isFlag !== 'change'">
        <Segmentation title="申请信息">
          <template #content>
            <div class="draw-wrap">
              <p class="apply-info-p"
                >申请
                <span style="font-weight: 600">{{
                  nameOverflow(detailsData.projectTitle, 30)
                }}</span>
                项目变更。</p
              >
              <div class="apply-wrap">
                <p class="apply-content-p">
                  内容：申请 {{ detailsData.projectTitle }} 项目变更，{{
                    formData.content
                  }}，附件：<span></span>
                  <span class="file-name" @click="checkApply">查看《项目实施确认表》</span>
                  <span v-if="formData.bidUrl">
                    <ElLink
                      v-if="
                        fileNext(formData.bidUrl) === 'doc' ||
                        fileNext(formData.bidUrl) === 'zip' ||
                        fileNext(formData.bidUrl) === 'rar' ||
                        fileNext(formData.bidUrl) === 'xls'
                      "
                      :href="`${formData.bidUrl}`"
                      :underline="false"
                      target="_blank"
                    >
                      <p style="cursor: pointer; color: rgb(0, 160, 233)"> 、《投标文件》 </p>
                    </ElLink>
                    <ElLink v-else :underline="false" target="_blank">
                      <p
                        style="cursor: pointer; color: rgb(0, 160, 233)"
                        @click="previewFile(formData.bidUrl, formData.bidUrl)"
                      >
                        、《投标文件》</p
                      >
                    </ElLink> </span
                  ><span
                    v-if="detailsData.pmApprovalAuditDO && detailsData.pmApprovalAuditDO.bidReason"
                    >、无《投标文件》原因：{{ detailsData.pmApprovalAuditDO.bidReason }}</span
                  >
                  <span v-if="formData.bidResultUrl">
                    <ElLink
                      v-if="
                        fileNext(formData.bidResultUrl) === 'doc' ||
                        fileNext(formData.bidResultUrl) === 'zip' ||
                        fileNext(formData.bidResultUrl) === 'rar' ||
                        fileNext(formData.bidResultUrl) === 'xls'
                      "
                      :href="`${formData.bidResultUrl}`"
                      :underline="false"
                      target="_blank"
                    >
                      <p style="cursor: pointer; color: rgb(0, 160, 233)"> 、《投标结果分析》 </p>
                    </ElLink>
                    <ElLink v-else :underline="false" target="_blank">
                      <p
                        style="cursor: pointer; color: rgb(0, 160, 233)"
                        @click="previewFile(formData.bidResultUrl, formData.bidResultUrl)"
                      >
                        、《投标结果分析》</p
                      >
                    </ElLink> </span
                  ><span
                    v-if="
                      detailsData.pmApprovalAuditDO && detailsData.pmApprovalAuditDO.bidResultReason
                    "
                    >、无《投标结果分析》原因：{{
                      detailsData.pmApprovalAuditDO.bidResultReason
                    }}</span
                  >
                  <span v-if="formData.saleContractUrl">
                    <ElLink
                      v-if="
                        fileNext(formData.saleContractUrl) === 'doc' ||
                        fileNext(formData.saleContractUrl) === 'zip' ||
                        fileNext(formData.saleContractUrl) === 'rar' ||
                        fileNext(formData.saleContractUrl) === 'xls'
                      "
                      :href="`${formData.saleContractUrl}`"
                      :underline="false"
                      target="_blank"
                    >
                      <p style="cursor: pointer; color: rgb(0, 160, 233)"> 、《销售合同》 </p>
                    </ElLink>
                    <ElLink v-else :underline="false" target="_blank">
                      <p
                        style="cursor: pointer; color: rgb(0, 160, 233)"
                        @click="previewFile(formData.saleContractUrl, formData.saleContractUrl)"
                      >
                        、《销售合同》</p
                      >
                    </ElLink> </span
                  ><span
                    v-if="
                      detailsData.pmApprovalAuditDO &&
                      detailsData.pmApprovalAuditDO.salesContractReason
                    "
                    >、无《销售合同》原因：{{
                      detailsData.pmApprovalAuditDO.salesContractReason
                    }}</span
                  >
                </p>
                <p>
                  附件：<span class="file-name" @click="toImplement">查看《立项申请表》</span>
                </p>
                <p style="color: #666666">
                  申请人：{{
                    auditNewList.length ? auditNewList[0].createByName : '--' || '--'
                  }}
                  &nbsp; 申请时间：{{ detailsData.auditTime || detailsData.createTime || '--' }}
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
          <div class="form-wrap" v-if="isFlag !== 'change'">
            <ElForm
              :model="formData"
              :rules="ruleValidate"
              ref="formRef"
              class="apply-audit"
              :label-width="80"
            >
              <!-- 0同意，1驳回 -->
              <ElFormItem label="是否同意" prop="status">
                <ElRadioGroup v-model="formData.status">
                  <ElRadio label="1">同意</ElRadio> <ElRadio label="2">驳回</ElRadio>
                </ElRadioGroup>
              </ElFormItem>
              <ElFormItem
                label="建议/理由"
                prop="reason"
                v-if="formData.status == '2'"
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
              <ElFormItem label="建议/理由" prop="reason" v-else :required="false">
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
          <div v-if="isFlag !== 'change'" class="line-class"></div>
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
    v-model="dialogApprovalVisible"
    width="85%"
    append-to-body
    ref="approvalDialog"
    title="立项申请表"
    @closed="closeDialog"
    :maxHeight="'auto'"
    @toggle-full="toggleFull"
  >
    <ImplementForm :style="dialogStyle" :detailsData="implementData" :border="false" />
  </Dialog>
  <Dialog
    width="85%"
    append-to-body
    v-model="dialogImplementVisible"
    :maxHeight="'auto'"
    ref="implementDialog"
    title="项目实施确认表"
    @closed="closeDialog"
    @toggle-full="toggleFull"
  >
    <EstablishForm :style="dialogStyle" :detailsData="detailsData" :border="false" />
  </Dialog>
</template>

<style lang="less" scoped>
.apply-content-p {
  line-height: 36px;
  color: #666666;
}
.apply-info-p {
  padding: 0 10px;
  line-height: 36px;
}
.apply-audit {
  padding: 0px 10px;
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
    // padding-bottom: 10px;

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
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>
