<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { ElButton, ElMessageBox, ElMessage } from 'element-plus'
import { Table, TableExpose } from '@/components/Table'
import { tagTypeListApi, delKonwledgApi } from '@/api/classification/label'
import { MenuData } from '@/api/menu/types'
import { h, reactive, ref, unref, nextTick, provide } from 'vue'
import { useEmitt } from '@/hooks/web/useEmitt'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { listToTree } from '@/utils/tree'
import { Icon } from '@/components/Icon'
import { isAuth } from '@/utils/is'
import { getManagerListApi } from '@/api/sys/user'
import TagClassifyForm from './components/TagClassifyForm.vue'

defineOptions({
  name: 'TagClassify'
})

const TagClassifyFormRef = ref()
const tableRef = ref<TableExpose>()

const dataList = ref([])
const editPreListData = ref()
const getManagerListInit = async () => {
  let res: any = await getManagerListApi()
  if (res) {
    editPreListData.value = res.data.map((v) => {
      return {
        label: v.nickName,
        value: String(v.userId)
      }
    })
  }
}
getManagerListInit()
provide('editPreListData', editPreListData)
// 获取部门树
const getDeptTreeList = async () => {
  try {
    const res = await tagTypeListApi({
      pageNum: 1,
      pageSize: 9999
    })

    dataList.value = res.rows
      .filter((v) => {
        return v.parentId == 0 && v.status == 1
      })
      .map((v) => {
        return {
          value: v.id,
          label: v.tagTypeName
        }
      })
  } catch (err) {
    console.log(err)
  }
}
provide('dataList', dataList)
getDeptTreeList()

useEmitt({
  name: 'getList',
  callback: (type: string) => {
    if (type === 'add') {
      getList(params)
    }
  }
})

let params = reactive<any>({
  status: 1,
  pageNum: 1,
  pageSize: 9999
})

const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'tagTypeName',
    label: '分类名称',
    minWidth: '180px',
    headerAlign: 'center',
    align: 'left',
    table: {
      show: true
    },
    search: {
      show: true,
      componentProps: {
        placeholder: '分类名称筛选',
        style: 'width: 196px'
      }
    },
    formatter: (row: any) => {
      return h('span', row.tagTypeName ? row.tagTypeName : '--')
    }
  },
  // {
  //   field: 'status',
  //   label: '审核状态',
  //   headerAlign: 'center',
  //   align: 'center',
  //   minWidth: '80px',
  //   table: {
  //     show: true
  //   },
  //   formatter: (row: any, __: TableColumn, cellValue: string) => {
  //     return h(
  //       ElTag,
  //       {
  //         type: cellValue == '0' ? 'warning' : cellValue == 1 ? 'success' : 'error'
  //       },
  //       () => (cellValue == 0 ? '待审核' : cellValue == 1 ? '已审核' : '已驳回')
  //     )
  //   }
  // },
  {
    field: 'createByName',
    label: '创建人',
    minWidth: '110px',
    headerAlign: 'center',
    align: 'center',
    table: {
      show: true
    },
    formatter: (row: any) => {
      return h('span', row.createByName ? row.createByName : '--')
    }
  },

  {
    field: 'updateTime',
    minWidth: '120px',
    label: '更新时间',
    headerAlign: 'center',
    align: 'center',
    table: {
      show: true
    },
    formatter: (row: any) => {
      return h('span', row.updateTime ? row.updateTime : '--')
    }
  },

  {
    field: 'auditUserName',
    label: '审核人',
    minWidth: '110px',
    headerAlign: 'center',
    align: 'center',
    table: {
      show: true
    },
    formatter: (row: any) => {
      return h(
        'span',
        row.auditUserName && (row.status == 1 || row.status == -1) ? row.auditUserName : '--'
      )
    }
  },

  {
    field: 'action',
    minWidth: '180px',
    showOverflowTooltip: false,
    headerAlign: 'center',
    align: 'center',
    table: {
      show: true
    },
    fixed: 'right',
    label: '操作'
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)

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
    const ids = [row.id as string]
    const res = await delKonwledgApi(ids.toString())
      .catch(() => {})
      .finally(() => {})
    if (res) {
      ElMessage.success('删除成功')
      getList(params)
    }
  })
}

let tableData = ref<MenuData[]>([])

//搜索
const setSearchParams = (param: any) => {
  params = Object.assign(params, param)
  getList(params)
}

//请求数据
const getList = async (params: any) => {
  refLoading.value = true
  const res = await tagTypeListApi(params)
    .catch(() => {})
    .finally(() => {
      refLoading.value = false
    })

  console.log(res)
  if (res && res.rows) {
    console.log(res.rows)
    tableData.value = listToTree(res.rows, { id: 'id', children: 'children', pid: 'parentId' })
  }
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
  console.log(tableData, isExpand)
  tableData.map((item: MenuData) => {
    unref(tableRef)?.elTableRef?.toggleRowExpansion(item, isExpand)
    if (item.children) {
      toggleRowExpansionByRecursive(item.children, isExpand)
    }
  })
}

const AddAction = (row, type?) => {
  getDeptTreeList()
  if (type == 'add') {
    if (row) {
      TagClassifyFormRef.value.openDrawer('add', row.id, 1)
    } else {
      TagClassifyFormRef.value.openDrawer('add', '', 0)
    }
  } else {
    if (row.parentId) {
      TagClassifyFormRef.value.openDrawer('edit', row.id, 1)
    } else {
      TagClassifyFormRef.value.openDrawer('edit', row.id, 0)
    }
  }
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
      row-key="id"
    >
      <template #operateBtnLeft>
        <Search
          ref="searchRef"
          v-if="isAuth('system:labelClass:query')"
          :schema="allSchemas.searchSchema"
          @search="setSearchParams"
          @reset="setSearchParams"
        />
      </template>
      <template #operateBtnRight>
        <ElButton
          class="no-bg-button"
          v-hasPermi="'system:labelClass:add'"
          @click="AddAction(null, 'add')"
          plain
        >
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
        </ElButton>
      </template>
      <template #tagTypeName="{ row }">
        <span>{{ row.tagTypeName }}</span></template
      >
      <template #status="{ row }">
        <div class="audit-state">
          <p v-if="row.status == 0" class="wait">
            <Icon :size="14" icon="svg-icon:state_icon2" />
            <span>待审核</span>
          </p>
          <p v-else-if="row.status == 1" class="pass">
            <Icon :size="14" icon="svg-icon:state_icon1" />
            <span>已审核</span>
          </p>
          <p v-else-if="row.status == -1" class="reject">
            <Icon :size="14" icon="svg-icon:state_icon5" />
            <span>已驳回</span>
          </p>
          <p v-else>--</p>
        </div>
      </template>
      <template #action="{ row }">
        <ElButton
          class="btn-default"
          :text="true"
          size="small"
          v-if="!row.parentId"
          @click="AddAction(row, 'add')"
        >
          新增
        </ElButton>
        <ElButton
          v-if="isAuth('system:labelClass:edit') && !row.totalCites"
          class="btn-default"
          :text="true"
          size="small"
          @click="AddAction(row)"
        >
          编辑
        </ElButton>
        <ElButton
          v-if="isAuth('system:labelClass:remove') && !row.totalCites"
          class="btn-default"
          :text="true"
          size="small"
          @click="delData(row)"
        >
          删除
        </ElButton>
      </template>
    </Table>
  </ContentWrap>
  <TagClassifyForm ref="TagClassifyFormRef" />
</template>
