<script setup lang="ts">
import { h, reactive, ref, nextTick } from 'vue'
import { ElButton, ElMessage, ElMessageBox } from 'element-plus'

import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Table } from '@/components/Table'
// import { useTable } from '@/hooks/web/useTable'
// import { useEmitt } from '@/hooks/web/useEmitt'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { isAuth } from '@/utils/is'
// import { getFarmCourseListApi, delFarmCourseApi } from '@/api/agriculturalClassroom'
// import { backupForm } from './components/index'

defineOptions({
  name: 'BackUp'
})

// const { register, tableObject, methods } = useTable<any>({
//   getListApi: getFarmCourseListApi,
//   delListApi: delFarmCourseApi,
//   response: {
//     list: 'rows',
//     total: 'total',
//     key: 'id'
//   }
// })

// const { getList, setSearchParams } = methods

// getList()

// const BackUpFormRef = ref<ComponentRef<typeof backupForm>>()
// useEmitt({
//   name: 'getClassRoomList',
//   callback: (type: string) => {
//     if (type === 'add') {
//       tableObject.currentPage = 1
//     }
//     getList()
//   }
// })
const crudSchemas = reactive<CrudSchema[]>([
  // {
  //   field: 'userId',
  //   label: '序号',
  //   type: 'index',
  //   fixed: 'left'
  // },
  {
    field: 'logNumber',
    minWidth: '120px',
    label: '日志编号',
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        style: 'width:200px;' //宽度
      }
    },
    formatter: (row: Recordable) => {
      return h('span', row.logNumber ? row.logNumber : '--')
    }
  },
  {
    field: 'sysModules',
    minWidth: '180px',
    label: '系统模块',
    formatter: (row: Recordable) => {
      return h('span', row.sysModules ? row.sysModules : '--')
    }
  },
  {
    field: 'operateType',
    minWidth: '120px',
    label: '操作类型',
    formatter: (row: Recordable) => {
      return h('span', row.operateType ? row.operateType : '--')
    }
  },
  {
    field: 'operateContent',
    minWidth: '180px',
    label: '操作内容',
    formatter: (row: Recordable) => {
      return h('span', row.operateContent ? row.operateContent : '--')
    }
  },
  {
    field: 'requestMethod',
    minWidth: '120px',
    label: '请求方式',
    formatter: (row: Recordable) => {
      return h('span', row.requestMethod ? row.requestMethod : '--')
    }
  },
  {
    field: 'operator',
    minWidth: '120px',
    label: '操作人员',
    formatter: (row: Recordable) => {
      return h('span', row.operator ? row.operator : '--')
    }
  },
  {
    field: 'host',
    minWidth: '180px',
    label: '主机',
    formatter: (row: Recordable) => {
      return h('span', row.host ? row.host : '--')
    }
  },
  {
    field: 'operateStatus',
    minWidth: '120px',
    label: '操作状态',
    formatter: (row: Recordable) => {
      return h('span', row.operateStatus ? row.operateStatus : '--')
    }
  },
  {
    field: 'operateTime',
    minWidth: '180px',
    label: '操作时间',
    formatter: (row: Recordable) => {
      return h('span', row.operateTime ? row.operateTime : '--')
    }
  }
])
const { allSchemas } = useCrudSchemas(crudSchemas)

//添加
const addAction = () => {
  nextTick(() => {
    // BackUpFormRef.value?.openDrawer('add', '')
  })
}

//删除加载
const delLoading = ref(false)

//删除
const delData = async (row: any | null, multiple: boolean) => {
  ElMessageBox.confirm('是否删除所选中数据?', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
  })
  // tableObject.currentRow = row
  // const { delList, getSelections } = methods
  // const selections = await getSelections()
  // delLoading.value = true
  // await delList(
  //   multiple ? selections.map((v) => v.id) : [tableObject.currentRow?.id as string],
  //   multiple
  // ).finally(() => {
  //   delLoading.value = false
  // })
}

//table操作栏按钮事件
const action = (row: any, type: string) => {
  nextTick(() => {
    // BackUpFormRef.value?.openDrawer(type, row.id)
  })
}
const searchRef = ref<ComponentRef<typeof Search>>()

const params = reactive<Recordable>({
  courseName: undefined
})
const chooseListAll = ref([])
//搜索
const setSearchParamsSub = (param: Recordable) => {
  chooseListAll.value = []
  params.courseName = param.courseName ? param.courseName : undefined
  // setSearchParams(params)
}

const tableData = [
  {
    logNumber: '001001',
    sysModules: '资产管理集成',
    operateType: '修改',
    operateContent: '修改了资产管理集成',
    requestMethod: 'put',
    operator: 'admin',
    host: '10.100.76.128',
    operateStatus: '成功',
    operateTime: '2024-01-31 01:07:52'
  },
  {
    logNumber: '001001',
    sysModules: '资产管理集成',
    operateType: '删除',
    operateContent: '删除了资产管理集成',
    requestMethod: 'del',
    operator: 'admin',
    host: '10.100.76.128',
    operateStatus: '成功',
    operateTime: '2024-01-31 01:07:52'
  },
  {
    logNumber: '001001',
    sysModules: '资产管理集成',
    operateType: '添加',
    operateContent: '添加了资产管理集成',
    requestMethod: 'post',
    operator: 'admin',
    host: '10.100.76.128',
    operateStatus: '失败',
    operateTime: '2024-01-31 01:07:52'
  }
]
</script>

<template>
  <ContentWrap class="mt-7px mb-10px">
    <Search
      ref="searchRef"
      :schema="allSchemas.searchSchema"
      :chooseListAll="chooseListAll"
      @search="setSearchParamsSub"
      @reset="setSearchParamsSub"
      v-if="isAuth('system:post:query')"
    />
  </ContentWrap>
  <ContentWrap>
    <Table
      :columns="allSchemas.tableColumns"
      :data="tableData"
      :border="true"
      :keyTable="'postId'"
      :chooseListAll="chooseListAll"
      :header-align="'center'"
      :align="'center'"
      :pagination="{
        total: 3
      }"
    >
      <template #pictureUrl="{ row }"> <img :src="row.pictureUrl" /> </template>
      <template #action="{ row }">
        <ElButton
          type="text"
          @click="action(row, 'see')"
          :text="true"
          v-hasPermi="'system:post:edit'"
        >
          查看
        </ElButton>
        <ElButton
          type="text"
          @click="delData(row, false)"
          :text="true"
          v-hasPermi="'system:post:remove'"
        >
          删除
        </ElButton>
      </template>
    </Table>
  </ContentWrap>
</template>
