<script lang="ts" setup>
import { Form, FormExpose } from '@/components/Form'
import { ref, unref, reactive, nextTick, watch, inject } from 'vue'
import { propTypes } from '@/utils/propTypes'

import { ElDialog } from '@/components/ElDialog'
import { useEmitt } from '@/hooks/web/useEmitt'
import { ElButton, ElMessage } from 'element-plus'
import { useValidator } from '@/hooks/web/useValidator'
import { FormSchema } from '@/types/form'

import { tagAddApi, editKonwledgApi, getFindByIdApi } from '@/api/classification/tagManagement'
const emit = defineEmits(['emitSuccess'])
// 表单校验
type Callback = (error?: string | Error | undefined) => void
// 引入表单校验
const { required, notSpace } = useValidator()

const props = defineProps({
  isAction: propTypes.string.def(''),
  dialogTitle: propTypes.string.def(''), // 弹窗名
  title: propTypes.string.def('')
})

const treedata: any = inject('treedata')
const kist: any = inject('kist')
let selectList = treedata

// 弹窗的开启和关闭
const DialogFlag = ref<any>(false)

const isSave = ref<boolean>(false)
const pageTite = ref<string>('')

const detailsId = ref<string>()

// 初始化数据
let tagTypeData = reactive<any>({
  name: '',
  tagTypeId: null
  // status: ''
})
// 表单部分禁用
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
const toList = ref()
const ElDialogFef = ref()
//打开drawer并初始化
const openDrawer = async (flag: string, id?: string) => {
  //重置表单
  detailsId.value = ''
  resetValue()
  isSave.value = flag === 'see' ? false : true
  DialogFlag.value = true // 打开弹窗
  ElDialogFef.value.isFullscreen = false
  // 标题名称
  pageTite.value = props.title + (flag === 'add' ? '新增' : flag === 'edit' ? '编辑' : '详情')
  setFormHidden('password', flag === 'add' || flag === 'edit' ? true : false)

  if (flag != 'add') {
    nextTick(() => {
      getDetailsData(id)
    })
  }
}
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

//根据id获取详情
const getDetailsData = async (id?: string | undefined) => {
  // const elFormRef = unref(formRef)?.getElFormRef()
  detailsId.value = id
  const res: any = await getFindByIdApi({ id: id })

  if (res && res.data) {
    tagTypeData = res.data
    tagTypeData.tagTypeId = res.data.tagTypeId ? res.data.tagTypeId : ''
    tagTypeData.name = res.data.name
    setValues(tagTypeData)
  }
}
//表单赋值
const resetValue = () => {
  const elFormRef = unref(formRef)?.getElFormRef()
  elFormRef?.resetFields()
}

const dataSelectDisable = (data: any) => {
  if (data.length) {
    data.forEach((item: any) => {
      if (item.children) {
        data.children = dataSelectDisable(item.children)
      }
    })

    return data
  } else {
    return []
  }
}

// 表单项
const schema = reactive<FormSchema[]>([
  {
    field: 'name', // key
    label: '标签名称', // label
    component: 'Input', // 使用组件
    colProps: {
      // 所占col
      span: 24
    },
    componentProps: {
      autocomplete: 'new-password',
      disabled: false,
      //组件配置
      style: 'width:100%;', //宽度
      maxlength: 200, //最大输入长度
      controlsPosition: 'right'
    },
    formItemProps: {
      // 表单校验
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
    field: 'tagTypeId', // key
    label: '标签分类', // label
    colProps: {
      // 所占col
      span: 24
    },
    component: 'Cascader',
    componentProps: {
      placeholder: '请选择标签分类',
      filterable: true,
      options: selectList,
      popperClass: 'tagpor',
      props: {
        checkStrictly: true,
        label: 'label',
        value: 'id'
      },

      style: 'width:100%;' //宽度
    },
    formItemProps: {
      // 表单校验
      rules: [
        required(),
        {
          validator: (rule: any, value: string, callback: Callback) =>
            notSpace(value, callback, '不能输入纯空格'),
          trigger: 'blur'
        }
      ]
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
      let data = form?.formModel as any
      data.name = data.name ? data.name : ''

      if (Array.isArray(data.tagTypeId)) {
        data.tagTypeId = data.tagTypeId ? data.tagTypeId[data.tagTypeId.length - 1] : ''
        data.tagTypeName = data.tagTypeId ? getElTagLabel(data.tagTypeId) : ''
      } else {
        data.tagTypeId = data.tagTypeId || data.tagTypeId == 0 ? data.tagTypeId : ''
        data.tagTypeName = data.tagTypeId ? getElTagLabel(data.tagTypeId) : ''
      }
      // data.tagTypeName =
      // data.status = data.status || data.status === 0 ? data.status : ''
      data.id = detailsId.value ? detailsId.value : ''
      if (data.id && detailsId.value) {
        editUser(data)
      } else {
        data.id = ''
        addUser(data)
      }
    }
  })
}

const getElTagLabel = (value: string): string => {
  let label = '--'
  toList.value.forEach((item: any) => {
    if (Number(value) === Number(item.id)) {
      label = item.tagTypeName
    }
  })
  return label
}

//编辑
const editUser = async (data: any) => {
  const res = await editKonwledgApi(data)
    .catch(() => {})
    .finally(() => {
      setTimeout(() => {
        loading.value = false
      }, 200)
    })
  if (res) {
    ElMessage.success('保存信息成功')
    emit('emitSuccess')
    closeDrawer()
  }
}

//新增
const addUser = async (data: any) => {
  const res = await tagAddApi(data)
    .catch(() => {})
    .finally(() => {
      setTimeout(() => {
        loading.value = false
      }, 200)
    })
  if (res) {
    ElMessage.success('保存信息成功')
    emit('emitSuccess')
    closeDrawer()
  }
}

//关闭drawer
const closeDrawer = () => {
  DialogFlag.value = false
}

const resetFormAfterClose = () => {
  detailsId.value = ''
  //重置表单
  setValue()
}

const setValues = (form: any) => {
  unref(formRef)?.setValues(form)
}

//表单赋值
const setValue = () => {
  const elFormRef = unref(formRef)?.getElFormRef()
  elFormRef?.resetFields()
}

watch(treedata, () => {
  selectList = treedata
})

watch(kist, () => {
  toList.value = kist.value
})

defineExpose({
  isShow,
  openDrawer
})
</script>

<template>
  <!-- 可设置宽度 :dialogWidth="400" -->
  <ElDialog
    class="tagDialog cultivate-custom"
    ref="ElDialogFef"
    v-model="DialogFlag"
    :title="pageTite"
    @closed="DialogFlag = false"
  >
    <!-- 角色 -->
    <Form ref="formRef" :schema="schema" class="userForm"> </Form>
    <template #footer>
      <div class="footer">
        <el-button :loading="loading" type="primary" @click="save"> 提交</el-button>
        <el-button @click="closeDrawer"> 取消</el-button>
      </div>
    </template>
  </ElDialog>
</template>
<style lang="less" scoped>
:deep(.el-popper) {
  max-width: 700px !important;
}
</style>

<style>
.tagpor {
  /* max-width: 810px !important; */
}
</style>
