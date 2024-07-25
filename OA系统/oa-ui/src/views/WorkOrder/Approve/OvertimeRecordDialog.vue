<script setup lang="ts">
import { ref, reactive, getCurrentInstance, unref, h, inject, computed, onMounted } from 'vue'
import moment from 'moment'
import { getOvertimeRecordApi } from '@/api/order/index'
import { Dialog } from '@/components/Dialog'
import { useTable } from '@/hooks/web/useTable'
import { Table } from '@/components/Table'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { ElMessage } from 'element-plus'
import { useAppStore } from '@/store/modules/app'
import { useEmitt } from '@/hooks/web/useEmitt'
import { isAuth } from '@/utils/is'

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

const title = ref('')

// 存放表格的数据
const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'index',
    label: '序号',
    minWidth: '60px'
  },
  {
    field: 'nickName',
    label: '姓名',
    minWidth: '120px',
    formatter: (row: any) => {
      return h('span', row.nickName ? row.nickName : '--')
    }
  },
  {
    field: 'type',
    label: '类型',
    minWidth: '120px',
    formatter: (row: any) => {
      return h('span', '加班任务')
    }
  },
  {
    field: 'startTime',
    label: '开始时间',
    minWidth: '140px',
    formatter: (row: any) => {
      return h('span', row.startTime ? moment(row.startTime).format('YYYY-MM-DD HH:mm:ss') : '--')
    }
  },
  {
    field: 'endTime',
    label: '结束时间',
    minWidth: '140px',
    formatter: (row: any) => {
      return h('span', row.endTime ? moment(row.endTime).format('YYYY-MM-DD HH:mm:ss') : '--')
    }
  },
  {
    field: 'sumDate',
    label: '加班时长(小时)',
    minWidth: '120px',
    formatter: (row: any) => {
      return h('span', row.sumDate ? row.sumDate : '--')
    }
  }
])
const { allSchemas } = useCrudSchemas(crudSchemas)
const { register, tableObject, methods } = useTable<any>({
  getListApi: getOvertimeRecordApi,
  response: {
    list: 'rows',
    total: 'total'
  }
})
const elDialogRef = ref()
const { getList, setSearchParams } = methods

//打开drawer并初始化
const openDrawer = (data: any) => {
  elDialogRef.value.isFullscreen = false
  title.value = '加班记录'
  dialogFlag.value = true
  setSearchParams(data)
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
    :title="title"
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
      v-model:pageSize="tableObject.pageSize"
      v-model:currentPage="tableObject.currentPage"
      :data="tableObject.tableList"
      :loading="tableObject.loading"
      :columns="allSchemas.tableColumns"
      :header-align="'center'"
      :cotentAlign="'center'"
      :height="divHeight"
      :selection="false"
      :pagination="{
        total: tableObject.total
      }"
      @register="register"
    >
      <template #index="{ $index }">
        <span>{{
          $index + 1 + tableObject.pageSize * (tableObject.currentPage - 1)
        }}</span></template
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
