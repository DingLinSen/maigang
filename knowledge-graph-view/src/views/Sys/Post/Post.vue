<script setup lang="ts">
import { PostForm } from './components/index'
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { ElButton, ElMessageBox, ElTag, ElMessage } from 'element-plus'
import { Table } from '@/components/Table'
import { getPostListApi, delPostListApi, exportPostListApi } from '@/api/post'
import { useTable } from '@/hooks/web/useTable'
import { PostData } from '@/api/post/types'
import { getCurrentInstance, h, reactive, ref, unref } from 'vue'
import { useEmitt } from '@/hooks/web/useEmitt'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { TableColumn } from '@/types/table'
import { isAuth } from '@/utils/is'

defineOptions({
  name: 'Post'
})

const { proxy } = getCurrentInstance() as any
const { sys_normal_disable } = proxy.useDict('sys_normal_disable')

const getElTagLabel = (value: string): string => {
  let label = ''
  unref(sys_normal_disable).map((item: any) => {
    if (value === item.value) {
      label = item.label
    }
  })
  return label
}

const { register, tableObject, methods } = useTable<PostData>({
  getListApi: getPostListApi,
  delListApi: delPostListApi,
  response: {
    list: 'rows',
    total: 'total'
  }
})

const { getList, setSearchParams } = methods

getList()

const postFormRef = ref<ComponentRef<typeof PostForm>>()

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
    field: 'postId',
    label: '岗位序号',
    minWidth: '180px'
  },
  {
    field: 'postCode',
    label: '岗位编码',
    search: {
      show: true,
      componentProps: {
        style: 'width: 196px',
        placeholder: '岗位编码筛选'
      }
    },
    minWidth: '180px',
    formatter: (row: Recordable) => {
      return h('span', row.postCode ? row.postCode : '--')
    }
  },
  {
    field: 'postName',
    label: '岗位名称',
    search: {
      show: true,
      componentProps: {
        style: 'width: 196px',
        placeholder: '岗位名称筛选'
      }
    },
    minWidth: '180px',
    formatter: (row: Recordable) => {
      return h('span', row.postName ? row.postName : '--')
    }
  },
  {
    field: 'postSort',
    label: '岗位排序',
    minWidth: '180px',
    formatter: (row: Recordable) => {
      return h('span', String(row.postSort) ? String(row.postSort) : '--')
    }
  },
  {
    field: 'status',
    label: '状态',
    minWidth: '180px',
    formatter: (row: Recordable, __: TableColumn, cellValue: string) => {
      return h(
        ElTag,
        {
          type: cellValue === '0' ? '' : 'danger'
        },
        () => getElTagLabel(cellValue)
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
    field: 'createTime',
    minWidth: '180px',
    label: '创建时间',
    formatter: (row: Recordable) => {
      return h('span', row.createTime ? row.createTime : '--')
    }
  },
  {
    field: 'action',
    showOverflowTooltip: false,
    minWidth: '140px',
    fixed: 'right',
    label: '操作'
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)

//添加
const AddAction = () => {
  postFormRef.value.openDrawer('add')
}

//删除加载
const delLoading = ref(false)

//导出加载
const exLoading = ref(false)

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
  postFormRef.value.openDrawer(type, row.postId)
}

//导出
const exportForm = async () => {
  if (tableObject.tableList.length === 0) {
    ElMessage.warning('查询无数据, 无需导出数据')
    return
  }
  exLoading.value = true
  await exportPostListApi(params)
  exLoading.value = false
}

const params = reactive<Recordable>({
  postCode: '',
  postName: '',
  status: ''
})

//搜索
const setSearchParamsSub = (param: Recordable) => {
  params.postCode = param.postCode ? param.postCode : ''
  params.postName = param.postName ? param.postName : ''
  params.status = param.status ? param.status : ''
  setSearchParams(params)
}

// 是否显示筛选窗口
const isShowCell = ref(false)

// 筛选列
const showCell = () => {
  isShowCell.value = !isShowCell.value
}
</script>

<template>
  <ContentWrap :isShowtitle="false">
    <Table
      v-model:pageSize="tableObject.pageSize"
      v-model:currentPage="tableObject.currentPage"
      :columns="allSchemas.tableColumns"
      :data="tableObject.tableList"
      :loading="tableObject.loading"
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
          :schema="allSchemas.searchSchema"
          :showSearch="false"
          :showReset="false"
          @search="setSearchParamsSub"
          @reset="setSearchParamsSub"
          v-if="isAuth('system:post:query')"
        />
      </template>
      <template #operateBtnRight>
        <ElButton class="btn-add" @click="AddAction" plain v-hasPermi="'system:post:add'">
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
          v-hasPermi="'system:post:export'"
        >
          <template #icon>
            <Icon :size="14" icon="svg-icon:exportBut" />
          </template>
          导出
        </ElButton>
        <ElButton
          :loading="delLoading"
          class="btn-other"
          @click="delData(null, true)"
          plain
          v-hasPermi="'system:post:remove'"
        >
          <template #icon>
            <Icon :size="14" icon="svg-icon:deleteBut" />
          </template>
          删除
        </ElButton>
      </template>
      <template #action="{ row }">
        <ElButton
          class="btn-default"
          @click="action(row, 'edit')"
          :text="true"
          size="small"
          v-hasPermi="'system:post:edit'"
        >
          编辑
        </ElButton>
        <!-- <ElButton type="success" @click="action(row, 'see')" :text="true">
          <Icon icon="ep:warning" class="mr-5px" />详情
        </ElButton> -->
        <ElButton
          @click="delData(row, false)"
          :text="true"
          class="btn-default"
          size="small"
          v-hasPermi="'system:post:remove'"
        >
          删除
        </ElButton>
      </template>
    </Table>
  </ContentWrap>

  <PostForm title="岗位" ref="postFormRef" />
</template>
