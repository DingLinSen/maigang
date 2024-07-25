<!-- 
  * 项目管理-培育项目-新增\编辑\查看界面
 -->
<script setup lang="ts">
import { Form, FormExpose } from '@/components/Form'
import { ref, unref, reactive, nextTick, getCurrentInstance, inject, watch } from 'vue'
import { propTypes } from '@/utils/propTypes'
import { useEmitt } from '@/hooks/web/useEmitt'
import { useValidator } from '@/hooks/web/useValidator'
import { FormSchema } from '@/types/form'
import { ElDialog } from '@/components/ElDialog'
import { CultivateData } from '@/api/project/cultivate/types'
import {
  saveCultivateApi, // 新增
  editCultivateApi, // 编辑
  getCultivateApi, // 获取信息
  changePrincipalPersonCultivateApi // 变更人
} from '@/api/project/cultivate'
import { ElButton, ElMessage, ElInput, ElTooltip, ElTimePicker } from 'element-plus'
import { projectType } from '../../config/config'

// callback 类型
type Callback = (error?: string | Error | undefined) => void

const emit = defineEmits(['changeGetDetailAndList'])

const { proxy } = getCurrentInstance() as any
const { province } = proxy.useDict('province')

const { required, notSpace } = useValidator()

// 接收父组件数据
const props = defineProps({
  dialogTitle: propTypes.string.def(''), // 弹窗名
  isAction: propTypes.string.def('')
})
// 弹窗的开启和关闭
const DialogFlag = ref<any>(false)
const isAlter = ref<boolean>(false)

const principalTree = inject<any>('principalTree')

let culticateData = reactive<CultivateData>({
  id: '',
  fileList: '',
  createBy: '',
  createTime: '',
  ownerName: '',
  planContent: '',
  estimatedAmount: undefined,
  updateBy: '',
  updateTime: '',
  remark: '',
  filePath: '',
  status: '0',
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
  principalPersonName: '',
  principalPerson: [],
  createByName: '',
  workflowInstanceId: null
})
const isSave = ref<boolean>(false)

const pageTite = ref<string>('')
const actionflag = ref<boolean>(false)

const detailsId = ref<number | string | null>(null)

//FormItem显示隐藏
const setFormHidden = (field: string, value: boolean) => {
  nextTick(() => {
    unref(formRef)?.setSchema([
      {
        field: field,
        path: 'hidden',
        value: value
      }
    ])
  })
}
const formDisabled = (obj: any, value: boolean) => {
  for (let key in obj) {
    unref(formRef)?.setSchema([
      {
        field: key,
        path: 'componentProps.disabled',
        value: value
      }
    ])
  }
}
const ElDialogFef = ref()
//打开drawer并初始化
const openDialog = (flag: string, id: number) => {
  console.log(flag)

  DialogFlag.value = true
  ElDialogFef.value.isFullscreen = false
  //重置表单
  detailsId.value = null
  nextTick(() => {
    formDisabled(culticateData, false)
  })

  // setValue(false)
  actionflag.value = flag === 'see' ? true : false
  isSave.value = flag === 'see' ? false : true
  isAlter.value = flag === 'alter' ? true : false
  pageTite.value =
    flag === 'alter'
      ? '变更'
      : props.dialogTitle + (flag === 'add' ? '新增' : flag === 'edit' ? '编辑' : '详情')

  setFormHidden('principalPerson', flag === 'alter' ? false : true)
  if (flag === 'alter') {
    if (id) {
      getDetailsData(id)
      nextTick(() => {
        formDisabled(culticateData, true)
        unref(formRef)?.setSchema([
          {
            field: 'principalPerson',
            path: 'componentProps.disabled',
            value: false
          }
        ])
      })
    }
  } else {
    formDisabled(culticateData, false)
    if (id) {
      nextTick(() => {
        formDisabled({ projectType: '' }, true)
      })
      getDetailsData(id)
    }
  }
}
const changeUploadfileList = (data: any) => {
  console.log('data', data)
}
const changeAmount = (num: any) => {
  console.log('num', num)

  var x = String(num).indexOf('.') + 1 //得到小数点的位置
  console.log(x)

  var y = String(num).length - x //小数点的位数
  if (x > 0 && y > 6) {
    unref(formRef)?.setValues({ estimatedAmount: Number(Number(num).toFixed(6)) })
  } else {
    unref(formRef)?.setValues({ estimatedAmount: num })
  }
}
// 表单项
const schema = ref<FormSchema[]>([
  {
    field: 'projectTitle',
    label: '项目名称',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      style: 'width:100%;',
      disabled: unref(isAlter.value),
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
    field: 'projectType',
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
    field: 'ownerName',
    label: '用户名称',
    component: 'Input',
    colProps: {
      span: 12
    },
    componentProps: {
      title: unref(culticateData.ownerName),
      disabled: false,
      maxlength: 100,
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
    field: 'estimatedAmount',
    label: '预计金额(万元)',
    value: null,
    component: 'Input',
    colProps: {
      span: 12
    },
    componentProps: {
      type: 'text',
      onChange: changeAmount,
      disabled: false,
      style: 'width:100%;',
      maxLength: 13,
      clearable: true
    },
    formItemProps: {
      rules: [
        required(),
        {
          validator: (rule: any, value: string, callback: Callback) =>
            notSpace(value, callback, '不能输入纯空格'),
          trigger: 'blur'
        },
        {
          validator: (rule: any, value: string, callback: Callback) => {
            if (/(^[1-9]{1}\d{0,4}$)|(^[0-9]{1}\d{0,4}[.]{1}[0-9]{1,6}$)/.test(value)) {
              callback()
            } else {
              callback(new Error('请输入大于0小于100000之间的数字，小数点后最多六位'))
            }
          },
          trigger: 'blur'
        }
      ]
    }
  },
  {
    field: 'principalPerson',
    label: '当前负责人',
    value: null,
    component: 'Cascader',
    colProps: {
      span: 12
    },
    componentProps: {
      style: 'width:100%;',
      filterable: true,
      disabled: false,
      clearable: true,
      options: principalTree,
      props: {
        label: 'deptName',
        value: 'deptId'
      },
      // maxlength: 3,
      controlsPosition: 'right'
    },
    formItemProps: {
      rules: [required('该项为必选项')]
    }
  },
  {
    field: 'province',
    label: '所属省份',
    component: 'Select',
    colProps: {
      span: 12
    },
    componentProps: {
      filterable: true,
      disabled: false,
      style: 'width:100%;',
      options: province,
      clearable: true
    },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'address',
    label: '详细地址',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      style: 'width:100%',
      disabled: false,
      maxlength: 200,
      clearable: true,
      type: 'textarea',
      rows: 1
    },
    formItemProps: {
      rules: [
        // required(),
        {
          validator: (rule: any, value: string, callback: Callback) =>
            notSpace(value, callback, '不能输入纯空格'),
          trigger: 'blur'
        }
      ]
    }
  },
  {
    field: 'planContent',
    label: '项目内容',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      disabled: false,
      maxlength: 1000,
      clearable: true,
      autosize: true,
      style: 'width:100%',
      type: 'textarea',
      rows: 1
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
  // {
  //   field: 'availableLimit',
  //   label: '可用额度',
  //   component: 'InputNumber',
  //   colProps: {
  //     span: 12
  //   },
  //   componentProps: {
  //     style: 'width:100%;',
  //     maxlength: 500,
  //     controlsPosition: 'right'
  //     // type: 'textarea',
  //     // rows: 3
  //   },
  //   formItemProps: {
  //     rules: [required()]
  //   }
  // },
  {
    field: 'fileList',
    label: '上传文件',
    component: 'FileUpload',
    componentProps: {
      style: 'width:100%',
      disabled: false,
      limit: 1, // 数量限制
      fileType: ['pdf', 'doc', 'docx', 'png', 'jpg', 'xls', 'xlsx', 'zip', 'rar'] // 文件类型
    },
    colProps: {
      span: 24
    }
  }
])

const formRef = ref<FormExpose>()

const isShow = ref<boolean>(false)

const { emitter } = useEmitt({
  name: 'drawer',
  callback: (type: string) => {
    if (type === 'closed') {
      resetFormAfterClose()
    }
  }
})

const loading = ref(false)
//保存数据
const save = async () => {
  //表单验证
  const form = unref(formRef)
  const elFormRef = form?.getElFormRef()
  await elFormRef?.validate(async (isValid) => {
    if (isValid) {
      loading.value = true
      let data = form?.formModel as CultivateData
      console.log('data', data)
      data.filePath = data.fileList
      if (isAlter.value) {
        if (data.id && detailsId.value) {
          // 变更
          alterPost(data)
        }
      } else {
        if (data.id && detailsId.value) {
          editPost(data)
        } else {
          data.id = ''
          addPost(data)
        }
      }
    }
  })
}

//编辑岗位
const editPost = async (data: CultivateData) => {
  const res = await editCultivateApi(true, data)
    .catch(() => {})
    .finally(() => {
      setTimeout(() => {
        loading.value = false
      }, 200)
    })
  if (res) {
    ElMessage.success('保存信息成功')
    emit('changeGetDetailAndList')
    closeDrawer()
  }
}

//新增岗位
const addPost = async (data: CultivateData) => {
  const res = await saveCultivateApi(data)
    .catch(() => {})
    .finally(() => {
      setTimeout(() => {
        loading.value = false
      }, 200)
    })
  if (res) {
    ElMessage.success('保存信息成功')
    emit('changeGetDetailAndList')
    closeDrawer()
  }
}

// 变更
const alterPost = async (data: any) => {
  try {
    let params = {
      id: detailsId.value,
      principalPerson:
        typeof data.principalPerson === 'number' && !isNaN(data.principalPerson)
          ? [data.principalPerson]
          : data.principalPerson[data.principalPerson.length - 1]
    }
    const res = await changePrincipalPersonCultivateApi(params)
      .catch(() => {})
      .finally(() => {
        setTimeout(() => {
          loading.value = false
        }, 200)
      })
    // console.log(res.data)

    if (res) {
      ElMessage.success('保存信息成功')
      emit('changeGetDetailAndList')
      closeDrawer()
    }
  } catch (error) {
    console.log(error)
  }
}
//关闭drawer
const closeDrawer = () => {
  DialogFlag.value = false
}

const resetFormAfterClose = () => {
  detailsId.value = ''
  //重置表单
  setValue(true)
}

//获取详情
const getDetailsData = async (ids: number) => {
  detailsId.value = ids
  let params = {
    id: ids
  }
  const res = await getCultivateApi(params)
  if (res && res.data) {
    culticateData = res.data
    culticateData.address = res.data.address
    culticateData.address = res.data.address
    culticateData.fileList = res.data.filePath
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
      id: '',
      fileList: '',
      createBy: '',
      createTime: '',
      ownerName: '',
      planContent: '',
      estimatedAmount: undefined,
      updateBy: '',
      updateTime: '',
      remark: '',
      filePath: '',
      status: '0',
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
      principalPersonName: '',
      createByName: '',
      workflowInstanceId: null
    })
  }
}

const setValues = (form: CultivateData) => {
  unref(formRef)?.setValues(form)
}

//表单禁用
const changeDisabled = (bool: boolean) => {
  unref(formRef)?.setProps({
    disabled: bool
  })
}

defineExpose({
  isShow,
  openDialog
})
</script>

<template>
  <!-- 可设置宽度 :dialogWidth="400" -->
  <ElDialog
    ref="ElDialogFef"
    class="cultivate-custom"
    v-model="DialogFlag"
    :title="pageTite"
    @closed="DialogFlag = false"
  >
    <!-- <Form :schema="schema" ref="formRef" /> -->
    <Form :schema="schema" ref="formRef">
      <!-- <template #estimatedAmount>
        <ElInput
          v-model="unref(culticateData).estimatedAmount"
          :disabled="false"
          style="width: 100%"
          :maxLength="13"
          :clearable="true"
                    placeholder="请输入"
          @change="changeAmount"
          placeholder="请输入"
        />
      </template> -->
    </Form>

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
