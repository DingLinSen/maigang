<script setup lang="ts">
import { DictForm, DictTable } from './components/index'
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { ElButton, ElMessageBox, ElTag, ElMessage } from 'element-plus'
import { Table } from '@/components/Table'
import { getDictListApi, delDictListApi, refreshCacheApi, exportDictListApi } from '@/api/dict'
import { useTable } from '@/hooks/web/useTable'
import { DictData, DictTypeData, DictOptionData } from '@/api/dict/types'
import { getCurrentInstance, h, reactive, ref, unref } from 'vue'
import { useEmitt } from '@/hooks/web/useEmitt'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { TableColumn } from '@/types/table'
import moment from 'moment'
import useDictStore from '@/store/modules/appDict'
import { isAuth } from '@/utils/is'

defineOptions({
  name: 'Dict'
})

const { proxy } = getCurrentInstance() as any
const { sys_normal_disable } = proxy.useDict('sys_normal_disable')

const getElTagLabel = (value: string): string => {
  let label = ''
  unref(sys_normal_disable).map((item: DictOptionData) => {
    if (value === item.value) {
      label = item.label
    }
  })
  return label
}

const { register, tableObject, methods } = useTable<DictData>({
  getListApi: getDictListApi,
  delListApi: delDictListApi,
  response: {
    list: 'rows',
    total: 'total'
  }
})

const { getList, setSearchParams } = methods

getList()

const dictFormRef = ref<any>()

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
    field: 'dictId',
    label: '姓名',
    minWidth: '180px',
    search: {
      show: true,
      componentProps: {
        style: 'width: 196px',
        placeholder: '请输入姓名'
      }
    }
  },
  {
    field: 'dictName',
    label: '部门',
    minWidth: '180px',
    formatter: (row: any) => {
      return h('span', row.dictName ? row.dictName : '--')
    }
  },
  {
    field: 'createTime',
    minWidth: '160px',
    label: '入职时间',
    formatter: (row: any) => {
      return h('span', row.createTime ? row.createTime : '--')
    }
  },
  {
    field: 'status',
    label: '状态',
    minWidth: '180px',
    formatter: (row: any, __: TableColumn, cellValue: string) => {
      let label: string = getElTagLabel(cellValue)
      return h(
        ElTag,
        {
          type: cellValue === '0' ? '' : 'danger'
        },
        () => label
      )
    },
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        style: 'width: 196px',
        options: sys_normal_disable,
        placeholder: '状态筛选'
      }
    }
  },
  {
    field: 'action',
    showOverflowTooltip: false,
    minWidth: '140px',
    label: '操作'
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)

//删除加载
const delLoading = ref(false)

//导出加载
const exLoading = ref(false)

//删除
const delData = async (row: DictData | null, multiple: boolean) => {
  tableObject.currentRow = row
  const { delList, getSelections } = methods
  const selections = await getSelections()
  delLoading.value = true
  await delList(
    multiple ? selections.map((v) => v.dictId) : [tableObject.currentRow?.dictId as string],
    multiple
  ).finally(() => {
    delLoading.value = false
  })
}

//table操作栏按钮事件
const action = (row: DictData, type: string) => {
  dictFormRef.value.openDrawer(type, row.dictId)
}

const params = reactive<any>({
  dictName: '',
  dictType: '',
  status: '',
  beginTime: '',
  endTime: ''
})

//搜索
const setSearchParamsSub = (param: any) => {
  let beginTime = param.createTime ? moment(param.createTime[0]).format('YYYYMMDD') : ''
  let endTime = param.createTime ? moment(param.createTime[1]).format('YYYYMMDD') : ''
  params.dictName = param.dictName ? param.dictName : ''
  params.dictType = param.dictType ? param.dictType : ''
  params.status = param.status ? param.status : ''
  params.beginTime = beginTime
  params.endTime = endTime
  setSearchParams(params)
}

// 是否显示筛选窗口
const isShowCell = ref(false)

/** 刷新缓存按钮操作 */
const reLoading = ref<boolean>(false)

const handleRefreshCache = () => {
  reLoading.value = true
  refreshCacheApi()
    .then(() => {
      ElMessage.warning('刷新成功')
      useDictStore().cleanDict()
    })
    .finally(() => {
      reLoading.value = false
    })
}
</script>

<template>
  <ContentWrap>
    <template #ContentWrapTitle>
      <div>
        <ElButton
          :loading="reLoading"
          class="btn-other"
          @click="handleRefreshCache()"
          plain
          v-hasPermi="'system:dict:cache'"
        >
          <Icon icon="ep:refresh" class="mr-5px" />刷新缓存
        </ElButton></div
      >
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
      <template #operateBtnLeft>
        <Search
          v-if="isAuth('system:dict:query')"
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
          v-hasPermi="'system:dict:edit'"
        >
          详情
        </ElButton>
        <!-- <ElButton type="success" @click="action(row, 'see')" :text="true">
          <Icon icon="ep:warning" class="mr-5px" />详情
        </ElButton> -->
        <ElButton
          class="btn-default"
          @click="delData(row, false)"
          :text="true"
          size="small"
          v-hasPermi="'system:dict:remove'"
        >
          导出
        </ElButton>
      </template>
    </Table>
  </ContentWrap>
</template>
<style lang="less" scoped>
:deep(.el-loading-mask) {
  top: 0px !important;
  width: 100% !important;
  left: 0px !important;
}
</style>
