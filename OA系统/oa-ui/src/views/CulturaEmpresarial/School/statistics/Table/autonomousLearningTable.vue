<template>
  <!-- 自主学习表格 -->
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
    <template #action="{ row }">
      <ElButton :text="true" class="btn-default" size="small" @click="handleDetails(row.courseId)"
        >详情
      </ElButton>
    </template>
  </Table>
  <!--  自主学习  -->
  <SelfLearnListForm ref="selfLearnListFormRef" />
  <CourseDetails ref="courseDetailsRef" />
</template>

<script lang="ts" setup>
import { Table } from '@/components/Table'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { reactive, ref, watch, nextTick } from 'vue'
import { SelfLearnListForm } from '@/views/CulturaEmpresarial/School/ClassRoom/components'
import { getCourseStartListApi } from '@/api/school/statistics'
import { useTable } from '@/hooks/web/useTable'
import { CourseDetails } from '@/views/CulturaEmpresarial/School/ClassRoom/components'
import { useEmitt } from '@/hooks/web/useEmitt'

const courseDetailsRef = ref()

const props = defineProps({
  year: {
    type: String || Number,
    default: ''
  },
  flag: {
    type: String || Number,
    default: 1
  }
})
const selfLearnListFormRef = ref()
// 自主学习表格的数据
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
    label: '课程名称',
    minWidth: '170px'
  },
  {
    field: 'status',
    label: '学习进度',
    minWidth: '80px'
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
    flag: props.flag ? props.flag : 1
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
// 自主学习详情
const handleDetails = (id) => {
  courseDetailsRef.value.openDrawer(id, true)
}
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
  }, 500)
}
resetTableHeight()

useEmitt({
  name: 'window',
  callback: (type: string) => {
    if (type === 'resize') {
      resetTableHeight()
    }
  }
})
</script>

<style scoped></style>
