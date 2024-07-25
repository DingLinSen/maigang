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
import { RegionForm } from './components/index'

defineOptions({
  name: 'RegionManagement'
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

const RegionFormRef = ref<ComponentRef<typeof RegionForm>>()
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
    field: 'sysModules',
    minWidth: '120px',
    label: '区域编号',
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        style: 'width:200px;' //宽度
      }
    },
    formatter: (row: Recordable) => {
      return h('span', row.sysModules ? row.sysModules : '--')
    }
  },
  {
    field: 'templateType',
    minWidth: '180px',
    label: '区域名称',
    formatter: (row: Recordable) => {
      return h('span', row.templateType ? row.templateType : '--')
    }
  },
  {
    field: 'templateName',
    minWidth: '180px',
    label: '区域面积（亩）',
    formatter: (row: Recordable) => {
      return h('span', row.templateName ? row.templateName : '--')
    }
  },
  {
    field: 'preparedBy',
    minWidth: '180px',
    label: '负责部门',
    formatter: (row: Recordable) => {
      return h('span', row.preparedBy ? row.preparedBy : '--')
    }
  },
  {
    field: 'preparationPeople',
    minWidth: '120px',
    label: '部门负责人',
    formatter: (row: Recordable) => {
      return h('span', row.preparationPeople ? row.preparationPeople : '--')
    }
  },
  {
    field: 'preparationTime',
    minWidth: '180px',
    label: '负责人电话',
    formatter: (row: Recordable) => {
      return h('span', row.preparationTime ? row.preparationTime : '--')
    }
  },
  {
    field: 'approvalResults',
    minWidth: '120px',
    label: '区域简介',
    formatter: (row: Recordable) => {
      return h('span', row.approvalResults ? row.approvalResults : '--')
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
    RegionFormRef.value?.openDrawer('add', '')
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
    RegionFormRef.value?.openDrawer(type, row.id)
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
    templateType: '标准模板',
    sysModules: '001001',
    templateName: '2020年规(计)划',
    preparationPeople: '张三',
    preparationTime: '2022-08-08',
    approvalResults: '成功',
    remark: '这是备注',
    preparedBy: '单位一',
    operateTime: '2024-01-31 01:07:52'
  },
  {
    templateType: '标准模板',
    sysModules: '001001',
    templateName: '2022年规(计)划',
    preparationPeople: '李四',
    preparationTime: '2022-08-08',
    approvalResults: '失败',
    remark: '这是备注',
    preparedBy: '单位二',
    operateTime: '2024-01-31 01:07:52'
  },
  {
    templateType: '自定义模板',
    sysModules: '001001',
    templateName: '2024年规(计)划',
    preparationPeople: '王五',
    preparationTime: '2022-08-08',
    approvalResults: '成功',
    remark: '这是备注',
    preparedBy: '单位三',
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
      <template #operateBtnLeft>
        <ElButton type="primary" v-hasPermi="'system:user:add'" @click="addAction">
          <Icon icon="ep:plus" class="mr-5px" />
          新增
        </ElButton>
        <ElButton
          :loading="delLoading"
          v-hasPermi="['system:user:remove']"
          @click="delData(null, true)"
          class="btn-default"
        >
          <Icon icon="ep:delete" class="mr-5px" />
          删除
        </ElButton>
        <ElButton
          :loading="exLoading"
          type="primary"
          v-hasPermi="['system:user:export']"
          @click="exportForm()"
          plain
        >
          <Icon icon="ep:download" class="mr-5px" />
          导出
        </ElButton>
      </template>
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
          @click="action(row, 'edit')"
          :text="true"
          v-hasPermi="'system:post:edit'"
        >
          编辑
        </ElButton>
        <ElButton
          type="text"
          @click="delData(row, false)"
          :text="true"
          v-hasPermi="'system:post:edit'"
        >
          删除
        </ElButton>
      </template>
    </Table>
  </ContentWrap>
  <RegionForm title="区域管理" ref="RegionFormRef" @get-class-room-list="getList()" />
</template>
<style lang="less" scoped>
.btn {
  position: relative;
  .back-btn {
    position: absolute;
    top: 5px;
    right: 10px;
    z-index: 999;
  }
}
</style>
