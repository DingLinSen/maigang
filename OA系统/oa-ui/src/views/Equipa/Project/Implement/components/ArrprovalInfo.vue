<!-- 
  * 项目管理-立项项目-审批界面
 -->
<script setup lang="ts">
import moment from 'moment'
import { ref, unref, reactive } from 'vue'
import { findLastIndex } from '@/utils'
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
  ElRadio,
  ElInput,
  ElSteps,
  ElStep,
  ElTooltip
} from 'element-plus'
import { propTypes } from '@/utils/propTypes'
import { DrawerWrap } from '@/components/DrawerWrapDetailsSub'
import { Segmentation } from '@/components/Segmentation'
import { useEmitt } from '@/hooks/web/useEmitt'
import { useValidator } from '@/hooks/web/useValidator'
import { ImplementData } from '@/api/project/Implement/types'
import {
  getImplementApi,
  changePrincipalPersonAuditApi,
  changeMilestoneAuditApi
} from '@/api/project/Implement'
import { completeWorkflowrApi } from '@/api/workflow' // 处理流程
import { ImplementForm } from '../../components'
import { useCache } from '@/hooks/web/useCache'
import { ProjectStep } from '@/views/Components/ProjectStep'
import FilePreview from '@/views/Components/FilePreview/FilePreview.vue'
import { getProjectStatusLabel } from '../../config/config'

import { useRouter, useRoute } from 'vue-router'
const route = useRoute()
const router = useRouter()

const { wsCache } = useCache()
const loginUserName = ref<string>(wsCache.get('userInfo').nickName)

// 导入表单校验
const { required } = useValidator()

const emit = defineEmits(['changeGetDetail', 'changeGetDetailAndList'])

// 父组件传递数据
const props = defineProps({
  title: propTypes.string.def(''),
  isAction: propTypes.string.def('')
})

const isApplyEnd = ref(false) // 审批培育终止
const showApply = ref(false) // 审批表内容
const isSeeSub = ref(false) // 只能查看不能操作

// 表单
const formData = ref({
  status: '2',
  reason: null,
  auditTime: '',
  workflowInstanceId: null
})

// 表单校验
const ruleValidate = reactive<FormRules>({
  reason: [
    { required: true, message: '该项为必填项', trigger: 'blur' }
    //  { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' }
  ],
  auditTime: [
    { required: true, message: '该项为必填项', trigger: 'blur' }
    //  { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' }
  ],
  status: [
    {
      required: true,
      message: '该项为必填项',
      trigger: 'change'
    }
  ],

  desc: [{ required: true, message: 'Please input activity form', trigger: 'blur' }]
})

const nowStep = ref<number>(2) // 当前步骤

// 接收所有的步骤
const stepsList = ref<any>([])

// 审批日志的弹窗
const dialogVisible = ref(false)

// 弹窗名称
const dialogTitle = ref<string>('')

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

const { emitter } = useEmitt({
  name: 'drawer',
  callback: (type: string) => {
    if (type === 'closed') {
      showApply.value = false
      // resetFormAfterClose()
    }
  }
})

const loading = ref(false)
//保存数据
const save = async () => {
  // //表单验证
  await formRef.value?.validate(async (isValid) => {
    if (isValid) {
      loading.value = true
      if (detailsData.value.status == '10') {
        //里程碑变更审批
        let params: any = {
          pid: detailsData.value.pid,
          status: formData.value.status, // 1 同意 2 驳回
          reason: formData.value.reason,
          principalPerson: detailsData.value.principalPerson
        }
        const res = await changeMilestoneAuditApi(params)
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
      } else if (detailsData.value.status == '9') {
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
      } else {
        let params = {
          variables: {
            status: {
              type: 'Long',
              value: formData.value.status
            },
            reason: {
              type: 'String',
              value: formData.value.reason
            }
          }
        }
        const res = await completeWorkflowrApi(detailsData.value.workflowInstanceId, params)
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

const isSave = ref<boolean>(false)
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
  isSave.value = flag === 'see' || flag === 'process' ? false : true

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

let detailsData = ref<any>({
  id: '',
  pid: '',
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
  milestoneList: [],
  pmAuditList: [],
  pmProgressList: [],
  predictContractMoney: '',
  upPrincipalName: '',
  principalPerson: '',
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
  updateProjectTitle: ''
})

const stateChangeContent = ref<string>('')
const attachmentFile = ref<string>('')
//变更理由
const changeContent = ref<string>('')
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
  const res = await getImplementApi(params)

  if (res && res.data) {
    changeContent.value = ''
    detailsData.value = res.data
    if (res.data.status === '6' || res.data.status === '9' || res.data.status === '10') {
      formData.value.status = '1'
    } else {
      formData.value.status = '2'
    }

    stepsList.value = []
    // 截取最后一个申请
    let auditLisData = res.data.pmAuditList
    // 获取最后一个申请的索引
    let lastIndex = findLastIndex(
      auditLisData,
      (item: any) => item.flag === '1' && item.phase === '2'
    )
    attachmentFile.value = ''
    stateChangeContent.value = ''
    if (lastIndex > -1) {
      if (auditLisData[lastIndex].type === '-1') {
        stateChangeContent.value =
          '里程碑1申请' +
          (auditLisData[lastIndex].content ? '，内容：' + auditLisData[lastIndex].content : '') +
          (auditLisData[lastIndex].remark ? '，备注：' + auditLisData[lastIndex].remark : '')
        let milestoneList = res.data.milestoneList
        let lastIndex0 = findLastIndex(
          milestoneList,
          (item: any) => item.flag === '0' && item.type === '1'
        )
        if (lastIndex > -1) {
          attachmentFile.value = milestoneList[lastIndex0].filePath
        }
      } else if (auditLisData[lastIndex].type === '-2') {
        stateChangeContent.value =
          '里程碑2申请' +
          (auditLisData[lastIndex].content ? '，内容：' + auditLisData[lastIndex].content : '') +
          (auditLisData[lastIndex].remark ? '，备注：' + auditLisData[lastIndex].remark : '')
        let milestoneList = res.data.milestoneList
        let lastIndex0 = findLastIndex(
          milestoneList,
          (item: any) => item.flag === '0' && item.type === '2'
        )
        if (lastIndex > -1) {
          attachmentFile.value = milestoneList[lastIndex0].filePath
        }
      } else if (auditLisData[lastIndex].type === '-3') {
        stateChangeContent.value =
          '里程碑3申请' +
          (auditLisData[lastIndex].content ? '，内容：' + auditLisData[lastIndex].content : '') +
          (auditLisData[lastIndex].remark ? '，备注：' + auditLisData[lastIndex].remark : '')
        let milestoneList = res.data.milestoneList
        let lastIndex0 = findLastIndex(
          milestoneList,
          (item: any) => item.flag === '0' && item.type === '3'
        )
        if (lastIndex > -1) {
          attachmentFile.value = milestoneList[lastIndex0].filePath
        }
      } else if (auditLisData[lastIndex].type === '6') {
        changeContent.value = auditLisData[lastIndex].content
      } else if (auditLisData[lastIndex].type === '13') {
        changeContent.value =
          auditLisData[lastIndex].content +
          (auditLisData[lastIndex].changeMilestoneReason
            ? '，理由：' + auditLisData[lastIndex].changeMilestoneReason
            : '')
      } else {
        stateChangeContent.value =
          auditLisData[lastIndex].content +
          (auditLisData[lastIndex].reason ? '，理由：' + auditLisData[lastIndex].reason : '')
      }
    }

    // 截取最后一个申请之后的数据
    auditLisData = auditLisData.slice(lastIndex, auditLisData.length)
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
      } else if (item.type === '13') {
        b = '里程碑变更审批'
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
        c =
          '发起了' +
          (detailsData.value.updateProjectTitle
            ? detailsData.value.updateProjectTitle
            : detailsData.value.projectTitle) +
          b +
          '申请'
      } else if (item.flag === '2') {
        // 审核
        if (!item.status && item.status !== '') {
          c = '待审批'
        } else {
          if (item.phase === '1') {
            c =
              item.createByName +
              (item.status === '1' ? '同意了' : '驳回了') +
              (detailsData.value.updateProjectTitle
                ? detailsData.value.updateProjectTitle
                : detailsData.value.projectTitle) +
              b +
              '申请' +
              '，建议/理由：' +
              (item.reason ? item.reason : '--')
          } else if (item.phase === '2') {
            c =
              item.createByName +
              (item.status === '1' ? '同意了' : '驳回了') +
              (detailsData.value.updateProjectTitle
                ? detailsData.value.updateProjectTitle
                : detailsData.value.projectTitle) +
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
        }
      }

      stepsList.value.push({
        status: '', // wait、process、finish、error，
        title: item.auditDate ? item.createByName + ' ' + item.auditDate : item.createByName,
        content: c,
        icon: ''
      })
    })

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

      // stepsList.value.push({
      //   status: '', // wait、process、finish、error，
      //   title: item.auditDate ? item.createByName + ' ' + item.auditDate : item.createByName,
      //   content: c,
      //   icon: ''
      // })
    })

    // 判断进度是否是审批状态
    let list: any = res.data.pmAuditList.filter((item: any) => {
      if (item.flag === '2' && !item.status) {
        return
      } else {
        return item
      }
    })

    if (detailsData.value.status == '9' || detailsData.value.status == '10') {
      stepsList.value.push({
        createByName: detailsData.value.upPrincipalName ? detailsData.value.upPrincipalName : '--', // 发起人
        status: '', // wait、process、finish、error，
        title: detailsData.value.upPrincipalName ? detailsData.value.upPrincipalName : '--',
        content: '待审批',
        icon: ''
      })
    }
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
  showApply.value = !showApply.value
}

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

// 获取文件名后缀
const fileNext = (path: any) => {
  let extension = ''
  if (path) {
    extension = path.substring(path.lastIndexOf('.') + 1)
  }
  return extension
}

// 预览弹窗
const previewFile = (fileName: string, path: string) => {
  FilePreviewRef.value.openDialog(fileName, path)
}
const FilePreviewRef = ref()
const closeDrawerWrap = () => {
  // if (route.query.pid) {
  //   router.push({ name: 'Overview' })
  // }
}
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
                  <p
                    :title="
                      detailsData.updateProjectTitle
                        ? detailsData.updateProjectTitle
                        : detailsData.projectTitle
                    "
                    class="ellipsis-p-class"
                    >{{
                      detailsData.updateProjectTitle
                        ? detailsData.updateProjectTitle
                        : detailsData.projectTitle || '--'
                    }}</p
                  >
                </el-form-item>
              </ElCol>
              <ElCol :span="6">
                <el-form-item label="立项时间：">
                  <p class="ellipsis-p-class">{{
                    detailsData.projectApprovalTime
                      ? moment(detailsData.projectApprovalTime).format('YYYY-MM-DD')
                      : '--'
                  }}</p>
                </el-form-item>
              </ElCol>
              <ElCol :span="6">
                <el-form-item label="预计合同金额：">
                  <p class="ellipsis-p-class">{{
                    (detailsData.predictContractMoney
                      ? detailsData.predictContractMoney + '万元'
                      : '--') || '--'
                  }}</p>
                </el-form-item>
              </ElCol>
              <ElCol :span="6">
                <el-form-item label="预计签约时间：">
                  <p class="ellipsis-p-class">{{
                    (detailsData.milestoneC
                      ? moment(detailsData.milestoneC).format('YYYY-MM')
                      : '--') || '--'
                  }}</p></el-form-item
                >
              </ElCol>
              <ElCol :span="6">
                <el-form-item label="当前负责人："
                  ><p class="ellipsis-p-class">
                    {{
                      detailsData.principalPersonName ? detailsData.principalPersonName : '--'
                    }}</p
                  ></el-form-item
                >
              </ElCol>
              <ElCol :span="6">
                <el-form-item label="状态：">
                  <el-tag
                    class="mt-1"
                    :type="
                      detailsData.status === '0'
                        ? 'primary'
                        : detailsData.status === '1'
                        ? 'primary'
                        : detailsData.status === '2'
                        ? 'success'
                        : detailsData.status === '3'
                        ? 'danger'
                        : detailsData.status === '4' || detailsData.status === '8'
                        ? 'success'
                        : detailsData.status === '5'
                        ? 'info'
                        : detailsData.status === '6'
                        ? 'primary'
                        : detailsData.status === '7' || detailsData.status === '10'
                        ? 'warning'
                        : detailsData.status === '9'
                        ? 'warning'
                        : 'danger'
                    "
                    :effect="detailsData.status === '9' ? 'dark' : ''"
                  >
                    <!-- 0培育审批中，1进展中，2结束转立项审批中，3结束转立项，4结束终止审批中，5结束终止 -->
                    {{ getProjectStatusLabel('2', detailsData.status) }}
                  </el-tag>
                </el-form-item>
              </ElCol>
              <ElCol :span="6"></ElCol>
            </ElRow>
          </ElForm>
        </template>
      </Segmentation>
      <div v-if="isFlag !== 'process'">
        <Segmentation title="申请信息">
          <template #content>
            <div class="draw-wrap">
              <p class="apply-info-p"
                >申请
                <span style="font-weight: 600">{{
                  nameOverflow(detailsData.projectTitle, 30)
                }}</span>
                {{
                  detailsData.status === '1'
                    ? '项目立项' +
                      (detailsData.updateProjectTitle
                        ? '，项目名称由 ' +
                          detailsData.projectTitle +
                          ' 改变为 ' +
                          detailsData.updateProjectTitle
                        : '')
                    : detailsData.status === '6'
                    ? '项目状态变更'
                    : detailsData.status === '7'
                    ? '项目里程碑节点'
                    : detailsData.status === '10'
                    ? '项目里程碑变更'
                    : ''
                }}。</p
              >
              <div class="apply-wrap">
                <p class="apply-content-p">
                  查看立项申请表&nbsp;
                  <span style="color: #00a0e9; cursor: pointer" @click="checkApply">{{
                    showApply ? '关闭' : '展开'
                  }}</span>
                </p>
                <ImplementForm v-if="showApply" :detailsData="detailsData" />
              </div>
              <div v-if="detailsData.status === '6'" class="apply-wrap">
                <p>{{ stateChangeContent || '' }}</p>
              </div>

              <div v-if="detailsData.status === '10'" class="apply-wrap">
                <p>{{ changeContent || '' }}</p>
              </div>

              <div v-if="detailsData.status === '9'" class="apply-wrap">
                <p class="apply-content-p">变更事由：{{ changeContent }}</p>
              </div>

              <div v-if="detailsData.status === '7'" class="apply-wrap">
                <p>{{ stateChangeContent || '' }}</p>
                <div v-if="attachmentFile">
                  <p class="apply-content-p">
                    附件：<span>
                      <ElLink
                        v-if="
                          fileNext(attachmentFile) === 'doc' ||
                          fileNext(attachmentFile) === 'zip' ||
                          fileNext(attachmentFile) === 'rar' ||
                          fileNext(attachmentFile) === 'xls'
                        "
                        :href="`${attachmentFile}`"
                        :underline="false"
                        target="_blank"
                      >
                        <p style="cursor: pointer; color: rgb(0, 160, 233)">
                          {{ getFileName(attachmentFile) }}
                        </p>
                      </ElLink>
                      <ElLink v-else :underline="false" target="_blank">
                        <p
                          style="cursor: pointer; color: rgb(0, 160, 233)"
                          @click="previewFile(attachmentFile, attachmentFile)"
                        >
                          {{ getFileName(attachmentFile) }}</p
                        >
                      </ElLink>
                    </span>
                  </p></div
                >
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
              <ElFormItem label="是否同意" prop="status">
                <ElRadioGroup v-model="formData.status">
                  <template v-if="detailsData.status === '1'">
                    <ElRadio label="2">同意</ElRadio>
                    <ElRadio label="1">驳回</ElRadio>
                  </template>
                  <template
                    v-if="
                      detailsData.status === '6' ||
                      detailsData.status === '9' ||
                      detailsData.status === '10'
                    "
                  >
                    <ElRadio label="1">同意</ElRadio>
                    <ElRadio label="2">驳回</ElRadio>
                  </template>
                  <template v-if="detailsData.status === '7'">
                    <ElRadio label="2">同意</ElRadio>
                    <ElRadio label="7">驳回</ElRadio>
                  </template>
                </ElRadioGroup>
              </ElFormItem>
              <ElFormItem
                label="建议/理由"
                prop="reason"
                v-if="
                  (detailsData.status === '1' && formData.status == '1') ||
                  ((detailsData.status === '6' ||
                    detailsData.status === '9' ||
                    detailsData.status === '10') &&
                    formData.status == '2') ||
                  (detailsData.status === '7' && formData.status == '7')
                "
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
              <ElFormItem v-else label="建议/理由" prop="reason" :required="false">
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
</template>

<style lang="less" scoped>
.apply-content-p {
  line-height: 36px;
  color: #666666;
}
.apply-audit {
  padding: 0px 10px;
}
.apply-info-p {
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
      word-break: break-word;
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
.form-wrap {
  // border-top: 1px solid rgba(217, 221, 231, 0.8);
  // margin: 15px 0px;
  // padding: 10px 15px;
  // margin-top: 10px;
}
.steps-wrap {
  margin: 0px 45px 0px 45px;
  padding: 25px 0px;
  // border-top: 1px solid rgba(217, 221, 231, 0.8);
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
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
