<script setup lang="ts">
import { h, reactive, ref, unref } from 'vue'
import { ElButton, ElMessageBox, ElTag, ElMessage } from 'element-plus'
import { Search } from '@/components/Search'
import { Table } from '@/components/Table'
import { Dialog } from '@/components/Dialog'
import { DrawerWrap } from '@/components/DrawerWrap'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useTable } from '@/hooks/web/useTable'
import { TableColumn } from '@/types/table'
import {
  getRoleUserListApi,
  SelectRoleUserApi,
  CancelRoleUserApi,
  CancelAllRoleUserApi
} from '@/api/role'
import { AuthUserData } from '@/api/role/types'
import { UserDialog } from './index'

const isShow = ref<boolean>(false)

const { register, tableObject, methods } = useTable<AuthUserData>({
  getListApi: getRoleUserListApi,
  response: {
    list: 'rows',
    total: 'total'
  }
})

const { getList, setSearchParams } = methods

const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'userName',
    label: '用户名称',
    minWidth: '180px',
    search: {
      show: true
    },
    formatter: (row: Recordable) => {
      return h('span', row.userName ? row.userName : '--')
    }
  },
  {
    field: 'nickName',
    minWidth: '180px',
    label: '用户昵称',
    formatter: (row: Recordable) => {
      return h('span', row.nickName ? row.nickName : '--')
    }
  },
  {
    field: 'email',
    minWidth: '180px',
    label: '邮箱',
    formatter: (row: Recordable) => {
      return h('span', row.email ? row.email : '--')
    }
  },
  {
    field: 'phonenumber',
    label: '手机号码',
    minWidth: '180px',
    search: {
      show: true
    },
    formatter: (row: Recordable) => {
      return h('span', row.phonenumber ? row.phonenumber : '--')
    }
  },
  {
    field: 'status',
    label: '状态',
    minWidth: '80px',
    formatter: (_: Recordable, __: TableColumn, cellValue: string) => {
      return h(
        ElTag,
        {
          type: cellValue === '0' ? '' : 'danger'
        },
        () => (cellValue === '0' ? '正常' : '停用')
      )
    }
  },
  {
    field: 'createTime',
    minWidth: '160px',
    label: '创建时间',
    formatter: (row: Recordable) => {
      return h('span', row.createTime ? row.createTime : '--')
    }
  },
  {
    field: 'action',
    minWidth: '120px',
    label: '操作'
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)

//取消授权
const cancelLoading = ref(false)

const cancelAuth = async (row: AuthUserData) => {
  tableObject.currentRow = row
  if (!tableObject.currentRow) {
    ElMessage.warning('请选择需要取消授权的数据')
    return
  }
  ElMessageBox.confirm('确认要取消该用户"' + row.userName + '"角色吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const param = {
      roleId: detailsId.value,
      userId: row.userId
    }
    const res = await CancelRoleUserApi(param)
    if (res) {
      ElMessage.success('取消授权成功')
      resetTableData()
    }
  })
}

//批量取消授权
const cancelAllAuth = async () => {
  const { getSelections } = methods
  const selections = await getSelections()
  if (!selections.length) {
    ElMessage.warning('请选择需要取消授权的数据')
    return
  }
  const ids = selections.map((v) => v.userId)
  ElMessageBox.confirm('是否取消选中数据的授权', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    cancelLoading.value = true
    await cancelAuthData(ids)
  })
}

const cancelAuthData = async (ids: string[]) => {
  const param = {
    roleId: detailsId.value,
    userIds: ids.toString()
  }
  const res = await CancelAllRoleUserApi(param)
    .catch(() => {})
    .finally(() => {
      cancelLoading.value = false
    })
  if (res) {
    ElMessage.success('取消授权成功')
    resetTableData()
  }
}

//添加用户
const addAction = () => {
  dialogVisible.value = true
  document.getElementsByTagName('body')[0].style.width = '100%'
}

const drawerWrap = ref<ComponentRef<typeof DrawerWrap>>()
const detailsId = ref<string>('')

//打开drawer并初始化
const openDrawer = (id: string) => {
  detailsId.value = id
  if (drawerWrap.value) {
    drawerWrap.value.isShow = true
  }

  if (id) {
    getDetailsData(id)
  }
}

const getDetailsData = async (id?: string) => {
  params.roleId = detailsId.value
  setSearchParams(params)
}

const params = reactive<Recordable>({
  roleId: detailsId.value,
  userName: '',
  phonenumber: ''
})

//搜索
const setSearchParamsSub = (param: Recordable) => {
  params.userName = param.userName ? param.userName : ''
  params.phonenumber = param.phonenumber ? param.phonenumber : ''
  setSearchParams(params)
}

//分配用户
const userDialogRef = ref<ComponentRef<typeof UserDialog>>()

const dialogVisible = ref(false)

const sureLoading = ref(false)

const userSure = async () => {
  const userDialog = unref(userDialogRef)
  const selections = await userDialog?.getAllSelections()
  if (!selections?.length) {
    ElMessage.warning('请选择需要分配的用户')
  } else {
    const ids: string[] = []
    selections.map((item: any) => {
      ids.push(item.userId)
    })
    const param = {
      roleId: detailsId.value,
      userIds: ids.toString()
    }
    assignUsers(param)
  }
}

const assignUsers = async (param: any) => {
  const res = await SelectRoleUserApi(param)
  if (res) {
    ElMessage.success('分配用户成功')
    dialogVisible.value = false
    resetTableData()
  }
}

const resetTableData = () => {
  tableObject.currentPage = 1
  getList()
}

defineExpose({
  isShow,
  openDrawer
})

const closeDialog = () => {
  document.getElementsByTagName('body')[0].className = ''
  document.getElementsByTagName('body')[0].style.width = '100%'
}

const toggleFull = (isFull: boolean) => {
  const userDialog = unref(userDialogRef)
  userDialog?.resetTableHeight(isFull)
}
</script>

<template>
  <DrawerWrap title="分配用户" :isShow="isShow" ref="drawerWrap">
    <template #content>
      <Search
        :schema="allSchemas.searchSchema"
        @search="setSearchParamsSub"
        @reset="setSearchParamsSub"
      />

      <div class="mb-10px">
        <ElButton type="primary" @click="addAction" plain>
          <Icon icon="ep:plus" class="mr-5px" />添加用户</ElButton
        >
        <ElButton :loading="cancelLoading" type="danger" @click="cancelAllAuth()" plain>
          <Icon icon="ep:circle-close" class="mr-5px" />批量取消授权
        </ElButton>
      </div>
      <Table
        v-model:pageSize="tableObject.pageSize"
        v-model:currentPage="tableObject.currentPage"
        :columns="allSchemas.tableColumns"
        :data="tableObject.tableList"
        :loading="tableObject.loading"
        :border="true"
        :header-align="'center'"
        :align="'center'"
        :pagination="{
          total: tableObject.total
        }"
        :isDrawer="true"
        @register="register"
      >
        <template #action="{ row }">
          <ElButton type="primary" @click="cancelAuth(row)" :text="true" size="small">
            <Icon icon="ep:circle-close" class="mr-5px" />取消授权
          </ElButton>
        </template>
      </Table>
    </template>
  </DrawerWrap>
  <Dialog v-model="dialogVisible" title="选择用户" @closed="closeDialog" @toggleFull="toggleFull">
    <UserDialog ref="userDialogRef" :role-id="params.roleId" />

    <template #footer>
      <ElButton type="primary" :loading="sureLoading" @click="userSure"> 确定 </ElButton>
      <ElButton @click="dialogVisible = false">取消</ElButton>
    </template>
  </Dialog>
</template>
