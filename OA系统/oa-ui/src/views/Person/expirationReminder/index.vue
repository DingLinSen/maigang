<script setup lang="ts">
import { DictForm, DictTable } from './components/index'
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { useCache } from '@/hooks/web/useCache'
import { ElButton, ElMessageBox, ElTag, ElMessage } from 'element-plus'
import { Table } from '@/components/Table'
import { getExpireListApi } from '@/api/person/expirationReminder'
import PersonalFileManageForm from '../personalFileManage/personalFileManageForm/index.vue'
import { useTable } from '@/hooks/web/useTable'
// import { any, DictTypeData, any } from '@/api/dict/types'
import { getCurrentInstance, h, reactive, ref, unref, provide } from 'vue'
import { useEmitt } from '@/hooks/web/useEmitt'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { TableColumn } from '@/types/table'
import moment from 'moment'
import useDictStore from '@/store/modules/appDict'
import { isAuth } from '@/utils/is'
import { LimitDailog } from '@/views/Components/limit'

defineOptions({
  name: 'ExpirationReminder'
})
const { wsCache } = useCache()
const { proxy } = getCurrentInstance() as any
const { repu_bon_status } = proxy.useDict('repu_bon_status')
const personalFileManageRef = ref()
const getElTagLabel = (value: string): string => {
  let label = ''
  unref(repu_bon_status).map((item: any) => {
    if (value === item.value) {
      label = item.label
    }
  })
  return label
}

const { register, tableObject, methods } = useTable<any>({
  getListApi: getExpireListApi,
  response: {
    list: 'rows',
    total: 'total'
  }
})

const { getList, setSearchParams } = methods

getList()
provide('getList', getList)
const dictFormRef = ref<ComponentRef<typeof DictForm>>()
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
    field: 'id',
    label: '序号',
    minWidth: '80px'
  },
  {
    field: 'name',
    label: '姓名',
    minWidth: '140px',
    formatter: (row: any) => {
      return h('span', row.name ? row.name : '--')
    }
  },
  {
    field: 'expireType',
    label: '提醒类型',
    minWidth: '120px',
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        style: 'width: 196px',
        options: [
          {
            label: '试用到期',
            value: '试用到期'
          },
          { label: '合同到期', value: '合同到期' }
        ],
        placeholder: '请选择提醒类型'
      }
    },
    formatter: (row: any) => {
      return h('span', row.expireType ? row.expireType : '--')
    }
  },
  {
    field: 'expireTime',
    label: '到期时间',
    minWidth: '140px',
    formatter: (row: any) => {
      return h('span', row.expireTime ? row.expireTime : '--')
    }
  },
  {
    field: 'editTime',
    label: '处理时间',
    minWidth: '140px',
    formatter: (row: any) => {
      return h('span', row.editTime ? row.editTime : '--')
    }
  },
  {
    field: 'editName',
    minWidth: '120px',
    label: '处理人',
    formatter: (row: any) => {
      return h('span', row.editName ? row.editName : '--')
    }
  },
  {
    field: 'status',
    label: '状态',
    minWidth: '180px',
    formatter: (row: any, __: TableColumn, cellValue: string) => {
      let label: string = getElTagLabel(cellValue)
      return h(
        ElTag,
        {
          type: cellValue === '0' ? 'danger' : ''
        },
        () => label
      )
    },
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        style: 'width: 196px',
        options: repu_bon_status,
        placeholder: '状态筛选'
      }
    }
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)

//添加

//删除加载
const delLoading = ref(false)

//导出加载

//删除
const delData = async (row: any | null, multiple: boolean) => {
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
const action = (row: any, type: string) => {
  dictFormRef.value.openDrawer(type, row.dictId)
}

//导出

const params = reactive<any>({
  expireType: '',
  status: ''
})

//搜索
const setSearchParamsSub = (param: any) => {
  params.expireType = param.expireType ? param.expireType : ''
  params.status = param.status ? param.status : ''
  setSearchParams(params)
}

const jump = (row, type) => {
  personalFileManageRef.value.openDrawer(type, row.employeeId, row.id)
}

// 是否显示筛选窗口
const isShowCell = ref(false)

// 筛选列

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
  <ContentWrap Showtitle="到期提醒">
    <!-- <template #ContentWrapTitle>
      <div>
        <ElButton
          :loading="reLoading"
          class="btn-other"
          @click="handleRefreshCache()"
          plain
          v-hasPermi="'system:dict:cache'"
        >
          <Icon icon="ep:refresh" class="mr-5px" />刷新缓存
        </ElButton></div
      >
    </template> -->

    <Table
      v-model:pageSize="tableObject.pageSize"
      v-model:currentPage="tableObject.currentPage"
      :columns="allSchemas.tableColumns"
      :data="tableObject.tableList"
      :loading="tableObject.loading"
      :border="true"
      :index="true"
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
          v-if="isAuth('person:expire:list')"
          :schema="allSchemas.searchSchema"
          @search="setSearchParamsSub"
          @reset="setSearchParamsSub"
        />
      </template>
      <template #id="{ $index }">
        <span>{{
          $index + 1 + tableObject.pageSize * (tableObject.currentPage - 1)
        }}</span></template
      >
      <template #name="{ row }">
        <span
          v-if="row.name && isAuth('person:expire:examine') && row.status === '0'"
          class="text-[#00A0E9] cursor-pointer"
          @click="jump(row, 'contract')"
          >{{ row.name }}</span
        >
        <span v-else-if="row.name">{{ row.name }}</span>
        <span v-else>--</span>
      </template>
      <template #action="{ row }">
        <ElButton type="success" @click="action(row, 'see')" :text="true">
          <Icon icon="ep:warning" class="mr-5px" />详情
        </ElButton>
        <ElButton @click="action(row, 'edit')" :text="true" class="btn-default"> 编辑 </ElButton>

        <ElButton class="btn-default" @click="delData(row, false)" :text="true" size="small">
          导出
        </ElButton>
      </template>
    </Table>
    <PersonalFileManageForm title="个人档案" ref="personalFileManageRef" />
  </ContentWrap>
  <LimitDailog routerName="expirationReminder" />
</template>
<style lang="less" scoped>
:deep(.el-loading-mask) {
  top: 0px !important;
  width: 100% !important;
  left: 0px !important;
}
</style>
