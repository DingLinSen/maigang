<template>
  <DrawerWrap title="待办事宜" :isShow="isShow" ref="drawerWrap" class="project-overflow-drawer">
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
          <ElButton
            v-if="row.isRead == 0"
            class="btn-default"
            :text="true"
            size="small"
            @click="handle(row)"
            >处理
          </ElButton>
        </template>
      </Table>
    </template>
  </DrawerWrap>
</template>
<script setup lang="ts">
import { ref, reactive, h, onMounted, nextTick } from 'vue'
import { Table } from '@/components/Table'
import { Search } from '@/components/Search'
import { useTable } from '@/hooks/web/useTable'
import { getBacklogListApi } from '@/api/project/overview'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import moment from 'moment'
import { DrawerWrap } from '@/components/DrawerWrap'
import { useRouter } from 'vue-router'

const { push } = useRouter()
const drawerWrap = ref<ComponentRef<typeof DrawerWrap>>()
const isShow = ref(false)

const params = reactive<any>({
  isRead: '',
  projectTitle: ''
})

// 存放表格的数据
const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'index',
    label: '序号',
    minWidth: '80px'
  },
  {
    field: 'projectTitle',
    label: '项目名称',
    minWidth: '120px',
    formatter: (row: Recordable) => {
      return h('span', row.projectTitle ? row.projectTitle : '--')
    },
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        style: 'width: 196px',
        placeholder: '请输入项目名称'
      }
    }
  },
  {
    field: 'applyUserName',
    label: '申请人',
    minWidth: '140px',
    formatter: (row: Recordable) => {
      return h('span', row.applyUserName ? row.applyUserName : '--')
    }
  },
  {
    field: 'status',
    label: '项目状态',
    minWidth: '120px',
    formatter: (row: Recordable) => {
      return h('span', row.status ? getProjectStatus(row) : '--')
    }
  },
  {
    field: 'isRead',
    label: '是否处理',
    minWidth: '80px',
    formatter: (row: Recordable) => {
      return h('span', row.isRead == '1' ? '已处理' : row.isRead == '0' ? '未处理' : '--')
    },
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        style: 'width: 196px',
        options: [
          {
            value: '',
            label: '全部'
          },
          {
            value: '0',
            label: '未处理'
          },
          {
            value: '1',
            label: '已处理'
          }
        ],
        placeholder: '状态筛选'
      }
    }
  },
  {
    field: 'content',
    label: '申请内容',
    minWidth: '180px',
    formatter: (row: Recordable) => {
      return h('span', row.content ? row.content : '--')
    }
  },
  {
    field: 'createTime',
    label: '时间',
    minWidth: '120px',
    formatter: (row: Recordable) => {
      return h('span', row.createTime ? moment(row.createTime).format('YYYY-MM-DD') : '--')
    }
  },
  {
    field: 'action',
    fixed: 'right',
    minWidth: '120px',
    label: '操作',
    showOverflowTooltip: false
  }
])

const getProjectStatus = (row: any) => {
  let statusStr = '--'
  //phase 阶段 1培育 2立项 3实施 4售后 5自研'
  if (row.phase == '1') {
    if (row.status == '0') {
      statusStr = '培育审批中'
    } else if (row.status == '1') {
      statusStr = '进展中'
    } else if (row.status == '2') {
      statusStr = '结束转立项审批中'
    } else if (row.status == '3') {
      statusStr = '结束转立项'
    } else if (row.status == '4') {
      statusStr = '结束终止审批中'
    } else if (row.status == '5') {
      statusStr = '结束终止'
    } else if (row.status == '6') {
      statusStr = '负责人变更审批中'
    }
  } else if (row.phase == '2') {
    if (row.status == '1') {
      statusStr = '培育转立项审批中'
    } else if (row.status == '2') {
      statusStr = '进展中'
    } else if (row.status == '3') {
      statusStr = '立项暂停'
    } else if (row.status == '4') {
      statusStr = '结束转实施'
    } else if (row.status == '5') {
      statusStr = '结束终止'
    } else if (row.status == '6') {
      statusStr = '状态变更审批中'
    } else if (row.status == '7') {
      statusStr = '里程碑节点审批中'
    } else if (row.status == '8') {
      statusStr = '立项转实施审批中'
    } else if (row.status == '9') {
      statusStr = '负责人变更审批中'
    } else if (row.status == '10') {
      statusStr = '里程碑变更审批中'
    }
  } else if (row.phase == '3') {
    if (row.status == '1') {
      statusStr = '立项转实施审批中'
    } else if (row.status == '2') {
      statusStr = '实施中'
    } else if (row.status == '3') {
      statusStr = '已验收'
    } else if (row.status == '4') {
      statusStr = '已回款转售后'
    } else if (row.status == '5') {
      statusStr = '项目变更审批中'
    } else if (row.status == '6') {
      statusStr = '已回款转售后审批中'
    }
  } else if (row.phase == '4') {
    if (row.status == '1') {
      statusStr = '实施转售后审批中'
    } else if (row.status == '2') {
      statusStr = '售后中'
    } else if (row.status == '3') {
      statusStr = '项目结束'
    } else if (row.status == '4') {
      statusStr = '项目结束审批中'
    } else if (row.status == '5') {
      statusStr = '销售经理变更审批中'
    } else if (row.status == '6') {
      statusStr = '售后结束'
    }
  } else if (row.phase == '5') {
    if (row.status == '1') {
      statusStr = '自研项目审批中'
    } else if (row.status == '2') {
      statusStr = '进展中'
    } else if (row.status == '3') {
      statusStr = '状态变更审批中'
    } else if (row.status == '4') {
      statusStr = '负责人变更审批中'
    } else if (row.status == '5') {
      statusStr = '结题审批中'
    } else if (row.status == '6') {
      statusStr = '已结题'
    } else if (row.status == '7') {
      statusStr = '已终止'
    } else if (row.status == '8') {
      statusStr = '已暂停'
    }
  }
  return statusStr
}

const { allSchemas } = useCrudSchemas(crudSchemas)
const { register, tableObject, methods } = useTable<any>({
  getListApi: getBacklogListApi,
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
  params.isRead = param.isRead ? param.isRead : ''
  params.projectTitle = param.projectTitle ? param.projectTitle : ''
  setSearchParams(params)
}
// 重置
const reset = (param: any) => {
  params.isRead = ''
  params.projectTitle = ''
  setSearchParams(params)
}
// 处理
const handle = (info) => {
  if (info.phase == 1) {
    push({ name: 'Cultivate', query: { pid: info.pid } })
  } else if (info.phase == 2) {
    push({ name: 'Implement', query: { pid: info.pid } })
  } else if (info.phase == 3) {
    let type = ''
    if (info.content) {
      type = info.content.indexOf('补充', info.content.length - '补充'.length) !== -1 ? '1' : '0'
    }
    push({ name: 'Ssxm', query: { pid: info.pid, status: info.status, type: type } })
  } else if (info.phase == 4) {
    push({ name: 'AfterSales', query: { pid: info.pid, status: info.status } })
  } else if (info.phase == 5) {
    push({ name: 'Scientific', query: { pid: info.pid } })
  }
}
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
