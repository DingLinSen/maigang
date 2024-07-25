<script setup lang="ts">
import { h, reactive, ref, nextTick } from 'vue'
import { ElButton } from 'element-plus'
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Table } from '@/components/Table'
import { Dialog } from '@/components/Dialog'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { entries } from 'node_modules/@types/lodash-es'

const chooseListAll = ref([]) // 表格选中

// 搜索参数
const params = reactive<Recordable>({
  courseName: undefined
})
const exLoading = ref<boolean>(false) // 导出loadign
const isShow = ref<boolean>(false)
const tableDialog = ref() // 弹框ref
const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'userId',
    label: '序号',
    type: 'index',
    fixed: 'left'
  },
  {
    field: 'searchKey',
    minWidth: '180px',
    label: '字段名',
    table: {
      show: false
    },
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        options: [
          {
            value: '1',
            label: '区县'
          },
          {
            value: '2',
            label: '法定代表人'
          },
          {
            value: '3',
            label: '街道名称'
          },
          {
            value: '4',
            label: '村庄名称'
          },
          {
            value: '5',
            label: '姓名'
          }
        ],
        style: 'width:200px;' //宽度
      }
    }
  },
  {
    field: 'searchValue',
    minWidth: '180px',
    label: '查询内容',
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        style: 'width:200px;' //宽度
      }
    },
    table: {
      show: false
    }
  },
  {
    field: 'interfaceName',
    minWidth: '180px',
    label: '接口名称',

    formatter: (row: Recordable) => {
      return h('span', row.interfaceName ? row.interfaceName : '--')
    }
  },
  {
    field: 'interfaceRoute',
    minWidth: '180px',
    label: '接口路径',
    formatter: (row: Recordable) => {
      return h('span', row.interfaceRoute ? row.interfaceRoute : '--')
    }
  },
  {
    field: 'requestMethod',
    minWidth: '120px',
    label: '请求方法',
    formatter: (row: Recordable) => {
      return h('span', row.requestMethod ? row.requestMethod : '--')
    }
  },
  {
    field: 'responseResults',
    minWidth: '180px',
    label: '响应结果',
    formatter: (row: Recordable) => {
      return h('span', row.responseResults ? row.responseResults : '--')
    }
  },
  {
    field: 'createUser',
    minWidth: '180px',
    label: '创建人',
    formatter: (row: Recordable) => {
      return h('span', row.createUser ? row.createUser : '--')
    }
  },
  {
    field: 'createTime',
    minWidth: '120px',
    label: '创建时间',
    formatter: (row: Recordable) => {
      return h('span', row.createTime ? row.createTime : '--')
    }
  },
  {
    field: 'remark',
    minWidth: '180px',
    label: '备注',
    formatter: (row: Recordable) => {
      return h('span', row.remark ? row.remark : '--')
    }
  }
])
const { allSchemas } = useCrudSchemas(crudSchemas)
// 表格数据
const tableData = [
  {
    interfaceRoute: 'http://110.220.330.40',
    interfaceName: '产品需求计划',
    requestMethod: 'post',
    responseResults: '调试通过',
    createUser: 'admin',
    createTime: '2024-02-01',
    remark: '这是备注'
  },
  {
    interfaceRoute: 'http://110.220.330.40',
    interfaceName: '供应保障',
    requestMethod: 'get',
    responseResults: '调试失败',
    createUser: 'admin',
    createTime: '2024-02-01',
    remark: '这是备注'
  },
  {
    interfaceRoute: 'http://110.220.330.40',
    interfaceName: '产品需求计划',
    requestMethod: 'post',
    responseResults: '调试通过',
    createUser: 'admin',
    createTime: '2024-02-01',
    remark: '这是备注'
  }
]

//搜索
const setSearchParamsSub = (param: Recordable) => {
  chooseListAll.value = []
  params.courseName = param.courseName ? param.courseName : undefined
  // setSearchParams(params)
}
//打开drawer并初始化
const openDrawer = (id: string) => {
  isShow.value = true
  console.log(tableDialog.value)
  new ResizeObserver((entries) => {
    for (let entry of entries) {
      console.log(entry.target.clientHeight)
    }
  })
}

//关闭drawer
const closeDrawer = () => {
  isShow.value = false
}
// 导出操作
const exportForm = () => {}
defineExpose({
  isShow,
  openDrawer
})
</script>

<template>
  <Dialog
    ref="tableDialog"
    v-model="isShow"
    width="70%"
    :maxHeight="'auto'"
    :title="'列表页面'"
    @close="closeDrawer"
  >
    <ContentWrap class="mt-7px mb-10px">
      <Search
        ref="searchRef"
        :schema="allSchemas.searchSchema"
        :chooseListAll="chooseListAll"
        @search="setSearchParamsSub"
        @reset="setSearchParamsSub"
      />
    </ContentWrap>
    <ContentWrap>
      <Table
        :columns="allSchemas.tableColumns"
        :data="tableData"
        :border="true"
        class="search-table"
        :selection="false"
        :keyTable="'postId'"
        :chooseListAll="chooseListAll"
        :header-align="'center'"
        :align="'center'"
        :pagination="{
          total: 3
        }"
      >
        <template #operateBtnLeft>
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
      </Table>
    </ContentWrap>
    <template #footer>
      <div class="details-footer">
        <ElButton @click="closeDrawer"> 取消 </ElButton>
      </div>
    </template>
  </Dialog>
</template>

<style lang="less" scoped>
:deep(.el-input-group__append) {
  background-color: white;
  width: 35px;
}
// :deep(.search-table) {
//   .el-table--fit {
//     height: 435px !important;
//   }
// }
// :deep(.el-table__inner-wrapper) {
//   height: 435px !important;
// }
</style>
