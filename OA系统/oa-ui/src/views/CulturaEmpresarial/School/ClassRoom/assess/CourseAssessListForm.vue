<!-- 课程考核管理 -->
<script setup lang="ts">
import { computed, onMounted, reactive, ref, nextTick, h } from 'vue'
import { DrawerWrap } from '@/components/DrawerWrapDetails'
import { Search } from '@/components/Search'
import { Table } from '@/components/Table'
import { useTable } from '@/hooks/web/useTable'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { TableColumn } from '@/types/table'
import { getKnowledgeListApi, delKnowledgeListApi } from '@/api/school/industry'
import { isAuth } from '@/utils/is'
import { useEmitt } from '@/hooks/web/useEmitt'
import { useAppStore } from '@/store/modules/app'
import moment from 'moment'
import { AssessForm } from './form'
import { delCourseAssessListApi, getCourseAssessListApi } from '@/api/school/assess'

defineOptions({
  name: 'CourseAssessListForm'
})
const appStore = useAppStore()
const documentClientHeight = computed(() => appStore.getDocumentClientHeight)
useEmitt({
  name: 'window',
  callback: (type: string) => {
    if (type === 'resize') {
      resetTableHeight()
    }
  }
})
useEmitt({
  name: 'assess',
  callback: (type: string) => {
    if (type === 'add') {
      tableObject.currentPage = 1
    }
    getList()
  }
})
onMounted(() => {
  resetTableHeight()
})

const tableRef = ref()
const contentHeight = ref<number>(400)
const resetTableHeight = () => {
  //搜索框加操作栏高度
  nextTick(() => {
    setTimeout(() => {
      if (tableRef.value) {
        tableRef.value.resetTableHeight()
      }
    }, 500)
  })
}

const getSearchWrapperHeight = (): number => {
  //搜索框加操作栏高度
  let topH = 85
  const searchWrapper = document.querySelector('.search-wrap-class')
  if (searchWrapper) {
    topH = topH + searchWrapper.clientHeight
  }
  return topH
}
const isShow = ref<boolean>(false)
//打开drawer并初始化
const drawerWrap = ref()
const openDrawer = () => {
  drawerWrap.value.isShow = true
  resetTableData()
  resetTableHeight()
}

const { register, tableObject, methods } = useTable<any>({
  getListApi: getCourseAssessListApi,
  delListApi: delCourseAssessListApi,
  response: {
    list: 'rows',
    total: 'total'
  }
})

const { getList, setSearchParams } = methods
const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'index',
    label: '序号',
    minWidth: '80px',
    formatter: (row: Recordable, __: TableColumn, cellValue: string, index: number) => {
      let itemIndex = index + 1 + tableObject.pageSize * (tableObject.currentPage - 1)
      return h('span', itemIndex)
    }
  },
  {
    field: 'courseName',
    label: '课程名称',
    minWidth: '180px',
    search: {
      show: true,
      componentProps: {
        style: 'width: 9.2vw',
        placeholder: '课程名称筛选'
      }
    },
    formatter: (row: Recordable) => {
      return h('span', row.courseName ? row.courseName : '--')
    }
  },
  {
    field: 'startDate',
    minWidth: '120px',
    label: '开始时间',
    formatter: (row: Recordable) => {
      return h('span', row.startDate ? moment(row.startDate).format('YYYY-MM-DD') : '--')
    }
  },
  {
    field: 'endDate',
    minWidth: '120px',
    label: '结束时间',
    formatter: (row: Recordable) => {
      return h('span', row.endDate ? moment(row.endDate).format('YYYY-MM-DD') : '--')
    }
  },
  {
    field: 'createTime',
    minWidth: '140px',
    label: '创建时间',
    formatter: (row: Recordable) => {
      return h('span', row.createTime ? moment(row.createTime).format('YYYY-MM-DD') : '--')
    }
  },
  {
    field: 'action',
    minWidth: '180px',
    label: '操作'
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)
const params = reactive<Recordable>({
  courseName: null
})

//搜索
const setSearchParamsSub = (param: Recordable) => {
  params.courseName = param.courseName ? param.courseName : null
  setSearchParams(params)
}
const searchRef = ref()
const resetTableData = () => {
  tableObject.currentPage = 1
  if (searchRef.value) {
    searchRef.value.setValues({ courseName: null })
  }
  setSearchParamsSub({ courseName: null })
}

//删除加载
const delLoading = ref(false)

//删除
const delData = async (row: any | null, multiple: boolean) => {
  tableObject.currentRow = row
  const { delList, getSelections } = methods
  const selections = await getSelections()
  delLoading.value = true
  await delList(
    multiple ? selections.map((v) => v.id) : [tableObject.currentRow?.id as string],
    multiple,
    true,
    true
  ).finally(() => {
    delLoading.value = false
  })
}

const assessFormRef = ref<ComponentRef<typeof AssessForm>>()
const action = (row: any, flag: string) => {
  assessFormRef.value.openDrawer(flag, row ? row.id : '')
}
defineExpose({
  openDrawer
})
</script>
<template>
  <DrawerWrap title="课程考核管理" :isShow="isShow" ref="drawerWrap">
    <template #content>
      <Table
        ref="tableRef"
        style="background: #fff"
        v-model:pageSize="tableObject.pageSize"
        v-model:currentPage="tableObject.currentPage"
        :columns="allSchemas.tableColumns"
        :height="contentHeight"
        :data="tableObject.tableList"
        :loading="tableObject.loading"
        :border="true"
        :isShowFilter="true"
        :header-align="'center'"
        :cotentAlign="'center'"
        :pagination="{
          total: tableObject.total
        }"
        @register="register"
      >
        <template #operateBtnLeft>
          <Search
            ref="searchRef"
            v-if="isAuth('school:examine:query')"
            :schema="allSchemas.searchSchema"
            @search="setSearchParamsSub"
            @reset="setSearchParamsSub"
          />
        </template>
        <template #operateBtnRight>
          <div class="mr-[10px]">
            <ElButton
              class="btn-add"
              @click="action(null, 'add')"
              plain
              v-hasPermi="'school:examine:add'"
            >
              <template #icon>
                <Icon :size="14" icon="svg-icon:addBut" />
              </template>
              新增
            </ElButton>
            <ElButton
              :loading="delLoading"
              class="btn-other"
              @click="delData(null, true)"
              plain
              v-hasPermi="'school:examine:remove'"
            >
              <template #icon>
                <Icon :size="14" icon="svg-icon:deleteBut" />
              </template>
              删除
            </ElButton></div
          >
        </template>
        <template #action="{ row }">
          <ElButton
            @click="action(row, 'see')"
            v-if="isAuth('school:examine:details')"
            :text="true"
            class="btn-default"
          >
            详情
          </ElButton>
          <!-- <ElButton
            @click="action(row, 'edit')"
            v-if="isAuth('school:examine:edit')"
            :text="true"
            class="btn-default"
          >
            编辑
          </ElButton> -->
          <ElButton
            @click="delData(row, false)"
            v-if="isAuth('school:examine:remove')"
            :text="true"
            class="btn-default"
          >
            删除
          </ElButton>
        </template>
      </Table>
    </template>
  </DrawerWrap>
  <AssessForm title="课程考核管理" ref="assessFormRef" />
</template>

<style lang="less" scoped>
:deep(.el-drawer__body) {
  background: #fff !important;
}

:deep(.el-card__body) {
  padding: 0px !important;
  background: #fff !important;
}

.search-wrap-class {
  height: 54px;
  background: #fff !important;
  display: flex;
  justify-content: center;
}
</style>
