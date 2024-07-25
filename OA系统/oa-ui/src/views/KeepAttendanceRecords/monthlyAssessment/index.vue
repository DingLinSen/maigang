<template>
  <ContentWrap Showtitle="月度考核审批">
    <template #ContentWrapTitle>
      <div>
        <!-- <ElButton
          class="btn-add"
          @click="add('add')"
          plain
          v-hasPermi="'person:rewardPunManage:add'"
        >
          <template #icon>
            <Icon :size="14" icon="svg-icon:addBut" />
          </template>
          新增
        </ElButton> -->
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
      :selection="false"
      :height="'62vh'"
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
          v-hasPermi="'monthlyAssessment:list:query'"
        />
      </template>
      <template #index="{ $index }">
        <span>{{
          $index + 1 + tableObject.pageSize * (tableObject.currentPage - 1)
        }}</span></template
      >
      <template #action="{ row }">
        <ElButton class="btn-default" :text="true" size="small" @click="action('see', row.id)"
          >查看
        </ElButton>
        <ElButton
          class="btn-default"
          :text="true"
          size="small"
          v-if="
            (row.status == 1 || row.status == 5) &&
            row.audit &&
            isAuth('monthlyAssessment:list:examine')
          "
          @click="action('edit', row.id)"
          >审核
        </ElButton>
        <ElButton
          class="btn-default"
          :text="true"
          size="small"
          v-if="row.status == 0 && isAuth('monthlyAssessment:list:delect')"
          @click="delData(row, false)"
          >删除
        </ElButton>
      </template>
    </Table>
    <MonthlyAssessmentDetails ref="monthlyAssessmentDetailsRef" />
  </ContentWrap>
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
import { getAuditListApi, deleteByIdApi } from '@/api/assessment/monthly'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import moment from 'moment'
import MonthlyAssessmentDetails from './monthlyAssessmentDetails.vue'
import { isAuth } from '@/utils/is'

defineOptions({
  name: 'MonthlyAssessment'
})

const filiteDeptData = ref()
const deptData = ref()
const monthlyAssessmentDetailsRef = ref()
const params = reactive<any>({
  assessmentTime: ''
})
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

// 存放表格的数据
const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'index',
    label: '序号',
    minWidth: '60px'
  },
  {
    field: 'assessmentTime',
    label: '月份',
    minWidth: '100px',
    table: {
      show: true
    },
    formatter: (row: any) => {
      return h('span', row.assessmentTime ? moment(row.assessmentTime).format('YYYY-MM') : '--')
    },
    search: {
      value: moment(new Date()).format('YYYY-MM'),
      show: true,
      component: 'DatePicker',
      componentProps: {
        type: 'month', // 组件type属性+
        format: 'YYYY-MM',
        style: 'width: 196px;margin-top:-4px'
      }
    }
  },
  {
    field: 'createByName',
    label: '考核人',
    minWidth: '120px',
    formatter: (row: any) => {
      return h('span', row.createByName ? row.createByName : '--')
    }
  },
  {
    field: 'status',
    label: '当前状态',
    minWidth: '100px',
    formatter: (row: any) => {
      return h(
        'span',
        row.status == 0
          ? '未提交'
          : row.status == 1
          ? '总结已提交'
          : row.status == 2
          ? '已考核'
          : row.status == 3
          ? '计划被驳回'
          : row.status == 4
          ? '考核中'
          : row.status == 5
          ? '计划已提交'
          : row.status == 6
          ? '总结被驳回'
          : '--'
      )
    }
  },
  {
    field: 'plannedTime',
    label: '计划通过时间',
    minWidth: '140px',
    formatter: (row: any) => {
      return h(
        'span',
        row.plannedTime ? moment(row.plannedTime).format('YYYY-MM-DD HH:mm:ss') : '--'
      )
    }
  },
  {
    field: 'apprHH:MM:SS',
    label: '总结通过时间',
    minWidth: '140px',
    formatter: (row: any) => {
      return h(
        'span',
        row.approvalTime && row.status == 2
          ? moment(row.approvalTime).format('YYYY-MM-DD HH:mm:ss')
          : '--'
      )
    }
  },

  {
    table: {
      show: false
    },
    field: 'deptId',
    label: '部门',
    width: '120px',
    formatter: (row: any) => {
      return h('span', row.deptName ? row.deptName : '--')
    },
    search: {
      show: isAuth('monthlyAssessment:list:screen'),
      component: 'Select',
      componentProps: {
        placeholder: '部门筛选',
        style: 'width: 196px',
        filterable: true,
        options: filiteDeptData
      }
    }
  },
  {
    field: 'leaderDeductionSummation',
    label: '扣分',
    minWidth: '100px',
    formatter: (row: any) => {
      return h('span', row.leaderDeductionSummation ? row.leaderDeductionSummation : '--')
    }
  },
  {
    field: 'createTime',
    label: '创建时间',
    minWidth: '140px',
    formatter: (row: any) => {
      return h('span', row.createTime ? moment(row.createTime).format('YYYY-MM-DD HH:mm:ss') : '--')
    }
  },
  {
    field: 'action',

    minWidth: '120px',
    label: '操作',
    showOverflowTooltip: false
  }
])
const { allSchemas } = useCrudSchemas(crudSchemas)
const { register, tableObject, methods } = useTable<any>({
  getListApi: getAuditListApi,
  delListApi: deleteByIdApi,
  response: {
    list: 'rows',
    total: 'total'
  },
  defaultParams: {
    assessmentTime: moment(new Date()).format('YYYY-MM')
  }
})
const { getList, setSearchParams } = methods
//打开drawer并初始化

getList()

provide('getList', getList)
//搜索
const setSearchParamsSub = (param: any) => {
  params.assessmentTime = param.assessmentTime
    ? moment(new Date(param.assessmentTime)).format('YYYY-MM')
    : ''
  params.deptId = param.deptId ? param.deptId : ''
  setSearchParams(params)
}
const ElFormRef = ref()
// 重置
const reset = (param: any) => {
  unref(ElFormRef).setValues({ assessmentTime: '' })
  params.assessmentTime = ''
  params.deptId = ''
  setSearchParams(params)
}

// 查看
const action = (type, id) => {
  monthlyAssessmentDetailsRef.value.openDrawer(type, id)
}

// 新增
const add = (type) => {
  monthlyAssessmentDetailsRef.value.openDrawer(type)
}

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

const handle = () => {}
</script>
<style lang="less">
.project-overflow-drawer {
  .el-card {
    border: 0 !important;
  }
}
</style>
