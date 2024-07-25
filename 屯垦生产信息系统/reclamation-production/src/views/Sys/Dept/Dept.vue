<script setup lang="ts">
import { h, reactive, ref, unref, onMounted, nextTick, getCurrentInstance } from 'vue'
import { ElButton, ElMessageBox, ElSwitch, ElMessage } from 'element-plus'

import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Table, TableExpose } from '@/components/Table'
import { DeptForm } from './components/index'
import { listToTree } from '@/utils/tree'
import { isAuth } from '@/utils/is'
// import { useEmitt } from '@/hooks/web/useEmitt'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useCache } from '@/hooks/web/useCache'
import { useAppStore } from '@/store/modules/app'
import { TableColumn } from '@/types/table'
import { getTableListApi, delTableListApi, updateTableApi, exportDeptListApi } from '@/api/sys/dept'
import { TableData } from '@/api/sys/dept/types'

defineOptions({
  name: 'Dept'
})

const { proxy } = getCurrentInstance() as any

const appStore = useAppStore()
const { wsCache } = useCache()
const userInfo = wsCache.get(appStore.getUserInfo)
// const { register, tableObject, methods } = useTable<TableData>({
//   getListApi: getTableListApi,
//   delListApi: delTableListApi,
//   response: {
//     list: '',
//     total: 'total'
//   }
// })
// useEmitt({
//   name: 'getDeptList',
//   callback: (type: string) => {
//     if (type === 'add') {
//       tableObject.currentPage = 1
//     }
//     getList()
//   }
// })
// const { getList, setSearchParams } = methods
// getList().then(() => {
//   tableObject.tableList = tableObject.data.data
//   let tableList = listToTree(tableObject.tableList, {
//     id: 'deptId',
//     children: 'children',
//     pid: 'parentId'
//   })
// })

onMounted(() => {
  initDataList()
})
const delLoading = ref(false)
const tableRef = ref<TableExpose>()
//列表加载
const refLoading = ref(false)
//默认列表展开
const isExpand = ref(false)
const refreshTable = ref(true)
let tableData = ref<TableData[]>([])
let expendRowKey: any = reactive([])

const deptFormRef = ref<ComponentRef<typeof DeptForm>>()

const switchChange = (row: Recordable) => {
  if (row.admin) {
    ElMessage.error('禁止修改超级管理员用户的状态')
    return
  }
  let msg = ''
  let title = ''
  if (row.status === '0') {
    title = '部门停用提示'
    msg = '确认要停用"' + row.deptName + '"部门？'
  } else {
    title = '部门启用提示'
    msg = '确认要启用"' + row.deptName + '"部门吗？'
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
    const res = await updateTableApi(params)
    if (res) {
      nextTick()
      ElMessage.success(row.status === '0' ? '停用成功' : '启用成功')
      row.status = row.status === '0' ? '1' : '0'
    }
  })
}
// const getLevelLabel = (value: string): string => {
//   let label = ''
//   unref(sys_dept_level).map((item: any) => {
//     if (value === item.value) {
//       label = item.label
//     }
//   })
//   return label
// }
const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'deptName',
    label: '组织机构',
    search: {
      show: true,
      componentProps: {
        style: 'width:200px;' //宽度
      }
    },
    minWidth: '200px'
  },

  {
    field: 'createByName',
    minWidth: '100px',
    align: 'center',
    headerAlign: 'center',
    label: '创建人'
  },
  {
    field: 'createTime',
    minWidth: '140px',
    align: 'center',
    headerAlign: 'center',
    label: '创建时间'
  },
  {
    field: 'action',
    width: '200px',
    align: 'center',
    headerAlign: 'center',
    label: '操作'
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)

const addAction = () => {
  if (deptFormRef.value) {
    deptFormRef.value.openDrawer('add', '')
  }
}
const chooseListAll = ref([])
//搜索
const setSearchParams = (param: any) => {
  chooseListAll.value = []
  param.deptName = param.deptName || null
  param.orderNum = param.orderNum || null
  initDataList(param)
}
// 获取列表数据
const initDataList = async (param?: any) => {
  refLoading.value = true
  await getTableListApi(param)
    .then((res: any) => {
      if (res && res.data) {
        res.data.forEach((item) => {
          item.label = item.deptName
          item.value = item.deptId
        })
        let data = listToTree(res.data, {
          id: 'deptId',
          children: 'children',
          pid: 'parentId'
        })
        data.map((item: any) => {
          expendRowKey.push(item.deptId + '')
          // if (item.children) {
          //   item.children.map((child) => {
          //     expendRowKey.push(child.deptId + '')
          //   })
          // }
        })
        tableData.value = data
      }
    })
    .catch(() => {})
    .finally(() => {
      refLoading.value = false
    })
}

//展开/折叠
const toggleRowExpansion = () => {
  isExpand.value = !isExpand.value
  nextTick(() => {
    tableData.value.map((item: TableData) => {
      unref(tableRef)?.elTableRef?.toggleRowExpansion(item, isExpand.value)
    })
  })
}
// 删除
const delData = async (row: TableData) => {
  ElMessageBox.confirm('是否删除所选中数据？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    autofocus: false,
    type: 'warning'
  }).then(async () => {
    delLoading.value = true
    const ids = [row.deptId as string]
    await delTableListApi(ids.toString())
      .then((res) => {
        if (res) {
          ElMessage.success('删除成功')
          initDataList()
        }
        delLoading.value = false
      })
      .catch(() => {})
      .finally(() => {})
  })
}

const action = (row: TableData, type: string) => {
  if (deptFormRef.value) {
    deptFormRef.value.openDrawer(type, row.deptId)
  }
}
// 是否显示筛选窗口
const isShowFilter = ref(false)
//导出加载
const exLoading = ref(false)

const searchRef = ref<ComponentRef<typeof Search>>()
//导出
const exportForm = async () => {
  if (tableData.value.length === 0) {
    ElMessage.warning('查询无数据, 无需导出数据')
    return
  }
  const param = await unref(searchRef)?.getFormData()
  exLoading.value = true
  await exportDeptListApi(param)
  exLoading.value = false
}
</script>

<template>
  <ContentWrap class="mt-7px mb-10px">
    <Search
      v-if="isAuth('system:dept:query')"
      ref="searchRef"
      :schema="allSchemas.searchSchema"
      :chooseListAll="chooseListAll"
      @search="setSearchParams"
      @reset="setSearchParams"
    />
  </ContentWrap>
  <ContentWrap>
    <Table
      v-if="refreshTable"
      ref="tableRef"
      :loading="refLoading"
      :columns="allSchemas.tableColumns"
      :data="tableData"
      :border="true"
      :isShowFilter="isShowFilter"
      :selection="false"
      :stripe="true"
      :chooseListAll="chooseListAll"
      :default-expand-all="isExpand"
      :expand-row-keys="expendRowKey"
      row-key="deptId"
    >
      <template #operateBtnLeft>
        <ElButton
          type="primary"
          v-show="userInfo.userName === 'admin'"
          @click="addAction"
          v-hasPermi="'system:dept:add'"
        >
          <Icon icon="ep:plus" class="mr-5px" />新增</ElButton
        >
        <ElButton type="primary" @click="exportForm" plain v-hasPermi="'system:dept:export'">
          <Icon icon="ep:download" class="mr-5px" />导出</ElButton
        >
        <ElButton type="primary" @click="toggleRowExpansion" plain>
          <Icon icon="ep:sort" class="mr-5px" />展开/折叠
        </ElButton>
      </template>
      <template #action="{ row }">
        <ElButton type="text" @click="action(row, 'edit')" v-hasPermi="'system:dept:edit'" text>
          编辑
        </ElButton>
        <ElButton type="text" @click="action(row, 'add')" v-hasPermi="'system:dept:add'" text>
          新增
        </ElButton>
        <ElButton type="text" @click="delData(row)" v-hasPermi="'system:dept:remove'" text>
          删除
        </ElButton>
      </template>
    </Table>
    <DeptForm title="部门" :tableData="tableData" ref="deptFormRef" @getDeptList="initDataList" />
  </ContentWrap>
</template>
<style lang="less" scoped>
:deep(.el-table) {
  .level-1 {
    color: #fff;
    background: rgba(45, 169, 250, 1);
  }
  .level-2 {
    color: #fff;
    background: rgba(255, 152, 0, 1);
  }
  .level-3 {
    color: #fff;
    background: rgba(0, 150, 136, 1);
  }
  .level-4 {
    color: #fff;
    background: rgba(112, 182, 3, 1);
  }
  .level-5 {
    color: #fff;
    background: rgba(30, 198, 149, 1);
  }
}
</style>
