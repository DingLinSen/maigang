<script setup lang="ts">
import { getCurrentInstance, h, reactive, ref, unref, nextTick } from 'vue'
import { ElButton, ElSwitch, ElMessage, ElMessageBox } from 'element-plus'

import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Table } from '@/components/Table'
import { useTable } from '@/hooks/web/useTable'
import { useEmitt } from '@/hooks/web/useEmitt'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { TableColumn } from '@/types/table'
import { isAuth } from '@/utils/is'
import { PostData } from '@/api/post/types'
import { getPostListApi, delPostListApi, exportPostListApi, editPostApi } from '@/api/post'
import { PostForm } from './components/index'

defineOptions({
  name: 'Post'
})

const { proxy } = getCurrentInstance() as any

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

const postFormRef = ref<ComponentRef<typeof PostForm>>()
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
    field: 'postId',
    label: '序号',
    width: '60px',
    fixed: 'left',
    type: 'index'
  },
  // {
  //   field: 'postCode',
  //   label: '岗位编码',
  //   search: {
  //     show: false
  //   },
  //   minWidth: '180px',
  //   formatter: (row: Recordable) => {
  //     return h('span', row.postCode ? row.postCode : '--')
  //   }
  // },
  {
    field: 'postName',
    label: '岗位名称',
    search: {
      show: true,
      componentProps: {
        style: 'width:200px;' //宽度
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
      return h('span', row.postSort ? row.postSort : '--')
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
    width: '180px',
    label: '操作',
    fixed: 'right'
  }
])
//状态切换
const switchChange = (row: Recordable) => {
  if (row.admin) {
    ElMessage.error('禁止修改超级管理员角色的状态')
    return
  }
  let msg = ''
  let title = ''
  if (row.status === '0') {
    title = '角色停用提示'
    msg = '确认要停用"' + row.postName + '"角色吗？'
  } else {
    title = '角色启用提示'
    msg = '确认要启用"' + row.postName + '"角色吗？'
  }
  ElMessageBox.confirm(msg, title, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const params = {
      ...row,
      status: row.status === '0' ? '1' : '0'
    }
    const res = await editPostApi(params)
    if (res) {
      nextTick()
      ElMessage.success(row.status === '0' ? '停用成功' : '启用成功')
      row.status = row.status === '0' ? '1' : '0'
    }
  })
}
const { allSchemas } = useCrudSchemas(crudSchemas)

//添加
const addAction = () => {
  nextTick(() => {
    postFormRef.value?.openDrawer('add', '')
  })
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
  nextTick(() => {
    postFormRef.value?.openDrawer(type, row.postId)
  })
}
const searchRef = ref<ComponentRef<typeof Search>>()
//导出
const exportForm = async () => {
  if (tableObject.tableList.length === 0) {
    ElMessage.warning('查询无数据, 无需导出数据')
    return
  }
  const param = await unref(searchRef)?.getFormData()
  exLoading.value = true
  await exportPostListApi(param)
  exLoading.value = false
}

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
      :align="'center'"
      :pagination="{
        total: tableObject.total
      }"
      @register="register"
    >
      <template #operateBtnLeft>
        <ElButton type="primary" @click="addAction" v-hasPermi="'system:post:add'">
          <Icon icon="ep:plus" class="mr-5px" />新增</ElButton
        >
        <ElButton
          :loading="exLoading"
          type="primary"
          @click="exportForm()"
          plain
          v-hasPermi="'system:post:export'"
        >
          <Icon icon="ep:bottom" class="mr-5px" />导出
        </ElButton>
        <ElButton
          :loading="delLoading"
          @click="delData(null, true)"
          v-hasPermi="'system:post:remove'"
          class="btn-default"
        >
          <Icon icon="ep:delete" class="mr-5px" />删除
        </ElButton>
      </template>
      <template #action="{ row }">
        <ElButton
          type="text"
          @click="action(row, 'edit')"
          :text="true"
          v-hasPermi="'system:post:edit'"
        >
          编辑
        </ElButton>
        <!-- <ElButton type="primary" @click="action(row, 'see')" :text="true">
          <Icon icon="ep:warning" class="mr-5px" />详情
        </ElButton> -->
        <ElButton
          type="text"
          @click="delData(row, false)"
          :text="true"
          v-hasPermi="'system:post:remove'"
        >
          删除
        </ElButton>
      </template>
    </Table>
  </ContentWrap>
  <PostForm title="岗位" ref="postFormRef" @getPostList="getList()" />
</template>
