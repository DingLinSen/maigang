<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { h, reactive, ref, onMounted, unref } from 'vue'
import { ElDialog, ElMessage } from 'element-plus'
import { Table } from '@/components/Table'
import { useTable } from '@/hooks/web/useTable'
import { Search } from '@/components/Search'
import { TableColumn } from '@/types/table'
import { accessLogApi, unLocktApi } from '@/api/login'
import { logType } from '@/api/login/types'
import { applicationList } from '@/api/applicationManage'
import moment from 'moment'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
// 解锁账号确认弹框
const unLockDialog = ref<boolean>(false)
const username = ref<string | undefined>()
// 获取应用id查询列表
let appList = ref<any>([])
// 查询条件
let params = reactive<Recordable>({})
// 获取列表
const { register, tableObject, methods } = useTable<logType>({
  getListApi: accessLogApi,
  response: {
    list: 'data.list', // 接口返回字段
    total: 'data.total'
  }
})
const getAppList = async () => {
  let params = reactive<Recordable>({
    enabled: true,
    pageNum: 1,
    pageSize: 999,
    id: null,
    name: null
  })
  const res = await applicationList(params)
  if (res.data.list) {
    const data = res.data.list
    data.forEach((item: any) => {
      appList.value.push({
        label: item.name,
        value: item.clientId
      })
    })
  }
}
const { getList, setSearchParams } = methods
// 表格字段
const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'id',
    label: 'id',
    minWidth: '100px',
    formatter: (row: any, __: TableColumn) => {
      return h('span', row.id ? row.id : '--')
    }
  },
  {
    field: 'username',
    label: '用户名称',
    minWidth: '180px',
    search: {
      show: true,
      componentProps: {
        style: 'width: 196px',
        placeholder: '用户名称'
      }
    },
    formatter: (row: any, __: TableColumn) => {
      return h('span', row.username ? row.username : '--')
    }
  },
  {
    field: 'appName',
    label: '应用',
    minWidth: '180px',
    formatter: (row: any, __: TableColumn) => {
      return h('span', row.appName ? row.appName : '--')
    },
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        style: {
          width: '198px'
        },
        options: appList,
        filterable: true,
        fitInputWidth: true,
        placeholder: '应用'
      }
    }
  },
  // {
  //   field: 'appCode',
  //   label: '应用ID',
  //   minWidth: '280px',
  //   formatter: (row: any, __: TableColumn) => {
  //     return h('span', row.appCode ? row.appCode : '--')
  //   },

  // },
  {
    field: 'clientIp',
    label: '请求ip',
    minWidth: '180px',
    formatter: (row: any, __: TableColumn) => {
      return h('span', row.clientIp ? row.clientIp : '--')
    }
  },
  {
    field: 'date',
    label: '',
    table: {
      show: false
    },
    search: {
      show: true,
      component: 'DatePicker',
      componentProps: {
        type: 'datetimerange', // 组件type属性+
        format: 'YYYY-MM-DD HH:mm',
        startPlaceholder: '开始时间',
        endPlaceholder: '结束时间'
      }
    }
  },
  {
    field: 'eventType',
    label: '事件',
    minWidth: '180px',
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        style: {
          width: '198px'
        },
        options: [
          {
            label: '获取授权码',
            value: 1
          },
          {
            label: '获取accessToken',
            value: 2
          },
          {
            label: '退出',
            value: 3
          }
        ],
        placeholder: '事件'
      }
    },
    formatter: (row: any, __: TableColumn) => {
      return h(
        'span',
        {
          style: {
            color: row.eventType === 1 ? '#8C41FF' : row.eventType === 2 ? '#00A0E9' : '#10825A'
          }
        },
        row.eventType
          ? row.eventType === 1
            ? '获取授权码'
            : row.eventType === 2
            ? '获取accessToken'
            : '退出'
          : '--'
      )
    }
  },
  {
    field: 'status',
    label: '状态',
    minWidth: '180px',
    formatter: (row: any, __: TableColumn) => {
      return h(
        'span',
        {
          style: {
            color: row.status === 1 ? '#00A0E9' : row.status === 2 ? '#FF333A' : '#FEBF2E'
          }
        },
        row.status ? (row.status === 1 ? '成功' : row.status === 2 ? '失败' : '锁定') : '--'
      )
    }
  },
  {
    field: 'description',
    label: '描述',
    minWidth: '180px',
    formatter: (row: any, __: TableColumn) => {
      return h('span', row.description ? row.description : '--')
    }
  },
  {
    field: 'createTime',
    label: '创建时间',
    minWidth: '180px',
    formatter: (row: any, __: TableColumn) => {
      return h('span', row.createTime ? moment(row.createTime).format('YYYY-MM-DD HH:mm:ss') : '--')
    }
  },
  {
    field: 'action',
    label: '操作',
    width: '120',
    fixed: 'right'
  }
])
// 查询方法
const setSearchParamsSub = (param) => {
  params.clientId = param.appName ? param.appName : null
  params.startTime = param.date ? moment(param.date[0]).format('YYYY-MM-DD HH:mm') + ':00' : null
  params.endTime = param.date ? moment(param.date[1]).format('YYYY-MM-DD HH:mm') + ':00' : null
  params.eventType = param.eventType ? param.eventType : null
  params.username = param.username ? param.username : null
  setSearchParams(params)
}
// 解锁账号
const unLock = async (val) => {
  unLockDialog.value = true
  username.value = val.username ? val.username : null
}
// 确认解锁
const unLockEnter = async () => {
  const res = await unLocktApi(username.value)
  unLockDialog.value = false
  if (res) {
    if (res.message === 'OK') {
      ElMessage.success('解锁成功')
    } else {
      ElMessage.success('解锁失败')
    }
  }
}
// 初始化列表
onMounted(() => {
  getAppList()
  getList()
})
// 过滤表格中哪些可以查询
const { allSchemas } = useCrudSchemas(crudSchemas)
</script>

<template>
  <ContentWrap>
    <Table
      v-model:pageSize="tableObject.pageSize"
      v-model:currentPage="tableObject.currentPage"
      :columns="allSchemas.tableColumns"
      :data="tableObject.tableList"
      :loading="tableObject.loading"
      :border="true"
      :headerAlign="'center'"
      :cotentAlign="'center'"
      ref="tableRef"
      :selection="false"
      :pagination="{
        total: tableObject.total
      }"
      @register="register"
    >
      <template #operateBtnLeft>
        <Search
          :schema="allSchemas.searchSchema"
          @search="setSearchParamsSub"
          @reset="setSearchParamsSub"
        />
      </template>
      <template #action="{ row }">
        <ElButton
          v-if="row.status === 3 && !row.unlocked"
          type="primary"
          @click="unLock(row)"
          :text="true"
          class="btn-default"
        >
          解锁账号
        </ElButton>
        <!-- 无按钮时撑起高度 -->
        <span v-else style="display: inline-block; padding: 14.5px 10px"> </span>
      </template>
    </Table>
  </ContentWrap>
  <ElDialog
    v-model="unLockDialog"
    ref="elDialog"
    width="20%"
    align-center
    draggable
    title="确认解锁"
  >
    <span>是否确认解锁选中的账号</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="unLockDialog = false">取消</el-button>
        <el-button @click="unLockEnter()" type="primary"> 确认 </el-button>
      </span>
    </template>
  </ElDialog>
</template>

<style lang="less" scoped></style>
