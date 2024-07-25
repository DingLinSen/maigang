<template>
  <ContentWrap Showtitle="积分明细">
    <template #ContentWrapTitle>
      <div>
        <ElButton
          v-if="isAuth('point:record:export')"
          :loading="exLoading"
          class="exportBtn"
          plain
          @click="exportForm()"
        >
          <template #icon>
            <Icon :size="14" icon="svg-icon:exportBut" />
          </template>
          导出
        </ElButton>
      </div>
    </template>
    <Table
      v-model:pageSize="tableObject.pageSize"
      v-model:currentPage="tableObject.currentPage"
      :columns="allSchemas.tableColumns"
      :data="tableObject.tableList"
      :loading="tableObject.loading"
      :border="true"
      :isShowCell="isShowCell"
      :header-align="'center'"
      :cotentAlign="'center'"
      :pagination="{
        total: tableObject.total
      }"
      @sort-change="tableSortChange"
      @select-all="selectAll"
      @select="selectOne"
      @register="register"
    >
      <template #operateBtnLeft>
        <Search
          ref="searchRef"
          v-if="isAuth('point:record:query')"
          :schema="allSchemas.searchSchema"
          @search="setSearchParamsSub"
          @reset="setSearchParamsSub"
        />
      </template>
      <template #index="{ $index }">
        <span>{{ $index + 1 + tableObject.pageSize * (tableObject.currentPage - 1) }}</span>
      </template>
      <template #action="{ row }">
        <ElButton
          class="btn-default"
          :text="true"
          @click="action(row, 'see')"
          v-if="isAuth('point:record:detail')"
        >
          详情
        </ElButton>
      </template>
    </Table>
  </ContentWrap>
  <PointRecordForm ref="pointRecordFormRef" title="积分明细" />
  <LimitDailog routerName="PointRecord" />
</template>
<script setup lang="ts">
import { LimitDailog } from '@/views/Components/limit'
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Table } from '@/components/Table'
import { useTable } from '@/hooks/web/useTable'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { TableColumn } from '@/types/table'
import { isAuth } from '@/utils/is' // 鉴权
import { getPointRecordListApi, exportPointRecordApi } from '@/api/point'
import { useEmitt } from '@/hooks/web/useEmitt'
import { h, nextTick, onMounted, reactive, ref } from 'vue'
import moment from 'moment'
import { FormSchema } from '@/types/form'
import { getAllDeptListApi } from '@/api/sys/dept'
import { listToTree } from '@/utils/tree'
import { getAllUserListApi } from '@/api/user' // 获取所有用户
import { PointRecordForm } from '../Form'
import { ElMessage } from 'element-plus'

defineOptions({
  name: 'PointRecord'
})

const { register, tableObject, methods } = useTable<any>({
  getListApi: getPointRecordListApi,
  response: {
    list: 'rows',
    total: 'total'
  }
})

const { getList, setSearchParams } = methods

//查询参数
const params = reactive<Recordable>({
  deptId: '',
  userId: '',
  beginTime: '',
  endTime: '',
  type: ''
})

//监听刷新
useEmitt({
  name: 'pointRecord',
  callback: (type: string) => {
    if (type === 'refresh') {
      tableObject.currentPage = 1
    }
    getList()
  }
})
getList()
//部门人员整合后的数据
const principalTree = ref<any>([])

onMounted(() => {
  getDeptTreeList()
  getAllUserlist()
})
// 左侧树形数据
const deptData = ref<any>([])
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

const getAllUserlist = async () => {
  const res0 = await getAllDeptListApi({})
  deptData.value = res0.data
  const res = await getAllUserListApi({})
  let userData = res.data
  userData.reverse()
  if (deptData.value.length) {
    deptData.value.forEach((deptItem: any) => {
      userData.forEach((userItem: any) => {
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

const orderType = ref<any>([
  {
    label: '奖分',
    value: '1'
  },
  {
    label: '扣分',
    value: '2'
  }
])

const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'index',
    label: '序号',
    minWidth: '60px'
  },
  {
    field: 'deptName',
    minWidth: '120px',
    label: '部门',
    formatter: (row: Recordable) => {
      return h('span', row.deptName ? row.deptName : '--')
    },
    search: {
      show: true,
      component: 'Cascader',
      componentProps: {
        style: 'width: 11vw',
        options: treedata,
        props: {
          label: 'deptName',
          value: 'deptId'
        },
        filterable: true,
        placeholder: '部门筛选'
      }
    }
  },
  {
    field: 'userName',
    minWidth: '90px',
    label: '姓名',
    formatter: (row: Recordable) => {
      return h('span', row.userName ? row.userName : '--')
    },
    search: {
      show: true,
      component: 'Cascader',
      componentProps: {
        placeholder: '姓名筛选',
        filterable: true,
        options: principalTree,
        style: 'width: 11vw',
        props: {
          label: 'deptName',
          value: 'deptId'
        }
      }
    }
  },

  {
    field: 'fraction',
    minWidth: '80px',
    label: '积分',
    formatter: (row: Recordable) => {
      return h('span', row.fraction ? row.fraction : '0')
    }
  },
  {
    field: 'cash',
    minWidth: '80px',
    label: '现金价值',
    formatter: (row: Recordable) => {
      return h('span', row.cash ? row.cash : '0')
    }
  },
  {
    field: 'fractionSum',
    minWidth: '80px',
    label: '总积分',
    formatter: (row: Recordable) => {
      return h('span', row.fractionSum ? row.fractionSum : '0')
    }
  },
  {
    field: 'type',
    minWidth: '80px',
    label: '类型',
    formatter: (row: Recordable) => {
      return h('span', row.type == '1' ? '奖分' : '扣分')
    },
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        placeholder: '类型筛选',
        style: 'width: 11vw',
        options: orderType,
        filterable: true
      }
    }
  },
  {
    field: 'createTime',
    minWidth: '140px',
    label: '创建时间',
    formatter: (row: Recordable) => {
      return h('span', row.createTime ? moment(row.createTime).format('YYYY-MM-DD HH:mm:ss') : '--')
    },
    search: {
      show: true,
      component: 'DatePicker',
      componentProps: {
        style: 'width: 16vw',
        type: 'daterange',
        format: 'YYYY-MM-DD',
        startPlaceholder: '开始时间',
        endPlaceholder: '结束时间'
      }
    }
  },
  {
    field: 'action',
    fixed: 'right',
    minWidth: '100px',
    label: '操作',
    showOverflowTooltip: false
  }
])
const { allSchemas } = useCrudSchemas(crudSchemas)

//搜索
const setSearchParamsSub = (param: Recordable) => {
  let beginTime = param.createTime
    ? moment(param.createTime[0]).format('YYYY-MM-DD') + ' 00:00:00'
    : ''
  let endTime = param.createTime
    ? moment(param.createTime[1]).format('YYYY-MM-DD') + ' 23:59:59'
    : ''
  params.beginTime = beginTime
  params.endTime = endTime
  params.type = param.type ? param.type : ''
  params.userId = param.userName ? param.userName[param.userName.length - 1] : ''
  params.deptId = param.deptName ? param.deptName[param.deptName.length - 1] : ''
  setSearchParams(params)
}
//
const pointRecordFormRef = ref()
const action = (row: any, flag: string) => {
  if (flag === 'see') {
    pointRecordFormRef.value.openDrawer(row.id, flag)
  }
}

//导出
const exLoading = ref(false)
const exportForm = async () => {
  if (tableObject.tableList.length === 0) {
    ElMessage.warning('查询无数据, 无需导出数据')
    return
  }
  exLoading.value = true
  await exportPointRecordApi(params)
  exLoading.value = false
}
</script>
  
<style lang="less" scoped>
</style>
    