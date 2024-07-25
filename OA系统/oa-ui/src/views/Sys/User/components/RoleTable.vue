<!-- 角色权限分配 -->
<script setup lang="ts">
import { Form, FormExpose } from '@/components/Form'
import { ElButton, ElMessageBox, ElTag, ElMessage } from 'element-plus'
import { Table } from '@/components/Table'
import { useTable } from '@/hooks/web/useTable'
import { getRoleListApi } from '@/api/role'
import { getAuthRoleInfoApi, getSubmitAuthRoleInfoApi } from '@/api/user'
import { h, reactive, ref, unref, nextTick, computed, onMounted } from 'vue'

import { RoleData } from '@/api/role/types'
import { propTypes } from '@/utils/propTypes'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { TableColumn } from '@/types/table'
import { useEmitt } from '@/hooks/web/useEmitt'
import { FormSchema } from '@/types/form'
import { DrawerWrap } from '@/components/DrawerWrap'
// import UserDialog from './UserDialog.vue'
import { useAppStore } from '@/store/modules/app'
import { Dialog } from '@/components/Dialog'
import type { UserData } from '@/api/user/types'

const emit = defineEmits(['selectRole'])
const isShow = ref<boolean>(false)

const { register, tableObject, methods } = useTable<RoleData>({
  getListApi: getRoleListApi,
  // delListApi: delTableListApi,
  response: {
    list: 'rows',
    total: 'total'
  }
})
const appStore = useAppStore()
const documentClientHeight = computed(() => appStore.getDocumentClientHeight)
useEmitt({
  name: 'window',
  callback: (type: string) => {
    if (type === 'resize') {
      resetTableHeight()
    }
  }
})

const defaultHeight = ref<number>(0)
const resetTableHeight = () => {
  nextTick()
  setTimeout(() => {
    nextTick()
    let layoutContentH = 0
    const layoutContent = document.querySelector('.v-layout-content-scrollbar')
    if (layoutContent) {
      layoutContentH = layoutContent.clientHeight
    }
    const headerH = getOverViewWrapper('.el-drawer__header')
    const padding = getBodyPaddingValue()
    const footerH = getOverViewWrapper('.btn-footer')
    const userInfoH = getOverViewWrapper('.user-info')
    defaultHeight.value = layoutContentH - headerH - padding - footerH - userInfoH - 55
  }, 500)
  // const overView = getOverViewWrapper('.el-drawer__header')
  // const overViewWrapper = getOverViewWrapper('#v-tags-view')
  // const footer = getOverViewWrapper('.v-footer')
  // const trigger = getOverViewWrapper('.hover-trigger-view')
  // console.log(documentClientHeight.value)
  // nextTick(() => {
  //   defaultHeight.value =
  //     documentClientHeight.value - overViewWrapper - overView - trigger - footer - 84
  // })
  // console.log('defaultHeight==>', defaultHeight.value)
}

const getBodyPaddingValue = (): number => {
  let topH = 0
  const topWrap = document.querySelector('.el-drawer__body')
  if (topWrap) {
    let computedStyle = getComputedStyle(topWrap, null)
    if (computedStyle) {
      topH = parseFloat(computedStyle.getPropertyValue('padding-top')) * 2 + 12
    }
  }
  const card = document.querySelector('.el-card__body')
  if (card) {
    let computedStyle = getComputedStyle(card, null)
    if (computedStyle) {
      topH = topH + parseFloat(computedStyle.getPropertyValue('padding-top')) * 2
    }
  }
  return topH
}

const getOverViewWrapper = (dom: string): number => {
  let topH = 0
  const checkboxWrapper = document.querySelector(dom)
  if (checkboxWrapper) {
    topH = checkboxWrapper.clientHeight
  }
  return topH
}
// 初始化数据
let userData = reactive<UserData>({
  userId: undefined,
  createBy: '',
  createTime: '',
  email: null,
  updateBy: '',
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
  password: '',
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
  },
  userName: ''
})
const detailsId = ref<number>()
const formRef = ref<FormExpose>()

const { getList, setSearchParams } = methods
// getList()

//打开drawer并初始化
const openDrawer = (id: number) => {
  resetTableHeight()
  detailsId.value = id
  drawerWrap.value.isShow = true
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
const getAuthRoleLData = async (id: number) => {
  const res = await getAuthRoleInfoApi(id)
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
      console.log(userData)
      if (userData.roles.length) {
        tableObject.tableList.forEach((item: any) => {
          userData.roles.forEach((row: any) => {
            console.log(row)
            if (item.roleId === row.roleId) {
              // row.flag = true
              tableRef.value.elTableRef.toggleRowSelection(item)
            }
            // console.log('tableRef', )
          })
        })
      }
    })
  }
  console.log('res', res)
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
    label: '用户名', // label
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
  console.log('userData', userData)
  userData.roleIds = tableRef.value.elTableRef.getSelectionRows().map((item: any) => item.roleId)
  // console.log(selection)
  // const data = {
  //   userId: detailsId.value,
  //   roleIds: userData.roleIds.join(',')
  // }
  // const userId = detailsId.value
  // const roleIds = userData.roleIds
  const res = await getSubmitAuthRoleInfoApi({
    userId: detailsId.value,
    roleIds: userData.roleIds.join(',')
  })
    .catch(() => {})
    .finally(() => {
      sureLoading.value = false
    })
  if (res) {
    ElMessage.success('保存信息成功')
    emit('selectRole')
    // emitter.emit('getList', 'selectRole')
    closeDrawer()
  }
}

//取消授权
const cancelLoading = ref(false)

const cancelAuth = async (row: RoleData | null, multiple: boolean) => {
  tableObject.currentRow = row
  const { getSelections } = methods
  const selections = await getSelections()
  if (multiple) {
    if (!selections.length) {
      ElMessage.warning('请选择需要取消授权的数据')
      return
    }
  } else {
    if (!tableObject.currentRow) {
      ElMessage.warning('请选择需要取消授权的数据')
      return
    }
  }
  const ids = multiple
    ? selections.map((v) => v.roleId)
    : [tableObject.currentRow?.roleId as string]
  if (multiple) {
    ElMessageBox.confirm('是否取消选中数据的授权', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      autofocus: false
    }).then(async () => {
      cancelLoading.value = true
      await cancelAuthData(ids)
    })
  } else {
    await cancelAuthData(ids)
  }
}

const cancelAuthData = async (ids: string[]) => {
  //   const res = await delListApi(ids)
  //     .catch(() => {})
  //     .finally(() => {
  //       cancelLoading.value = false
  //     })
  //   if (res) {
  //     ElMessage.success('删除成功')
  //     getList()
  //   }
}

//添加用户
const AddAction = () => {
  dialogVisible.value = true
  document.getElementsByTagName('body')[0].style.width = '100%'
}

const drawerWrap = ref<ComponentRef<typeof DrawerWrap>>()

const getDetailsData = (id: string) => {
  params.value = Object.assign({ id: id }, params.value)
  setSearchParams(params)
}

const params = reactive<Recordable>({
  id: detailsId.value,
  userName: '',
  phonenumber: ''
})

//搜索
const setSearchParamsSub = (param: Recordable) => {
  params.value = Object.assign({ id: detailsId.value }, param)
  setSearchParams(params)
}

//关闭drawer
const closeDrawer = () => {
  drawerWrap.value.isShow = false
}

//分配用户
// const userDialogRef = ref<ComponentRef<typeof UserDialog>>()

const dialogVisible = ref(false)

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

const assignUsers = (ids: string[]) => {
  dialogVisible.value = false
}

// 注册
onMounted(() => {
  resetTableHeight()
})

defineExpose({
  isShow,
  openDrawer
})

const closeDialog = () => {
  document.getElementsByTagName('body')[0].className = ''
  document.getElementsByTagName('body')[0].style.width = '100%'
}
</script>

<template>
  <DrawerWrap :isShowBack="false" title="分配角色" :isShow="isShow" ref="drawerWrap">
    <template #content>
      <div class="user-info">
        <h4 class="form-header h4">基本信息</h4>
        <Form style="margin: 0 10%" :schema="schema" ref="formRef" />
        <h4 class="form-header h4">角色信息</h4>
      </div>
      <Table
        ref="tableRef"
        v-model:pageSize="tableObject.pageSize"
        v-model:currentPage="tableObject.currentPage"
        :columns="allSchemas.tableColumns"
        :data="tableObject.tableList"
        :height="defaultHeight + 'px'"
        :statisticsList="true"
        :loading="tableObject.loading"
        :border="true"
        :isShowFilter="false"
        :header-align="'center'"
        :cotentAlign="'center'"
        @register="register"
      >
        <!-- <template #action="{ row }">
          <ElButton type="danger" @click="cancelAuth(row, false)" :text="true" size="small">
            <Icon icon="ep:circle-close" class="mr-5px" />取消授权
          </ElButton>
        </template> -->
      </Table>
      <div style="display: flex; justify-content: center; margin: 10px 0" class="btn-footer">
        <ElButton type="primary" :loading="sureLoading" @click="roleSelect"> 提交 </ElButton>
        <ElButton @click="closeDrawer">返回</ElButton>
      </div>
    </template>
  </DrawerWrap>
</template>
