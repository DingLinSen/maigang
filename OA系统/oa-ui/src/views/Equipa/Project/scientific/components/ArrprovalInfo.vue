<!--
  * 项目管理-科研项目-审批界面
 -->
<script setup lang="ts">
import moment from 'moment'
import { findLastIndex } from '@/utils'
import { ref, unref, reactive, nextTick, getCurrentInstance } from 'vue'
import {
  ElButton,
  ElMessage,
  ElRow,
  ElCol,
  ElForm,
  ElFormItem,
  FormRules,
  ElRadioGroup,
  ElRadio,
  ElInput,
  ElSteps,
  ElStep
} from 'element-plus'
import { Dialog } from '@/components/Dialog'
import { propTypes } from '@/utils/propTypes'
import { DrawerWrap } from '@/components/DrawerWrapDetailsSub'
import { Segmentation } from '@/components/Segmentation'
import { useEmitt } from '@/hooks/web/useEmitt'
import { useValidator } from '@/hooks/web/useValidator'
import { FormSchema } from '@/types/form'
import { ScientificData } from '@/api/project/scientific/types'
import {
  getScientificApi,
  auditProjectApi,
  changeStatusAuditApi,
  auditChangePrincipalApi,
  endProjectAuditApi
} from '@/api/project/scientific'
import { useCache } from '@/hooks/web/useCache'
import FilePreview from '@/views/Components/FilePreview/FilePreview.vue'
import { ProjectStep } from '@/views/Components/ProjectStep'
import { useRouter, useRoute } from 'vue-router'

const route = useRoute()
const router = useRouter()

//缓存
const { wsCache } = useCache()
//登录人姓名
const loginUserName = ref<string>(wsCache.get('userInfo').nickName)
const { proxy } = getCurrentInstance() as any

const emit = defineEmits(['changeGetDetail', 'changeGetDetailAndList'])
// callback 类型
type Callback = (error?: string | Error | undefined) => void
// 导入表单校验
const { required, notSpace } = useValidator()
// 父组件传递数据
const props = defineProps({
  title: propTypes.string.def(''),
  isAction: propTypes.string.def('')
})
// 表单校验
const ruleValidate = reactive<FormRules>({
  reason: [
    { required: true, message: '该项为必填项', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  auditTime: [{ required: true, message: '该项为必填项', trigger: 'blur' }],
  status: [
    {
      required: true,
      message: '该项为必填项',
      trigger: 'change'
    }
  ],

  desc: [{ required: true, message: 'Please input activity form', trigger: 'blur' }]
})
// 当前步骤
const nowStep = ref<number>(0)
// 接收所有的步骤
const stepsList = ref<any>([])
// 获取文件名称
// 预览弹窗
const previewFile = (fileName: string, path: string) => {
  FilePreviewRef.value.openDialog(fileName, path)
}
//文件预览
const FilePreviewRef = ref()
// 获取文件名称
const getFileName = (name: string | string[]) => {
  if (name && name.lastIndexOf('/') > -1) {
    return name.slice(name.lastIndexOf('/') + 1)
  } else {
    return ''
  }
}
//获取文件后缀
const fileNext = (path: any) => {
  let extension = ''
  if (path) {
    extension = path.substring(path.lastIndexOf('.') + 1)
  }
  return extension
}
// 弹窗关闭
const closeDialog = () => {
  document.getElementsByTagName('body')[0].className = ''
  document.getElementsByTagName('body')[0].style.width = '100%'
}
//表单
const formRef = ref<any>()
//是否显示
const isShow = ref<boolean>(false)
//监听页面关闭
const { emitter } = useEmitt({
  name: 'drawer',
  callback: (type: string) => {
    if (type === 'closed') {
    }
  }
})

const loading = ref(false)
//保存数据
const save = async () => {
  // //表单验证
  await formRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      if (isValid) {
        loading.value = true
        let params: any = {
          pid: detailsData.value.pid,
          flag: '2', // 1 申请 2 审核 3 确认
          status: formData.value.status, // 1 同意 2 驳回
          content: formData.value.status === '1' ? '同意' : '驳回', // 内容
          reason: formData.value.reason // 理由
        }
        let res: void | IResponse<any>
        if (detailsData.value.status === '1') {
          //审核科研申请
          res = await auditProjectApi(params)
            .catch(() => {})
            .finally(() => {
              setTimeout(() => {
                loading.value = false
              }, 200)
            })
        } else if (detailsData.value.status === '3') {
          //审核状态变更
          res = await changeStatusAuditApi(params)
            .catch(() => {})
            .finally(() => {
              setTimeout(() => {
                loading.value = false
              }, 200)
            })
        } else if (detailsData.value.status === '4') {
          //审核负责人变更
          res = await auditChangePrincipalApi(params)
            .catch(() => {})
            .finally(() => {
              setTimeout(() => {
                loading.value = false
              }, 200)
            })
        } else if (detailsData.value.status === '5') {
          //审核结题申请
          res = await endProjectAuditApi(params)
            .catch(() => {})
            .finally(() => {
              setTimeout(() => {
                loading.value = false
              }, 200)
            })
        }
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
//是否显示保存按钮
const isSave = ref<boolean>(false)
//页面标题
const pageTite = ref<string>('')
//页面标志 audit审批 process审批进程
const isFlag = ref<string>('')
//页面
const drawerWrap = ref<any>()
//数据id
const detailsId = ref<string>('')
//详情数据
const detailsData = ref<any>({
  achievement: '', //研究成果及形式
  approvalReason: '', //立项目的
  audit: false, //是否可以审核
  auditSort: '', //转售后审批流程序号 1 待审批 2 上级负责人审批 3上级负责人驳回 4总经理审批 5总经理驳回
  beginTime: '', //
  createBy: '',
  createTime: '',
  delFlag: '', // 0 可用 1 删除
  economicBenefits: '', // 预计经济效益
  edit: false, //是否可以编辑
  endTime: '',
  id: '',
  innovatePoint: '', // 创新点
  itemNumber: '', //	项目编号
  leaders: '',
  params: null,
  participants: '', //项目主要参与人
  pmAuditList: [],
  pmProgressList: [],
  principalPerson: '', //	负责人
  principalPersonLeader: '', //
  principalPersonLeaderName: '', //
  principalPersonName: '', //
  projectPlan: '', //项目方案
  projectTitle: '', //项目名
  remark: '',
  status: '', //项目状态 1 审批中 2进展中 3状态变更审批中 4负责人变更审批中 5结题审批中 6已结题 7已终止 8已暂停
  timeAndPhase: '', //项目起止时间及阶段划分
  type: '', //项目类别 1新产品研发项目 2技术攻关项目 3 技改项目
  updateBy: '', //
  updateTime: '', //
  year: ''
})
//表单数据
const formData = ref<any>({
  status: '',
  reason: null,
  auditTime: ''
})
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
    formData.value.status = '1'
    getDetailsData(id)
  }
}
//关闭drawer
const closeDrawer = () => {
  drawerWrap.value.isShow = false
}
//申请内容
const stateChangeContent = ref<string>('')
//内容附件
const attachmentFile = ref<string>('')
//获取详情
const getDetailsData = async (id: string) => {
  detailsId.value = id
  let params = {
    id: id
  }
  const res = await getScientificApi(params)
  if (res && res.data) {
    detailsData.value = res.data
    stepsList.value = []
    nowStep.value = 0
    // 截取最后一个申请
    let auditLisData = res.data.pmAuditList
    // 获取最后一个申请的索引
    let lastIndex = findLastIndex(
      auditLisData,
      (item: any) => item.flag === '1' && item.phase === '5'
    )
    //附件
    attachmentFile.value = ''
    //申请内容
    stateChangeContent.value = ''
    if (lastIndex > -1) {
      if (detailsData.value.status === '3') {
        //状态变更审批中
        stateChangeContent.value =
          auditLisData[lastIndex].content +
          (auditLisData[lastIndex].reason ? '，理由：' + auditLisData[lastIndex].reason : '')
      } else if (detailsData.value.status === '4') {
        //负责人变更审批中
        stateChangeContent.value = auditLisData[lastIndex].content
      } else if (detailsData.value.status === '5') {
        //结题审批中
        stateChangeContent.value =
          auditLisData[lastIndex].content +
          (auditLisData[lastIndex].conclusionReason
            ? '，结题原因：' + auditLisData[lastIndex].conclusionReason
            : '')
        if (auditLisData[lastIndex].summarize) {
          stateChangeContent.value =
            stateChangeContent.value + '\n研究总结：' + auditLisData[lastIndex].summarize
        }
        if (auditLisData[lastIndex].remark) {
          stateChangeContent.value =
            stateChangeContent.value + '\n备注：' + auditLisData[lastIndex].remark
        }
        attachmentFile.value = auditLisData[lastIndex].conclusionFilePath
          ? auditLisData[lastIndex].conclusionFilePath
          : ''
      }
    }

    // 截取最后一个申请之后的数据
    auditLisData = auditLisData.slice(lastIndex, auditLisData.length)
    // 遍历进程
    //status  1 审批中 2进展中 3状态变更审批中 4负责人变更审批中 5结题审批中 6已结题 7已终止 8已暂停
    // 遍历进程
    auditLisData.forEach((item: any) => {
      var b = ''
      if (item.type === '5') {
        b = '项目状态变更审批'
      } else if (item.type === '6') {
        b = '负责人变更审批'
      } else if (item.type === '11') {
        b = '自研审批'
      } else if (item.type === '12') {
        b = '结题审批'
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
          if (item.phase === '5') {
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
        if (item.phase === '5') {
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

    if (detailsData.value.status === '1') {
      //自研项目审批中
      // 科研审批流程序号 auditSort 1 待审批 2 上级负责人审批 3上级负责人驳回 4总经理审批 5总经理驳回
      if (res.data.auditSort === '1' || !res.data.auditSort) {
        if (res.data.principalPersonLeaderName !== '张保国') {
          stepsList.value.push({
            status: '', // wait、process、finish、error，
            title: res.data.principalPersonLeaderName,
            content: '自研项目申请，待审批。',
            icon: ''
          })
        }
        stepsList.value.push({
          status: '', // wait、process、finish、error，
          title: '张保国',
          content: '自研项目申请，待审批。',
          icon: ''
        })
      }

      if (res.data.auditSort === '2') {
        //
        stepsList.value.push({
          status: '', // wait、process、finish、error，
          title: '张保国',
          content: '自研项目申请，待审批。',
          icon: ''
        })
      }
    } else if (detailsData.value.status === '3') {
      //状态变更审批中
      stepsList.value.push({
        status: '', // wait、process、finish、error，
        title: res.data.principalPersonLeaderName,
        content: '待审批',
        icon: ''
      })
    } else if (detailsData.value.status === '4') {
      //负责人变更审批中
      stepsList.value.push({
        status: '', // wait、process、finish、error，
        title: res.data.principalPersonLeaderName,
        content: '待审批',
        icon: ''
      })
    } else if (detailsData.value.status === '5') {
      //结题审批中
      // 科研审批流程序号 auditSort 1 待审批 2 上级负责人审批 3上级负责人驳回 4总经理审批 5总经理驳回
      if (res.data.auditSort === '1' || !res.data.auditSort) {
        if (res.data.principalPersonLeaderName !== '张保国') {
          stepsList.value.push({
            status: '', // wait、process、finish、error，
            title: res.data.principalPersonLeaderName,
            content: '待审批。',
            icon: ''
          })
        }
        stepsList.value.push({
          status: '', // wait、process、finish、error，
          title: '张保国',
          content: '待审批。',
          icon: ''
        })
      }

      //
      if (res.data.auditSort === '2') {
        stepsList.value.push({
          status: '', // wait、process、finish、error，
          title: '张保国',
          content: '待审批。',
          icon: ''
        })
      }

      if (res.data.auditSort === '4') {
        stepsList.value.push({
          status: '', // wait、process、finish、error，
          title: '张保国',
          content: '待审批。',
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
//表单赋值
const setValues = (form: any) => {
  unref(formRef)?.setValues(form)
}
//根据length截取字符串
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
    <!-- <template #right v-if="isSave">
      <ElButton type="primary" :loading="loading" @click="save"> 保存 </ElButton>
    </template> -->
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
                <el-form-item label="项目类型：">
                  <p class="ellipsis-p-class">{{
                    detailsData.type === '1'
                      ? '新产品研发项目'
                      : detailsData.type === '2'
                      ? '技术攻关项目'
                      : detailsData.type === '3'
                      ? '技改项目'
                      : '--'
                  }}</p>
                </el-form-item>
              </ElCol>
              <ElCol :span="6">
                <el-form-item label="申请时间：">
                  <p class="ellipsis-p-class">
                    {{ moment(detailsData.createTime).format('YYYY-MM-DD') || '--' }}</p
                  >
                </el-form-item>
              </ElCol>
              <ElCol :span="6">
                <el-form-item label="负责人：">
                  <p class="ellipsis-p-class">
                    {{ detailsData.principalPersonName ? detailsData.principalPersonName : '--' }}
                  </p></el-form-item
                >
              </ElCol>

              <ElCol :span="6">
                <el-form-item label="状态：">
                  <el-tag
                    class="mt-1"
                    :type="
                      detailsData.status === '1'
                        ? 'primary'
                        : detailsData.status === '2'
                        ? 'success'
                        : detailsData.status === '3'
                        ? 'warning'
                        : detailsData.status === '4'
                        ? 'warning'
                        : detailsData.status === '5'
                        ? 'danger'
                        : detailsData.status === '6'
                        ? 'success'
                        : detailsData.status === '7'
                        ? 'info'
                        : detailsData.status === '8'
                        ? 'danger'
                        : 'danger'
                    "
                    :effect="
                      detailsData.status === '4' ||
                      detailsData.status === '8' ||
                      detailsData.status === '6'
                        ? 'dark'
                        : ''
                    "
                  >
                    {{
                      detailsData.status === '1'
                        ? '自研审批中'
                        : detailsData.status === '2'
                        ? '进展中'
                        : detailsData.status === '3'
                        ? '状态变更审批中'
                        : detailsData.status === '4'
                        ? '负责人变更审批中'
                        : detailsData.status === '5'
                        ? '结题审批中'
                        : detailsData.status === '6'
                        ? '已结题'
                        : detailsData.status === '7'
                        ? '已终止'
                        : detailsData.status === '8'
                        ? '已暂停'
                        : '--'
                    }}
                  </el-tag>
                </el-form-item>
              </ElCol>
              <ElCol :span="6">
                <el-form-item label="立项目的："
                  ><p class="ellipsis-p-class" :title="detailsData.approvalReason">
                    {{ detailsData.approvalReason || '--' }}
                  </p></el-form-item
                >
              </ElCol>
              <ElCol :span="6">
                <el-form-item label="项目方案："
                  ><p class="ellipsis-p-class" :title="detailsData.projectPlan">
                    {{ detailsData.projectPlan || '--' }}
                  </p></el-form-item
                ></ElCol
              >
              <ElCol :span="6">
                <el-form-item label="预期经济效益："
                  ><p class="ellipsis-p-class" :title="detailsData.economicBenefits">
                    {{ detailsData.economicBenefits || '--' }}
                  </p></el-form-item
                ></ElCol
              >
              <ElCol :span="6">
                <el-form-item label="创新点："
                  ><p class="ellipsis-p-class" :title="detailsData.innovatePoint">
                    {{ detailsData.innovatePoint || '--' }}
                  </p></el-form-item
                ></ElCol
              >
              <ElCol :span="6">
                <el-form-item label="项目主要参与人："
                  ><p class="ellipsis-p-class" :title="detailsData.participants">
                    {{ detailsData.participants || '--' }}
                  </p></el-form-item
                ></ElCol
              >

              <ElCol :span="6">
                <el-form-item label="项目起止时间及阶段划分："
                  ><p class="ellipsis-p-class" :title="detailsData.timeAndPhase">
                    {{ detailsData.timeAndPhase || '--' }}
                  </p></el-form-item
                ></ElCol
              >

              <ElCol :span="6">
                <el-form-item label="研究成果及形式："
                  ><p class="ellipsis-p-class" :title="detailsData.achievement">
                    {{ detailsData.achievement || '--' }}
                  </p></el-form-item
                ></ElCol
              >
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
                <span :title="detailsData.projectTitle" style="font-weight: 600">{{
                  nameOverflow(detailsData.projectTitle, 30)
                }}</span>
                {{
                  detailsData.status === '1'
                    ? '项目自研'
                    : detailsData.status === '3'
                    ? '项目状态变更'
                    : detailsData.status === '4'
                    ? '负责人变更'
                    : detailsData.status === '5'
                    ? '结题'
                    : ''
                }}。</p
              >
              <div v-if="detailsData.status !== '1'" class="apply-wrap">
                <p>{{ stateChangeContent || '' }}</p>
              </div>

              <div v-if="detailsData.status === '5'" class="apply-wrap">
                <div v-if="attachmentFile">
                  <p class="apply-content-p"
                    >研究成果：<span>
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
              :label-width="80"
            >
              <!-- 0同意，1驳回 -->
              <ElFormItem label="是否同意" prop="status" label-width="90">
                <ElRadioGroup v-model="formData.status">
                  <ElRadio label="1">同意</ElRadio> <ElRadio label="2">驳回</ElRadio>
                </ElRadioGroup>
              </ElFormItem>
              <ElFormItem
                label="建议/理由"
                prop="reason"
                label-width="90"
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
              <ElFormItem label="建议/理由" prop="reason" label-width="90" v-else :required="false">
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
            <!-- status 当前步骤的状态，可选值为wait、process、finish、error; current 当前步骤，从 0 开始计数 -->
            <!-- <ElSteps
              :space="80"
              :active="nowStep"
              direction="vertical"
              process-status="finish"
              finish-status="success"
            >
              <ElStep
                :title="item.title"
                :description="item.content"
                v-for="(item, index) in stepsList"
                :key="index"
              />
            </ElSteps> -->
          </div>
        </template>
      </Segmentation>
      <FilePreview title="预览" ref="FilePreviewRef" />
    </template>
  </DrawerWrap>
</template>

<style lang="less" scoped>
.apply-audit{
  padding: 0 10px;
}
.apply-content-p {
  line-height: 36px;
  color: #666666;
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

.top-row-sub {
  border-bottom: 1px solid rgba(217, 221, 231, 0.8);
  padding-top: 15px;
  padding-bottom: 20px;
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
    padding-bottom: 10px;

    p {
      line-height: 36px;
      overflow-wrap: break-word;
      white-space: pre-wrap;
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
@media screen and (min-width: 1366px) {
  .p-ellipsis {
    width: 62%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: left;
  }

  .p-ellipsis-sub {
    width: 42%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: left;
  }
}
@media screen and (min-width: 1400px) {
  .p-ellipsis {
    width: 64%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: left;
  }

  .p-ellipsis-sub {
    width: 62%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: left;
  }
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
