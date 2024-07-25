<script setup lang="ts">
import { ref, unref, reactive, nextTick, PropType, watch } from 'vue'
import { Form, FormExpose } from '@/components/Form'
// import { useEmitt } from '@/hooks/web/useEmitt'
import { FormSchema } from '@/types/form'
import { useValidator } from '@/hooks/web/useValidator'
import { DictTypeData } from '@/api/dict/types'

const props = defineProps({
  currentRow: {
    type: Object as PropType<Nullable<DictTypeData>>,
    default: () => null
  },
  dictType: {
    type: String,
    default: () => ''
  }
})

// const { proxy } = getCurrentInstance() as any
// const { sys_normal_disable } = proxy.useDict('sys_normal_disable')

// 表单校验
type Callback = (error?: string | Error | undefined) => void
const { required, validatePositiveIntegerN } = useValidator()

// 数据标签回显样式
const listClassOptions = ref([
  { value: 'default', label: '默认(default)' },
  { value: 'success', label: '成功(success)' },
  { value: 'info', label: '信息(info)' },
  { value: 'warning', label: '警告(warning)' },
  { value: 'danger', label: '危险(danger)' }
])

const schema = reactive<FormSchema[]>([
  {
    field: 'dictType',
    label: '字典类型',
    component: 'Input',
    colProps: {
      span: 12
    },
    componentProps: {
      maxlength: 20,
      clearable: false,
      disabled: true
    },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'dictLabel',
    label: '字典标签',
    component: 'Input',
    colProps: {
      span: 12
    },
    componentProps: {
      maxlength: 20,
      clearable: false
    },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'dictValue',
    label: '字典键值',
    component: 'Input',
    colProps: {
      span: 12
    },
    componentProps: {
      maxlength: 20,
      clearable: false
    },
    formItemProps: {
      rules: [required()]
    }
  },

  {
    field: 'dictSort',
    label: '字典排序',
    value: 0,
    component: 'Input',
    colProps: {
      span: 12
    },
    componentProps: {
      style: 'width:100%;',
      maxlength: 6,
      controlsPosition: 'right'
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
  },

  {
    field: 'status',
    label: '状态',
    value: '0',
    component: 'Radio',
    componentProps: {
      // options: sys_normal_disable
      options: [
        {
          label: '正常',
          value: '0'
        },
        {
          label: '禁用',
          value: '1'
        }
      ]
    }
  },
  {
    field: 'listClass',
    label: '回显样式',
    value: 'default',
    component: 'Select',
    colProps: {
      span: 12
    },
    componentProps: {
      style: 'width:100%;',
      options: listClassOptions.value
    }
  },
  {
    field: 'cssClass',
    label: '样式属性',
    component: 'Input',
    colProps: {
      span: 12
    },
    componentProps: {
      maxlength: 20,
      clearable: false
    }
  },
  {
    field: 'remark',
    label: '备注',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      maxlength: 500,
      type: 'textarea',
      rows: 3
    }
  }
])

const formRef = ref<FormExpose>()

const setAddValues = (dictType: string) => {
  nextTick(() => {
    resetValue()
    unref(formRef)?.setValues({
      createBy: '',
      createTime: '',
      cssClass: '',
      default: '',
      dictCode: '',
      dictLabel: '',
      dictSort: null,
      dictType: dictType,
      dictValue: '',
      isDefault: '',
      listClass: 'default',
      remark: '',
      status: '0',
      updateBy: '',
      updateTime: ''
    })
  })
}

const setValues = (form: DictTypeData) => {
  nextTick(() => {
    resetValue()
    unref(formRef)?.setValues(form)
  })
}

const resetValue = () => {
  const elFormRef = unref(formRef)?.getElFormRef()
  elFormRef?.resetFields()
}

watch(
  () => props.currentRow,
  (currentRow) => {
    if (!currentRow) return
    setValues(currentRow)
  },
  {
    deep: true,
    immediate: true
  }
)

watch(
  () => props.dictType,
  (dictType) => {
    if (!dictType) return
    setAddValues(dictType)
  },
  {
    deep: true,
    immediate: true
  }
)

//表单禁用
// const changeDisabled = (bool: boolean) => {
//   unref(formRef)?.setProps({
//     disabled: bool
//   })
// }

defineExpose({
  formRef,
  setValues,
  resetValue
})
</script>

<template>
  <Form :schema="schema" ref="formRef" class="form-content" />
</template>
