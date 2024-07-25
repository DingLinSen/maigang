<script setup lang="ts">
import { ref, unref, reactive, nextTick } from 'vue'
import { ElButton, ElMessage } from 'element-plus'
import { Form, FormExpose } from '@/components/Form'
import { Dialog } from '@/components/Dialog'
import { useEmitt } from '@/hooks/web/useEmitt'
// import { useValidator } from '@/hooks/web/useValidator'
import { propTypes } from '@/utils/propTypes'
import { FormSchema } from '@/types/form'
// import {
//   addImageContentApi,
//   editImageContentApi,
//   getImageContentDetailApi
// } from '@/api/imageContent'

// const { proxy } = getCurrentInstance() as any

// 表单校验
// type Callback = (error?: string | Error | undefined) => void
// const { required, validatePhone } = useValidator()

const props = defineProps({
  title: propTypes.string.def('')
})

const schema = reactive<FormSchema[]>([
  {
    field: 'taskName',
    label: '基本信息',
    component: 'Divider'
  },
  {
    field: 'projectName',
    label: '项目名称',
    component: 'Input',
    colProps: {
      span: 6
    }
  },
  {
    field: 'projectType',
    label: '项目类型',
    component: 'Input',
    colProps: {
      span: 6
    }
  },
  {
    field: 'projectFunds',
    label: '项目经费',
    component: 'Input',
    colProps: {
      span: 6
    }
  },
  {
    field: 'projectScale',
    label: '项目规模',
    component: 'Input',
    colProps: {
      span: 6
    }
  },
  {
    field: 'projectCreateTime',
    label: '开始时间',
    component: 'Input',
    colProps: {
      span: 6
    }
  },
  {
    field: 'projectEndTime',
    label: '结束时间',
    component: 'Input',
    colProps: {
      span: 6
    }
  },
  {
    field: 'implementationUnit',
    label: '实施单位',
    component: 'Input',
    colProps: {
      span: 6
    }
  },
  {
    field: 'implementationLeader',
    label: '实施负责人',
    component: 'Input',
    colProps: {
      span: 6
    }
  },
  {
    field: 'implementationArea',
    label: '实施面积',
    component: 'Input',
    colProps: {
      span: 6
    }
  },
  {
    field: 'implementationLocation',
    label: '实施地点',
    component: 'Input',
    colProps: {
      span: 6
    }
  },
  {
    field: 'implementationRegion',
    label: '实施区域',
    component: 'Input',
    colProps: {
      span: 6
    }
  },
  {
    field: 'implementationGrounds',
    label: '实施地块',
    component: 'Input',
    colProps: {
      span: 6
    }
  },
  {
    field: 'projectType',
    label: '建设阶段',
    component: 'Divider'
  },
  {
    field: 'phaseName',
    label: '阶段名称',
    component: 'Input',
    colProps: {
      span: 8
    }
  },
  {
    field: 'phaseCreateTime',
    label: '开始时间',
    component: 'Input',
    colProps: {
      span: 8
    }
  },
  {
    field: 'phaseEndTime',
    label: '结束时间',
    component: 'Input',
    colProps: {
      span: 8
    }
  },
  {
    field: 'projectType',
    label: '建设成果',
    component: 'Divider'
  },
  {
    field: 'constructionAchievements',
    component: 'Editor',
    colProps: {
      span: 24
    }
  },
  {
    field: 'reviewStage',
    label: '审核阶段',
    component: 'Divider'
  },
  {
    field: 'reviewUnit',
    label: '审核单位',
    component: 'Input',
    colProps: {
      span: 12
    }
  },
  {
    field: 'reviewResult',
    label: '审核结果',
    component: 'Input',
    colProps: {
      span: 12
    }
  },
  {
    field: 'reviewOpinion',
    label: '审核意见',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      maxlength: 500,
      type: 'textarea',
      rows: 3
    }
  },
  {
    field: 'implementationPhase',
    label: '执行阶段',
    component: 'Divider'
  },
  {
    field: 'implementedBy',
    label: '执行单位',
    component: 'Input',
    colProps: {
      span: 12
    }
  },
  {
    field: 'implementation',
    label: '执行情况',
    component: 'Input',
    colProps: {
      span: 12
    }
  },
  {
    field: 'executiveIntroduction',
    label: '执行介绍',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      maxlength: 500,
      type: 'textarea',
      rows: 3
    }
  },
  {
    field: 'file',
    colProps: {
      span: 24
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
  // const form = unref(formRef)
  // const elFormRef = form?.getElFormRef()
  // await elFormRef?.validate(async (isValid) => {
  //   if (isValid) {
  //     loading.value = true
  //     let data = form?.formModel as any
  //     if (data.id && detailsId.value) {
  //       editPost(data)
  //     } else {
  //       data.id = ''
  addPost()
  //     }
  //   }
  // })
}

//编辑岗位
const editPost = async (data: any) => {
  const res = await editImageContentApi(data)
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
    emitter.emit('getImageList', 'edit')
    closeDrawer()
  }
}

//新增岗位
const addPost = async () => {
  // const res = await addImageContentApi(data)
  //   .catch(() => {})
  //   .finally(() => {
  //     nextTick(() => {
  //       setTimeout(() => {
  //         loading.value = false
  //       }, 300)
  //     })
  //   })
  // if (res) {
  ElMessage.success('成功保存信息')
  // emitter.emit('getImageList', 'add')
  closeDrawer()
  // }
}

const isSave = ref<boolean>(false)
const pageTite = ref<string>('')
const detailsId = ref<string>('')
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
//打开drawer并初始化
const openDrawer = (flag: string, id: string) => {
  isShow.value = true
  nextTick(() => {
    //重置表单
    detailsId.value = ''
    setValue(false)
    isSave.value = flag === 'see' ? false : true
    changeDisabled(flag === 'see')
    pageTite.value =
      props.title +
      (id === '1'
        ? '规(计)划拟制'
        : id === '2'
        ? '规(计)划分发'
        : id === '3'
        ? '规(计)划审核'
        : id === '4'
        ? '规(计)划下发'
        : id === '5'
        ? '规(计)划执行'
        : '规(计)划归档')
    setFormHidden('reviewStage', id === '1' ? true : false)
    setFormHidden('reviewUnit', id === '1' ? true : false)
    setFormHidden('reviewResult', id === '1' ? true : false)
    setFormHidden('reviewOpinion', id === '1' ? true : false)
    setFormHidden('implementationPhase', id === '1' || id === '2' || id === '3' ? true : false)
    setFormHidden('implementedBy', id === '1' || id === '2' || id === '3' ? true : false)
    setFormHidden('implementation', id === '1' || id === '2' || id === '3' ? true : false)
    setFormHidden('executiveIntroduction', id === '1' || id === '2' || id === '3' ? true : false)
    setFormHidden(
      'file',
      id === '1' || id === '2' || id === '3' || id === '4' || id === '5' ? true : false
    )
    if (id) {
      getDetailsData(id)
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
  setValue(true)
}
let ImageContentData = reactive<any>({
  content: '',
  coverUrl: '',
  title: '',
  fileName: ''
})
//获取详情
const getDetailsData = async (id: string) => {
  detailsId.value = id
  const res = await getImageContentDetailApi(id)
  if (res && res.data) {
    ImageContentData = res.data
    setValues(ImageContentData)
  }
}
//表单赋值
const setValue = (reset: boolean) => {
  const elFormRef = unref(formRef)?.getElFormRef()
  if (reset) {
    elFormRef?.resetFields()
  } else {
    unref(formRef)?.setValues({
      content: '',
      coverUrl: '',
      title: '',
      fileName: ''
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
const checkAll = ref(false)
const isIndeterminate = ref(true)
const checkedCities = ref([])
const cities = ['信用代码', '法人代表姓名', '许可证', '门店名称']
const handleCheckAllChange = (val: boolean) => {
  checkedCities.value = val ? cities : []
  isIndeterminate.value = false
}
const handleCheckedCitiesChange = (value: string[]) => {
  const checkedCount = value.length
  checkAll.value = checkedCount === cities.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < cities.length
}
</script>

<template>
  <Dialog v-model="isShow" width="70%" :maxHeight="'auto'" :title="pageTite" @close="closeDrawer">
    <Form :schema="schema" ref="formRef" class="form-content" :labelPosition="'left'">
      <template #route>
        <div class="check_box">
          <el-checkbox
            v-model="checkAll"
            :indeterminate="isIndeterminate"
            @change="handleCheckAllChange"
          >
            <div class="check_title"> 字段选择</div></el-checkbox
          >
          <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
            <el-checkbox v-for="city in cities" :key="city" :label="city">{{ city }}</el-checkbox>
          </el-checkbox-group>
        </div>
      </template>
      <template #file>
        <div class="setp_file">已归档</div>
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
:deep(.el-input-group__append) {
  background-color: white;
  width: 35px;
}
.check_box {
  margin: auto;
  border: 1px solid #eee;
  height: 300px;
  padding: 20px;
}
.el-checkbox-group {
  border-top: 1px solid #ccc;
  flex-direction: column;
  display: flex;
}
.setp_file {
  margin: 0 auto;
  font-size: 22px;
  font-weight: bold;
}
</style>
