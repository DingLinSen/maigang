<!-- 工作流程 - 流程列表 -->
<script setup lang="ts">
import { PostForm } from './components/index'
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { ElButton, ElMessageBox, ElTag, ElMessage } from 'element-plus'
import moment from 'moment'
import { Table } from '@/components/Table'
import { getworkflowListApi, delWorkflowrListApi } from '@/api/workflow'
import { useTable } from '@/hooks/web/useTable'
import { PostData } from '@/api/post/types'
import { getCurrentInstance, h, reactive, ref, unref, nextTick, onMounted } from 'vue'
import { useEmitt } from '@/hooks/web/useEmitt'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { TableColumn } from '@/types/table'
import { isAuth } from '@/utils/is'

defineOptions({
  name: 'Bpmnlist'
})

const { proxy } = getCurrentInstance() as any
const { business_type } = proxy.useDict('business_type')
// console.log(business_type)

const categoryOptions = ref<any>([])
nextTick(() => {
  console.log(business_type)
  business_type.value.forEach((item: any) => {
    item.value = item.label
    categoryOptions.value.push(item)
  })
  console.log(categoryOptions.value)
})
// business_type.value.forEach((item: any) => {
//   item.value = item.label
//   categoryOptions.value.push(item)
// })
const mapcategoryOptions = async () => {
  // categoryOptions.value = []
  // unref(business_type).forEach((item: any) => {
  //   item.value = item.label
  //   categoryOptions.value.push(item)
  // })
  // console.log('business_type', unref(business_type))
  console.log(categoryOptions.value)
  // return categoryOptions.value
}

const getElTagLabel = (value: string): string => {
  let label = ''
  unref(business_type).map((item: any) => {
    if (value === item.value) {
      label = item.label
    }
  })
  return label
}
onMounted(() => {})
const { register, tableObject, methods } = useTable<PostData>({
  getListApi: getworkflowListApi,
  delListApi: delWorkflowrListApi,
  response: {
    list: 'rows',
    total: 'total'
  }
})

const { getList, setSearchParams } = methods
getList()

// nextTick(() => {
mapcategoryOptions()
// })

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
    field: 'name',
    label: '工作流名称',
    minWidth: '180px',
    formatter: (row: Recordable) => {
      return h('span', row.name ? row.name : '--')
    },
    search: {
      show: true,
      componentProps: {
        style: 'width: 196px',
        placeholder: '工作流名称筛选'
      }
    }
  },

  {
    field: 'processDefinitionId',
    label: '工作流定义id',
    search: {
      show: true,
      componentProps: {
        style: 'width: 196px',
        placeholder: '工作流定义id筛选'
      }
    },
    minWidth: '300px',
    formatter: (row: Recordable) => {
      return h('span', row.processDefinitionId ? row.processDefinitionId : '--')
    }
  },
  {
    field: 'creatorName',
    label: '创建人',
    search: {
      show: true,
      componentProps: {
        style: 'width: 196px',
        placeholder: '创建人筛选'
      }
    },
    minWidth: '180px',
    formatter: (row: Recordable) => {
      return h('span', row.creatorName ? row.creatorName : '--')
    }
  },
  {
    field: 'category',
    label: '类别',
    minWidth: '180px',
    formatter: (row: Recordable) => {
      return h('span', row.category ? row.category : '--')
    },
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        style: 'width: 196px',
        placeholder: '类别筛选',
        filterable: true,
        valueKey: 'label',
        options: business_type
      }
    }
  },
  // {
  //   field: 'createTime',
  //   label: '创建时间',
  //   minWidth: '180px',
  //   formatter: (row: Recordable, __: TableColumn, cellValue: string) => {
  //     return h(
  //       ElTag,
  //       {
  //         type: cellValue === '0' ? '' : 'danger'
  //       },
  //       () => getElTagLabel(cellValue)
  //     )
  //   },
  //   search: {
  //     show: true,
  //     component: 'Select',
  //     componentProps: {
  //       options: sys_normal_disable
  //     }
  //   }
  // },
  {
    field: 'createTime',
    minWidth: '180px',
    label: '创建时间',
    formatter: (row: Recordable) => {
      return h('span', row.createTime ? moment(row.createTime).format('YYYY-MM-DD') : '--')
    }
  },
  {
    field: 'action',
    minWidth: '280px',
    label: '操作'
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)

//添加
const AddAction = (id?: number | undefined, type?: string) => {
  if (type === 'edit') {
    // window.open('http://localhost:9000/#/' + `?id=${id}`, '_blank')
    window.open('http://oa2.mgdaas-qa.com/bpmn' + `?id=${id}`, '_blank')
  } else {
    window.open('http://oa2.mgdaas-qa.com/bpmn', '_blank')
    // window.open('http://localhost:9000/#/', '_blank')
  }
  // postFormRef.value.openDrawer('add')
}

//删除加载
const delLoading = ref(false)

//导出加载
const exLoading = ref(false)

//删除
const delData = async (row: any, multiple: boolean) => {
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
  console.log(param)

  // params.postCode = param.postCode ? param.postCode : ''
  // params.postName = param.postName ? param.postName : ''
  // params.status = param.status ? param.status : ''
  setSearchParams(param)
}

// 是否显示筛选窗口
const isShowCell = ref(false)

// 筛选列
const showCell = () => {
  isShowCell.value = !isShowCell.value
}
</script>

<template>
  <ContentWrap>
    <template #ContentWrapTitle>
      <div>
        <ElButton
          class="btn-add"
          @click="AddAction(undefined, 'add')"
          plain
          v-hasPermi="'system:post:add'"
        >
          <Icon icon="ep:plus" class="mr-5px" />新增</ElButton
        >
        <ElButton
          :loading="delLoading"
          class="btn-other"
          @click="delData(null, true)"
          plain
          v-hasPermi="'system:post:remove'"
        >
          <Icon icon="ep:delete" class="mr-5px" />删除</ElButton
        >
      </div></template
    >

    <Table
      v-model:pageSize="tableObject.pageSize"
      v-model:currentPage="tableObject.currentPage"
      :columns="allSchemas.tableColumns"
      :data="tableObject.tableList"
      :loading="tableObject.loading"
      :border="true"
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
          @search="setSearchParamsSub"
          @reset="setSearchParamsSub"
          v-if="isAuth('system:post:query')"
        />
        <ElButton
          class="btn-add"
          @click="AddAction(undefined, 'add')"
          plain
          v-hasPermi="'system:post:add'"
        >
          <Icon icon="ep:plus" class="mr-5px" />新增</ElButton
        >
        <ElButton
          :loading="delLoading"
          class="btn-other"
          @click="delData(null, true)"
          plain
          v-hasPermi="'system:post:remove'"
        >
          <Icon icon="ep:delete" class="mr-5px" />删除</ElButton
        >
      </template>
      <template #action="{ row }">
        <ElButton
          class="btn-default"
          @click="AddAction(row.id, 'edit')"
          :text="true"
          size="small"
          v-hasPermi="'system:post:edit'"
        >
          编辑
        </ElButton>
        <!-- <ElButton
          type="primary"
          @click="action(row, 'edit')"
          :text="true"
          size="small"
          v-hasPermi="'system:post:edit'"
        >
          <Icon icon="ep:edit" class="mr-5px" />编辑
        </ElButton> -->
        <!-- <ElButton type="success" @click="action(row, 'see')" :text="true">
          <Icon icon="ep:warning" class="mr-5px" />详情
        </ElButton> -->
        <ElButton
          class="btn-default"
          @click="delData(row, false)"
          :text="true"
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
