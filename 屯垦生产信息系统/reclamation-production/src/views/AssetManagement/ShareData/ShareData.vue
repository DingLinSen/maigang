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
import { ShareDataForm } from './components/index'
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

const ShareDataFormRef = ref<ComponentRef<typeof ShareDataForm>>()
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
  // {
  //   field: 'userId',
  //   label: '序号',
  //   type: 'index',
  //   fixed: 'left'
  // },
  {
    field: 'interfaceName',
    minWidth: '180px',
    label: '应用ID',
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
    label: '资源目录名称',
    formatter: (row: Recordable) => {
      return h('span', row.interfaceRoute ? row.interfaceRoute : '--')
    }
  },
  {
    field: 'requestMethod',
    minWidth: '120px',
    label: 'API名称',
    formatter: (row: Recordable) => {
      return h('span', row.requestMethod ? row.requestMethod : '--')
    }
  },
  {
    field: 'responseResults',
    minWidth: '180px',
    label: '共享接口名称',
    formatter: (row: Recordable) => {
      return h('span', row.responseResults ? row.responseResults : '--')
    }
  },
  {
    field: 'remark',
    minWidth: '180px',
    label: '描述',
    formatter: (row: Recordable) => {
      return h('span', row.remark ? row.remark : '--')
    }
  },
  {
    field: 'password',
    minWidth: '180px',
    label: '应用秘钥',
    formatter: (row: Recordable) => {
      return h('span', row.password ? row.password : '--')
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
    field: 'action',
    width: '220px',
    label: '操作',
    fixed: 'right'
  }
])
const { allSchemas } = useCrudSchemas(crudSchemas)

//添加
const addAction = () => {
  nextTick(() => {
    ShareDataFormRef.value?.openDrawer('add', '')
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
    ShareDataFormRef.value?.openDrawer(type, row.id)
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
    interfaceRoute: '资源目录',
    interfaceName: '001',
    requestMethod: 'api名称',
    responseResults: '共享接口名',
    createUser: 'admin',
    createTime: '2024-02-01',
    remark: '这是描述',
    password: '应用密钥'
  },
  {
    interfaceRoute: '资源目录',
    interfaceName: '002',
    requestMethod: 'get',
    responseResults: '共享接口名',
    createUser: 'admin',
    createTime: '2024-02-01',
    remark: '这是描述',
    password: '应用密钥'
  },
  {
    interfaceRoute: '资源目录',
    interfaceName: '003',
    requestMethod: 'api名称',
    responseResults: '共享接口名',
    createUser: 'admin',
    createTime: '2024-02-01',
    remark: '这是描述',
    password: '应用密钥'
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
        label: '大数据局--开放网'
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
            <ElButton type="primary" v-hasPermi="'system:user:add'">
              <Icon icon="ep:plus" class="mr-5px" />
              接口配置
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
            <!-- <ElButton
              type="text"
              @click="action(row, 'see')"
              :text="true"
              v-hasPermi="'system:post:edit'"
            >
              查看
            </ElButton> -->
            <ElButton
              v-hasPermi="'system:user:edit'"
              v-show="!row.admin"
              type="text"
              :text="true"
              @click="action(row, 'edit')"
            >
              编辑
            </ElButton>
            <ElButton v-hasPermi="'system:user:edit'" v-show="!row.admin" type="text" :text="true">
              生成API
            </ElButton>
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
  <ShareDataForm title="" ref="ShareDataFormRef" @get-class-room-list="getList()" />
</template>
