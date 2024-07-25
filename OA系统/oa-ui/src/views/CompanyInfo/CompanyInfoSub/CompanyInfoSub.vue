<!-- 公司资料 -->
<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { ElButton, ElMessageBox, ElSwitch, ElDrawer, ElTag, ElMessage } from 'element-plus'
import { getCompanyInformationListApi } from '@/api/AdministrativeService/information'
import { useTable } from '@/hooks/web/useTable'
import { Table } from '@/components/Table'
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
import { isAuth } from '@/utils/is'
import { DetailsDialog } from '@/views/Components/Details'
import { downloadFile } from '@/utils/index'
import moment from 'moment'
import { LimitDailog } from '@/views/Components/limit'

defineOptions({
  name: 'CompanyInfoSub'
})
const { proxy } = getCurrentInstance() as any
const { com_info_types } = proxy.useDict('com_info_types')

const pageSize = ref<number>(20)
const { register, tableObject, methods } = useTable<any>({
  getListApi: getCompanyInformationListApi,
  response: {
    list: 'rows',
    total: 'total'
  }
})
tableObject.pageSize = pageSize

const { getList, setSearchParams } = methods
getList()
const getElTagLabel = (value: string): string => {
  let label = ''
  com_info_types.value.map((item: any) => {
    if (value === item.value) {
      label = item.label
    }
  })
  return label
}
const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'type',
    label: '类型',
    width: '82px',
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        placeholder: '类型筛选',
        style: 'width: 196px',
        options: com_info_types
      }
    },
    formatter: (_: Recordable, __: TableColumn, cellValue: string) => {
      return h(
        'span',
        {
          class:
            cellValue === '1'
              ? 'company-tag-class'
              : cellValue === '2'
              ? 'product-tag-class'
              : cellValue === '3'
              ? 'agriculture-tag-class'
              : cellValue === '4'
              ? 'railway-tag-class'
              : cellValue === '5'
              ? 'war-industry-tag-class'
              : 'other-tag-class'
        },
        getElTagLabel(cellValue) || '--'
      )
    }
  },
  {
    field: 'title',
    label: '标题',
    minWidth: '500px',
    className: 'content-title-class',
    search: {
      show: true,
      componentProps: {
        style: 'width: 196px',
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
    field: 'createTime',
    width: '220px',
    label: '发布时间',
    formatter: (row: Recordable) => {
      return h(
        'span',
        {
          style: 'color:#888888;font-size:13px;'
        },
        row.createTime ? '发布时间：' + moment(row.createTime).format('YYYY-MM-DD') : '--'
      )
    }
  },
  {
    field: 'action',
    showOverflowTooltip: false,
    width: '80px',
    fixed: 'right',
    label: '操作'
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)

const params = reactive<Recordable>({
  type: '',
  title: ''
})

//搜索
const setSearchParamsSub = (param: Recordable) => {
  params.type = param.type ? param.type : ''
  params.title = param.title ? param.title : ''
  setSearchParams(params)
}

// 预览弹窗
const title = ref<string>('')
const content = ref<string>('')
const type = ref<string>('')
const fileUrl = ref<string>('')
const openPreviewFile = (row: any) => {
  title.value = row.title
  fileUrl.value = row.filePath
  content.value = row.describeInfo ? row.describeInfo : ''
  type.value = getElTagLabel(row.type)
  detailsDialogRef.value.openDrawer()
}
const detailsDialogRef = ref()
const fileNext = (path: any) => {
  let extension = ''
  if (path) {
    extension = path.substring(path.lastIndexOf('.') + 1)
  }
  return extension
}
//下载
const downloadFileSub = (row: any) => {
  downloadFile(row.filePath, row.title + '.' + fileNext(row.filePath))
}

const newsCellClick = (row: any, column: any, cell: any, event: any) => {
  if (column.property === 'title') {
    openPreviewFile(row)
  }
}
</script>

<template>
  <ContentWrap Showtitle="公司资料">
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
          v-if="isAuth('company:info:query')"
          :schema="allSchemas.searchSchema"
          @search="setSearchParams"
          @reset="setSearchParams"
        />
      </template>

      <template #action="{ row }">
        <ElButton
          @click="downloadFileSub(row)"
          v-if="isAuth('company:info:download') && row.filePath"
          :text="true"
          class="btn-default"
        >
          下载
        </ElButton>
      </template>
    </Table>
    <DetailsDialog
      :title="title"
      :content="content"
      :url="fileUrl"
      :type="type"
      ref="detailsDialogRef"
    />
    <LimitDailog routerName="CompanyInfoSub" />
  </ContentWrap>
</template>
<style lang="less" scoped>
:deep(.el-table__row .cell) {
  line-height: 35px !important;
}
</style>
<style lang="less">
.company-tag-class {
  border: 1px solid #a481d0;
  color: #a481d0;
  background-color: #ffffff;
  padding: 0px 12px;
}
.product-tag-class {
  border: 1px solid #e9852d;
  color: #e9852d;
  background-color: #ffffff;
  padding: 0px 12px;
}
.agriculture-tag-class {
  border: 1px solid #52c181;
  color: #52c181;
  background-color: #ffffff;
  padding: 0px 12px;
}
.railway-tag-class {
  border: 1px solid #c5ab86;
  color: #c5ab86;
  background-color: #ffffff;
  padding: 0px 12px;
}
.war-industry-tag-class {
  border: 1px solid #97afc5;
  color: #97afc5;
  background-color: #ffffff;
  padding: 0px 12px;
}
.other-tag-class {
  border: 1px solid #0da6b7;
  color: #0da6b7;
  background-color: #ffffff;
  padding: 0px 12px;
}
.content-title-class {
  cursor: pointer;
  color: #001a2c;
  font-size: 15px;
}
.content-title-class:hover {
  color: #00a0e9;
}
</style>
