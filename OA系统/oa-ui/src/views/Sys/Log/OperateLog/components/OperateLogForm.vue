<script setup lang="ts">
import { Form, FormExpose } from '@/components/Form'
import { ref, unref, reactive, nextTick, getCurrentInstance } from 'vue'
import { ContentWrap } from '@/components/ContentWrap'
import { propTypes } from '@/utils/propTypes'
import { DrawerWrap } from '@/components/DrawerWrap'
import { FormSchema } from '@/types/form'
import { OperateLogData } from '@/api/log/operate/types'
import { ComponentOptions } from '@/types/components'
import { ElButton } from 'element-plus'
import { useEmitt } from '@/hooks/web/useEmitt'

const { proxy } = getCurrentInstance() as any
const { sys_oper_type, sys_common_status } = proxy.useDict('sys_oper_type', 'sys_common_status')

const props = defineProps({
  title: propTypes.string.def('')
})

const schema = reactive<FormSchema[]>([
  {
    field: 'title',
    label: '操作模块',
    component: 'Input',
    colProps: {
      span: 12
    }
  },
  {
    field: 'operUrl',
    label: '请求地址',
    component: 'Input',
    colProps: {
      span: 12
    }
  },
  {
    field: 'operIp',
    label: '登录信息',
    component: 'Input',
    colProps: {
      span: 12
    }
  },
  {
    field: 'requestMethod',
    label: '请求方式',
    component: 'Input',
    colProps: {
      span: 12
    }
  },
  {
    field: 'method',
    label: '操作方法',
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'operParam',
    label: '请求参数',
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'jsonResult',
    label: '返回参数',
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'status',
    label: '操作状态',
    component: 'Input',
    colProps: {
      span: 8
    }
  },
  {
    field: 'costTime',
    label: '消耗时间',
    component: 'Input',
    colProps: {
      span: 8
    }
  },
  {
    field: 'operTime',
    label: '操作时间',
    component: 'Input',
    colProps: {
      span: 8
    }
  }
])

const formRef = ref<FormExpose>()

const isShow = ref<boolean>(false)

const { emitter } = useEmitt({
  name: 'drawer',
  callback: (type: string) => {
    if (type === 'closed') {
      resetField()
    }
  }
})

const loading = ref(false)
//保存数据
const save = async () => {}

const isSave = ref<boolean>(false)
const pageTite = ref<string>('')
const drawerWrap = ref<ComponentRef<typeof DrawerWrap>>()

const getElTagLabel = (value: string): string => {
  let label = ''
  unref(sys_common_status).map((item: any) => {
    if (value === item.value) {
      label = item.label
    }
  })
  return label
}

const getTypeElTagLabel = (value: string): string => {
  let label = ''
  unref(sys_oper_type).map((item: any) => {
    if (value.toString() === item.value) {
      label = item.label
    }
  })
  return label
}

//打开drawer并初始化
const openDrawer = (flag: string, row: OperateLogData) => {
  pageTite.value = flag === 'add' ? '新增' : flag === 'edit' ? '编辑' : '详情'
  drawerWrap.value.isShow = true
  //重置表单
  resetField()
  changeDisabled(flag === 'see')
  isSave.value = flag !== 'see'
  let res = Object.assign({}, row)
  res.title = res.title + ' / ' + getTypeElTagLabel(res.businessType)
  res.operIp = res.operName + ' / ' + res.operIp + ' / ' + res.operLocation
  res.status = getElTagLabel(res.status)
  res.costTime = res.costTime ? res.costTime + '毫秒' : ''
  setValues(res)
}

//关闭drawer
const closeDrawer = () => {
  drawerWrap.value.isShow = false
}

//表单赋值
const resetField = () => {
  nextTick(() => {
    const elFormRef = unref(formRef)?.getElFormRef()
    elFormRef?.resetFields()
  })
}

const setValues = (form: OperateLogData) => {
  nextTick(() => {
    unref(formRef)?.setValues(form)
  })
}

//表单禁用
const changeDisabled = (bool: boolean) => {
  nextTick(() => {
    console.log('formRef==>', unref(formRef))
    unref(formRef)?.setProps({
      disabled: bool
    })
  })
}

defineExpose({
  isShow,
  openDrawer
})
</script>

<template>
  <DrawerWrap :title="pageTite" :isShow="isShow" ref="drawerWrap">
    <template #right v-if="isSave">
      <ElButton type="primary" :loading="loading" @click="save"> 保存 </ElButton>
    </template>
    <template #content>
      <Form :schema="schema" ref="formRef"> </Form>
    </template>
  </DrawerWrap>
</template>

<style lang="less" scoped>
:deep(.el-input-group__append) {
  background-color: white;
  width: 35px;
}
</style>
