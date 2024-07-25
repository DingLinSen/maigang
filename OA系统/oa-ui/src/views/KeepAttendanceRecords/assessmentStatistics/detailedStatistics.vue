<script setup lang="ts">
import { ref, reactive, h, inject, computed, nextTick, onMounted } from 'vue'
import moment from 'moment'
import { getDetailsListApi, getDetailsExport } from '@/api/assessment/statistics'
import { ElDialog } from '@/components/ElDialog'
import { useTable } from '@/hooks/web/useTable'
import { Table } from '@/components/Table'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useAppStore } from '@/store/modules/app'
import { useEmitt } from '@/hooks/web/useEmitt'
import { isAuth } from '@/utils/is'

const appStore = useAppStore()
// 视窗高度
const documentClientHeight = computed(() => appStore.getDocumentClientHeight)
// 注册
// onMounted(() => {
//   resetHeight()
// })

useEmitt({
  name: 'window',
  callback: (type: string) => {
    if (type === 'resize') {
      resetHeight()
    }
  }
})
const divHeight = ref<number>(document.documentElement.offsetHeight * 0.5)

const resetHeight = () => {
  nextTick()
  let layoutContentH = 0
  const layoutContent = document.querySelector('.v-layout')
  if (layoutContent) {
    layoutContentH = layoutContent.clientHeight
  }
  if (ElDialogFef.value.isFullscreen) {
    divHeight.value =
      layoutContentH - getSearchWrapperHeight() - getDialogHeaderHeight() - getBodyPaddingValue()
  } else {
    divHeight.value =
      layoutContentH * 0.85 - getSearchWrapperHeight() - getDialogHeaderHeight() - 60
  }
}

const toggleFull = (isFull: boolean) => {
  nextTick()
  let layoutContentH = 0
  const layoutContent = document.querySelector('.v-layout')
  if (layoutContent) {
    layoutContentH = layoutContent.clientHeight
  }
  if (isFull) {
    divHeight.value =
      layoutContentH - getSearchWrapperHeight() - getDialogHeaderHeight() - getBodyPaddingValue()
  } else {
    divHeight.value =
      layoutContentH * 0.85 - getSearchWrapperHeight() - getDialogHeaderHeight() - 60
  }
}

const getSearchWrapperHeight = (): number => {
  //搜索框加操作栏高度
  let topH = 0
  const buttonWrapper = document.querySelectorAll('.filter-btn')
  if (buttonWrapper && buttonWrapper.length) {
    buttonWrapper.forEach((ele: any) => {
      topH = topH + ele.clientHeight
    })
  }
  return topH
}

const getDialogHeaderHeight = (): number => {
  let topH = 0
  const topWrap = document.querySelector('.el-dialog__header')
  if (topWrap) {
    topH = topWrap.clientHeight
  }
  return topH
}

const getBodyPaddingValue = (): number => {
  let topH = 0
  const topWrap = document.querySelector('.el-dialog__body')
  if (topWrap) {
    let computedStyle = getComputedStyle(topWrap, null)
    if (computedStyle) {
      topH = parseFloat(computedStyle.getPropertyValue('padding-top')) * 2
    }
  }
  return topH + 5
}
// 弹窗的开启和关闭
const DialogFlag = ref<any>(false)

const title = ref('')
const params = ref<any>()

// 存放表格的数据
const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'index',
    label: '序号',
    minWidth: '60px'
  },
  {
    field: 'userName',
    label: '姓名',
    minWidth: '100px',
    formatter: (row: any) => {
      return h('span', row.userName ? row.userName : '--')
    }
  },
  {
    field: 'clockinDate',
    label: '考勤日期',
    minWidth: '120px',
    formatter: (row: any) => {
      return h('span', row.clockinDate ? moment(row.clockinDate).format('YYYY-MM-DD') : '--')
    }
  },
  {
    field: 'attenceClockinTime',
    label: '上班打卡时间',
    minWidth: '120px',
    formatter: (row: any) => {
      return h(
        'span',
        row.attenceClockinTime ? moment(row.attenceClockinTime).format('HH:mm:ss') : '--'
      )
    }
  },
  {
    field: 'attenceClockoutTime',
    label: '下班打卡时间',
    minWidth: '120px',
    formatter: (row: any) => {
      return h(
        'span',
        row.attenceClockoutTime ? moment(row.attenceClockoutTime).format('HH:mm:ss') : '--'
      )
    }
  },
  {
    field: 'evection',
    label: '出差（天）',
    width: '70px',
    formatter: (row: any) => {
      return h('span', row.evection ? row.evection : 0)
    }
  },
  {
    field: 'egress',
    label: '外出(小时)',
    width: '70px',
    formatter: (row: any) => {
      return h('span', row.egress ? row.egress : 0)
    }
  },
  {
    field: 'restOvertime',
    label: '加班(小时)',
    width: '70px',
    formatter: (row: any) => {
      return h('span', row.restOvertime ? row.restOvertime : 0)
    }
  },
  {
    field: 'leave',
    label: '请假(小时)',
    width: '70px',
    formatter: (row: any) => {
      return h('span', row.leave ? row.leave : 0)
    }
  },
  {
    field: 'late',
    label: '迟到（次）',
    width: '70px',
    formatter: (row: any) => {
      return h('span', row.late ? row.late : 0)
    }
  },
  {
    field: 'premature',
    label: '早退（次）',
    width: '70px',
    formatter: (row: any) => {
      return h('span', row.premature ? row.premature : 0)
    }
  },
  {
    field: 'absenteeism',
    label: '旷工（次）',
    width: '70px',
    formatter: (row: any) => {
      return h('span', row.absenteeism ? row.absenteeism : 0)
    }
  },
  {
    field: 'miss',
    label: '漏签（次）',
    width: '70px',
    formatter: (row: any) => {
      return h('span', row.miss ? row.miss : 0)
    }
  },
  {
    field: 'deptName',
    label: '所属部门',
    minWidth: '120px',
    formatter: (row: any) => {
      return h('span', row.deptName ? row.deptName : '--')
    }
  }
])
const { allSchemas } = useCrudSchemas(crudSchemas)
const { register, tableObject, methods } = useTable<any>({
  getListApi: getDetailsListApi,
  response: {
    list: 'rows',
    total: 'total'
  }
})
const ElDialogFef = ref()
const { getList, setSearchParams } = methods
//打开drawer并初始化
const openDrawer = (data: any) => {
  ElDialogFef.value.isFullscreen = false
  title.value = '考勤详细统计'
  DialogFlag.value = true
  params.value = data
  setSearchParams(data)
}

//导出
const exportForm = async () => {
  let res = await getDetailsExport(params.value)
}

defineExpose({
  openDrawer
})
</script>

<template>
  <ElDialog
    ref="ElDialogFef"
    :title="title"
    :width="'82%'"
    :maxHeight="'auto'"
    class="detailed-statistics-custom"
    v-model="DialogFlag"
    @toggle-full="toggleFull"
    @closed="DialogFlag = false"
  >
    <Table
      class="att_table"
      :isShowFilter="false"
      :border="true"
      ref="ElTableRef"
      v-model:pageSize="tableObject.pageSize"
      v-model:currentPage="tableObject.currentPage"
      :data="tableObject.tableList"
      :loading="tableObject.loading"
      :columns="allSchemas.tableColumns"
      :header-align="'center'"
      :cotentAlign="'center'"
      :height="divHeight + 'px'"
      :statisticsList="true"
      :selection="false"
      :pagination="{
        total: tableObject.total
      }"
      @register="register"
    >
      <template #operateBtnRight>
        <ElButton
          v-hasPermi="'keepAttend:details:export'"
          :loading="exLoading"
          class="btn-other exportBtn mb-20px"
          @click="exportForm()"
          plain
        >
          <template #icon>
            <Icon :size="14" icon="svg-icon:exportBut" />
          </template>
          导出
        </ElButton>
      </template>
      <template #index="{ $index }">
        <span>{{
          $index + 1 + tableObject.pageSize * (tableObject.currentPage - 1)
        }}</span></template
      >
    </Table>
  </ElDialog>
</template>

<style lang="less" scoped>
:deep(.el-input-group__append) {
  background-color: white;
  width: 35px;
}
:deep(.att_table),
:deep(.att_table .el-table__inner-wrapper) {
  // height: 51vh !important;
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
