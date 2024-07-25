<script setup lang="ts">
import { Form, FormExpose } from '@/components/Form'
import { ref, unref, reactive, nextTick, getCurrentInstance, PropType, watch } from 'vue'
import { useEmitt } from '@/hooks/web/useEmitt'
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

const { proxy } = getCurrentInstance() as any
const { sys_normal_disable } = proxy.useDict('sys_normal_disable')
// callback 类型
type Callback = (error?: string | Error | undefined) => void
const { required, notSpace } = useValidator()

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
    field: 'cssClass',
    label: '样式属性',
    component: 'Input',
    colProps: {
      span: 12
    },
    componentProps: {
      maxlength: 20,
      clearable: false
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
    field: 'dictSort',
    label: '字典排序',
    value: 0,
    component: 'InputNumber',
    colProps: {
      span: 12
    },
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
    field: 'status',
    label: '状态',
    value: '0',
    component: 'Radio',
    componentProps: {
      options: sys_normal_disable
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
      maxlength: 100,
      type: 'textarea',
      autosize: 'true',
      rows: 3
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
const changeDisabled = (bool: boolean) => {
  unref(formRef)?.setProps({
    disabled: bool
  })
}

defineExpose({
  formRef,
  setValues,
  resetValue
})
</script>

<template>
  <Form :schema="schema" ref="formRef" />
</template>

<style lang="less" scoped>
:deep(.el-input-number .el-input__inner) {
  text-align: left;
}
</style>
