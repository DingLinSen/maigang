<script setup lang="ts">
import { ref, reactive, getCurrentInstance, unref, h, inject, computed, onMounted } from 'vue'
import moment from 'moment'
import { getOvertimeRecordApi } from '@/api/order/index'
import { Dialog } from '@/components/Dialog'
import { useTable } from '@/hooks/web/useTable'
import { Table } from '@/components/Table'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { ElMessage, ElTag } from 'element-plus'
import { useAppStore } from '@/store/modules/app'
import { useEmitt } from '@/hooks/web/useEmitt'
import { isAuth } from '@/utils/is'
import { propTypes } from '@/utils/propTypes'
import { TableColumn } from '@/types/table'

const props = defineProps({
  data: propTypes.array.def([])
})
const appStore = useAppStore()
// 视窗高度
const documentClientHeight = computed(() => appStore.getDocumentClientHeight)
// 注册
onMounted(() => {
  resetHeight()
})

useEmitt({
  name: 'window',
  callback: (type: string) => {
    if (type === 'resize') {
      resetHeight()
    }
  }
})
const divHeight = ref<number>(300)

const resetHeight = () => {
  if (elDialogRef.value.isFullscreen) {
    divHeight.value = documentClientHeight.value - 58 - 60
  } else {
    divHeight.value = (documentClientHeight.value - 58 - 60) * 0.7 - 10
  }
}

const toggleFull = (isFull: boolean) => {
  if (isFull) {
    divHeight.value = documentClientHeight.value - 58 - 60
  } else {
    divHeight.value = (documentClientHeight.value - 58 - 60) * 0.7 - 10
  }
}

const loading = ref(false)
// 弹窗的开启和关闭
const dialogFlag = ref<any>(false)
//工单类型
const orderType = ref<any[]>([
  {
    label: '请假申请',
    value: '1'
  },
  {
    label: '出差申请',
    value: '2'
  },
  {
    label: '加班申请',
    value: '3'
  },
  {
    label: '外出申请',
    value: '4'
  },
  {
    label: '物资外借',
    value: '5'
  },
  {
    label: '物品领用',
    value: '6'
  },
  {
    label: '用章申请',
    value: '7'
  },
  {
    label: '采购申请',
    value: '8'
  },
  {
    label: '调休顺延申请',
    value: '9'
  },
  {
    label: '加班任务',
    value: '10'
  }
])
const getOrderTypeLabel = (value: string): string => {
  let label = '--'
  if (value) {
    orderType.value.forEach((item: any) => {
      if (value.toString() === item.value) {
        label = item.label
      }
    })
  }

  return label
}

// 状态
//1未发布 2已发布 3审核中 4已驳回  5待归档 6采购中 7归档 8人事驳回 9待领取/待借出 10待归还 11财务经理审核 12待采购
const projectStatus = ref<any>([
  {
    label: '未发布',
    value: '1'
  },
  {
    label: '审核中',
    value: '2'
  },
  {
    label: '待归档',
    value: '5'
  },
  {
    label: '采购中',
    value: '6'
  },
  {
    label: '待采购',
    value: '12'
  },
  {
    label: '待领取/待借出',
    value: '9'
  },
  {
    label: '待归还',
    value: '10'
  },
  {
    label: '归档',
    value: '7'
  },
  {
    label: '已驳回',
    value: '4'
  },
  {
    label: '人事驳回',
    value: '8'
  }
])
const getStatusElTagType = (value: string): string => {
  let label = '--'
  if (value) {
    projectStatus.value.forEach((item: any) => {
      if (value === item.value) {
        label = item.label
      }
    })
    if (value === '3' || value === '11') {
      label = '审核中'
    }
  }

  return label
}
// 存放表格的数据
const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'index',
    label: '序号',
    width: '60px',
    type: 'index'
  },
  {
    field: 'createByName',
    label: '申请人',
    minWidth: '120px',
    formatter: (row: any) => {
      return h('span', row.createByName ? row.createByName : '--')
    }
  },
  {
    field: 'type',
    label: '工单类型',
    minWidth: '120px',
    formatter: (row: any) => {
      return h('span', getOrderTypeLabel(row.type))
    }
  },
  {
    field: 'status',
    label: '状态',
    minWidth: '120px',
    formatter: (row: Recordable, __: TableColumn, cellValue: string) => {
      return h(
        ElTag,
        {
          type:
            cellValue === '1'
              ? 'primary'
              : cellValue === '2'
              ? 'success'
              : cellValue === '3'
              ? 'success'
              : cellValue === '4'
              ? 'danger'
              : cellValue === '5'
              ? 'warning'
              : cellValue === '6'
              ? 'warning'
              : cellValue === '7'
              ? 'success'
              : cellValue === '8'
              ? 'danger'
              : cellValue === '9'
              ? 'warning'
              : cellValue === '10'
              ? 'warning'
              : cellValue === '11'
              ? 'success'
              : cellValue === '12'
              ? 'warning'
              : 'danger'
        },
        () => getStatusElTagType(cellValue)
      )
    }
  }
])
const { allSchemas } = useCrudSchemas(crudSchemas)

const elDialogRef = ref()

//打开drawer并初始化
const openDrawer = () => {
  elDialogRef.value.isFullscreen = false
  dialogFlag.value = true
}

//关闭drawer
const closeDrawer = () => {
  dialogFlag.value = false
}

defineExpose({
  openDrawer
})
</script>

<template>
  <Dialog
    ref="elDialogRef"
    title="工单提醒"
    :width="'68%'"
    class="detailed-statistics-custom"
    v-model="dialogFlag"
    @toggle-full="toggleFull"
    @closed="dialogFlag = false"
  >
    <Table
      :isShowFilter="false"
      :border="true"
      :isShowSearch="false"
      ref="ElTableRef"
      :data="data"
      :columns="allSchemas.tableColumns"
      :header-align="'center'"
      :cotentAlign="'center'"
      :height="divHeight"
      :selection="false"
      @register="register"
    >
    </Table>
  </Dialog>
</template>

<style lang="less" scoped>
:deep(.el-input-group__append) {
  background-color: white;
  width: 35px;
}
</style>
<style>
.timer-input {
  width: 4.686vw !important;
  margin: 6px 0.4vw;
  border-radius: 4px;
}
.detailed-statistics-custom {
  /* width: 80vw !important; */
}
</style>
