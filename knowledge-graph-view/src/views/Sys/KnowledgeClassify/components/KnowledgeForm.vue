<script lang="ts" setup>
import { Form, FormExpose } from '@/components/Form'
import { ref, unref, reactive, nextTick, watch, inject } from 'vue'
import { propTypes } from '@/utils/propTypes'
import { ElDialog } from '@/components/ElDialog'
import { useEmitt } from '@/hooks/web/useEmitt'
import { ElButton, ElMessage } from 'element-plus'
import { useValidator } from '@/hooks/web/useValidator'
import { FormSchema } from '@/types/form'
import { useCache } from '@/hooks/web/useCache'

import { tagTypeAddApi, editKonwledgApi, getFindByIdApi } from '@/api/classification/knowledge'

// 表单校验
type Callback = (error?: string | Error | undefined) => void

const { wsCache } = useCache()
// 引入表单校验
const { required, notSpace } = useValidator()

const props = defineProps({
  isAction: propTypes.string.def(''),
  dialogTitle: propTypes.string.def(''), // 弹窗名
  title: propTypes.string.def('')
})

const dataList: any = inject('dataList')
const editPreListData: any = inject('editPreListData')

let preListData = editPreListData
let selectList = dataList

// 弹窗的开启和关闭
const DialogFlag = ref<any>(false)

const isSave = ref<boolean>(false)
const pageTite = ref<string>('')

const detailsId = ref<string>()

// 初始化数据
let tagTypeData = reactive<any>({
  level: '',
  knowledgeName: '',
  parentName: '',
  note: ''
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

const ElDialogFef = ref()
//打开drawer并初始化
const openDrawer = async (flag: string, id?: string, level?: string) => {
  //重置表单
  detailsId.value = ''
  resetValue()
  isSave.value = flag === 'see' ? false : true
  DialogFlag.value = true // 打开弹窗
  ElDialogFef.value.isFullscreen = false
  // 标题名称
  pageTite.value = props.title + (flag === 'add' ? '新增' : flag === 'edit' ? '编辑' : '详情')
  // setFormHidden('password', flag === 'add' || flag === 'edit' ? true : false)
  setFormHidden('parentId', !level ? true : false)

  if (flag == 'add') {
    if (level) {
      nextTick(() => {
        formDisabled({ parentId: 0 }, true)
        setValues({
          parentId: id
        })
      })
    }
    //
  } else {
    // setFormHidden('parentId', false)
    nextTick(() => {
      formDisabled({ parentId: 0 }, true)
      setValues({
        parentId: 0
      })
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
    tagTypeData.level = res.data.level
    tagTypeData.parentId = res.data.parentId ? res.data.parentId : null
    tagTypeData.auditUserId = res.data.auditUserId ? res.data.auditUserId : null
    tagTypeData.knowledgeName = res.data.knowledgeName
    tagTypeData.parentName = res.data.parentName
    tagTypeData.note = res.data.note
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
    field: 'knowledgeName', // key
    label: '知识分类', // label
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
      maxlength: 30, //最大输入长度
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
    field: 'parentId', // key
    label: '父分类', // label
    component: 'Select', // 使用组件
    colProps: {
      // 所占col
      span: 24
    },
    componentProps: {
      filterable: true,
      style: 'width:100%;', //宽度
      options: selectList
    },
    formItemProps: {
      // 表单校验
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
    field: 'note', // key
    label: '分类说明', // label
    component: 'Input', // 使用组件
    colProps: {
      // 所占col
      span: 24
    },
    componentProps: {
      disabled: false,
      //组件配置
      type: 'textarea',
      style: 'width:100%;', //宽度
      maxlength: 1000, //最大输入长度
      autosize: true,
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
  }
  // {
  //   field: 'auditUserId', // key
  //   label: '审核人', // label
  //   component: 'Select', // 使用组件
  //   colProps: {
  //     // 所占col
  //     span: 24
  //   },
  //   componentProps: {
  //     filterable: true,
  //     style: 'width:100%;', //宽度
  //     options: preListData
  //   },
  //   formItemProps: {
  //     // 表单校验
  //     rules: [
  //       {
  //         validator: (rule: any, value: string, callback: Callback) =>
  //           notSpace(value, callback, '不能输入纯空格'),
  //         trigger: 'blur'
  //       }
  //     ]
  //   }
  // }
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
      data.level = data.parentId == 0 ? '2' : '1'
      data.knowledgeName = data.knowledgeName ? data.knowledgeName : ''
      data.auditUserId = data.auditUserId ? data.auditUserId : wsCache.get('userInfo').userId
      data.auditUserName = data.auditUserId
        ? getElTagLabel(data.auditUserId)
        : wsCache.get('userInfo').userName
      data.parentId = data.parentId ? data.parentId : 0
      data.note = data.note ? data.note : ''
      data.id = detailsId.value ? detailsId.value : ''
      // data.menuIds = menuIds.value
      if (data.id && detailsId.value) {
        editUser(data)
      } else {
        data.id = ''
        addUser(data)
      }
    }
  })
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
    emitter.emit('getList', 'add')
    closeDrawer()
  }
}

//新增
const addUser = async (data: any) => {
  const res = await tagTypeAddApi(data)
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

const setValue = () => {
  const elFormRef = unref(formRef)?.getElFormRef()
  elFormRef?.resetFields()
}

const getElTagLabel = (value: string): string => {
  let label = ''
  if (value == 1) {
    label = 'admin'
  }
  unref(preListData).forEach((item: any) => {
    if (Number(value) === Number(item.value)) {
      label = item.label
    }
  })
  return label
}

//表单禁用
const changeDisabled = (bool: boolean) => {
  nextTick(() => {
    unref(formRef)?.setProps({
      disabled: bool
    })
  })
}

watch(dataList, () => {
  selectList = dataList
})

watch(editPreListData, () => {
  preListData = editPreListData
})

defineExpose({
  isShow,
  openDrawer
})
</script>

<template>
  <!-- 可设置宽度 :dialogWidth="400" -->
  <ElDialog
    ref="ElDialogFef"
    v-model="DialogFlag"
    :title="pageTite"
    class="cultivate-custom"
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
  max-width: 100px;
}
</style>
