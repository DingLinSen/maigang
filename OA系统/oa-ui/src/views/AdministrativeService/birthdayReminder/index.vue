<template>
  <ContentWrap Showtitle="生日提醒">
    <!-- 表格 -->
    <Table
      v-model:pageSize="tableObject.pageSize"
      v-model:currentPage="tableObject.currentPage"
      :isShowFilter="false"
      :border="true"
      ref="ElTableRef"
      :header-align="'center'"
      :cotentAlign="'center'"
      :data="tableObject.tableList"
      :loading="tableObject.loading"
      :columns="allSchemas.tableColumns"
      :pagination="{
          total: tableObject.total
        }"
      @register="register"
    >
      <template #id="{ $index }">
        <span>
          {{ $index + 1 + tableObject.pageSize * (tableObject.currentPage - 1) }}
        </span>
      </template>
    </Table>
  </ContentWrap>
  <LimitDailog routerName="birthdayReminder" />
</template>

<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { Table } from '@/components/Table'
import { getBirthList } from '@/api/AdministrativeService/birthdayReminder'
import { reactive } from 'vue'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useTable } from '@/hooks/web/useTable'
import { AnnouncementData } from '@/api/AdministrativeService/announcement/types'
import { LimitDailog } from '@/views/Components/limit'

defineOptions({
  name: 'BirthdayReminder'
})

// 存放表格的数据
const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'id',
    label: '序号',
    minWidth: '80px'
  },
  {
    field: 'name',
    label: '姓名',
    minWidth: '100px'
  },
  {
    field: 'deptName',
    label: '部门',
    minWidth: '140px'
  },
  {
    field: 'birth',
    label: '生日',
    minWidth: '140px'
  }
])
const { allSchemas } = useCrudSchemas(crudSchemas)
const { register, tableObject, methods } = useTable<AnnouncementData>({
  getListApi: getBirthList,
  response: {
    list: 'rows',
    total: 'total'
  }
})
const { getList, setSearchParams } = methods
getList()
</script>

<style scoped>

</style>
