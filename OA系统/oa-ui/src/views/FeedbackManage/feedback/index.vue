<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { ElButton, ElMessageBox, ElTag, ElMessage } from 'element-plus'
import { Table } from '@/components/Table'
import { useTable } from '@/hooks/web/useTable'
import { getCurrentInstance, h, reactive, ref, onMounted } from 'vue'
import { useEmitt } from '@/hooks/web/useEmitt'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { TableColumn } from '@/types/table'
import moment from 'moment'
import { isAuth } from '@/utils/is' // 鉴权
import { useCache } from '@/hooks/web/useCache'
import { LimitDailog } from '@/views/Components/limit'
import { FormSchema } from '@/types/form'
import { getAllDeptListApi } from '@/api/sys/dept'
import { listToTree } from '@/utils/tree'
import { getMyOrderListApi } from '@/api/order'
import { FeedbackForm, FeedbackArrproval } from './components'
import { FeedbackBean } from '@/api/feedback/types'
import { getFeedbackListApi } from '@/api/feedback'

defineOptions({
  name: 'Feedback'
})

const { proxy } = getCurrentInstance() as any
const { feedback_type } = proxy.useDict('feedback_type')

onMounted(() => {
  getDeptTreeList()
})
// 左侧树形数据
const treedata = ref<any>([])
// 获取部门树
const getDeptTreeList = async () => {
  try {
    if (treedata.value.length > 0) {
      return
    }
    const res = await getAllDeptListApi({})
    if (res) {
      treedata.value = listToTree(res.data, {
        id: 'deptId',
        children: 'children',
        pid: 'parentId'
      })
    }
  } catch (err) {}
}

const { wsCache } = useCache()
const loginUserId = ref<string>(wsCache.get('userInfo').userId) // 登录用户id

const { register, tableObject, methods } = useTable<FeedbackBean>({
  getListApi: getFeedbackListApi,
  response: {
    list: 'rows',
    total: 'total'
  }
})

const { getList, setSearchParams } = methods

getList()
const { emitter } = useEmitt()
useEmitt({
  name: 'feedback',
  callback: (type: string) => {
    if (type === 'refresh') {
      tableObject.currentPage = 1
    }
    getList()
  }
})

//获取意见类型
const getFeedbackTypeLabel = (value: string): string => {
  let label = '--'
  if (value) {
    feedback_type.value.forEach((item: any) => {
      if (value.toString() === item.value) {
        label = item.label
      }
    })
  }

  return label
}

//列表属性
const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'index',
    label: '序号',
    minWidth: '60px'
  },
  {
    field: 'title',
    minWidth: '140px',
    label: '标题',
    formatter: (row: Recordable) => {
      return h('span', row.title ? row.title : '--')
    }
  },
  {
    field: 'content',
    label: '内容',
    minWidth: '260px',
    formatter: (row: Recordable, __: TableColumn, cellValue: string) => {
      return h('span', row.content ? row.content : '--')
    }
  },
  {
    field: 'type',
    label: '意见类型',
    minWidth: '90px',
    formatter: (row: Recordable, __: TableColumn, cellValue: string) => {
      return h('span', row.type ? getFeedbackTypeLabel(row.type) : '--')
    }
  },
  {
    field: 'createUserName',
    minWidth: '90px',
    label: '建议人',
    formatter: (row: Recordable) => {
      return h('span', row.createUserName ? row.createUserName : '--')
    }
  },
  {
    field: 'status',
    label: '状态',
    minWidth: '100px',
    formatter: (row: Recordable, __: TableColumn, cellValue: string) => {
      return h(
        ElTag,
        {
          type:
            cellValue === '0'
              ? 'primary'
              : cellValue === '1'
              ? 'warning'
              : cellValue === '2'
              ? 'danger'
              : cellValue === '3'
              ? 'success'
              : 'danger'
        },
        () =>
          cellValue === '0'
            ? '未审核'
            : cellValue === '1'
            ? '待评估'
            : cellValue === '2'
            ? '已驳回'
            : cellValue === '3'
            ? '已通过'
            : '--'
      )
    }
  },

  {
    field: 'createTime',
    minWidth: '140px',
    label: '建议时间',
    formatter: (row: Recordable) => {
      return h('span', row.createTime ? moment(row.createTime).format('YYYY-MM-DD HH:mm:ss') : '--')
    }
  },
  // {
  //   field: 'auditTime',
  //   minWidth: '140px',
  //   label: '通过/驳回时间',
  //   formatter: (row: Recordable) => {
  //     return h('span', row.auditTime ? moment(row.auditTime).format('YYYY-MM-DD HH:mm:ss') : '--')
  //   }
  // },
  {
    field: 'action',
    fixed: 'right',
    minWidth: '120px',
    label: '操作',
    showOverflowTooltip: false
  }
])

const searchSchema = reactive<FormSchema[]>([
  {
    field: 'month',
    label: '',
    component: 'DatePicker',
    componentProps: {
      placeholder: '月份筛选',
      filterable: true,
      type: 'month',
      format: 'YYYY-MM',
      valueFormat: 'YYYY-MM',
      style: 'width: 11vw'
    }
  },
  {
    field: 'deptId',
    label: '',
    component: 'Cascader',
    componentProps: {
      style: 'width: 196px',
      options: treedata,
      props: {
        label: 'deptName',
        value: 'deptId'
      },
      filterable: true,
      placeholder: '部门筛选'
    }
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)

//查询参数
const params = reactive<Recordable>({
  month: '',
  deptId: ''
})

//搜索
const setSearchParamsSub = (param: Recordable) => {
  params.month = param.month ? moment(param.month).format('YYYY-MM') : ''
  params.deptId = param.deptId ? param.deptId[param.deptId.length - 1] : ''
  setSearchParams(params)
}

//详情
const feedbackFormRef = ref<ComponentRef<typeof FeedbackForm>>()
const feedbackArrprovalRef = ref<ComponentRef<typeof FeedbackArrproval>>()
const action = (row: any, type: string) => {
  if (type == 'add') {
    feedbackFormRef.value.openDrawer(type, '')
  } else {
    feedbackArrprovalRef.value.openDrawer(type, row.id)
  }
}
</script>

<template>
  <ContentWrap Showtitle="意见反馈">
    <Table
      v-model:pageSize="tableObject.pageSize"
      v-model:currentPage="tableObject.currentPage"
      :columns="allSchemas.tableColumns"
      :data="tableObject.tableList"
      :loading="tableObject.loading"
      :border="true"
      :selection="false"
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
          v-if="isAuth('feedback:feedback:query')"
          :schema="searchSchema"
          @search="setSearchParamsSub"
          @reset="setSearchParamsSub"
        />
      </template>
      <template #operateBtnRight>
        <div class="mr-[10px]" v-if="isAuth('feedback:feedback:save')">
          <ElButton class="btn-add" @click="action(null, 'add')" plain>
            <template #icon> <Icon :size="14" icon="svg-icon:addBut" /> </template>
            新增
          </ElButton>
        </div>
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
          @click="action(row, 'see')"
          v-if="isAuth('feedback:feedback:detail')"
        >
          详情
        </ElButton>
        <ElButton
          class="btn-default"
          :text="true"
          @click="action(row, 'approve')"
          v-if="isAuth('feedback:feedback:audit') && row.authFlag == '0'"
        >
          审核
        </ElButton>
      </template>
    </Table>
  </ContentWrap>
  <FeedbackForm ref="feedbackFormRef" title="意见反馈" />
  <FeedbackArrproval ref="feedbackArrprovalRef" />
  <LimitDailog routerName="Feedback" />
</template>
