<!-- 课程管理 -->
<script setup lang="ts">
import { computed, onMounted, reactive, ref, nextTick, h, provide } from 'vue'
import { DrawerWrap } from '@/components/DrawerWrapDetails'
import { Search } from '@/components/Search'
import { Table } from '@/components/Table'
import { useTable } from '@/hooks/web/useTable'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { TableColumn } from '@/types/table'
import {
  getCourseListApi,
  delCourseListApi,
  getLecturerListApi,
  editCourseApi
} from '@/api/school/course'
import { isAuth } from '@/utils/is'
import { useEmitt } from '@/hooks/web/useEmitt'
import { useAppStore } from '@/store/modules/app'
import { courseShelfType, yesOrNo } from './config'
import moment from 'moment'
import { CourseForm } from './form'
import { ElMessageBox, ElMessage, ElTag } from 'element-plus'

defineOptions({
  name: 'CourseListForm'
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
  name: 'course',
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
  //页面padding
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
  getLecturerArray()
  resetTableHeight()
}

//获取讲师列表
const lecturerArray = ref<any>([])
const getLecturerArray = async () => {
  try {
    const { data } = await getLecturerListApi()
    lecturerArray.value = []
    data.forEach((element: any) => {
      lecturerArray.value.push({ label: element.lecturerName, value: element.id })
    })
  } catch (error) {}
}
provide('lecturerList', lecturerArray)

const { register, tableObject, methods } = useTable<any>({
  getListApi: getCourseListApi,
  delListApi: delCourseListApi,
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
  if (row.type == 0) {
    type = '内训'
  } else if (row.type == 1) {
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
    field: 'lecturerName',
    minWidth: '120px',
    label: '讲师',
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        placeholder: '讲师筛选',
        style: 'width: 9.2vw',
        options: lecturerArray
      }
    },
    formatter: (row: Recordable) => {
      return h('span', row.lecturerName ? row.lecturerName : '--')
    }
  },
  {
    field: 'type',
    minWidth: '120px',
    label: '类型',
    formatter: (row: Recordable) => {
      return h(
        ElTag,
        {
          type: row.secondType == 0 ? 'success' : row.secondType == 1 ? '' : 'info',
          effect: 'dark'
        },
        () => getCourseType(row)
      )
    }
  },
  {
    field: 'status',
    label: '状态',
    minWidth: '80px',
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        style: 'width: 9.2vw',
        placeholder: '状态筛选',
        options: courseShelfType
      }
    },
    formatter: (row: Recordable, __: TableColumn, cellValue: number) => {
      return h(
        ElTag,
        {
          type: cellValue == 0 ? '' : 'info',
          effect: String(cellValue) == '0' ? 'dark' : 'plain'
        },
        () => getStateStr(String(cellValue))
      )
    }
  },
  {
    field: 'assessStatus',
    label: '考核',
    minWidth: '100px',
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        style: 'width: 9.2vw',
        placeholder: '考核类型筛选',
        options: yesOrNo
      }
    },
    formatter: (_: Recordable, __: TableColumn, cellValue: number) => {
      return h(
        ElTag,
        {
          type: cellValue == 0 ? 'info' : '',
          effect: String(cellValue) == '0' ? 'plain' : 'dark'
        },
        cellValue == 1 ? '是' : '否'
      )
    }
  },
  {
    field: 'createTime',
    minWidth: '140px',
    label: '创建时间',
    formatter: (row: Recordable) => {
      return h('span', row.createTime ? moment(row.createTime).format('YYYY-MM-DD HH:mm:ss') : '--')
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
  courseName: null,
  lecturer: null,
  state: null,
  assessStatus: null
})

//搜索
const setSearchParamsSub = (param: Recordable) => {
  params.courseName = param.courseName ? param.courseName : null
  params.lecturer = param.lecturerName ? param.lecturerName : null
  params.status = param.status ? param.status : null
  params.assessStatus = param.assessStatus ? param.assessStatus : null
  setSearchParams(params)
}

const searchRef = ref()
const resetTableData = () => {
  tableObject.currentPage = 1
  if (searchRef.value) {
    searchRef.value.setValues({
      courseName: null,
      lecturer: null,
      status: null,
      assessStatus: null
    })
  }
  setSearchParamsSub({ courseName: null, lecturer: null, status: null, assessStatus: null })
}

//上架
const onShelf = (row: any) => {
  ElMessageBox.confirm('是否上架改课程？', '上架提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    autofocus: false
  }).then(async () => {
    const params = Object.assign({}, row)
    params.status = row.status == 0 ? 1 : 0
    const res = await editCourseApi(params)
    if (res) {
      nextTick()
      ElMessage.success('上架成功')
      row.status = row.status == 0 ? 1 : 0
    }
  })
}
//下架
const offShelf = (row: any) => {
  ElMessageBox.confirm('是否下架改课程？', '下架提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    autofocus: false
  }).then(async () => {
    const params = Object.assign({}, row)
    params.status = row.status == 0 ? 1 : 0
    const res = await editCourseApi(params)
    if (res) {
      nextTick()
      ElMessage.success('下架成功')
      row.status = row.status == 0 ? 1 : 0
    }
  })
}
//删除加载
const delLoading = ref(false)

//删除
const delData = async (row: any | null, multiple: boolean) => {
  tableObject.currentRow = row
  const { delList, getSelections } = methods
  const selections = await getSelections()
  // 判断选中的数据是否有权限
  let isLimits = true
  selections.forEach((item: any) => {
    if (String(item.status) == '0') {
      isLimits = false
    }
  })
  if (!isLimits) {
    ElMessage.warning('部分课程已上架，无法进行删除操作！')
    return
  }
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
defineExpose({
  openDrawer
})
</script>
<template>
  <DrawerWrap title="课程管理" :isShow="isShow" ref="drawerWrap">
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
            v-if="isAuth('school:course:query')"
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
              v-hasPermi="'school:course:add'"
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
              v-hasPermi="'school:course:remove'"
            >
              <template #icon>
                <Icon :size="14" icon="svg-icon:deleteBut" />
              </template>
              删除
            </ElButton>
          </div>
        </template>
        <template #action="{ row }">
          <!-- <ElButton
            @click="action(row, 'see')"
            v-if="isAuth('school:course:details')"
            :text="true"
            class="btn-default"
          >
            详情
          </ElButton> -->
          <ElButton
            @click="action(row, 'edit')"
            v-if="isAuth('school:course:edit')"
            :text="true"
            class="btn-default"
          >
            编辑
          </ElButton>
          <ElButton
            @click="delData(row, false)"
            v-if="isAuth('school:course:remove') && row.status == '1'"
            :text="true"
            class="btn-default"
          >
            删除
          </ElButton>
          <ElButton
            @click="onShelf(row)"
            v-if="isAuth('school:course:onShelf') && row.status == '1'"
            :text="true"
            class="btn-default"
          >
            上架
          </ElButton>
          <ElButton
            @click="offShelf(row)"
            v-if="isAuth('school:course:offShelf') && row.status == '0'"
            :text="true"
            class="btn-default"
          >
            下架
          </ElButton>
        </template>
      </Table>
    </template>
  </DrawerWrap>
  <CourseForm title="课程管理" ref="courseFormRef" />
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
