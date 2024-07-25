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
import { InternalDataForm } from './components/index'
import { Tree } from '@/components/Tree'
import { useAppStore } from '@/store/modules/app'

defineOptions({
  name: 'SynchronousLog'
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

const InternalDataFormRef = ref<ComponentRef<typeof InternalDataForm>>()
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
    field: 'interfaceName',
    minWidth: '180px',
    label: '接口名称',
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        style: 'width:200px;' //宽度
      }
    },
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
    InternalDataFormRef.value?.openDrawer('add', '')
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
    InternalDataFormRef.value?.openDrawer(type, row.id)
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
    interfaceRoute: 'http://110.220.330.40',
    interfaceName: '土地资源',
    requestMethod: 'post',
    responseResults: '调试通过',
    createUser: 'admin',
    createTime: '2024-02-01',
    remark: '这是备注'
  },
  {
    interfaceRoute: 'http://110.220.330.40',
    interfaceName: '生产设施',
    requestMethod: 'get',
    responseResults: '调试失败',
    createUser: 'admin',
    createTime: '2024-02-01',
    remark: '这是备注'
  },
  {
    interfaceRoute: 'http://110.220.330.40',
    interfaceName: '农机装备',
    requestMethod: 'post',
    responseResults: '调试通过',
    createUser: 'admin',
    createTime: '2024-02-01',
    remark: '这是备注'
  }
]
const appStore = useAppStore()

const defaultHeight = ref(appStore.getDocumentClientHeight - 140)
const treeWidth = ref(260)
const isShowLeft = ref(true)
const treedata = [
  {
    id: 1,
    label: '资源目录',
    children: [
      {
        id: 158,
        label: '土地资源'
      }
    ]
  }
]
</script>

<template>
  <el-container class="flex-bteween">
    <Tree
      ref="dragDom"
      class="mt-7px"
      :defaultHeight="defaultHeight"
      :title="''"
      :expandOnClickNode="false"
      :width="treeWidth + 'px'"
      :data="treedata"
      :expendAll="true"
    />
    <div
      :style="{
        width: isShowLeft ? `calc(100% - ${treeWidth}px)` : '100%'
      }"
    >
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
            <!-- <ElButton type="primary" v-hasPermi="'system:user:add'" @click="addAction">
              <Icon icon="ep:plus" class="mr-5px" />
              新增
            </ElButton> -->
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
            <!-- <ElButton
              v-hasPermi="'system:user:edit'"
              v-show="!row.admin"
              type="text"
              :text="true"
              @click="action(row, 'edit')"
            >
              编辑
            </ElButton> -->
            <ElButton
              v-hasPermi="['system:user:remove']"
              v-show="!row.admin"
              type="text"
              :text="true"
              @click="delData(row, false)"
            >
              删除
            </ElButton>
          </template>
        </Table>
      </ContentWrap>
    </div>
  </el-container>
  <InternalDataForm ref="InternalDataFormRef" @get-class-room-list="getList()" />
</template>
