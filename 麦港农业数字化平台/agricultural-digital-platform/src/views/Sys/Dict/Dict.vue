<script setup lang="ts">
import { getCurrentInstance, h, reactive, ref, unref } from 'vue'
import { ElButton, ElTag, ElMessage } from 'element-plus'
import moment from 'moment'

import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Table } from '@/components/Table'
import { DictForm, DictTable } from './components/index'
import { useEmitt } from '@/hooks/web/useEmitt'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useTable } from '@/hooks/web/useTable'
// import useDictStore from '@/store/modules/appDict'
import { isAuth } from '@/utils/is'
import { TableColumn } from '@/types/table'
import { DictData, DictOptionData } from '@/api/dict/types'
import { getDictListApi, delDictListApi, exportDictListApi } from '@/api/dict'

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
    total: 'total',
    key: 'dictId'
  }
})

const { getList, setSearchParams } = methods

getList()

const dictFormRef = ref<ComponentRef<typeof DictForm>>()

const dictTableRef = ref<ComponentRef<typeof DictTable>>()

useEmitt({
  name: 'getDictList',
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
    label: '序号',
    minWidth: '60px',
    fixed: 'left',
    type: 'index'
  },

  {
    field: 'dictName',
    label: '字典名称',
    minWidth: '180px',
    search: {
      show: true,
      componentProps: {
        style: 'width:200px;' //宽度
      }
    },
    formatter: (row: Recordable) => {
      return h('span', row.dictName ? row.dictName : '--')
    }
  },
  {
    field: 'dictType',
    label: '字典类型',
    search: {
      show: true,
      componentProps: {
        style: 'width:200px;' //宽度
      }
    },
    minWidth: '180px',
    formatter: (row: Recordable, __: TableColumn, cellValue: string) => {
      return h(
        'span',
        {
          value: '1',
          style: 'color:blue;cursor:pointer;',
          onClick: () => {
            clickDictType(row)
          }
        },
        cellValue
      )
    }
  },
  {
    field: 'status',
    label: '状态',
    minWidth: '180px',
    formatter: (_: Recordable, __: TableColumn, cellValue: string) => {
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
        options: sys_normal_disable
      }
    }
  },
  {
    field: 'createTime',
    minWidth: '160px',
    label: '创建时间',
    search: {
      show: false,
      component: 'DatePicker',
      componentProps: {
        type: 'daterange'
      }
    },
    formatter: (row: Recordable) => {
      return h('span', row.createTime ? row.createTime : '--')
    }
  },
  {
    field: 'action',
    width: '240px',
    label: '操作',
    fixed: 'right'
  }
])

const clickDictType = (row: Recordable) => {
  dictTableRef.value?.openDrawer(row.dictType)
}

const { allSchemas } = useCrudSchemas(crudSchemas)

//添加
const addAction = () => {
  dictFormRef.value?.openDrawer('add')
}

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
  dictFormRef.value?.openDrawer(type, row.dictId)
}

//导出
const exportForm = async () => {
  if (tableObject.tableList.length === 0) {
    ElMessage.warning('查询无数据, 无需导出数据')
    return
  }
  exLoading.value = true
  await exportDictListApi(params)
  exLoading.value = false
}

const params = reactive<Recordable>({
  dictName: null,
  dictType: null,
  status: null,
  beginTime: null,
  endTime: null
})
const chooseListAll = ref([])
//搜索
const setSearchParamsSub = (param: Recordable) => {
  chooseListAll.value = []
  let beginTime = param.createTime ? moment(param.createTime[0]).format('YYYYMMDD') : null
  let endTime = param.createTime ? moment(param.createTime[1]).format('YYYYMMDD') : null
  params.dictName = param.dictName ? param.dictName : null
  params.dictType = param.dictType ? param.dictType : null
  params.status = param.status ? param.status : null
  params.beginTime = beginTime
  params.endTime = endTime
  setSearchParams(params)
}

/** 刷新缓存按钮操作 */
// const reLoading = ref<boolean>(false)

// const handleRefreshCache = () => {
//   reLoading.value = true
//   refreshCacheApi()
//     .then(() => {
//       ElMessage.warning('刷新成功')
//       useDictStore().cleanDict()
//     })
//     .finally(() => {
//       reLoading.value = false
//     })
// }
</script>

<template>
  <ContentWrap class="mt-7px mb-10px">
    <Search
      v-if="isAuth('system:dict:query')"
      :schema="allSchemas.searchSchema"
      :chooseListAll="chooseListAll"
      @search="setSearchParamsSub"
      @reset="setSearchParamsSub"
    />
  </ContentWrap>
  <ContentWrap>
    <Table
      v-model:pageSize="tableObject.pageSize"
      v-model:currentPage="tableObject.currentPage"
      :columns="allSchemas.tableColumns"
      :data="tableObject.tableList"
      :loading="tableObject.loading"
      :border="true"
      :chooseListAll="chooseListAll"
      :header-align="'center'"
      :align="'center'"
      :keyTable="'dictId'"
      :pagination="{
        total: tableObject.total
      }"
      @register="register"
    >
      <template #operateBtnLeft>
        <ElButton type="primary" @click="addAction" plain v-hasPermi="'system:dict:add'">
          <Icon icon="ep:plus" class="mr-5px" />新增
        </ElButton>
        <ElButton
          :loading="exLoading"
          type="primary"
          @click="exportForm()"
          plain
          v-hasPermi="'system:dict:export'"
        >
          <Icon icon="ep:bottom" class="mr-5px" />导出
        </ElButton>
        <ElButton
          :loading="delLoading"
          v-hasPermi="'system:dict:remove'"
          @click="delData(null, true)"
          class="btn-default"
        >
          <Icon icon="ep:delete" class="mr-5px" />
          删除
        </ElButton>
        <!-- <ElButton
          :loading="reLoading"
          type="danger"
          @click="handleRefreshCache()"
          plain
          v-hasPermi="'system:dict:cache'"
        >
          <Icon icon="ep:refresh" class="mr-5px" />刷新缓存
        </ElButton> -->
      </template>
      <template #action="{ row }">
        <ElButton
          type="text"
          :text="true"
          v-hasPermi="'system:dict:remove'"
          @click="clickDictType(row)"
        >
          添加属性
        </ElButton>
        <ElButton
          type="text"
          @click="action(row, 'edit')"
          :text="true"
          v-hasPermi="'system:dict:edit'"
        >
          编辑
        </ElButton>
        <!-- <ElButton type="success" @click="action(row, 'see')" :text="true">
          <Icon icon="ep:warning" class="mr-5px" />详情
        </ElButton> -->
        <ElButton
          type="text"
          @click="delData(row, false)"
          :text="true"
          v-hasPermi="'system:dict:remove'"
        >
          删除
        </ElButton>
      </template>
    </Table>
  </ContentWrap>

  <DictForm title="字典" ref="dictFormRef" @get-dict-list="getList()" />

  <DictTable ref="dictTableRef" />
</template>
