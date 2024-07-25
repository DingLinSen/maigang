<script setup lang="ts">
import { h, reactive, ref, nextTick } from 'vue'
import { ElButton, ElSwitch, ElMessage, ElMessageBox, ElDialog } from 'element-plus'

import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Table } from '@/components/Table'
import { useTable } from '@/hooks/web/useTable'
import { useEmitt } from '@/hooks/web/useEmitt'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { isAuth } from '@/utils/is'
import { getAnswerListApi, delAnswerApi, updateStatusApi } from '@/api/askAndAnswer'
import { AskAndAnswerForm } from './components/index'
import { AnswerForm } from './components/index'

defineOptions({
  name: 'AskAndAnswer'
})

const { register, tableObject, methods } = useTable<any>({
  getListApi: getAnswerListApi,
  delListApi: delAnswerApi,
  response: {
    list: 'rows',
    total: 'total',
    key: 'id'
  }
})

const { getList, setSearchParams } = methods

getList()

const postFormRef = ref<ComponentRef<typeof AskAndAnswerForm>>()
// const answerFormRef = ref<ComponentRef<typeof AnswerForm>>()
useEmitt({
  name: 'getAnswerList',
  callback: (type: string) => {
    if (type === 'add') {
      tableObject.currentPage = 1
    }
    getList()
  }
})

const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'index',
    label: '序号',
    type: 'index',
    fixed: 'left'
  },
  {
    field: 'title',
    label: '提问标题',
    search: {
      show: true,
      componentProps: {
        style: 'width:200px;', //宽度
        maxlength: 10
      }
    },
    minWidth: '180px',
    formatter: (row: Recordable) => {
      return h('span', row.title ? row.title : '--')
    }
  },
  {
    field: 'plantType',
    label: '植物品种',
    minWidth: '180px',
    search: {
      show: true,
      componentProps: {
        style: 'width:200px;', //宽度
        maxlength: 10
      }
    },
    formatter: (row: Recordable) => {
      return h('span', row.plantType ? row.plantType : '--')
    }
  },

  {
    field: 'askByName',
    minWidth: '180px',
    label: '提问人',
    search: {
      show: true,
      componentProps: {
        style: 'width:200px;', //宽度
        maxlength: 10
      }
    },
    formatter: (row: Recordable) => {
      return h('span', row.askByName ? row.askByName : '--')
    }
  },
  {
    field: 'askTime',
    minWidth: '180px',
    label: '提问时间',
    formatter: (row: Recordable) => {
      return h('span', row.askTime ? row.askTime : '--')
    }
  },
  {
    field: 'action',
    width: '220px',
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
// 回答问题
const handleAnswer = (row: any, type: string) => {
  nextTick(() => {
    postFormRef.value?.openDrawer(type, row.id)
  })
}
// 发布
const release = (row: any) => {
  ElMessageBox.confirm('是否发布所选中数据？', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await updateStatusApi({
      id: row.id,
      status: '1'
    }).then(() => {
      ElMessage({
        type: 'success',
        message: '发布成功'
      })
      getList()
    })
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
  title: undefined,
  plantType: undefined,
  askByName: undefined
})
const chooseListAll = ref([])
//搜索
const setSearchParamsSub = (param: Recordable) => {
  chooseListAll.value = []
  params.title = param.title ? param.title : undefined
  params.plantType = param.plantType ? param.plantType : undefined
  params.askByName = param.askByName ? param.askByName : undefined
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
      :showOverflowTooltip="false"
      :border="true"
      :keyTable="'postId'"
      :selection="false"
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
      <!-- <template #answerNumber="{ row }">
        <span v-if="row.postName" class="answer-number" @click="answerDetail(row, 'detail')">{{
          row.postName ? row.postName : row.postName
        }}</span>
      </template> -->
      <template #action="{ row }">
        <ElButton type="text" @click="handleAnswer(row, 'answer')" :text="true"> 回答 </ElButton>
        <ElButton v-if="row.status == 0" type="text" @click="release(row)" :text="true">
          发布
        </ElButton>
        <ElButton v-if="row.status == 1" type="text" @click="action(row, 'edit')" :text="true">
          编辑
        </ElButton>
        <ElButton type="text" @click="delData(row, false)" :text="true"> 删除 </ElButton>
        <ElButton type="text" @click="action(row, 'see')" :text="true"> 详情 </ElButton>
      </template>
    </Table>
  </ContentWrap>
  <AskAndAnswerForm title="问答" ref="postFormRef" @get-answer-list="getList()" />
</template>
<style lang="less" scoped>
.answer-number {
  color: #2e8d3f;
  &:hover {
    cursor: pointer;
    color: #10561c;
  }
}
</style>
