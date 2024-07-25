<template>
  <DrawerWrap title="统计详情" :isShow="isShow" ref="drawerWrap" class="personal-manage-drawer">
    <template #content>
      <!-- 表格 -->
      <Table
        ref="tableRef"
        style="background: #fff"
        v-model:pageSize="tableObject.pageSize"
        v-model:currentPage="tableObject.currentPage"
        :columns="allSchemas.tableColumns"
        :height="contentHeight"
        :data="tableObject.tableList"
        :loading="tableObject.loading"
        :border="true"
        :isShowFilter="true"
        :header-align="'center'"
        :cotentAlign="'center'"
        :pagination="{
          total: tableObject.total
        }"
        @register="register"
      >
        <template #id="{ $index }">
          <span>
            {{ $index + 1 + tableObject.pageSize * (tableObject.currentPage - 1) }}
          </span>
        </template>
        <template #operateBtnLeft>
          <Search
            ref="searchRef"
            v-if="isAuth('AdministrativeService:inventoryManagement:query')"
            :schema="allSchemas.searchSchema"
            @search="setSearchParamsSub"
            @reset="reset"
          />
        </template>
        <template #operateBtnRight>
          <div class="mr-[10px]">
            <ElButton
              :loading="exLoading"
              class="btn-other exportBtn"
              v-hasPermi="'project:cultivate:export'"
              @click="exportForm()"
              plain
            >
              <template #icon>
                <Icon :size="14" icon="svg-icon:exportBut" />
              </template>
              导出
            </ElButton>
          </div>
        </template>
      </Table>
    </template>
  </DrawerWrap>
</template>
<script setup lang="ts">
import {
  ref,
  reactive,
  computed,
  onMounted,
  h,
  unref,
  getCurrentInstance,
  watch,
  nextTick
} from 'vue'
import { ContentWrap } from '@/components/ContentWrap'
import { Table } from '@/components/Table'
import { TableColumn } from '@/types/table'
import { useEmitt } from '@/hooks/web/useEmitt'
import { Search } from '@/components/Search'
import { useTable } from '@/hooks/web/useTable'
import { useAppStore } from '@/store/modules/app'
import { getStudyRecordListApi, exportCourseOperateListApi } from '@/api/school/statistics'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { ElButton, ElTag, ElMessage, ElMessageBox } from 'element-plus'
import moment from 'moment'
import { isAuth } from '@/utils/is' // 鉴权
import { useRoute } from 'vue-router'
import { Message } from 'postcss'
import { DrawerWrap } from '@/components/DrawerWrap'
import { getAllUserListApi } from '@/api/user' // 获取所有用户
import { getAllDeptListApi } from '@/api/sys/dept' // 获取所有部门
import { listToTree } from '@/utils/tree'

const deptData = ref<any>([])
const deptArray = ref<any>([])
const userData = ref<any>([])
const principalTree = ref<any>([])
//获取所有用户
const getAllUserlist = async () => {
  try {
    const res = await getAllDeptListApi({})
    const { data } = await getAllUserListApi({})
    deptData.value = res.data
    userData.value = data
    userData.value.map((item: any, index: number) => {
      if (item.nickName === '张保国' && item.postStr === '董事长') {
        userData.value.unshift(userData.value.splice(index, 1)[0])
      }
    })
    getprincipalTree()
    return data
  } catch (error) {
    console.log(error)
  }
}

//获取所有用户
const getAllDeptlist = async () => {
  try {
    const res = await getAllDeptListApi({})
    deptArray.value = res.data
  } catch (error) {
    console.log(error)
  }
}

const getprincipalTree = async () => {
  if (deptData.value.length) {
    deptData.value.forEach((deptItem: any) => {
      userData.value.forEach((userItem: any) => {
        if (deptItem.deptId === userItem.deptId) {
          deptItem.children.push({
            deptId: userItem.userId,
            deptName: userItem.nickName,
            postStr: userItem.postStr
          })
        }
      })
    })
    principalTree.value = listToTree(deptData.value, {
      id: 'deptId',
      children: 'children',
      pid: 'parentId'
    })
  }
}

const route = useRoute()
const drawerWrap = ref<ComponentRef<typeof DrawerWrap>>()
const appStore = useAppStore()
// 表格高度
const defaultHeight = ref(0)

//0浏览、1下载、2点赞
const operateType = ref<any>([
  { label: '浏览', value: '0' },
  { label: '下载', value: '1' },
  { label: '点赞', value: '2' }
])

// 存放表格的数据
const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'id',
    label: '序号',
    minWidth: '80px'
  },
  {
    field: 'deptName',
    label: '部门',
    minWidth: '120px',
    formatter: (row: Recordable) => {
      return h('span', row.deptName ? row.deptName : '--')
    },
    search: {
      show: true,
      component: 'Cascader',
      componentProps: {
        style: 'width: 10vw',
        placeholder: '请选择部门',
        options: deptArray,
        props: {
          label: 'deptName',
          value: 'deptId'
        }
      }
    }
  },
  {
    field: 'createUserName',
    label: '姓名',
    minWidth: '140px',
    formatter: (row: Recordable) => {
      return h('span', row.createUserName ? row.createUserName : '--')
    },
    search: {
      show: true,
      component: 'Cascader',
      componentProps: {
        style: 'width: 10vw',
        placeholder: '请选择姓名',
        options: principalTree,
        props: {
          label: 'deptName',
          value: 'deptId'
        }
      }
    }
  },
  {
    field: 'moduleName',
    label: '功能模块',
    minWidth: '80px',
    formatter: (row: Recordable) => {
      return h('span', row.moduleName ? row.moduleName : '--')
    },
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        style: 'width: 10vw',
        placeholder: '请选择功能模块',
        options: [
          { label: '产品方案', value: '产品方案' },
          { label: '行业知识', value: '行业知识' },
          { label: '培训课堂', value: '培训课堂' }
        ]
      }
    }
  },
  {
    field: 'targetName',
    label: '文档名称',
    minWidth: '80px',
    formatter: (row: Recordable) => {
      return h('span', row.targetName ? row.targetName : '--')
    }
  },
  {
    field: 'actionTypeName',
    label: '操作类型',
    minWidth: '120px',
    formatter: (row: Recordable) => {
      return h('span', row.actionTypeName ? row.actionTypeName : '--')
    },
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        style: 'width: 10vw',
        placeholder: '请选择操作类型',
        options: operateType
      }
    }
  },
  {
    field: 'createTime',
    label: '操作时间',
    minWidth: '120px',
    formatter: (row: Recordable) => {
      return h('span', row.createTime ? row.createTime : '--')
    }
  }
])
const { allSchemas } = useCrudSchemas(crudSchemas)
const { register, tableObject, methods } = useTable<any>({
  getListApi: getStudyRecordListApi,
  response: {
    list: 'rows',
    total: 'total'
  }
})
const { getList, setSearchParams } = methods
getList()
//打开drawer并初始化
const searchRef = ref()
const tableRef = ref()

const openDrawer = (moduleName: string) => {
  drawerWrap.value.isShow = true
  params.moduleName = moduleName
  setTimeout(() => {
    if (searchRef.value) {
      searchRef.value.setValues({ moduleName: moduleName })
    }
  }, 500)
  setSearchParams({ moduleName: moduleName })
  nextTick(() => {
    setTimeout(() => {
      if (tableRef.value) {
        tableRef.value.resetTableHeight()
      }
    }, 500)
  })
}
// getList()
// 视窗高度
const documentClientHeight = computed(() => appStore.getDocumentClientHeight)
const resetTableHeight = () => {
  const overView = getOverViewWrapper('.overView')
  const overViewWrapper = getOverViewWrapper('#v-tags-view')
  const footer = getOverViewWrapper('.v-footer')
  const trigger = getOverViewWrapper('.hover-trigger-view')
  defaultHeight.value = documentClientHeight.value - overViewWrapper - overView - trigger - footer
}
const getOverViewWrapper = (dom: string): number => {
  let topH = 0
  const checkboxWrapper = document.querySelector(dom)
  if (checkboxWrapper) {
    topH = checkboxWrapper.clientHeight
  }
  return topH
}
// 注册
onMounted(() => {
  resetTableHeight()
  getAllUserlist()
  getAllDeptlist()
})
useEmitt({
  name: 'window',
  callback: (type: string) => {
    if (type === 'resize') {
      resetTableHeight()
    }
  }
})
const params = reactive<Recordable>({
  userId: null, //
  deptId: null,
  moduleName: null,
  actionType: null
})
//搜索
const setSearchParamsSub = (param: any) => {
  params.moduleName = param.moduleName ? param.moduleName : null
  params.userId = param.createUserName
    ? param.createUserName[param.createUserName.length - 1]
    : null
  params.deptId = param.deptName ? param.deptName[param.deptName.length - 1] : null
  params.actionType = param.actionTypeName ? param.actionTypeName : null
  setSearchParams(params)
}
// 重置
const reset = (param: any) => {
  params.moduleName = null
  params.createUser = null
  params.deptId = null
  params.actionType = null
  setSearchParams(params)
}
//导出
const exLoading = ref(false)
const exportForm = async () => {
  if (tableObject.tableList.length === 0) {
    ElMessage.warning('查询无数据, 无需导出数据')
    return
  }
  exLoading.value = true
  await exportCourseOperateListApi(params)
  exLoading.value = false
}

// 更新表格
const resetList = () => {
  tableObject.currentPage = 1
  getList()
}
defineExpose({
  openDrawer
})
</script>
<style lang="less" scoped>
.top {
  display: flex;
  justify-content: space-between;
}
</style>
