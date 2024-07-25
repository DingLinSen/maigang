<script setup lang="ts">
import { ref, unref, reactive, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { propTypes } from '@/utils/propTypes'
import { FormSchema } from '@/types/form'
import { useValidator } from '@/hooks/web/useValidator'
import { useEmitt } from '@/hooks/web/useEmitt'
import { Dialog } from '@/components/Dialog'
import { Form, FormExpose } from '@/components/Form'
// 表单校验
type Callback = (error?: string | Error | undefined) => void
const { required, validateNumberIntN } = useValidator()
const formRef = ref<FormExpose>()
const isEdit = ref<boolean>(false)
const schema = reactive<FormSchema[]>([
  {
    field: 'planNumber',
    label: '农机装备编码',
    component: 'Input',
    colProps: {
      span: 8
    },
    componentProps: {
      maxlength: 10,
      clearable: false
    },
    formItemProps: {
      rules: [
        required(),
        {
          validator: (_: any, value: string, callback: Callback) =>
            validateNumberIntN(value, callback, 10, '请输入10位以内数字类型'),
          trigger: 'blur'
        }
      ]
    }
  },

  {
    field: 'name',
    label: '名称',
    component: 'Input',
    colProps: {
      span: 8
    },
    componentProps: {
      maxlength: 100,
      clearable: false
    }
  },
  {
    field: 'status',
    label: '状态',
    component: 'Input',
    colProps: {
      span: 8
    },
    componentProps: {
      maxlength: 100,
      clearable: false
    }
  },
  {
    field: 'unit',
    label: '使用单位',
    component: 'Input',
    colProps: {
      span: 8
    },
    componentProps: {
      maxlength: 100,
      clearable: false
    }
  },
  {
    field: 'head',
    label: '责任人',
    component: 'Input',
    colProps: {
      span: 8
    },
    componentProps: {
      maxlength: 100,
      clearable: false
    }
  },
  {
    field: 'money',
    label: '采购金额（元）',
    component: 'Input',
    colProps: {
      span: 8
    },
    componentProps: {
      maxlength: 100,
      clearable: false
    }
  },
  {
    field: 'updateTime',
    label: '更新时间',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      maxlength: 500,
      clearable: false,
      type: 'textarea'
    }
  },
  {
    field: 'remark',
    label: '备注',
    component: 'Input',
    colProps: {
      span: 8
    },
    componentProps: {
      maxlength: 100,
      clearable: false
    }
  }
])
// 操作类型
let operateType = ref()
const isSave = ref<boolean>(false)
const isShow = ref<boolean>(false)
const pageTite = ref<string>('')
const detailsId = ref<string>()
const props = defineProps({
  title: propTypes.string.def('')
})
const { emitter } = useEmitt({
  name: 'drawer',
  callback: (type: string) => {
    if (type === 'closed') {
      resetFormAfterClose()
    }
  }
})
//打开drawer并初始化
const openDrawer = (flag: string, id?: string) => {
  isShow.value = true
  nextTick(() => {
    operateType.value = flag
    //重置表单
    detailsId.value = undefined
    resetValue()
    isSave.value = flag === 'see' ? false : true
    changeDisabled(flag === 'see')
    // 编辑时禁用部分字段
    isEdit.value = flag === 'edit' ? true : false
    // 标题名称
    pageTite.value = props.title + (flag === 'add' ? '新增' : flag === 'edit' ? '编辑' : '详情')

    if (id) {
      getDetailsData(id)
    }
  })
}
const loading = ref(false)
//根据id获取详情
const getDetailsData = async (id?: string) => {
  detailsId.value = id
}
//保存数据
const save = async () => {
  //表单验证
  const form = unref(formRef)
  const elFormRef = form?.getElFormRef()
  await elFormRef?.validate(async (isValid) => {
    if (isValid) {
      loading.value = true
      ElMessage.success('成功保存信息')
      emitter.emit('getRepairSkyList', 'edit')
      closeDrawer()
    }
  })
}
//关闭drawer
const closeDrawer = () => {
  isShow.value = false
}

const resetFormAfterClose = () => {
  detailsId.value = ''
  //重置表单
  resetValue()
}
//表单赋值
// const setValues = (form: any) => {
//   unref(formRef)?.setValues(form)
// }
//重置表单
const resetValue = () => {
  const elFormRef = unref(formRef)?.getElFormRef()
  elFormRef?.resetFields()
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
    <!-- :labelPosition="'right'" -->
    <Form class="form-content" :schema="schema" ref="formRef" />
    <template #footer>
      <div class="details-footer">
        <ElButton @click="closeDrawer"> 取消 </ElButton>
        <ElButton v-if="isSave" type="primary" :loading="loading" @click="save"> 保存 </ElButton>
      </div>
    </template>
  </Dialog>
</template>

<style lang="less" scoped>
:deep(.el-date-editor) {
  .el-input__wrapper {
    width: 100%;
  }
}
</style>
