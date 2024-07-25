<template>
  <ContentWrap Showtitle="会议记录">
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
      @register="register"
    >
      <template #operateBtnLeft>
        <Search
          v-if="isAuth('meeting:record:query')"
          :schema="allSchemas.searchSchema"
          @search="setSearchParamsSub"
          @reset="setSearchParamsSub"
        />
      </template>

      <template #action="{ row }">
        <ElButton @click="action(row, 'see')" :text="true" class="btn-default"> 详情 </ElButton>
      </template>
    </Table>
  </ContentWrap>

  <MeetingForm ref="meetingFormRef" />
  <LimitDailog routerName="meetingMinutes" />
</template>

<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { ElButton, ElMessageBox, ElMessage } from 'element-plus'
import { Table } from '@/components/Table'
import { getMeetingListApi } from '@/api/meeting'
import { useTable } from '@/hooks/web/useTable'
import { getCurrentInstance, h, reactive, ref, unref, provide, onMounted } from 'vue'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { TableColumn } from '@/types/table'
import { isAuth } from '@/utils/is'
import moment from 'moment'
import { MeetingForm } from './components'
import { meetingroomArray } from './components/config'
import { LimitDailog } from '@/views/Components/limit'

defineOptions({
  name: 'MeetingMinutes'
})

const { register, tableObject, methods } = useTable<any>({
  getListApi: getMeetingListApi,
  response: {
    list: 'rows',
    total: 'total'
  }
})
const { getList, setSearchParams } = methods
getList()
const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'index',
    label: '序号',
    minWidth: '60px',
    formatter: (row: Recordable, __: TableColumn, cellValue: string, index: number) => {
      let itemIndex = index + 1 + tableObject.pageSize * (tableObject.currentPage - 1)
      return h('span', itemIndex)
    }
  },
  {
    field: 'meetingroom',
    label: '会议室名称',
    minWidth: '100px',
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        style: 'width: 196px',
        filterable: true,
        placeholder: '会议室名称筛选',
        options: meetingroomArray
      }
    },
    formatter: (row: Recordable) => {
      return h('span', row.meetingroom ? row.meetingroom : '--')
    }
  },
  {
    field: 'summary',
    label: '会议主题',
    minWidth: '290px',
    formatter: (row: Recordable) => {
      return h('span', row.summary ? row.summary : '--')
    },
    search: {
      show: true,
      componentProps: {
        style: 'width: 196px',
        placeholder: '会议主题筛选'
      }
    }
  },
  {
    field: 'bookDateStart',
    label: '预约开始时间',
    minWidth: '160px',
    search: {
      show: true,
      component: 'DatePicker',
      componentProps: {
        type: 'daterange', // 组件type属性+
        format: 'YYYY-MM-DD',
        startPlaceholder: '预约开始时间',
        endPlaceholder: '预约结束时间'
      }
    },
    formatter: (row: Recordable) => {
      return h(
        'span',
        row.bookDateStart ? moment(row.bookDateStart).format('YYYY-MM-DD HH:mm') : '--'
      )
    }
  },
  {
    field: 'bookDateEnd',
    minWidth: '160px',
    label: '预约结束时间',
    formatter: (row: Recordable) => {
      return h('span', row.bookDateEnd ? moment(row.bookDateEnd).format('YYYY-MM-DD HH:mm') : '--')
    }
  },
  {
    field: 'bookByName',
    minWidth: '100px',
    label: '预约人',
    formatter: (row: Recordable) => {
      return h('span', row.bookByName ? row.bookByName : '--')
    }
  },
  {
    field: 'action',
    showOverflowTooltip: false,
    minWidth: '120px',
    fixed: 'right',
    label: '操作'
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)

const meetingFormRef = ref()
//table操作栏按钮事件
const action = (row: any, type: string) => {
  meetingFormRef.value.openDrawer(type, row.id)
}

const params = reactive<Recordable>({
  meetingroom: '',
  summary: '',
  startDay: '',
  endDay: ''
})

//搜索
const setSearchParamsSub = (param: Recordable) => {
  let beginTime = param.bookDateStart ? moment(param.bookDateStart[0]).format('YYYY-MM-DD') : null
  let endTime = param.bookDateStart ? moment(param.bookDateStart[1]).format('YYYY-MM-DD') : null
  params.startDay = beginTime
  params.endDay = endTime
  params.summary = param.summary ? param.summary : ''
  params.meetingroom = param.meetingroom ? param.meetingroom : ''
  setSearchParams(params)
}
</script>

<style scoped></style>
