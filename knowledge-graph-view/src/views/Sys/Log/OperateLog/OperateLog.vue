<script lang="ts" setup>
import { OperateLogForm } from './components/index'
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { ElButton, ElMessageBox, ElTag, ElMessage } from 'element-plus'
import { Table } from '@/components/Table'
import {
  getOperateLogListApi,
  delOperateLogListApi,
  cleanOperateLogApi,
  exportOperateLogApi
} from '@/api/log/operate'
import { useTable } from '@/hooks/web/useTable'
import { OperateLogData } from '@/api/log/operate/types'
import { getCurrentInstance, h, nextTick, onMounted, reactive, ref, unref } from 'vue'
import { useEmitt } from '@/hooks/web/useEmitt'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { TableColumn } from '@/types/table'
import moment from 'moment'
import { isAuth } from '@/utils/is'

defineOptions({
  name: 'OperateLog'
})

const { proxy } = getCurrentInstance() as any
const { sys_oper_type, sys_common_status } = proxy.useDict('sys_oper_type', 'sys_common_status')

const searchRef = ref()

onMounted(() => {
  searchRef.value.setValues({ createTime: moment(new Date()).format('YYYY') })
})

const sysStatusData = [
  {
    value: '0',
    label: '成功'
  },
  {
    value: '1',
    label: '失败'
  }
]
const sysTypeData = [
  {
    value: '0',
    label: '其他'
  },
  {
    value: '1',
    label: '查询'
  },
  {
    value: '2',
    label: '新增'
  },
  {
    value: '3',
    label: '修改'
  },
  {
    value: '4',
    label: '删除'
  },
  {
    value: '5',
    label: '导入'
  },
  {
    value: '6',
    label: '导出'
  },
  {
    value: '7',
    label: '下载'
  },
  {
    value: '8',
    label: '上传'
  },
  {
    value: '9',
    label: '登录'
  }
]
const getElTagLabel = (value: string): string => {
  let label = ''
  unref(sysStatusData).map((item: any) => {
    if (value == item.value) {
      label = item.label
    }
  })
  return label
}

const getTypeElTagLabel = (value: string): string => {
  let label = ''
  unref(sysTypeData).map((item: any) => {
    if (value == item.value) {
      label = item.label
    }
  })
  return label
}

// const getTypeElTagType = (value: string): string => {
//   let label = ''
//   unref(sys_oper_type).map((item: any) => {
//     if (value === item.value) {
//       label = item.elTagType
//     }
//   })
//   return label
// }

const { register, tableObject, methods } = useTable<OperateLogData>({
  getListApi: getOperateLogListApi,
  delListApi: delOperateLogListApi,
  response: {
    list: 'rows',
    total: 'total'
  }
})

const { getList, setSearchParams } = methods

setSearchParams({ createTime: moment(new Date()).format('YYYY') })

const operateLogFormRef = ref<ComponentRef<typeof OperateLogForm>>()

useEmitt({
  name: 'getList',
  callback: (type: string) => {
    if (type === 'add') {
      tableObject.currentPage = 1
    }
    getList()
  }
})

const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'logId',
    label: '日志编号',
    minWidth: '120px'
  },
  {
    field: 'moduleName',
    label: '系统模块',
    search: {
      show: true,
      componentProps: {
        style: 'width: 196px',
        placeholder: '系统模块筛选'
      }
    },
    minWidth: '180px',
    formatter: (row: Recordable) => {
      return h('span', row.moduleName ? row.moduleName : '--')
    }
  },
  {
    field: 'businessType',
    label: '操作类型',
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        placeholder: '操作类型筛选',
        style: 'width: 196px',
        options: sysTypeData
      }
    },
    formatter: (row: Recordable, __: TableColumn, cellValue: string) => {
      return h('span', getTypeElTagLabel(row.businessType) ? getTypeElTagLabel(row.businessType) : '--')
    },
    minWidth: '120px'
  },
  {
    field: 'content',
    label: '操作内容',
    formatter: (row: Recordable) => {
      return h('span', row.content ? row.content : '--')
    },
    minWidth: '200px'
  },
  {
    field: 'requestMethod',
    label: '请求方式',
    minWidth: '100px',
    formatter: (row: Recordable) => {
      return h('span', row.requestMethod ? row.requestMethod : '--')
    }
  },
  {
    field: 'userName',
    label: '操作人员',
    sortable: true,
    // search: {
    //   show: true,
    //   componentProps: {
    //     style: 'width: 196px',
    //     placeholder: '操作人员筛选'
    //   }
    // },
    minWidth: '120px',
    formatter: (row: Recordable) => {
      return h('span', row.userName ? row.userName : '--')
    }
  },
  {
    field: 'operIp',
    label: '主机',
    minWidth: '180px',
    formatter: (row: Recordable) => {
      return h('span', row.operIp ? row.operIp : '--')
    }
  },
  {
    field: 'status',
    label: '操作状态',
    minWidth: '120px',
    // search: {
    //   show: true,
    //   component: 'Select',
    //   componentProps: {
    //     style: 'width: 196px',
    //     placeholder: '操作状态筛选',
    //     options: sysStatusData
    //   }
    //
    // },
    formatter: (row: Recordable, __: TableColumn, cellValue: string) => {
      return h(
        ElTag,
        {
          type: cellValue == 0 ? 'success' : 'danger'
        },
        () => getElTagLabel(cellValue)
      )
    }
  },
  {
    field: 'createTime',
    minWidth: '180px',
    label: '操作时间',
    sortable: true,
    search: {
      show: true,
      component: 'DatePicker',
      componentProps: {
        // startPlaceholder: '操作开始时间',
        // endPlaceholder: '操作结束时间',
        type: 'year'
      }
    },
    formatter: (row: Recordable) => {
      return h('span', row.createTime ? row.createTime : '--')
    }
  }
  // {
  //   field: 'action',
  //   minWidth: '160px',
  //   showOverflowTooltip: false,
  //   label: '操作',
  //   fixed: 'right'
  // }
])

const { allSchemas } = useCrudSchemas(crudSchemas)

//添加
const AddAction = () => {
  operateLogFormRef.value.openDrawer('add')
}

//删除加载
const delLoading = ref(false)

//导出加载
const exLoading = ref(false)

//删除
const delData = async (row: OperateLogData | null, multiple: boolean) => {
  tableObject.currentRow = row
  const { delList, getSelections } = methods
  const selections = await getSelections()
  delLoading.value = true
  await delList(
    multiple ? selections.map((v) => v.operId) : [tableObject.currentRow?.operId as string],
    multiple
  ).finally(() => {
    delLoading.value = false
  })
}

//table操作栏按钮事件
const action = (row: OperateLogData, type: string) => {
  operateLogFormRef.value.openDrawer(type, row)
}

// 是否显示筛选窗口
const isShowCell = ref(false)

// 筛选列
const showCell = () => {
  isShowCell.value = !isShowCell.value
}

//清空
const cleanData = () => {
  ElMessageBox.confirm('是否确认清空所有操作日志数据项？', '清空日志提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    autofocus: false
  }).then(async () => {
    const res = await cleanOperateLogApi()
    if (res) {
      nextTick()
      ElMessage.success('清空日志成功')
      getList()
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
  await exportOperateLogApi(params)
  exLoading.value = false
}

const params = reactive<Recordable>({
  businessType: '',
  moduleName: '',
  // year: moment(new Date()).format('YYYY')
  year: ''
})

//搜索
const setSearchParamsSub = (param: Recordable) => {
  params.year = param.createTime ? moment(param.createTime).format('YYYY') : ''
  params.moduleName = param.moduleName ? param.moduleName : ''
  params.businessType = param.businessType ? param.businessType : ''
  setSearchParams(params)
}

//当表格的排序条件发生变化的时候会触发该事件
const tableSortChange = (event: any) => {
  params.orderByColumn = event.prop ? event.prop : ''
  params.isAsc = event.order ? event.order : ''
  setSearchParams(params)
}
</script>

<template>
  <ContentWrap Showtitle="操作日志">
    <template #ContentWrapTitle>
      <!--      <div>-->
      <!--        <ElButton-->
      <!--                :loading="exLoading"-->
      <!--                class="other exportBtn"-->
      <!--                @click="exportForm()"-->
      <!--                plain-->
      <!--                v-hasPermi="'system:operlog:export'"-->
      <!--        >-->
      <!--          <template #icon>-->
      <!--            <Icon :size="14" icon="svg-icon:exportBut"/>-->
      <!--          </template>-->
      <!--          导出-->
      <!--        </ElButton>-->

      <!--        <ElButton-->
      <!--          :loading="delLoading"-->
      <!--          class="exportBtn"-->
      <!--          @click="cleanData()"-->
      <!--          plain-->
      <!--          v-hasPermi="'system:operlog:remove'"-->
      <!--        >-->
      <!--          <template #icon>-->
      <!--            <Icon :size="14" icon="svg-icon:clear"/>-->
      <!--          </template>-->
      <!--          清空-->
      <!--        </ElButton>-->

      <!--        <ElButton-->
      <!--                :loading="delLoading"-->
      <!--                class="btn-other"-->
      <!--                @click="delData(null, true)"-->
      <!--                plain-->
      <!--                v-hasPermi="'system:operlog:remove'"-->
      <!--        >-->
      <!--          <template #icon>-->
      <!--            <Icon :size="14" icon="svg-icon:deleteBut"/>-->
      <!--          </template>-->
      <!--          删除-->
      <!--        </ElButton>-->

      <!--       </div>-->
    </template>

    <Table
      v-model:currentPage="tableObject.currentPage"
      v-model:pageSize="tableObject.pageSize"
      :border="true"
      :columns="allSchemas.tableColumns"
      :cotentAlign="'center'"
      :data="tableObject.tableList"
      :header-align="'center'"
      :isShowCell="isShowCell"
      :loading="tableObject.loading"
      :pagination="{
        total: tableObject.total
      }"
      @register="register"
      @sort-change="tableSortChange"
    >
      <template #operateBtnLeft>
        <Search
          v-if="isAuth('system:operlog:query')"
          ref="searchRef"
          :schema="allSchemas.searchSchema"
          @reset="setSearchParamsSub"
          @search="setSearchParamsSub"
        />
      </template>
      <template #action="{ row }">
        <ElButton :text="true" class="btn-default" @click="action(row, 'see')"> 详情</ElButton>
      </template>
    </Table>
  </ContentWrap>

  <OperateLogForm ref="operateLogFormRef" title="操作日志"/>
</template>
