<script setup lang="ts">
import { ref, reactive, getCurrentInstance, unref, h, nextTick } from 'vue'
import moment from 'moment'
import { getOrder } from '@/api/assessment/statistics'
import { ElDialog } from '@/components/ElDialog'
import { useTable } from '@/hooks/web/useTable'
import { Table } from '@/components/Table'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useEmitt } from '@/hooks/web/useEmitt'
// 弹窗的开启和关闭
const DialogFlag = ref<any>(false)
const { proxy } = getCurrentInstance() as any
const { leave_type } = proxy.useDict('leave_type')

const getApplyTypeLabel = (value: string): string => {
  let label = '--'
  unref(leave_type).map((item: any) => {
    if (value == item.value) {
      label = item.label
    }
  })
  return label
}
const title = ref('')

// 存放表格的数据
const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'index',
    label: '序号',
    minWidth: '60px'
  },
  {
    field: 'deptName',
    label: '部门',
    minWidth: '120px',
    formatter: (row: any) => {
      return h('span', row.deptName ? row.deptName : '--')
    }
  },
  {
    field: 'userName',
    label: '姓名',
    minWidth: '100px',
    formatter: (row: any) => {
      return h('span', row.userName ? row.userName : '--')
    }
  },
  {
    field: 'type',
    label: '类型',
    minWidth: '80px',
    formatter: (row: any) => {
      return h(
        'span',
        row.type == 1
          ? getApplyTypeLabel(row.applyType)
          : row.type == 2
          ? '出差'
          : row.type == 3
          ? '加班'
          : row.type == 4
          ? '外出'
          : row.type == 10
          ? '加班任务'
          : '--'
      )
    }
  },
  {
    field: 'startDate',
    label: '开始时间',
    minWidth: '140px',
    formatter: (row: any) => {
      return h('span', row.startDate ? moment(row.startDate).format('YYYY-MM-DD HH:mm') : '--')
    }
  },
  {
    field: 'endDate',
    label: '结束时间',
    minWidth: '140px',
    formatter: (row: any) => {
      return h('span', row.endDate ? moment(row.endDate).format('YYYY-MM-DD HH:mm') : '--')
    }
  },
  // {
  //   field: 'sumDate0',
  //   label: '天数',
  //   minWidth: '80px',
  //   table: { show: title.value == '出差明细' },
  //   formatter: (row: any) => {
  //     return h('span', row.sumDate ? row.sumDate : '--')
  //   }
  // },
  {
    field: 'sumDate',
    label: '小时数',
    minWidth: '80px',
    table: { show: title.value != '出差明细' },
    formatter: (row: any) => {
      return h('span', row.sumDate ? row.sumDate : '--')
    }
  }
])
const { allSchemas } = useCrudSchemas(crudSchemas)
const { register, tableObject, methods } = useTable<any>({
  getListApi: getOrder,
  response: {
    list: 'rows',
    total: 'total'
  }
})
const ElDialogFef = ref()
const { getList, setSearchParams } = methods
//打开drawer并初始化
const openDrawer = (data: any) => {
  ElDialogFef.value.isFullscreen = false
  title.value =
    data.workOrderType == 1
      ? '请假明细'
      : data.workOrderType == 2
      ? '出差明细'
      : data.workOrderType == 3
      ? '加班明细'
      : data.workOrderType == 4
      ? '外出明细'
      : '--'
  DialogFlag.value = true
  let indexSub = -1
  allSchemas.tableColumns.find((item, index) => {
    if (item.field == 'sumDate') {
      indexSub = index
    }
  })
  if (indexSub > -1) {
    allSchemas.tableColumns.splice(indexSub, 1)
  }
  allSchemas.tableColumns.push({
    field: 'sumDate',
    label: data.workOrderType == 2 ? '天数' : '小时数',
    minWidth: '80px',
    formatter: (row: any) => {
      return h('span', row.sumDate ? row.sumDate : '--')
    }
  })
  setSearchParams(data)
}

//关闭drawer
const closeDrawer = () => {
  ElDialogFef.value.isFullscreen = false
  // drawerWrap.value.isShow = false
  DialogFlag.value = false
}

useEmitt({
  name: 'window',
  callback: (type: string) => {
    if (type === 'resize') {
      resetHeight()
    }
  }
})
const divHeight = ref<number>(document.documentElement.offsetHeight * 0.5)

const resetHeight = () => {
  nextTick()
  let layoutContentH = 0
  const layoutContent = document.querySelector('.v-layout')
  if (layoutContent) {
    layoutContentH = layoutContent.clientHeight
  }
  if (ElDialogFef.value.isFullscreen) {
    divHeight.value =
      layoutContentH - getDialogHeaderHeight() - getPaginationHeight() - getBodyPaddingValue()
  } else {
    divHeight.value = layoutContentH * 0.85 - getDialogHeaderHeight() - getPaginationHeight() - 60
  }
}

const toggleFull = (isFull: boolean) => {
  nextTick()
  let layoutContentH = 0
  const layoutContent = document.querySelector('.v-layout')
  if (layoutContent) {
    layoutContentH = layoutContent.clientHeight
  }
  if (isFull) {
    divHeight.value =
      layoutContentH - getDialogHeaderHeight() - getPaginationHeight() - getBodyPaddingValue()
  } else {
    divHeight.value = layoutContentH * 0.85 - getDialogHeaderHeight() - getPaginationHeight() - 60
  }
}
const getBodyPaddingValue = (): number => {
  let topH = 0
  const topWrap = document.querySelector('.el-dialog__body')
  if (topWrap) {
    let computedStyle = getComputedStyle(topWrap, null)
    if (computedStyle) {
      topH = parseFloat(computedStyle.getPropertyValue('padding-top')) * 2
    }
  }
  const appcontent = document.getElementById('app-content')
  if (appcontent) {
    let computedStyle = getComputedStyle(appcontent, null)
    if (computedStyle) {
      topH = topH + parseFloat(computedStyle.getPropertyValue('padding-top'))
    }
  }
  return topH + 2
}
const getDialogHeaderHeight = (): number => {
  let topH = 0
  const topWrap = document.querySelector('.el-dialog__header')
  if (topWrap) {
    topH = topWrap.clientHeight
  }
  return topH
}
const getPaginationHeight = (): number => {
  //搜索框加操作栏高度
  let paginationH = 0
  const pagination = document.querySelectorAll('.el-pagination')
  if (pagination && pagination.length) {
    paginationH = pagination[0].clientHeight
    let computedStyle = getComputedStyle(pagination[0], null)
    if (computedStyle) {
      paginationH = paginationH + parseFloat(computedStyle.getPropertyValue('margin-top'))
    }
  }
  paginationH = paginationH + 3
  return paginationH
}
defineExpose({
  openDrawer
})
</script>

<template>
  <ElDialog
    ref="ElDialogFef"
    :title="title"
    class="cultivate-custom"
    v-model="DialogFlag"
    width="60%"
    :maxHeight="'auto'"
    @toggle-full="toggleFull"
    @closed="DialogFlag = false"
  >
    <Table
      :class="'att_table'"
      :isShowFilter="false"
      :border="true"
      ref="ElTableRef"
      v-model:pageSize="tableObject.pageSize"
      v-model:currentPage="tableObject.currentPage"
      :data="tableObject.tableList"
      :loading="tableObject.loading"
      :columns="allSchemas.tableColumns"
      :height="divHeight + 'px'"
      :statisticsList="true"
      :header-align="'center'"
      :cotentAlign="'center'"
      :pagination="{
        total: tableObject.total
      }"
      @register="register"
    >
      <template #operateBtnLeft>
        <!-- <Search :schema="allSchemas.searchSchema" @search="setSearchParamsSub" @reset="reset" /> -->
      </template>
      <template #index="{ $index }">
        <span>{{
          $index + 1 + tableObject.pageSize * (tableObject.currentPage - 1)
        }}</span></template
      >
    </Table>
  </ElDialog>
</template>

<style lang="less" scoped>
:deep(.el-input-group__append) {
  background-color: white;
  width: 35px;
}
:deep(.att_table),
:deep(.att_table .el-table__inner-wrapper) {
  // height: 51vh !important;
}
</style>
<style>
.timer-input {
  width: 4.686vw !important;
  margin: 6px 0.4vw;
  border-radius: 4px;
}
</style>
