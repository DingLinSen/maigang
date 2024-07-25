<script setup lang="ts">
import { ref, unref, reactive, PropType, onMounted, nextTick, watch, getCurrentInstance } from 'vue'
import { ElButton, ElMessage, CascaderValue } from 'element-plus'

import { Dialog } from '@/components/Dialog'
import { Form, FormExpose } from '@/components/Form'
import { useEmitt } from '@/hooks/web/useEmitt'
import { useValidator } from '@/hooks/web/useValidator'
import { useCache } from '@/hooks/web/useCache'
import { useAppStore } from '@/store/modules/app'
import { FormSchema } from '@/types/form'
import { listToTree } from '@/utils/tree'
import { propTypes } from '@/utils/propTypes'
// import { selectionEdit } from '@/utils'
import { getTableDetApi, saveTableApi, updateTableApi } from '@/api/sys/dept'
import { TableData, DeptData } from '@/api/sys/dept/types'
import { getAllDeptListApi } from '@/api/common'

const { proxy } = getCurrentInstance() as any

const $emit = defineEmits(['getDeptList'])
// 表单校验
type Callback = (error?: string | Error | undefined) => void
const { required, validatePositiveIntegerN } = useValidator()
const appStore = useAppStore()
const { wsCache } = useCache()
const userInfo = wsCache.get(appStore.getUserInfo)
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

//Cascader选择任意一级选项
const propsCascader = {
  checkStrictly: true
}

// 上级部门选择
let deptList = ref<any>([])
// const setDeptTreeData = () => {
//   nextTick(() => {
//     unref(formRef)?.setSchema([
//       {
//         field: 'parentIds',
//         path: 'componentProps.options',
//         value: deptList
//       }
//     ])
//   })
// }
const deptTreeChange = (_: CascaderValue) => {}
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
      props: propsCascader,
      disabled: true
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
    colProps: {
      span: 8
    },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'orderNum',
    label: '显示顺序',
    value: null,
    component: 'Input',
    componentProps: {
      style: 'width:100%;',
      maxlength: 6,
      controlsPosition: 'right',
      type: 'number'
    },
    colProps: {
      span: 8
    },
    formItemProps: {
      rules: [
        required(),
        {
          validator: (_: any, value: string, callback: Callback) => {
            validatePositiveIntegerN(value, callback, 6, '请输入6位以内正整数')
          },
          trigger: 'blur'
        }
      ]
    }
  }
])

watch(
  () => props.tableData,
  (val) => {
    deptList.value = val
  },
  {
    immediate: true
  }
)
const detailData = ref()

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
const allDeptList = ref<any>([])
const getAllDeptList = async () => {
  const param = {}
  const res: any = await getAllDeptListApi(param)
  if (res) {
    res.data.forEach((item) => {
      item.label = item.deptName
      item.value = item.deptId
    })
    let data = listToTree(res.data, {
      id: 'deptId',
      children: 'children',
      pid: 'parentId'
    })
    allDeptList.value = data
    unref(formRef)?.setSchema([
      {
        field: 'parentIds',
        path: 'componentProps.options',
        value: allDeptList.value
      }
    ])
  }
}

const isSave = ref<boolean>(false)
const pageTite = ref<string>('')
const detailsId = ref<string>('')

//打开drawer并初始化
const openDrawer = (flag: string, id: string) => {
  isShow.value = true
  getAllDeptList()
  nextTick(() => {
    //重置表单
    detailsId.value = ''
    setValue(true)
    isSave.value = flag === 'see' ? false : true
    changeDisabled(flag === 'see')
    pageTite.value = props.title + (flag === 'add' ? '新增' : flag === 'edit' ? '编辑' : '详情')
    setFormHidden('parentIds', id || userInfo.dept.parentId ? false : true)
    // setDeptTreeData()
    detailData.value = null

    if (flag === 'add') {
      if (id) {
        getParentIds(id)
      } else {
        unref(formRef)?.setValues({
          parentIds: userInfo.dept.parentId ? [userInfo.dept.parentId] : [0],
          status: '0'
        })
      }
    } else {
      getDetailsData(id)
    }
  })
}
const defaultParentIds = ref<any>([])
const initParentId = (data, idList, result) => {
  data.map((item) => {
    let d = idList.find((s) => s === item.deptId)
    if (d) {
      defaultParentIds.value.push(item.deptId)
      result.push(item.deptId)
    }
    if (item.children) {
      initParentId(item.children, idList, result)
    }
  })
  return result
}
const getParentIds = async (id: string) => {
  defaultParentIds.value = []
  await getTableDetApi(id).then((res) => {
    if (res && res.data) {
      let idList = res.data.ancestors
        .split(',')
        .filter((_: any, index: any) => index !== 0)
        .map((value) => Number(value))
      idList.push(Number(id))
      detailData.value = res.data
      defaultParentIds.value = initParentId(allDeptList.value, idList, [])

      nextTick(() => {
        unref(formRef)?.setValues({
          parentIds: defaultParentIds.value,
          status: '0'
        })
      })
    }
  })
}
//保存数据
const save = async () => {
  //表单验证
  const form = unref(formRef)
  const elFormRef = form?.getElFormRef()
  await elFormRef?.validate(async (isValid) => {
    if (isValid) {
      loading.value = true
      const data = form?.formModel as DeptData
      const list = detailData.value?.originLevelId.split(',')
      if (data.parentIds && data.parentIds.length > 0) {
        data.parentId = data.parentIds[data.parentIds.length - 1]
      } else {
        data.parentId = list?.length ? list[list.length - 1] : 0
      }
      data.originLevelId = detailData.value?.originLevelId || ''
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
  let list = detailData.value?.levelName.split('/')
  list[list.length - 1] = data.deptName
  data.levelName = list.join('/')
  const res = await updateTableApi(data)
    .catch(() => {})
    .finally(() => {
      nextTick(() => {
        setTimeout(() => {
          loading.value = false
        }, 300)
      })
    })
  if (res) {
    ElMessage.success('成功保存信息')
    emitter.emit('getDeptList', 'edit')
    closeDrawer()
  }
}

//新增
const addDept = async (data: DeptData) => {
  data.deptId = ''
  data.levelName = detailData.value?.levelName
    ? detailData.value?.levelName + '/' + data.deptName
    : data.deptName
  const res = await saveTableApi(data)
    .catch(() => {})
    .finally(() => {
      nextTick(() => {
        setTimeout(() => {
          loading.value = false
        }, 300)
      })
    })
  if (res) {
    ElMessage.success('成功保存信息')
    emitter.emit('getDeptList', 'add')
    closeDrawer()
  }
}
//关闭drawer
const closeDrawer = () => {
  $emit('getDeptList')
  isShow.value = false
}

const resetFormAfterClose = () => {
  detailsId.value = ''
  //重置表单
  setValue(true)
}
const setFormValue = (form: any) => {
  nextTick(() => {
    let idList = form.ancestors
      .split(',')
      .filter((_: any, index: any) => index !== 0)
      .map((value) => Number(value))

    form.parentIds = idList
    unref(formRef)?.setValues(form)
  })
}

//获取详情
const getDetailsData = async (id: string) => {
  detailsId.value = id
  await getTableDetApi(id).then((res) => {
    if (res && res.data) {
      detailData.value = res.data
      const formData = Object.assign({}, res.data)
      setFormHidden('parentIds', formData.parentId === 0 ? true : false)
      setFormValue(formData)
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
  <Dialog v-model="isShow" width="70%" :maxHeight="'auto'" :title="pageTite" @close="closeDrawer">
    <Form :schema="schema" ref="formRef" class="form-content" />
    <template #footer>
      <div class="details-footer">
        <ElButton @click="closeDrawer"> 取消 </ElButton>
        <ElButton v-if="isSave" type="primary" :loading="loading" @click="save"> 保存 </ElButton>
      </div>
    </template>
  </Dialog>
</template>
