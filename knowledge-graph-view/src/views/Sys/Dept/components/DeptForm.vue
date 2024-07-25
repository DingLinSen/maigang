<script setup lang="ts">
import { Form, FormExpose } from '@/components/Form'
import {
  ref,
  unref,
  reactive,
  defineComponent,
  PropType,
  onMounted,
  nextTick,
  toRaw,
  watch,
  getCurrentInstance
} from 'vue'
import {
  getAllUserListApi // 获取所有用户
} from '@/api/user'
import type { DeptFormData } from '@/api/sys/dept/type'
import {
  getAllDeptListApi // 获取所有部门
} from '@/api/sys/dept'
import { ContentWrap } from '@/components/ContentWrap'
import { propTypes } from '@/utils/propTypes'
import { DrawerWrap } from '@/components/DrawerWrap'
import { useEmitt } from '@/hooks/web/useEmitt'
import { ElButton, ElMessage, CascaderValue } from 'element-plus'
import { useValidator } from '@/hooks/web/useValidator'
import { FormSchema } from '@/types/form'
import { getTableDetApi, saveTableApi, updateTableApi } from '@/api/sys/dept'
import { TableData, DeptData } from '@/api/sys/dept/types'
import { ElDialog } from '@/components/ElDialog'
import { listToTree } from '@/utils/tree'

const { proxy } = getCurrentInstance() as any
const { sys_normal_disable } = proxy.useDict('sys_normal_disable')

// 弹窗的开启和关闭
const DialogFlag = ref<any>(false)
const ElDialogFef = ref()

// 表单校验
type Callback = (error?: string | Error | undefined) => void
const $emit = defineEmits(['formAdd'])
const { required, notSpace, validateEmail, validatePhone, validatePhoneNumber } = useValidator()

const props = defineProps({
  title: propTypes.string.def(''),
  tableData: {
    type: Array as PropType<TableData[]>,
    default: () => []
  }
})
const formRef = ref<FormExpose>()
const isShow = ref<boolean>(false)
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

let deptFormData = reactive<DeptFormData>({
  deptId: '',
  deptName: '',
  parentName: '',
  parentId: null,
  orderNum: null,
  ancestors: '',
  delFlag: '',
  email: '',

  params: '',
  phone: '',
  remark: '',
  searchValue: '',
  status: '',
  parentIds: [],
  leader: []
})
//Cascader选择任意一级选项
const propsCascader = {
  checkStrictly: true
}

// 上级部门选择
let deptList = ref([])
const setDeptTreeData = () => {
  nextTick(() => {
    unref(formRef)?.setSchema([
      {
        field: 'parentIds',
        path: 'componentProps.options',
        value: deptList
      }
    ])
  })
}

let deptData = ref<any>([])
const userData = ref<any>([])
const principalTree = ref<any>([])
//获取所有部门
const getAllDeptlist = async () => {
  getAllUserlist()
}

//获取所有用户
const getAllUserlist = async () => {
  try {
    let params = {
      pageSize: 999999,
      pageNum: 1
    }
    const res = await getAllDeptListApi({})
    const { data } = await getAllUserListApi({})
    deptData.value = res.data
    userData.value = data

    getprincipalTree()

    return data
  } catch (error) {
    console.log(error)
  }
}
const getprincipalTree = async () => {
  if (deptData.value.length) {
    deptData.value.forEach((deptItem: any) => {
      userData.value.forEach((userItem: any) => {
        if (deptItem.deptId === userItem.deptId) {
          deptItem.children.push({
            deptId: userItem.userId,
            deptName: userItem.nickName
          })
        }
      })
    })
    principalTree.value = listToTree(deptData.value, {
      id: 'deptId',
      children: 'children',
      pid: 'parentId'
    })
  }
}
const deptTreeChange = (value: CascaderValue) => {}
const schema = reactive<FormSchema[]>([
  {
    field: 'parentIds',
    label: '上级部门',
    component: 'Cascader',
    componentProps: {
      onChange: deptTreeChange,
      style: 'minWidth:100%;',
      clearable: false,
      options: props.tableData,
      props: propsCascader
    },
    colProps: {
      span: 24
    },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'deptName',
    label: '部门名称',
    component: 'Input',
    componentProps: {
      maxlength: 10 //最大输入长度
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
    field: 'cn',
    label: 'cn',
    component: 'Input',
    componentProps: {
      maxlength: 10 //最大输入长度
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
    field: 'orderNum',
    label: '排序',
    component: 'InputNumber',
    componentProps: {
      style: 'width:100%;',
      min: 1,
      max: 999999,
      precision: 0,
      controlsPosition: 'right'
    },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'leader',
    label: '负责人',

    component: 'Cascader',
    componentProps: {
      placeholder: '请选择',
      style: 'width:100%;',
      filterable: true,
      disabled: false,
      clearable: true,
      options: principalTree,

      props: {
        label: 'deptName',
        value: 'deptId'
      }
    },
    formItemProps: {
      rules: [
        {
          validator: (rule: any, value: string, callback: Callback) =>
            notSpace(value, callback, '不能输入纯空格'),
          trigger: 'blur'
        }
      ]
    }
  },
  {
    field: 'phone',
    label: '联系电话',
    component: 'Input',
    componentProps: {
      maxlength: 15 //最大输入长度
    },
    formItemProps: {
      rules: [
        {
          validator: (rule: any, value: string, callback: Callback) =>
            notSpace(value, callback, '不能输入纯空格'),
          trigger: 'blur'
        },
        {
          validator: (rule: any, value: string, callback: Callback) => {
            if (value) {
              validatePhoneNumber(value, callback, '请输入正确的手机号或(区号)+电话号码')
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }
      ]
    }
  },
  {
    field: 'email',
    label: '邮箱',
    component: 'Input',
    componentProps: {
      maxlength: 50 //最大输入长度
    },
    formItemProps: {
      rules: [
        {
          validator: (rule: any, value: string, callback: Callback) =>
            notSpace(value, callback, '不能输入纯空格'),
          trigger: 'blur'
        },
        {
          validator: (rule: any, value: string, callback: Callback) => {
            if (value) {
              validateEmail(value, callback, '请输入正确的邮箱格式,如1465555@qq.com')
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }
      ]
    }
  },
  {
    field: 'status',
    label: '状态',
    component: 'Radio',
    value: '0',
    componentProps: {
      options: sys_normal_disable
    }
  }
])

watch(
  () => props.tableData,
  (val) => {
    deptList.value = val
    // console.log('deptTreeChange', toRaw(deptList), toRaw(schema))
  },
  {
    immediate: true
  }
)
// 操作类型
let operateType = ref('')

const { emitter } = useEmitt({
  name: 'drawer',
  callback: (type: string) => {
    if (type === 'closed') {
      resetFormAfterClose()
    }
  }
})
onMounted(() => {})
const loading = ref(false)

//保存数据
const save = async () => {
  //表单验证
  const form = unref(formRef)
  const elFormRef = form?.getElFormRef()
  await elFormRef?.validate(async (isValid) => {
    if (isValid) {
      loading.value = true
      const data = form?.formModel as DeptData
      if (data.parentIds && data.parentIds.length > 0) {
        data.parentId = data.parentIds[data.parentIds.length - 1]
      } else {
        data.parentId = 0
      }
      data.leader = data.leader[data.leader.length - 1]
      console.log(data)

      // console.log('data==>', toRaw(data))
      if (detailsId.value) {
        editDept(data)
      } else {
        addDept(data)
      }
    }
  })
}

//编辑
const editDept = async (data: DeptData) => {
  const res = await updateTableApi(data)
    .catch(() => {})
    .finally(() => {
      setTimeout(() => {
        loading.value = false
      }, 200)
    })
  if (res) {
    ElMessage.success('保存信息成功')
    emitter.emit('getList', 'add')
    closeDrawer()
  }
}

//新增
const addDept = async (data: DeptData) => {
  data.deptId = ''
  const res = await saveTableApi(data)
    .catch(() => {})
    .finally(() => {
      setTimeout(() => {
        loading.value = false
      }, 200)
    })
  if (res) {
    ElMessage.success('保存信息成功')
    emitter.emit('getList', 'add')
    closeDrawer()
  }
}

const isSave = ref<boolean>(false)
const pageTite = ref<string>('')
const drawerWrap = ref<ComponentRef<typeof DrawerWrap>>()
const detailsId = ref<string>('')

//打开drawer并初始化
const openDrawer = (flag: string, id: string) => {
  operateType.value = flag
  //重置表单
  detailsId.value = ''
  setValue(true)
  isSave.value = flag === 'see' ? false : true
  changeDisabled(flag === 'see')
  pageTite.value = props.title + (flag === 'add' ? '新增' : flag === 'edit' ? '编辑' : '详情')
  // drawerWrap.value.isShow = true
  DialogFlag.value = true // 打开弹窗
  ElDialogFef.value.isFullscreen = false
  setFormHidden('parentIds', id ? false : true)
  getAllDeptlist()
  setDeptTreeData()

  if (flag === 'add') {
    if (id) {
      getParentids(id)
    } else {
      unref(formRef)?.setValues({
        parentIds: [0],
        status: '0'
      })
    }
  } else {
    getDetailsData(id)
  }
  console.log('props.tableData', props.tableData)
}

const getParentids = async (id: string) => {
  await getTableDetApi(id).then((res) => {
    if (res && res.data) {
      console.log('==========>', res.data)
      let idList = res.data.ancestors
        .split(',')
        .filter((item: any, index: any) => index !== 0)
        .map((value) => Number(value))
      idList.push(Number(id))
      console.log('==========>', idList)
      unref(formRef)?.setValues({
        parentIds: idList,
        status: '0'
      })
    }
  })
}
//关闭drawer
const closeDrawer = () => {
  // $emit('formAdd')
  // drawerWrap.value.isShow = false
  DialogFlag.value = false
}

const resetFormAfterClose = () => {
  detailsId.value = ''
  //重置表单
  setValue(true)
}
const setFormValue = (form: any) => {
  nextTick(() => {
    console.log(form.ancestors.split(','))
    let idList = form.ancestors
      .split(',')
      .filter((item: any, index: any) => index !== 0)
      .map((value) => Number(value))
    console.log(idList)

    form.parentIds = idList
    // form.leader = [Number(form.leader)]
    console.log('form', form)

    unref(formRef)?.setValues(form)
    // unref(formRef)?.setValues({ leader: form.leader })
  })
}

//获取详情
const getDetailsData = async (id: string) => {
  detailsId.value = id
  await getTableDetApi(id).then((res) => {
    if (res && res.data) {
      deptFormData = res.data
      let formData = Object.assign({}, res.data)
      // let dd: any = []
      // dd.push(res.data.leader)
      deptFormData.leader = Number(res.data.leader)
      console.log('deptFormData', deptFormData)

      nextTick(() => {
        setFormHidden('parentIds', formData.parentId === 0 ? true : false)
        setFormValue(deptFormData)
      })
    }
  })
}

//表单赋值
const setValue = (reset: boolean) => {
  const elFormRef = unref(formRef)?.getElFormRef()
  if (reset) {
    elFormRef?.resetFields()
  } else {
    // unref(formRef)?.setValues({
    //   field1: 'field1',
    //   field2: '2',
    //   field3: '2',
    //   field4: ['1', '3'],
    //   field5: '2022-01-27',
    //   field6: '17:00'
    // })
  }
}

//表单禁用
const changeDisabled = (bool: boolean) => {
  unref(formRef)?.setProps({
    disabled: bool
  })
}

defineExpose({
  isShow,
  openDrawer
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
    <Form :schema="schema" ref="formRef" />
    <template #footer>
      <div class="footer">
        <el-button type="primary" :loading="loading" @click="save"> 提交 </el-button>
        <el-button @click="closeDrawer"> 取消 </el-button>
      </div>
    </template>
  </ElDialog>
</template>

<style lang="less" scoped>
:deep(.el-input-number .el-input__inner) {
  text-align: left;
}
</style>
