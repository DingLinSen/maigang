<script setup lang="ts">
import { reactive, ref, onMounted, unref } from 'vue'
import { ElButton, ElMessage } from 'element-plus'
import { DrawerWrap } from '@/components/DrawerWrap'
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Table } from '@/components/Table'
import { UploadModal } from '@/components/Upload'
import SupervisionDisposeForm from './components/SupervisionDisposeForm.vue'
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
let operationPlanFormRef = ref<ComponentRef<typeof SupervisionDisposeForm>>()

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
    label: '预警编号',
    minWidth: '180px',
    search: {
      show: true
    }
  },
  {
    field: 'name',
    label: '预警事件',
    minWidth: '180px'
  },
  {
    field: 'type',
    label: '预警类型',
    minWidth: '120px'
  },
  {
    field: 'describe',
    label: '预警描述',
    minWidth: '180px'
  },
  {
    field: 'warningTime',
    label: '预警时间',
    minWidth: '140px'
  },
  {
    field: 'personResponsible',
    label: '责任人',
    minWidth: '180px'
  },
  {
    field: 'disposalResults',
    label: '处置结果',
    minWidth: '180px'
  },
  {
    field: 'disposalTime',
    label: '处置时间',
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
      name: '设备预警',
      type: '一级',
      describe: 'xx设备状态异常',
      warningTime: '2024-01-30',
      personResponsible: '寿星汉',
      remark: '',
      disposalResults: '维保修理',
      disposalTime: '2024-01-31'
    },
    {
      id: 2,
      number: '001002',
      name: '设备预警',
      type: '二级',
      describe: 'xx设备状态异常',
      warningTime: '2024-01-30',
      personResponsible: '潘德海',
      remark: '',
      disposalResults: '维保修理',
      disposalTime: '2024-01-31'
    },
    {
      id: 3,
      number: '002001',
      name: '设备预警',
      type: '三级',
      describe: 'xx设备状态异常',
      warningTime: '2024-01-30',
      personResponsible: '隗鹏翼',
      remark: '',
      disposalResults: '维保修理',
      disposalTime: '2024-01-31'
    },
    {
      id: 4,
      number: '002002',
      name: '设备预警',
      type: '四级',
      describe: 'xx设备状态异常',
      warningTime: '2024-01-30',
      personResponsible: '蔡俊雅',
      remark: '',
      disposalResults: '维保修理',
      disposalTime: '2024-01-31'
    },
    {
      id: 5,
      number: '003001',
      name: '设备预警',
      type: '五级',
      describe: 'xx设备状态异常',
      warningTime: '2024-01-30',
      personResponsible: '牛兴生',
      remark: '',
      disposalResults: '维保修理',
      disposalTime: '2024-01-31'
    },
    {
      id: 6,
      number: '003002',
      name: '任务预警',
      type: '一级',
      describe: 'xx设备状态异常',
      warningTime: '2024-01-30',
      personResponsible: '菱嘉赐',
      remark: '',
      disposalResults: '督促实施',
      disposalTime: '2024-01-31'
    },
    {
      id: 7,
      number: '001001',
      name: '任务预警',
      type: '二级',
      describe: 'xx设备状态异常',
      warningTime: '2024-01-30',
      personResponsible: '甄俊爽',
      remark: '',
      disposalResults: '督促实施',
      disposalTime: '2024-01-31'
    },
    {
      id: 8,
      number: '001001',
      name: '任务预警',
      type: '三级',
      describe: 'xx设备状态异常',
      warningTime: '2024-01-30',
      personResponsible: '阎德明',
      remark: '',
      disposalResults: '督促实施',
      disposalTime: '2024-01-31'
    },
    {
      id: 9,
      number: '001001',
      name: '任务预警',
      type: '四级',
      describe: 'xx设备状态异常',
      warningTime: '2024-01-30',
      personResponsible: '蒙雅惠',
      remark: '',
      disposalResults: '督促实施',
      disposalTime: '2024-01-31'
    },
    {
      id: 10,
      number: '001001',
      name: '任务预警',
      type: '五级',
      describe: 'xx设备状态异常',
      warningTime: '2024-01-30',
      personResponsible: '须昊乾',
      remark: '',
      disposalResults: '督促实施',
      disposalTime: '2024-01-31'
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
    <Search ref="searchRef" :schema="allSchemas.searchSchema" :pageName="'监管处置'">
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
    <SupervisionDisposeForm title="监管处置" ref="operationPlanFormRef" />
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
