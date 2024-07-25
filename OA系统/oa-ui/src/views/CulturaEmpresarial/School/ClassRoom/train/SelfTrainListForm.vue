<!-- 自主培训 -->
<script setup lang="ts">
import { computed, onMounted, reactive, ref, nextTick, h, provide } from 'vue'
import { DrawerWrap } from '@/components/DrawerWrapDetails'
import { Search } from '@/components/Search'
import { Table } from '@/components/Table'
import { useTable } from '@/hooks/web/useTable'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { TableColumn } from '@/types/table'
import {
  getSelfTrainListApi,
  delSelfTrainListApi,
  exportTrainApi,
  exportTrainListApi
} from '@/api/school/train'
import { isAuth } from '@/utils/is'
import { useEmitt } from '@/hooks/web/useEmitt'
import { useAppStore } from '@/store/modules/app'
import { courseShelfType, yesOrNo } from './config'
import moment from 'moment'
import { CourseForm } from './form'
import { ElMessageBox, ElMessage, ElTag } from 'element-plus'
import { getAllDeptListApi } from '@/api/sys/dept'
import { listToTree } from '@/utils/tree'
import { FormSchema } from '@/types/form'

defineOptions({
  name: 'SelfTrainListForm'
})
onMounted(() => {
  getDeptTreeList()
})

// 左侧树形数据
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
provide('treedata', treedata)
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
  name: 'train',
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

const contentHeight = ref<number>(400)
const tableRef = ref()
const resetTableHeight = () => {
  // //页面padding
  // let paddingH = 80
  // //搜索框加操作栏高度
  // nextTick(() => {
  //   let topH: number = getSearchWrapperHeight()
  //   contentHeight.value = documentClientHeight.value - topH - paddingH - 20
  // })
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
  getListApi: getSelfTrainListApi,
  delListApi: delSelfTrainListApi,
  response: {
    list: 'rows',
    total: 'total'
  }
})

const getStateStr = (state: string) => {
  let stateStr = '--'
  if (state) {
    courseShelfType.forEach((element: any) => {
      if (state === element.value) {
        stateStr = element.label
      }
    })
  }
  return stateStr
}

const getCourseType = (row: any) => {
  let type = '--'
  if (row.type == 1) {
    type = '内训'
  } else if (row.type == 2) {
    type = '外训'
  } else {
    type = '其他'
  }
  if (row.secondType == 0) {
    type = type + '/管理类'
  } else if (row.secondType == 1) {
    type = type + '/技能类'
  } else {
    type = type + '/其他'
  }
  return type
}
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
    field: 'trainTime',
    label: '培训时间',
    minWidth: '180px',
    search: {
      show: true,
      component: 'DatePicker',
      componentProps: {
        type: 'daterange', // 组件type属性+
        format: 'YYYY-MM-DD',
        startPlaceholder: '开始时间',
        endPlaceholder: '结束时间',
        style: 'width: 9.2vw'
      }
    },
    formatter: (row: Recordable) => {
      return h('span', row.trainTime ? moment(row.trainTime).format('YYYY-MM-DD') : '--')
    }
  },
  {
    field: 'address',
    minWidth: '120px',
    label: '培训地点',
    formatter: (row: Recordable) => {
      return h('span', row.address ? row.address : '--')
    }
  },
  {
    field: 'teacherUserName',
    minWidth: '120px',
    label: '培训讲师',
    formatter: (row: Recordable) => {
      return h('span', row.teacherUserName ? row.teacherUserName : '--')
    }
  },
  {
    field: 'trainObject',
    label: '培训对象',
    minWidth: '120px',
    formatter: (row: Recordable) => {
      return h('span', row.trainObject ? row.trainObject : '--')
    }
  },
  {
    field: 'subject',
    label: '培训主题',
    minWidth: '160px',
    formatter: (row: Recordable) => {
      return h('span', row.subject ? row.subject : '--')
    }
  },
  {
    field: 'type',
    minWidth: '140px',
    label: '培训类型',
    formatter: (row: Recordable, __: TableColumn, cellValue: string) => {
      return h(
        ElTag,
        {
          type:
            cellValue == '0'
              ? ''
              : cellValue == '1'
              ? 'info'
              : cellValue == '2'
              ? 'warning'
              : 'danger'
        },
        () =>
          cellValue == '0'
            ? '线上'
            : cellValue == '1'
            ? '线下'
            : cellValue == '2'
            ? '内训'
            : cellValue == '3'
            ? '外训'
            : '--'
      )
    }
  },
  {
    field: 'deptName',
    label: '部门名称',
    minWidth: '160px',
    formatter: (row: Recordable) => {
      return h('span', row.deptName ? row.deptName : '--')
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
  beginTime: null,
  endTime: null,
  deptId: null
})
//搜索
const setSearchParamsSub = async (param: Recordable) => {
  console.log('param==>', param)
  let beginTime = param.trainTime
    ? moment(param.trainTime[0]).format('YYYY-MM-DD') + ' 00:00:00'
    : null
  let endTime = param.trainTime
    ? moment(param.trainTime[1]).format('YYYY-MM-DD') + ' 23:59:59'
    : null
  params.beginTime = beginTime
  params.endTime = endTime
  params.deptId = param.deptId ? param.deptId[param.deptId.length - 1] : null
  setSearchParams(params)
}

const searchRef = ref()
const resetTableData = () => {
  tableObject.currentPage = 1
  if (searchRef.value) {
    searchRef.value.setValues({ trainTime: '', deptId: '' })
  }
  setSearchParamsSub({ trainTime: '', deptId: '' })
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

const courseFormRef = ref<ComponentRef<typeof CourseForm>>()
const action = (row: any, flag: string) => {
  courseFormRef.value.openDrawer(flag, row ? row.id : '')
}

//导出加载
const exLoading = ref(false)
//导出
const exportForm = async () => {
  if (tableObject.tableList.length === 0) {
    ElMessage.warning('查询无数据, 无需导出数据')
    return
  }
  exLoading.value = true
  await exportTrainListApi(params)
  exLoading.value = false
}

// 表单项
const schema = ref<FormSchema[]>([
  {
    field: 'deptId',
    label: '',
    component: 'Cascader',
    componentProps: {
      style: 'width: 9.2vw',
      options: treedata,
      props: {
        label: 'deptName',
        value: 'deptId'
      },
      filterable: true,
      placeholder: '部门筛选'
    }
  },
  {
    field: 'trainTime',
    label: '',
    component: 'DatePicker',
    componentProps: {
      style: 'width: 15vw',
      type: 'daterange', // 组件type属性+
      format: 'YYYY-MM-DD',
      startPlaceholder: '开始时间',
      endPlaceholder: '结束时间'
    }
  }
])

//导出单条记录
const exportRecord = async (row: any) => {
  let param = { id: row.id }
  await exportTrainApi(param, row.deptName + '-' + row.teacherUserName + '-' + '自主培训')
}
defineExpose({
  openDrawer
})
</script>
<template>
  <DrawerWrap title="自主培训" :isShow="isShow" ref="drawerWrap">
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
            v-if="isAuth('school:train:query')"
            :schema="schema"
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
              v-hasPermi="'school:train:add'"
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
              v-hasPermi="'school:train:remove'"
            >
              <template #icon>
                <Icon :size="14" icon="svg-icon:deleteBut" />
              </template>
              删除
            </ElButton>
            <ElButton
              :loading="exLoading"
              class="other exportBtn"
              @click="exportForm()"
              plain
              v-hasPermi="'school:train:export'"
            >
              <template #icon>
                <Icon :size="14" icon="svg-icon:exportBut" />
              </template>
              导出
            </ElButton>
          </div>
        </template>
        <template #action="{ row }">
          <!-- <ElButton
            @click="action(row, 'see')"
            v-if="isAuth('school:train:details')"
            :text="true"
            class="btn-default"
          >
            详情
          </ElButton> -->
          <ElButton
            @click="action(row, 'edit')"
            v-if="isAuth('school:train:edit')"
            :text="true"
            class="btn-default"
          >
            编辑
          </ElButton>
          <ElButton
            @click="delData(row, false)"
            v-if="isAuth('school:train:remove')"
            :text="true"
            class="btn-default"
          >
            删除
          </ElButton>
          <ElButton
            @click="exportRecord(row)"
            v-if="isAuth('school:train:export')"
            :text="true"
            class="btn-default"
          >
            导出
          </ElButton>
        </template>
      </Table>
    </template>
  </DrawerWrap>
  <CourseForm title="自主培训" ref="courseFormRef" />
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
