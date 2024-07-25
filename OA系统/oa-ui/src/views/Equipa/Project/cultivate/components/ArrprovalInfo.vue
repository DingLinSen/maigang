<!-- 
  * 项目管理-培育项目-审批界面
 -->
<script setup lang="ts">
import { Form, FormExpose } from '@/components/Form'
import moment from 'moment'
import { findLastIndex } from '@/utils'
import FilePreview from '@/views/Components/FilePreview/FilePreview.vue'
import { ref, unref, reactive, nextTick, getCurrentInstance } from 'vue'
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
import { Dialog } from '@/components/Dialog'
import { propTypes } from '@/utils/propTypes'
import { DrawerWrap } from '@/components/DrawerWrapDetailsSub'
import { Segmentation } from '@/components/Segmentation'
import { useEmitt } from '@/hooks/web/useEmitt'
import { useValidator } from '@/hooks/web/useValidator'
import { CultivateData } from '@/api/project/cultivate/types'
import { getCultivateApi, changePrincipalPersonAuditApi } from '@/api/project/cultivate'
import { completeWorkflowrApi } from '@/api/workflow' // 处理流程
import { useCache } from '@/hooks/web/useCache'
import { ProjectStep } from '@/views/Components/ProjectStep'
import { getProjectTypeLabel, getProjectSourceLabel } from '../../config/config'

import { useRouter, useRoute } from 'vue-router'
import { getCityApi, getProvinceApi } from '@/api/person/induction'
const route = useRoute()
const router = useRouter()

const { wsCache } = useCache()
const loginUserName = ref<string>(wsCache.get('userInfo').nickName)
const { proxy } = getCurrentInstance() as any
const { province } = proxy.useDict('province')
const emit = defineEmits(['changeGetDetail', 'changeGetDetailAndList'])
// const { sys_normal_disable } = proxy.useDict('sys_normal_disable')
// callback 类型
type Callback = (error?: string | Error | undefined) => void
// 导入表单校验
const { required, notSpace } = useValidator()

// 父组件传递数据
const props = defineProps({
  title: propTypes.string.def(''),
  isAction: propTypes.string.def('')
})

const isApplyEnd = ref(false) // 审批培育终止
const showApply = ref(false) // 审批表内容
const isSeeSub = ref(false) // 只能查看不能操作

// 表单

const nowStep = ref<number>(0) // 当前步骤

// 接收所有的步骤
const stepsList = ref<any>([])

// 弹窗名称
const dialogTitle = ref<string>('')

// 获取文件名称
// 预览弹窗
const previewFile = (fileName: string, path: string) => {
  FilePreviewRef.value.openDialog(fileName, path)
}
const FilePreviewRef = ref()
// 获取文件名称
const getFileName = (name: string | string[]) => {
  if (name && name.lastIndexOf('/') > -1) {
    return name.slice(name.lastIndexOf('/') + 1)
  } else {
    return ''
  }
}
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

const formRef = ref()

const isShow = ref<boolean>(false)

const { emitter } = useEmitt({
  name: 'drawer',
  callback: (type: string) => {
    if (type === 'closed') {
      // resetFormAfterClose()
    }
  }
})

const loading = ref(false)
//保存数据
const save = async () => {
  await formRef.value?.validate(async (isValid) => {
    if (isValid) {
      loading.value = true
      if (detailsData.value.status == '6') {
        let params: any = {
          pid: detailsData.value.id,
          status: formData.value.status, // 1 同意 2 驳回
          reason: formData.value.reason
        }
        const res = await changePrincipalPersonAuditApi(params)
          .catch(() => {})
          .finally(() => {
            loading.value = false
          })
        if (res && res.code === '00000') {
          formRef.value?.resetFields()
          ElMessage.success('保存信息成功')
          formData.value.reason = ''
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
            // approvalDate: {
            //   type: '',
            //   value: ''
            // }
          }
        }
        const res = await completeWorkflowrApi(detailsData.value.workflowInstanceId, params)
          .catch(() => {})
          .finally(() => {
            setTimeout(() => {
              loading.value = false
            }, 200)
          })
        console.log(res)
        if (res && res.code === '00000') {
          formRef.value?.resetFields()
          ElMessage.success('保存信息成功')
          formData.value.reason = ''
          emit('changeGetDetailAndList')
          // emitter.emit('getList', 'add')
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
const detailsData = ref<any>({
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
  principalPersonLeaderName: '',
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
  menuIds: [],
  deptIds: [],
  permissions: '',
  admin: false,
  workflowInstanceId: null,
  principalPerson: '',
  location: ''
})
const formData = ref<any>({
  status: '',
  reasonSub: null,
  reason: null,
  auditTime: '',
  workflowInstanceId: null
})

//培育终止理由
const endReason = ref<string>('')
//变更理由
const changeContent = ref<string>('')
//打开drawer并初始化
const openDrawer = async (flag: string, id: string) => {
  //重置表单
  detailsId.value = ''
  formData.value.reason = null
  formRef.value?.resetFields()
  // setValue(false)
  isFlag.value = flag
  isSave.value = flag === 'see' || flag === 'process' ? false : true
  changeDisabled(flag === 'see')

  pageTite.value = flag === 'audit' ? '审批' : '审批进程'
  drawerWrap.value.isShow = true
  if (id) {
    await getProvinceData()
    // formData.value.status = 1
    formData.value.reason = null
    getDetailsData(id)
  }
}

const provinceData = ref<any>([])
const getProvinceData = async () => {
  let res = await getProvinceApi()
  if (res) {
    provinceData.value = res.data
  }
}

const getLocation = (province: string, city: string) => {
  let id = ''
  provinceData.value.find((item: any) => {
    if (item.code == province) {
      id = item.id
      detailsData.value.location = item.province
    }
  })
  if (city) {
    if (id) {
      getCityApi(id).then((res: any) => {
        res.data.forEach((element: any) => {
          if (element.code == city) {
            detailsData.value.location = detailsData.value.location + '/' + element.city
          }
        })
      })
    }
  }
}

//关闭drawer
const closeDrawer = () => {
  drawerWrap.value.isShow = false
}

//获取详情
const fileArray = ref<any>([])
const getDetailsData = async (id: string) => {
  fileArray.value = []
  detailsId.value = id
  let params = {
    id: id
  }
  const res = await getCultivateApi(params)
  if (res && res.data) {
    detailsData.value = res.data
    detailsData.value.status = res.data.status
    if (detailsData.value.status == '0' || detailsData.value.status == '4') {
      formData.value.status = Number(res.data.status) + 1
    } else {
      formData.value.status = 1
    }
    if (detailsData.value.customerId) {
      getLocation(detailsData.value.province, detailsData.value.city)
    }
    fileArray.value = detailsData.value.filePath ? detailsData.value.filePath.split(',') : []
    console.log('detailsData', detailsData)
    stepsList.value = []

    nowStep.value = 0
    // 截取最后一个申请
    let auditLisData = res.data.pmAuditList

    // 获取最后一个申请的索引
    let lastIndex = findLastIndex(
      auditLisData,
      (item: any) => item.flag === '1' && item.phase === '1'
    )
    // 截取最后一个申请之后的数据
    auditLisData = auditLisData.slice(lastIndex, auditLisData.length)
    // 0培育审批中，1进展中，2结束转立项审批中，3结束转立项，4结束终止审批中，5结束终止
    if (res.data.status === '0') {
      if (auditLisData.length) {
        auditLisData.forEach((item: any) => {
          // phase 阶段 1培育 2立项 3 实施 4 售后',
          // flag 记录类型(1申请 2审核 3 确认)
          //   审批类型(1 培育审批 2 项目终止审批 3 立项审批 4 里程碑审批 5 项目状态变更审批 6 负责人变更审批 7 实施审批)

          // 阶段 培育
          if (item.phase === '1') {
            // 培育开始
            // 类型 申请
            if (item.flag === '1') {
              stepsList.value.push({
                createByName: item.auditDate
                  ? item.createByName + ' ' + item.auditDate
                  : item.createByName, // 发起人
                status: '', // wait、process、finish、error，
                title: '培育项目申请',
                content: '发起培育项目申请审批。',
                icon: ''
              })
            }

            // 类型 审批
            if (item.flag === '2') {
              if (!item.status && item.status !== '') {
                stepsList.value.push({
                  createByName: item.auditDate
                    ? item.createByName + ' ' + item.auditDate
                    : item.createByName, // 发起人
                  status: '', // wait、process、finish、error，
                  title: '培育项目审批',
                  content: '待审批',
                  icon: ''
                })
              } else {
                stepsList.value.push({
                  createByName: item.createByName + ' ' + item.auditDate, // 发起人
                  status: '', // wait、process、finish、error，
                  title: '培育项目审批',
                  content:
                    item.createByName +
                    (item.status === '1' ? '同意' : item.status === '2' ? '驳回' : '') +
                    '培育项目审批申请，建议/理由：' +
                    (item.reason ? item.reason : '--'),
                  icon: ''
                })
              }
            }

            // 类型 确认
            if (item.flag === '3') {
              stepsList.value.push({
                createByName: item.auditDate
                  ? item.createByName + ' ' + item.auditDate
                  : item.createByName, // 发起人
                status: '', // wait、process、finish、error，
                title: '培育项目审批',
                content:
                  (item.status === '1' ? '同意' : item.status === '2' ? '驳回' : '') +
                  '培育项目申请，建议/理由：' +
                  (item.reason ? item.reason : '--'),
                icon: ''
              })
            }
          }
        })
      }
    }

    if (res.data.status === '2') {
      if (auditLisData.length) {
        auditLisData.forEach((item: any) => {
          // phase 阶段 1培育 2立项 3 实施 4 售后',
          // flag 记录类型(1申请 2审核 3 确认)
          // type 审批类型(1 培育审批 2 项目终止审批 3 立项审批 4 里程碑审批 5 项目状态变更审批 6 负责人变更审批 7 实施审批)

          // 阶段 培育
          if (item.phase === '1') {
            // 培育开始
            // 类型 申请
            if (item.flag === '1') {
              stepsList.value.push({
                createByName: item.auditDate
                  ? item.createByName + ' ' + item.auditDate
                  : item.createByName, // 发起人
                status: '', // wait、process、finish、error，
                title: '培育项目申请',
                content: '发起培育转立项项目申请审批。',
                icon: ''
              })
            }

            // 类型 审批
            if (item.flag === '2') {
              stepsList.value.push({
                createByName: item.auditDate
                  ? item.createByName + ' ' + item.auditDate
                  : item.createByName, // 发起人
                status: '', // wait、process、finish、error，
                title: '培育转立项审批',
                content: '待审批',
                icon: ''
              })
            }

            // 类型 确认
            if (item.flag === '3') {
              stepsList.value.push({
                createByName: item.auditDate
                  ? item.createByName + ' ' + item.auditDate
                  : item.createByName, // 发起人
                status: '', // wait、process、finish、error，
                title: '培育项目审批',
                content:
                  (item.status === '1' ? '同意' : item.status === '2' ? '驳回' : '') +
                  '培育转立项项目申请，建议/理由：' +
                  (item.reason ? item.reason : '--'),
                icon: ''
              })
            }
          }
        })
      }
    }

    if (res.data.status === '4') {
      // status 0培育审批中，1进展中，2结束转立项审批中，3结束转立项，4结束终止审批中，5结束终止
      if (auditLisData.length) {
        auditLisData.forEach((item) => {
          // phase 阶段 1培育 2立项 3 实施 4 售后',
          // flag 记录类型(1申请 2审核 3 确认)
          // type 审批类型(1 培育审批 2 项目终止审批 3 立项审批 4 里程碑审批 5 项目状态变更审批 6 负责人变更审批 7 实施审批)
          if (item.phase === '1') {
            if (item.type === '1') {
              // 培育开始
              // 类型 申请
              if (item.flag === '1') {
                stepsList.value.push({
                  createByName: item.auditDate
                    ? item.createByName + ' ' + item.auditDate
                    : item.createByName, // 发起人
                  status: '', // wait、process、finish、error，
                  title: '培育项目申请',
                  content: '发起培育转立项项目申请审批。',
                  icon: ''
                })
              }

              // 类型 审批
              if (item.flag === '2') {
                if (!item.status && item.status !== '') {
                  stepsList.value.push({
                    createByName: item.auditDate
                      ? item.createByName + ' ' + item.auditDate
                      : item.createByName, // 发起人
                    status: '', // wait、process、finish、error，
                    title: '培育转立项审批',
                    content: '待审批',
                    icon: ''
                  })
                } else {
                  stepsList.value.push({
                    createByName: item.auditDate
                      ? item.createByName + ' ' + item.auditDate
                      : item.createByName, // 发起人
                    status: '', // wait、process、finish、error，
                    title: '培育转立项审批',
                    content:
                      item.createByName +
                      (item.status === '1' ? '同意' : item.status === '2' ? '驳回' : '') +
                      '培育转立项审批申请，建议/理由：' +
                      (item.reason ? item.reason : '--'),
                    icon: ''
                  })
                }
              }

              // 类型 确认
              if (item.flag === '3') {
                stepsList.value.push({
                  createByName: item.auditDate
                    ? item.createByName + ' ' + item.auditDate
                    : item.createByName, // 发起人
                  status: '', // wait、process、finish、error，
                  title: '培育项目审批',
                  content:
                    (item.status === '1' ? '同意' : item.status === '2' ? '驳回' : '') +
                    '培育转立项项目申请，建议/理由：' +
                    (item.reason ? item.reason : '--'),
                  icon: ''
                })
              }
            }
            if (item.type === '2') {
              // 结束终止审批
              if (item.flag === '1') {
                stepsList.value.push({
                  createByName: item.auditDate
                    ? item.createByName + ' ' + item.auditDate
                    : item.createByName, // 发起人
                  status: '', // wait、process、finish、error，
                  title: '培育终止申请',
                  content:
                    item.createByName +
                    (item.reason ? '因' + item.reason + '原因，申请培育终止。' : '--'),
                  icon: ''
                })
              }
              if (item.flag === '2') {
                if (!item.status && item.status !== '') {
                  stepsList.value.push({
                    createByName: item.auditDate
                      ? item.createByName + ' ' + item.auditDate
                      : item.createByName, // 发起人
                    status: '', // wait、process、finish、error，
                    title: '培育终止审批',
                    content: '待审批',
                    icon: ''
                  })
                } else {
                  stepsList.value.push({
                    createByName: item.auditDate
                      ? item.createByName + ' ' + item.auditDate
                      : item.createByName, // 发起人
                    status: '', // wait、process、finish、error，
                    title: '培育终止审批',
                    content:
                      item.createByName +
                      (item.status === '1' ? '同意' : item.status === '2' ? '驳回' : '') +
                      '培育终止申请，建议/理由：' +
                      (item.reason ? item.reason : '--'),
                    icon: ''
                  })
                }
              }
              if (item.flag === '3') {
                stepsList.value.push({
                  createByName: item.auditDate
                    ? item.createByName + ' ' + item.auditDate
                    : item.createByName, // 发起人
                  status: '', // wait、process、finish、error，
                  title: '培育终止审批',
                  content:
                    item.createByName +
                    (item.status === '1' ? '同意' : item.status === '2' ? '驳回' : '') +
                    '培育终止申请，建议/理由：' +
                    (item.reason ? item.reason : '--'),
                  icon: ''
                })
              }
            }
          }
        })
      }
      // 获取最后一个申请的索引
      endReason.value = ''
      let lastIndex0 = findLastIndex(
        res.data.pmAuditList,
        (item: any) => item.flag === '1' && item.phase === '1' && item.type === '2'
      )
      if (lastIndex0 > -1) {
        endReason.value = res.data.pmAuditList[lastIndex0].reason
      }
    }

    if (res.data.status === '6') {
      // status 0培育审批中，1进展中，2结束转立项审批中，3结束转立项，4结束终止审批中，5结束终止
      if (auditLisData.length) {
        auditLisData.forEach((item) => {
          // phase 阶段 1培育 2立项 3 实施 4 售后',
          // flag 记录类型(1申请 2审核 3 确认)
          // type 审批类型(1 培育审批 2 项目终止审批 3 立项审批 4 里程碑审批 5 项目状态变更审批 6 负责人变更审批 7 实施审批)
          if (item.phase === '1') {
            if (item.type === '6') {
              // 培育开始
              // 类型 申请
              if (item.flag === '1') {
                stepsList.value.push({
                  createByName: item.auditDate
                    ? item.createByName + ' ' + item.auditDate
                    : item.createByName, // 发起人
                  status: '', // wait、process、finish、error，
                  title: '负责人变更审批申请',
                  content: '发起项目负责人变更审批。',
                  icon: ''
                })
              }

              // 类型 审批
              if (item.flag === '2') {
                if (!item.status && item.status !== '') {
                  stepsList.value.push({
                    createByName: item.auditDate
                      ? item.createByName + ' ' + item.auditDate
                      : item.createByName, // 发起人
                    status: '', // wait、process、finish、error，
                    title: '负责人变更审批',
                    content: '待审批',
                    icon: ''
                  })
                } else {
                  stepsList.value.push({
                    createByName: item.auditDate
                      ? item.createByName + ' ' + item.auditDate
                      : item.createByName, // 发起人
                    status: '', // wait、process、finish、error，
                    title: '负责人变更审批',
                    content:
                      item.createByName +
                      (item.status === '1' ? '同意' : item.status === '2' ? '驳回' : '') +
                      '负责人变更申请，建议/理由：' +
                      (item.reason ? item.reason : '--'),
                    icon: ''
                  })
                }
              }

              // 类型 确认
              if (item.flag === '3') {
                stepsList.value.push({
                  createByName: item.auditDate
                    ? item.createByName + ' ' + item.auditDate
                    : item.createByName, // 发起人
                  status: '', // wait、process、finish、error，
                  title: '负责人变更审批',
                  content:
                    (item.status === '1' ? '同意' : item.status === '2' ? '驳回' : '') +
                    '负责人变更申请，建议/理由：' +
                    (item.reason ? item.reason : '--'),
                  icon: ''
                })
              }
            }
          }
        })
      }
      // 获取最后一个申请的索引
      changeContent.value = ''
      let lastIndex0 = findLastIndex(
        res.data.pmAuditList,
        (item: any) => item.flag === '1' && item.phase === '1' && item.type === '6'
      )
      if (lastIndex0 > -1) {
        changeContent.value = res.data.pmAuditList[lastIndex0].content
      }
      stepsList.value.push({
        createByName: res.data.principalPersonLeaderName
          ? res.data.principalPersonLeaderName
          : '--', // 发起人
        status: '', // wait、process、finish、error，
        title: '负责人变更审批',
        content: '待审批',
        icon: ''
      })
    }

    console.log('stepsList', stepsList.value)
    nowStep.value =
      auditLisData.filter((item: any) => {
        if (item.flag === '2' && !item.status) {
          return
        } else {
          return item
        }
      }).length - 1
    console.log('nowStep', nowStep.value)

    // stepsList
  }
}

//表单赋值
const setValue = (reset: boolean) => {
  // const formRef = unref(formRef)
  if (reset) {
    // formRef?.value.resetFields()
  } else {
    // unref(formRef)?.setValues({
    //   postId: '',
    //   postName: '',
    //   postSort: null,
    //   status: '0',
    //   postCode: '',
    //   remark: ''
    // })
  }
}

const setValues = (form: any) => {
  unref(formRef)?.setValues(form)
}

//表单禁用
const changeDisabled = (bool: boolean) => {
  // unref(formRef)?.setProps({
  //   disabled: bool
  // })
}

// 展开收齐申请表
const checkApply = () => {
  showApply.value = !showApply.value
}

const classifyFile = (fileName, filePath) => {
  // this.$emit('classifyFile', filePath, fileName, '培育项目')
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

const closeDrawerWrap = () => {
  // if (route.query.pid) {
  //   router.push({ name: 'Overview' })
  // }
}

//
const getProvinceLable = (value: any) => {
  let label = '--'
  province.value.forEach((element: any) => {
    if (element.value == value) {
      label = element.label
    }
  })
  return label
}

// 表单校验
const ruleValidate = reactive<FormRules>({
  reason: [
    {
      required: true,
      message: '该项为必填项',
      trigger: 'blur'
    },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
    // { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' }
  ],
  auditTime: [
    { required: true, message: '该项为必填项', trigger: 'blur' }
    // { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' }
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
                <el-form-item label="申请时间：">
                  <p class="ellipsis-p-class">{{
                    detailsData.createTime
                      ? moment(detailsData.createTime).format('YYYY-MM-DD')
                      : '--'
                  }}</p>
                </el-form-item>
              </ElCol>
              <ElCol :span="6">
                <el-form-item label="客户名称：">
                  <p :title="detailsData.ownerName" class="ellipsis-p-class">{{
                    detailsData.ownerName || '--'
                  }}</p>
                </el-form-item>
              </ElCol>
              <!-- <ElCol :span="6">
                <el-form-item label="预计金额：">
                  <p class="ellipsis-p-class">{{
                    (detailsData.estimatedAmount ? detailsData.estimatedAmount + '万元' : '--') ||
                    '--'
                  }}</p></el-form-item
                >
              </ElCol> -->
              <ElCol :span="6">
                <el-form-item label="申请人："
                  ><p class="ellipsis-p-class">
                    {{ detailsData.createByName || '--' }}</p
                  ></el-form-item
                >
              </ElCol>
              <ElCol :span="6"></ElCol>
              <ElCol :span="6"></ElCol>
              <!-- <ElCol :span="3">
          <P class="name-p"> 项目编号 </P>
          <p class="sub-title" :title="detailsData.itemNumber">
            {{ detailsData.itemNumber || '--' }}
          </p>
        </ElCol> -->
              <!-- <ElCol :span="3">
                <P class="name-p"> 项目名称 </P>
                <p class="sub-title" :title="detailsData.projectTitle">
                  {{ nameOverflow(detailsData.projectTitle, 15) || '--' }}
                </p>
              </ElCol>
              <ElCol :span="3">
                <P class="name-p"> 申请时间 </P>
                <p>
                  {{
                    detailsData.createTime
                      ? moment(detailsData.createTime).format('YYYY-MM-DD')
                      : '--'
                  }}
                </p>
              </ElCol>

              <ElCol :span="3">
                <P class="name-p"> 用户名称 </P>
                <p class="sub-title" :title="detailsData.ownerName">
                  {{ nameOverflow(detailsData.ownerName, 15) || '--' }}
                </p>
              </ElCol>
              <ElCol :span="3">
                <P class="name-p"> 预计金额 </P>
                <p>
                  {{
                    (detailsData.estimatedAmount ? detailsData.estimatedAmount + '万元' : '--') ||
                    '--'
                  }}
                </p>
              </ElCol>
              <ElCol :span="3">
                <P class="name-p"> 申请人 </P>
                <p>
                  {{
                    detailsData.pmAuditList.length ? detailsData.pmAuditList[0]?.createByName : '--'
                  }}
                </p>
              </ElCol> -->
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
                <span style="font-weight: 600" :title="detailsData.projectTitle">{{
                  nameOverflow(detailsData.projectTitle, 30)
                }}</span>
                {{
                  detailsData.status === '4'
                    ? '项目结束终止'
                    : detailsData.status === '6'
                    ? '负责人变更'
                    : '项目培育'
                }}
                。</p
              >
              <div class="apply-wrap">
                <p class="apply-cotent-p">
                  查看申请表&nbsp;
                  <span style="color: #00a0e9; cursor: pointer" @click="checkApply">{{
                    showApply ? '关闭' : '展开'
                  }}</span>
                </p>
                <div class="apply-info" v-if="showApply">
                  <p>
                    <span class="title-span">项目编号：</span>&nbsp;<span class="word-break">{{
                      detailsData.itemNumber || '--'
                    }}</span>
                  </p>
                  <p>
                    <span class="title-span">项目名称：</span>&nbsp;<span
                      class="p-ellipsis-sub"
                      :title="detailsData.projectTitle"
                      >{{ detailsData.projectTitle || '--' }}</span
                    >
                  </p>
                  <p v-if="detailsData.customerId">
                    <span class="title-span">项目来源：</span>&nbsp;<span>
                      {{ getProjectSourceLabel(detailsData.projectSource) }}</span
                    >
                  </p>
                  <p>
                    <span class="title-span">所属行业：</span>&nbsp;<span>
                      {{ getProjectTypeLabel(detailsData.projectType) }}</span
                    >
                  </p>
                  <p v-if="detailsData.customerId">
                    <span class="title-span">客户性质：</span>&nbsp;<span>
                      {{ detailsData.nature || '--' }}</span
                    >
                  </p>
                  <p v-if="detailsData.customerId">
                    <span class="title-span">客户名称：</span>&nbsp;<span>
                      {{ detailsData.ownerName || '--' }}</span
                    >
                  </p>
                  <p v-if="detailsData.customerId">
                    <span class="title-span">所属省份：</span>&nbsp;<span>
                      {{ detailsData.location || '--' }}</span
                    >
                  </p>
                  <p v-if="detailsData.customerId">
                    <span class="title-span">客户联系人：</span>&nbsp;<span>
                      {{ detailsData.contacts || '--' }}</span
                    >
                  </p>
                  <p v-if="detailsData.customerId">
                    <span class="title-span">部门及职务：</span>&nbsp;<span>
                      {{ detailsData.position || '--' }}</span
                    >
                  </p>
                  <p v-if="detailsData.customerId">
                    <span class="title-span">电话：</span>&nbsp;<span>
                      {{ detailsData.phone || '--' }}</span
                    >
                  </p>
                  <p v-if="!detailsData.customerId">
                    <span class="title-span">预计金额：</span>&nbsp;<span>{{
                      (detailsData.estimatedAmount ? detailsData.estimatedAmount + '万元' : '--') ||
                      '--'
                    }}</span>
                  </p>
                  <p>
                    <span class="title-span">当前负责人：</span>&nbsp;<span>{{
                      detailsData.principalPersonName || '--'
                    }}</span>
                  </p>
                  <p v-if="!detailsData.customerId">
                    <span class="title-span">客户名称：</span>&nbsp;<span
                      class="p-ellipsis-sub"
                      :title="detailsData.ownerName"
                      >{{ detailsData.ownerName || '--' }}</span
                    >
                  </p>
                  <p v-if="!detailsData.customerId">
                    <span class="title-span">所属省份：</span>&nbsp;<span class="p-ellipsis-sub">{{
                      detailsData.province ? getProvinceLable(detailsData.province) : '--'
                    }}</span>
                  </p>
                  <p>
                    <span class="title-span">详细地址：</span>&nbsp;<span
                      class="p-ellipsis-sub"
                      :title="detailsData.address"
                      >{{ detailsData.address || '--' }}</span
                    >
                  </p>
                  <p class="project-content-p">
                    <span class="title-span">项目内容：</span>&nbsp;<span
                      class="p-ellipsis-sub"
                      :title="detailsData.planContent"
                      >{{ detailsData.planContent || '--' }}</span
                    >
                  </p>

                  <p>
                    <span class="title-span">文件：</span>&nbsp;
                    <span v-if="detailsData.filePath" class="flex-1">
                      <!-- :href="`${detailsData.filePath}`" -->
                      <!-- @click="previewFile(getFileName(detailsData.filePath), detailsData.filePath)" -->
                      <span v-for="(item, index) in fileArray" :key="index" class="w-full">
                        <ElLink
                          v-if="
                            fileNext(detailsData.filePath) === 'doc' ||
                            fileNext(detailsData.filePath) === 'zip' ||
                            fileNext(detailsData.filePath) === 'rar' ||
                            fileNext(detailsData.filePath) === 'xls'
                          "
                          :href="`${item}`"
                          :underline="false"
                          target="_blank"
                          class="file-class"
                        >
                          <p style="cursor: pointer; color: rgb(0, 160, 233)">
                            {{ getFileName(item) }}</p
                          >
                        </ElLink>
                        <ElLink v-else :underline="false" target="_blank"  class="file-class">
                          <p
                            style="cursor: pointer; color: rgb(0, 160, 233)"
                            @click="previewFile(getFileName(item), item)"
                          >
                            {{ getFileName(item) }}</p
                          >
                        </ElLink>
                      </span>
                    </span>
                    <span v-else>--</span>
                  </p>
                </div>
              </div>
              <div v-if="detailsData.status === '4'" class="apply-wrap">
                <p class="p-wrap">终止理由：{{ endReason }}</p>
              </div>

              <div v-if="detailsData.status === '6'" class="apply-wrap">
                <p class="p-wrap">变更事由：{{ changeContent }}</p>
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
                <ElRadioGroup v-if="detailsData.status === '0'" v-model="formData.status">
                  <ElRadio :label="1">同意</ElRadio>
                  <ElRadio :label="0">驳回</ElRadio>
                </ElRadioGroup>
                <ElRadioGroup v-if="detailsData.status === '4'" v-model="formData.status">
                  <ElRadio :label="5">同意</ElRadio>
                  <ElRadio :label="1">驳回</ElRadio>
                </ElRadioGroup>

                <ElRadioGroup v-if="detailsData.status === '6'" v-model="formData.status">
                  <ElRadio :label="1">同意</ElRadio>
                  <ElRadio :label="2">驳回</ElRadio>
                </ElRadioGroup>
              </ElFormItem>
              <ElFormItem
                v-if="
                  (detailsData.status === '0' && formData.status == 0) ||
                  (detailsData.status === '4' && formData.status == 1) ||
                  (detailsData.status === '6' && formData.status == 2)
                "
                :required="true"
                label="建议/理由"
                prop="reason"
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
    </template>
  </DrawerWrap>
  <FilePreview title="预览" ref="FilePreviewRef" />
</template>

<style lang="less" scoped>
.p-wrap {
  width: 100%;
  word-wrap: break-word; /* 旧版浏览器支持 */
  overflow-wrap: break-word; /* 标准属性 */
  white-space: wrap;
}
.apply-audit {
  padding: 0px 10px;
}
.project-content-p {
  line-height: 20px;
  margin-top: 8px;
  margin-bottom: 8px;
}
.apply-cotent-p {
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
  // border-bottom: 1px solid rgba(217, 221, 231, 0.8);
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
.form-wrap {
  // border-top: 1px solid rgba(217, 221, 231, 0.8);
  // margin: 15px 0px;
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
  .p-ellipsis-sub {
    width: 91%;
    white-space: normal;
    text-align: left;
    word-break: break-word;
  }
}
@media screen and (min-width: 1400px) {
  .p-ellipsis-sub {
    width: 94%;
    white-space: normal;
    text-align: left;
    word-break: break-word;
  }
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
<style lang="less">
.file-class{
  width: 100%;
  justify-content: flex-start;
}
</style>
