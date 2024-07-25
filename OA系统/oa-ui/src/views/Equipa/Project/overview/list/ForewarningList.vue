<template>
  <DrawerWrap title="预警事项" :isShow="isShow" ref="drawerWrap" class="project-overflow-drawer">
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
        <template #index="{ $index }">
          <span>{{
            $index + 1 + tableObject.pageSize * (tableObject.currentPage - 1)
          }}</span></template
        >
        <!-- <template #operateBtnLeft>
          <Search :schema="allSchemas.searchSchema" @search="setSearchParamsSub" @reset="reset" />
        </template> -->
      </Table>
    </template>
  </DrawerWrap>
</template>
<script setup lang="ts">
import { ref, reactive, h, getCurrentInstance, inject, unref, onMounted, nextTick } from 'vue'
import { Table } from '@/components/Table'
import { Search } from '@/components/Search'
import { useTable } from '@/hooks/web/useTable'
import { getProjectWarnListApi } from '@/api/project/overview'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import moment from 'moment'
import { DrawerWrap } from '@/components/DrawerWrap'

const drawerWrap = ref<ComponentRef<typeof DrawerWrap>>()
const isShow = ref(false)

const { proxy } = getCurrentInstance() as any
const { project_types } = proxy.useDict('project_types')
const principalTree = inject('principalTree')
const params = reactive<any>({
  principalPerson: '',
  projectTitle: ''
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
    field: 'projectTitle',
    label: '项目名称',
    minWidth: '160px',
    formatter: (row: any) => {
      return h('span', row.projectTitle ? row.projectTitle : '--')
    }
    // search: {
    //   show: true,
    //   component: 'Input',
    //   componentProps: {
    //     style: 'width: 196px',
    //     placeholder: '请输入项目名称'
    //   }
    // }
  },
  {
    field: 'principalPerson',
    label: '负责人',
    minWidth: '120px',
    formatter: (row: any) => {
      return h('span', row.principalPersonName ? row.principalPersonName : '--')
    }
    // search: {
    //   show: true,
    //   component: 'Cascader',
    //   componentProps: {
    //     placeholder: '负责人筛选',
    //     style: 'width:100%;',
    //     filterable: true,
    //     disabled: false,
    //     clearable: true,
    //     options: principalTree,
    //     props: {
    //       label: 'deptName',
    //       value: 'deptId'
    //     }
    //   }
    // }
  },
  {
    field: '预警时间',
    label: '时间',
    minWidth: '120px',
    formatter: (row: Recordable) => {
      return h('span', row.createTime ? moment(row.createTime).format('YYYY-MM-DD') : '--')
    }
  },
  {
    field: 'content',
    label: '预警事项',
    minWidth: '320px',
    formatter: (row: any) => {
      return h('span', row.content ? row.content : '--')
    }
  }
])
const { allSchemas } = useCrudSchemas(crudSchemas)
const { register, tableObject, methods } = useTable<any>({
  getListApi: getProjectWarnListApi,
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
  params.projectTitle = param.projectTitle ? param.projectTitle : ''
  params.principalPerson = param.principalPerson ? param.principalPerson[1] : ''
  setSearchParams(params)
}
// 重置
const reset = (param: any) => {
  params.projectTitle = ''
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
