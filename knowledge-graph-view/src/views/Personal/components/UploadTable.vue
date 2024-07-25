<template>
  <div class="upload_table">
    <Table
      v-model:currentPage="currentPage"
      v-model:pageSize="pageSize"
      :border="true"
      :columns="allSchemas.tableColumns"
      :cotentAlign="'center'"
      :data="tableList"
      :header-align="'center'"
      :index="true"
      :isShowFilter="false"
    >
      <template #operationBtn>
        <div>
          <Icon icon="svg-icon:share_t_icon" class="cursor-pointer" />
          <Icon icon="svg-icon:collection_t_icon" class="mx-[1.04vw] cursor-pointer" />
          <Icon icon="svg-icon:more_icon" class="cursor-pointer" />
        </div>
      </template>
    </Table>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, computed, onMounted, h, unref, nextTick } from 'vue'
import { Table } from '@/components/Table'
import { Icon } from '@/components/Icon'

// import { useTable } from '@/hooks/web/useTable'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
const currentPage = 1
const pageSize = 5
// const { register, tableObject, methods } = useTable<AnnouncementData>({
//   getListApi: getAnnouncementOrInstitution,
//   delListApi: delAnnouncementOrInstitution,
//   response: {
//     list: 'rows',
//     total: 'total'
//   },
//   defaultParams: {
//     pageType: 'a'
//   }
// })
const tableList = [
  {
    title: '这是一个标题',
    fileSize: '10KB',
    updateTime: '2024-05-23'
  }
]
// const { getList, setSearchParams } = methods
// 存放表格的数据
const crudSchemas = reactive<CrudSchema[]>([
  // {
  //   field: 'id',
  //   label: '序号',
  //   width: '60px'
  // },
  {
    field: 'title',
    label: '标题',
    minWidth: '350px',
    formatter: (row: Recordable) => {
      return h('span', row.title ? row.title : '--')
    }
  },
  {
    field: 'operationBtn',
    minWidth: '350px'
    // formatter: (row: Recordable) => {
    //   return h('span', row.title ? row.title : '--')
    // }
  },
  {
    field: 'fileSize',
    label: '文件大小',
    minWidth: '350px'
    // formatter: (row: Recordable) => {
    //   return h('span', row.title ? row.title : '--')
    // }
  },
  {
    field: 'updateTime',
    label: '更新日期',
    minWidth: '350px'
    // formatter: (row: Recordable) => {
    //   return h('span', row.title ? row.title : '--')
    // }
  }
])
const { allSchemas } = useCrudSchemas(crudSchemas)
</script>
<style scoped lang="less">
.upload_table {
  padding: 10px 20px !important;
}
</style>
