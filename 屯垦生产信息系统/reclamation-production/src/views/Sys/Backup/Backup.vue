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
import { BackupForm } from './components/index'

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

const BackUpFormRef = ref<ComponentRef<typeof BackupForm>>()
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
  {
    field: 'userId',
    label: '序号',
    type: 'index',
    fixed: 'left'
  },
  {
    field: 'batch',
    minWidth: '180px',
    label: '备份批次',
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        style: 'width:200px;' //宽度
      }
    },
    formatter: (row: Recordable) => {
      return h('span', row.batch ? row.batch : '--')
    }
  },
  {
    field: 'taskName',
    minWidth: '180px',
    label: '备份任务名称',
    formatter: (row: Recordable) => {
      return h('span', row.taskName ? row.taskName : '--')
    }
  },
  {
    field: 'operator',
    minWidth: '180px',
    label: '操作人',
    formatter: (row: Recordable) => {
      return h('span', row.operator ? row.operator : '--')
    }
  },
  {
    field: 'operateTime',
    minWidth: '180px',
    label: '操作时间',
    formatter: (row: Recordable) => {
      return h('span', row.operateTime ? row.operateTime : '--')
    }
  },
  {
    field: 'route',
    minWidth: '180px',
    label: '备份路径',
    formatter: (row: Recordable) => {
      return h('span', row.route ? row.route : '--')
    }
  },
  {
    field: 'remark',
    minWidth: '180px',
    label: '备注',
    formatter: (row: Recordable) => {
      return h('span', row.remark ? row.remark : '--')
    }
  },
  {
    field: 'action',
    width: '180px',
    label: '操作',
    fixed: 'right'
  }
])
const { allSchemas } = useCrudSchemas(crudSchemas)

//添加
const addAction = () => {
  nextTick(() => {
    BackUpFormRef.value?.openDrawer('add', '')
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
    BackUpFormRef.value?.openDrawer(type, row.id)
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
    batch: '001001',
    taskName: '20240130002系统备份',
    operator: 'admin',
    operateTime: '2024-01-31',
    route: '/c:/sys/folder',
    remark: '这是备注'
  },
  {
    batch: '001001',
    taskName: '20240130002系统备份',
    operator: 'admin',
    operateTime: '2024-01-31',
    route: '/c:/sys/folder',
    remark: '这是备注'
  },
  {
    batch: '001001',
    taskName: '20240130002系统备份',
    operator: 'admin',
    operateTime: '2024-01-31',
    route: '/c:/sys/folder',
    remark: '这是备注'
  },
  {
    batch: '001001',
    taskName: '20240130002系统备份',
    operator: 'admin',
    operateTime: '2024-01-31',
    route: '/c:/sys/folder',
    remark: '这是备注'
  },
  {
    batch: '001001',
    taskName: '20240130002系统备份',
    operator: 'admin',
    operateTime: '2024-01-31',
    route: '/c:/sys/folder',
    remark: '这是备注'
  },
  {
    batch: '001001',
    taskName: '20240130002系统备份',
    operator: 'admin',
    operateTime: '2024-01-31',
    route: '/c:/sys/folder',
    remark: '这是备注'
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
        total: 6
      }"
    >
      <template #operateBtnLeft>
        <ElButton type="primary" @click="addAction" v-hasPermi="'system:post:add'">
          <Icon icon="ep:plus" class="mr-5px" />新增</ElButton
        >
        <ElButton
          :loading="delLoading"
          v-hasPermi="['system:user:remove']"
          @click="delData(null, true)"
          class="btn-default"
        >
          <Icon icon="ep:delete" class="mr-5px" />
          删除
        </ElButton>
      </template>
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
  <backupForm title="备份" ref="BackUpFormRef" @get-class-room-list="getList()" />
</template>
