<!-- 公司新闻 -->
<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { ElButton, ElMessageBox, ElSwitch, ElDrawer, ElTag, ElMessage } from 'element-plus'
import { getCompanyContentList } from '@/api/CulturaEmpresarial/news'
import { useTable } from '@/hooks/web/useTable'
import { AnnouncementData } from '@/api/AdministrativeService/announcement/types'
import { Table } from '@/components/Table'
import { h, reactive, ref, unref, onMounted, toRefs, toRaw, nextTick } from 'vue'
import { useEmitt } from '@/hooks/web/useEmitt'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { TableColumn } from '@/types/table'
import { isAuth } from '@/utils/is'
import moment from 'moment'
import { DetailsDialog } from '@/views/Components/Details'
import noticeIcon from '@/assets/svgs/notice.svg'
import { LimitDailog } from '@/views/Components/limit'

defineOptions({
  name: 'CompanyNews'
})

const pageSize = ref<number>(20)
const { register, tableObject, methods } = useTable<AnnouncementData>({
  getListApi: getCompanyContentList,
  response: {
    list: 'rows',
    total: 'total'
  },
  defaultParams: {
    aduStatus: '1'
  }
})
tableObject.pageSize = pageSize

const { getList, setSearchParams } = methods
getList()

const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'index',
    headerAlign: 'center',
    cotentAlign: 'center',
    label: '图标',
    width: '40px',
    formatter: (row: Recordable, __: TableColumn, cellValue: string, index: number) => {
      return h('img', {
        src: noticeIcon
      })
    }
  },
  {
    field: 'title',
    label: '标题',
    minWidth: '580px',
    className: 'content-title-class',
    search: {
      show: true,
      componentProps: {
        style: 'width: 320px',
        placeholder: '关键字筛选'
      }
    },
    formatter: (row: Recordable) => {
      return h(
        'span',
        {
          onClick: () => {
            openPreviewFile(row)
          }
        },
        row.title ? row.title : '--'
      )
    }
  },
  {
    field: 'pubTime',
    width: '220px',
    label: '发布时间',
    formatter: (row: Recordable) => {
      return h(
        'span',
        {
          style: 'color:#888888;font-size:13px;'
        },
        row.pubTime ? '发布时间：' + moment(row.pubTime).format('YYYY-MM-DD') : '--'
      )
    }
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)

const params = reactive<Recordable>({
  title: ''
})

//搜索
const setSearchParamsSub = (param: Recordable) => {
  params.title = param.title ? param.title : ''
  setSearchParams(params)
}

// 预览弹窗
const detailsDialogRef = ref()
const title = ref<string>('')
const content = ref<string>('')
const type = ref<string>('')
const fileUrl = ref<string>('')
const openPreviewFile = (row: any) => {
  title.value = row.title
  fileUrl.value = row.filePath
  content.value = row.content ? row.content : ''
  detailsDialogRef.value.openDrawer()
}

const newsCellClick = (row: any, column: any, cell: any, event: any) => {
  if (column.property === 'title') {
    openPreviewFile(row)
  }
}
</script>

<template>
  <ContentWrap Showtitle="公司新闻">
    <Table
      v-model:pageSize="tableObject.pageSize"
      v-model:currentPage="tableObject.currentPage"
      :show-header="false"
      :columns="allSchemas.tableColumns"
      :page-size="pageSize"
      :is-show-filter="false"
      :data="tableObject.tableList"
      :loading="tableObject.loading"
      :cotentAlign="'left'"
      :selection="false"
      :stripe="true"
      :pagination="{
        total: tableObject.total
      }"
      @cell-click="newsCellClick"
      @register="register"
    >
      <template #operateBtnLeft>
        <Search
          v-if="isAuth('company:news:query')"
          :schema="allSchemas.searchSchema"
          @search="setSearchParams"
          @reset="setSearchParams"
        />
      </template>
    </Table>
    <LimitDailog routerName="CompanyNews" />
  </ContentWrap>
  <DetailsDialog
    :title="title"
    :content="content"
    :url="fileUrl"
    :type="type"
    ref="detailsDialogRef"
  />
</template>
<style lang="less" scoped>
:deep(.el-table .cell) {
  line-height: 35px !important;
}
</style>
<style lang="less">
.content-title-class {
  cursor: pointer;
  color: #001a2c;
  font-size: 15px;
}
.content-title-class:hover {
  color: #00a0e9;
}
</style>
