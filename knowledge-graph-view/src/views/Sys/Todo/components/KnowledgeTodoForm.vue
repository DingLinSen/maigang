<script lang="ts" setup>
import { Form, FormExpose } from '@/components/Form'
import { ref, unref, reactive, nextTick, watch, inject } from 'vue'
import { propTypes } from '@/utils/propTypes'

import { ElDialog } from '@/components/ElDialog'
import { useEmitt } from '@/hooks/web/useEmitt'
import { ElButton } from 'element-plus'
import { useValidator } from '@/hooks/web/useValidator'
import { FormSchema } from '@/types/form'

import { getFindByIdApi } from '@/api/classification/knowledge'

// 表单校验
type Callback = (error?: string | Error | undefined) => void
// 引入表单校验
const { required, notSpace } = useValidator()

const props = defineProps({
  isAction: propTypes.string.def(''),
  dialogTitle: propTypes.string.def(''), // 弹窗名
  title: propTypes.string.def('')
})

const dataList: any = inject('dataList')

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

const ElDialogFef = ref()
//打开drawer并初始化
const openDrawer = async (flag: string, id?: string, deptId?: string) => {
  //重置表单
  detailsId.value = ''
  resetValue()
  isSave.value = flag === 'see' ? false : true
  DialogFlag.value = true // 打开弹窗
  ElDialogFef.value.isFullscreen = false
  // 标题名称
  pageTite.value = props.title + (flag === 'add' ? '新增' : flag === 'edit' ? '编辑' : '详情')
  setFormHidden('password', flag === 'add' || flag === 'edit' ? true : false)

  if (flag == 'add') {
    nextTick(() => {
      setValues({
        parentId: deptId
      })
    })
  } else {
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
    // elFormRef?.resetFields(['postIds', 'roleIds'])
    tagTypeData = res.data
    tagTypeData.level = res.data.level ? res.data.level : '无'
    tagTypeData.parentId = res.data.parentId ? res.data.parentId : '无'
    tagTypeData.knowledgeName = res.data.knowledgeName ? res.data.knowledgeName : '无'
    tagTypeData.parentName = res.data.parentName ? res.data.parentName : '无'
    tagTypeData.note = res.data.note ? res.data.note : '无'
    tagTypeData.backReason = res.data.backReason ? res.data.backReason : '无'
    tagTypeData.createByName = res.data.createByName ? res.data.createByName : '无'
    tagTypeData.auditUserName = res.data.auditUserName ? res.data.auditUserName : '无'
    tagTypeData.createTime = res.data.createTime ? res.data.createTime : '无'
    // tagTypeData.status = res.data.status ? res.data.status : '无'

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
      disabled: true,
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
    field: 'parentId', // key
    label: '父分类', // label
    component: 'Select', // 使用组件
    colProps: {
      // 所占col
      span: 24
    },
    componentProps: {
      filterable: true,
      disabled: true,
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
      disabled: true,
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
  },
  {
    field: 'status', // key
    label: '审核状态', // label
    componentProps: {
      disabled: true,
      style: 'width:100%;', //宽度
      options: [
        {
          label: '待审核',
          value: 0
        },
        {
          label: '已审核',
          value: 1
        },
        {
          label: '已驳回',
          value: -1
        }
      ]
    },
    colProps: {
      // 所占col
      span: 24
    },
    component: 'Select'
  },
  {
    field: 'createByName', // key
    label: '创建人', // label
    componentProps: {
      disabled: true
    },
    colProps: {
      // 所占col
      span: 24
    },
    component: 'Input'
  },
  {
    field: 'auditUserName', // key
    label: '审核人', // label
    componentProps: {
      disabled: true
    },
    colProps: {
      // 所占col
      span: 24
    },
    component: 'Input'
  },
  {
    field: 'createTime', // key
    label: '创建时间', // label
    componentProps: {
      disabled: true
    },
    colProps: {
      // 所占col
      span: 24
    },
    component: 'Input'
  },
  {
    field: 'backReason', // key
    label: '驳回原因', // label
    colProps: {
      // 所占col
      span: 24
    },
    component: 'Input',
    componentProps: {
      disabled: true,
      row: 4,
      //组件配置
      type: 'textarea',
      style: 'width:100%;', //宽度
      maxlength: 500, //最大输入长度
      autosize: true,
      controlsPosition: 'right'
    }
  }
])

const formRef = ref<FormExpose>()

const isShow = ref<boolean>(false)

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

watch(dataList, () => {
  selectList = dataList
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
<style>
.cultivate-custom .el-dialog__body {
  height: calc(100% - 2.4vh - 4vh - (var(--el-dialog-padding-primary) + 0.71429rem) * 2);
}
</style>
