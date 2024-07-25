<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { ElButton } from 'element-plus'
import { DrawerWrap } from '@/components/DrawerWrap'
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Table } from '@/components/Table'
import { UploadModal } from '@/components/Upload'
import AgriculturalEquipForm from './components/AgriculturalEquipForm.vue'
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
let operationPlanFormRef = ref<ComponentRef<typeof AgriculturalEquipForm>>()

const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'id',
    label: '序号',
    width: '55px',
    fixed: 'left',
    type: 'index'
  },
  {
    field: 'planNumber',
    label: '农机装备编码',
    minWidth: '180px',
    search: {
      show: true
    }
  },
  {
    field: 'name',
    label: '名称',
    minWidth: '180px'
  },
  {
    field: 'status',
    label: '状态',
    minWidth: '120px'
  },
  {
    field: 'unit',
    label: '使用单位',
    minWidth: '180px'
  },
  {
    field: 'head',
    label: '责任人',
    minWidth: '140px'
  },
  {
    field: 'money',
    label: '采购金额（元）',
    minWidth: '180px'
  },
  {
    field: 'updateTime',
    label: '更新时间',
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
      planNumber: '001001',
      name: '拖拉机',
      status: '正常',
      money: '100000',
      unit: '单位一',
      head: '赵大',
      updateTime: '2022-08-08'
    },
    {
      id: 2,
      planNumber: '001002',
      name: '打药机',
      status: '正常',
      money: '5000',
      unit: '单位二',
      head: '钱二',
      updateTime: '2023-05-22'
    },
    {
      id: 3,
      planNumber: '002003',
      name: '电动机',
      status: '正常',
      money: '8000',
      unit: '单位三',
      head: '孙三',
      updateTime: '2022-03-02'
    },
    {
      id: 4,
      planNumber: '002004',
      name: '旋耕机',
      status: '正常',
      money: '12000',
      unit: '单位四',
      head: '李四',
      updateTime: '2022-06-07'
    },
    {
      id: 5,
      planNumber: '003001',
      name: '除草机器人',
      status: '故障',
      money: '6000',
      unit: '单位五',
      head: '周五',
      updateTime: '2022-11-11'
    },
    {
      id: 6,
      planNumber: '003002',
      name: '水泵',
      status: '正常',
      money: '4000',
      unit: '单位六',
      head: '吴六',
      updateTime: '2023-08-08'
    },
    {
      id: 7,
      planNumber: '004002',
      name: '挖掘机',
      status: '故障',
      money: '200000',
      unit: '单位七',
      head: '郑七',
      updateTime: '2022-05-22'
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
const exportForm = async () => {}

const importDrawer = ref(false)
// const importForm = () => {
//   importDrawer.value = true
// }
const uploadSuccess = () => {
  importDrawer.value = false
}
const isAdd = ref(false)
</script>

<template>
  <template v-if="!isAdd">
    <ContentWrap class="mt-7px mb-10px">
      <Search ref="searchRef" :schema="allSchemas.searchSchema" :pageName="'土地资源管理'">
        <template #table-btns>
          <ElButton type="primary" @click="isAdd = true" plain>
            <Icon icon="ep:plus" class="mr-5px" />新增
          </ElButton>
          <ElButton type="danger" @click="delData(null, true)" plain>
            <Icon icon="ep:delete" class="mr-5px" />删除
          </ElButton>
          <ElButton :loading="exLoading" type="primary" @click="exportForm()" plain>
            <Icon icon="ep:download" class="mr-5px" />导出
          </ElButton>
          <!-- <ElButton :loading="exLoading" type="primary" @click="importForm()" plain>
          <Icon icon="ep:upload" class="mr-5px" />导入
        </ElButton> -->
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
      <AgriculturalEquipForm title="土地资源管理" ref="operationPlanFormRef" />

      <el-drawer v-model="importDrawer" size="20%" title="I am the title" :with-header="false">
        <UploadModal
          @upload-success="uploadSuccess"
          :uploadName="'土地资源管理'"
          :downloadUrl="'/safetyProduction/planManage/repairSkylight/importTemplate'"
          :uploadUrl="'/safetyProduction/planManage/repairSkylight/importData'"
        />
      </el-drawer>
      <DrawerWrap />
    </ContentWrap>
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
</style>
