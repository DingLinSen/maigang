<script setup lang="ts">
import { h, reactive, ref, nextTick, getCurrentInstance, unref } from 'vue'
import { ElButton, ElSwitch, ElMessage, ElMessageBox, ElTag } from 'element-plus'

import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Table } from '@/components/Table'
import { useTable } from '@/hooks/web/useTable'
import { useEmitt } from '@/hooks/web/useEmitt'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { isAuth } from '@/utils/is'
import { TableColumn } from '@/types/table'
import { getPlantListApi, delPlantApi } from '@/api/plant'
import { PlantForm } from './components/index'

defineOptions({
  name: 'Plant'
})
const { proxy } = getCurrentInstance() as any
const { planting_standards } = proxy.useDict('planting_standards')

const getElTagLabel = (value: string): string => {
  let label = ''
  unref(planting_standards).map((item: any) => {
    if (value === item.value) {
      label = item.label
    }
  })
  return label
}
const { register, tableObject, methods } = useTable<any>({
  getListApi: getPlantListApi,
  delListApi: delPlantApi,
  response: {
    list: 'rows',
    total: 'total',
    key: 'id'
  }
})

const { getList, setSearchParams } = methods

getList()

const postFormRef = ref<ComponentRef<typeof PlantForm>>()
useEmitt({
  name: 'getPostList',
  callback: (type: string) => {
    if (type === 'add') {
      tableObject.currentPage = 1
    }
    getList()
  }
})

const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'categoryName',
    minWidth: '180px',
    label: '类别',
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        style: 'width:200px;' //宽度
      }
    },
    formatter: (row: Recordable) => {
      return h('span', row.categoryName ? row.categoryName : '--')
    }
  },
  {
    field: 'classificationName',
    minWidth: '180px',
    label: '作物分类',
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        style: 'width:200px;' //宽度
      }
    },
    formatter: (row: Recordable) => {
      return h('span', row.classificationName ? row.classificationName : '--')
    }
  },
  {
    field: 'selectTypeName',
    minWidth: '180px',
    label: '作物种类',
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        style: 'width:200px;' //宽度
      }
    },
    formatter: (row: Recordable) => {
      return h('span', row.selectTypeName ? row.selectTypeName : '--')
    }
  },
  {
    field: 'plantingStandards',
    minWidth: '180px',
    label: '种植标准',
    formatter: (_: Recordable, __: TableColumn, cellValue: string) => {
      let label: string = getElTagLabel(cellValue)
      return h(
        ElTag,
        // {
        //   type: cellValue === '0' ? '' : 'danger'
        // },
        () => label
      )
    }
  },
  {
    field: 'action',
    width: '180px',
    label: '操作',
    fixed: 'right'
  }
])
const { allSchemas } = useCrudSchemas(crudSchemas)

//添加
const addAction = () => {
  nextTick(() => {
    postFormRef.value?.openDrawer('add', '')
  })
}

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
    multiple
  ).finally(() => {
    delLoading.value = false
  })
}

//table操作栏按钮事件
const action = (row: any, type: string) => {
  nextTick(() => {
    postFormRef.value?.openDrawer(type, row.id)
  })
}
const searchRef = ref<ComponentRef<typeof Search>>()

const params = reactive<Recordable>({
  categoryName: undefined,
  classificationName: undefined,
  selectTypeName: undefined
})
const chooseListAll = ref([])
//搜索
const setSearchParamsSub = (param: Recordable) => {
  chooseListAll.value = []
  params.categoryName = param.categoryName ? param.categoryName : undefined
  params.classificationName = param.classificationName ? param.classificationName : undefined
  params.selectTypeName = param.selectTypeName ? param.selectTypeName : undefined
  setSearchParams(params)
}
</script>

<template>
  <ContentWrap class="mt-7px mb-10px">
    <Search
      ref="searchRef"
      :schema="allSchemas.searchSchema"
      :chooseListAll="chooseListAll"
      @search="setSearchParamsSub"
      @reset="setSearchParamsSub"
      v-if="isAuth('system:post:query')"
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
      :keyTable="'id'"
      :chooseListAll="chooseListAll"
      :header-align="'center'"
      :align="'center'"
      :pagination="{
        total: tableObject.total
      }"
      @register="register"
    >
      <template #operateBtnLeft>
        <ElButton type="primary" @click="addAction">
          <Icon icon="ep:plus" class="mr-5px" />新增</ElButton
        >
      </template>
      <template #action="{ row }">
        <ElButton type="text" @click="action(row, 'see')" :text="true"> 查看 </ElButton>
        <ElButton type="text" @click="action(row, 'edit')" :text="true"> 编辑 </ElButton>
        <ElButton type="text" @click="delData(row, false)" :text="true"> 删除 </ElButton>
      </template>
    </Table>
  </ContentWrap>
  <PlantForm title="种植方案" ref="postFormRef" @get-post-list="getList()" />
</template>
