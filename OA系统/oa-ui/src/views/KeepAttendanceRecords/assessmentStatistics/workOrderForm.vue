<script setup lang="ts">
import { ref, reactive, h, nextTick } from 'vue'
import moment from 'moment'
import { getDetailsListApi } from '@/api/assessment/statistics'
import { ElDialog } from '@/components/ElDialog'
import { useTable } from '@/hooks/web/useTable'
import { Table } from '@/components/Table'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useEmitt } from '@/hooks/web/useEmitt'
// 弹窗的开启和关闭
const DialogFlag = ref<any>(false)
const title = ref('')

const ElDialogFef = ref()

// 存放表格的数据
const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'index',
    label: '序号',
    minWidth: '80px'
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
    minWidth: '120px',
    formatter: (row: any) => {
      return h('span', row.userName ? row.userName : '--')
    }
  },
  {
    field: 'clockinDate',
    label: '异常考勤日期',
    minWidth: '120px',
    formatter: (row: any) => {
      return h('span', row.clockinDate ? moment(row.clockinDate).format('YYYY-MM-DD') : '--')
    }
  },
  {
    field: 'attenceClockinTime',
    label: '上班打卡时间',
    minWidth: '120px',
    formatter: (row: any) => {
      return h(
        'span',
        row.attenceClockinTime ? moment(row.attenceClockinTime).format('HH:mm:ss') : '--'
      )
    }
  },
  {
    field: 'attenceClockoutTime',
    label: '下班打卡时间',
    minWidth: '120px',
    formatter: (row: any) => {
      return h(
        'span',
        row.attenceClockoutTime ? moment(row.attenceClockoutTime).format('HH:mm:ss') : '--'
      )
    }
  }
])
const { allSchemas } = useCrudSchemas(crudSchemas)
const { register, tableObject, methods } = useTable<any>({
  getListApi: getDetailsListApi,
  response: {
    list: 'rows',
    total: 'total'
  }
})
const { getList, setSearchParams } = methods
//打开drawer并初始化
const openDrawer = (data: any) => {
  ElDialogFef.value.isFullscreen = false
  title.value =
    data.exceptionsString == 1
      ? '迟到明细'
      : data.exceptionsString == 2
      ? '早退明细'
      : data.exceptionsString == 3
      ? '请假明细'
      : data.exceptionsString == 4
      ? '旷工明细'
      : '--'
  DialogFlag.value = true
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
  return topH + 10
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
  }
  paginationH = paginationH + 10
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
    :width="'60%'"
    v-model="DialogFlag"
    :maxHeight="'auto'"
    @closed="DialogFlag = false"
    @toggle-full="toggleFull"
  >
    <Table
      class="att_table"
      :isShowFilter="false"
      :border="true"
      ref="ElTableRef"
      v-model:pageSize="tableObject.pageSize"
      v-model:currentPage="tableObject.currentPage"
      :data="tableObject.tableList"
      :loading="tableObject.loading"
      :columns="allSchemas.tableColumns"
      :header-align="'center'"
      :cotentAlign="'center'"
      :height="divHeight + 'px'"
      :statisticsList="true"
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
