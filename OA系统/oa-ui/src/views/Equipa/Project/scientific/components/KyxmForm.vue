<!-- 
  * 项目管理-科研项目-新增\编辑界面
 -->
 <script setup lang="ts">
import { Form, FormExpose } from '@/components/Form'
import { ref, unref, reactive, inject } from 'vue'
import { propTypes } from '@/utils/propTypes'
import { DrawerWrap } from '@/components/DrawerWrap'
import { useEmitt } from '@/hooks/web/useEmitt'
import { useValidator } from '@/hooks/web/useValidator'
import { FormSchema } from '@/types/form'
import { ElDialog } from '@/components/ElDialog'
import { ScientificData } from '@/api/project/scientific/types'
import { saveScientificApi, editScientificApi, getScientificApi } from '@/api/project/scientific'
import { ElMessage } from 'element-plus'

// callback 类型
type Callback = (error?: string | Error | undefined) => void
const emit = defineEmits(['changeGetDetailAndList'])
const { required, notSpace } = useValidator()
// 接收父组件数据
const props = defineProps({
  dialogTitle: propTypes.string.def(''), // 弹窗名
  isAction: propTypes.string.def('')
})
// 弹窗的开启和关闭
const DialogFlag = ref<any>(false)
//人员集合
const principalTree = inject<any>('principalTree')
//项目类型
const projectType = reactive<any>([
  {
    label: '新产品研发项目',
    value: '1'
  },
  {
    label: '技术攻关项目',
    value: '2'
  },
  {
    label: '技改项目',
    value: '3'
  }
])
//表单数据
let culticateData = reactive<ScientificData>({
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
  pid: '',
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
//是否显示保存
const isSave = ref<boolean>(false)
//页面标题
const pageTite = ref<string>('')
//详情id
const detailsId = ref<number | null>(null)
// 表单项
const schema = ref<FormSchema[]>([
  {
    field: 'projectTitle',
    label: '项目名称',
    component: 'Input',
    colProps: {
      span: 12
    },
    componentProps: {
      style: 'width:100%;',
      disabled: false,
      maxlength: 200,
      clearable: false
    },
    formItemProps: {
      rules: [
        required(),
        {
          validator: (rule: any, value: string, callback: Callback) =>
            notSpace(value, callback, '不能输入纯空格'),
          trigger: 'blur'
        }
      ]
    }
  },
  {
    field: 'type',
    label: '项目类型',
    component: 'Select',
    colProps: {
      span: 12
    },
    componentProps: {
      disabled: false,
      style: 'width:100%;',
      clearable: true,
      options: projectType,
      filterable: true
    },
    formItemProps: {
      rules: [required('该项为必选项')]
    }
  },
  {
    field: 'approvalReason',
    label: '立项目的',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      disabled: false,
      clearable: true,
      autosize: true,
      maxlength: 2000,
      style: 'width:100%',
      type: 'textarea',
      placeholder: '此项主要是写目前的状态、拟解决问题等描述'
    },
    formItemProps: {
      rules: [
        required(),
        {
          validator: (rule: any, value: string, callback: Callback) =>
            notSpace(value, callback, '不能输入纯空格'),
          trigger: 'blur'
        }
      ]
    }
  },
  {
    field: 'projectPlan',
    label: '项目方案',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      disabled: false,
      maxlength: 2000,
      clearable: true,
      autosize: true,
      style: 'width:100%',
      type: 'textarea',
      placeholder: '简述项目技术方案和主要工作内容'
    },
    formItemProps: {
      rules: [
        required(),
        {
          validator: (rule: any, value: string, callback: Callback) =>
            notSpace(value, callback, '不能输入纯空格'),
          trigger: 'blur'
        }
      ]
    }
  },
  {
    field: 'economicBenefits',
    label: '预期经济效益',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      disabled: false,
      maxlength: 500,
      clearable: true,
      autosize: true,
      style: 'width:100%',
      type: 'textarea'
    }
  },
  {
    field: 'innovatePoint',
    label: '创新点',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      disabled: false,
      maxlength: 500,
      clearable: true,
      autosize: true,
      style: 'width:100%',
      type: 'textarea',
      placeholder: '简述技术上、设计上的创新点'
    }
  },
  {
    field: 'participants',
    label: '项目主要参与人',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      disabled: false,
      maxlength: 500,
      clearable: true,
      autosize: true,
      style: 'width:100%',
      type: 'textarea'
    }
  },
  {
    field: 'timeAndPhase',
    label: '项目起止时间及阶段划分',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      disabled: false,
      maxlength: 500,
      clearable: true,
      autosize: true,
      style: 'width:100%',
      type: 'textarea'
    }
  },
  {
    field: 'achievement',
    label: '研究成果及形式',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      disabled: false,
      maxlength: 500,
      clearable: true,
      autosize: true,
      style: 'width:100%',
      type: 'textarea'
    }
  }
])
//表单
const formRef = ref<FormExpose>()
//是否显示本页面
const isShow = ref<boolean>(false)
//监听页面关闭
const { emitter } = useEmitt({
  name: 'drawer',
  callback: (type: string) => {
    if (type === 'closed') {
      resetFormAfterClose()
    }
  }
})
//是否显示保存按钮的加载等待
const loading = ref(false)
//保存数据
const save = async () => {
  //表单验证
  const form = unref(formRef)
  const elFormRef = form?.getElFormRef()
  await elFormRef?.validate(async (isValid) => {
    if (isValid) {
      loading.value = true
      let data = form?.formModel as ScientificData
      console.log('data', data)
      if (data.id && detailsId.value) {
        editScientific(data)
      } else {
        data.id = ''
        addScientific(data)
      }
    }
  })
}

//编辑
const editScientific = async (data: ScientificData) => {
  const res = await editScientificApi(data)
    .catch(() => {})
    .finally(() => {
      setTimeout(() => {
        loading.value = false
      }, 500)
    })
  if (res) {
    saveSuccess()
  }
}

//新增
const addScientific = async (data: ScientificData) => {
  const res = await saveScientificApi(data)
    .catch(() => {})
    .finally(() => {
      setTimeout(() => {
        loading.value = false
      }, 500)
    })
  if (res) {
    saveSuccess()
  }
}
//保存成功
const saveSuccess = () => {
  ElMessage.success('保存信息成功')
  emit('changeGetDetailAndList')
  closeDrawer()
}
//关闭drawer
const closeDrawer = () => {
  DialogFlag.value = false
  // drawerWrap.value.isShow = false
}
//重置页面
const resetFormAfterClose = () => {
  detailsId.value = null
  //重置表单
  setValue(true)
}
//获取详情
const getDetailsData = async (ids: number) => {
  detailsId.value = ids
  let params = {
    id: ids
  }
  const res = await getScientificApi(params)
  if (res && res.data) {
    culticateData = res.data
    setValues(culticateData)
  }
}
//表单赋值
const setValue = (reset: boolean) => {
  const elFormRef = unref(formRef)?.getElFormRef()
  if (reset) {
    elFormRef?.resetFields()
  } else {
    unref(formRef)?.setValues({
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
  }
}
//表单赋值
const setValues = (form: ScientificData) => {
  unref(formRef)?.setValues(form)
}
//弹框
const ElDialogFef = ref()
//打开弹框并初始化
const openDialog = (flag: string, id: number) => {
  DialogFlag.value = true
  ElDialogFef.value.isFullscreen = false
  //重置表单
  detailsId.value = null
  setValue(false)
  pageTite.value = props.dialogTitle + (flag === 'add' ? '新增' : flag === 'edit' ? '编辑' : '--')
  if (id) {
    getDetailsData(id)
  }
}

defineExpose({
  isShow,
  openDialog
})
</script>
 
<template>
  <ElDialog
    ref="ElDialogFef"
    v-model="DialogFlag"
    :maxHeight="'auto'"
    :title="pageTite"
    @closed="DialogFlag = false"
  >
    <Form :schema="schema" ref="formRef"> </Form>

    <template #footer>
      <div class="footer">
        <el-button type="primary" :loading="loading" @click="save"> 提交 </el-button>
        <el-button @click="closeDrawer"> 取消 </el-button>
      </div>
    </template>
  </ElDialog>
</template>
  
  <style lang="less" scoped>
:deep(.el-input-group__append) {
  background-color: white;
  width: 35px;
}

:deep(.el-input-number .el-input__inner) {
  text-align: left;
}
</style>
  