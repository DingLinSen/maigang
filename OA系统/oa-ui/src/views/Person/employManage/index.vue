<script setup lang="ts">
import EmployManageForm from './employManageForm/index.vue'
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { ElButton, ElMessageBox, ElTag, ElMessage } from 'element-plus'
import { Table } from '@/components/Table'
import { useCache } from '@/hooks/web/useCache'
import { getEmployListApi, delEmployListApi, exportEmployListApi } from '@/api/person/employManage'
import { InductionData } from '@/api/person/employManage/types'
import { useTable } from '@/hooks/web/useTable'
import { getCurrentInstance, h, reactive, ref, unref, provide } from 'vue'
import { useEmitt } from '@/hooks/web/useEmitt'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { TableColumn } from '@/types/table'
import { useRouter } from 'vue-router'
import moment from 'moment'
import useDictStore from '@/store/modules/appDict'
import { isAuth } from '@/utils/is'
import { LimitDailog } from '@/views/Components/limit'

defineOptions({
  name: 'EmployManage'
})
const { wsCache } = useCache()
const router = useRouter()
const { proxy } = getCurrentInstance() as any
const { employ_status } = proxy.useDict('employ_status')

const getElTagLabel = (value: string): string => {
  let label = ''
  unref(employ_status).map((item: any) => {
    if (value == item.value) {
      label = item.label
    }
  })
  return label
}

const { register, tableObject, methods } = useTable<InductionData>({
  getListApi: getEmployListApi,
  delListApi: delEmployListApi,
  response: {
    list: 'rows',
    total: 'total'
  }
})

const { getList, setSearchParams } = methods

getList()
provide('getList', getList)
const employManageRef = ref()

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
    label: '姓名',
    minWidth: '180px',
    search: {
      show: true,
      componentProps: {
        style: 'width: 196px',
        placeholder: '请输入姓名'
      }
    }
  },
  {
    field: 'deptName',
    label: '部门',
    minWidth: '180px',
    formatter: (row: any) => {
      return h('span', row.deptName ? row.deptName : '--')
    }
  },
  {
    field: 'initiationTime',
    minWidth: '160px',
    label: '入职时间',
    formatter: (row: any) => {
      return h('span', row.initiationTime ? row.initiationTime : '--')
    }
  },
  {
    field: 'status',
    label: '状态',
    minWidth: '180px',
    formatter: (row: any, __: TableColumn, cellValue: string) => {
      let label: string = getElTagLabel(cellValue)
      return h(() => (label ? label : '--'))
    },
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        style: 'width: 196px',
        options: employ_status,
        placeholder: '状态筛选',
        filterable: true
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

//导出加载
const exLoading = ref(false)

//table操作栏按钮事件
const jump = (row, type) => {
  employManageRef.value.openDrawer(type, row.id)
}

//导出
const exportForm = async (params, name) => {
  if (tableObject.tableList.length === 0) {
    ElMessage.warning('查询无数据, 无需导出数据')
    return
  }
  exLoading.value = true
  await exportEmployListApi(params, name)
  exLoading.value = false
}

const params = reactive<any>({
  name: '',
  status: ''
})

//搜索
const setSearchParamsSub = (param: any) => {
  params.name = param.name ? param.name : ''
  params.status = param.status || param.status === 0 ? param.status : ''
  setSearchParams(params)
}

// 是否显示筛选窗口
const isShowCell = ref(false)

/** 刷新缓存按钮操作 */
const reLoading = ref<boolean>(false)

const handleRefreshCache = () => {
  reLoading.value = true
  // refreshCacheApi()
  //   .then(() => {
  //     ElMessage.warning('刷新成功')
  //     useDictStore().cleanDict()
  //   })
  //   .finally(() => {
  //     reLoading.value = false
  //   })
}
</script>

<template>
  <ContentWrap Showtitle="入职申请管理">
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
        </ElButton>
      </div>
    </template> -->

    <Table
      v-model:pageSize="tableObject.pageSize"
      v-model:currentPage="tableObject.currentPage"
      :columns="allSchemas.tableColumns"
      :data="
        tableObject.tableList.sort((a, b) => {
          return a.status - b.status
        })
      "
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
          v-if="isAuth('person:employManage:query')"
          :schema="allSchemas.searchSchema"
          @search="setSearchParamsSub"
          @reset="setSearchParamsSub"
        />
      </template>
      <template #action="{ row }">
        <ElButton
          @click="jump(row, 'see')"
          :text="true"
          class="btn-default"
          v-hasPermi="'person:employManage:details'"
        >
          详情
        </ElButton>
        <!-- <ElButton type="success" @click="action(row, 'see')" :text="true">
          <Icon icon="ep:warning" class="mr-5px" />详情
        </ElButton> -->
        <ElButton
          class="btn-default"
          v-if="row.status < 2 || row.status === 3"
          v-hasPermi="'person:employManage:export'"
          @click="exportForm(row.id, row.name)"
          :text="true"
          size="small"
        >
          导出
        </ElButton>
        <ElButton
          @click="jump(row, 'examine')"
          :text="true"
          class="btn-default"
          v-if="row.status == 2"
          v-hasPermi="'person:employManage:examine'"
        >
          审核
        </ElButton>
      </template>
    </Table>
    <EmployManageForm title="入职管理" ref="employManageRef" />
  </ContentWrap>
  <LimitDailog routerName="employManage" />
</template>
<style lang="less" scoped>
:deep(.el-loading-mask) {
  top: 0px !important;
  width: 100% !important;
  left: 0px !important;
}
</style>
