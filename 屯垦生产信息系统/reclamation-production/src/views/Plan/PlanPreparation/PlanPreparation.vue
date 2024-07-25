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
import { PlanPreparationForm } from './components/index'
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

const PlanPreparationFormRef = ref<ComponentRef<typeof PlanPreparationForm>>()
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
    field: 'annual',
    minWidth: '180px',
    label: '规(计)划年度',
    formatter: (row: Recordable) => {
      return h('span', row.annual ? row.annual : '--')
    }
  },
  {
    field: 'preparedBy',
    minWidth: '180px',
    label: '发布单位',
    formatter: (row: Recordable) => {
      return h('span', row.preparedBy ? row.preparedBy : '--')
    }
  },
  {
    field: 'preparationPeople',
    minWidth: '120px',
    label: '发布人',
    formatter: (row: Recordable) => {
      return h('span', row.preparationPeople ? row.preparationPeople : '--')
    }
  },
  {
    field: 'preparationTime',
    minWidth: '180px',
    label: '发布时间',
    formatter: (row: Recordable) => {
      return h('span', row.preparationTime ? row.preparationTime : '--')
    }
  },
  {
    field: 'approvalResults',
    minWidth: '120px',
    label: '规(计)划状态',
    formatter: (row: Recordable) => {
      return h('span', row.approvalResults ? row.approvalResults : '--')
    }
  },
  {
    field: 'currentNode',
    minWidth: '180px',
    label: '当前节点',
    formatter: (row: Recordable) => {
      return h('span', row.currentNode ? row.currentNode : '--')
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
    PlanPreparationFormRef.value?.openDrawer(type, row.id)
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
    annual: '2024',
    sysModules: '001001',
    templateName: '2020年规(计)划',
    preparationPeople: '张三',
    preparationTime: '2022-08-08',
    approvalResults: '审核通过',
    currentNode: '单位一',
    preparedBy: '单位一'
  },
  {
    annual: '2023',
    sysModules: '001001',
    templateName: '2022年规(计)划',
    preparationPeople: '李四',
    preparationTime: '2022-08-08',
    approvalResults: '审核中',
    currentNode: '单位四',
    preparedBy: '单位二'
  },
  {
    annual: '2022',
    sysModules: '001001',
    templateName: '2024年规(计)划',
    preparationPeople: '王五',
    preparationTime: '2022-08-08',
    approvalResults: '未提交',
    currentNode: '单位五',
    preparedBy: '单位三'
  }
]
const isAdd = ref(false)
</script>

<template>
  <ContentWrap class="mt-7px mb-10px">
    <div class="Preparation_plan">
      <div class="plan_left">
        <p>10</p>
        <span>拟制规(计)划</span>
      </div>
      <div class="plan_right">
        <div class="plan_item">
          <p>1</p>
          <span>未提交</span>
        </div>
        <div class="plan_item">
          <p>1</p>
          <span>审核中</span>
        </div>
        <div class="plan_item">
          <p>3</p>
          <span>审核失败</span>
        </div>
        <div class="plan_item">
          <p>6</p>
          <span>审核通过</span>
        </div>
        <div class="plan_item">
          <p>10</p>
          <span>已分发</span>
        </div>
      </div>
    </div>
  </ContentWrap>
  <template v-if="!isAdd">
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
          <ElButton type="primary" v-hasPermi="'system:user:add'" @click="isAdd = true">
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
    <PlanPreparationForm
      title="规(计)划拟制"
      ref="PlanPreparationFormRef"
      @get-class-room-list="getList()"
    />
  </template>
  <template v-else>
    <div class="custom">
      <div class="btn">
        <ElButton type="primary" class="back-btn" @click="isAdd = false"> 返回 </ElButton>
      </div>
      <CustomForm />
    </div>
  </template>
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
.Preparation_plan {
  display: flex;
  .plan_left {
    padding: 20px;
    width: 20%;
    text-align: center;
    background-color: #ecf6ee;
    color: #3c9a4c;
  }
  .plan_right {
    margin-left: 10px;
    flex: 1;
    display: flex;
    padding: 20px;
    text-align: center;
    background-color: #f8f9fd;
    justify-content: space-around;
    .plan_item {
      position: relative;
      flex: 1;
      &:last-child {
        &::after {
          display: none;
        }
      }
      &::after {
        display: inline-block;
        content: '';
        height: 60px;
        width: 2px;
        background: #eee;
        right: -10px;
        top: 50%;
        transform: translateY(-50%);
        position: absolute;
        // border-right: 1px solid #eee;
      }
    }
  }
}
</style>
