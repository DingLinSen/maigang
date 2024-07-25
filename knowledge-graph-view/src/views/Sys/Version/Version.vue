<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { ElButton, ElMessageBox, ElTag, ElMessage } from 'element-plus'
import { Table } from '@/components/Table'
import { getVersionListApi, delVersionListApi, updateStatusApi } from '@/api/version'
import { useTable } from '@/hooks/web/useTable'
import { VersionInfo } from '@/api/version/types'
import { h, nextTick, reactive, ref, unref } from 'vue'
import { useEmitt } from '@/hooks/web/useEmitt'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { TableColumn } from '@/types/table'
import { isAuth } from '@/utils/is'
import { VersionForm, VersionDailog } from './form'

defineOptions({
  name: 'VersionManage'
})

const { register, tableObject, methods } = useTable<VersionInfo>({
  getListApi: getVersionListApi,
  delListApi: delVersionListApi,
  response: {
    list: 'rows',
    total: 'total'
  },
  defaultParams: {
    status: isAuth('version:version:add') ? '' : '1'
  }
})

const { getList, setSearchParams } = methods

getList()

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
    field: 'versionNumber',
    headerAlign: 'center',
    align: 'center',
    label: '版本号',
    minWidth: '120px',
    formatter: (row: Recordable) => {
      return h('span', row.versionNumber ? row.versionNumber : '--')
    }
  },
  {
    field: 'status',
    headerAlign: 'center',
    align: 'center',
    label: '状态',
    minWidth: '120px',
    formatter: (row: Recordable, __: TableColumn, cellValue: string) => {
      return h(
        ElTag,
        {
          type:
            cellValue === '0'
              ? ''
              : cellValue === '1'
              ? 'success'
              : cellValue === '2'
              ? 'danger'
              : ''
        },
        () =>
          cellValue === '0'
            ? '未发布'
            : cellValue === '1'
            ? '已发布'
            : cellValue === '2'
            ? '已撤回'
            : '--'
      )
    }
  },
  {
    field: 'publishTime',
    headerAlign: 'center',
    align: 'center',
    label: '发版时间',
    minWidth: '150px',
    formatter: (row: Recordable, __: TableColumn, cellValue: string) => {
      return h('span', row.publishTime ? row.publishTime : '--')
    }
  },
  {
    field: 'createTime',
    headerAlign: 'center',
    align: 'center',
    minWidth: '150px',
    label: '创建时间',
    table: {
      show: isAuth('version:version:add')
    },
    formatter: (row: Recordable) => {
      return h('span', row.createTime ? row.createTime : '--')
    }
  },
  {
    field: 'createByName',
    headerAlign: 'center',
    align: 'center',
    minWidth: '150px',
    label: '创建者',
    formatter: (row: Recordable) => {
      return h('span', row.createByName ? row.createByName : '--')
    }
  },
  {
    field: 'action',
    showOverflowTooltip: false,
    headerAlign: 'center',
    align: 'center',
    minWidth: isAuth('version:version:add') ? '230px' : '100px',
    fixed: 'right',
    label: '操作'
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)

const versionFormRef = ref<ComponentRef<typeof VersionForm>>()
//添加
const AddAction = () => {
  versionFormRef.value.openDrawer('add')
}

//删除加载
const delLoading = ref(false)

//导出加载
const exLoading = ref(false)

//删除
const delData = async (row: VersionInfo | null, multiple: boolean) => {
  tableObject.currentRow = row
  const { delList, getSelections } = methods
  const selections = await getSelections()
  delLoading.value = true
  await delList(
    multiple ? selections.map((v) => v.id) : [String(tableObject.currentRow?.id)],
    multiple
  ).finally(() => {
    delLoading.value = false
  })
}

//table操作栏按钮事件
const versionContent = ref<any>()
const versionDailogRef = ref()
const action = (row: VersionInfo, type: string) => {
  if (type == 'see') {
    versionContent.value = row
    versionDailogRef.value.openDrawer()
  } else {
    versionFormRef.value.openDrawer(type, row.id)
  }
}

//发布和撤回
const update = (row: VersionInfo, type: string) => {
  let message = '确定发布选中的版本信息？'
  let title = '确认发布版本操作'
  if (type == 'return') {
    message = '确定撤回选中的版本信息？'
    title = '确认撤回版本操作'
  }
  ElMessageBox.confirm(message, title, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    autofocus: false
  }).then(async () => {
    const params = {
      status: type == 'return' ? '0' : '1',
      id: row.id
    }
    const res = await updateStatusApi(params)
    if (res) {
      nextTick()
      if (type == 'return') {
        ElMessage.success('成功撤回版本信息')
      } else {
        ElMessage.success('成功发布版本信息')
      }
      tableObject.currentPage = 1
      getList()
    }
  })
}

// 是否显示筛选窗口
const isShowCell = ref(false)

// 筛选列
const showCell = () => {
  isShowCell.value = !isShowCell.value
}
</script>

<template>
  <ContentWrap Showtitle="版本说明">
    <template #ContentWrapTitle>
      <div>
        <ElButton class="no-bg-button" @click="AddAction" plain v-hasPermi="'version:version:add'">
          <template #icon>
            <Icon :size="14" icon="svg-icon:addBut" />
          </template>
          新增
        </ElButton>
      </div>
    </template>
    <Table
      :isShowFilter="false"
      :isShowSearch="false"
      v-model:pageSize="tableObject.pageSize"
      v-model:currentPage="tableObject.currentPage"
      :columns="allSchemas.tableColumns"
      :data="tableObject.tableList"
      :loading="tableObject.loading"
      :border="false"
      :isShowCell="isShowCell"
      :header-align="'center'"
      :cotentAlign="'center'"
      :pagination="{
        total: tableObject.total
      }"
      @register="register"
    >
      <!-- <template #operateBtnLeft>
        <Search
          v-if="isAuth('system:notice:query')"
          :schema="allSchemas.searchSchema"
          @search="setSearchParams"
          @reset="setSearchParams"
        />
      </template> -->
      <template #action="{ row }">
        <ElButton
          class="btn-default"
          type="primary"
          @click="action(row, 'edit')"
          :text="true"
          size="small"
          v-if="isAuth('version:version:edit') && (row.status == '2' || row.status == '0')"
        >
          编辑
        </ElButton>
        <ElButton
          class="btn-default"
          type="danger"
          @click="update(row, 'publish')"
          :text="true"
          size="small"
          v-if="isAuth('version:version:publish') && (row.status == '0' || row.status == '2')"
        >
          发布
        </ElButton>
        <ElButton
          class="btn-default"
          type="danger"
          @click="delData(row, false)"
          :text="true"
          size="small"
          v-if="isAuth('version:version:delete') && (row.status == '0' || row.status == '2')"
        >
          删除
        </ElButton>

        <ElButton
          class="btn-default"
          type="danger"
          @click="update(row, 'return')"
          :text="true"
          size="small"
          v-if="isAuth('version:version:return') && row.status == '1'"
        >
          撤回
        </ElButton>

        <ElButton
          class="btn-default"
          type="primary"
          @click="action(row, 'see')"
          :text="true"
          size="small"
        >
          详情
        </ElButton>
      </template>
    </Table>
  </ContentWrap>
  <VersionForm title="版本说明" ref="versionFormRef" />
  <VersionDailog title="版本说明详情" :content="versionContent" ref="versionDailogRef" />
</template>
