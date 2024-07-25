<!-- 
  * 项目管理-培育项目-新增\编辑\查看界面
 -->
<script setup lang="ts">
import { Form, FormExpose } from '@/components/Form'
import { ref, unref, reactive, nextTick, getCurrentInstance, inject, watch } from 'vue'
// import { ContentWrap } from '@/components/ContentWrap'
import { propTypes } from '@/utils/propTypes'
import { DrawerWrap } from '@/components/DrawerWrap'
import { useEmitt } from '@/hooks/web/useEmitt'
import { useValidator } from '@/hooks/web/useValidator'
import { FormSchema } from '@/types/form'
import { CultivateData } from '@/api/project/cultivate/types'
import {
  changePrincipalPersonCultivateApi // 变更人
} from '@/api/project/cultivate'

import { getImplementApi } from '@/api/project/Implement'

import { ElButton, ElMessage } from 'element-plus'

const { proxy } = getCurrentInstance() as any
const { province } = proxy.useDict('province')

const { required } = useValidator()

const props = defineProps({
  title: propTypes.string.def(''),
  isAction: propTypes.string.def('')
})
const isAlter = ref<boolean>(false)
// watch(
//   () => props.isAction,
//   (options) => {
//     console.log(options)
//     if(props.isAction === '')
//   },
//   {
//     deep: true
//   }
// )
const principalTree = inject<any>('principalTree')
// 项目类型
const projectType = reactive<any>([
  {
    label: '农业农村',
    value: '0'
  },
  {
    label: '铁路交通',
    value: '1'
  },
  {
    label: '军工',
    value: '2'
  },
  {
    label: '其他',
    value: '3'
  }
])

let culticateData = reactive<CultivateData>({
  id: '',
  fileList: '',
  createBy: '',
  createTime: '',
  ownerName: '',
  planContent: '',
  estimatedAmount: undefined,
  updateBy: '',
  updateTime: '',
  remark: '',
  filePath: '',
  status: '0',
  flag: false,
  pyzxm: null,
  pyspz: null,
  jszz: null,
  jzz: null,
  address: '',
  delFlag: '',
  itemNumber: '',
  lat: '',
  llng: '',
  pmAuditList: [],
  pmProgressList: [],
  phase: '',
  projectTitle: '',
  projectType: '',
  province: '',
  year: '',
  roleId: '',
  roleName: '',
  roleKey: '',
  roleSort: null,
  dataScope: '',
  menuCheckStrictly: false,
  deptCheckStrictly: false,
  menuIds: [],
  deptIds: [],
  permissions: '',
  admin: false,
  principalPersonName: '',
  createByName: ''
})
const isSave = ref<boolean>(false)

const pageTite = ref<string>('')
const actionflag = ref<boolean>(false)
const drawerWrap = ref<ComponentRef<typeof DrawerWrap>>()
const detailsId = ref<number | null>(null)

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
//打开drawer并初始化
const openDrawer = (flag: string, id: number | string) => {
  //重置表单
  detailsId.value = null

  console.log(isAlter, flag, id, 4567890)

  setValue(false)
  actionflag.value = flag === 'see' ? true : false

  isSave.value = flag === 'see' ? false : true
  // changeDisabled(flag === 'see')

  isAlter.value = flag === 'alter' ? true : false

  // console.log(actionflag)
  pageTite.value =
    flag === 'alter'
      ? '变更'
      : props.title + (flag === 'add' ? '新增' : flag === 'edit' ? '编辑' : '详情')

  drawerWrap.value.isShow = true
  setFormHidden('principalPerson', flag === 'alter' ? false : true)
  if (flag === 'alter') {
    if (id) {
      getDetailsData(id)
      nextTick(() => {
        formDisabled(culticateData, true)
        unref(formRef)?.setSchema([
          {
            field: 'principalPerson',
            path: 'componentProps.disabled',
            value: false
          }
        ])
      })
    }
  } else {
    formDisabled(culticateData, false)
    if (id) {
      getDetailsData(id)
    }
  }
}
const changeUploadfileList = (data: any) => {
  console.log('data', data)
}
// 表单项
const schema = reactive<FormSchema[]>([
  {
    field: 'projectTitle',
    label: '项目名称',
    component: 'Input',
    colProps: {
      span: 12
    },
    componentProps: {
      disabled: unref(isAlter.value),
      maxlength: 200,
      clearable: false
    },
    formItemProps: {
      rules: [required()]
    }
  },

  {
    field: 'projectType',
    label: '项目类型',
    component: 'Select',
    colProps: {
      span: 12
    },
    componentProps: {
      disabled: false,
      style: 'width:100%;',
      clearable: true,
      options: projectType,
      filterable: true
    },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'ownerName',
    label: '用户名称',
    component: 'Input',
    colProps: {
      span: 12
    },
    componentProps: {
      disabled: false,
      maxlength: 20,
      clearable: false
    },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'estimatedAmount',
    label: '预计金额(万元)',
    value: null,
    component: 'InputNumber',
    colProps: {
      span: 12
    },
    componentProps: {
      disabled: false,
      style: 'width:100%;',
      // maxlength: 3,
      controlsPosition: 'right'
    },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'principalPerson',
    label: '当前负责人',
    value: null,
    component: 'Cascader',
    colProps: {
      span: 12
    },
    componentProps: {
      style: 'width:100%;',
      filterable: true,
      disabled: false,
      options: principalTree,
      props: {
        label: 'deptName',
        value: 'deptId'
      },
      // maxlength: 3,
      controlsPosition: 'right'
    },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'province',
    label: '所属省份',
    component: 'Select',
    colProps: {
      span: 12
    },
    componentProps: {
      disabled: false,
      style: 'width:100%;',
      options: province,
      maxlength: 20,
      clearable: false
    },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'address',
    label: '详细地址',
    component: 'Input',
    colProps: {
      span: 12
    },
    componentProps: {
      disabled: false,
      maxlength: 200,
      clearable: false
    },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'planContent',
    label: '项目内容',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      disabled: false,
      maxlength: 1000,
      type: 'textarea',
      rows: 1
    },
    formItemProps: {
      rules: [required()]
    }
  },
  // {
  //   field: 'availableLimit',
  //   label: '可用额度',
  //   component: 'InputNumber',
  //   colProps: {
  //     span: 12
  //   },
  //   componentProps: {
  //     style: 'width:100%;',
  //     maxlength: 500,
  //     controlsPosition: 'right'
  //     // type: 'textarea',
  //     // rows: 3
  //   },
  //   formItemProps: {
  //     rules: [required()]
  //   }
  // },
  {
    field: 'fileList',
    label: '上传文件',
    component: 'FileUpload',
    componentProps: {
      disabled: false,
      limit: 1, // 数量限制
      fileType: ['pdf', 'doc', 'docx', 'png', 'jpg', 'xls', 'xlsx', 'zip', 'rar'] // 文件类型
    },
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
  const form = unref(formRef)
  const elFormRef = form?.getElFormRef()
  await elFormRef?.validate(async (isValid) => {
    if (isValid) {
      loading.value = true
      let data = form?.formModel as CultivateData
      console.log('data', data)
      data.filePath = data.fileList
      if (data.id && detailsId.value) {
        // 变更
        alterPost(data)
      }
    }
  })
}

// 变更
const alterPost = async (data: any) => {
  try {
    let params = {
      id: detailsId.value,
      principalPerson: data.principalPerson[data.principalPerson.length - 1]
    }
    const res = await changePrincipalPersonCultivateApi(params)
      .catch(() => {})
      .finally(() => {
        loading.value = false
      })
    // console.log(res.data)

    if (res) {
      ElMessage.success('保存信息成功')
      emitter.emit('getList', 'add')
      closeDrawer()
    }
  } catch (error) {
    console.log(error)
  }
}
//关闭drawer
const closeDrawer = () => {
  drawerWrap.value.isShow = false
}

const resetFormAfterClose = () => {
  detailsId.value = ''
  //重置表单
  setValue(true)
}

//获取详情
const getDetailsData = async (ids: number) => {
  detailsId.value = ids
  let params = {
    id: ids
  }
  const res = await getImplementApi(params)
  if (res && res.data) {
    console.log(res.data)

    culticateData = res.data
    culticateData.address = res.data.address
    culticateData.fileList = res.data.filePath
    setValues(culticateData)
  }
}

//表单赋值
const setValue = (reset: boolean) => {
  const elFormRef = unref(formRef)?.getElFormRef()
  if (reset) {
    elFormRef?.resetFields()
  } else {
    unref(formRef)?.setValues({
      postId: '',
      postName: '',
      postSort: null,
      status: '',
      postCode: '',
      remark: ''
    })
  }
}

const setValues = (form: CultivateData) => {
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
</script>

<template>
  <DrawerWrap :title="pageTite" :isShow="isShow" ref="drawerWrap">
    <template #right v-if="isSave">
      <ElButton type="primary" :loading="loading" @click="save"> 保存 </ElButton>
    </template>
    <template #content>
      <Form :schema="schema" ref="formRef">
        <!-- <template #path-append>
            <ElTooltip
              effect="dark"
              content="访问的路由地址，如：`user`，如外网地址需内链访问则以`http(s)://`开头"
            >
              <Icon icon="ep:question-filled" />
            </ElTooltip>
          </template>
  
          <template #component-append>
            <ElTooltip
              effect="dark"
              content="访问的组件路径，如：`system/user/index`，默认在`views`目录下"
            >
              <Icon icon="ep:question-filled" />
            </ElTooltip>
          </template>
          <template #perms-append>
            <ElTooltip
              effect="dark"
              content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasPermi('system:user:list')`)"
            >
              <Icon icon="ep:question-filled" />
            </ElTooltip>
          </template>
  
          <template #query-append>
            <ElTooltip
              effect="dark"
              content="访问路由的默认传递参数，如：`{``id``: 1, ``name``: ``ry``}`"
            >
              <Icon icon="ep:question-filled" />
            </ElTooltip>
          </template> -->
      </Form>
    </template>
  </DrawerWrap>
</template>

<style lang="less" scoped>
:deep(.el-input-group__append) {
  background-color: white;
  width: 35px;
}
</style>
