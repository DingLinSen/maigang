<script setup lang="ts">
import { MenuForm } from './components/index'
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { ElButton, ElMessageBox, ElSwitch, ElDrawer, ElTag, ElMessage, ElTable } from 'element-plus'
import { Table, TableExpose } from '@/components/Table'
import { getMenuListApi, delMenuListApi } from '@/api/menu'
import { MenuData } from '@/api/menu/types'
import { h, reactive, ref, unref, nextTick, getCurrentInstance } from 'vue'
import { useEmitt } from '@/hooks/web/useEmitt'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { TableColumn } from '@/types/table'
// import { fa } from 'element-plus/es/locale'
import { listToTree } from '@/utils/tree'
import { Icon } from '@/components/Icon'
import { isAuth } from '@/utils/is'

defineOptions({
  name: 'Menu'
})
// 菜单管理
const { proxy } = getCurrentInstance() as any
const { sys_normal_disable } = proxy.useDict('sys_normal_disable')

const getElTagLabel = (value: string): string => {
  let label = ''
  unref(sys_normal_disable).map((item: any) => {
    if (value === item.value) {
      label = item.label
    }
  })
  return label
}

const menuFormRef = ref<ComponentRef<typeof MenuForm>>()

const tableRef = ref<TableExpose>()

useEmitt({
  name: 'getList',
  callback: (type: string) => {
    if (type === 'add') {
      getList(params)
    }
  }
})

let params = reactive<Recordable>({
  menuName: '',
  status: ''
})

const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'menuName',
    label: '菜单名称',
    headerAlign: 'center',
    search: {
      show: true,
      componentProps: {
        style: 'width: 196px',
        placeholder: '菜单名称筛选'
      }
    },
    minWidth: '200px',
    formatter: (row: Recordable) => {
      return h('span', row.menuName ? row.menuName : '--')
    }
  },
  {
    field: 'icon',
    label: '菜单图标',
    headerAlign: 'center',
    align: 'center',
    minWidth: '60px',
    formatter: (row: Recordable, __: TableColumn, cellValue: string) => {
      return row.icon !== ' #' && row.icon
        ? h(
            Icon,
            {
              icon: row.icon && row.icon !== ' #' ? 'svg-icon:' + row.icon : '--'
            },
            () => (row.icon && row.icon !== ' #' ? row.icon : '--')
          )
        : h('span', '--')
    }
  },
  {
    field: 'orderNum',
    label: '显示顺序',
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
    field: 'status',
    label: '菜单状态',
    headerAlign: 'center',
    align: 'center',
    minWidth: '80px',
    formatter: (_: Recordable, __: TableColumn, cellValue: string) => {
      return h(
        ElTag,
        {
          type: cellValue === '0' ? '' : 'danger'
        },
        () => getElTagLabel(cellValue)
      )
    },
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        style: 'width: 196px',
        options: sys_normal_disable,
        placeholder: '菜单状态筛选'
      }
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
    minWidth: '240px',
    showOverflowTooltip: false,
    headerAlign: 'center',
    align: 'center',
    label: '操作',
    fixed: 'right'
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)

//新增
const AddAction = () => {
  menuFormRef.value.openDrawer('add', '', true)
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
    type: 'warning',
    autofocus: false
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
  // 第三参数是否是新增主目录
  menuFormRef.value.openDrawer(type, row, false)
}

let tableData = ref<MenuData[]>([])

//搜索
const setSearchParams = (param: Recordable) => {
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

  console.log(tableData.value)
}

//展开/折叠 第一种 有瑕疵
const expandOrCollapse = () => {
  refreshTable.value = false
  isExpand.value = !isExpand.value
  nextTick(() => {
    refreshTable.value = true
  })
}

//展开/折叠 第二种
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

// 是否显示筛选窗口
const isShowCell = ref(false)
</script>

<template>
  <ContentWrap :isShowtitle="false">
    <Table
      v-if="refreshTable"
      ref="tableRef"
      :loading="refLoading"
      :columns="allSchemas.tableColumns"
      :data="tableData"
      :isShowCell="isShowCell"
      :selection="false"
      :stripe="true"
      :default-expand-all="isExpand"
      row-key="menuId"
    >
      <template #operateBtnLeft>
        <Search
          :schema="allSchemas.searchSchema"
          @search="setSearchParams"
          @reset="setSearchParams"
          v-if="isAuth('system:menu:query')"
        />
      </template>
      <template #operateBtnRight>
        <ElButton class="no-bg-button" @click="AddAction()" plain v-hasPermi="'system:menu:add'">
          <template #icon>
            <Icon :size="14" icon="svg-icon:addBut" />
          </template>
          新增
        </ElButton>
        <ElButton class="no-bg-button" @click="toggleRowExpansion" plain>
          <template #icon>
            <Icon :size="14" icon="svg-icon:unfoldFold" />
          </template>
          展开/折叠
        </ElButton></template
      >
      <template #action="{ row }">
        <ElButton
          class="btn-default"
          @click="action(row, 'edit')"
          :text="true"
          v-hasPermi="'system:menu:edit'"
          >编辑
        </ElButton>
        <ElButton
          class="btn-default"
          @click="action(row, 'add')"
          :text="true"
          v-hasPermi="'system:menu:add'"
          v-if="row.menuType !== 'F'"
        >
          新增
        </ElButton>
        <ElButton
          class="btn-default"
          @click="delData(row, false)"
          :text="true"
          v-hasPermi="'system:menu:remove'"
        >
          删除
        </ElButton>
      </template>
    </Table>
  </ContentWrap>
  <MenuForm title="菜单" ref="menuFormRef" />
</template>
