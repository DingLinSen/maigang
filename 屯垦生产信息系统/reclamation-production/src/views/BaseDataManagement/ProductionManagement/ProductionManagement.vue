<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { ElButton } from 'element-plus'
import { DrawerWrap } from '@/components/DrawerWrap'
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Table } from '@/components/Table'
import { UploadModal } from '@/components/Upload'
import ProductionManagementForm from './components/ProductionManagementForm.vue'
import CustomForm from './components/FormCreate.vue'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
// defineOptions({
//   name: 'ProductionManagement'
// })

const tableObject = ref<any>({
  loading: true,
  currentPage: 1,
  pageSize: 10,
  total: 5,
  tableList: []
})
let operationPlanFormRef = ref<ComponentRef<typeof ProductionManagementForm>>()

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
    label: '设施编码',
    minWidth: '180px',
    search: {
      show: true
    }
  },
  {
    field: 'landType',
    label: '设施类别',
    minWidth: '140px'
  },
  {
    field: 'name',
    label: '设施名称',
    minWidth: '180px'
  },
  {
    field: 'status',
    label: '设施状态',
    minWidth: '120px'
  },
  {
    field: 'source',
    label: '经费来源',
    minWidth: '180px'
  },
  {
    field: 'money',
    label: '经费金额（元）',
    minWidth: '180px'
  },
  {
    field: 'address',
    label: '设施位置',
    minWidth: '180px'
  },
  {
    field: 'development',
    label: '建设情况',
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
      landType: '种植设施',
      name: '气象站',
      address: '北京',
      status: '正常',
      source: '划拨',
      money: '500',
      development: '完成'
    },
    {
      id: 2,
      planNumber: '001002',
      landType: '养殖设施',
      name: '饲料机',
      address: '天津',
      status: '故障',
      source: '划拨',
      money: '1200',
      development: '完成'
    },
    {
      id: 3,
      planNumber: '002003',
      landType: '种植设施',
      name: '水肥一体机',
      address: '河北',
      status: '正常',
      source: '自筹',
      money: '1500',
      development: '完成'
    },
    {
      id: 4,
      planNumber: '002004',
      landType: '养殖设施',
      name: '水质监测仪',
      address: '山东',
      status: '正常',
      source: '划拨',
      money: '1400',
      development: '完成'
    },
    {
      id: 5,
      planNumber: '003001',
      landType: '种植设施',
      name: '墒情监测仪',
      address: '河南',
      status: '故障',
      source: '自筹',
      money: '500',
      development: '完成'
    },
    {
      id: 6,
      planNumber: '003002',
      landType: '养殖设施',
      name: '养殖笼',
      address: '湖北',
      status: '故障',
      source: '划拨',
      money: '700',
      development: '完成'
    },
    {
      id: 7,
      planNumber: '004002',
      landType: '种植设施',
      name: '病虫害监测仪',
      address: '湖南',
      status: '正常',
      source: '自筹',
      money: '700',
      development: '完成'
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
      <ProductionManagementForm title="土地资源管理" ref="operationPlanFormRef" />
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
