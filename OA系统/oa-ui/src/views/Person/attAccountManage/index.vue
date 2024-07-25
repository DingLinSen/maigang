<script setup lang="ts">
import UserForm from './components/UserForm.vue'
import { Dialog } from '@/components/Dialog'
import PassWord from './components/PassWord.vue'
import RoleTable from './components/RoleTable.vue'
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { useI18n } from '@/hooks/web/useI18n'
import type { DeptTreeData } from '@/api/user/types'
import { isAuth } from '@/utils/is'
import { ElButton, ElMessageBox, ElMessage, ElSwitch, ElRow, ElCol } from 'element-plus'
import { Table } from '@/components/Table'
import { Tree } from '@/components/Tree'
// import { getTableListApi, delTableListApi } from '@/api/table'
import { delUserListApi, exportUserListApi, resetPassWord, chageUserStatusApi } from '@/api/user'

import { getdeptTreeNoAuthApi, getclockingListApi } from '@/api/person/attAccountManage'

import { useValidator } from '@/hooks/web/useValidator'
import { useTable } from '@/hooks/web/useTable'
import { TableData } from '@/api/table/types'
import { useAppStore } from '@/store/modules/app'
import { h, reactive, ref, unref, nextTick, onMounted, computed } from 'vue'
import { useEmitt } from '@/hooks/web/useEmitt'
import { FormSchema } from '@/types/form'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { TableColumn } from '@/types/table'
import { LimitDailog } from '@/views/Components/limit'

defineOptions({
  name: 'AttAccountManage'
})

const UserId = ref<any>()
const appStore = useAppStore()

// 视窗高度
const documentClientHeight = computed(() => appStore.getDocumentClientHeight)

const { required } = useValidator()

// 左侧树形数据
const treedata = ref<DeptTreeData>([])

const PassWordRef = ref<ComponentRef<typeof PassWord>>()

//确定
const sureLoading = ref(false)

const { register, tableObject, methods } = useTable<TableData>({
  getListApi: getclockingListApi,
  delListApi: delUserListApi,
  response: {
    list: 'rows',
    total: 'total'
  }
})

const { getList, setSearchParams } = methods

// 获取部门树
const getDeptTreeList = async () => {
  try {
    const res = await getdeptTreeNoAuthApi({ status: '0' }).finally(() => {
      delLoading.value = false
    })
    treedata.value = res.data
  } catch (err) {
    console.log(err)
  }
}

getDeptTreeList()
getList()

//导出加载
const exLoading = ref(false)
const deptId = ref()
const params = reactive<Recordable>({
  deptId: undefined,
  userName: '',
  phonenumber: '',
  status: ''
  // params: paramsMap
})

//搜索
const setSearchParamsSub = (param: Recordable) => {
  params.deptId = deptId.value
  params.nickName = param.nickName ? param.nickName : ''
  // tree.value.onAllNodeClick()
  setSearchParams(params)
}

const setResetParamsSub = (param: Recordable) => {
  params.deptId = ''
  params.nickName = ''
  tree.value.onAllNodeClick({ id: null, label: null })
}

const userFormRef = ref<ComponentRef<typeof UserForm>>()
const tree = ref()

const { emitter } = useEmitt({
  name: 'getList',
  callback: (type: string) => {
    if (type === 'add') {
      tableObject.currentPage = 1
    }
    getList()
  }
})

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
  const overView = getOverViewWrapper('.overView')
  const overViewWrapper = getOverViewWrapper('#v-tags-view')
  const topH = getOverViewWrapper('#v-tool-header')
  const footer = getOverViewWrapper('.v-footer')
  const trigger = getOverViewWrapper('.hover-trigger-view')
  let bodyP = 0
  const bodyWrap = document.querySelector('#app-content')
  if (bodyWrap) {
    let computedStyle = getComputedStyle(bodyWrap, null)
    if (computedStyle) {
      bodyP = parseFloat(computedStyle.getPropertyValue('padding-top')) * 2
    }
  }
  nextTick(() => {
    defaultHeight.value =
      documentClientHeight.value - overViewWrapper - overView - trigger - footer - topH - bodyP
  })
}
const getOverViewWrapper = (dom: string): number => {
  let topH = 0
  const checkboxWrapper = document.querySelector(dom)
  if (checkboxWrapper) {
    topH = checkboxWrapper.clientHeight
  }
  return topH
}
const { t } = useI18n()

// 是否显示筛选窗口
const isShowCell = ref(false)

// 表格列
const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'userId',
    label: '序号',
    minWidth: '20px',
    table: {
      show: true
    },
    formatter: (row: Recordable) => {
      return h('span', row.userId ? row.userId : '--')
    }
  },
  {
    field: 'nickName',
    label: '用户名',
    table: {
      show: true
    },
    search: {
      show: true,
      componentProps: {
        placeholder: '用户名筛选',
        style: 'width: 196px'
      }
    },
    formatter: (row: Recordable) => {
      return h('span', row.nickName ? row.nickName : '--')
    }
  },
  {
    field: 'userName',
    label: '账号',
    table: {
      show: true
    },
    search: {
      show: false,
      componentProps: {
        placeholder: '用户名筛选',
        style: 'width: 196px'
      }
    },
    formatter: (row: Recordable) => {
      return h('span', row.userName ? row.userName : '--')
    }
  },
  {
    field: 'status',
    label: '状态',
    table: {
      show: true
    },
    formatter: (row: Recordable, __: TableColumn, cellValue: string) => {
      return h(
        ElSwitch,
        {
          modelValue: cellValue === '0' ? true : false,
          //   style: '--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949',
          onClick: () => {
            switchChange(row)
          }
        },
        () => (cellValue === '0' ? true : false)
      )
    },
    search: {
      show: false,
      component: 'Select',
      componentProps: {
        placeholder: '状态筛选',
        options: [
          {
            label: '正常',
            value: 0
          },
          {
            label: '停用',
            value: 1
          }
        ]
      }
    }
  }
  // {
  //   field: 'action',
  //   minWidth: '120px',
  //   showOverflowTooltip: false,
  //   table: {
  //     show: true
  //   },
  //   label: '操作'
  // }
])

// 重置密码表单项
const fromSchemas = reactive<FormSchema[]>([
  {
    field: 'password',
    label: '新密码',
    component: 'Input',
    componentProps: {
      // disabled: true
    },
    colProps: {
      span: 24
    },
    formItemProps: {
      // 表单校验
      rules: [required()]
    }
  }
])
const { allSchemas } = useCrudSchemas(crudSchemas)
const treeTitle = ref('')
// 全部树形图返回数据
const changeAlltree = (val: any, name: any) => {
  deptId.value = val
  treeTitle.value = name
  getDeptTreeList()
  // params = ob
  setSearchParamsSub(params)
}
// 树形图返回数据
const TreeClick = (val: any, name: any) => {
  deptId.value = val
  treeTitle.value = name

  // params = ob
  setSearchParamsSub(params)
}

//删除加载
const delLoading = ref(false)

// 分配角色
const roleTableRef = ref<ComponentRef<typeof RoleTable>>()
//table操作栏按钮事件
const action = (row: TableData, type: string) => {
  if (type === 'resetPwd') {
    UserId.value = row.userId
    tableObject.currentRow = row
    dialogVisible.value = true
  } else if (type === 'role') {
    roleTableRef.value.openDrawer(row.userId)
  } else {
    userFormRef.value.openDrawer(type, row.userId)
  }
}

//重置密码dialog
const dialogVisible = ref(false)

//关闭用户密码dialog
const closePermissionDialog = () => {
  // deptIds.value = []
}

//确认重置密码
const resetPwdSure = async () => {
  return false
  const password = unref(PassWordRef)

  const elFormRef = password?.elFormRef
  // await elFormRef?.validate(async (isValid) => {
  //   console.log(isValid)
  //   if (isValid) {
  // const data = (await password?.getFormData()) as UserData
  sureLoading.value = true
  const res = await resetPassWord({ userId: UserId.value, password: '123456' })
    .catch(() => {})
    .finally(() => {
      sureLoading.value = false
    })
  if (res) {
    ElMessage.success('重置密码成功')
    dialogVisible.value = false
    getList()
  }
  //   }
  // })
}

const switchChange = (row: Recordable) => {
  if (row.admin) {
    ElMessage.error('禁止修改超级管理员用户的状态')
    return
  }
  let msg = ''
  let title = ''
  if (row.status === '0') {
    title = '用户停用提示'
    msg = '确认要停用"' + row.userName + '"用户吗？'
  } else {
    title = '用户启用提示'
    msg = '确认要启用"' + row.userName + '"用户吗？'
  }
  ElMessageBox.confirm(msg, title, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    autofocus: false
  }).then(async () => {
    const params = {
      userId: row.userId,
      status: row.status === '0' ? '1' : '0'
    }
    const res = await chageUserStatusApi(params)
    if (res) {
      nextTick()
      ElMessage.success(row.status === '0' ? '停用成功' : '启用成功')
      row.status = row.status === '0' ? '1' : '0'
      // getList()
    }
  })
}

const onAllNodeClick = () => {}

// 注册
onMounted(() => {
  resetTableHeight()
})
</script>

<template>
  <section>
    <ElRow :gutter="24" style="margin-left: 0; margin-right: 0">
      <ElCol :xl="4" :lg="4" :md="5" :sm="6" :xs="6" style="padding-right: 0; padding-left: 0">
        <ContentWrap :isShowtitle="false" :style="{ height: defaultHeight + 'px' }">
          <Tree
            ref="tree"
            :placeholder="'搜索'"
            :data="treedata"
            :maxHeight="defaultHeight"
            @tree="TreeClick"
            @all-tree-data="changeAlltree"
          />
        </ContentWrap>
      </ElCol>

      <!-- 右侧内容区域 -->
      <ElCol :xl="20" :lg="20" :md="19" :sm="18" :xs="18" style="padding-right: 0">
        <ContentWrap
          class="rightContent"
          :style="{ height: defaultHeight + 'px' }"
          :Showtitle="treeTitle"
        >
          <!-- <template #ContentWrapTitle> </template> -->

          <Table
            v-model:pageSize="tableObject.pageSize"
            v-model:currentPage="tableObject.currentPage"
            :columns="allSchemas.tableColumns"
            :isShowCell="isShowCell"
            :isShowFilter="true"
            :height="defaultHeight"
            :data="tableObject.tableList"
            :loading="tableObject.loading"
            :cotentAlign="tableObject.align"
            :headerAlign="tableObject.headerAlign"
            :border="true"
            :pagination="{
              total: tableObject.total
            }"
            @register="register"
          >
            <template #operateBtnLeft>
              <Search
                v-if="isAuth('system:user:query')"
                :schema="allSchemas.searchSchema"
                @search="setSearchParamsSub"
                @reset="setResetParamsSub"
              />
            </template>
            <template #action="{ row }">
              <ElButton
                class="btn-default"
                @click="action(row, 'resetPwd')"
                :text="true"
                size="small"
              >
                重置密码
              </ElButton>
            </template>
          </Table>
          <!-- <UserForm title="用户" ref="userFormRef" /> -->
        </ContentWrap>
      </ElCol>
    </ElRow>

    <!-- 重置密码  -->
    <Dialog
      v-model="dialogVisible"
      :maxHeight="'auto'"
      title="重置密码"
      @closed="closePermissionDialog"
    >
      确定重置当前用户密码?

      <template #footer>
        <ElButton type="primary" :loading="sureLoading" @click="resetPwdSure"> 确定 </ElButton>
        <ElButton @click="dialogVisible = false">取消</ElButton>
      </template>
    </Dialog>

    <!-- 分配角色 -->
    <!-- <RoleTable @select-role="register" ref="roleTableRef" /> -->
  </section>
  <LimitDailog routerName="attAccountManage" />
</template>
