<!-- 公司制度 -->
<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { ElButton, ElMessageBox, ElSwitch, ElDrawer, ElTag, ElMessage } from 'element-plus'
import { AnnouncementData } from '@/api/AdministrativeService/announcement/types'
import { Table } from '@/components/Table'
import { h, reactive, ref, unref, onMounted, toRefs, toRaw, nextTick } from 'vue'
import { useEmitt } from '@/hooks/web/useEmitt'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { TableColumn } from '@/types/table'
import { useTable } from '@/hooks/web/useTable'
import { isAuth } from '@/utils/is'
import FilePreview from '@/views/Components/FilePreview/FilePreview.vue'
import { getAnnouncementOrInstitution } from '@/api/AdministrativeService/announcement'
import { downloadFile } from '@/utils/index'
import moment from 'moment'
import noticeIcon from '@/assets/svgs/notice.svg'
import { LimitDailog } from '@/views/Components/limit'

defineOptions({
  name: 'CompanySystem'
})
const pageSize = ref<number>(20)
const { register, tableObject, methods } = useTable<AnnouncementData>({
  getListApi: getAnnouncementOrInstitution,
  response: {
    list: 'rows',
    total: 'total'
  },
  defaultParams: {
    pageType: 'b',
    status: '1'
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
    minWidth: '500px',
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
    field: 'updateDate',
    width: '220px',
    label: '创建时间',
    formatter: (row: Recordable) => {
      return h(
        'span',
        {
          style: 'color:#888888;font-size:13px;'
        },
        row.createDate ? '创建时间：' + moment(row.updateDate).format('YYYY-MM-DD') : '--'
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
  title: ''
})

//搜索
const setSearchParamsSub = (param: Recordable) => {
  params.title = param.title ? param.title : ''
  setSearchParams(params)
}

// 预览弹窗
const fileName = ref<string>('公司制度')
const openPreviewFile = (row: any) => {
  fileName.value = row.title
  previewFile(row.title + '.' + fileNext(row.filePath), row.filePath)
}
const previewFile = (fileName: string, path: string) => {
  FilePreviewRef.value.openDialog(fileName, path)
}
const FilePreviewRef = ref()
// 获取文件名称
const getFileName = (name: string | string[]) => {
  if (name && name.lastIndexOf('/') > -1) {
    return name.slice(name.lastIndexOf('/') + 1)
  } else {
    return ''
  }
}
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
  <ContentWrap Showtitle="公司制度">
    <Table
      v-model:pageSize="tableObject.pageSize"
      v-model:currentPage="tableObject.currentPage"
      :show-header="false"
      :page-size="pageSize"
      :is-show-filter="false"
      :columns="allSchemas.tableColumns"
      :data="tableObject.tableList"
      :loading="tableObject.loading"
      :cotentAlign="'left'"
      :selection="false"
      :stripe="true"
      @cell-click="newsCellClick"
      :pagination="{
        total: tableObject.total
      }"
      @register="register"
    >
      <template #operateBtnLeft>
        <Search
          v-if="isAuth('company:system:query')"
          :schema="allSchemas.searchSchema"
          @search="setSearchParams"
          @reset="setSearchParams"
        />
      </template>

      <template #action="{ row }">
        <ElButton
          @click="downloadFileSub(row)"
          v-if="isAuth('company:system:download') && row.filePath"
          :text="true"
          size="small"
          class="btn-default"
        >
          下载
        </ElButton>
      </template>
    </Table>
    <FilePreview :title="fileName" title-align="center" ref="FilePreviewRef" :isWhite="true" />
    <LimitDailog routerName="CompanySystem" />
  </ContentWrap>
</template>
<style lang="less">
.content-title-class {
  cursor: pointer;
  color: #001a2c;
  font-size: 15px;
}
.content-title-class:hover {
  color: #00a0e9;
}
:deep(.el-table .cell) {
  line-height: 35px !important;
}
</style>
