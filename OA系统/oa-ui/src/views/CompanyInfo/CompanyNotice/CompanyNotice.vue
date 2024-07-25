<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { ElButton, ElMessageBox, ElSwitch, ElDrawer, ElTag, ElMessage } from 'element-plus'
import { useTable } from '@/hooks/web/useTable'
import { Table } from '@/components/Table'
import { h, reactive, ref, unref, onMounted, toRefs, toRaw, nextTick, watch } from 'vue'
import { useEmitt } from '@/hooks/web/useEmitt'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { TableColumn } from '@/types/table'
import { isAuth } from '@/utils/is'
import FilePreview from '@/views/Components/FilePreview/FilePreview.vue'
import {
  getAnnouncementOrInstitution,
  getDetailAnnouncementOrInstitution
} from '@/api/AdministrativeService/announcement'
import { DetailsDialog } from '@/views/Components/Details'
import moment from 'moment'
import noticeIcon from '@/assets/svgs/notice.svg'
import { LimitDailog } from '@/views/Components/limit'
import { useRoute, useRouter } from 'vue-router'

defineOptions({
  name: 'CompanyNotice'
})

const route = useRoute()
const router = useRouter()

useEmitt({
  name: 'companyNotice',
  callback: (type: string) => {
    showDetail(type)
  }
})

const pageSize = ref<number>(20)
const { register, tableObject, methods } = useTable({
  getListApi: getAnnouncementOrInstitution,
  response: {
    list: 'rows',
    total: 'total'
  },
  defaultParams: {
    pageType: 'a',
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
    label: '发布时间',
    formatter: (row: Recordable) => {
      return h(
        'span',
        {
          style: 'color:#888888;font-size:13px;'
        },
        row.createDate ? '发布时间：' + moment(row.updateDate).format('YYYY-MM-DD') : '--'
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

const showDetail = async (noticeId: string) => {
  if (!noticeId) {
    return
  }
  let params = {
    id: noticeId
  }
  const res = await getDetailAnnouncementOrInstitution(params)
  if (res && res.data) {
    openPreviewFile(res.data)
  }
}

watch(
  () => history.state,
  () => {
    if (route.name == 'CompanyNotice') {
      let id: string = history.state.id as string
      if (id) {
        showDetail(id)
      }
      history.state.id = ''
    }
  },
  { immediate: true, deep: true }
)
</script>

<template>
  <ContentWrap Showtitle="公司公告">
    <Table
      v-model:pageSize="tableObject.pageSize"
      v-model:currentPage="tableObject.currentPage"
      :show-header="false"
      :page-size="pageSize"
      :is-show-filter="false"
      :highlight-current-row="true"
      :columns="allSchemas.tableColumns"
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
          v-if="isAuth('company:notice:query')"
          :schema="allSchemas.searchSchema"
          @search="setSearchParams"
          @reset="setSearchParams"
        />
      </template>
    </Table>
    <LimitDailog routerName="CompanyNotice" />
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
