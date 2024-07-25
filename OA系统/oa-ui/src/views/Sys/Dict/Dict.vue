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

const dictFormRef = ref<ComponentRef<typeof DictForm>>()

const dictTableRef = ref<ComponentRef<typeof DictTable>>()

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
    label: '字典编号',
    minWidth: '60px'
  },

  {
    field: 'dictName',
    label: '字典名称',
    minWidth: '180px',
    search: {
      show: true,
      componentProps: {
        placeholder: '字典名称筛选',
        style: 'width: 10vw'
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
        placeholder: '字典类型筛选',
        style: 'width: 10vw'
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
    minWidth: '80px',
    formatter: (row: Recordable, __: TableColumn, cellValue: string) => {
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
        options: sys_normal_disable,
        placeholder: '状态筛选',
        style: 'width: 10vw'
      }
    }
  },
  {
    field: 'createTime',
    minWidth: '160px',
    label: '创建时间',
    search: {
      show: true,
      component: 'DatePicker',
      componentProps: {
        type: 'daterange',
        startPlaceholder: '创建开始时间',
        endPlaceholder: '创建结束时间',
        style: 'width: 15vw'
      }
    },
    formatter: (row: Recordable) => {
      return h('span', row.createTime ? row.createTime : '--')
    }
  },
  {
    field: 'action',
    showOverflowTooltip: false,
    width: '160px',
    fixed: 'right',
    label: '操作'
  }
])

const clickDictType = (row: Recordable) => {
  dictTableRef.value.openDrawer(row.dictType)
}

const { allSchemas } = useCrudSchemas(crudSchemas)

//添加
const AddAction = () => {
  dictFormRef.value.openDrawer('add')
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
  dictFormRef.value.openDrawer(type, row.dictId)
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
  dictName: '',
  dictType: '',
  status: '',
  beginTime: '',
  endTime: ''
})

//搜索
const setSearchParamsSub = (param: Recordable) => {
  console.log(param)

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

// 筛选列
const showCell = () => {
  isShowCell.value = !isShowCell.value
}

/** 刷新缓存按钮操作 */
const reLoading = ref<boolean>(false)

const handleRefreshCache = () => {
  reLoading.value = true
  refreshCacheApi()
    .then(() => {
      ElMessage.success('刷新成功')
      useDictStore().cleanDict()
    })
    .finally(() => {
      reLoading.value = false
    })
}
</script>

<template>
  <ContentWrap Showtitle="字典管理">
    <template #ContentWrapTitle>
      <div>
        <ElButton class="btn-add" @click="AddAction" plain v-hasPermi="'system:dict:add'">
          <template #icon>
            <Icon :size="14" icon="svg-icon:addBut" />
          </template>
          新增
        </ElButton>

        <ElButton
          :loading="exLoading"
          class="other exportBtn"
          @click="exportForm()"
          plain
          v-hasPermi="'system:dict:export'"
        >
          <template #icon>
            <Icon :size="14" icon="svg-icon:exportBut" />
          </template>
          导出
        </ElButton>
        <ElButton
          :loading="reLoading"
          class="exportBtn"
          @click="handleRefreshCache()"
          plain
          v-hasPermi="'system:dict:cache'"
        >
          <template #icon>
            <Icon :size="14" icon="svg-icon:refreshCache" />
          </template>
          刷新缓存
        </ElButton>

        <ElButton
          :loading="delLoading"
          class="btn-other"
          @click="delData(null, true)"
          plain
          v-hasPermi="'system:dict:remove'"
        >
          <template #icon>
            <Icon :size="14" icon="svg-icon:deleteBut" />
          </template>
          删除
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
          编辑
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
          删除
        </ElButton>
      </template>
    </Table>
  </ContentWrap>

  <DictForm title="字典" ref="dictFormRef" />

  <DictTable ref="dictTableRef" />
</template>
<style lang="less" scoped>
:deep(.el-loading-mask) {
  top: 0px !important;
  width: 100% !important;
  left: 0px !important;
}
</style>
