<template>
  <DrawerWrap title="出入库管理" :isShow="isShow" ref="drawerWrap" class="personal-manage-drawer">
    <template #right>
      <div>
        <ElButton
          :loading="exLoading"
          class="btn-other exportBtn"
          v-hasPermi="'project:cultivate:export'"
          @click="exportForm()"
          plain
        >
          <template #icon>
            <Icon :size="14" icon="svg-icon:exportBut"/>
          </template
          >
          导出
        </ElButton>
      </div>
    </template>
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
        :height="defaultHeight + 140"
        :pagination="{
          total: tableObject.total
        }"
        @register="register"
      >
        <template #id="{ $index }">
        <span>
          {{ $index + 1 + tableObject.pageSize * (tableObject.currentPage - 1) }}
        </span>
        </template>
        <template #operateBtnLeft>
          <Search
            v-if="isAuth('AdministrativeService:inventoryManagement:query')"
            :schema="allSchemas.searchSchema"
            @search="setSearchParamsSub"
            @reset="reset"
          />
        </template>
      </Table>
    </template>
  </DrawerWrap>
</template>
<script setup lang="ts">
import { ref, reactive, computed, onMounted, h, unref, getCurrentInstance, watch } from 'vue'
import { ContentWrap } from '@/components/ContentWrap'
import { Table } from '@/components/Table'
import { TableColumn } from '@/types/table'
import { useEmitt } from '@/hooks/web/useEmitt'
import { Search } from '@/components/Search'
import { useTable } from '@/hooks/web/useTable'
import { useAppStore } from '@/store/modules/app'
import { AnnouncementData } from '@/api/AdministrativeService/announcement/types'
import {
  getTinfoGoodsList,
  deltinfoGoods,
  exportTinfoGoodsListApi,
  getGoodsList,
  getDetailGoodsList,
  exportRecordGoodsListApi
} from '@/api/AdministrativeService/inventoryManagement'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { ElButton, ElTag, ElMessage, ElMessageBox } from 'element-plus'
import moment from 'moment'
import { isAuth } from '@/utils/is' // 鉴权
import { useRoute } from 'vue-router'
import { Message } from 'postcss'
import { DrawerWrap } from '@/components/DrawerWrap'

const route = useRoute()
const drawerWrap = ref<ComponentRef<typeof DrawerWrap>>()
const isShow = ref(false)
// 从字典管理拿到物品类型的数据
const { proxy } = getCurrentInstance() as any
const { goods_type } = proxy.useDict('goods_type')
const InventoryManagementDialogRef = ref<any>()
const appStore = useAppStore()
//删除加载
const delLoading = ref(false)
// 表格高度
const defaultHeight = ref(0)
const goodsId = ref(0) // 物品的ID

const params = reactive<any>({
  changeType: '',
  startTm: '',
  endTm: ''
})

const outIntoType = ref([
  {
    value: 1,
    label: '入库'
  },
  {
    value: 2,
    label: '出库'
  }
])
// 存放物品名称的数据
let goodsListData = ref([])

// 存放表格的数据
const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'id',
    label: '序号',
    minWidth: '80px',
    search: {
      show: true,
      component: 'DatePicker',
      componentProps: {
        style: 'width: 196px',
        placeholder: '开始时间',
        format: 'YYYY-MM-DD',
        valueFormat: 'YYYY-MM-DD'
      }
    }
  },
  {
    field: 'goodsType',
    label: '物品类型',
    minWidth: '120px',
    formatter: (row: Recordable) => {
      return h('span', row.goodsType ? filterType(row.goodsType) : '--')
    },
    search: {
      show: true,
      component: 'DatePicker',
      componentProps: {
        style: 'width: 196px',
        placeholder: '结束时间',
        format: 'YYYY-MM-DD',
        valueFormat: 'YYYY-MM-DD'
      }
    }
  },
  {
    field: 'goodsName',
    label: '物品名称',
    minWidth: '140px',
    formatter: (row: Recordable) => {
      return h('span', row.goodsName ? row.goodsName : '--')
    }
  },
  {
    field: 'changeNum',
    label: '数量',
    minWidth: '80px',
    formatter: (row: Recordable) => {
      return h('span', row.changeNum ? row.changeNum : '0')
    }
  },
  {
    field: 'changeType',
    label: '出入库类型',
    minWidth: '80px',
    formatter: (row: Recordable) => {
      return h('span', row.changeType == 1 ? '入库' : row.changeType == 2 ? '出库' : '--')
    },
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        style: 'width: 196px',
        options: outIntoType,
        placeholder: '出入库类型'
      }
    }
  },
  {
    field: 'createName',
    label: '申请人',
    minWidth: '120px',
    formatter: (row: Recordable) => {
      return h('span', row.createName ? row.createName : '--')
    }
  },
  {
    field: 'createDate',
    label: '出入库时间',
    minWidth: '120px',
    formatter: (row: Recordable) => {
      return h('span', row.createDate ? moment(row.createDate).format('YYYY-MM-DD') : '--')
    }
  }
])
const { allSchemas } = useCrudSchemas(crudSchemas)
const { register, tableObject, methods } = useTable<AnnouncementData>({
  getListApi: getDetailGoodsList,
  delListApi: deltinfoGoods,
  response: {
    list: 'rows',
    total: 'total'
  },
  defaultParams: {
    goodsId: goodsId.value
  }
})
const { getList, setSearchParams } = methods
getList()
//打开drawer并初始化
const openDrawer = (id) => {
  drawerWrap.value.isShow = true
  goodsId.value = id
  setSearchParams({ goodsId: id })
}
// getList()
// 视窗高度
const documentClientHeight = computed(() => appStore.getDocumentClientHeight)
const resetTableHeight = () => {
  const overView = getOverViewWrapper('.overView')
  const overViewWrapper = getOverViewWrapper('#v-tags-view')
  const footer = getOverViewWrapper('.v-footer')
  const trigger = getOverViewWrapper('.hover-trigger-view')
  defaultHeight.value =
    documentClientHeight.value - overViewWrapper - overView - trigger - footer - 200
}
const getOverViewWrapper = (dom: string): number => {
  let topH = 0
  const checkboxWrapper = document.querySelector(dom)
  if (checkboxWrapper) {
    topH = checkboxWrapper.clientHeight
  }
  return topH
}
// 注册
onMounted(() => {
  resetTableHeight()
})
const getGoodsListData = async () => {
  const res = await getGoodsList()
  res.data.forEach((item) => {
    goodsListData.value.push({
      value: item,
      label: item
    })
  })
  return goodsListData.value
}
getGoodsListData()
useEmitt({
  name: 'window',
  callback: (type: string) => {
    if (type === 'resize') {
      resetTableHeight()
    }
  }
})
// 过滤类型
const filterType = (type: string) => {
  switch (type) {
    case '1':
      return '办公用品'
    case '2':
      return '日常用品'
    case '3':
      return '礼品'
    case '4':
      return '其他'

    default:
      '--'
  }
}
//搜索
const setSearchParamsSub = (param: any) => {
  console.log(param)
  if (param.changeType) {
    params.changeType = param.changeType ? param.changeType : ''
    setSearchParams(params)
    return
  } else if (param.id == '') {
    ElMessage.warning('请选择开始时间')
    return
  } else if (param.goodsType == '') {
    ElMessage.warning('请选择结束时间')
    return
  } else if (param.goodsType < param.id) {
    ElMessage.warning('结束时间不能小于开始时间')
    return
  }
  params.changeType = param.changeType ? param.changeType : ''
  params.startTm = param.id ? param.id : ''
  params.endTm = param.goodsType ? param.goodsType : ''
  setSearchParams(params)
}
// 重置
const reset = (param: any) => {
  params.changeType = param.changeType ? param.changeType : ''
  params.startTm = param.id ? param.id : ''
  params.endTm = param.goodsType ? param.goodsType : ''
  setSearchParams(params)
}
//导出
const exLoading = ref(false)
const exportForm = async () => {
  if (tableObject.tableList.length === 0) {
    ElMessage.warning('查询无数据, 无需导出数据')
    return
  }
  exLoading.value = true
  await exportRecordGoodsListApi({
    goodsId: goodsId.value
  })
  exLoading.value = false
}

// 更新表格
const resetList = () => {
  tableObject.currentPage = 1
  getList()
  // getGoodsListData()
}
defineExpose({
  isShow,
  openDrawer
})
</script>
<style lang="less" scoped>

.top {
  display: flex;
  justify-content: space-between;
}
</style>
