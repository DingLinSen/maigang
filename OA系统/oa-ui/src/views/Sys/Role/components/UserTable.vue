<script setup lang="ts">
import { Search } from '@/components/Search'
import { ElButton, ElMessageBox, ElTag, ElMessage } from 'element-plus'
import { Table } from '@/components/Table'
import { useTable } from '@/hooks/web/useTable'
import {
  getRoleUserListApi,
  SelectRoleUserApi,
  CancelRoleUserApi,
  CancelAllRoleUserApi
} from '@/api/role'
import { h, nextTick, reactive, ref, unref } from 'vue'
import { AuthUserData } from '@/api/role/types'
import { propTypes } from '@/utils/propTypes'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { TableColumn } from '@/types/table'
import { DrawerWrap } from '@/components/DrawerWrap'
import { UserDialog } from './index'
import { Dialog } from '@/components/Dialog'
import { watch } from 'fs'
import { useEmitt } from '@/hooks/web/useEmitt'

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
      show: true,
      componentProps: {
        style: 'width: 196px',
        placeholder: '用户名称筛选'
      }
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
      show: true,
      componentProps: {
        style: 'width: 196px',
        placeholder: '手机号码筛选'
      }
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
    type: 'warning',
    autofocus: false
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
    type: 'warning',
    autofocus: false
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
      setTimeout(() => {
        cancelLoading.value = false
      }, 200)
    })
  if (res) {
    ElMessage.success('取消授权成功')
    resetTableData()
  }
}
const ElDialogFef = ref()
//添加用户
const AddAction = () => {
  dialogVisible.value = true
  ElDialogFef.value.isFullscreen = false
  document.getElementsByTagName('body')[0].style.width = '100%'
}

const drawerWrap = ref<ComponentRef<typeof DrawerWrap>>()
const detailsId = ref<string>('')

//打开drawer并初始化
const openDrawer = (id: string) => {
  resetTableHeight()
  detailsId.value = id
  drawerWrap.value.isShow = true

  if (id) {
    getDetailsData(id)
  }
}

const getDetailsData = async (id: string) => {
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

//关闭drawer
const closeDrawer = () => {
  drawerWrap.value.isShow = false
}

//分配用户
const userDialogRef = ref<ComponentRef<typeof UserDialog>>()

const dialogVisible = ref(false)

const sureLoading = ref(false)

const userSure = async () => {
  const userDialog = unref(userDialogRef)
  const selections = await userDialog.getAllSelections()
  if (!selections.length) {
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
useEmitt({
  name: 'window',
  callback: (type: string) => {
    if (type === 'resize') {
      resetTableHeight()
    }
  }
})
const defaultHeight = ref<number>(450)
const resetTableHeight = () => {
  setTimeout(() => {
    nextTick()
    let layoutContentH = 0
    const layoutContent = document.querySelector('.v-layout-content-scrollbar')
    if (layoutContent) {
      layoutContentH = layoutContent.clientHeight
    }
    const headerH = getOverViewWrapper('.el-drawer__header')
    const padding = getBodyPaddingValue()
    const footerH = getOverViewWrapper('.user-search')
    const paginationH = getOverViewWrapper('.el-pagination')
    const filterH = getOverViewWrapper('.filter-btn')
    defaultHeight.value = layoutContentH - headerH - padding - footerH - paginationH - filterH - 40
  }, 500)
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
  userDialog.resetTableHeight(isFull)
}
</script>

<template>
  <DrawerWrap title="分配用户" :isShow="isShow" ref="drawerWrap">
    <template #content>
      <div class="user-search">
        <Search
          :schema="allSchemas.searchSchema"
          @search="setSearchParamsSub"
          @reset="setSearchParamsSub"
        />

        <div class="mb-10px">
          <ElButton type="primary" @click="AddAction" plain>
            <Icon icon="ep:plus" class="mr-5px" />添加用户</ElButton
          >
          <ElButton :loading="cancelLoading" type="danger" @click="cancelAllAuth()" plain>
            <Icon icon="ep:circle-close" class="mr-5px" />批量取消授权
          </ElButton>
        </div>
      </div>
      <Table
        v-model:pageSize="tableObject.pageSize"
        v-model:currentPage="tableObject.currentPage"
        :columns="allSchemas.tableColumns"
        :data="tableObject.tableList"
        :loading="tableObject.loading"
        :border="true"
        :header-align="'center'"
        :cotentAlign="'center'"
        :pagination="{
          total: tableObject.total
        }"
        :height="defaultHeight + 'px'"
        :statisticsList="true"
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
  <Dialog
    ref="ElDialogFef"
    v-model="dialogVisible"
    title="选择用户"
    @closed="closeDialog"
    @toggleFull="toggleFull"
  >
    <UserDialog ref="userDialogRef" :role-id="params.roleId" />

    <template #footer>
      <ElButton type="primary" :loading="sureLoading" @click="userSure"> 确定 </ElButton>
      <ElButton @click="dialogVisible = false">取消</ElButton>
    </template>
  </Dialog>
</template>
