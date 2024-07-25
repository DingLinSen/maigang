<!-- 行业知识 -->
<script lang="ts" setup>
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { ElButton, ElMessageBox, ElMessage } from 'element-plus'
import { Table } from '@/components/Table'
import { getKnowledgeListApi, delKnowledgeListApi } from '@/api/school/industry'
import { useTable } from '@/hooks/web/useTable'
import { getCurrentInstance, h, reactive, ref, unref, provide, onMounted } from 'vue'
import { useEmitt } from '@/hooks/web/useEmitt'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { TableColumn } from '@/types/table'
import moment from 'moment'
import { isAuth } from '@/utils/is'
import { DetailsDialog } from '@/views/Components/Details'
import { downloadFile } from '@/utils/index'
import { KnowledgeForm } from './Form'
import { useCache } from '@/hooks/web/useCache'
import { AddStudyRecordApi } from '@/api/school/course'
import { LimitDailog } from '@/views/Components/limit'

defineOptions({
  name: 'IndustryKnowledge'
})
const { proxy } = getCurrentInstance() as any
const { com_info_types } = proxy.useDict('com_info_types')
provide('com_info_types', com_info_types)
const { wsCache } = useCache()
const loginUserId = ref<string>(wsCache.get('userInfo').userId) // 登录用户id

const { register, tableObject, methods } = useTable<any>({
  getListApi: getKnowledgeListApi,
  delListApi: delKnowledgeListApi,
  response: {
    list: 'rows',
    total: 'total'
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
    field: 'index',
    label: '序号',
    minWidth: '60px',
    formatter: (row: Recordable, __: TableColumn, cellValue: string, index: number) => {
      let itemIndex = index + 1 + tableObject.pageSize * (tableObject.currentPage - 1)
      return h('span', itemIndex)
    }
  },
  {
    field: 'title',
    label: '标题',
    minWidth: '280px',
    search: {
      show: true,
      componentProps: {
        maxlength: 200,
        style: 'width: 196px',
        placeholder: '标题筛选'
      }
    },
    formatter: (row: Recordable) => {
      return h(
        'span',
        {
          style: 'cursor:pointer;color: #00a0e9;',
          onClick: () => {
            openPreviewFile(row)
          }
        },
        row.title ? row.title : '--'
      )
    }
  },
  {
    field: 'type',
    label: '类型',
    minWidth: '130px',
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
      return h('span', getElTagLabel(cellValue) || '--')
    }
  },
  {
    field: 'createByName',
    label: '发布人',
    minWidth: '120px',
    formatter: (row: Recordable) => {
      return h('span', row.createByName ? row.createByName : '--')
    }
  },
  {
    field: 'createTime',
    minWidth: '180px',
    label: '发布时间',
    formatter: (row: Recordable) => {
      return h('span', row.createTime ? row.createTime : '--')
    }
  },
  {
    field: 'action',
    showOverflowTooltip: false,
    minWidth: '180px',
    fixed: 'right',
    label: '操作'
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)

//删除加载
const delLoading = ref(false)

//删除
const delData = async (row: any | null, multiple: boolean) => {
  tableObject.currentRow = row
  const { delList, getSelections } = methods
  const selections = await getSelections()
  delLoading.value = true
  await delList(
    multiple ? selections.map((v) => v.id) : [tableObject.currentRow?.id as string],
    multiple,
    true,
    true
  ).finally(() => {
    delLoading.value = false
  })
}

const knowledgeFormRef = ref()
//table操作栏按钮事件
const action = (row: any, type: string) => {
  if (row) {
    knowledgeFormRef.value.openDrawer(type, row.id)
  } else {
    knowledgeFormRef.value.openDrawer(type, '')
  }
}

const params = reactive<Recordable>({
  title: '',
  type: ''
})

//搜索
const setSearchParamsSub = (param: Recordable) => {
  console.log(param)
  params.title = param.title ? param.title : ''
  params.type = param.type ? param.type : ''
  setSearchParams(params)
}

// 预览弹窗
const title = ref<string>('')
const content = ref<string>('')
const type = ref<string>('')
const fileUrl = ref<string>('')
const openPreviewFile = (row: any) => {
  AddStudyRecordApi({
    actionType: 0,
    moduleName: '行业知识',
    targetName: row.title
  })
  title.value = row.title
  fileUrl.value = row.filePath
  content.value = row.describeInfo
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
  AddStudyRecordApi({
    actionType: 1,
    moduleName: '行业知识',
    targetName: row.title
  })
  downloadFile(row.filePath, row.title + '.' + fileNext(row.filePath))
}
</script>

<template>
  <ContentWrap Showtitle="行业知识">
    <template #ContentWrapTitle>
      <div>
        <ElButton
          v-hasPermi="'school:knowledge:add'"
          class="btn-add"
          plain
          @click="action(null, 'add')"
        >
          <template #icon>
            <Icon :size="14" icon="svg-icon:addBut" />
          </template>
          新增
        </ElButton>
        <ElButton
          v-hasPermi="'school:knowledge:remove'"
          :loading="delLoading"
          class="btn-other"
          plain
          @click="delData(null, true)"
        >
          <template #icon>
            <Icon :size="14" icon="svg-icon:deleteBut" />
          </template>
          删除
        </ElButton>
      </div>
    </template>

    <Table
      v-model:currentPage="tableObject.currentPage"
      v-model:pageSize="tableObject.pageSize"
      :border="true"
      :columns="allSchemas.tableColumns"
      :cotentAlign="'center'"
      :data="tableObject.tableList"
      :header-align="'center'"
      :loading="tableObject.loading"
      :pagination="{
        total: tableObject.total
      }"
      @register="register"
    >
      <template #operateBtnLeft>
        <Search
          v-if="isAuth('school:knowledge:query')"
          :schema="allSchemas.searchSchema"
          @reset="setSearchParamsSub"
          @search="setSearchParamsSub"
        />
      </template>

      <template #action="{ row }">
        <ElButton
          v-if="isAuth('school:knowledge:edit') && row.roleAuth"
          :text="true"
          class="btn-default"
          @click="action(row, 'edit')"
        >
          编辑
        </ElButton>
        <ElButton
          v-if="isAuth('school:knowledge:remove') && row.roleAuth"
          :text="true"
          class="btn-default"
          @click="delData(row, false)"
        >
          删除
        </ElButton>
        <ElButton
          v-if="isAuth('school:knowledge:download') && row.filePath"
          :text="true"
          class="btn-default"
          @click="downloadFileSub(row)"
        >
          下载
        </ElButton>
      </template>
    </Table>
  </ContentWrap>
  <KnowledgeForm ref="knowledgeFormRef" title="行业知识" />

  <DetailsDialog
    ref="detailsDialogRef"
    :content="content"
    :title="title"
    :type="type"
    :url="fileUrl"
  />
  <LimitDailog routerName="IndustryKnowledge" />
</template>
<style lang="less" scoped>
:deep(.el-loading-mask) {
  top: 0px !important;
  width: 100% !important;
  left: 0px !important;
}

:deep(.el-table .cell) {
  line-height: 35px !important;
}
</style>
