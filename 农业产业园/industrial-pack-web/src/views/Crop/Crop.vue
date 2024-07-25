<script setup lang="ts">
import { h, reactive, ref, nextTick, unref } from 'vue'
import { ElButton, ElSwitch, ElMessage, ElMessageBox } from 'element-plus'

import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Table } from '@/components/Table'
import { useTable } from '@/hooks/web/useTable'
import { useEmitt } from '@/hooks/web/useEmitt'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { isAuth } from '@/utils/is'
import { getCropLevelDetailApi, delCropLevelApi } from '@/api/crop'
import { CropForm } from './components/index'
import { CropClassification } from './components/index'
import { CropType } from './components/index'
import { CropTypeEditForm } from './components/index'
import { listToTree } from '@/utils/tree'

defineOptions({
  name: 'ImageContent'
})

// const { register, tableObject, methods } = useTable<any>({
//   getListApi: getCropLevelDetailApi,
//   delListApi: delCropLevelApi,
//   response: {
//     list: 'data',
//     total: 'total',
//     key: 'id'
//   }
// })

// const { getList, setSearchParams } = methods

// getList()
//列表加载
const refLoading = ref(false)
//请求数据
const getList = async (params: Recordable) => {
  refLoading.value = true
  const res = await getCropLevelDetailApi(params)
    .catch(() => {})
    .finally(() => {
      refLoading.value = false
    })
  if (res && res.data) {
    console.log(res.data)

    tableData.value = listToTree(res.data, { id: 'id', children: 'children', pid: 'parentId' })
  }
}
const postFormRef = ref<ComponentRef<typeof CropForm>>()
const CropClassificationRef = ref<ComponentRef<typeof CropClassification>>()
const CropTypeRef = ref<ComponentRef<typeof CropType>>()
const CropTypeEditFormRef = ref<ComponentRef<typeof CropTypeEditForm>>()

useEmitt({
  name: 'getCropList',
  callback: (_: string) => {
    getList(params)
  }
})

const tableData = ref<any>([])
const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'name',
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
      return h('span', row.name ? row.name : '--')
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

//添加类别
const addAction = () => {
  nextTick(() => {
    postFormRef.value?.openDrawer('add', '')
  })
}
// 添加分类
const addClassification = () => {
  nextTick(() => {
    CropClassificationRef.value?.openDrawer('add', '')
  })
}
// 添加种类
const addType = () => {
  nextTick(() => {
    CropTypeRef.value?.openDrawer('add', '')
  })
}
//删除加载
const delLoading = ref(false)

//删除
const delData = async (row: any) => {
  ElMessageBox.confirm('是否删除所选中数据？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    autofocus: false,
    type: 'warning'
  }).then(async () => {
    const ids = [row.id as string]
    const res = await delCropLevelApi(ids.toString())
      .catch(() => {})
      .finally(() => {})
    if (res) {
      ElMessage.success('删除成功')
      getList(params)
    }
  })
}

//table操作栏按钮事件
const action = (row: any, type: string) => {
  if (row.level == 1) {
    nextTick(() => {
      postFormRef.value?.openDrawer(type, row.id)
    })
  }
  if (row.level == 2) {
    nextTick(() => {
      CropClassificationRef.value?.openDrawer(type, row.id)
    })
  }
  if (row.level == 3) {
    nextTick(() => {
      CropTypeRef.value?.openDrawer(type, row.id)
    })
  }
}
const searchRef = ref<ComponentRef<typeof Search>>()

const params = reactive<Recordable>({
  name: undefined
})
const chooseListAll = ref([])

//搜索
const setSearchParamsSub = (param: Recordable) => {
  chooseListAll.value = []
  params.name = param.name ? param.name : undefined
  getList(params)
}
getList(params)

//默认列表展开
const isExpand = ref(false)
const tableRef = ref<TableExpose>()

//展开/折叠
const toggleRowExpansion = () => {
  nextTick(() => {
    isExpand.value = !isExpand.value
    toggleRowExpansionByRecursive(tableData.value, isExpand.value)
  })
}

//递归展开/折叠Table
const toggleRowExpansionByRecursive = (tableData: any[], isExpand: boolean) => {
  tableData.map((item: any) => {
    unref(tableRef)?.elTableRef?.toggleRowExpansion(item, isExpand)
    if (item.children) {
      toggleRowExpansionByRecursive(item.children, isExpand)
    }
  })
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
      ref="tableRef"
      :loading="refLoading"
      :border="true"
      :columns="allSchemas.tableColumns"
      :data="tableData"
      :selection="false"
      :stripe="true"
      :default-expand-all="isExpand"
      :chooseListAll="chooseListAll"
      row-key="id"
    >
      <template #operateBtnLeft>
        <ElButton type="primary" @click="addAction">
          <Icon icon="ep:plus" class="mr-5px" />新增类别</ElButton
        >
        <ElButton type="primary" @click="addClassification">
          <Icon icon="ep:plus" class="mr-5px" />新增分类</ElButton
        >
        <ElButton type="primary" @click="addType">
          <Icon icon="ep:plus" class="mr-5px" />新增种类</ElButton
        >
        <ElButton type="primary" @click="toggleRowExpansion" plain>
          <Icon icon="ep:sort" class="mr-5px" />
          展开/折叠
        </ElButton>
      </template>
      <template #coverUrl="{ row }"> <img :src="row.coverUrl" /> </template>
      <template #action="{ row }">
        <ElButton type="text" @click="action(row, 'edit')" :text="true"> 编辑 </ElButton>
        <ElButton type="text" @click="delData(row, false)" :text="true"> 删除 </ElButton>
      </template>
    </Table>
  </ContentWrap>
  <CropForm title="作物类别" ref="postFormRef" @get-crop-list="getList()" />
  <CropClassification title="作物分类" ref="CropClassificationRef" @get-crop-list="getList()" />
  <CropType title="作物种类" ref="CropTypeRef" @get-crop-list="getList()" />
  <CropTypeEditForm title="作物" ref="CropTypeEditFormRef" @get-crop-list="getList()" />
</template>
