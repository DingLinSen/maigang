<script setup lang="ts">
import { ref, unref, reactive, nextTick, getCurrentInstance } from 'vue'
import { ElButton, ElMessage, ElTooltip } from 'element-plus'
import { Form, FormExpose } from '@/components/Form'
import { Dialog } from '@/components/Dialog'
import { propTypes } from '@/utils/propTypes'
// import { treeToList } from '@/utils/tree'
import { useEmitt } from '@/hooks/web/useEmitt'
import { useValidator } from '@/hooks/web/useValidator'
import { FormSchema } from '@/types/form'
import { saveRoleApi, editRoleApi, getRoleDetApi } from '@/api/role'
import { getRoleTreeSelectApi, getTreeSelectApi } from '@/api/menu'
import { RoleData } from '@/api/role/types'
import { MenuTreeData } from '@/api/menu/types'

const { proxy } = getCurrentInstance() as any
// 表单校验
type Callback = (error?: string | Error | undefined) => void
const { required, validatePositiveIntegerN } = useValidator()

const props = defineProps({
  title: propTypes.string.def('')
})
//已选择的菜单Id
let menuIds = ref<any>([])
let defaultCheckedKeys = ref<any>([])

//菜单勾选事件
const menuCheckChange = (_: any, status: any) => {
  defaultCheckedKeys.value = [...status.checkedKeys]
  menuIds.value = [...status.checkedKeys, ...status.halfCheckedKeys]
  unref(formRef)?.setValues({
    menuIds: menuIds.value.length === 0 ? null : menuIds.value
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
      span: 8
    },
    componentProps: {
      maxlength: 50,
      clearable: false
    },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'roleKey',
    label: '权限字符',
    component: 'Input',
    colProps: {
      span: 8
    },
    componentProps: {
      maxlength: 50,
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
    field: 'roleSort',
    label: '角色顺序',
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
            validatePositiveIntegerN(value, callback, 6, '请输入6位以内正整数')
          },
          trigger: 'blur'
        }
      ]
    }
  },
  {
    field: 'menuIds',
    label: '菜单权限',
    component: 'Tree',
    colProps: {
      span: 24
    },
    hidden: false,
    componentProps: {
      onCheck: menuCheckChange,
      style: 'width:100%;',
      showCheckbox: true,
      data: treedata,
      nodeKey: 'id',
      defaultCheckedKeys: defaultCheckedKeys.value
    },
    formItemProps: {
      rules: [required()]
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
      nextTick(() => {
        setTimeout(() => {
          loading.value = false
        }, 300)
      })
    })
  if (res) {
    ElMessage.success('成功保存信息')
    emitter.emit('getRoleList', 'edit')
    closeDrawer()
  }
}

//新增角色
const addRole = async (data: RoleData) => {
  const res = await saveRoleApi(data)
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
    emitter.emit('getRoleList', 'add')
    closeDrawer()
  }
}

const isSave = ref<boolean>(false)
const pageTite = ref<string>('')
const detailsId = ref<string>('')

//打开drawer并初始化
const openDrawer = (flag: string, id?: string) => {
  isShow.value = true
  nextTick(() => {
    //重置表单
    detailsId.value = ''
    resetValue()
    treedata = []
    menuIds.value = []
    setMenuTreeValue()
    isSave.value = flag === 'see' ? false : true
    changeDisabled(flag === 'see')
    pageTite.value = props.title + (flag === 'add' ? '新增' : flag === 'edit' ? '编辑' : '详情')

    getMenuTreeData(id ? id : '', flag)
  })
}
const initSelectMenu = (data, pid?: any) => {
  data.forEach((item) => {
    item.parentId = pid || 0
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
// const initCheckedMenu = (data) => {
//   let list = data.filter((s) => s.checked)
//   return list.length === data.length ? true : false
// }
const initMenu = (data) => {
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
// const initMenuChecked = (data) => {
//   data.forEach((item: any) => {
//     if (item.children) {
//       item.isCheck = initCheckedMenu(item.children)
//       item.children = initMenu(item.children)
//     } else {
//       item.isCheck = item.checked
//     }
//     item.isCheck = item.children.every((s) => {
//       return s.isCheck
//     })
//     if (item.isCheck) {
//       checkList.value.push(item.id)
//     }
//   })
//   return data
// }

const getMenuTreeData = async (id: string, flag: string) => {
  defaultCheckedKeys.value = []
  checkList.value = []
  if (id) {
    const res = await getRoleTreeSelectApi(id)
    if (res && res.data) {
      treedata = res.data.menus
      menuIds.value = res.data.checkedKeys
      hiddenMenuTree(false)
      //判断是否为查看，查看时判断是否有选中的，未有选中的时候隐藏菜单
      if (flag === 'see') {
        if (menuIds.value.length < 1) {
          hiddenMenuTree(true)
        }
      }
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
    // setValues({
    //   menuIds: menuIds.value
    // })
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
const hiddenMenuTree = (val) => {
  nextTick(() => {
    unref(formRef)?.setSchema([
      {
        field: 'menuIds',
        path: 'hidden',
        value: val
      }
    ])
  })
}
//关闭drawer
const closeDrawer = () => {
  menuIds.value = []
  defaultCheckedKeys.value = []
  setMenuTreeValue()
  isShow.value = false
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
  <Dialog v-model="isShow" width="70%" :title="pageTite" @close="closeDrawer">
    <Form :schema="schema" ref="formRef" class="form-content">
      <template #roleKey-append>
        <ElTooltip
          effect="dark"
          content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasRole('admin')`)"
        >
          <Icon icon="ep:question-filled" />
        </ElTooltip>
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
</style>
