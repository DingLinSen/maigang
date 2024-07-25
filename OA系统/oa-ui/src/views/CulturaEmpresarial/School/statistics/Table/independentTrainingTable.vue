<template>
  <!-- 自主培训表格 -->
  <Table
    ref="ElTableRef"
    :columns="allSchemas.tableColumns"
    :cotentAlign="'center'"
    :statisticsList="true"
    :height="tableH"
    :data="CourseStartData"
    :header-align="'center'"
    :isShowFilter="false"
    :selection="false"
    @register="register"
  >
    <template #action="{ row }">
      <ElButton :text="true" class="btn-default" size="small">详情 </ElButton>
    </template>
  </Table>
</template>

<script lang="ts" setup>
import { Table } from '@/components/Table'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { reactive, ref, watch, nextTick } from 'vue'
import { SelfLearnListForm } from '@/views/CulturaEmpresarial/School/ClassRoom/components'
import { getCourseStartListApi } from '@/api/school/statistics'
import { useTable } from '@/hooks/web/useTable'
import { useEmitt } from '@/hooks/web/useEmitt'

const props = defineProps({
  year: {
    type: String || Number,
    default: ''
  },
  flag: {
    type: String || Number,
    default: 2
  }
})
// 自主培训表格的数据
const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'index',
    label: '序号',
    minWidth: '60px',
    type: 'index'
  },
  {
    field: 'typeName',
    label: '类型',
    minWidth: '80px'
  },
  {
    field: 'deptName',
    label: '部门',
    minWidth: '130px'
  },
  {
    field: 'teacherUserName',
    label: '培训讲师',
    minWidth: '80px'
  },
  {
    field: 'trainTime',
    label: '培训日期',
    minWidth: '80px'
  },
  {
    field: 'content',
    minWidth: '180px',
    label: '培训内容'
  },
  {
    field: 'num',
    minWidth: '80px',
    label: '参训人数'
  }
])
const { allSchemas } = useCrudSchemas(crudSchemas)

const CourseStartData = ref([])
const getCourseStartList = async () => {
  await getCourseStartListApi({
    year: props.year ? props.year : '',
    flag: props.flag ? props.flag : 2
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
