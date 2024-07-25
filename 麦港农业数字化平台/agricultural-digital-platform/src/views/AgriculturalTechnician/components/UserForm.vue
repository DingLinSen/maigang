<script setup lang="ts">
import { ref, unref, reactive, nextTick } from 'vue'
import { ElButton, ElMessage } from 'element-plus'
import { propTypes } from '@/utils/propTypes'
import { listToTree } from '@/utils/tree'
import { useEmitt } from '@/hooks/web/useEmitt'
import { useValidator } from '@/hooks/web/useValidator'
import { FormSchema } from '@/types/form'
import { Form, FormExpose } from '@/components/Form'
import { Dialog } from '@/components/Dialog'
import {
  saveUserApi,
  editUserApi,
  getUserInfoApi,
  getUserSelectApi,
  getUserDeptListApi
} from '@/api/user'
import { getRoleTreeSelectApi } from '@/api/menu'
// import { getPostOptionSelectApi } from '@/api/post'
import type { UserData, DeptTreeData } from '@/api/user/types'

// 表单校验
type Callback = (error?: string | Error | undefined) => void
// 引入表单校验
const {
  required,
  validateEngNumber,
  validatePassword,
  notSpace,
  // validateEmail,
  validatePhone,
  validateNormalBySearch,
  lengthRange
} = useValidator()

const props = defineProps({
  title: propTypes.string.def('')
})

const isSave = ref<boolean>(false)
const pageTite = ref<string>('')
const detailsId = ref<string>()
const currentDeptId = ref<any>()

// 初始化数据
let userData = reactive<any>({
  password: '',
  userId: undefined,
  createBy: '', // 创建人
  createTime: '', // 创建时间
  email: null, // 邮箱
  updateBy: '', // 修改人
  updateTime: '', // 修改时间
  deptName: '', // 部门名称
  mailbox: null,
  deptId: null, // 部门id
  remark: '', // 备注
  roles: [],
  posts: [],
  roleId: '', // 角色id
  roleIds: null, // 角色id
  postId: '',
  postIds: null, // 岗位id
  roleName: '', // 角色名称
  roleKey: '',
  roleSort: null,
  dataScope: '',
  phonenumber: null, // 手机号码
  menuCheckStrictly: false,
  deptCheckStrictly: false,
  status: '0', // 状态
  sex: '', // 性别
  delFlag: '0',
  flag: false,
  menuIds: [],
  deptIds: [],
  permissions: '',
  admin: false
})
// 角色权限-显示隐藏
const isShowRole = ref(false)
const checkedMenuList = ref<any>([])
const menuDataTree = ref<any>([])
const loading = ref(false)
const isShow = ref<boolean>(false)
//打开drawer并初始化
const openDrawer = (flag: string, id: string, deptId?: string) => {
  loading.value = true
  isShow.value = true
  nextTick(() => {
    currentDeptId.value = deptId || ''
    isShowRole.value = false
    menuDataTree.value = []
    //重置表单
    detailsId.value = undefined
    resetValue()
    isSave.value = flag === 'see' ? false : true
    changeDisabled(flag === 'see')
    // 标题名称
    pageTite.value = props.title + (flag === 'add' ? '新增' : flag === 'edit' ? '编辑' : '详情')
    if (flag === 'add' && currentDeptId.value) {
      unref(formRef)?.setValues({
        deptId: currentDeptId.value
      })
    }
    getDeptTreeList()
    getRoleSelectList()
    if (id) {
      getDetailsData(id)
    }
    loading.value = false
  })
}

//根据id获取详情
const getDetailsData = async (id?: string | undefined) => {
  detailsId.value = id
  const res = await getUserInfoApi(id)

  if (res && res.data) {
    const { user } = res.data
    userData = user
    userData.roleId = res.data.roleIds && res.data.roleIds.length > 0 ? res.data.roleIds[0] : null
    userData.postId = res.data.postIds && res.data.postIds.length > 0 ? res.data.postIds[0] : null
    if (userData.roleId) {
      getMenuTreeData(userData.roleId)
    }
    setValues(userData)
  }
}

let menuList = ref<any>([])
// 菜单数据初始化
const initSelectMenu = (data, pid?: any) => {
  data.forEach((item) => {
    item.parentId = pid || 0
    let checkData = checkedMenuList.value.find((s) => s === item.id)
    item.isShow = checkData ? true : false
    if (item.children) {
      item.children = initSelectMenu(item.children, item.id)
    }
    if (item.isShow) {
      item.children = []
      menuList.value.push(item)
    }
  })
  return data
}

// 获取角色权限
const getMenuTreeData = async (id: string) => {
  checkedMenuList.value = []
  menuDataTree.value = []
  menuList.value = []

  if (!id) return

  const res = await getRoleTreeSelectApi(id)
  if (res && res.data) {
    checkedMenuList.value = res.data.checkedKeys
    // menuDataTree.value = res.data.menus
    let list = initSelectMenu(res.data.menus)
    if (list) {
      menuDataTree.value = listToTree(menuList.value, {
        id: 'id',
        children: 'children',
        pid: 'parentId'
      })
    }
  }
}

//表单赋值
const resetValue = () => {
  const elFormRef = unref(formRef)?.getElFormRef()
  elFormRef?.resetFields()
}

// 左侧树形数据
const treedata = ref<DeptTreeData>()

// 获取部门树
const getDeptTreeList = async () => {
  loading.value = true
  try {
    const res = await getUserDeptListApi({ status: '0' }).finally(() => {
      loading.value = false
    })
    treedata.value = res.data
  } catch (err) {}
}

// 获取角色下拉列表
const roleSelectList = ref<any>([])
// 岗位数组
const postSelectList = ref<any>([])

// 获取角色下拉
const getRoleSelectList = async () => {
  loading.value = true
  try {
    const res = await getUserSelectApi({ status: '0' })
    roleSelectList.value = selectionEdit(res.data.roles, 'roleName', 'roleId')
    postSelectList.value = selectionEdit(res.data.posts, 'postName', 'postId')
  } catch (err) {
    ElMessage.error('服务器错误')
  }
}
// 获取岗位下拉
// const getPostSelectList = async () => {
//   loading.value = true
//   try {
//     const res = await getPostOptionSelectApi().finally(() => {
//       loading.value = false
//     })
//     postSelectList.value = selectionEdit(res.data, 'postName', 'postId')
//   } catch (err) {
//     console.log(err)
//   }
// }

// 下拉选项重组
const selectionEdit = (data: any, lable: string, value: string) => {
  const editData = data.map((item: any) => {
    return (item = Object.assign(item, {
      label: item[lable],
      value: item[value]
    }))
  })

  return editData
}
const userTypeData = ref([
  {
    label: '农户',
    value: '01'
  },
  {
    label: '农技员',
    value: '02'
  }
])
// 表单项
const schema = reactive<FormSchema[]>([
  {
    field: 'userType', // key
    label: '角色名称', // label
    component: 'Select', // 使用组件
    colProps: {
      // 所占col
      span: 8
    },
    componentProps: {
      //组件配置
      style: 'width:100%;', //宽度
      minlength: 2,
      maxlength: 20, //最大输入长度
      controlsPosition: 'right',
      options: userTypeData
    },
    formItemProps: {
      // 表单校验
      rules: [required()]
    }
  },
  {
    field: 'userName', // key
    label: '用户名称', // label
    component: 'Input', // 使用组件
    colProps: {
      // 所占col
      span: 8
    },
    componentProps: {
      //组件配置
      style: 'width:100%;', //宽度
      minlength: 2,
      maxlength: 20, //最大输入长度
      controlsPosition: 'right'
    },
    formItemProps: {
      // 表单校验
      rules: [
        required(),
        {
          validator: (_: any, value: string, callback: Callback) =>
            notSpace(value, callback, '用户名称不能有空格'),
          trigger: 'blur'
        },
        {
          validator: (_: any, value: string, callback: Callback) =>
            validateEngNumber(value, callback, '用户名称只能包含英⽂字母、数字、下划线、短杠'),
          trigger: 'blur'
        },
        {
          validator: (_: any, value: string, callback: Callback) =>
            lengthRange(value, callback, { min: 2, max: 20, message: '长度范围2-20' }),
          trigger: 'blur'
        }
      ]
    }
  },
  {
    field: 'nickName', // key
    label: '姓名', // label
    component: 'Input', // 使用组件
    colProps: {
      // 所占col
      span: 8
    },
    componentProps: {
      //组件配置
      style: 'width:100%;', //宽度
      maxlength: 20, //最大输入长度
      controlsPosition: 'right'
    },
    formItemProps: {
      // 表单校验
      rules: [
        required(),
        {
          validator: (_: any, value: string, callback: Callback) =>
            validateNormalBySearch(value, callback, '仅支持汉字字母数字'),
          trigger: 'blur'
        }
      ]
    }
  },
  // {
  //   field: 'roleId',
  //   label: '角色权限',
  //   component: 'Select',
  //   colProps: {
  //     // 所占col
  //     span: 8
  //   },
  //   componentProps: {
  //     style: 'width:100%;', //宽度
  //     // multiple: true,
  //     options: roleSelectList,
  //     onChange: (val) => {
  //       getMenuTreeData(val)
  //     }
  //   },
  //   formItemProps: {
  //     // 表单校验
  //     rules: [required()]
  //   }
  // },
  {
    field: 'password',
    label: '密码',
    component: 'Input',
    colProps: {
      // 所占col
      span: 8
    },
    componentProps: {
      //组件配置
      style: 'width:100%;', //宽度
      maxlength: 20, //最大输入长度
      controlsPosition: 'right'
    },
    formItemProps: {
      // 表单校验
      rules: [
        required(),
        {
          validator: (_: any, value: string, callback: Callback) =>
            validatePassword(value, callback, '密码必须由数字、字母组合,请输入6-16位'),
          trigger: 'blur'
        }
      ]
    }
  },
  {
    field: 'phonenumber', // key
    label: '联系方式', // label
    component: 'Input', // 使用组件
    colProps: {
      // 所占col
      span: 8
    },
    componentProps: {
      //组件配置
      style: 'width:100%;', //宽度
      maxlength: 50, //最大输入长度
      controlsPosition: 'right'
    },
    formItemProps: {
      // 表单校验
      rules: [
        {
          validator: (_: any, value: string, callback: Callback) => {
            if (value) {
              validatePhone(
                value,
                callback,
                '请输入正确的手机号码格式,如18888888888 或 0511-4405222'
              )
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }
      ]
    }
  }
])

const formRef = ref<FormExpose>()

const { emitter } = useEmitt({
  name: 'drawer',
  callback: (type: string) => {
    if (type === 'closed') {
      resetFormAfterClose()
    }
  }
})

//保存数据
const save = async () => {
  //表单验证
  const form = unref(formRef)
  const elFormRef = form?.getElFormRef()
  await elFormRef?.validate(async (isValid) => {
    if (isValid) {
      loading.value = true
      let data = form?.formModel as any
      data.phonenumber = data.phonenumber || ''
      data.userId = detailsId.value || undefined
      data.postId = '0'
      data.password = data.password || ''
      // data.menuIds = menuIds.value
      // let post = data.postIds && Array.isArray(data.postIds) ? data.postIds : [data.postIds]
      // let roleIds = data.roleIds && Array.isArray(data.roleIds) ? data.roleIds : [data.roleIds]
      // data.postIds = data.postIds ? post : null
      // data.roleIds = data.roleIds ? roleIds : null
      data.roleId = data.userType == '01' ? '03' : '04'
      if (data.userId && detailsId.value) {
        editUser(data)
      } else {
        data.userId = undefined
        addUser(data)
      }
    }
  })
}

//编辑用户
const editUser = async (data: UserData) => {
  const res = await editUserApi(data)
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
    emitter.emit('getAppUserList', 'edit')
    closeDrawer()
  }
}

//新增用户
const addUser = async (data: UserData) => {
  const res = await saveUserApi(data)
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
    emitter.emit('getAppUserList', 'add')
    closeDrawer()
  }
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
//表单赋值
const setValues = (form: UserData) => {
  unref(formRef)?.setValues(form)
}

//表单赋值
const setValue = (reset: boolean) => {
  const elFormRef = unref(formRef)?.getElFormRef()
  if (reset) {
    elFormRef?.resetFields()
  } else {
    unref(formRef)?.setValues({
      field1: 'field1',
      field2: '2',
      field3: '2',
      field4: ['1', '3'],
      field5: '2022-01-27',
      field6: '17:00'
    })
  }
}

//表单禁用
const changeDisabled = (bool: boolean) => {
  unref(formRef)?.setProps({
    disabled: bool
  })
}

const defaultProps = {
  children: 'children',
  label: 'label',
  disabled: 'label'
}
// 查看角色权限
const viewRole = () => {
  isShowRole.value = !isShowRole.value
}
defineExpose({
  isShow,
  openDrawer
})
</script>

<template>
  <Dialog
    v-model="isShow"
    width="70%"
    :maxHeight="'calc(80vh - 136px)'"
    :title="pageTite"
    @close="closeDrawer"
  >
    <Form :schema="schema" ref="formRef" class="form-content" />
    <template v-if="isShowRole">
      <el-tree :data="menuDataTree" :props="defaultProps" node-key="id">
        <template #default="{ node }">
          <span class="custom-tree-node">
            <span>{{ node.label }}</span>
          </span>
        </template>
      </el-tree>
    </template>
    <template #footer>
      <div class="details-footer">
        <ElButton @click="closeDrawer"> 取消 </ElButton>
        <ElButton v-if="isSave" type="primary" :loading="loading" @click="save"> 保存 </ElButton>
      </div>
    </template>
  </Dialog>
</template>
