<script setup lang="ts">
import { h, reactive, ref, nextTick } from 'vue'
import { ElButton, ElSwitch, ElMessage, ElMessageBox } from 'element-plus'

import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Table } from '@/components/Table'
import { useTable } from '@/hooks/web/useTable'
import { useEmitt } from '@/hooks/web/useEmitt'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { isAuth } from '@/utils/is'
import { PostData } from '@/api/post/types'
import { getPostListApi, delPostListApi } from '@/api/post'
import { DeviceForm } from './components/index'

defineOptions({
  name: 'Device'
})

const { register, tableObject, methods } = useTable<PostData>({
  getListApi: getPostListApi,
  delListApi: delPostListApi,
  response: {
    list: 'rows',
    total: 'total',
    key: 'postId'
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
    field: 'userId',
    label: '序号',
    type: 'index',
    fixed: 'left'
  },
  {
    field: 'postName',
    minWidth: '180px',
    label: '手机号',
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        style: 'width:200px;' //宽度
      }
    },
    formatter: (row: Recordable) => {
      return h('span', row.postName ? row.postName : '--')
    }
  },
  {
    field: 'postName',
    minWidth: '180px',
    label: '农场名称',
    formatter: (row: Recordable) => {
      return h('span', row.postName ? row.postName : '--')
    }
  },
  {
    field: 'postName',
    minWidth: '180px',
    label: '大棚名称',
    formatter: (row: Recordable) => {
      return h('span', row.postName ? row.postName : '--')
    }
  },
  {
    field: 'postName',
    minWidth: '180px',
    label: '设备类型',
    formatter: (row: Recordable) => {
      return h('span', row.postName ? row.postName : '--')
    }
  },
  {
    field: 'postName',
    minWidth: '180px',
    label: '设备名称',
    formatter: (row: Recordable) => {
      return h('span', row.postName ? row.postName : '--')
    }
  },
  {
    field: 'postName',
    minWidth: '180px',
    label: '设备状态',
    formatter: (row: Recordable) => {
      return h('span', row.postName ? row.postName : '--')
    }
  },
  {
    field: 'postName',
    minWidth: '180px',
    label: '设备ID',
    formatter: (row: Recordable) => {
      return h('span', row.postName ? row.postName : '--')
    }
  },
  {
    field: 'postName',
    minWidth: '180px',
    label: '备注',
    formatter: (row: Recordable) => {
      return h('span', row.postName ? row.postName : '--')
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
const delData = async (row: PostData | null, multiple: boolean) => {
  tableObject.currentRow = row
  const { delList, getSelections } = methods
  const selections = await getSelections()
  delLoading.value = true
  await delList(
    multiple ? selections.map((v) => v.postId) : [tableObject.currentRow?.postId as string],
    multiple
  ).finally(() => {
    delLoading.value = false
  })
}

//table操作栏按钮事件
const action = (row: PostData, type: string) => {
  nextTick(() => {
    postFormRef.value?.openDrawer(type, row.postId)
  })
}
const searchRef = ref<ComponentRef<typeof Search>>()

const params = reactive<Recordable>({
  postCode: undefined,
  postName: undefined,
  status: undefined
})
const chooseListAll = ref([])
//搜索
const setSearchParamsSub = (param: Recordable) => {
  chooseListAll.value = []
  params.postCode = param.postCode ? param.postCode : undefined
  params.postName = param.postName ? param.postName : undefined
  params.status = param.status ? param.status : undefined
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
      :keyTable="'postId'"
      :chooseListAll="chooseListAll"
      :header-align="'center'"
      :height="700"
      :align="'center'"
      :selection="false"
      :pagination="{
        total: tableObject.total
      }"
      @register="register"
    >
      <template #operateBtnLeft>
        <ElButton type="primary" @click="addAction" v-hasPermi="'system:post:add'">
          <Icon icon="ep:plus" class="mr-5px" />新增</ElButton
        >
      </template>
      <template #action="{ row }">
        <ElButton
          type="text"
          @click="action(row, 'edit')"
          :text="true"
          v-hasPermi="'system:post:edit'"
        >
          启动
        </ElButton>
        <ElButton
          type="text"
          @click="delData(row, false)"
          :text="true"
          v-hasPermi="'system:post:remove'"
        >
          删除
        </ElButton>
        <ElButton
          type="text"
          @click="action(row, 'edit')"
          :text="true"
          v-hasPermi="'system:post:edit'"
        >
          编辑
        </ElButton>
      </template>
    </Table>
  </ContentWrap>
  <DeviceForm title="图文内容" ref="postFormRef" @getPostList="getList()" />
</template>
