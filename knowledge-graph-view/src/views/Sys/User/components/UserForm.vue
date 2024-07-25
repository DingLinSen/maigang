<script lang="ts" setup>
import { Form, FormExpose } from '@/components/Form'
import { ref, unref, reactive, nextTick } from 'vue'
// import { ContentWrap } from '@/components/ContentWrap'
import { propTypes } from '@/utils/propTypes'

import { ElDialog } from '@/components/ElDialog'
import { useEmitt } from '@/hooks/web/useEmitt'
import { ElButton, ElMessage, ElSelect, ElOption, ElTreeSelect } from 'element-plus'
import { useValidator } from '@/hooks/web/useValidator'
import { FormSchema } from '@/types/form'
import {
  saveUserApi,
  editUserApi,
  getUserInfoApi,
  getUserSelectApi,
  getUserDeptListApi,
  getEenoApi
} from '@/api/user'

import { getPostOptionSelectApi } from '@/api/post'
import type { UserData, DeptTreeData } from '@/api/user/types'

// 角色数组
const roleIdsList = ref<any>([])
// 部门数组
const deptIdsList = ref<any>(null)
// 表单校验
type Callback = (error?: string | Error | undefined) => void
// 引入表单校验
const {
  required,
  validateUserName,
  validatePassword,
  notSpace,
  validateSpace,
  validateSpaceFirst,
  validateSpaceLast,
  validateEmail,
  validatePhone,
  validatePhoneNumber,
  validateNormalBySearch
} = useValidator()

const props = defineProps({
  isAction: propTypes.string.def(''),
  dialogTitle: propTypes.string.def(''), // 弹窗名
  title: propTypes.string.def('')
})

// 弹窗的开启和关闭
const DialogFlag = ref<any>(false)

const isSave = ref<boolean>(false)
const pageTite = ref<string>('')

const detailsId = ref<string>()

// 初始化数据
let userData = reactive<UserData>({
  userId: undefined,
  password: '',
  eeno: '',
  createBy: '',
  createTime: '',
  email: null,
  updateBy: '',
  userName: '',
  updateTime: '',
  deptName: '',
  mailbox: null,
  deptId: null,
  remark: '',
  roles: [],
  roleId: '',
  roleIds: [],
  postIds: [],
  roleName: '',
  roleKey: '',
  roleSort: null,
  dataScope: '',
  phonenumber: null,
  menuCheckStrictly: false,
  deptCheckStrictly: false,
  status: '0',
  sex: '',
  delFlag: '0',
  flag: false,
  menuIds: [],
  deptIds: [],
  permissions: '',
  admin: false,
  user: {
    userId: undefined,
    createBy: '',
    createTime: '',
    email: null,
    mailbox: null,
    updateBy: '',
    updateTime: '',
    deptName: '',
    deptId: null,
    remark: '',
    roles: [],
    roleIds: [],
    postIds: [],
    roleId: '',
    roleName: '',
    roleKey: '',
    roleSort: null,
    dataScope: '',
    phonenumber: null,
    menuCheckStrictly: false,
    deptCheckStrictly: false,
    status: '',
    sex: '',
    password: '',
    delFlag: '',
    flag: false,
    menuIds: [],
    deptIds: [],
    permissions: '',
    admin: false
  }
})
// 表单部分禁用
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

const ElDialogFef = ref()
//打开drawer并初始化
const openDrawer = async (flag: string, id?: string) => {
  //重置表单
  detailsId.value = ''
  resetValue()
  isSave.value = flag === 'see' ? false : true
  DialogFlag.value = true // 打开弹窗
  ElDialogFef.value.isFullscreen = false
  roleIdsList.value = []
  deptIdsList.value = null
  // 标题名称
  pageTite.value = props.title + (flag === 'add' ? '新增' : flag === 'edit' ? '编辑' : '详情')
  setFormHidden('password', flag === 'add' || flag === 'edit' ? true : false)

  // changeDisabled(flag === 'see')
  getDeptTreeList()
  getRoleSelectList()
  getPostSelectList()

  if (flag === 'add') {
    let eeon = await getEenoApi()
    nextTick(() => {
      formDisabled({ userName: '' }, false)
    })
    if (eeon.data) {
      unref(formRef)?.setValues({
        eeno: eeon.data
      })
    }

    if (id) {
      getDetailsData(id)
    } else {
      unref(formRef)?.setValues({
        password: ''
      })
    }
  } else {
    nextTick(() => {
      formDisabled({ userName: '' }, true)
      getDetailsData(id)
    })
  }
}
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

//根据id获取详情
const getDetailsData = async (id?: string | undefined) => {
  // const elFormRef = unref(formRef)?.getElFormRef()
  detailsId.value = id
  const res = await getUserInfoApi(id)

  if (res && res.data) {
    const { user } = res.data

    // elFormRef?.resetFields(['postIds', 'roleIds'])
    userData = user

    userData.roleIds = res.data.roleIds
    roleIdsList.value = userData.roleIds
    deptIdsList.value = userData.deptId
    userData.postIds = res.data.postIds

    setValues(userData)
  }
}
//表单赋值
const resetValue = () => {
  const elFormRef = unref(formRef)?.getElFormRef()
  elFormRef?.resetFields()
}

const dataSelectDisable = (data: any) => {
  if (data.length) {
    data.forEach((item: any) => {
      if (item.status) {
        // item.disabled = item.status === '0' ? false : true
      }
      if (item.children) {
        data.children = dataSelectDisable(item.children)
      }
    })

    return data
  } else {
    return []
  }
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

    treedata.value = dataSelectDisable(res.data)
  } catch (err) {}
}

// 获取角色下拉列表
const roleSelectList = ref<any>([])
// 岗位数组
const postSelectList = ref([])

// 获取角色下拉
const getRoleSelectList = async () => {
  loading.value = true
  try {
    const res = await getUserSelectApi()
    // const res = await getRoleOptionSelectApi().finally(() => {
    //   loading.value = false
    // })
    roleSelectList.value = selectionEdit(res.data.roles, 'roleName', 'roleId')
    postSelectList.value = selectionEdit(res.data.posts, 'postName', 'postId')
  } catch (err) {
    console.log(err)
  }
}
// 获取岗位下拉
const getPostSelectList = async () => {
  loading.value = true
  try {
    const res = await getPostOptionSelectApi().finally(() => {
      loading.value = false
    })
    postSelectList.value = selectionEdit(res.data, 'postName', 'postId')
  } catch (err) {
    console.log(err)
  }
}

// 下拉选项重组
const selectionEdit = (data: any, lable: string, value: string) => {
  const editData = data.map((item: any) => {
    return (item = Object.assign(item, {
      label: item[lable],
      value: item[value]
    }))
    // item.value = item.roleId
  })

  return editData
}

// 监听角色的选择
const changeRoleIds = (val: any) => {
  console.log(val)
  // unref(userData).roleIds = val
  setValues({ roleIds: val })
}
const changeDetId = (val: any) => {
  setValues({ deptId: val })
}

// 表单项
const schema = reactive<FormSchema[]>([
  {
    field: 'userName', // key
    label: '用户名', // label
    component: 'Input', // 使用组件
    colProps: {
      // 所占col
      span: 12
    },
    componentProps: {
      autocomplete: 'new-password',
      disabled: false,
      //组件配置
      style: 'width:100%;', //宽度
      maxlength: 16, //最大输入长度
      controlsPosition: 'right'
    },
    formItemProps: {
      // 表单校验
      rules: [
        required(),
        {
          validator: (rule: any, value: string, callback: Callback) =>
            notSpace(value, callback, '不能输入纯空格'),
          trigger: 'blur'
        },
        {
          validator: (rule: any, value: string, callback: Callback) =>
            validateUserName(value, callback, '用户名只能为字母，数字，下划线，减号,请输入3-16位'),
          trigger: 'blur'
        }
      ]
    }
  },
  {
    field: 'password', // key
    label: '用户密码', // label
    component: 'Input', // 使用组件
    colProps: {
      // 所占col
      span: 12
    },
    componentProps: {
      autocomplete: 'new-password',
      showPassword: true,
      disabled: false,
      //组件配置
      style: 'width:100%;', //宽度
      maxlength: 16, //最大输入长度
      controlsPosition: 'right'
    },
    formItemProps: {
      // 表单校验
      rules: [
        required(),
        {
          validator: (rule: any, value: string, callback: Callback) =>
            validateSpaceFirst(value, callback, '密码中开头不能有空格'),
          trigger: 'blur'
        },
        {
          validator: (rule: any, value: string, callback: Callback) =>
            validateSpaceLast(value, callback, '密码中结尾不能有空格'),
          trigger: 'blur'
        },
        {
          validator: (rule: any, value: string, callback: Callback) =>
            validateSpace(value, callback, '密码中不能有空格'),
          trigger: 'blur'
        },
        {
          validator: (rule: any, value: string, callback: Callback) =>
            notSpace(value, callback, '不能输入纯空格'),
          trigger: 'blur'
        },
        {
          validator: (rule: any, value: string, callback: Callback) =>
            validatePassword(value, callback, '密码必须由数字、字母、特殊字符组合,请输入6-16位'),
          trigger: 'blur'
        }
      ]
    }
  },
  {
    field: 'eeno', // key
    label: '工号', // label
    component: 'Input', // 使用组件
    colProps: {
      // 所占col
      span: 12
    },
    componentProps: {
      autocomplete: 'new-password',
      disabled: true,
      //组件配置
      style: 'width:100%;', //宽度
      maxlength: 16, //最大输入长度
      controlsPosition: 'right'
    },
    formItemProps: {
      // 表单校验
      // rules: [required()]
    }
  },
  {
    field: 'nickName', // key
    label: '用户昵称', // label
    component: 'Input', // 使用组件
    colProps: {
      // 所占col
      span: 12
    },
    componentProps: {
      disabled: false,
      //组件配置
      autocomplete: 'new-password',
      style: 'width:100%;', //宽度
      maxlength: 10, //最大输入长度
      controlsPosition: 'right'
    },
    formItemProps: {
      // 表单校验
      rules: [
        required(),
        {
          validator: (rule: any, value: string, callback: Callback) =>
            notSpace(value, callback, '不能输入纯空格'),
          trigger: 'blur'
        },
        {
          validator: (rule: any, value: string, callback: Callback) =>
            validateNormalBySearch(value, callback, '仅支持汉字字母数字'),
          trigger: 'blur'
        }
      ]
    }
  },
  {
    field: 'sex',
    label: '用户性别',
    component: 'Select',
    colProps: {
      // 所占col
      span: 12
    },
    componentProps: {
      disabled: false,
      style: 'width:100%;', //宽度
      filterable: true,
      options: [
        // 下拉选项
        {
          label: '男',
          value: '0'
        },
        {
          label: '女',
          value: '1'
        },
        {
          label: '未知',
          value: '2'
        }
      ]
    },
    formItemProps: {
      // 表单校验
      rules: []
    }
  },
  {
    field: 'deptId',
    label: '部门',
    // component: 'TreeSelect',
    colProps: {
      // 所占col
      span: 12
    },
    // componentProps: {
    //   disabled: false,
    //   style: 'width:100%;', //宽度
    //   filterable: true,
    //   checkStrictly: true,
    //   data: treedata,
    //   popperClass: 'deptId-popper',
    //   nodeKey: 'id',
    //   onChange: changeDetId
    //   // onNodeClick: changeDetId
    // },
    formItemProps: {
      // 表单校验
      rules: [
        {
          required: true,
          message: '该项为必选项',
          trigger: 'blur'
        }
      ]
    }
  },
  {
    field: 'postIds',
    label: '职务',
    component: 'Select',
    colProps: {
      // 所占col
      span: 12
    },
    componentProps: {
      disabled: false,
      style: 'width:100%;', //宽度
      popperClass: 'postIds-popper',
      multiple: true,
      filterable: true,
      collapseTags: true,
      collapseTagsTooltip: true,
      options: postSelectList
    },
    formItemProps: {
      // 表单校验
      rules: [
        {
          required: true,
          message: '该项为必选项',
          trigger: 'blur'
        }
      ]
    }
  },
  {
    field: 'roleIds',
    label: '角色',
    // component: 'Select',
    colProps: {
      // 所占col
      span: 12
    },
    // componentProps: {
    //   style: 'width:100%;', //宽度
    //   multiple: true,
    //   disabled: false,
    //   popperClass: 'roleIds-popper',
    //   filterable: true,
    //   collapseTags: true,
    //   collapseTagsTooltip: true,
    //   options: roleSelectList
    // },
    formItemProps: {
      // 表单校验
      rules: [
        {
          required: true,
          message: '该项为必选项',
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
      span: 12
    },
    componentProps: {
      disabled: false,
      //组件配置
      style: 'width:100%;', //宽度
      maxlength: 15, //最大输入长度
      controlsPosition: 'right'
    },
    formItemProps: {
      // 表单校验
      rules: [
        {
          validator: (rule: any, value: string, callback: Callback) =>
            notSpace(value, callback, '不能输入纯空格'),
          trigger: 'blur'
        },
        {
          validator: (rule: any, value: string, callback: Callback) => {
            if (value) {
              validatePhoneNumber(value, callback, '请输入正确的手机号或(区号)+电话号码')
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }
      ]
    }
  },
  {
    field: 'email', // key
    label: '邮箱', // label
    component: 'Input', // 使用组件
    colProps: {
      // 所占col
      span: 12
    },
    componentProps: {
      disabled: false,
      //组件配置
      style: 'width:100%;', //宽度
      maxlength: 20, //最大输入长度
      controlsPosition: 'right'
    },
    formItemProps: {
      // 表单校验
      rules: [
        { required: false, trigger: 'blur' },
        {
          validator: (rule: any, value: string, callback: Callback) => {
            if (value) {
              validateEmail(value, callback, '请输入正确的邮箱格式,如1465555@qq.com')
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }
      ]
    }
  },
  {
    field: 'status', // key
    label: '状态', // label
    value: '0',
    component: 'Radio', // 使用组件
    // value: '0',
    colProps: {
      // 所占col
      span: 12
    },
    componentProps: {
      disabled: false,
      //组件配置
      style: 'width:100%;', //宽度
      // maxlength: 500, //最大输入长度
      controlsPosition: 'right',
      options: [
        {
          label: '正常',
          value: '0'
        },
        {
          label: '停用',
          value: '1'
        }
      ]
    },
    formItemProps: {
      // 表单校验
      rules: []
    }
  },
  {
    field: 'remark', // key
    label: '备注', // label
    component: 'Input', // 使用组件
    colProps: {
      // 所占col
      span: 24
    },
    componentProps: {
      disabled: false,
      //组件配置
      type: 'textarea',
      style: 'width:100%;', //宽度
      maxlength: 500, //最大输入长度
      autosize: true,
      controlsPosition: 'right'
    },
    formItemProps: {
      // 表单校验
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

const loading = ref(false)

//保存数据
const save = async () => {
  //表单验证
  unref(formRef)?.setValues({
    password: '123456'
  })
  const form = unref(formRef)
  const elFormRef = form?.getElFormRef()
  await elFormRef?.validate(async (isValid) => {
    if (isValid) {
      loading.value = true
      let data = form?.formModel as UserData
      data.email = data.email && data.email !== '' ? data.email : ''
      data.phonenumber = data.phonenumber && data.phonenumber !== '' ? data.phonenumber : ''
      data.userId = detailsId.value ? detailsId.value : undefined
      // data.menuIds = menuIds.value
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

//新增用户
const addUser = async (data: UserData) => {
  const res = await saveUserApi(data)
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

//关闭drawer
const closeDrawer = () => {
  DialogFlag.value = false
}

const resetFormAfterClose = () => {
  detailsId.value = ''
  //重置表单
  setValue(true)
}

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
  nextTick(() => {
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
  <!-- 可设置宽度 :dialogWidth="400" -->
  <ElDialog
    ref="ElDialogFef"
    v-model="DialogFlag"
    :title="pageTite"
    class="cultivate-custom"
    @closed="DialogFlag = false"
  >
    <!-- 角色 -->
    <Form ref="formRef" :schema="schema" class="userForm">
      <template #roleIds>
        <ElSelect
          v-model="roleIdsList"
          :disabled="false"
          collapseTags
          collapseTagsTooltip
          filterable
          multiple
          popper-class="roleIds-popper"
          style="width: 100%"
          @change="changeRoleIds"
        >
          <ElOption
            v-for="(item, index) in roleSelectList"
            :key="index"
            :label="item.roleName"
            :value="item.roleId"
          />
        </ElSelect>
      </template>
      <!-- 部门 -->
      <template #deptId>
        <ElTreeSelect
          v-model="deptIdsList"
          :data="treedata"
          :disabled="false"
          checkStrictly
          clearable
          collapseTags
          collapseTagsTooltip
          filterable
          node-key="id"
          popper-class="deptId-popper"
          style="width: 100%"
          @change="changeDetId"
        />
      </template>
    </Form>
    <template #footer>
      <div class="footer">
        <el-button :loading="loading" type="primary" @click="save"> 提交</el-button>
        <el-button @click="closeDrawer"> 取消</el-button>
      </div>
    </template>
  </ElDialog>
</template>
<style lang="less" scoped>
:deep(.el-popper) {
  max-width: 100px;
}
</style>
