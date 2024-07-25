<script setup lang="ts">
import { ref, unref, reactive, getCurrentInstance, nextTick } from 'vue'
import { ElButton, ElMessage, ElTooltip } from 'element-plus'
import { Form, FormExpose } from '@/components/Form'
import { Dialog } from '@/components/Dialog'
import { useEmitt } from '@/hooks/web/useEmitt'
import { useValidator } from '@/hooks/web/useValidator'
import { propTypes } from '@/utils/propTypes'
import { FormSchema } from '@/types/form'
import { savePlantApi, editPlantApi, getPlantApi } from '@/api/plant'
import { getCropLevelDetailApi } from '@/api/crop'

const { proxy } = getCurrentInstance() as any
// 从字典管理拿到物品类型的数据
const { planting_standards } = proxy.useDict('planting_standards')
// 表单校验
type Callback = (error?: string | Error | undefined) => void
const { required, validatePhone } = useValidator()

const props = defineProps({
  title: propTypes.string.def('')
})
const categoryData = ref<any>([])
const classificationData = ref<any>([])
const selectTypeData = ref<any>([])
const schema = reactive<FormSchema[]>([
  {
    field: 'category',
    label: '类别',
    component: 'Select',
    colProps: {
      span: 24
    },
    componentProps: {
      style: 'width:100%;', //宽度
      maxlength: 20,
      clearable: false,
      options: categoryData,
      onChange: async (value: string) => {
        classificationData.value = []
        selectTypeData.value = []
        unref(formRef)?.setValues({
          classification: '',
          selectType: ''
        })
        const res = await getCropLevelDetailApi({
          parentId: value
        })
        res.data.map((item) => {
          classificationData.value.push({
            label: item.name,
            value: item.id
          })
        })
      }
    },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'classification',
    label: '作物分类',
    component: 'Select',
    colProps: {
      span: 24
    },
    componentProps: {
      style: 'width:100%;', //宽度
      options: classificationData,
      onChange: async (value: string) => {
        selectTypeData.value = []
        unref(formRef)?.setValues({
          selectType: ''
        })
        const res = await getCropLevelDetailApi({
          parentId: value
        })
        res.data.map((item) => {
          selectTypeData.value.push({
            label: item.name,
            value: item.id
          })
        })
      }
    },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'selectType',
    label: '作物种类',
    component: 'Select',
    colProps: {
      span: 24
    },
    componentProps: {
      style: 'width:100%;', //宽度
      options: selectTypeData
    },
    formItemProps: {
      rules: [required()]
    }
  },

  {
    field: 'plantingEnvironment',
    label: '种植环境',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      maxlength: 10,
      clearable: false
    },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'plantingStandards',
    label: '种植标准',
    component: 'Select',
    colProps: {
      span: 24
    },
    componentProps: {
      style: 'width:100%;', //宽度
      options: planting_standards
    },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'cycle',
    colProps: {
      span: 24
    },
    componentProps: {
      clearable: false
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
  unref(formRef)?.setValues({
    farmBirthPeriod: farmBirthPeriod.value
  })
  await elFormRef?.validate(async (isValid) => {
    if (isValid) {
      loading.value = true
      let data = form?.formModel as any
      console.log(data)

      if (data.postId && detailsId.value) {
        editPost(data)
      } else {
        data.postId = ''
        addPost(data)
      }
    }
  })
}

//编辑岗位
const editPost = async (data: any) => {
  const res = await editPlantApi(data)
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
    emitter.emit('getPostList', 'edit')
    closeDrawer()
  }
}

//新增岗位
const addPost = async (data: any) => {
  const res = await savePlantApi(data)
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
    emitter.emit('getPostList', 'add')
    closeDrawer()
  }
}

const isSave = ref<boolean>(false)
const pageTite = ref<string>('')
const detailsId = ref<string>('')

//打开drawer并初始化
const openDrawer = async (flag: string, id: string) => {
  isShow.value = true
  categoryData.value = []
  const res = await getCropLevelDetailApi({
    level: '1'
  })
  res.data.map((item) => {
    categoryData.value.push({
      label: item.name,
      value: item.id
    })
  })

  nextTick(() => {
    //重置表单
    detailsId.value = ''
    setValue(false)
    isSave.value = flag === 'see' ? false : true
    changeDisabled(flag === 'see')
    pageTite.value = props.title + (flag === 'add' ? '新增' : flag === 'edit' ? '编辑' : '详情')

    if (id) {
      getDetailsData(id)
    }
  })
}

//关闭drawer
const closeDrawer = () => {
  farmBirthPeriod.value = [
    {
      birthPeriod: '',
      days: '',
      farmBirthControl: [
        {
          method: '',
          standard: ''
        }
      ]
    }
  ]
  isShow.value = false
}

const resetFormAfterClose = () => {
  farmBirthPeriod.value = [
    {
      birthPeriod: '',
      days: '',
      farmBirthControl: [
        {
          method: '',
          standard: ''
        }
      ]
    }
  ]
  detailsId.value = ''
  //重置表单
  setValue(true)
}

let plantData = reactive<any>({})

//获取详情
const getDetailsData = async (id: string) => {
  detailsId.value = id
  const res = await getPlantApi(id)
  if (res && res.data) {
    const data = await getCropLevelDetailApi({
      parentId: res.data.category
    })
    classificationData.value = []
    data.data.map((item) => {
      classificationData.value.push({
        label: item.name,
        value: item.id
      })
    })
    const response = await getCropLevelDetailApi({
      parentId: res.data.classification
    })
    selectTypeData.value = []
    response.data.map((item) => {
      selectTypeData.value.push({
        label: item.name,
        value: item.id
      })
    })
    plantData = res.data
    farmBirthPeriod.value = res.data.farmBirthPeriod
    setValues(plantData)
  }
}

//表单赋值
const setValue = (reset: boolean) => {
  const elFormRef = unref(formRef)?.getElFormRef()
  if (reset) {
    elFormRef?.resetFields()
  } else {
    unref(formRef)?.setValues({
      category: '',
      classification: '',
      selectType: '',
      plantingEnvironment: '',
      plantingStandards: ''
    })
  }
}

const setValues = (form: any) => {
  unref(formRef)?.setValues(form)
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

// 生育期表单数据
const farmBirthPeriod = ref<any>([
  {
    birthPeriod: '',
    days: '',
    farmBirthControl: [
      {
        method: '',
        standard: ''
      }
    ]
  }
])
// 新增生育期
const addCycle = () => {
  farmBirthPeriod.value.push({
    birthPeriod: '',
    days: '',
    farmBirthControl: [
      {
        method: '',
        standard: ''
      }
    ]
  })
}
// 新增操作
const addCycleOperate = (index) => {
  farmBirthPeriod.value[index].farmBirthControl.push({
    method: '',
    standard: ''
  })
}
// 删除操作
const delCycleOperate = (index) => {
  farmBirthPeriod.value[index].farmBirthControl.splice(
    farmBirthPeriod.value[index].farmBirthControl.length - 1,
    1
  )
}
// 删除生育期
const delBirthPeriod = (index) => {
  farmBirthPeriod.value.splice(index, 1)
}
const rules = reactive({
  days: [
    { required: true, message: '该项为必填项!', trigger: 'blur' },
    { min: 0, max: 15, message: '长度范围0-15', trigger: 'blur' }
  ],
  birthPeriod: [
    { required: true, message: '该项为必填项!', trigger: 'blur' },
    { min: 0, max: 20, message: '长度范围0-20', trigger: 'blur' }
  ],
  method: [
    { required: true, message: '该项为必填项!', trigger: 'blur' },
    { min: 0, max: 50, message: '长度范围0-50', trigger: 'blur' }
  ],
  standard: [
    { required: true, message: '该项为必填项!', trigger: 'blur' },
    { min: 0, max: 200, message: '长度范围0-200', trigger: 'blur' }
  ]
})
</script>

<template>
  <Dialog v-model="isShow" width="70%" :maxHeight="'auto'" :title="pageTite" @close="closeDrawer">
    <Form :schema="schema" ref="formRef" class="form-content">
      <template #cycle>
        <div v-for="(item, index) in farmBirthPeriod" class="standardForm" :key="index">
          <ElForm :model="item" :rules="rules">
            <el-row :gutter="30">
              <el-col :span="12">
                <el-form-item label="天数" prop="days">
                  <el-input v-model="item.days" />
                </el-form-item>
              </el-col>
              <el-col :span="12"
                ><el-form-item label="生育期" prop="birthPeriod">
                  <el-input v-model="item.birthPeriod" /> </el-form-item
              ></el-col>
              <el-col :span="12">
                <el-form-item label="农事操作" prop="method">
                  <div v-for="(ele, i) in item.farmBirthControl" :key="i" class="operate_items">
                    <el-input v-model="ele.method" />
                  </div> </el-form-item
              ></el-col>
              <el-col :span="12"
                ><el-form-item label="操作规范" prop="standard">
                  <div v-for="(ele, i) in item.farmBirthControl" :key="i" class="operate_items">
                    <el-input v-model="ele.standard" />
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <ElButton type="primary" @click="addCycleOperate(index)"> 新增操作 </ElButton>
                <ElButton
                  v-if="farmBirthPeriod[index].farmBirthControl.length > 1"
                  type="primary"
                  @click="delCycleOperate(index)"
                >
                  删除操作
                </ElButton>
                <ElButton
                  v-if="farmBirthPeriod.length > 1"
                  type="primary"
                  @click="delBirthPeriod(index)"
                >
                  删除生育期
                </ElButton>
              </el-col>
            </el-row>
          </ElForm>
        </div>
      </template>
    </Form>
    <template #footer>
      <div class="details-footer">
        <ElButton @click="closeDrawer"> 取消 </ElButton>
        <ElButton type="primary" @click="addCycle"> 新增生育期 </ElButton>
        <ElButton v-if="isSave" type="primary" :loading="loading" @click="save"> 保存 </ElButton>
      </div>
    </template>
  </Dialog>
</template>

<style lang="less" scoped>
:deep(.el-input-group__append) {
  background-color: white;
  width: 35px;
}
.standardForm {
  padding: 20px;
  width: 100%;
  border: 1px solid #ccc;
  margin: 10px 0;
}
:deep(.el-form-item__content) {
  display: block;
  margin: 12px 0;
}
.operate_items {
  margin: 10px 0;
}
</style>
