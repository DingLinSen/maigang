<template>
  <DrawerWrap title="项目统计" :isShow="isShow" ref="drawerWrap" class="project-overflow-drawer">
    <template #content>
      <!-- 表格 -->
      <Table
        :isShowFilter="true"
        :border="true"
        ref="tableRef"
        :height="contentHeight"
        v-model:pageSize="tableObject.pageSize"
        v-model:currentPage="tableObject.currentPage"
        :data="tableObject.tableList"
        :loading="tableObject.loading"
        :columns="allSchemas.tableColumns"
        :header-align="'center'"
        :cotentAlign="'center'"
        :pagination="{
          total: tableObject.total
        }"
        @register="register"
      >
        <template #operateBtnLeft>
          <Search :schema="allSchemas.searchSchema" @search="setSearchParamsSub" @reset="reset" />
        </template>
        <template #index="{ $index }">
          <span>{{
            $index + 1 + tableObject.pageSize * (tableObject.currentPage - 1)
          }}</span></template
        >
        <template #action="{ row }">
          <ElButton class="btn-default" :text="true" size="small" @click="handle()">处理 </ElButton>
        </template>
      </Table>
    </template>
  </DrawerWrap>
</template>
<script setup lang="ts">
import { ref, reactive, h, getCurrentInstance, inject, unref, onMounted, nextTick } from 'vue'
import { Table } from '@/components/Table'
import { Search } from '@/components/Search'
import { useTable } from '@/hooks/web/useTable'
import { getProjectListApi } from '@/api/project/overview'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import moment from 'moment'
import { DrawerWrap } from '@/components/DrawerWrap'

const drawerWrap = ref<ComponentRef<typeof DrawerWrap>>()
const isShow = ref(false)

const { proxy } = getCurrentInstance() as any
const project_types = [
  {
    label: '农业农村',
    value: 0
  },
  {
    label: '铁路交通',
    value: 1
  },
  {
    label: '军工',
    value: 2
  },
  {
    label: '其他',
    value: 3
  },
  {
    label: '自研',
    value: 4
  }
]
const principalTree = inject('principalTree')
const params = reactive<any>({
  year: '',
  projectType: '',
  principalPerson: ''
})

const getLabel = (value: string): string => {
  let label = '--'
  unref(project_types).map((item: any) => {
    if (value == item.value) {
      label = item.label
    }
  })
  return label
}

// 存放表格的数据
const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'index',
    label: '序号',
    minWidth: '60px'
  },
  {
    field: 'year',
    label: '年份',
    minWidth: '80px',
    formatter: (row: any) => {
      return h('span', row.year ? row.year : '--')
    },
    search: {
      show: true,
      component: 'DatePicker',
      componentProps: {
        style: 'width: 196px',
        type: 'year',
        placeholder: '请选择日期',
        format: 'YYYY'
      }
    }
  },
  {
    field: 'projectType',
    label: '项目类型',
    minWidth: '90px',
    formatter: (row: any) => {
      return h('span', row.projectType ? getLabel(row.projectType) : '--')
    },
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        filterable: true,
        style: 'width: 196px',
        options: project_types,
        placeholder: '项目类型筛选'
      }
    }
  },
  {
    field: 'principalPerson',
    label: '负责人',
    minWidth: '120px',
    formatter: (row: any) => {
      return h('span', row.principalPersonName ? row.principalPersonName : '--')
    },
    search: {
      show: true,
      component: 'Cascader',
      componentProps: {
        placeholder: '负责人筛选',
        style: 'width:100%;',
        filterable: true,
        disabled: false,
        clearable: true,
        options: principalTree,
        props: {
          label: 'deptName',
          value: 'deptId'
        }
      }
    }
  },
  {
    field: 'itemNumber',
    label: '项目编号',
    minWidth: '135px',
    formatter: (row: any) => {
      return h('span', row.itemNumber ? row.itemNumber : '--')
    }
  },
  {
    field: 'projectTitle',
    label: '项目名称',
    minWidth: '160px',
    formatter: (row: any) => {
      return h('span', row.projectTitle ? row.projectTitle : '--')
    }
  },
  {
    field: 'phase',
    label: '当前阶段',
    minWidth: '80px',
    formatter: (row: any) => {
      return h(
        'span',
        row.phase == '1'
          ? '培育'
          : row.phase == '2'
          ? '立项'
          : row.phase == '3'
          ? '实施'
          : row.phase == '4'
          ? '售后'
          : row.phase == '5'
          ? '自研'
          : '--'
      )
    }
  },
  {
    field: 'pmProgressList',
    label: '当前最新进展',
    minWidth: '280px',
    formatter: (row: any) => {
      return h('span', row.pmProgressList.length ? row.pmProgressList[0].content : '--')
    }
  }
])
const { allSchemas } = useCrudSchemas(crudSchemas)
const { register, tableObject, methods } = useTable<any>({
  getListApi: getProjectListApi,
  response: {
    list: 'rows',
    total: 'total'
  }
})
const { getList, setSearchParams } = methods
//打开drawer并初始化
const openDrawer = (id) => {
  drawerWrap.value.isShow = true
  getList()
  resetTableHeight()
}
//搜索
const setSearchParamsSub = (param: any) => {
  console.log(param)
  params.year = param.year ? new Date(param.year).getFullYear() : ''
  params.projectType = param.projectType || param.projectType == 0 ? param.projectType : ''
  params.principalPerson = param.principalPerson ? param.principalPerson[1] : ''
  setSearchParams(params)
}
// 重置
const reset = (param: any) => {
  params.year = ''
  params.projectType = ''
  params.principalPerson = ''
  setSearchParams(params)
}
// 处理
const handle = () => {}
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
defineExpose({
  isShow,
  openDrawer
})
</script>
<style lang="less">
.project-overflow-drawer {
  .el-card {
    border: 0 !important;
  }
}
</style>
