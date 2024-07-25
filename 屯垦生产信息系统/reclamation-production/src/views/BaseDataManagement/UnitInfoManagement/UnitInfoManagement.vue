<script setup lang="ts">
import { h, reactive, ref, onMounted } from 'vue'
import { ElButton, ElMessage, ElMessageBox } from 'element-plus'

import type { UploadProps, UploadUserFile } from 'element-plus'
import { Dialog } from '@/components/Dialog'
// import { DrawerWrap } from '@/components/DrawerWrap'
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Table } from '@/components/Table'
// import { UploadModal } from '@/components/Upload'
import UnitInfoManagementForm from './components/UnitInfoManagementForm.vue'
import CustomForm from './components/FormCreate.vue'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
// import { TableColumn } from '@/types/table'
// defineOptions({
//   name: 'UnitInfoManagement'
// })

const tableObject = ref<any>({
  loading: true,
  currentPage: 1,
  pageSize: 10,
  total: 0,
  tableList: []
})
let operationPlanFormRef = ref<ComponentRef<typeof UnitInfoManagementForm>>()

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
    label: '编号',
    minWidth: '180px',
    search: {
      show: true
    }
  },
  {
    field: 'unitName',
    label: '单位名称',
    minWidth: '180px'
  },
  {
    field: 'unitType',
    label: '单位类型',
    minWidth: '180px'
  },
  {
    field: 'info',
    label: '隶属信息',
    minWidth: '180px'
  },
  {
    field: 'createTime',
    label: '创建时间',
    minWidth: '180px'
  },
  {
    field: 'remark',
    label: '备注',
    minWidth: '180px',
    formatter: (row: Recordable) => {
      return h('span', row.remark ? row.remark : '--')
    }
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
const columnList = [
  {
    field: 'planNumber',
    label: '导入数据',
    minWidth: '180px',
    children: [
      {
        field: 'id',
        label: '序号',
        width: '55px',
        fixed: 'left',
        type: 'index'
      },
      {
        field: 'planNumber',
        label: '单位代码',
        minWidth: '110px',
        search: {
          show: true
        }
      },
      {
        field: 'unitName',
        label: '单位名称',
        minWidth: '100px'
      },
      {
        field: 'info',
        label: '隶属关系',
        minWidth: '100px'
      },
      {
        field: 'head',
        label: '负责人',
        minWidth: '100px'
      },
      {
        field: 'phone',
        label: '联系电话',
        minWidth: '140px'
      }
    ]
  },
  {
    field: 'unitName',
    label: '异常识别',
    minWidth: '100px',
    children: [
      {
        field: 'iscy',
        label: '是否存在差异',
        minWidth: '100px'
      }
    ]
  },
  {
    field: 'planNumber',
    label: '系统数据',
    minWidth: '180px',
    children: [
      {
        field: 'id',
        label: '序号',
        width: '55px',
        fixed: 'left',
        type: 'index'
      },
      {
        field: 'planNumber',
        label: '单位代码',
        minWidth: '110px',
        search: {
          show: true
        }
      },
      {
        field: 'unitName',
        label: '单位名称',
        minWidth: '100px'
      },
      {
        field: 'info',
        label: '隶属关系',
        minWidth: '100px'
      },
      {
        field: 'head',
        label: '负责人',
        minWidth: '100px'
      }
    ]
  },
  {
    field: 'action',
    label: '操作区域',
    width: '120',
    fixed: 'right',
    table: {
      show: true
    }
  }
]
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
      unitName: '单位一',
      head: '赵',
      iscy: '是',
      phone: '13123456789',
      unitType: '一类',
      info: '一级单位',
      createTime: '2022-08-08'
    },
    {
      id: 2,
      planNumber: '001002',
      unitName: '单位二',
      head: '钱',
      iscy: '否',
      phone: '13123456789',
      unitType: '二类',
      info: '一级单位',
      createTime: '2022-08-08'
    },
    {
      id: 3,
      planNumber: '002003',
      unitName: '单位三',
      head: '孙',
      iscy: '否',
      phone: '13123456789',
      unitType: '三类',
      info: '一级单位',
      createTime: '2022-08-08'
    },
    {
      id: 4,
      planNumber: '002004',
      unitName: '单位四',
      head: '李',
      iscy: '否',
      phone: '13123456789',
      unitType: '四类',
      info: '一级单位',
      createTime: '2022-08-08'
    },
    {
      id: 5,
      planNumber: '003001',
      unitName: '单位五',
      head: '周',
      iscy: '否',
      phone: '13123456789',
      unitType: '五类',
      info: '一级单位',
      createTime: '2022-08-08'
    },
    {
      id: 6,
      planNumber: '003002',
      unitName: '单位六',
      head: '吴',
      iscy: '否',
      phone: '13123456789',
      unitType: '六类',
      info: '一级单位',
      createTime: '2022-08-08'
    },
    {
      id: 7,
      planNumber: '004001',
      unitName: '单位七',
      head: '郑',
      iscy: '否',
      phone: '13123456789',
      unitType: '七类',
      info: '一级单位',
      createTime: '2022-08-08'
    },
    {
      id: 8,
      planNumber: '004002',
      unitName: '单位八',
      head: '王',
      iscy: '否',
      phone: '13123456789',
      unitType: '八类',
      info: '一级单位',
      createTime: '2022-08-08'
    },
    {
      id: 9,
      planNumber: '005001',
      unitName: '单位九',
      head: '冯',
      iscy: '否',
      phone: '13123456789',
      unitType: '九类',
      info: '一级单位',
      createTime: '2022-08-08'
    },
    {
      id: 10,
      planNumber: '005002',
      unitName: '单位十',
      head: '陈',
      iscy: '否',
      phone: '13123456789',
      unitType: '十类',
      info: '一级单位',
      createTime: '2022-08-08'
    }
  ]
  tableObject.value.loading = false
  tableObject.value.currentPage = 1
  tableObject.value.pageSize = 10
  tableObject.value.total = 10
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
  delLoading.value = true
}
//导出加载
const exLoading = ref(false)
const searchRef = ref<ComponentRef<typeof Search>>()
// //导出
const exportForm = async () => {}

const importDrawer = ref(false)
const importForm = () => {
  importDrawer.value = true
  isAnalysis.value = false
}
// const uploadSuccess = () => {
//   importDrawer.value = false
// }
// const isShowModel = ref(false)

const fileList: any = ref<UploadUserFile[]>([
  {
    name: '单位信息1',
    url: 'https://element-plus.org/images/element-plus-logo.svg'
  },
  {
    name: '单位信息2',
    url: 'https://element-plus.org/images/element-plus-logo.svg'
  }
])

const handleRemove: UploadProps['onRemove'] = (file, uploadFiles) => {
  console.log(file, uploadFiles)
}

const handlePreview: UploadProps['onPreview'] = (uploadFile) => {
  console.log(uploadFile)
}

const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
  ElMessage.warning(`最多上传${files.length}条,${files.length + uploadFiles.length}`)
}
const beforeRemove: UploadProps['beforeRemove'] = (uploadFile) => {
  return ElMessageBox.confirm(`删除 ${uploadFile.name} ?`).then(
    () => true,
    () => false
  )
}

const isAnalysis = ref(false)
const isMeta = ref(false)
const metaChange = () => {
  isMeta.value = true
  importDrawer.value = false
}
const isAdd = ref(false)
</script>

<template>
  <template v-if="!isAdd">
    <ContentWrap class="mt-7px mb-10px">
      <template v-if="!isMeta">
        <Search ref="searchRef" :schema="allSchemas.searchSchema" :pageName="'单位信息管理'">
          <template #table-btns>
            <ElButton :loading="exLoading" type="success" @click="importForm()" plain>
              <Icon icon="ep:upload" class="mr-5px" />导入
            </ElButton>
            <ElButton type="primary" @click="isAdd = true" plain>
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
      </template>
      <template v-else>
        <Search ref="searchRef" :schema="allSchemas.searchSchema" :pageName="'单位信息管理'">
          <template #table-btns>
            <ElButton :loading="exLoading" type="primary" @click="exportForm()" plain>
              <Icon icon="ep:download" class="mr-5px" />导出
            </ElButton>
            <ElButton :loading="exLoading" type="primary" @click="isMeta = false" plain>
              <Icon icon="ep:back" class="mr-5px" />返回
            </ElButton>
          </template>
        </Search>
      </template>
    </ContentWrap>
    <ContentWrap>
      <template v-if="!isMeta">
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
      </template>
      <template v-else>
        <Table
          v-model:pageSize="tableObject.pageSize"
          v-model:currentPage="tableObject.currentPage"
          :columns="columnList"
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
          </template>
        </Table>
      </template>
      <UnitInfoManagementForm title="单位信息管理" ref="operationPlanFormRef" />
      <!-- <el-drawer v-model="importDrawer" size="20%" title="I am the title" :with-header="false">
      <UploadModal
        @upload-success="uploadSuccess"
        :uploadName="'单位信息管理'"
        :downloadUrl="'/safetyProduction/planManage/repairSkylight/importTemplate'"
        :uploadUrl="'/safetyProduction/planManage/repairSkylight/importData'"
      />
    </el-drawer>
    <DrawerWrap /> -->

      <Dialog
        v-model="importDrawer"
        title="导入"
        width="50%"
        :alignCenter="true"
        :maxHeight="'360px'"
        :marginTop="'5vh'"
        :modal-class="'import-modal'"
      >
        <div class="content">
          <div class="flex align-items-center">
            <div class="left">
              <div class="upload flex align-items-center">
                <el-upload
                  v-model:file-list="fileList"
                  class="upload-demo"
                  action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                  multiple
                  :show-file-list="false"
                  :on-preview="handlePreview"
                  :on-remove="handleRemove"
                  :before-remove="beforeRemove"
                  :limit="3"
                  :on-exceed="handleExceed"
                >
                  <el-button type="primary">点击上传</el-button>
                </el-upload>
                <el-select class="m-2" placeholder="选择" style="width: 100%">
                  <el-option
                    v-for="item in fileList"
                    :key="item.url"
                    :label="item.name"
                    :value="item.url"
                  />
                </el-select>
              </div>
              <div class="tips"
                >提示：excel文件第一行为标题，第二行开始为数据。

                <ElButton type="default" plain> 查看示例 </ElButton>
              </div>
            </div>
            <div class="right">
              <ElButton type="primary" plain @click="isAnalysis = true"> 开始解析 </ElButton>
            </div>
          </div>
          <div class="list-con">
            <div class="list" v-if="isAnalysis">
              <div class="item">1：上传excel文件为《单位信息.xlsx》。</div>
              <div class="item">2：excel数据共有数据项15个。</div>
              <div class="item">3：excel数据共有量84652条。</div>
            </div>
          </div>
          <ElButton type="primary" class="pp-btn mt-10px" plain @click="metaChange()">
            开始匹配
          </ElButton>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="importDrawer = false">取消</el-button>
          </span>
        </template>
      </Dialog>
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
.content {
  .right {
    margin-left: 20px;
  }
  .list-con {
    margin-top: 15px;
    padding: 10px;
    background: #ccc;
    width: 100%;
    height: 180px;
    .item {
      background: #fff;
      line-height: 40px;
      margin: 10px 0;
      padding: 0 20px;
    }
  }
  .pp-btn {
    margin: 20px auto;
    width: 100%;
  }
}
</style>
