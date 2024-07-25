<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { ElButton, ElMessage } from 'element-plus'
import { Table } from '@/components/Table'
import {
  getInfoEmployeefileListApi,
  delInfoEmployeefileListApi,
  exportEmployeefileListApi
} from '@/api/person/personalFileManage'

import { useCache } from '@/hooks/web/useCache'
import { InductionData } from '@/api/person/employManage/types'
import PersonalFileManageForm from './personalFileManageForm/index.vue'
import { useTable } from '@/hooks/web/useTable'
// import { InductionData, DictTypeData, DictOptionData } from '@/api/dict/types'
import { getCurrentInstance, h, reactive, ref, unref, provide } from 'vue'
import { useEmitt } from '@/hooks/web/useEmitt'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { TableColumn } from '@/types/table'
import { useRouter } from 'vue-router'
import { isAuth } from '@/utils/is'
import { LimitDailog } from '@/views/Components/limit'

defineOptions({
  name: 'PersonalFileManage'
})
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
  getListApi: getInfoEmployeefileListApi,
  delListApi: delInfoEmployeefileListApi,
  response: {
    list: 'rows',
    total: 'total'
  }
})
const personalFileManageRef = ref()
const { getList, setSearchParams } = methods

getList()
provide('getList', getList)
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
    minWidth: '80px',
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
    minWidth: '100px',
    formatter: (row: any) => {
      return h('span', row.deptName ? row.deptName : '--')
    }
  },
  {
    field: 'initiationTime',
    minWidth: '120px',
    label: '入职时间',
    formatter: (row: any) => {
      return h('span', row.initiationTime ? row.initiationTime : '--')
    }
  },
  {
    field: 'contractExpirationTime',
    minWidth: '120px',
    label: '合同到期时间',
    formatter: (row: any) => {
      return h('span', row.contractExpirationTime ? row.contractExpirationTime : '--')
    }
  },
  {
    field: 'createTime',
    minWidth: '120px',
    label: '录入时间',
    formatter: (row: any) => {
      return h('span', row.createTime ? row.createTime : '--')
    }
  },
  {
    field: 'status',
    label: '状态',
    minWidth: '100px',
    formatter: (row: any, __: TableColumn, cellValue: string) => {
      let label: string = getElTagLabel(cellValue)
      return h(() => (label ? label : '--'))
    },
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        style: 'width: 166px',
        options: employ_status,
        placeholder: '状态筛选',
        filterable: true
      }
    }
  },
  {
    field: 'action',
    showOverflowTooltip: false,
    minWidth: '200px',
    label: '操作'
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)

//导出加载
const exLoading = ref(false)

//table操作栏按钮事件
const jump = (row, type) => {
  // router.push({ name: 'Dossier', query: { id: id, type: type } })
  personalFileManageRef.value.openDrawer(type, row.id)
}

//导出
const exportForm = async (params, name) => {
  if (tableObject.tableList.length === 0) {
    ElMessage.warning('查询无数据, 无需导出数据')
    return
  }
  exLoading.value = true
  await exportEmployeefileListApi(params, name)
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

// const handleRefreshCache = () => {
//   reLoading.value = true
//   // refreshCacheApi()
//   //   .then(() => {
//   //     ElMessage.warning('刷新成功')
//   //     useDictStore().cleanDict()
//   //   })
//   //   .finally(() => {
//   //     reLoading.value = false
//   //   })
// }

// 删除/批量删除
const delData = async (row: any, flag: boolean) => {
  tableObject.currentRow = row
  const { delList, getSelections } = methods
  const selections = await getSelections()
  await delList(
    flag ? selections.map((v) => v.id) : [tableObject.currentRow?.id as unknown as string],
    flag
  ).finally(() => {})
}
</script>

<template>
  <ContentWrap Showtitle="个人档案管理">
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
      :data="
        tableObject.tableList.sort((a, b) => {
          return a.status - b.status
        })
      "
      :loading="tableObject.loading"
      :header-align="'center'"
      :border="true"
      :cotentAlign="'center'"
      :pagination="{
        total: tableObject.total
      }"
      :isShowCell="isShowCell"
      @register="register"
    >
      <template #operateBtnLeft>
        <Search
          v-if="isAuth('person:personalFileManage:query')"
          :schema="allSchemas.searchSchema"
          @search="setSearchParamsSub"
          @reset="setSearchParamsSub"
        />
      </template>
      <template #action="{ row }">
        <ElButton
          @click="jump(row, 'edit')"
          :text="true"
          class="btn-default"
          v-hasPermi="'person:personalFileManage:edit'"
        >
          编辑
        </ElButton>
        <ElButton
          @click="jump(row, 'see')"
          :text="true"
          class="btn-default"
          v-hasPermi="'person:personalFileManage:details'"
        >
          详情
        </ElButton>
        <ElButton
          @click="delData(row, false)"
          :text="true"
          class="btn-default"
          v-hasPermi="'person:personalFileManage:del'"
        >
          删除
        </ElButton>
        <ElButton
          @click="jump(row, 'examine')"
          :text="true"
          class="btn-default"
          v-if="row.status == 2"
          v-hasPermi="'person:personalFileManage:examine'"
        >
          审核
        </ElButton>
        <!-- <ElButton type="success" @click="action(row, 'see')" :text="true">
          <Icon icon="ep:warning" class="mr-5px" />详情
        </ElButton> -->
        <ElButton
          class="btn-default"
          @click="exportForm(row.id, row.name)"
          v-if="row.status < 2 || row.status === 3"
          :text="true"
          size="small"
        >
          导出
        </ElButton>
      </template>
    </Table>
    <PersonalFileManageForm title="个人档案" ref="personalFileManageRef" />
    <LimitDailog routerName="personalFileManage" />
  </ContentWrap>
</template>
<style lang="less" scoped>
:deep(.el-loading-mask) {
  top: 0px !important;
  width: 100% !important;
  left: 0px !important;
}
</style>
