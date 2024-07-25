<script setup lang="ts">
import { h, reactive, ref, unref, nextTick, getCurrentInstance } from 'vue'
import { ElButton, ElMessageBox, ElSwitch, ElMessage } from 'element-plus'

import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Icon } from '@/components/Icon'
import { Table, TableExpose } from '@/components/Table'
import { MenuForm } from './components/index'

import { useEmitt } from '@/hooks/web/useEmitt'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { TableColumn } from '@/types/table'
import { listToTree } from '@/utils/tree'
import { isAuth } from '@/utils/is'
import { getMenuListApi, delMenuListApi, editMenuApi } from '@/api/menu'
import { MenuData } from '@/api/menu/types'

defineOptions({
  name: 'Menu'
})

const { proxy } = getCurrentInstance() as any

const menuFormRef = ref<ComponentRef<typeof MenuForm>>()

const tableRef = ref<TableExpose>()

let params = reactive<Recordable>({
  menuName: null,
  status: null
})

useEmitt({
  name: 'getMenuList',
  callback: (_: string) => {
    getList(params)
  }
})

//启用和停用切换
const switchChange = (row: Recordable) => {
  // if (row.admin) {
  //   ElMessage.error('禁止修改超级管理员角色的状态')
  //   return
  // }
  let msg = ''
  let title = ''
  if (row.status === '0') {
    title = '菜单停用提示'
    msg = '确认要停用"' + row.menuName + '"菜单吗？'
  } else {
    title = '菜单启用提示'
    msg = '确认要启用"' + row.menuName + '"菜单吗？'
  }
  ElMessageBox.confirm(msg, title, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const params = {
      ...row,
      status: row.status === '0' ? '1' : '0'
    }
    const res = await editMenuApi(params)
    if (res) {
      nextTick()
      ElMessage.success(row.status === '0' ? '停用成功' : '启用成功')
      row.status = row.status === '0' ? '1' : '0'
      // getList()
    }
  })
}

const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'menuName',
    label: '菜单名称',
    search: {
      show: true,
      componentProps: {
        style: 'width:200px;' //宽度
      }
    },
    minWidth: '200px',
    formatter: (row: Recordable) => {
      return h('span', row.menuName ? row.menuName : '--')
    }
  },
  {
    field: 'icon',
    label: '图标',
    headerAlign: 'center',
    align: 'center',
    minWidth: '60px',
    formatter: (_: Recordable, __: TableColumn, cellValue: string) => {
      return h(
        Icon,
        {
          icon: cellValue ? 'svg-icon:' + cellValue : ''
        },
        () => (cellValue ? cellValue : '--')
      )
    }
  },
  {
    field: 'orderNum',
    label: '排序',
    headerAlign: 'center',
    align: 'center',
    minWidth: '60px',
    formatter: (row: Recordable) => {
      return h('span', row.orderNum ? row.orderNum : '--')
    }
  },
  {
    field: 'perms',
    label: '权限字符',
    headerAlign: 'center',
    align: 'center',
    minWidth: '120px',
    formatter: (row: Recordable) => {
      return h('span', row.perms ? row.perms : '--')
    }
  },
  {
    field: 'component',
    label: '组件路径',
    headerAlign: 'center',
    align: 'center',
    minWidth: '120px',
    formatter: (row: Recordable) => {
      return h('span', row.component ? row.component : '--')
    }
  },
  {
    field: 'createTime',
    minWidth: '120px',
    headerAlign: 'center',
    align: 'center',
    label: '创建时间',
    formatter: (row: Recordable) => {
      return h('span', row.createTime ? row.createTime : '--')
    }
  },
  {
    field: 'action',
    width: '200px',
    headerAlign: 'center',
    align: 'center',
    label: '操作',
    fixed: 'right'
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)

//新增
const addAction = () => {
  menuFormRef.value?.openDrawer('add')
}

//列表加载
const refLoading = ref(false)
//默认列表展开
const isExpand = ref(false)

const refreshTable = ref(true)

//删除
const delData = async (row: MenuData) => {
  ElMessageBox.confirm('是否删除所选中数据？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    autofocus: false,
    type: 'warning'
  }).then(async () => {
    const ids = [row.menuId as string]
    const res = await delMenuListApi(ids.toString())
      .catch(() => {})
      .finally(() => {})
    if (res) {
      ElMessage.success('删除成功')
      getList(params)
    }
  })
}

//
const action = (row: MenuData, type: string) => {
  menuFormRef.value?.openDrawer(type, row.menuId)
}

let tableData = ref<MenuData[]>([])
const chooseListAll = ref([])
//搜索
const setSearchParams = (param: Recordable) => {
  chooseListAll.value = []
  params = Object.assign({}, param)
  getList(params)
}

//请求数据
const getList = async (params: Recordable) => {
  refLoading.value = true
  const res = await getMenuListApi(params)
    .catch(() => {})
    .finally(() => {
      refLoading.value = false
    })
  if (res && res.data) {
    tableData.value = listToTree(res.data, { id: 'menuId', children: 'children', pid: 'parentId' })
  }
}

//展开/折叠
const toggleRowExpansion = () => {
  nextTick(() => {
    isExpand.value = !isExpand.value
    toggleRowExpansionByRecursive(tableData.value, isExpand.value)
  })
}

//递归展开/折叠Table
const toggleRowExpansionByRecursive = (tableData: MenuData[], isExpand: boolean) => {
  tableData.map((item: MenuData) => {
    unref(tableRef)?.elTableRef?.toggleRowExpansion(item, isExpand)
    if (item.children) {
      toggleRowExpansionByRecursive(item.children, isExpand)
    }
  })
}

getList(params)
</script>

<template>
  <ContentWrap class="mt-7px mb-10px">
    <Search
      :schema="allSchemas.searchSchema"
      :chooseListAll="chooseListAll"
      @search="setSearchParams"
      @reset="setSearchParams"
      v-if="isAuth('system:menu:query')"
    />
  </ContentWrap>
  <ContentWrap>
    <Table
      v-if="refreshTable"
      ref="tableRef"
      :loading="refLoading"
      :border="true"
      :columns="allSchemas.tableColumns"
      :data="tableData"
      :selection="false"
      :stripe="true"
      :default-expand-all="isExpand"
      :chooseListAll="chooseListAll"
      row-key="menuId"
    >
      <template #operateBtnLeft>
        <ElButton type="primary" @click="addAction" v-hasPermi="'system:menu:add'">
          <Icon icon="ep:plus" class="mr-5px" />
          新增
        </ElButton>
        <ElButton type="primary" @click="toggleRowExpansion" plain>
          <Icon icon="ep:sort" class="mr-5px" />
          展开/折叠
        </ElButton>
      </template>
      <template #action="{ row }">
        <ElButton
          type="text"
          @click="action(row, 'edit')"
          :text="true"
          v-hasPermi="'system:menu:edit'"
        >
          <!--          <Icon icon="ep:edit" class="mr-5px" /> -->
          编辑
        </ElButton>
        <ElButton
          type="text"
          @click="action(row, 'add')"
          :text="true"
          v-hasPermi="'system:menu:add'"
        >
          <!--          <Icon icon="ep:plus" class="mr-5px" />-->
          新增
        </ElButton>
        <ElButton type="text" @click="delData(row)" :text="true" v-hasPermi="'system:menu:remove'">
          <!--          <Icon icon="ep:delete" class="mr-5px" />-->
          删除
        </ElButton>
      </template>
    </Table>
  </ContentWrap>
  <MenuForm title="菜单" ref="menuFormRef" @getMenuList="getList(params)" />
</template>
