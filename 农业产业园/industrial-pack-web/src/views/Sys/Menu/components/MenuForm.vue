<script setup lang="ts">
import { ref, unref, reactive, nextTick, getCurrentInstance } from 'vue'
import { CascaderValue, ElButton, ElMessage, ElTooltip, ElInput } from 'element-plus'
import { useRouter } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { Form, FormExpose } from '@/components/Form'
import { IconSelect } from '@/components/IconSelect'
import { Dialog } from '@/components/Dialog'
import { propTypes } from '@/utils/propTypes'
import { listToTree } from '@/utils/tree'

import { useEmitt } from '@/hooks/web/useEmitt'
import { useValidator } from '@/hooks/web/useValidator'
import { useCache } from '@/hooks/web/useCache'
import { useAppStore } from '@/store/modules/app'
import { usePermissionStore } from '@/store/modules/permission'
import { FormSchema } from '@/types/form'
import { ComponentOptions } from '@/types/components'
import { MenuData } from '@/api/menu/types'
import { saveMenuApi, editMenuApi, getMenuListApi, getMenuDetApi } from '@/api/menu'
import { getMenuList } from '@/api/common'

const appStore = useAppStore()
const permissionStore = usePermissionStore()
const { addRoute } = useRouter()
const { wsCache } = useCache()
const userInfo = wsCache.get(appStore.getUserInfo)
const { proxy } = getCurrentInstance() as any
// 表单校验
type Callback = (error?: string | Error | undefined) => void
const { required, validatePositiveInteger, notAllSpace } = useValidator()

const props = defineProps({
  title: propTypes.string.def('')
})

let options3: ComponentOptions[] = []

//FormItem显示隐藏
const setMenuFormHidden = (field: string, value: boolean) => {
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

//菜单类型选择
const menuTypeChange = (value: string) => {
  switchMenuType(value)
}

const switchMenuType = (value: string) => {
  if (value === 'M') {
    //目录
    checkCatalogue()
  } else if (value === 'C') {
    //菜单
    checkMenu()
  } else if (value === 'F') {
    //按钮
    checkButton()
  }
}

const checkCatalogue = () => {
  const hiddenComponent = ['component', 'perms', 'query', 'isCache']
  hiddenComponent.map((item) => {
    setMenuFormHidden(item, true)
  })
  let showComponent: any = []
  let form: any = unref(formRef)?.formModel
  if (form?.parentIds && form?.parentIds.length >= 2) {
    showComponent = ['isFrame', 'path', 'visible', 'status']
    unref(formRef)?.setSchema([
      {
        field: 'icon',
        path: 'hidden',
        value: true
      }
    ])
  } else {
    showComponent = ['icon', 'isFrame', 'path', 'visible', 'status']
  }
  showComponent.map((item) => {
    setMenuFormHidden(item, false)
  })
}

const checkMenu = () => {
  let showComponent: any = []
  let form: any = unref(formRef)?.formModel
  if (form?.parentIds && form?.parentIds.length >= 2) {
    showComponent = [
      'component',
      'perms',
      'query',
      'isCache',
      'isFrame',
      'path',
      'visible',
      'status'
    ]
    unref(formRef)?.setSchema([
      {
        field: 'icon',
        path: 'hidden',
        value: true
      }
    ])
  } else {
    showComponent = [
      'component',
      'perms',
      'query',
      'isCache',
      'icon',
      'isFrame',
      'path',
      'visible',
      'status'
    ]
  }
  showComponent.map((item) => {
    setMenuFormHidden(item, false)
  })
  unref(formRef)?.setSchema([
    {
      field: 'perms',
      path: 'formItemProps.rules',
      value: [
        {
          required: false,
          transform: (value) => {
            return value ? value.trim() : ''
          },
          message: '该项为必填项'
        }
      ]
    }
  ])

  // isRequired(false)
}

const checkButton = () => {
  const hiddenComponent = [
    'component',
    'perms',
    'query',
    'isCache',
    'icon',
    'isFrame',
    'path',
    'visible',
    'status'
  ]
  hiddenComponent.map((item) => {
    setMenuFormHidden(item, true)
  })
  setMenuFormHidden('perms', false)
  unref(formRef)?.setSchema([
    {
      field: 'perms',
      path: 'formItemProps.rules',
      value: [
        {
          required: true,
          transform: (value) => {
            return value ? value.trim() : ''
          },
          message: '该项为必填项'
        }
      ]
    }
  ])
}

//Cascader选择任意一级选项
const propsCascader = {
  checkStrictly: true
}
const menuTreeChange = (_: CascaderValue) => {
  // console.log('menuTreeChange==>', value)
}

const iconSelectShow = () => {
  showSelectIcon()
}
const formRef = ref<FormExpose>()
const isRequired = (val?: boolean) => {
  return {
    required: val,
    transform: (value) => {
      return value ? value.trim() : ''
    },
    message: '该项为必填项'
  }
}
const schema = reactive<FormSchema[]>([
  {
    field: 'parentIds',
    label: '上级菜单',
    component: 'Cascader',
    componentProps: {
      onChange: menuTreeChange,
      style: 'minWidth:100%;',
      clearable: false,
      options: options3,
      props: propsCascader,
      disabled: true
    },
    colProps: {
      span: 24
    },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'menuType',
    label: '菜单类型',
    value: 'M',
    component: 'Radio',
    formItemProps: {
      rules: [required()]
    },
    colProps: {
      span: 8
    },
    componentProps: {
      onChange: menuTypeChange,
      options: [
        {
          label: '目录',
          value: 'M'
        },
        {
          label: '菜单',
          value: 'C'
        },
        {
          label: '按钮',
          value: 'F'
        }
      ]
    }
  },
  {
    field: 'icon',
    label: '菜单图标',
    hidden: false,
    component: 'Popover',
    colProps: {
      span: 8
    },
    componentProps: {
      onBeforeEnter: iconSelectShow,
      maxlength: 20,
      clearable: false,
      disabled: false,
      width: '36%',
      trigger: 'click',
      slots: {
        reference: true,
        default: true
      }
    }
  },
  {
    field: 'menuName',
    label: '菜单名称',
    component: 'Input',
    colProps: {
      span: 8
    },
    componentProps: {
      maxlength: 50,
      clearable: false
    },
    formItemProps: {
      rules: [
        required(),
        {
          validator: (_: any, value: string, callback: Callback) => {
            notAllSpace(value, callback, '不能输入空格')
          },
          trigger: 'blur'
        }
      ]
    }
  },
  {
    field: 'orderNum',
    label: '显示顺序',
    value: null,
    component: 'Input',
    colProps: {
      span: 8
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
            validatePositiveInteger(value, callback, '请输入正整数')
          },
          trigger: 'blur'
        }
      ]
    }
  },
  {
    field: 'isFrame',
    label: '是否外链',
    hidden: false,
    value: '1',
    component: 'Radio',
    colProps: {
      span: 8
    },
    componentProps: {
      options: [
        {
          label: '是',
          value: '0'
        },
        {
          label: '否',
          value: '1'
        }
      ]
    }
  },
  {
    field: 'path',
    label: '路由地址',
    hidden: false,
    component: 'Input',
    colProps: {
      span: 8
    },
    componentProps: {
      maxlength: 100,
      clearable: false,
      slots: {
        append: true
      }
    },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'component',
    label: '组件路径',
    hidden: true,
    component: 'Input',
    colProps: {
      span: 8
    },
    componentProps: {
      maxlength: 100,
      clearable: false,
      slots: {
        append: true
      }
    }
  },
  {
    field: 'perms',
    label: '权限字符',
    hidden: true,
    component: 'Input',
    colProps: {
      span: 8
    },
    componentProps: {
      maxlength: 100,
      clearable: false,
      slots: {
        append: true
      }
    },
    formItemProps: {
      rules: [isRequired(true)]
    }
  },
  {
    field: 'query',
    label: '路由参数',
    hidden: true,
    component: 'Input',
    colProps: {
      span: 8
    },
    componentProps: {
      maxlength: 100,
      clearable: false,
      slots: {
        append: true
      }
    }
  },
  {
    field: 'isCache',
    label: '是否缓存',
    hidden: true,
    value: '0',
    component: 'Radio',
    colProps: {
      span: 8
    },
    componentProps: {
      options: [
        {
          label: '缓存',
          value: '0'
        },
        {
          label: '不缓存',
          value: '1'
        }
      ]
    }
  }
])

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
const getMenuDataList = async () => {
  await getMenuList().then((res) => {
    let routers: any[] = []
    routers = routers.concat(res.data)
    wsCache.set('roleRouters', routers)
    appStore.setDynamicRouter(true)
    permissionStore
      .generateRoutes('admin', routers)
      .then(() => {})
      .catch(() => {})
    permissionStore.getAddRouters.forEach((route) => {
      addRoute(route as RouteRecordRaw) // 动态添加可访问路由表
    })
    permissionStore.setIsAddRouters(false)
  })
}
//保存数据
const save = async () => {
  //表单验证
  const form = unref(formRef)
  const elFormRef = form?.getElFormRef()
  await elFormRef?.validate(async (isValid) => {
    if (isValid) {
      loading.value = true
      let data = form?.formModel as MenuData
      data.parentId = data.parentIds[data.parentIds.length - 1]
      data.icon = iconName.value

      if (data.menuId && detailsId.value) {
        editMenu(data)
      } else {
        data.menuId = ''
        addMenu(data)
      }
    }
  })
}

//编辑菜单
const editMenu = async (data: MenuData) => {
  const res = await editMenuApi(data)
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
    emitter.emit('getMenuList', 'edit')
    closeDrawer()
    if (userInfo.admin) {
      getMenuDataList()
    }
  }
}

//新增菜单
const addMenu = async (data: MenuData) => {
  const res = await saveMenuApi(data)
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
    emitter.emit('getMenuList', 'add')
    closeDrawer()
    if (userInfo.admin) {
      getMenuDataList()
    }
  }
}

const isSave = ref<boolean>(false)
const pageTite = ref<string>('')
const detailsId = ref<string>('')
//选中的菜单Id数组
let selectMenuIds: number[] = []

//打开drawer并初始化
const openDrawer = (flag: string, id?: string | undefined) => {
  isShow.value = true
  nextTick(() => {
    //重置表单
    detailsId.value = ''
    resetValue()

    getMenuTreeData(id, flag)
    isSave.value = flag === 'see' ? false : true
    changeDisabled(flag === 'see')
    pageTite.value = props.title + (flag === 'add' ? '新增' : flag === 'edit' ? '编辑' : '详情')
  })
}

//初始化数据
const createAddData = () => {
  selectMenuIds = [0]
  const formData = getInitData()
  formData.parentIds = selectMenuIds
  setFormValue(formData)
  switchMenuType(formData.menuType)
  nextTick(() => {
    if (formData.parentIds && formData.parentIds.length >= 2) {
      unref(formRef)?.setSchema([
        {
          field: 'icon',
          path: 'hidden',
          value: true
        }
      ])
    }
  })
}

const getInitData = () => {
  return {
    createBy: '',
    createTime: '',
    updateBy: '',
    updateTime: '',
    remark: '',
    menuName: '',
    parentName: '',
    parentId: 0,
    parentIds: [0],
    orderNum: null,
    path: '',
    component: '',
    query: '',
    isFrame: '1',
    isCache: '0',
    menuType: 'M',
    visible: '0',
    status: '0',
    perms: '',
    icon: ''
  }
}

//所有的菜单集合
let menuTempArray: any = []

const getMenuTreeData = async (id: string | undefined, flag: string) => {
  const res = await getMenuListApi({})
  if (res && res.data) {
    menuTempArray = []
    menuTempArray.push({ value: 0, label: '主类目', parentId: -1 })
    res.data.map((item: any) => {
      menuTempArray.push({ value: item.menuId, label: item.menuName, parentId: item.parentId })
    })
    options3 = listToTree(menuTempArray, { id: 'value', children: 'children', pid: 'parentId' })
    setMenuTreeData()
    initFormData(id, flag)
  }
}
const initFormData = (id: string | undefined, flag: string) => {
  if (id) {
    if (flag === 'add') {
      getParentMenu(Number(id))
    } else {
      getDetailsData(id)
    }
  } else {
    createAddData()
  }
}

const getParentMenu = (id: number) => {
  selectMenuIds = []
  const ids = getParentIdArray(id)
  const formData = getInitData()
  formData.parentIds = ids
  setFormValue(formData)
  switchMenuType(formData.menuType)
  nextTick(() => {
    if (formData.parentIds && formData.parentIds.length >= 2) {
      unref(formRef)?.setSchema([
        {
          field: 'icon',
          path: 'hidden',
          value: true
        }
      ])
    }
  })
}

const setMenuTreeData = () => {
  nextTick(() => {
    unref(formRef)?.setSchema([
      {
        field: 'parentIds',
        path: 'componentProps.options',
        value: options3
      }
    ])
  })
}

//关闭drawer
const closeDrawer = () => {
  isShow.value = false
}

const resetFormAfterClose = () => {
  detailsId.value = ''
  const formData = getInitData()
  setFormValue(formData)
  //重置表单
  resetValue()
}

//获取详情
const getDetailsData = async (id: string) => {
  detailsId.value = id
  const res = await getMenuDetApi(id)
  if (res && res.data) {
    const formData = Object.assign({}, res.data)
    selectMenuIds = []
    const ids = getParentIdArray(formData.parentId)
    formData.parentIds = ids

    iconName.value = formData.icon
    iconPath.value = formData.icon ? 'svg-icon:' + formData.icon : 'ep:search'
    setFormValue(formData)
    switchMenuType(formData.menuType)
    nextTick(() => {
      if (formData.parentIds && formData.parentIds.length >= 2) {
        unref(formRef)?.setSchema([
          {
            field: 'icon',
            path: 'hidden',
            value: true
          }
        ])
      }
    })
  }
}

//表单赋值
const resetValue = () => {
  iconName.value = null
  iconPath.value = 'ep:search'
  const elFormRef = unref(formRef)?.getElFormRef()
  elFormRef?.resetFields()
}

const setFormValue = (form: any) => {
  nextTick(() => {
    unref(formRef)?.setValues(form)
  })
}

//表单禁用
const changeDisabled = (bool: boolean) => {
  unref(formRef)?.setProps({
    disabled: bool
  })
}

//找父级Id
const getParentIdArray = (id: number) => {
  menuTempArray.map((item: any) => {
    if (item.value === id) {
      selectMenuIds.unshift(item.value)
      if (item.parentId === -1) {
        return selectMenuIds
      } else {
        getParentIdArray(item.parentId)
      }
    }
  })
  return selectMenuIds
}

const iconName = ref<string | null>(null)

const iconPath = ref<string>('ep:search')

const selected = (value: string) => {
  iconName.value = value
  iconPath.value = 'svg-icon:' + value
}

useEmitt({
  name: 'selected',
  callback: (value: string) => {
    selected(value)
  }
})

const iconSelectRef = ref<ComponentRef<typeof IconSelect>>()

const showSelectIcon = () => {
  unref(iconSelectRef)?.reset()
}

const iconClear = () => {
  iconPath.value = ''
}

defineExpose({
  isShow,
  openDrawer
})
</script>

<template>
  <Dialog v-model="isShow" width="70%" :title="pageTite" @close="closeDrawer">
    <Form :schema="schema" ref="formRef" class="form-content">
      <template #path-append>
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
      </template>
      <template #icon-reference>
        <ElInput
          placeholder="点击选择图标"
          clearable
          v-model="iconName"
          @clear="iconClear"
          @blur="showSelectIcon"
        >
          <template #prefix>
            <Icon :icon="iconPath" style="height: 32px; width: 16px" />
          </template>
        </ElInput>
      </template>
      <template #icon-default>
        <IconSelect ref="iconSelectRef" />
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
  min-width: 35px;
}
</style>
