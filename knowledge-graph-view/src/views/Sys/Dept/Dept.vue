<script setup lang="ts">
import { DeptForm } from './components/index'
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
// import { useI18n } from '@/hooks/web/useI18n'
import { ElButton, ElMessageBox, ElSwitch, ElDrawer, ElTag, ElMessage } from 'element-plus'
import { Table, TableExpose } from '@/components/Table'
import { getTableListApi, delTableListApi } from '@/api/sys/dept'
import { useTable } from '@/hooks/web/useTable'
import { TableData } from '@/api/sys/dept/types'
import {
  h,
  reactive,
  ref,
  unref,
  onMounted,
  toRefs,
  toRaw,
  nextTick,
  getCurrentInstance
} from 'vue'
import { useEmitt } from '@/hooks/web/useEmitt'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { TableColumn } from '@/types/table'
// import { fa } from 'element-plus/es/locale'
import { listToTree } from '@/utils/tree'
import { isAuth } from '@/utils/is'

defineOptions({
  name: 'Dept'
})

const { proxy } = getCurrentInstance() as any
const { sys_normal_disable } = proxy.useDict('sys_normal_disable')

// const { register, tableObject, methods } = useTable<TableData>({
//   getListApi: getTableListApi,
//   delListApi: delTableListApi,
//   response: {
//     list: '',
//     total: 'total'
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
//   console.log('tableObject', toRaw(tableList), tableList)
// })

onMounted(() => {
  initDataList('')
})
const visible = ref(false)
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

const params = reactive<Recordable>({
  deptName: '',
  status: ''
  // params: paramsMap
})

useEmitt({
  name: 'getList',
  callback: (type: string) => {
    if (type === 'add') {
      initDataList(params)
    }
  }
})

// const { t } = useI18n()

const getElTagLabel = (value: string): string => {
  let label = ''
  unref(sys_normal_disable).map((item: any) => {
    if (value === item.value) {
      label = item.label
    }
  })
  return label
}

const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'deptName',
    label: '部门名称',
    search: {
      show: true,
      componentProps: {
        style: 'width: 196px',
        placeholder: '部门名称筛选'
      }
    },
    minWidth: '300px'
  },
  {
    field: 'orderNum',
    align: 'center',
    minWidth: '80px',
    headerAlign: 'center',
    label: '排序'
  },
  {
    field: 'status',
    label: '状态',
    minWidth: '80px',
    align: 'center',
    headerAlign: 'center',
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
        placeholder: '状态筛选',
        options: sys_normal_disable
      }
    }
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
    minWidth: '240px',
    showOverflowTooltip: false,
    align: 'center',
    headerAlign: 'center',
    label: '操作'
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)

const AddAction = () => {
  deptFormRef.value.openDrawer('add')
}
//搜索
const setSearchParams = (param: any) => {
  console.log(param)

  params.status = param.status ? param.status : ''
  params.deptName = param.deptName ? param.deptName : ''
  params.orderNum = param.orderNum ? param.orderNum : ''
  initDataList(params)
}
// 获取列表数据
const initDataList = async (param: any) => {
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
        // console.log(data)
        // console.log('tableData', toRaw(tableData.value), toRaw(expendRowKey))
      }
    })
    .catch(() => {})
    .finally(() => {
      refLoading.value = false
    })
}

//展开/折叠 第一种 有瑕疵
// const expandOrCollapse = () => {
//   refreshTable.value = false
//   isExpand.value = !isExpand.value
//   nextTick(() => {
//     refreshTable.value = true
//   })
// }

//展开/折叠 第二种
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
    type: 'warning',
    autofocus: false
  }).then(async () => {
    const ids = [row.deptId as string]
    await delTableListApi(ids.toString())
      .then((res) => {
        if (res) {
          ElMessage.success('删除成功')
          initDataList('')
        }
      })
      .catch(() => {})
      .finally(() => {})
  })
}

const deptAdd = () => {
  initDataList('')
}

const action = (row: TableData, type: string) => {
  deptFormRef.value.openDrawer(type, row.deptId)
}
// 是否显示筛选窗口
const isShowCell = ref(false)

// 筛选列
const showCell = () => {
  isShowCell.value = !isShowCell.value
}
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
      :expand-row-keys="expendRowKey"
      row-key="deptId"
    >
      <template #operateBtnLeft>
        <Search
          v-if="isAuth('system:dept:query')"
          :schema="allSchemas.searchSchema"
          @search="setSearchParams"
          @reset="setSearchParams"
        />
      </template>
      <template #operateBtnRight>
        <ElButton class="btn-add" @click="AddAction" plain v-hasPermi="'system:dept:add'">
          <template #icon>
            <Icon :size="14" icon="svg-icon:addBut" />
          </template>
          新增
        </ElButton>
        <ElButton class="other exportBtn" @click="toggleRowExpansion" plain>
          <template #icon>
            <Icon :size="14" icon="svg-icon:unfoldFold" />
          </template>
          展开/折叠
        </ElButton>
      </template>
      <template #action="{ row }">
        <ElButton
          class="btn-default"
          @click="action(row, 'edit')"
          v-hasPermi="'system:dept:edit'"
          text
          size="small"
        >
          编辑
        </ElButton>
        <ElButton
          class="btn-default"
          @click="action(row, 'add')"
          v-hasPermi="'system:dept:add'"
          text
          size="small"
        >
          新增
        </ElButton>
        <ElButton
          @click="delData(row, false)"
          v-hasPermi="'system:dept:remove'"
          text
          class="btn-default"
          size="small"
        >
          删除
        </ElButton>
      </template>
    </Table>
    <DeptForm title="部门" :tableData="tableData" ref="deptFormRef" @formAdd="deptAdd" />
  </ContentWrap>
</template>
