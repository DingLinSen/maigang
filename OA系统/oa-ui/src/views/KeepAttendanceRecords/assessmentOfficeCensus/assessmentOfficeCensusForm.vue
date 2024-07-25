<template>
  <DrawerWrap title="考核详情" :isShow="isShow" ref="drawerWrap" class="project-overflow-drawer">
    <template #content>
      <!-- 表格 -->
      <Table
        :isShowFilter="true"
        :border="true"
        ref="ElTableRef"
        v-model:pageSize="tableObject.pageSize"
        v-model:currentPage="tableObject.currentPage"
        :data="tableObject.tableList"
        :loading="tableObject.loading"
        :columns="allSchemas.tableColumns"
        :header-align="'center'"
        :cotentAlign="'center'"
        :pagination="{
          total: tableObject.total
        }"
        @register="register"
      >
        <template #operateBtnLeft>
          <Search
            v-hasPermi="'censusForm:detail:query'"
            :schema="allSchemas.searchSchema"
            ref="ElFormRef"
            @search="setSearchParamsSub"
            @reset="reset"
          />
        </template>
        <template #operateBtnRight>
          <ElButton
            class="btn-add"
            v-hasPermi="'censusForm:detail:export'"
            @click="exportForm()"
            plain
          >
            导出
          </ElButton>
        </template>
        <template #index="{ $index }">
          <span>{{
            $index + 1 + tableObject.pageSize * (tableObject.currentPage - 1)
          }}</span></template
        >
        <template #action="{ row }">
          <ElButton
            v-if="row.isRead == 0"
            class="btn-default"
            :text="true"
            size="small"
            @click="handle(row)"
            >处理
          </ElButton>
        </template>
      </Table>
    </template>
  </DrawerWrap>
</template>
<script setup lang="ts">
import { ref, reactive, h, unref, nextTick } from 'vue'
import { Table } from '@/components/Table'
import { Search } from '@/components/Search'
import { useTable } from '@/hooks/web/useTable'
import {
  getDetailListApi,
  getAssessmentDetailExport
} from '@/api/assessment/assessmentOfficeCensus'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import moment from 'moment'
import { DrawerWrap } from '@/components/DrawerWrap'
import { useRouter } from 'vue-router'

const drawerWrap = ref<ComponentRef<typeof DrawerWrap>>()
const isShow = ref(false)
const ElFormRef = ref()
const params = reactive<any>({
  startTime: '',
  endTime: '',
  username: ''
})

const startTimeChange = async (e) => {
  const model = await unref(ElFormRef).getFormData()
  if (new Date(e).getTime() > new Date(model.endTime).getTime()) {
    unref(ElFormRef).setValues({ endTime: '' })
    params.endTime = ''
  }
}

const endTimeChange = async (e) => {
  const model = await unref(ElFormRef).getFormData()
  if (new Date(e).getTime() < new Date(model.startTime).getTime()) {
    unref(ElFormRef).setValues({ startTime: '' })
    params.startTime = ''
  }
}

// 存放表格的数据
const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'index',
    label: '序号',
    minWidth: '80px'
  },
  {
    field: 'startTime',
    table: {
      show: false
    },
    value: moment().startOf('months').format('YYYY-MM-DD'),
    search: {
      show: true,
      value: moment().startOf('months').format('YYYY-MM-DD'),
      component: 'DatePicker',
      componentProps: {
        onChange: startTimeChange,
        style: 'margin-top: -5px',
        type: 'month', // 组件type属性+
        format: 'YYYY-MM',
        placeholder: '开始时间'
      }
    }
  },
  {
    field: 'endTime',
    table: {
      show: false
    },
    value: moment().startOf('months').format('YYYY-MM-DD'),
    search: {
      show: true,
      value: moment().startOf('months').format('YYYY-MM-DD'),
      component: 'DatePicker',
      componentProps: {
        onChange: endTimeChange,
        style: 'margin-top: -5px',
        type: 'month', // 组件type属性+
        format: 'YYYY-MM',
        placeholder: '结束时间'
      }
    }
  },
  {
    field: 'username',
    label: '姓名',
    minWidth: '120px',
    formatter: (row: Recordable) => {
      return h('span', row.username ? row.username : '--')
    },
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        style: 'width: 196px',
        placeholder: '请输入姓名'
      }
    }
  },
  {
    field: 'fraction',
    label: '扣分分数',
    minWidth: '140px',
    formatter: (row: Recordable) => {
      return h('span', row.fraction ? row.fraction : '--')
    }
  },
  {
    field: 'time',
    label: '扣分日期',
    minWidth: '120px',
    formatter: (row: Recordable) => {
      return h('span', row.time ? moment(row.time).format('YYYY-MM') : '--')
    }
  },
  {
    field: 'deductionReason',
    label: '扣分理由',
    minWidth: '180px',
    formatter: (row: Recordable) => {
      return h('span', row.deductionReason ? row.deductionReason : '--')
    }
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)
const { register, tableObject, methods } = useTable<any>({
  getListApi: getDetailListApi,
  response: {
    list: 'rows',
    total: 'total'
  }
})
const { getList, setSearchParams } = methods

//搜索
const setSearchParamsSub = (param: any) => {
  params.startTime = param.startTime ? moment(param.startTime).format('YYYY-MM') : ''
  params.endTime = param.endTime ? moment(param.endTime).format('YYYY-MM') : ''
  params.username = param.username ? param.username : ''
  setSearchParams(params)
}
// 重置
const reset = (param: any) => {
  unref(ElFormRef).setValues({ startTime: '', endTime: '' })
  params.startTime = ''
  params.endTime = ''
  params.username = ''
  setSearchParams(params)
}

//打开drawer并初始化
const openDrawer = (data) => {
  drawerWrap.value.isShow = true

  console.log(data)
  params.deptId = data.deptId
  params.startTime = data.startTime
  params.endTime = data.endTime

  nextTick(() => {
    unref(ElFormRef).setValues({ startTime: data.startTime, endTime: data.endTime })
  })

  setSearchParams(params)
}

const exportForm = async (id) => {
  let data = {
    startTime: params.startTime ? params.startTime : moment().format('YYYY-MM'),
    endTime: params.endTime ? params.endTime : moment().format('YYYY-MM'),
    deptId: params.deptId ? params.deptId : ''
  }
  let res = await getAssessmentDetailExport(data)
}

defineExpose({
  isShow,
  openDrawer
})
</script>
<style lang="less">
.project-overflow-drawer {
  .el-card {
    border: 0 !important;
  }
}
</style>
