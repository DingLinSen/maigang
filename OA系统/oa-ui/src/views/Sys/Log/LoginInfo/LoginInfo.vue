<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { ElButton, ElMessageBox, ElTag, ElMessage } from 'element-plus'
import { Table } from '@/components/Table'
import {
  getLogininforListApi,
  delLogininforListApi,
  cleanLogininforApi,
  unlockLogininforApi,
  exportLogininforApi
} from '@/api/log/login'
import { useTable } from '@/hooks/web/useTable'
import { LoginLogData } from '@/api/log/login/types'
import { getCurrentInstance, h, nextTick, reactive, ref, unref } from 'vue'
import { useEmitt } from '@/hooks/web/useEmitt'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { TableColumn } from '@/types/table'
import moment from 'moment'
import { watch } from 'fs'
import { method } from 'lodash-es'
import { isAuth } from '@/utils/is'

defineOptions({
  name: 'LoginInfor'
})

const { proxy } = getCurrentInstance() as any
const { sys_oper_type, sys_common_status } = proxy.useDict('sys_oper_type', 'sys_common_status')

const getElTagLabel = (value: string): string => {
  let label = ''
  unref(sys_common_status).map((item: any) => {
    if (value === item.value) {
      label = item.label
    }
  })
  return label
}

const getTypeElTagLabel = (value: string): string => {
  let label = ''
  unref(sys_oper_type).map((item: any) => {
    if (value.toString() === item.value) {
      label = item.label
    }
  })
  return label
}

const getTypeElTagType = (value: string): string => {
  let label = ''
  unref(sys_oper_type).map((item: any) => {
    if (value === item.value) {
      label = item.elTagType
    }
  })
  return label
}

const { register, tableObject, methods } = useTable<LoginLogData>({
  getListApi: getLogininforListApi,
  delListApi: delLogininforListApi,
  response: {
    list: 'rows',
    total: 'total'
  }
})

const { getList, setSearchParams } = methods

getList()

useEmitt({
  name: 'getList',
  callback: (type: string) => {
    if (type === 'add') {
      tableObject.currentPage = 1
      unlockOk.value = true
    }
    getList()
  }
})

const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'infoId',
    label: '序号',
    minWidth: '120px'
  },
  {
    field: 'userName',
    label: '用户账号',
    sortable: true,
    search: {
      show: true,
      componentProps: {
        style: 'width: 196px',
        placeholder: '用户账号筛选'
      }
    },
    minWidth: '180px',
    formatter: (row: Recordable) => {
      return h('span', row.userName ? row.userName : '--')
    }
  },
  {
    field: 'ipaddr',
    label: '地址',
    search: {
      show: true,
      componentProps: {
        style: 'width: 196px',
        placeholder: '地址筛选'
      }
    },
    minWidth: '180px',
    formatter: (row: Recordable) => {
      return h('span', row.ipaddr ? row.ipaddr : '--')
    }
  },
  {
    field: 'status',
    label: '状态',
    minWidth: '120px',
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        style: 'width: 196px',
        placeholder: '状态筛选',
        options: sys_common_status
      }
    },
    formatter: (row: Recordable, __: TableColumn, cellValue: string) => {
      return h(
        ElTag,
        {
          type: cellValue === '0' ? '' : 'danger'
        },
        () => getElTagLabel(cellValue)
      )
    }
  },
  {
    field: 'msg',
    label: '描述',
    minWidth: '100px',
    formatter: (row: Recordable) => {
      return h('span', row.msg ? row.msg : '--')
    }
  },
  {
    field: 'accessTime',
    label: '访问时间',
    minWidth: '180px',
    sortable: true,
    search: {
      show: true,
      component: 'DatePicker',
      componentProps: {
        type: 'daterange',
        startPlaceholder: '访问开始时间',
        endPlaceholder: '访问结束时间'
      }
    },
    formatter: (row: Recordable) => {
      return h('span', row.accessTime ? row.accessTime : '--')
    }
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)

//删除加载
const delLoading = ref(false)

//导出加载
const exLoading = ref(false)

//删除
const delData = async (row: LoginLogData | null, multiple: boolean) => {
  tableObject.currentRow = row
  const { delList, getSelections } = methods
  const selections = await getSelections()
  delLoading.value = true
  await delList(
    multiple ? selections.map((v) => v.infoId) : [tableObject.currentRow?.infoId as string],
    multiple
  ).finally(() => {
    unlockOk.value = true
    delLoading.value = false
  })
}

// 是否显示筛选窗口
const isShowCell = ref(false)

// 筛选列
const showCell = () => {
  isShowCell.value = !isShowCell.value
}

//清空
const cleanData = () => {
  ElMessageBox.confirm('是否确认清空所有登录日志数据项？', '清空日志提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    autofocus: false
  }).then(async () => {
    const res = await cleanLogininforApi()
    if (res) {
      nextTick()
      ElMessage.success('清空日志成功')
      unlockOk.value = true
      getList()
    }
  })
}

//解锁
const unlockData = async () => {
  const { getSelections } = methods
  const checkData = await getSelections()
  let userName = checkData[0].userName
  ElMessageBox.confirm('是否确认解锁用户"' + userName + '"数据项？', '解锁提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    autofocus: false
  }).then(async () => {
    const res = await unlockLogininforApi(userName)
    if (res) {
      nextTick()
      ElMessage.success('用户' + userName + '解锁成功')
    }
  })
}

//导出
const exportForm = async () => {
  if (tableObject.tableList.length === 0) {
    ElMessage.warning('查询无数据, 无需导出数据')
    return
  }
  exLoading.value = true
  await exportLogininforApi(params)
  exLoading.value = false
}

const params = reactive<Recordable>({
  userName: '',
  ipaddr: '',
  status: '',
  beginTime: '',
  endTime: '',
  isAsc: '',
  orderByColumn: ''
})

//搜索
const setSearchParamsSub = (param: Recordable) => {
  let beginTime = param.accessTime ? moment(param.accessTime[0]).format('YYYYMMDD') : ''
  let endTime = param.accessTime ? moment(param.accessTime[1]).format('YYYYMMDD') : ''
  params.userName = param.userName ? param.userName : ''
  params.ipaddr = param.ipaddr ? param.ipaddr : ''
  params.status = param.status ? param.status : ''
  params.beginTime = beginTime
  params.endTime = endTime
  unlockOk.value = true
  setSearchParams(params)
}

//当表格的排序条件发生变化的时候会触发该事件
const tableSortChange = (event: any) => {
  params.orderByColumn = event.prop ? event.prop : ''
  params.isAsc = event.order ? event.order : ''
  unlockOk.value = true
  setSearchParams(params)
}

const unlockOk = ref<boolean>(true)
//当用户手动勾选全选 Checkbox 时触发的事件
const selectAll = (selection: Recordable[]) => {
  if (selection.length === 1) {
    unlockOk.value = false
  } else {
    unlockOk.value = true
  }
}

//当用户手动勾选数据行的 Checkbox 时触发的事件
const selectOne = (selection: Recordable[], row: Recordable) => {
  selectAll(selection)
}
</script>

<template>
  <ContentWrap Showtitle="登录日志">
    <template #ContentWrapTitle>
      <div>
        <ElButton
                :loading="exLoading"
                class="other exportBtn"
                @click="exportForm()"
                plain
                v-hasPermi="'system:logininfor:export'"
        >
          <template #icon>
            <Icon :size="14" icon="svg-icon:exportBut"/>
          </template>
          导出
        </ElButton>
        <ElButton
                :loading="delLoading"
                class="exportBtn"
                @click="unlockData()"
                plain
                :disabled="unlockOk"
                v-hasPermi="'system:logininfor:unlock'"
        >
          <template #icon>
            <Icon :size="14" icon="svg-icon:unlock"/>
          </template>
          解锁
        </ElButton>


        <ElButton
          :loading="delLoading"
          class="exportBtn"
          @click="cleanData()"
          plain
          v-hasPermi="'system:logininfor:remove'"
        >
          <template #icon>
            <Icon :size="14" icon="svg-icon:clear"/>
          </template>
          清空
        </ElButton>

        <ElButton
                :loading="delLoading"
                class="btn-other"
                @click="delData(null, true)"
                plain
                v-hasPermi="'system:logininfor:remove'"
        >
          <template #icon>
            <Icon :size="14" icon="svg-icon:deleteBut"/>
          </template>
          删除
        </ElButton>


      </div>
    </template>
    <Table
      v-model:pageSize="tableObject.pageSize"
      v-model:currentPage="tableObject.currentPage"
      :columns="allSchemas.tableColumns"
      :data="tableObject.tableList"
      :loading="tableObject.loading"
      :border="true"
      :isShowCell="isShowCell"
      :header-align="'center'"
      :cotentAlign="'center'"
      :pagination="{
        total: tableObject.total
      }"
      @sort-change="tableSortChange"
      @select-all="selectAll"
      @select="selectOne"
      @register="register"
    >
      <template #operateBtnLeft>
        <Search
          v-if="isAuth('system:logininfor:query')"
          :schema="allSchemas.searchSchema"
          @search="setSearchParamsSub"
          @reset="setSearchParamsSub"
        />
      </template>
    </Table>
  </ContentWrap>
</template>
