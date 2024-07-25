<!-- 通讯录 -->
<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { ElButton, ElMessageBox, ElTag, ElMessage } from 'element-plus'
import { Table } from '@/components/Table'
import { getPhoneBookListApi, delPhoneBookListApi } from '@/api/phone'
import { useTable } from '@/hooks/web/useTable'
import {
  getCurrentInstance,
  h,
  reactive,
  ref,
  unref,
  provide,
  onMounted,
  nextTick,
  watch
} from 'vue'
import { useEmitt } from '@/hooks/web/useEmitt'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { TableColumn } from '@/types/table'
import moment from 'moment'
import useDictStore from '@/store/modules/appDict'
import { isAuth } from '@/utils/is'
import { PhoneForm } from './Form'
import { getAllDeptListApi } from '@/api/sys/dept'
import { getPostOptionSelectApi } from '@/api/post'
import { listToTree } from '@/utils/tree'
import { LimitDailog } from '@/views/Components/limit'
import { element } from '@/config/element'

defineOptions({
  name: 'PhoneBook'
})

onMounted(() => {
  getDeptTreeList()
  getPostSelectList()
})

// 左侧树形数据
const treedata = ref<any>([])
provide('treedata', treedata)
// 获取部门树
const getDeptTreeList = async () => {
  try {
    if (treedata.value.length > 0) {
      return
    }
    const res = await getAllDeptListApi({})
    if (res) {
      treedata.value = listToTree(res.data, {
        id: 'deptId',
        children: 'children',
        pid: 'parentId'
      })
    }
  } catch (err) {}
}

// 岗位数组
const postSelectList = ref<any>([])
provide('postSelectList', postSelectList)
// 获取岗位下拉
const getPostSelectList = async () => {
  try {
    if (postSelectList.value.length > 0) {
      return
    }
    const res = await getPostOptionSelectApi()
    postSelectList.value = []
    if (res.data) {
      postSelectList.value = selectionEdit(res.data, 'postName', 'postId')
    }
  } catch (err) {
    console.log(err)
  }
}
// 下拉选项重组
const selectionEdit = (data: any, lable: string, value: string) => {
  const editData = data.map((item: any) => {
    return (item = Object.assign(item, {
      label: item[lable],
      value: item[value]
    }))
  })

  return editData
}
const { register, tableObject, methods } = useTable<any>({
  getListApi: getPhoneBookListApi,
  delListApi: delPhoneBookListApi,
  response: {
    list: 'rows',
    total: 'total'
  }
})
tableObject.pageSize = 20

const { getList, setSearchParams } = methods

getList()

useEmitt({
  name: 'getList',
  callback: (type: string) => {
    if (type === 'add') {
      tableObject.currentPage = 1
    }
    getList()
  }
})

const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'index',
    headerAlign: 'center',
    cotentAlign: 'center',
    label: '序号',
    minWidth: '60px',
    formatter: (row: Recordable, __: TableColumn, cellValue: string, index: number) => {
      let itemIndex = index + 1 + tableObject.pageSize * (tableObject.currentPage - 1)
      return h('span', itemIndex)
    }
  },
  {
    field: 'name',
    label: '姓名',
    minWidth: '80px',
    search: {
      show: true,
      componentProps: {
        style: 'width: 196px',
        placeholder: '姓名筛选'
      }
    },
    formatter: (row: Recordable) => {
      return h('span', row.name ? row.name : '--')
    }
  },
  {
    field: 'deptName',
    label: '部门',
    search: {
      show: true,
      component: 'Cascader',
      componentProps: {
        style: 'width: 196px',
        options: treedata,
        props: {
          label: 'deptName',
          value: 'deptId'
        },
        filterable: true,
        placeholder: '部门筛选'
      }
    },
    minWidth: '140px',
    formatter: (row: Recordable, __: TableColumn, cellValue: string) => {
      return h('span', cellValue)
    }
  },
  {
    field: 'post',
    label: '职务',
    minWidth: '180px',
    formatter: (row: Recordable, __: TableColumn, cellValue: string) => {
      return h('span', cellValue)
    },
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        style: 'width: 196px',
        options: postSelectList,
        filterable: true,
        placeholder: '职务筛选'
      }
    }
  },
  {
    field: 'mobile',
    minWidth: '160px',
    label: '电话',
    formatter: (row: Recordable) => {
      return h('span', row.mobile ? row.mobile : '--')
    }
  },
  {
    field: 'email',
    minWidth: '200px',
    label: '邮箱',
    formatter: (row: Recordable) => {
      return h('span', row.email ? row.email : '--')
    }
  },
  {
    field: 'action',
    showOverflowTooltip: false,
    width: '160px',
    fixed: 'right',
    label: '操作'
    // table: {
    //   show: isAuth('company:phone:edit') || isAuth('company:phone:remove')
    // }
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)

//添加
const AddAction = () => {
  phoneFormRef.value.openDrawer('add', '')
}

//删除加载
const delLoading = ref(false)

//删除
const delData = async (row: any | null, multiple: boolean) => {
  tableObject.currentRow = row
  const { delList, getSelections } = methods
  const selections = await getSelections()
  // 判断选中的数据是否有权限
  let res = selections.every(function (item) {
    return item.eeno === '100000'
  })
  if (!res) {
    ElMessage.warning('部分数据没有权限进行操作')
    return
  }
  delLoading.value = true
  await delList(
    multiple ? selections.map((v) => v.id) : [tableObject.currentRow?.id as string],
    multiple,
    true,
    true
  ).finally(() => {
    delLoading.value = false
  })
}

const phoneFormRef = ref<ComponentRef<typeof PhoneForm>>()

//table操作栏按钮事件
const action = (row: any, type: string) => {
  phoneFormRef.value.openDrawer(type, row.id)
}

const params = reactive<Recordable>({
  name: '',
  deptId: '',
  postId: ''
})

//搜索
const setSearchParamsSub = (param: Recordable) => {
  console.log(param)
  params.name = param.name ? param.name : ''
  params.deptId = param.deptName ? param.deptName[param.deptName.length - 1] : ''
  params.postId = param.post ? param.post : ''
  setSearchParams(params)
}

//添加操作栏
const addActionCell = () => {
  nextTick()
  let result = allSchemas.tableColumns.some((item: any) => item.field == 'action')
  if (!result) {
    allSchemas.tableColumns.push({
      field: 'action',
      showOverflowTooltip: false,
      width: '160px',
      fixed: 'right',
      label: '操作'
    })
  }
  console.log('addActionCell==>', allSchemas.tableColumns)
}
//移除操作栏
const removeActionCell = () => {
  nextTick()
  let indexSub = -1
  allSchemas.tableColumns.find((item, index) => {
    if (item.field == 'action') {
      indexSub = index
    }
  })
  if (indexSub > -1) {
    allSchemas.tableColumns.splice(indexSub, 1)
  }
  console.log('removeActionCell==>', allSchemas.tableColumns)
}

watch(
  () => tableObject.tableList,
  (data: any) => {
    if (data && data.length) {
      let checkData = data.find((element: any) => element.eeno === '100000')
      if (checkData && (isAuth('company:phone:edit') || isAuth('company:phone:remove'))) {
        addActionCell()
      } else {
        removeActionCell()
      }
    } else {
      if (isAuth('company:phone:edit') || isAuth('company:phone:remove')) {
        addActionCell()
      } else {
        removeActionCell()
      }
    }
  },
  {
    immediate: true
  }
)
</script>

<template>
  <ContentWrap Showtitle="通讯录">
    <template #ContentWrapTitle>
      <div>
        <ElButton class="btn-add" @click="AddAction" plain v-hasPermi="'company:phone:add'">
          <template #icon>
            <Icon :size="14" icon="svg-icon:addBut" />
          </template>
          新增
        </ElButton>
        <ElButton
          :loading="delLoading"
          class="btn-other"
          @click="delData(null, true)"
          plain
          v-hasPermi="'company:phone:remove'"
        >
          <template #icon>
            <Icon :size="14" icon="svg-icon:deleteBut" />
          </template>
          删除
        </ElButton>
      </div>
    </template>

    <Table
      v-model:pageSize="tableObject.pageSize"
      v-model:currentPage="tableObject.currentPage"
      :columns="allSchemas.tableColumns"
      :data="tableObject.tableList"
      :page-size="20"
      :loading="tableObject.loading"
      :border="true"
      :header-align="'center'"
      :cotentAlign="'center'"
      :pagination="{
        total: tableObject.total
      }"
      @register="register"
    >
      <template #operateBtnLeft>
        <Search
          v-if="isAuth('company:phone:query')"
          :schema="allSchemas.searchSchema"
          @search="setSearchParamsSub"
          @reset="setSearchParamsSub"
        />
      </template>
      <template #action="{ row }">
        <ElButton
          @click="action(row, 'edit')"
          :text="true"
          class="btn-default"
          v-if="isAuth('company:phone:edit') && row.eeno === '100000'"
        >
          编辑
        </ElButton>
        <ElButton
          class="btn-default"
          @click="delData(row, false)"
          :text="true"
          size="small"
          v-if="isAuth('company:phone:remove') && row.eeno === '100000'"
        >
          删除
        </ElButton>
      </template>
    </Table>
    <LimitDailog routerName="PhoneBook" />
  </ContentWrap>

  <PhoneForm title="通讯录" ref="phoneFormRef" />
</template>
<style lang="less" scoped>
:deep(.el-loading-mask) {
  top: 0px !important;
  width: 100% !important;
  left: 0px !important;
}
</style>
