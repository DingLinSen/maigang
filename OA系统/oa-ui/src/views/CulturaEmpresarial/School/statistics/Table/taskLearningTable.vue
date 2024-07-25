<template>
  <!-- 任务学习表格 -->
  <Table
    ref="ElTableRef"
    :columns="allSchemas.tableColumns"
    :cotentAlign="'center'"
    :data="CourseStartData"
    :header-align="'center'"
    :isShowFilter="false"
    :selection="false"
    :statisticsList="true"
    :height="tableH"
    @register="register"
  >
    <!--    <template #status="{row}">-->
    <!--      <span :class="{'uncompleted':row.status=='已完成','completed':row.status=='未完成'}">{{ row.status }}</span>-->
    <!--    </template>-->
    <template #delay="{ row }">
      <el-tag v-if="row.delay == '延误'" class="ml-2" type="danger">
        <Icon class="mr-5px delay_icon" icon="svg-icon:delay_icon" />
        <span> 延误</span>
      </el-tag>
      <el-tag v-if="row.delay == '正常'" class="ml-2" type="success">
        <Icon class="mr-5px delay_icon" icon="svg-icon:normal_icon" />
        正常
      </el-tag>
    </template>
    <template #action="{ row }">
      <ElButton :text="true" class="btn-default" size="small" @click="handleDetails(row.courseId)"
        >详情
      </ElButton>
    </template>
  </Table>
  <!--  任务学习  -->
  <TaskLearnListForm ref="taskLearnListFormRef" />

  <!--  详情-->
  <CourseDetails ref="courseDetailsRef" />
</template>

<script lang="ts" setup>
import { Table } from '@/components/Table'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { h, nextTick, reactive, ref, watch } from 'vue'
import { TaskLearnListForm } from '@/views/CulturaEmpresarial/School/ClassRoom/components'
import { getCourseStartListApi } from '@/api/school/statistics'
import { useTable } from '@/hooks/web/useTable'
import { CourseDetails } from '@/views/CulturaEmpresarial/School/ClassRoom/components'
import moment from 'moment/moment'
import { useEmitt } from '@/hooks/web/useEmitt'

const courseDetailsRef = ref()
const props = defineProps({
  year: {
    type: String || Number,
    default: ''
  },
  flag: {
    type: String || Number,
    default: 0
  }
})
const taskLearnListFormRef = ref()
// 任务学习表格的数据
const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'deptName',
    label: '部门',
    minWidth: '130px'
  },
  {
    field: 'name',
    label: '姓名',
    minWidth: '80px'
  },
  {
    field: 'courseName',
    label: '考核课程',
    minWidth: '100px'
  },
  {
    field: 'endDate',
    label: '截止时间',
    minWidth: '100px'
  },
  {
    field: 'finishTime',
    label: '完成时间',
    minWidth: '100px',
    formatter: (row: Recordable) => {
      return h('span', row.finishTime ? row.finishTime : '--')
    }
  },
  {
    field: 'status',
    label: '考核进度',
    minWidth: '80px'
  },
  {
    field: 'delay',
    label: '延误状态',
    minWidth: '80px',
    showOverflowTooltip: false
  }
  // {
  //   field: 'action',
  //   minWidth: '100px',
  //   label: '操作',
  //   showOverflowTooltip: false
  // }
])
const { allSchemas } = useCrudSchemas(crudSchemas)
const CourseStartData = ref([])
const getCourseStartList = async () => {
  await getCourseStartListApi({
    year: props.year ? props.year : '',
    flag: props.flag ? props.flag : 0
  }).then((res) => {
    CourseStartData.value = res.data.list
  })
}
getCourseStartList()
watch(
  () => props.year,
  () => {
    getCourseStartList()
  }
)

const tableH = ref<number>(300)

const resetTableHeight = () => {
  setTimeout(() => {
    nextTick()
    const leftView = document.querySelector('.statistics_box')
    // const leftView2 = document.querySelector('.statistics-left-ranking')
    const header = document.querySelector('.statistics-header')
    if (leftView) {
      tableH.value = leftView.clientHeight - 20 - (header ? header.clientHeight : 0)
    }
  }, 1000)
}
resetTableHeight()
// 任务学习的详情
const handleDetails = (id) => {
  courseDetailsRef.value.openDrawer(id, true)
}

useEmitt({
  name: 'window',
  callback: (type: string) => {
    if (type === 'resize') {
      resetTableHeight()
    }
  }
})
</script>

<style lang="less" scoped>
.uncompleted {
  color: #00a0e9;
}

.completed {
  color: #999999;
}

.delay_icon {
  vertical-align: bottom;
}
</style>
