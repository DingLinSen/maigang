<template>
  <DrawerWrap title="消息提醒" :isShow="isShow" ref="drawerWrap" class="project-overflow-drawer">
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
        <template #operateBtnRight>
          <ElButton class="btn-add" @click="allhandle(null, 'add')" plain> 全部已读 </ElButton>
        </template>
        <template #index="{ $index }">
          <span>{{
            $index + 1 + tableObject.pageSize * (tableObject.currentPage - 1)
          }}</span></template
        >
        <template #action="{ row }">
          <ElButton
            class="btn-default"
            :text="true"
            size="small"
            @click="handle(row)"
            v-if="row.isRead == 0"
            >已读
          </ElButton>
        </template>
      </Table>
    </template>
  </DrawerWrap>
</template>
<script setup lang="ts">
import { ref, reactive, h, onMounted, nextTick } from 'vue'
import { ElButton, ElMessage, ElMessageBox, ElTag } from 'element-plus'
import { Table } from '@/components/Table'
import { Search } from '@/components/Search'
import { useTable } from '@/hooks/web/useTable'
import { getNoticeListApi, readApi, allReadApi } from '@/api/project/overview'

import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import moment from 'moment'
import { DrawerWrap } from '@/components/DrawerWrap'

import { useRouter } from 'vue-router'

const { push } = useRouter()

const drawerWrap = ref<ComponentRef<typeof DrawerWrap>>()
const isShow = ref(false)

const emit = defineEmits(['allRead'])

const params = reactive<any>({
  noticeFlag: ''
})

// 存放表格的数据
const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'index',
    label: '序号',
    minWidth: '80px'
  },
  {
    field: 'noticeFlag',
    label: '消息分类',
    minWidth: '100px',
    formatter: (row: any) => {
      return h(
        'span',
        row.noticeFlag == 1
          ? '提醒'
          : row.noticeFlag == 2
          ? '消息'
          : row.noticeFlag == 3
          ? '督促'
          : '--'
      )
    },
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        style: 'width: 196px',
        options: [
          {
            value: 1,
            label: '提醒'
          },
          {
            value: 2,
            label: '消息'
          },
          {
            value: 3,
            label: '督促'
          }
        ],
        placeholder: '消息分类筛选'
      }
    }
  },
  {
    field: 'noticeType',
    label: '消息类型',
    minWidth: '100px',
    formatter: (row: any) => {
      return h('span', row.noticeType ? row.noticeType : '--')
    }
  },
  {
    field: 'projectTitle',
    label: '项目名称',
    minWidth: '120px',
    formatter: (row: any) => {
      return h('span', row.projectTitle ? row.projectTitle : '--')
    }
  },
  {
    field: 'content',
    label: '消息内容',
    minWidth: '220px',
    formatter: (row: any) => {
      return h('span', row.content ? row.content : '--')
    }
  },
  {
    field: 'principalPersonName',
    label: '当前负责人',
    minWidth: '80px',
    formatter: (row: any) => {
      return h('span', row.principalPersonName ? row.principalPersonName : '--')
    }
  },
  {
    field: 'isRead',
    label: '是否已读',
    minWidth: '80px',
    formatter: (row: any) => {
      return h('span', row.isRead == '1' ? '已读' : row.isRead == '0' ? '未读' : '--')
    }
  },
  {
    field: 'createTime',
    label: '时间',
    minWidth: '120px',
    formatter: (row: any) => {
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
const { allSchemas } = useCrudSchemas(crudSchemas)
const { register, tableObject, methods } = useTable<any>({
  getListApi: getNoticeListApi,
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
  params.noticeFlag = param.noticeFlag ? param.noticeFlag : ''
  setSearchParams(params)
}
// 重置
const reset = (param: any) => {
  params.noticeFlag = ''
  setSearchParams(params)
}

const allhandle = async () => {
  ElMessageBox.confirm('是否要全部已读?', '确认提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    autofocus: false
  })
    .then(async () => {
      tableObject.loading = true
      let res = await allReadApi().finally(() => {
        setTimeout(() => {
          tableObject.loading = false
        }, 200)
      })
      if (res) {
        ElMessage.success({
          message: '全部已读成功!'
        })
        setSearchParams(params)
        emit('allRead')
      }
    })
    .catch(() => {})
  // let res = await allReadApi({ messageId: info.id })
}
// 处理
const handle = async (info) => {
  if (info.phase == 1) {
    push({ name: 'Cultivate', query: { messagepid: info.pid } })
  } else if (info.phase == 2) {
    push({ name: 'Implement', query: { messagepid: info.pid } })
  } else if (info.phase == 3) {
    let type = ''
    if (info.content) {
      type = info.content.indexOf('补充', info.content.length - '补充'.length) !== -1 ? '1' : '0'
    }
    push({ name: 'Ssxm', query: { pid: info.pid, status: info.status, type: type } })
  } else if (info.phase == 4) {
    push({ name: 'AfterSales', query: { messagepid: info.pid, status: info.status } })
  } else if (info.phase == 5) {
    push({ name: 'Scientific', query: { messagepid: info.pid } })
  }

  let res = await readApi({ messageId: info.messageId })
  if (res) {
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
