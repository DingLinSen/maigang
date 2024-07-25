<template>
  <ContentWrap Showtitle="考核数据统计">
    <template #ContentWrapTitle>
      <div>
        <ElButton class="btn-add" @click="exportForm()" plain v-hasPermi="'censusForm:list:export'">
          导出
        </ElButton>
      </div>
    </template>
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
          ref="ElFormRef"
          :schema="allSchemas.searchSchema"
          @search="setSearchParamsSub"
          @reset="reset"
          v-hasPermi="'censusForm:list:query'"
        />
      </template>
      <template #index="{ $index }">
        <span>{{
          $index + 1 + tableObject.pageSize * (tableObject.currentPage - 1)
        }}</span></template
      >
      <template #action="{ row }">
        <ElButton
          class="btn-default"
          :text="true"
          size="small"
          @click="action(row.deptId)"
          v-hasPermi="'censusForm:list:detail'"
          >查看
        </ElButton>
      </template>
    </Table>
    <AssessmentOfficeCensusForm ref="assessmentOfficeCensusFormRef" />
  </ContentWrap>
  <LimitDailog routerName="daily" />
</template>
<script setup lang="ts">
import { listToTree } from '@/utils/tree'
import { getAllUserListApi } from '@/api/user' // 获取所有用户
import { getAllDeptListApi } from '@/api/sys/dept' // 获取所有部门
import { ContentWrap } from '@/components/ContentWrap'
import { ref, reactive, h, provide, unref } from 'vue'
import { Table } from '@/components/Table'
import { Search } from '@/components/Search'
import { useTable } from '@/hooks/web/useTable'
import { getListApi, getAssessmentExport } from '@/api/assessment/assessmentOfficeCensus'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import moment from 'moment'
import AssessmentOfficeCensusForm from './assessmentOfficeCensusForm.vue'
import { useCache } from '@/hooks/web/useCache'
import { LimitDailog } from '@/views/Components/limit'
const assessmentOfficeCensusFormRef = ref()
const params = reactive<any>({
  startTime: '',
  endTime: '',
  deptId: ''
})

defineOptions({
  name: 'AssessmentOfficeCensus'
})
//部门数据
let deptData = ref<any>([])
const filiteDeptData = ref<any>([])
//人员数据
const userData = ref<any>([])
//部门人员整合后的数据
const principalTree = ref<any>([])
const getAllUserlist = async () => {
  try {
    const res = await getAllDeptListApi({})
    const { data } = await getAllUserListApi({})
    deptData.value = res.data

    filiteDeptData.value = res.data.map((v) => {
      return {
        value: v.deptId,
        label: v.deptName
      }
    })
    userData.value = data
    userData.value.reverse()
    getprincipalTree()

    return data
  } catch (error) {
    console.log(error)
  }
}
const getprincipalTree = async () => {
  if (deptData.value.length) {
    deptData.value.forEach((deptItem: any) => {
      userData.value.forEach((userItem: any) => {
        if (deptItem.deptId === userItem.deptId) {
          deptItem.children.push({
            deptId: userItem.userId,
            deptName: userItem.nickName
          })
        }
      })
    })
    principalTree.value = listToTree(deptData.value, {
      id: 'deptId',
      children: 'children',
      pid: 'parentId'
    })
  }
}
getAllUserlist()

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
    field: 'deptName',
    label: '部门',
    minWidth: '120px',
    table: {
      show: true
    },
    formatter: (row: any) => {
      return h('span', row.deptName ? row.deptName : '--')
    }
  },
  {
    field: 'startTime',
    table: {
      show: false
    },
    value: moment().format('YYYY-MM-DD'),
    search: {
      show: true,
      value: moment().format('YYYY-MM-DD'),
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
    value: moment().format('YYYY-MM-DD'),
    search: {
      show: true,
      value: moment().format('YYYY-MM-DD'),
      component: 'DatePicker',
      componentProps: {
        onChange: endTimeChange,
        type: 'month', // 组件type属性+
        format: 'YYYY-MM',
        style: 'margin-top: -5px',
        placeholder: '结束时间'
      }
    }
  },

  {
    field: 'people',
    label: '考核人数',
    minWidth: '120px',
    formatter: (row: any) => {
      return h('span', row.people ? row.people : '0')
    }
  },
  {
    field: 'checkedCount',
    label: '已考核人次',
    minWidth: '140px',
    formatter: (row: any) => {
      return h('span', row.checkedCount ? row.checkedCount : '0')
    }
  },
  {
    field: 'waitCount',
    label: '待考核人次',
    minWidth: '140px',
    formatter: (row: any) => {
      return h('span', row.waitCount ? row.waitCount : '0')
    }
  },
  {
    field: 'deptId',
    table: {
      show: false
    },
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        placeholder: '部门筛选',
        filterable: true,
        options: filiteDeptData,
        style: 'width: 196px',
        props: {
          label: 'deptName',
          value: 'deptId'
        }
      }
    }
  },
  {
    field: 'pointsPeople',
    label: '扣分人次',
    minWidth: '120px',
    formatter: (row: any) => {
      return h('span', row.pointsPeople ? row.pointsPeople : '0')
    }
  },
  {
    field: 'fraction',
    fixed: 'right',
    minWidth: '120px',
    formatter: (row: any) => {
      return h('span', row.fraction ? row.fraction : '0')
    },
    label: '扣分分数',
    showOverflowTooltip: false
  },
  {
    field: 'action',
    fixed: 'right',
    minWidth: '120px',
    label: '操作',
    showOverflowTooltip: false
  }
])
const { allSchemas } = useCrudSchemas(crudSchemas)
const { register, tableObject, methods } = useTable<any>({
  getListApi: getListApi,
  response: {
    list: 'rows',
    total: 'total'
  },
  defaultParams: {
    startTime: moment().format('YYYY-MM'),
    endTime: moment().format('YYYY-MM')
  }
  // props: {
  //   workDate: moment(new Date()).format('YYYY-MM')
  // }
})
const { getList, setSearchParams } = methods
//打开drawer并初始化

getList()

const ElTableRef = ref()
const ElFormRef = ref()
provide('getList', getList)
//搜索
const setSearchParamsSub = (param: any) => {
  params.startTime = param.startTime ? moment(param.startTime).format('YYYY-MM') : ''
  params.endTime = param.endTime ? moment(param.endTime).format('YYYY-MM') : ''
  params.deptId = param.deptId ? param.deptId : ''
  setSearchParams(params)
}
// 重置
const reset = (param: any) => {
  params.startTime = param.startTime ? moment(param.startTime).format('YYYY-MM') : ''
  params.endTime = param.endTime ? moment(param.endTime).format('YYYY-MM') : ''
  params.deptId = ''
  setSearchParams(params)
}
// 查看
const action = (id) => {
  params.startTime = params.startTime ? params.startTime : moment().format('YYYY-MM')
  params.endTime = params.endTime ? params.endTime : moment().format('YYYY-MM')
  params.deptId = id
  assessmentOfficeCensusFormRef.value.openDrawer(params)
}
const delLoading = ref(false)

const exportForm = async (id) => {
  let data = {
    startTime: params.startTime ? params.startTime : moment().format('YYYY-MM'),
    endTime: params.endTime ? params.endTime : moment().format('YYYY-MM')
  }
  let res = await getAssessmentExport(data)
}

const handle = () => {}
</script>
<style lang="less">
.project-overflow-drawer {
  .el-card {
    border: 0 !important;
  }
}
</style>
