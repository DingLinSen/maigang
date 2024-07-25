<script setup lang="ts">
import { Form, FormExpose } from '@/components/Form'
import { ref, unref, reactive, nextTick, getCurrentInstance } from 'vue'
import { ContentWrap } from '@/components/ContentWrap'
import { ElDialog } from '@/components/ElDialog'
import { propTypes } from '@/utils/propTypes'
import { DrawerWrap } from '@/components/DrawerWrap'
import { useEmitt } from '@/hooks/web/useEmitt'
import { CascaderValue, ElButton, ElMessage, ElTooltip, ElInput } from 'element-plus'
import { useValidator } from '@/hooks/web/useValidator'
import { FormSchema } from '@/types/form'
import { MenuData } from '@/api/menu/types'
import { saveMenuApi, editMenuApi, getMenuListApi, getMenuDetApi } from '@/api/menu'
import { ComponentOptions } from '@/types/components'
import { listToTree } from '@/utils/tree'
import { IconSelect } from '@/components/IconSelect'
import { string } from 'vue-types'
import { useCache } from '@/hooks/web/useCache'
import { useAppStoreWithOut } from '@/store/modules/app'

const { proxy } = getCurrentInstance() as any
const { sys_show_hide, sys_normal_disable } = proxy.useDict('sys_show_hide', 'sys_normal_disable')
// 表单校验
type Callback = (error?: string | Error | undefined) => void
const { required, notSpace, requiredChoose } = useValidator()
// 获取用户点击的操作状态
const isFlag = ref('')
// 用于判断菜单是否展示菜单图标字段
let treeLever = ref('0')
// 是否是添加主目录
let addMenuOne = ref<boolean>(false)
//全局存储和获取
const { wsCache } = useCache()
const appStore = useAppStoreWithOut()
const props = defineProps({
  title: propTypes.string.def('')
})
// 菜单类型是否禁用
const menuTypeDisable = ref(true)
// 弹窗的开启和关闭
const DialogFlag = ref<any>(false)
//插槽菜单类型
const menuTypeData = ref('')
let menuTypeList = []
const menuType = ref('')
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

//菜单类型选择， 点击菜单选项时触发
const menuTypeChange = (value: string) => {
  switchMenuType(value)
}

const switchMenuType = (value: string) => {
  const elFormRef = unref(formRef)?.getElFormRef()
  // icon 图标
  // menuName 菜单名
  // path 路由地址
  // component 组件路径
  // perms 权限字符
  // query 路由参数
  // isFrame 是否外链 1
  // status isCache visible
  if (value === 'M') {
    //目录
    unref(formRef)?.setValues({
      menuName: '',
      path: '',
      component: '',
      perms: '',
      query: '',
      isFrame: '1',
      status: '0',
      isCache: '0',
      visible: '0'
    })
    checkCatalogue()
  } else if (value === 'C') {
    unref(formRef)?.setValues({
      icon: null,
      menuName: '',
      path: '',
      component: '',
      perms: '',
      query: '',
      isFrame: '1',
      status: '0',
      isCache: '0',
      visible: '0'
    })
    iconName.value = ''
    iconPath.value = ''
    //菜单
    checkMenu()
  } else if (value === 'F') {
    unref(formRef)?.setValues({
      icon: null,
      menuName: '',
      path: '',
      component: '',
      perms: '',
      query: '',
      isFrame: '1',
      status: '0',
      isCache: '0',
      visible: '0'
    })
    iconName.value = ''
    iconPath.value = ''
    //按钮
    checkButton()
  }
  elFormRef?.resetFields(['menuName', 'path', 'component', 'query'])
}
// 控制表单字段是否显示
const checkCatalogue = () => {
  const hiddenComponent = ['component', 'perms', 'query', 'isCache']
  hiddenComponent.map((item) => {
    setMenuFormHidden(item, true)
  })
  let showComponent = ref<any>([])
  showComponent.value = ['icon', 'isFrame', 'path', 'visible', 'status']
  showComponent.value.map((item) => {
    setMenuFormHidden(item, false)
  })
}
// 点击菜单时控制菜单图标是否显示
const checkMenu = () => {
  const showComponent = ref<any>([])
  //  1.选中的是新增时，通过addMenuOne判断是否是新增主目录，如果是则不隐藏，
  //  2.如果不是则判断点击的是要新增目录还是菜单，目录的菜单图标全部展示（此处为点击菜单走的方法，点击目录的方法为checkCatalogue），菜单的菜单图标全部隐藏，
  //  3.编辑时判断根据父id是否为0判断treeLever是否为1
  if (addMenuOne.value || (isFlag.value !== 'add' ? treeLever.value === '1' : false)) {
    showComponent.value = [
      'component',
      'perms',
      'query',
      'icon',
      'isCache',
      'isFrame',
      'path',
      'visible',
      'status'
    ]
  } else {
    showComponent.value = [
      'component',
      'perms',
      'query',
      'isCache',
      'isFrame',
      'path',
      'visible',
      'status'
    ]
  }
  setMenuFormHidden('icon', true)
  showComponent.value.map((item) => {
    setMenuFormHidden(item, false)
  })
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
}

//Cascader选择任意一级选项
const propsCascader = {
  checkStrictly: true
}
const menuTreeChange = (value: CascaderValue) => {}

const iconSelectShow = () => {
  showSelectIcon()
}
//打开drawer并初始化
const openDrawer = (flag: string, row: any, main: boolean) => {
  //获取用户点击的操作状态
  isFlag.value = flag
  //判断新增时是不是要新增主目录
  if (main) {
    addMenuOne.value = true
  } else {
    addMenuOne.value = false
  }
  if (treeLever.value === '1') {
    treeLever.value = '0'
  }
  //重置表单
  detailsId.value = ''
  DialogFlag.value = true // 打开弹窗
  ElDialogFef.value.isFullscreen = false
  resetValue()
  getMenuTreeData(row ? row.menuId : '', flag)
  isSave.value = flag === 'see' ? false : true
  changeDisabled(flag === 'see')
  pageTite.value = flag === 'add' ? '新增' : flag === 'edit' ? '编辑' : '详情'
  if (flag === 'add') {
    menuTypeDisable.value = false
    nextTick(() => {
      if (!row) {
        menuType.value = 'M'
        unref(formRef)?.setSchema([
          {
            field: 'menuType',
            path: 'componentProps.options',
            value: [
              {
                label: '目录',
                value: 'M'
              },
              {
                label: '菜单',
                value: 'C'
              }
            ]
          }
        ])
      } else if (row.menuType === 'M') {
        menuType.value = 'M'
        unref(formRef)?.setSchema([
          {
            field: 'menuType',
            path: 'componentProps.options',
            value: [
              {
                label: '目录',
                value: 'M'
              },
              {
                label: '菜单',
                value: 'C'
              }
            ]
          }
        ])
      } else if (row.menuType === 'C') {
        menuType.value = 'F'
        unref(formRef)?.setSchema([
          {
            field: 'menuType',
            path: 'componentProps.options',
            value: [
              {
                label: '按钮',
                value: 'F'
              }
            ]
          }
        ])
      }
      menuTypeChange(menuType.value)
    })
  } else if (flag === 'edit') {
    // 打开的编辑未目录时展示菜单图标
    if (row.parentId === 0) {
      treeLever.value = '1'
    }
    menuTypeDisable.value = true
    nextTick(() => {
      if (row.menuType === 'M') {
        menuType.value = 'M'
        unref(formRef)?.setSchema([
          {
            field: 'menuType',
            path: 'componentProps.options',
            value: [
              {
                label: '目录',
                value: 'M'
              }
            ]
          }
        ])
      } else if (row.menuType === 'C') {
        menuType.value = 'C'
        unref(formRef)?.setSchema([
          {
            field: 'menuType',
            path: 'componentProps.options',
            value: [
              {
                label: '菜单',
                value: 'C'
              }
            ]
          }
        ])
      } else if (row.menuType === 'F') {
        menuType.value = 'F'
        unref(formRef)?.setSchema([
          {
            field: 'menuType',
            path: 'componentProps.options',
            value: [
              {
                label: '按钮',
                value: 'F'
              }
            ]
          }
        ])
      }
      menuTypeChange(menuType.value)
    })
  }
}
// 表单字段
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
      props: propsCascader
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
    componentProps: {
      disabled: menuTypeDisable,
      onChange: menuTypeChange,
      options: []
    }
  },
  {
    field: 'icon',
    label: '菜单图标',
    hidden: true,
    component: 'Popover',
    colProps: {
      span: 12
    },
    componentProps: {
      onBeforeEnter: iconSelectShow,
      maxlength: 20,
      clearable: true,
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
      span: 12
    },
    componentProps: {
      maxlength: 10,
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
    field: 'orderNum',
    label: '显示顺序',
    value: null,
    component: 'InputNumber',
    colProps: {
      span: 12
    },
    componentProps: {
      style: 'width:100%;',
      min: -999999,
      max: 999999,
      precision: 0,
      controlsPosition: 'right'
    },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'isFrame',
    label: '是否外链',
    hidden: false,
    value: '1',
    component: 'Radio',
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
      span: 12
    },
    componentProps: {
      maxlength: 100,
      clearable: false,
      slots: {
        append: true
      }
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
    field: 'component',
    label: '组件路径',
    hidden: true,
    component: 'Input',
    colProps: {
      span: 12
    },
    componentProps: {
      maxlength: 100,
      clearable: false,
      slots: {
        append: true
      }
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
    field: 'perms',
    label: '权限字符',
    hidden: true,
    component: 'Input',
    colProps: {
      span: 12
    },
    componentProps: {
      maxlength: 100,
      clearable: false,
      slots: {
        append: true
      }
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
    field: 'query',
    label: '路由参数',
    hidden: true,
    component: 'Input',
    colProps: {
      span: 12
    },
    componentProps: {
      maxlength: 100,
      clearable: false,
      slots: {
        append: true
      }
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
    field: 'isCache',
    label: '是否缓存',
    hidden: true,
    value: '0',
    component: 'Radio',
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
  },
  {
    field: 'visible',
    label: '显示状态',
    hidden: false,
    value: '0',
    component: 'Radio',
    componentProps: {
      options: sys_show_hide
    }
  },
  {
    field: 'status',
    label: '菜单状态',
    hidden: false,
    value: '0',
    component: 'Radio',
    componentProps: {
      options: sys_normal_disable
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
//默认选中菜单
const defaultSelectedType = (val: string) => {
  let chooseVal = ''
  if (val === 'M') {
    chooseVal = 'M'
  } else if (val === 'F') {
    chooseVal = 'F'
  }
  return chooseVal
}
const loading = ref(false)
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
      if (data.menuType === 'C' || data.menuType === 'M') {
        if (data.icon === null || data.icon === '') {
          data.icon = ' #'
        }
      }
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
      setTimeout(() => {
        loading.value = false
      }, 200)
    })
  if (res) {
    ElMessage.success('保存信息成功')
    emitter.emit('getList', 'add')
    closeDrawer()
  }
}

//新增菜单
const addMenu = async (data: MenuData) => {
  const res = await saveMenuApi(data)
    .catch(() => {})
    .finally(() => {
      setTimeout(() => {
        loading.value = false
      }, 200)
    })
  if (res) {
    ElMessage.success('保存信息成功')
    emitter.emit('getList', 'add')
    closeDrawer()
  }
}

const isSave = ref<boolean>(false)
const pageTite = ref<string>('')
const drawerWrap = ref<ComponentRef<typeof DrawerWrap>>()
const detailsId = ref<string>('')
//选中的菜单Id数组
let selectMenuIds: number[] = []

const ElDialogFef = ref()

//初始化数据
const createAddData = () => {
  selectMenuIds = [0]
  const formData = getInitData()
  // 对菜单类型进行赋值
  formData.menuType = defaultSelectedType(menuType.value)
  formData.parentIds = selectMenuIds
  setFormValue(formData)
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
    menuType: '',
    visible: '0',
    status: '0',
    perms: '',
    icon: ''
  }
}

//所有的菜单集合
let menuTempArray: any = []

const getMenuTreeData = async (id: string, flag: string) => {
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
const initFormData = (id: string, flag: string) => {
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

const getParentMenu = async (id: number) => {
  selectMenuIds = []
  const ids = await getParentIdArray(id)
  const formData = getInitData()
  // 对菜单类型进行赋值
  formData.menuType = defaultSelectedType(menuType.value)
  formData.parentIds = ids
  setFormValue(formData)
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
  // drawerWrap.value.isShow = false
  DialogFlag.value = false
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
    if (res.data.icon === ' #') {
      formData.icon = null
    }
    selectMenuIds = []
    const ids = getParentIdArray(formData.parentId)
    formData.parentIds = ids
    iconName.value = formData.icon
    iconPath.value = formData.icon ? 'svg-icon:' + formData.icon : 'ep:search'
    setFormValue(formData)
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
const clearReportName = () => {
  nextTick(() => {
    iconName.value = null
    iconPath.value = ''
    unref(formRef)?.setValues({ icon: null })
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
  unref(iconSelectRef).reset()
}

defineExpose({
  isShow,
  openDrawer
})
</script>

<template>
  <!-- 可设置宽度 :dialogWidth="400" -->
  <ElDialog
    ref="ElDialogFef"
    class="cultivate-custom"
    v-model="DialogFlag"
    :title="pageTite"
    @closed="DialogFlag = false"
  >
    <Form :schema="schema" ref="formRef">
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
          type="text"
          placeholder="点击选择图标"
          readonly
          v-model="iconName"
          @focus="showSelectIcon"
          clearable
        >
          <template #prefix>
            <Icon :icon="iconPath" class="icon-class" />
          </template>
          <template #suffix>
            <Icon
              v-show="iconName"
              icon="ant-design:close-circle-outlined"
              @click="clearReportName"
            />
          </template>
        </ElInput>
      </template>
      <template #icon-default>
        <IconSelect ref="iconSelectRef" />
      </template>
    </Form>
    <template #footer>
      <div class="footer">
        <el-button type="primary" :loading="loading" @click="save"> 提交 </el-button>
        <el-button @click="closeDrawer"> 取消 </el-button>
      </div>
    </template>
  </ElDialog>
</template>

<style lang="less" scoped>
.icon-class {
  height: 32px;
  width: 16px;
}
:deep(.el-input-group__append) {
  background-color: white;
  min-width: 35px;
}

:deep(.el-input-number .el-input__inner) {
  text-align: left;
}
</style>
