<script setup lang="ts">
import { Form, FormExpose } from '@/components/Form'
import { ref, unref, reactive, nextTick, getCurrentInstance } from 'vue'
import { propTypes } from '@/utils/propTypes'
import { DrawerWrap } from '@/components/DrawerWrap'
import { useEmitt } from '@/hooks/web/useEmitt'
import { ElButton, ElMessage, ElTooltip, ElTree } from 'element-plus'
import { useValidator } from '@/hooks/web/useValidator'
import { FormSchema } from '@/types/form'
import { saveRoleApi, editRoleApi, getRoleDetApi } from '@/api/role'
import { getRoleTreeSelectApi, getTreeSelectApi } from '@/api/menu'
import { RoleData } from '@/api/role/types'
import { MenuTreeData } from '@/api/menu/types'
import { ElDialog } from '@/components/ElDialog'

const { proxy } = getCurrentInstance() as any
const { sys_normal_disable } = proxy.useDict('sys_normal_disable')

// callback 类型
type Callback = (error?: string | Error | undefined) => void
const { required, notSpace } = useValidator()

const props = defineProps({
  title: propTypes.string.def('')
})
// 弹窗的开启和关闭
const DialogFlag = ref<any>(false)
const ElDialogFef = ref()
//已选择的菜单Id
let menuIds = ref<number[]>([])
let defaultCheckedKeys = ref<any>([])
const treeRef = ref<any>()

//菜单勾选事件
const menuCheckChange = (data: any, status: any, halfCheckedNodes, halfCheckedKeys) => {
  defaultCheckedKeys.value = [...status.checkedKeys]
  menuIds.value = [...status.checkedKeys, ...status.halfCheckedKeys]
  // unref(formRef)?.setSchema([
  //   {
  //     field: 'menuIds',
  //     path: 'componentProps.defaultCheckedKeys',
  //     value: menuIds.value
  //   }
  // ])
  setValues({
    menuIds: menuIds.value
  })
}

//分配数据权限
let treedata: MenuTreeData[] = []

const schema = reactive<FormSchema[]>([
  {
    field: 'roleName',
    label: '角色名称',
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
    field: 'roleKey',
    label: '权限字符',
    component: 'Input',
    colProps: {
      span: 12
    },
    componentProps: {
      maxlength: 10,
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
    field: 'roleSort',
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
    field: 'status',
    label: '角色状态',
    value: '0',
    component: 'Radio',
    componentProps: {
      options: sys_normal_disable
    },
    colProps: {
      span: 12
    }
  },
  {
    field: 'menuIds',
    label: '菜单权限',
    component: 'Tree',
    colProps: {
      span: 24
    },

    componentProps: {
      onCheck: menuCheckChange,
      style: 'width:100%;',
      showCheckbox: true,
      data: treedata,
      nodeKey: 'id',
      defaultCheckedKeys: defaultCheckedKeys.value
    },
    formItemProps: {
      // rules: [required('该项为必选项')]
    }

    // componentProps: {
    //   onCheck: menuCheckChange,
    //   style: 'width:100%;',
    //   showCheckbox: true,
    //   data: treedata,
    //   nodeKey: 'id'
    //   // defaultCheckedKeys: menuIds.value
    // }
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
      autosize: true,
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

const isShow = ref<boolean>(false)

const { emitter } = useEmitt({
  name: 'drawer',
  callback: (type: string) => {
    if (type === 'closed') {
      resetFormAfterClose()
    }
  }
})
const tree = ref()
const loading = ref(false)
//保存数据
const save = async () => {
  //表单验证
  const form = unref(formRef)
  const elFormRef = form?.getElFormRef()
  await elFormRef?.validate(async (isValid) => {
    if (isValid) {
      loading.value = true
      let data = form?.formModel as RoleData
      data.menuIds = menuIds.value.sort()
      if (data.roleId && detailsId.value) {
        editRole(data)
      } else {
        data.roleId = ''
        addRole(data)
      }
    }
  })
}

//编辑角色
const editRole = async (data: RoleData) => {
  const res = await editRoleApi(data)
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

//新增角色
const addRole = async (data: RoleData) => {
  const res = await saveRoleApi(data)
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

//打开drawer并初始化
const openDrawer = (flag: string, id: string) => {
  DialogFlag.value = true // 打开弹窗
  ElDialogFef.value.isFullscreen = false
  //重置表单
  nextTick(() => {
    detailsId.value = ''
    resetValue()
    treedata = []
    menuIds.value = []
    setMenuTreeValue()
    isSave.value = flag === 'see' ? false : true
    changeDisabled(flag === 'see')
    pageTite.value = flag === 'add' ? '新增' : flag === 'edit' ? '编辑' : '详情'
    // drawerWrap.value.isShow = true

    getMenuTreeData(id ? id : '')
  })

  // if (id) {
  //   getDetailsData(id)
  // }
}
const initSelectMenu = (data, pid?: any) => {
  data.forEach((item) => {
    // item.parentId = pid || 0
    let checkData = menuIds.value.find((s) => s === item.id)

    item.checked = checkData ? true : false
    item.isShow = checkData ? true : false
    if (item.children) {
      item.children = initSelectMenu(item.children, item.id)
    }
  })
  return data
}
const checkList = ref<any>([])
const initMenu = (data: any) => {
  data.forEach((item: any) => {
    if (item.children) {
      item.children = initMenu(item.children)
      // item.isCheck = initCheckedMenu(item.children)
      item.isCheck = item.children.every((s) => {
        return s.isCheck
      })
    } else {
      item.isCheck = item.checked
    }
    if (item.isCheck) {
      checkList.value.push(item.id)
    }
  })
  return data
}

const getMenuTreeData = async (id: string) => {
  defaultCheckedKeys.value = []
  checkList.value = []
  if (id) {
    const res = await getRoleTreeSelectApi(id)
    if (res && res.data) {
      treedata = res.data.menus
      menuIds.value = res.data.checkedKeys
      let list = await initSelectMenu(res.data.menus)
      // let listTwo = treeToList(list)
      setTimeout(() => {
        let newList = initMenu(list)

        if (newList) {
          defaultCheckedKeys.value = checkList.value
        }

        setMenuTreeData()
        setMenuTreeValue()
      }, 500)
    }
    getDetailsData(id)
  } else {
    const res = await getTreeSelectApi()
    if (res && res.data) {
      treedata = res.data
      setMenuTreeData()
    }
  }
}

//给菜单树赋值
const setMenuTreeValue = () => {
  nextTick(() => {
    unref(formRef)?.setSchema([
      {
        field: 'menuIds',
        path: 'componentProps.defaultCheckedKeys',
        value: defaultCheckedKeys.value
      }
    ])
    unref(formRef)?.setProps({
      defaultCheckedKeys: defaultCheckedKeys.value
    })
  })
}

const setMenuTreeData = () => {
  nextTick(() => {
    unref(formRef)?.setSchema([
      {
        field: 'menuIds',
        path: 'componentProps.data',
        value: treedata
      }
    ])
  })
}

//关闭drawer
const closeDrawer = () => {
  menuIds.value = []
  setMenuTreeValue()
  DialogFlag.value = false
}

const resetFormAfterClose = () => {
  detailsId.value = ''
  //重置表单
  resetValue()
}

let roleData = reactive<RoleData>({
  createBy: '',
  createTime: '',
  updateBy: '',
  updateTime: '',
  remark: '',
  roleId: '',
  roleName: '',
  roleKey: '',
  roleSort: null,
  dataScope: '1',
  menuCheckStrictly: false,
  deptCheckStrictly: false,
  status: '0',
  delFlag: '0',
  flag: false,
  menuIds: [],
  deptIds: [],
  permissions: '',
  admin: false
})

//获取详情
const getDetailsData = async (id: string) => {
  detailsId.value = id
  const res = await getRoleDetApi(id)
  if (res && res.data) {
    roleData = res.data
    roleData.menuIds = menuIds.value
    setValues(roleData)
  }
}

//表单赋值
const resetValue = () => {
  const elFormRef = unref(formRef)?.getElFormRef()
  elFormRef?.resetFields()
}

const setValues = (form: RoleData) => {
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

//控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasRole('admin')`)
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
      <template #roleKey-append>
        <ElTooltip
          effect="dark"
          content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasRole('admin')`)"
        >
          <Icon icon="ep:question-filled" />
        </ElTooltip>
      </template>
      <!-- <template #menuIds>
        <ElTree
          ref="treeRef"
          @check="menuCheckChange"
          style="width: 100%"
          :showCheckbox="true"
          :data="treedata"
          nodeKey="id"
        />
      </template> -->
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
:deep(.el-input-group__append) {
  background-color: white;
  width: 35px;
}

:deep(.el-input-number .el-input__inner) {
  text-align: left;
}
</style>
