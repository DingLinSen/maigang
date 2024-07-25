<script setup lang="ts">
import { NoticeForm } from './components/index'
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { ElButton, ElMessageBox, ElTag, ElMessage } from 'element-plus'
import { Table } from '@/components/Table'
import { getNoticeListApi, delNoticeListApi } from '@/api/notice'
import { useTable } from '@/hooks/web/useTable'
import { NoticeData } from '@/api/notice/types'
import { getCurrentInstance, h, reactive, ref, unref } from 'vue'
import { useEmitt } from '@/hooks/web/useEmitt'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { TableColumn } from '@/types/table'
import { isAuth } from '@/utils/is'

defineOptions({
  name: 'Notice'
})

const { proxy } = getCurrentInstance() as any
const { sys_normal_disable, sys_notice_type } = proxy.useDict(
  'sys_normal_disable',
  'sys_notice_type'
)

const getElTagLabel = (value: string): string => {
  let label = ''
  unref(sys_normal_disable).map((item: any) => {
    if (value === item.value) {
      label = item.label
    }
  })
  return label
}

const getTypeElTagLabel = (value: string): string => {
  let label = ''
  unref(sys_notice_type).map((item: any) => {
    if (value === item.value) {
      label = item.label
    }
  })
  return label
}

const getTypeElTagType = (value: string): string => {
  let label = ''
  unref(sys_notice_type).map((item: any) => {
    if (value === item.value) {
      label = item.elTagType
    }
  })
  return label
}

const { register, tableObject, methods } = useTable<NoticeData>({
  getListApi: getNoticeListApi,
  delListApi: delNoticeListApi,
  response: {
    list: 'rows',
    total: 'total'
  }
})

const { getList, setSearchParams } = methods

getList()

const noticeFormRef = ref<ComponentRef<typeof NoticeForm>>()

useEmitt({
  name: 'getList',
  callback: (type: string) => {
    if (type === 'add') {
      tableObject.currentPage = 1
    }
    getList()
  }
})

const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'index',
    headerAlign: 'center',
    align: 'center',
    label: '序号',
    minWidth: '60px',
    formatter: (row: Recordable, __: TableColumn, cellValue: string, index: number) => {
      let itemIndex = index + 1 + tableObject.pageSize * (tableObject.currentPage - 1)
      return h('span', itemIndex)
    }
  },
  {
    field: 'noticeTitle',
    headerAlign: 'center',
    align: 'center',
    label: '公告标题',
    search: {
      show: true,
      componentProps: {
        style: 'width: 196px',
        placeholder: '公告标题筛选'
      }
    },
    minWidth: '350px',
    formatter: (row: Recordable) => {
      return h('span', row.noticeTitle ? row.noticeTitle : '--')
    }
  },
  {
    field: 'noticeType',
    headerAlign: 'center',
    align: 'center',
    label: '公告类型',
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        style: 'width: 196px',
        options: sys_notice_type,
        placeholder: '公告类型筛选'
      }
    },
    formatter: (row: Recordable, __: TableColumn, cellValue: string) => {
      let listClass = getTypeElTagType(cellValue)
      return h(
        ElTag,
        {
          type:
            listClass === 'success'
              ? 'success'
              : listClass === 'warning'
              ? 'warning'
              : listClass === 'info'
              ? 'info'
              : listClass === 'danger'
              ? 'danger'
              : ''
        },
        () => getTypeElTagLabel(cellValue)
      )
    },
    minWidth: '80px'
  },
  {
    field: 'status',
    headerAlign: 'center',
    align: 'center',
    label: '状态',
    minWidth: '80px',
    formatter: (row: Recordable, __: TableColumn, cellValue: string) => {
      return h(
        ElTag,
        {
          type: cellValue === '0' ? '' : 'danger'
        },
        () => getElTagLabel(cellValue)
      )
    }
  },
  {
    field: 'createBy',
    headerAlign: 'center',
    align: 'center',
    minWidth: '80px',
    search: {
      show: true,
      componentProps: {
        style: 'width: 196px',
        placeholder: '创建者筛选'
      }
    },
    label: '创建者',
    formatter: (row: Recordable) => {
      return h('span', row.createBy ? row.createBy : '--')
    }
  },
  {
    field: 'createTime',
    headerAlign: 'center',
    align: 'center',
    minWidth: '180px',
    label: '创建时间',
    formatter: (row: Recordable) => {
      return h('span', row.createTime ? row.createTime : '--')
    }
  },
  {
    field: 'action',
    showOverflowTooltip: false,
    headerAlign: 'center',
    align: 'center',
    width: '160px',
    fixed: 'right',
    label: '操作'
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)

//添加
const AddAction = () => {
  noticeFormRef.value.openDrawer('add')
}

//删除加载
const delLoading = ref(false)

//导出加载
const exLoading = ref(false)

//删除
const delData = async (row: NoticeData | null, multiple: boolean) => {
  tableObject.currentRow = row
  const { delList, getSelections } = methods
  const selections = await getSelections()
  delLoading.value = true
  await delList(
    multiple ? selections.map((v) => v.noticeId) : [tableObject.currentRow?.noticeId as string],
    multiple
  ).finally(() => {
    delLoading.value = false
  })
}

//table操作栏按钮事件
const action = (row: NoticeData, type: string) => {
  noticeFormRef.value.openDrawer(type, row.noticeId)
}

// 是否显示筛选窗口
const isShowCell = ref(false)

// 筛选列
const showCell = () => {
  isShowCell.value = !isShowCell.value
}
</script>

<template>
  <ContentWrap Showtitle="通知公告">
    <template #ContentWrapTitle>
      <div>
        <ElButton class="btn-add" @click="AddAction" plain v-hasPermi="'system:notice:add'">
          <template #icon>
            <Icon :size="14" icon="svg-icon:addBut" />
          </template>
          新增
        </ElButton>
        <ElButton
          :loading="delLoading"
          class="btn-other"
          @click="delData(null, true)"
          plain
          v-hasPermi="'system:notice:remove'"
        >
          <template #icon>
            <Icon :size="14" icon="svg-icon:deleteBut" />
          </template>
          删除
        </ElButton>
      </div></template
    >
    <Table
      v-model:pageSize="tableObject.pageSize"
      v-model:currentPage="tableObject.currentPage"
      :columns="allSchemas.tableColumns"
      :data="tableObject.tableList"
      :loading="tableObject.loading"
      :border="true"
      :isShowCell="isShowCell"
      :header-align="'center'"
      :cotentAlign="'center'"
      :pagination="{
        total: tableObject.total
      }"
      @register="register"
    >
      <template #operateBtnLeft>
        <Search
          v-if="isAuth('system:notice:query')"
          :schema="allSchemas.searchSchema"
          @search="setSearchParams"
          @reset="setSearchParams"
        />
      </template>
      <template #action="{ row }">
        <ElButton
          class="btn-default"
          type="primary"
          @click="action(row, 'edit')"
          :text="true"
          size="small"
          v-hasPermi="'system:notice:edit'"
        >
          编辑
        </ElButton>

        <ElButton
          class="btn-default"
          type="danger"
          @click="delData(row, false)"
          :text="true"
          size="small"
          v-hasPermi="'system:notice:remove'"
        >
          删除
        </ElButton>
      </template>
    </Table>
  </ContentWrap>

  <NoticeForm title="通知公告" ref="noticeFormRef" />
</template>
