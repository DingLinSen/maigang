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
import { PlanFileForm } from './components/index'
import { SetpForm } from './components/index'
import CustomForm from './components/FormCreate.vue'

defineOptions({
  name: 'PlanTemplate'
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

const PlanFileFormRef = ref<ComponentRef<typeof PlanFileForm>>()
const SetpFormRef = ref<ComponentRef<typeof SetpForm>>()
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
    label: '规(计)划编号',
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
    field: 'templateName',
    minWidth: '180px',
    label: '规(计)划名称',
    formatter: (row: Recordable) => {
      return h('span', row.templateName ? row.templateName : '--')
    }
  },
  {
    field: 'templateType',
    minWidth: '180px',
    label: '规(计)划类型',
    formatter: (row: Recordable) => {
      return h('span', row.templateType ? row.templateType : '--')
    }
  },
  // {
  //   field: 'preparedBy',
  //   minWidth: '180px',
  //   label: '编制单位',
  //   formatter: (row: Recordable) => {
  //     return h('span', row.preparedBy ? row.preparedBy : '--')
  //   }
  // },
  // {
  //   field: 'preparationPeople',
  //   minWidth: '120px',
  //   label: '编制人',
  //   formatter: (row: Recordable) => {
  //     return h('span', row.preparationPeople ? row.preparationPeople : '--')
  //   }
  // },
  {
    field: 'createTime',
    minWidth: '180px',
    label: '创建时间',
    formatter: (row: Recordable) => {
      return h('span', row.createTime ? row.createTime : '--')
    }
  },
  {
    field: 'fileTime',
    minWidth: '120px',
    label: '归档时间',
    formatter: (row: Recordable) => {
      return h('span', row.fileTime ? row.fileTime : '--')
    }
  },
  {
    field: 'introduction',
    minWidth: '120px',
    label: '规(计)划简介',
    formatter: (row: Recordable) => {
      return h('span', row.introduction ? row.introduction : '--')
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
    PlanFileFormRef.value?.openDrawer('add', '')
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
    PlanFileFormRef.value?.openDrawer(type, row.id)
  })
}
const handleSetp = (val: any, type: string) => {
  nextTick(() => {
    SetpFormRef.value?.openDrawer(type, val)
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
    createTime: '2022-08-08',
    approvalResults: '成功',
    remark: '这是备注',
    preparedBy: '单位一',
    fileTime: '2024-01-31',
    introduction: '计划简介'
  },
  {
    templateType: '标准模板',
    sysModules: '001001',
    templateName: '2022年规(计)划',
    preparationPeople: '李四',
    createTime: '2022-08-08',
    approvalResults: '失败',
    remark: '这是备注',
    preparedBy: '单位二',
    fileTime: '2024-01-31',
    introduction: '计划简介'
  },
  {
    templateType: '自定义模板',
    sysModules: '001001',
    templateName: '2024年规(计)划',
    preparationPeople: '王五',
    createTime: '2022-08-08',
    approvalResults: '成功',
    remark: '这是备注',
    preparedBy: '单位三',
    fileTime: '2024-01-31',
    introduction: '计划简介'
  }
]
const isAdd = ref(false)
</script>

<template>
  <ContentWrap class="mt-7px mb-10px">
    <div class="setp_bar h-40px w-full">
      <ul>
        <li @click="handleSetp('1', 'edit')" class="active">规(计)划拟制</li>
        <li @click="handleSetp('2', 'edit')">规(计)划分发</li>
        <li @click="handleSetp('3', 'edit')">规(计)划审核</li>
        <li @click="handleSetp('4', 'edit')">规(计)划下发</li>
        <li @click="handleSetp('5', 'edit')">规(计)划执行</li>
        <li @click="handleSetp('6', 'edit')">规(计)划归档</li>
      </ul>
    </div>
  </ContentWrap>
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
  <PlanFileForm title="规(计)划归档" ref="PlanFileFormRef" @get-class-room-list="getList()" />
  <SetpForm title="" ref="SetpFormRef" @get-class-room-list="getList()" />
</template>

<style scoped lang="less">
.setp_bar ul {
  display: flex;
  .active {
    background: #45a855;
    color: #fff;
    &::after {
      background: #45a855;
    }
  }
  li {
    text-align: center;
    line-height: 40px;
    cursor: pointer;
    margin-right: 6px;
    position: relative;
    flex: 1;
    height: 40px;
    background: #dcdcdc;
    &:first-child {
      &::before {
        display: none;
      }
    }
    &:last-child {
      &::after {
        display: none;
      }
    }
    &::after {
      position: absolute;
      content: '';
      display: block;
      transform: rotate(45deg);
      width: 28.3px;
      height: 28.3px;
      background: #dcdcdc;
      right: -14px;
      top: 6px;
      z-index: 2;
    }
    &::before {
      position: absolute;
      content: '';
      display: block;
      transform: rotate(45deg);
      width: 28.3px;
      height: 28.3px;
      background: #fff;
      left: -14px;
      top: 6px;
      z-index: 1;
    }
  }
}
</style>
