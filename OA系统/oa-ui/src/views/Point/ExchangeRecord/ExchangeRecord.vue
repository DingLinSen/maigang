<template>
  <ContentWrap Showtitle="积分兑换">
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
          v-if="isAuth('point:exchange:query')"
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
          v-if="isAuth('point:exchange:detail')"
        >
          详情
        </ElButton>
        <ElButton
          class="btn-default"
          :text="true"
          @click="action(row, 'buy')"
          v-if="isAuth('point:exchange:buy') && row.status == '1' && checkRolesFlag()"
        >
          采购
        </ElButton>
        <ElButton
          class="btn-default"
          :text="true"
          @click="action(row, 'receive')"
          v-if="isAuth('point:exchange:receive') && row.status == '2' && checkRolesFlag()"
        >
          领取
        </ElButton>
      </template>
    </Table>
  </ContentWrap>
  <ExchangeForm ref="exchangeFormRef" title="积分兑换" />
  <LimitDailog routerName="ExchangeRecord" />
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
import { useEmitt } from '@/hooks/web/useEmitt'
import { getCurrentInstance, h, nextTick, onMounted, reactive, ref } from 'vue'
import moment from 'moment'
import { FormSchema } from '@/types/form'
import { getAllDeptListApi } from '@/api/sys/dept'
import { listToTree } from '@/utils/tree'
import { getAllUserListApi } from '@/api/user' // 获取所有用户
import { ExchangeForm } from '../Form'
import { useCache } from '@/hooks/web/useCache'
import { ElMessage, ElMessageBox, ElTag } from 'element-plus'
import { getExchangeListApi, buyOrReceiveGoodsApi } from '@/api/point'

defineOptions({
  name: 'ExchangeRecord'
})

const { wsCache } = useCache()

// 综合部普通员工可见
const rolesFlag = ref(false)
const { proxy } = getCurrentInstance() as any
const { role } = proxy.useDict('role')

const checkRolesFlag = () => {
  role.value.forEach((element: any) => {
    if (element.label == '综合部普通员工') {
      if (wsCache.get('userInfo').roles.length) {
        let flag = wsCache.get('userInfo').roles.some((v) => {
          return v.roleId == Number(element.value)
        })
        rolesFlag.value = flag
      }
    }
  })
  return rolesFlag.value
}

checkRolesFlag()

const { register, tableObject, methods } = useTable<any>({
  getListApi: getExchangeListApi,
  response: {
    list: 'rows',
    total: 'total'
  }
})

const { getList, setSearchParams } = methods

//查询参数
const params = reactive<Recordable>({
  deptId: '',
  createBy: '',
  beginTime: '',
  endTime: '',
  status: ''
})

//监听刷新
useEmitt({
  name: 'exchangeRecord',
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

//1待采购 2采购中 3已领取
const statusArray = ref<any>([
  {
    label: '待采购',
    value: '1'
  },
  {
    label: '采购中',
    value: '2'
  },
  {
    label: '已领取',
    value: '3'
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
    table: {
      show: false
    },
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
    field: 'createByName',
    minWidth: '100px',
    label: '申请人',
    formatter: (row: Recordable) => {
      return h('span', row.createByName ? row.createByName : '--')
    },
    search: {
      show: true,
      component: 'Cascader',
      componentProps: {
        placeholder: '申请人筛选',
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
    field: 'shopName',
    minWidth: '140px',
    label: '商品名称',
    formatter: (row: Recordable) => {
      return h('span', row.shopName ? row.shopName : '--')
    }
  },
  {
    field: 'cash',
    minWidth: '100px',
    label: '价格',
    formatter: (row: Recordable) => {
      return h('span', row.cash ? row.cash : '0')
    }
  },
  {
    field: 'num',
    minWidth: '80px',
    label: '数量',
    formatter: (row: Recordable) => {
      return h('span', row.num ? row.num : '0')
    }
  },
  {
    field: 'cashSum',
    minWidth: '80px',
    label: '总价',
    formatter: (row: Recordable) => {
      return h('span', row.cashSum ? row.cashSum : '0')
    }
  },
  {
    field: 'cashSum',
    minWidth: '80px',
    label: '现金价值',
    formatter: (row: Recordable) => {
      return h('span', row.cashSum ? '-' + row.cashSum : '0')
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
          //1待采购 2采购中 3已领取
          type: cellValue === '1' ? 'primary' : cellValue === '2' ? 'warning' : 'success'
        },
        () => (cellValue === '1' ? '待采购' : cellValue === '2' ? '采购中' : '已领取')
      )
    },
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        placeholder: '状态筛选',
        style: 'width: 11vw',
        options: statusArray,
        filterable: true
      }
    }
  },
  {
    field: 'realCash',
    minWidth: '120px',
    label: '剩余现金价值',
    formatter: (row: Recordable) => {
      return h('span', row.realCash ? row.realCash : '0')
    }
  },
  {
    field: 'createTime',
    minWidth: '120px',
    label: '创建时间',
    formatter: (row: Recordable) => {
      return h('span', row.createTime ? moment(row.createTime).format('YYYY-MM-DD') : '--')
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
    minWidth: '120px',
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
  params.status = param.status ? param.status : ''
  params.createBy = param.createByName ? param.createByName[param.createByName.length - 1] : ''
  params.deptId = param.deptName ? param.deptName[param.deptName.length - 1] : ''
  setSearchParams(params)
}
//
const exchangeFormRef = ref()
const action = (row: any, flag: string) => {
  if (flag === 'see') {
    exchangeFormRef.value.openDrawer(row)
  } else if (flag === 'buy') {
    buyGoods(row.id)
  } else if (flag === 'receive') {
    receiveGoods(row.id)
  }
}

const buyGoods = (id: any) => {
  ElMessageBox.confirm('是否采购该商品？', '采购提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    autofocus: false
  }).then(async () => {
    const param = { id: id }
    const res = await buyOrReceiveGoodsApi(param)
    if (res) {
      nextTick()
      ElMessage.success('采购操作成功')
      getList()
    }
  })
}

const receiveGoods = (id: any) => {
  ElMessageBox.confirm('是否领取该商品？', '领取提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    autofocus: false
  }).then(async () => {
    const param = { id: id }
    const res = await buyOrReceiveGoodsApi(param)
    if (res) {
      nextTick()
      ElMessage.success('领取操作成功')
      getList()
    }
  })
}

//导出
const exLoading = ref(false)
const exportForm = async () => {
  // if (tableObject.tableList.length === 0) {
  //   ElMessage.warning('查询无数据, 无需导出数据')
  //   return
  // }
  // exLoading.value = true
  // await exportSettlementListApi(params)
  // exLoading.value = false
}
</script>
    
<style lang="less" scoped>
</style>
      