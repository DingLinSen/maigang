<script setup lang="ts">
import { reactive, ref, onMounted, unref } from 'vue'
import { ElButton, ElMessage } from 'element-plus'
import { DrawerWrap } from '@/components/DrawerWrap'
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Table } from '@/components/Table'
import { UploadModal } from '@/components/Upload'
import SupervisionManageForm from './components/SupervisionManageForm.vue'
import CustomForm from './components/FormCreate.vue'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
// defineOptions({
//   name: 'AgriculturalEquip'
// })

const tableObject = ref<any>({
  loading: true,
  currentPage: 1,
  pageSize: 10,
  total: 5,
  tableList: []
})
let operationPlanFormRef = ref<ComponentRef<typeof SupervisionManageForm>>()

const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'id',
    label: '序号',
    width: '55px',
    fixed: 'left',
    type: 'index'
  },
  {
    field: 'number',
    label: '监管专题编号',
    minWidth: '180px',
    search: {
      show: true
    }
  },
  {
    field: 'name',
    label: '监管专题名称',
    minWidth: '180px',
    search: {
      show: true
    }
  },
  {
    field: 'target',
    label: '监管指标',
    minWidth: '180px'
  },
  {
    field: 'createTime',
    label: '创建时间',
    minWidth: '180px'
  },
  {
    field: 'createName',
    label: '创建人',
    minWidth: '180px'
  },
  {
    field: 'remark',
    label: '备注',
    minWidth: '180px'
  },
  {
    field: 'action',
    label: '操作区域',
    width: '180',
    fixed: 'right',
    table: {
      show: true
    }
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)
const addAction = () => {
  if (operationPlanFormRef.value) {
    operationPlanFormRef.value.openDrawer('add', '')
  }
}
//table操作栏按钮事件
const action = (row: any, type: string) => {
  tableObject.value.currentRow = row
  if (operationPlanFormRef.value) {
    operationPlanFormRef.value.openDrawer(type, row.id)
  }
}
onMounted(() => {
  tableObject.value.tableList = [
    {
      id: 1,
      number: '001001',
      name: '种植设施监管专题',
      target: '类型、价格、状态、维护',
      createTime: '2024-01-31',
      createName: 'admin',
      remark: ''
    },
    {
      id: 2,
      number: '001002',
      name: '养殖设施监管专题',
      target: '类型、价格、状态、维护',
      createTime: '2024-01-31',
      createName: 'admin',
      remark: ''
    },
    {
      id: 3,
      number: '002001',
      name: '生产工具监管专题',
      target: '类型、价格、状态、维护',
      createTime: '2024-01-31',
      createName: 'admin',
      remark: ''
    },
    {
      id: 4,
      number: '002002',
      name: '加工设备监管专题',
      target: '类型、价格、状态、维护',
      createTime: '2024-01-31',
      createName: 'admin',
      remark: ''
    },
    {
      id: 5,
      number: '003001',
      name: '农机装备监管专题',
      target: '类型、价格、状态、维护',
      createTime: '2024-01-31',
      createName: 'admin',
      remark: ''
    },
    {
      id: 6,
      number: '003002',
      name: '保障用房监管专题',
      target: '类型、价格、状态、维护',
      createTime: '2024-01-31',
      createName: 'admin',
      remark: ''
    },
    {
      id: 7,
      number: '004001',
      name: '辅助配套设施监管专题',
      target: '类型、价格、状态、维护',
      createTime: '2024-01-31',
      createName: 'admin',
      remark: ''
    },
    {
      id: 8,
      number: '004002',
      name: '生产计划监管专题',
      target: '事项、时间、完成情况',
      createTime: '2024-01-31',
      createName: 'admin',
      remark: ''
    },
    {
      id: 9,
      number: '005001',
      name: '生产过程监管专题',
      target: '事项、时间、完成情况',
      createTime: '2024-01-31',
      createName: 'admin',
      remark: ''
    },
    {
      id: 10,
      number: '005002',
      name: '人员实力监管专题',
      target: '专业、学历、性别、岗位',
      createTime: '2024-01-31',
      createName: 'admin',
      remark: ''
    }
  ]
  tableObject.value.loading = false
  tableObject.value.currentPage = 1
  tableObject.value.pageSize = 10
  tableObject.value.total = 7
})

const chooseListAll = ref<any>([])
// 搜索参数初始化
// const searchParamInit = (param) => {
//   console.log('param', param)
//   let idList = []
//   if (chooseListAll.value.length > 0) {
//     idList = chooseListAll.value.map((s) => s.id)
//   }
//   const searchParam = {
//     ids: idList.length ? idList.join(',') : null
//   }
//   return {
//     ...searchParam
//   }
// }
//搜索
// const setSearchParamsSub = (param: Recordable) => {
//   chooseListAll.value = []
//   console.log('param', param)
//   searchParamInit(param)
//   // setSearchParams(searchParamInit(param))
// }
//添加
//删除加载
const delLoading = ref(false)
// 删除
const delData = async (row: any | null, multiple: boolean) => {
  console.log('multiple', multiple)
  tableObject.value.currentRow = row
  // const { delList } = methods
  // // const selections = await getSelections()
  delLoading.value = true
  // await delList(
  //   multiple ? chooseListAll.value.map((v) => v.id) : [tableObject.currentRow?.id as string],
  //   multiple
  // ).finally(() => {
  //   delLoading.value = false
  // })
}
//导出加载
const exLoading = ref(false)
const searchRef = ref<ComponentRef<typeof Search>>()
// //导出
const exportForm = async () => {
  if (tableObject.value.total.length === 0) {
    ElMessage.warning('查询无数据, 无需导出数据')
    return
  }
  const param: any = await unref(searchRef)?.getFormData()
}
</script>

<template>
  <ContentWrap class="mt-7px mb-10px">
    <Search ref="searchRef" :schema="allSchemas.searchSchema" :pageName="'监管专题管理'">
      <template #table-btns>
        <ElButton type="primary" @click="addAction" plain>
          <Icon icon="ep:plus" class="mr-5px" />新增
        </ElButton>
        <ElButton type="danger" @click="delData(null, true)" plain>
          <Icon icon="ep:delete" class="mr-5px" />删除
        </ElButton>
        <ElButton :loading="exLoading" type="primary" @click="exportForm()" plain>
          <Icon icon="ep:download" class="mr-5px" />导出
        </ElButton>
      </template>
    </Search>
  </ContentWrap>
  <ContentWrap>
    <Table
      v-model:pageSize="tableObject.pageSize"
      v-model:currentPage="tableObject.currentPage"
      :columns="allSchemas.tableColumns"
      :data="tableObject.tableList"
      :loading="tableObject.loading"
      :border="true"
      :header-align="'center'"
      :align="'center'"
      :chooseListAll="chooseListAll"
      :pagination="{
        total: tableObject.total
      }"
      :isShowFilter="false"
      :buttonShow="false"
    >
      <template #action="{ row }">
        <ElButton type="primary" @click="action(row, 'edit')" :text="true"> 编辑 </ElButton>
        <ElButton type="primary" @click="action(row, 'see')" :text="true"> 查看 </ElButton>
        <ElButton type="danger" @click="delData(row, false)" text> 删除 </ElButton>
      </template>
    </Table>
    <SupervisionManageForm title="监管专题管理" ref="operationPlanFormRef" />
    <DrawerWrap />
  </ContentWrap>
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
