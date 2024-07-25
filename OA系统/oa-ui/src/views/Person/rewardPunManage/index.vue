<script setup lang="ts">
import { rewardPunForm } from './components/index'
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { ElButton, ElMessageBox, ElTag, ElMessage } from 'element-plus'
import { Table } from '@/components/Table'
import { getInfoBonuspenaltListApi, delInfoBonuspenaltListApi } from '@/api/person/rewardPunManage'
import { useTable } from '@/hooks/web/useTable'
// import { any, DictTypeData, DictOptionData } from '@/api/dict/types'
import { getCurrentInstance, h, reactive, ref, unref } from 'vue'
import { useEmitt } from '@/hooks/web/useEmitt'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { TableColumn } from '@/types/table'
import { downloadFile } from '@/utils/index'
import moment from 'moment'
import useDictStore from '@/store/modules/appDict'
import { isAuth } from '@/utils/is'
import { LimitDailog } from '@/views/Components/limit'

defineOptions({
  name: 'RewardPunManage'
})

const { proxy } = getCurrentInstance() as any
const { repu_bon_type } = proxy.useDict('repu_bon_type')

const getElTagLabel = (value: string): string => {
  let label = ''
  unref(repu_bon_type).map((item: DictOptionData) => {
    if (value === item.value) {
      label = item.label
    }
  })
  return label
}

const { register, tableObject, methods } = useTable<any>({
  getListApi: getInfoBonuspenaltListApi,
  delListApi: delInfoBonuspenaltListApi,
  response: {
    list: 'rows',
    total: 'total'
  }
})

const { getList, setSearchParams } = methods

getList()

const rewardPunFormRef = ref<ComponentRef<typeof rewardPunForm>>()

// const dictTableRef = ref<ComponentRef<typeof DictTable>>()

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
    field: 'title',
    label: '标题',
    minWidth: '180px',
    search: {
      show: true,
      componentProps: {
        style: 'width: 196px',
        placeholder: '请输入标题'
      }
    }
  },
  {
    field: 'createUserName',
    label: '创建人',
    minWidth: '100px',
    formatter: (row: any) => {
      return h('span', row.createUserName ? row.createUserName : '--')
    }
  },
  {
    field: 'createTime',
    minWidth: '120px',
    label: '创建时间',
    formatter: (row: any) => {
      return h('span', row.createTime ? row.createTime : '--')
    }
  },
  {
    field: 'bonType',
    label: '奖惩类型',
    minWidth: '80px',
    formatter: (row: any, __: TableColumn, cellValue: string) => {
      let label: string = getElTagLabel(cellValue)
      return h(
        ElTag,
        {
          type: cellValue === '1' ? '' : 'danger'
        },
        () => label
      )
    },
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        style: 'width: 196px',
        options: repu_bon_type,
        placeholder: '奖惩类型筛选'
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
  if (row) {
    rewardPunFormRef.value.openDrawer(type, row.id)
  } else {
    rewardPunFormRef.value.openDrawer(type)
  }
}

const params = reactive<any>({
  title: '',
  bonType: ''
})

//搜索
const setSearchParamsSub = (param: any) => {
  params.title = param.title ? param.title : ''
  params.bonType = param.bonType ? param.bonType : ''
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
      ElMessage.warning('刷新成功')
      useDictStore().cleanDict()
    })
    .finally(() => {
      reLoading.value = false
    })
}
</script>

<template>
  <ContentWrap Showtitle="奖惩管理">
    <template #ContentWrapTitle>
      <div>
        <ElButton
          class="btn-add"
          @click="action(null, 'add')"
          plain
          v-hasPermi="'person:rewardPunManage:add'"
        >
          <template #icon>
            <Icon :size="14" icon="svg-icon:addBut" />
          </template>
          新增
        </ElButton>
        <ElButton
          :loading="delLoading"
          class="btn-other"
          @click="delData(null, true)"
          plain
          v-hasPermi="'person:rewardPunManage:remove'"
        >
          <template #icon>
            <Icon :size="14" icon="svg-icon:deleteBut" />
          </template>
          删除
        </ElButton>
        <!-- <ElButton
          :loading="reLoading"
          class="btn-other"
          @click="handleRefreshCache()"
          plain
          v-hasPermi="'system:dict:cache'"
        >
          <Icon icon="ep:refresh" class="mr-5px" />刷新缓存
        </ElButton> -->
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
          v-if="isAuth('person:rewardPunManage:query')"
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
          v-hasPermi="'person:rewardPunManage:edit'"
        >
          编辑
        </ElButton>
        <ElButton
          class="btn-default"
          @click="action(row, 'see')"
          :text="true"
          v-hasPermi="'person:rewardPunManage:see'"
        >
          详情
        </ElButton>
        <ElButton
          class="btn-default"
          @click="delData(row, false)"
          :text="true"
          size="small"
          v-hasPermi="'person:rewardPunManage:remove'"
        >
          删除
        </ElButton>
        <ElButton
          class="btn-default"
          v-if="row.filePath"
          @click="downloadFile(row.filePath, row.fileName)"
          :text="true"
          size="small"
          v-hasPermi="'person:rewardPunManage:export'"
        >
          下载
        </ElButton>
      </template>
    </Table>
    <rewardPunForm title="奖惩" ref="rewardPunFormRef" />
    <LimitDailog routerName="rewardPunManage" />
  </ContentWrap>
</template>
<style lang="less" scoped>
:deep(.el-loading-mask) {
  top: 0px !important;
  width: 100% !important;
  left: 0px !important;
}
</style>
