<script setup lang="ts">
import { h, reactive, ref, nextTick } from 'vue'
import { ElButton, ElSwitch, ElMessage, ElMessageBox } from 'element-plus'

import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Table } from '@/components/Table'
import { useTable } from '@/hooks/web/useTable'
import { useEmitt } from '@/hooks/web/useEmitt'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { isAuth } from '@/utils/is'
import { getFarmCourseListApi, delFarmCourseApi } from '@/api/agriculturalClassroom'
import { AgriculturalClassroomForm } from './components/index'

defineOptions({
  name: 'AgriculturalClassroom'
})

const { register, tableObject, methods } = useTable<any>({
  getListApi: getFarmCourseListApi,
  delListApi: delFarmCourseApi,
  response: {
    list: 'rows',
    total: 'total',
    key: 'id'
  }
})

const { getList, setSearchParams } = methods

getList()

const postFormRef = ref<ComponentRef<typeof AgriculturalClassroomForm>>()
useEmitt({
  name: 'getClassRoomList',
  callback: (type: string) => {
    if (type === 'add') {
      tableObject.currentPage = 1
    }
    getList()
  }
})

const crudSchemas = reactive<CrudSchema[]>([
  // {
  //   field: 'postName',
  //   minWidth: '180px',
  //   label: '课程ID',
  //   search: {
  //     show: true,
  //     component: 'Input',
  //     componentProps: {
  //       style: 'width:200px;' //宽度
  //     }
  //   },
  //   formatter: (row: Recordable) => {
  //     return h('span', row.postName ? row.postName : '--')
  //   }
  // },
  {
    field: 'courseName',
    minWidth: '180px',
    label: '课程名称',
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        style: 'width:200px;' //宽度
      }
    },
    formatter: (row: Recordable) => {
      return h('span', row.courseName ? row.courseName : '--')
    }
  },
  {
    field: 'teacherName',
    minWidth: '180px',
    label: '讲师名称',
    formatter: (row: Recordable) => {
      return h('span', row.teacherName ? row.teacherName : '--')
    }
  },
  {
    field: 'remark',
    minWidth: '180px',
    label: '课程介绍',
    formatter: (row: Recordable) => {
      return h('span', row.remark ? row.remark : '--')
    }
  },
  {
    field: 'pictureUrl',
    minWidth: '180px',
    label: '课程缩略图'
  },
  {
    field: 'courseType',
    minWidth: '180px',
    label: '课程分类',
    formatter: (row: Recordable) => {
      return h('span', row.courseType ? row.courseType : '--')
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
    postFormRef.value?.openDrawer('add', '')
  })
}

//删除加载
const delLoading = ref(false)

//删除
const delData = async (row: any | null, multiple: boolean) => {
  tableObject.currentRow = row
  const { delList, getSelections } = methods
  const selections = await getSelections()
  delLoading.value = true
  await delList(
    multiple ? selections.map((v) => v.id) : [tableObject.currentRow?.id as string],
    multiple
  ).finally(() => {
    delLoading.value = false
  })
}

//table操作栏按钮事件
const action = (row: any, type: string) => {
  nextTick(() => {
    postFormRef.value?.openDrawer(type, row.id)
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
  setSearchParams(params)
}
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
      v-model:pageSize="tableObject.pageSize"
      v-model:currentPage="tableObject.currentPage"
      :columns="allSchemas.tableColumns"
      :data="tableObject.tableList"
      :loading="tableObject.loading"
      :border="true"
      :keyTable="'postId'"
      :chooseListAll="chooseListAll"
      :header-align="'center'"
      :align="'center'"
      :pagination="{
        total: tableObject.total
      }"
      @register="register"
    >
      <template #operateBtnLeft>
        <ElButton type="primary" @click="addAction" v-hasPermi="'system:post:add'">
          <Icon icon="ep:plus" class="mr-5px" />新增</ElButton
        >
      </template>
      <template #pictureUrl="{ row }"> <img :src="row.pictureUrl" /> </template>
      <template #action="{ row }">
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
          v-hasPermi="'system:post:remove'"
        >
          删除
        </ElButton>
        <ElButton
          type="text"
          @click="action(row, 'see')"
          :text="true"
          v-hasPermi="'system:post:edit'"
        >
          查看
        </ElButton>
      </template>
    </Table>
  </ContentWrap>
  <AgriculturalClassroomForm title="农课堂" ref="postFormRef" @get-class-room-list="getList()" />
</template>
