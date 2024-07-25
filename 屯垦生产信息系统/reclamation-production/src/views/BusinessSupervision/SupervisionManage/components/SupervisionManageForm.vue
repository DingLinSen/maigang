<script setup lang="ts">
import { ref, unref, reactive, nextTick } from 'vue'
import { ElMessage, ElRow, valueEquals } from 'element-plus'
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
interface configurationType {
  condition: string
}

// 条件数组
const conditionList = ref<Array<any>>([
  {
    value: '1',
    label: '条件一'
  },
  {
    value: '2',
    label: '条件二'
  },
  {
    value: '3',
    label: '条件三'
  }
])
// 比较关系数组
const compareList = ref<Array<any>>([
  {
    value: '1',
    label: '等于'
  },
  {
    value: '2',
    label: '大于'
  },
  {
    value: '3',
    label: '小于'
  },
  {
    value: '4',
    label: '包含'
  }
])
const relationshipList = ref<Array<any>>([
  {
    value: '1',
    label: '或则'
  },
  {
    value: '2',
    label: '并且'
  }
])
// 关系
const configurationList = ref<any>([]) // 监管规则数组
const topForm = reactive({
  oneCondition: '',
  oneCompare: '',
  oneNumber: ''
})
const configurationForm = reactive({
  relationship: '',
  condition: '',
  compare: '',
  number: ''
})
const schema = reactive<FormSchema[]>([
  {
    field: '',
    label: '添加监管专题',
    component: 'Divider'
  },
  {
    field: 'name',
    label: '名称：',
    component: 'Input',
    colProps: {
      span: 6
    },
    componentProps: {
      maxlength: 100,
      clearable: false
    }
  },
  {
    field: '',
    label: '监管专题设定配置',
    component: 'Divider'
  },
  {
    field: 'configuration',
    colProps: {
      span: 24
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
    configurationList.value = []
    topForm.oneCondition = ''
    topForm.oneCompare = ''
    topForm.oneNumber = ''
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
      loading.value = false
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
// 监管规则添加
const addConfiguration = () => {
  configurationList.value.push({
    relationship: '',
    condition: '',
    compare: '',
    number: '',
    itemIndex: configurationList.value.length + 2
  })
}
// 监管规则删除
const deleteAddConfiguration = (val) => {
  if (configurationList.value) {
    configurationList.value.splice(val, 1)
  }
  for (let i = 0; i < configurationList.value.length; i++) {
    configurationList.value[i].itemIndex = i + 2
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
    <!-- :labelPosition="'right'" -->
    <Form class="form-content" :schema="schema" ref="formRef">
      <template #configuration>
        <Form
          :model="topForm"
          :isCustom="true"
          style="width: 100%"
          :label-position="'left'"
          label-width="200"
        >
          <el-row>
            <span>监管规则1： </span>
            <el-col :span="4" style="padding-right: 0px">
              <el-select v-model="topForm.oneCondition" style="width: 100%" :disabled="!isSave">
                <el-option
                  v-for="conditionItem in conditionList"
                  :value="conditionItem.value"
                  :key="conditionItem.value"
                  :label="conditionItem.label"
                />
              </el-select>
            </el-col>

            <div style="display: inline-block; margin-left: 20px" v-if="isSave">
              <ElButton @click="addConfiguration()" type="primary">添加</ElButton>
            </div>
          </el-row>
        </Form>
        <div v-for="(item, index) in configurationList" :key="index" style="width: 100%">
          <Form :model="configurationForm" :isCustom="true" style="width: 100%">
            <el-row style="margin: 10px 77px">
              <el-col :span="4">
                <el-form-item label="" label-position="left">
                  <el-select v-model="item.relationship" style="width: 100%" :disabled="!isSave">
                    <el-option
                      v-for="relationshipItem in relationshipList"
                      :value="relationshipItem.value"
                      :key="relationshipItem.value"
                      :label="relationshipItem.label"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row style="width: 100%">
              <span>监管规则{{ item.itemIndex }}： </span>
              <el-col :span="4" style="padding-right: 0px">
                <el-select v-model="item.condition" style="width: 100%" :disabled="!isSave">
                  <el-option
                    v-for="conditionItem in conditionList"
                    :value="conditionItem.value"
                    :key="conditionItem.value"
                    :label="conditionItem.label"
                  />
                </el-select>
              </el-col>
              <div style="display: inline-block; margin-left: 20px" v-if="isSave">
                <ElButton @click="addConfiguration()" type="primary">添加</ElButton>
                <ElButton
                  @click="deleteAddConfiguration(index)"
                  style="margin-left: 2px"
                  type="danger"
                  >删除</ElButton
                ></div
              >
            </el-row>
          </Form>
        </div>
      </template>
    </Form>
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
