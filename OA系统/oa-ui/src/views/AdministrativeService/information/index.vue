<script setup lang="ts">
import { rewardPunForm } from './components/index'
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { ElButton, ElMessageBox, ElTag, ElMessage } from 'element-plus'
import { Table } from '@/components/Table'
import { getInfoBonuspenaltListApi, delInfoBonuspenaltListApi } from '@/api/person/rewardPunManage'
import { useTable } from '@/hooks/web/useTable'
// import { any, DictTypeData, DictOptionData } from '@/api/dict/types'
import { getCurrentInstance, h, reactive, ref, unref } from 'vue'
import { useEmitt } from '@/hooks/web/useEmitt'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { TableColumn } from '@/types/table'
import moment from 'moment'
import useDictStore from '@/store/modules/appDict'
import { isAuth } from '@/utils/is'
import {
  delCompanyInformationApi,
  getCompanyInformationListApi
} from '@/api/AdministrativeService/information'
import { downloadFile } from '@/utils/index'
import { LimitDailog } from '@/views/Components/limit'

defineOptions({
  name: 'Information'
})

const { proxy } = getCurrentInstance() as any
const { com_info_types } = proxy.useDict('com_info_types')

// 项目类型
const projectType = reactive<any>([
  {
    label: '军工',
    value: '1'
  },
  {
    label: '铁路',
    value: '2'
  },
  {
    label: '农业',
    value: '3'
  },
  {
    label: '其他',
    value: '4'
  }
])
const getElTagLabel = (value: string): string => {
  let label = ''
  unref(com_info_types).map((item) => {
    if (value === item.value) {
      label = item.label
    }
  })
  return label
}

// 获取文件名称
const getFileName = (name: any) => {
  if (name.lastIndexOf('/') > -1) {
    return name.slice(name.lastIndexOf('/') + 1)
  } else {
    return ''
  }
}
const { register, tableObject, methods } = useTable<any>({
  getListApi: getCompanyInformationListApi,
  delListApi: delCompanyInformationApi,
  response: {
    list: 'rows',
    total: 'total'
  }
})

const { getList, setSearchParams } = methods

getList()

const rewardPunFormRef = ref<ComponentRef<typeof rewardPunForm>>()

const getUserLabel = (value: string, arr): string => {
  let label = ''
  unref(com_info_types).map((item: any) => {
    if (value == item.value) {
      label = item.label
    }
  })
  return label
}
// const dictTableRef = ref<ComponentRef<typeof DictTable>>()

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
    field: 'id',
    label: '序号',
    minWidth: '60px'
  },
  {
    field: 'title',
    label: '标题',
    minWidth: '300px',
    search: {
      show: true,
      componentProps: {
        maxlength: 200,
        style: 'width: 196px',
        placeholder: '请输入标题'
      }
    }
  },
  {
    field: 'type',
    label: '类型',
    minWidth: '80px',
    formatter: (row: Recordable) => {
      return h('span', row.type ? getUserLabel(row.type) : '--')
    },
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        style: 'width: 196px',
        options: com_info_types,
        placeholder: '类型筛选',
        filterable: true
      }
    }
  },
  {
    field: 'createByName',
    label: '发布人',
    minWidth: '180px',
    formatter: (row: any) => {
      return h('span', row.createByName ? row.createByName : '--')
    }
  },
  {
    field: 'createTime',
    minWidth: '160px',
    label: '发布时间',
    formatter: (row: any) => {
      return h('span', row.createTime ? row.createTime : '--')
    }
  },

  {
    field: 'action',
    showOverflowTooltip: false,
    minWidth: '180px',
    label: '操作'
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)

//删除加载
const delLoading = ref(false)

//导出加载
const exLoading = ref(false)

//删除
const delData = async (row: any | null, multiple: boolean) => {
  tableObject.currentRow = row
  const { delList, getSelections } = methods
  const selections = await getSelections()
  delLoading.value = true
  await delList(
    multiple ? selections.map((v) => v.id) : [tableObject.currentRow?.id as string],
    multiple
  ).finally(() => {
    delLoading.value = false
  })
}

//table操作栏按钮事件
const action = (row: any, type: string) => {
  if (row) {
    rewardPunFormRef.value.openDrawer(type, row)
  } else {
    rewardPunFormRef.value.openDrawer(type)
  }
}

const params = reactive<any>({
  title: '',
  type: ''
})

//搜索
const setSearchParamsSub = (param: any) => {
  params.title = param.title ? param.title : ''
  params.type = param.type ? param.type : ''
  setSearchParams(params)
}

// 是否显示筛选窗口
const isShowCell = ref(false)

// 筛选列
const showCell = () => {
  isShowCell.value = !isShowCell.value
}

// 下载
const download = (row) => {
  const blob = new Blob([row.filePath], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  })
  const a = document.createElement('a')
  a.download = row.fileName ? row.fileName : '' + '公司资料.xlsx'
  a.href = window.URL.createObjectURL(blob)
  a.click()
}
</script>

<template>
  <ContentWrap Showtitle="公司资料">
    <template #ContentWrapTitle>
      <div>
        <ElButton
          class="btn-add"
          v-if="isAuth('AdministrativeService:information:add')"
          @click="action(null, 'add')"
          plain
        >
          <template #icon>
            <Icon :size="14" icon="svg-icon:addBut" />
          </template>
          新增
        </ElButton>
        <ElButton
          :loading="delLoading"
          v-if="isAuth('AdministrativeService:information:batchDel')"
          class="btn-other"
          @click="delData(null, true)"
          plain
        >
          <template #icon>
            <Icon :size="14" icon="svg-icon:deleteBut" />
          </template>
          批量删除
        </ElButton>
      </div>
    </template>

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
      :isShowCell="isShowCell"
      @register="register"
    >
      <template #id="{ $index }">
        <span>
          {{ $index + 1 + tableObject.pageSize * (tableObject.currentPage - 1) }}
        </span>
      </template>
      <template #operateBtnLeft>
        <Search
          v-if="isAuth('AdministrativeService:information:query')"
          :schema="allSchemas.searchSchema"
          @search="setSearchParamsSub"
          @reset="setSearchParamsSub"
        />
      </template>
      <template #action="{ row }">
        <ElButton
          @click="action(row, 'edit')"
          :text="true"
          class="btn-default"
          v-if="isAuth('AdministrativeService:information:edit')"
          >编辑
        </ElButton>
        <ElButton
          class="btn-default"
          @click="delData(row, false)"
          :text="true"
          size="small"
          v-if="isAuth('AdministrativeService:information:del')"
          >删除
        </ElButton>
        <ElButton
          class="btn-default"
          @click="downloadFile(row.filePath, getFileName(row.filePath))"
          :text="true"
          size="small"
          v-if="isAuth('AdministrativeService:information:download') && row.filePath"
          >下载
        </ElButton>
      </template>
    </Table>
    <rewardPunForm title="公司资料" ref="rewardPunFormRef" />
    <LimitDailog routerName="information" />
  </ContentWrap>
</template>
<style lang="less" scoped>
:deep(.el-loading-mask) {
  top: 0px !important;
  width: 100% !important;
  left: 0px !important;
}
</style>
