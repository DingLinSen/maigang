<!-- 角色权限分配 -->
<script setup lang="ts">
import { reactive, ref, unref, nextTick } from 'vue'
import { ElButton, ElMessage } from 'element-plus'
import { Form, FormExpose } from '@/components/Form'
import { Table } from '@/components/Table'
import { DrawerWrap } from '@/components/DrawerWrap'
import { useTable } from '@/hooks/web/useTable'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { FormSchema } from '@/types/form'
import { getRoleListApi } from '@/api/role'
import { getAuthRoleInfoApi, getSubmitAuthRoleInfoApi } from '@/api/user'
import { RoleData } from '@/api/role/types'
import type { UserData } from '@/api/user/types'

const emit = defineEmits(['selectRole'])
const isShow = ref<boolean>(false)

const { register, tableObject } = useTable<RoleData>({
  getListApi: getRoleListApi,
  // delListApi: delTableListApi,
  response: {
    list: 'rows',
    total: 'total'
  }
})

// 初始化数据
let userData = reactive<any>({
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
  roleId: '', // 角色id
  roleIds: [], // 角色id
  postId: '',
  postIds: [], // 岗位id
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
const detailsId = ref<number | string>()
const formRef = ref<FormExpose>()

// const { getList, setSearchParams } = methods
// getList()

//打开drawer并初始化
const openDrawer = (id: number | string) => {
  detailsId.value = id
  if (drawerWrap.value) {
    drawerWrap.value.isShow = true
  }

  if (id) {
    // getDetailsData(id)
    getAuthRoleLData(id)
  }
}

const setValues = (form: UserData) => {
  unref(formRef)?.setValues(form)
}

const tableRef = ref()
// 根据用户id获取角色分配权限
const getAuthRoleLData = async (id: number | string) => {
  const res: any = await getAuthRoleInfoApi(id)
    .catch(() => {})
    .finally(() => {
      // sureLoading.value = false
    })

  if (res && res.data) {
    userData = res.data.user
    tableObject.tableList = res.data.roles
    tableObject.loading = false
    userData.roleIds = res.data.user.roles.map((val: any) => val.roleId)
    userData.postIds = res.data.postIds
    setValues(userData)
    nextTick(() => {
      if (userData.roles.length) {
        tableObject.tableList.forEach((item: any) => {
          userData.roles.forEach((row: any) => {
            if (item.roleId === row.roleId) {
              // row.flag = true
              tableRef.value.elTableRef.toggleRowSelection(item)
            }
          })
        })
      }
    })
  }
}

// 表单项
const schema = reactive<FormSchema[]>([
  {
    field: 'nickName', // key
    label: '用户昵称', // label
    component: 'Input', // 使用组件
    colProps: {
      // 所占col
      span: 12
    },
    componentProps: {
      //组件配置
      disabled: true,
      style: 'width:100%;', //宽度
      maxlength: 500, //最大输入长度
      controlsPosition: 'right'
    },
    formItemProps: {
      // 表单校验
      rules: []
    }
  },
  {
    field: 'userName', // key
    label: '登录账号', // label
    component: 'Input', // 使用组件
    colProps: {
      // 所占col
      span: 12
    },
    componentProps: {
      disabled: true,
      //组件配置
      style: 'width:100%;', //宽度
      maxlength: 500, //最大输入长度
      controlsPosition: 'right'
    },
    formItemProps: {
      // 表单校验
      rules: []
    }
  }
])
const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'roleId',
    label: '角色编号'
  },
  {
    field: 'roleName',
    label: '角色名称',
    search: {
      show: true
    }
  },
  {
    field: 'roleKey',
    label: '权限字符',
    search: {
      show: true
    }
  },
  {
    field: 'createTime',
    minWidth: '120px',
    label: '创建时间',
    search: {
      show: true,
      component: 'DatePicker',
      componentProps: {
        type: 'daterange'
      }
    }
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)

// 提交保存
const roleSelect = async () => {
  sureLoading.value = true
  userData.roleIds = tableRef.value.elTableRef.getSelectionRows().map((item: any) => item.roleId)
  const res = await getSubmitAuthRoleInfoApi({
    userId: detailsId.value,
    roleIds: userData.roleIds.join(',')
  })
    .catch(() => {})
    .finally(() => {
      sureLoading.value = false
    })
  if (res) {
    ElMessage.success('成功保存信息')
    emit('selectRole')
    // emitter.emit('getList', 'selectRole')
    closeDrawer()
  }
}

//取消授权
// const cancelLoading = ref(false)

// const cancelAuth = async (row: RoleData | null, multiple: boolean) => {
//   tableObject.currentRow = row
//   const { getSelections } = methods
//   const selections = await getSelections()
//   if (multiple) {
//     if (!selections.length) {
//       ElMessage.warning('请选择需要取消授权的数据')
//       return
//     }
//   } else {
//     if (!tableObject.currentRow) {
//       ElMessage.warning('请选择需要取消授权的数据')
//       return
//     }
//   }
//   const ids = multiple
//     ? selections.map((v) => v.roleId)
//     : [tableObject.currentRow?.roleId as string]
//   if (multiple) {
//     ElMessageBox.confirm('是否取消选中数据的授权', '提示', {
//       confirmButtonText: '确定',
//       cancelButtonText: '取消',
//       type: 'warning'
//     }).then(async () => {
//       cancelLoading.value = true
//       await cancelAuthData(ids)
//     })
//   } else {
//     await cancelAuthData(ids)
//   }
// }

// const cancelAuthData = async (ids: string[]) => {
//   const res = await delListApi(ids)
//     .catch(() => {})
//     .finally(() => {
//       cancelLoading.value = false
//     })
//   if (res) {
//     ElMessage.success('删除成功')
//     getList()
//   }
// }

const drawerWrap = ref<ComponentRef<typeof DrawerWrap>>()

// const getDetailsData = (id: string) => {
//   params.value = Object.assign({ id: id }, params.value)
//   setSearchParams(params)
// }

// const params = reactive<Recordable>({
//   id: detailsId.value,
//   userName: '',
//   phonenumber: ''
// })

//搜索
// const setSearchParamsSub = (param: Recordable) => {
//   params.value = Object.assign({ id: detailsId.value }, param)
//   setSearchParams(params)
// }

//关闭drawer
const closeDrawer = () => {
  if (drawerWrap.value) {
    drawerWrap.value.isShow = false
  }
}

//分配用户
// const userDialogRef = ref<ComponentRef<typeof UserDialog>>()

// const dialogVisible = ref(false)

const sureLoading = ref(false)

// const userSure = async () => {
//   // const userDialog = unref(userDialogRef)
//   const selections = await userDialog.getAllSelections()
//   if (!selections.length) {
//     ElMessage.warning('请选择需要分配的用户')
//   } else {
//     assignUsers([])
//   }
// }

// const assignUsers = (ids: string[]) => {
//   dialogVisible.value = false
// }

defineExpose({
  isShow,
  openDrawer
})
</script>

<template>
  <DrawerWrap title="分配角色" :isShow="isShow" ref="drawerWrap">
    <template #content>
      <h4 class="form-header h4">基本信息</h4>
      <Form style="margin: 0 10%" :schema="schema" ref="formRef" class="form-content" />
      <h4 class="form-header h4">角色信息</h4>
      <Table
        ref="tableRef"
        v-model:pageSize="tableObject.pageSize"
        v-model:currentPage="tableObject.currentPage"
        :columns="allSchemas.tableColumns"
        :data="tableObject.tableList"
        :loading="tableObject.loading"
        :border="true"
        :header-align="'center'"
        :align="'center'"
        :isDrawer="true"
        @register="register"
      >
        <!-- <template #action="{ row }">
          <ElButton type="danger" @click="cancelAuth(row, false)" :text="true" size="small">
            <Icon icon="ep:circle-close" class="mr-5px" />取消授权
          </ElButton>
        </template> -->
      </Table>
      <div style="display: flex; justify-content: center; margin: 10px 0">
        <ElButton type="primary" :loading="sureLoading" @click="roleSelect"> 提交 </ElButton>
        <ElButton @click="closeDrawer">返回</ElButton>
      </div>
    </template>
  </DrawerWrap>
</template>
