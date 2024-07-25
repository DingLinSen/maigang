<template>
  <ContentWrap Showtitle="工作周报">
    <template #ContentWrapTitle>
      <div>
        <ElButton class="btn-add" @click="add('add')" plain v-hasPermi="'weekly:list:add'">
          <template #icon>
            <Icon :size="14" icon="svg-icon:addBut" />
          </template>
          新增
        </ElButton>
      </div>
    </template>
    <!-- 表格 -->
    <Table
      :isShowFilter="true"
      :border="true"
      ref="ElTableRef"
      v-model:pageSize="tableObject.pageSize"
      v-model:currentPage="tableObject.currentPage"
      :data="tableObject.tableList"
      :loading="tableObject.loading"
      :selection="false"
      :columns="allSchemas.tableColumns"
      :header-align="'center'"
      :cotentAlign="'center'"
      :pagination="{
        total: tableObject.total
      }"
      @register="register"
    >
      <template #operateBtnLeft>
        <Search
          ref="ElFormRef"
          :schema="allSchemas.searchSchema"
          @search="setSearchParamsSub"
          @reset="reset"
          v-hasPermi="'weekly:list:query'"
        />
      </template>
      <template #index="{ $index }">
        <span>{{
          $index + 1 + tableObject.pageSize * (tableObject.currentPage - 1)
        }}</span></template
      >
      <template #action="{ row }">
        <ElButton class="btn-default" :text="true" size="small" @click="action('see', row.id)"
          >查看
        </ElButton>
        <ElButton
          class="btn-default"
          :text="true"
          size="small"
          v-if="
            (row.status == '0' || row.status == '3') &&
            wsCache.get('userInfo').nickName == row.createByName
          "
          @click="action('edit', row.id)"
          >编辑
        </ElButton>
        <ElButton
          class="btn-default"
          :text="true"
          v-if="row.status == '1' && row.audit && isAuth('weekly:list:regression')"
          size="small"
          @click="region(row)"
          >归档
        </ElButton>
        <ElButton
          class="btn-default"
          :text="true"
          v-if="
            wsCache.get('userInfo').nickName == row.createByName && isAuth('weekly:list:delect')
          "
          size="small"
          @click="delData(row, false)"
          >删除
        </ElButton>
        <ElButton
          v-if="
            (row.status == '0' || row.status == '3') &&
            wsCache.get('userInfo').nickName == row.createByName &&
            isAuth('weekly:list:publish')
          "
          class="btn-default"
          :text="true"
          size="small"
          @click="publish(row.id)"
          >发布
        </ElButton>
      </template>
    </Table>
    <WeeklyDetails ref="weeklyDetailsRef" />
  </ContentWrap>
  <LimitDailog routerName="weekly" />
</template>
<script setup lang="ts">
import { listToTree } from '@/utils/tree'
import { getAllUserListApi } from '@/api/user' // 获取所有用户
import { getAllDeptListApi } from '@/api/sys/dept' // 获取所有部门
import { ContentWrap } from '@/components/ContentWrap'
import { ref, reactive, h, provide, unref } from 'vue'
import { Table } from '@/components/Table'
import { Search } from '@/components/Search'
import { useTable } from '@/hooks/web/useTable'
import { getListApi, deleteByIdApi, publishApi, getAuditApi } from '@/api/assessment/weekly'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { ElMessage, ElMessageBox } from 'element-plus'
import moment from 'moment'
import axios from 'axios'
import { useAppStoreWithOut } from '@/store/modules/app'
import { useCache } from '@/hooks/web/useCache'
import { config } from '@/config/axios/config'
import { LimitDailog } from '@/views/Components/limit'
import { isAuth } from '@/utils/is'

defineOptions({
  name: 'Weekly'
})

const { base_url } = config
const appStore = useAppStoreWithOut()
const PATH_URL = base_url[import.meta.env.VITE_API_BASEPATH]
const { wsCache } = useCache()
const token = wsCache.get(appStore.getToken)
import { useRouter } from 'vue-router'
import WeeklyDetails from './weeklyDetails.vue'

const weeklyDetailsRef = ref()
const params = reactive<any>({
  workDate: '',
  deptId: ''
})

const ElFormRef = ref()
//部门数据
let deptData = ref<any>([])
const filiteDeptData = ref<any>([])
//人员数据
const userData = ref<any>([])
//部门人员整合后的数据
const principalTree = ref<any>([])
const getAllUserlist = async () => {
  try {
    const res = await getAllDeptListApi({})
    const { data } = await getAllUserListApi({})
    deptData.value = res.data
    filiteDeptData.value = res.data.map((v) => {
      return {
        value: v.deptId,
        label: v.deptName
      }
    })
    userData.value = data
    userData.value.reverse()
    getprincipalTree()

    return data
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
            deptName: userItem.nickName
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
getAllUserlist()

// 存放表格的数据
const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'index',
    label: '序号',
    minWidth: '60px'
  },
  {
    field: 'yearMonthValue',
    label: '月份',
    minWidth: '100px',
    table: {
      show: true
    },
    formatter: (row: any) => {
      return h('span', row.yearMonthValue ? moment(row.yearMonthValue).format('YYYY-MM') : '--')
    },
    search: {
      value: moment(new Date()).isoWeekday(1).format('YYYY-MM'),
      show: true,
      component: 'DatePicker',
      componentProps: {
        type: 'month', // 组件type属性+
        format: 'YYYY-MM'
        // style: 'width: 196px;margin-top:-4px'
      }
    }
  },
  {
    field: 'weekValue',
    label: '考核周',
    minWidth: '100px',
    formatter: (row: any) => {
      return h(
        'span',
        row.weekValue == 1
          ? '第一周'
          : row.weekValue == 2
          ? '第二周'
          : row.weekValue == 3
          ? '第三周'
          : row.weekValue == 4
          ? '第四周'
          : row.weekValue == 5
          ? '第五周'
          : row.weekValue == 6
          ? '第六周'
          : '--'
      )
    }
  },
  {
    field: 'createByName',
    label: '创建人',
    minWidth: '140px',
    formatter: (row: any) => {
      return h('span', row.createByName ? row.createByName : '--')
    },
    search: {
      show: false,
      component: 'Cascader',
      componentProps: {
        placeholder: '创建人筛选',
        filterable: true,
        options: principalTree,
        style: 'width: 196px',
        props: {
          label: 'deptName',
          value: 'deptName'
        }
      }
    }
  },
  {
    field: 'deptId',
    label: '部门',
    minWidth: '140px',
    formatter: (row: any) => {
      return h('span', row.deptName ? row.deptName : '--')
    },
    search: {
      show: isAuth('weekly:list:screen'),
      component: 'Select',
      componentProps: {
        placeholder: '部门筛选',
        style: 'width: 196px',
        filterable: true,
        options: filiteDeptData
      }
    }
  },
  {
    field: 'type',
    label: '周报类型',
    minWidth: '120px',
    formatter: (row: any) => {
      return h('span', row.type == 0 ? '个人周报' : '--')
    }
  },
  {
    field: 'status',
    label: '状态',
    minWidth: '100px',
    formatter: (row: any) => {
      return h(
        'span',
        row.status == 0
          ? '未提交'
          : row.status == 1
          ? '已提交'
          : row.status == 2
          ? '已归档'
          : row.status == 3
          ? '上级驳回'
          : '--'
      )
    }
  },
  {
    field: 'action',
    fixed: 'right',
    minWidth: '220px',
    label: '操作',
    showOverflowTooltip: false
  }
])
const { allSchemas } = useCrudSchemas(crudSchemas)
const { register, tableObject, methods } = useTable<any>({
  getListApi: getListApi,
  delListApi: deleteByIdApi,
  response: {
    list: 'rows',
    total: 'total'
  },
  defaultParams: {
    yearMonthValue: moment(new Date()).isoWeekday(1).format('YYYY-MM')
  }
})
const { getList, setSearchParams } = methods
//打开drawer并初始化

getList()

provide('getList', getList)
//搜索
const setSearchParamsSub = (param: any) => {
  params.yearMonthValue = param.yearMonthValue ? moment(param.yearMonthValue).format('YYYY-MM') : ''
  params.deptId = param.deptId ? param.deptId : ''
  setSearchParams(params)
}
// 重置
const reset = (param: any) => {
  unref(ElFormRef).setValues({ yearMonthValue: '' })
  params.yearMonthValue = ''
  params.deptId = ''
  setSearchParams(params)
}

// 查看
const action = (type, id) => {
  weeklyDetailsRef.value.openDrawer(type, id)
}
const delLoading = ref(false)
//删除
const delData = async (row: any | null, multiple: boolean) => {
  tableObject.currentRow = row
  const { delList, getSelections } = methods
  const selections = await getSelections()
  delLoading.value = true
  await delList(
    multiple ? selections.map((v) => v.id) : [tableObject.currentRow?.id as string],
    multiple
  ).finally(() => {
    delLoading.value = false
  })
}

// 归档
const region = async (row) => {
  ElMessageBox.confirm('确认归档？', '归档信息提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    autofocus: false
  }).then(async () => {
    let data = {
      id: row.id,
      flag: 1,
      details: row.details,
      weekValue: row.weekValue,
      yearMonthValue: row.yearMonthValue
    }
    let res = await getAuditApi(data)
    if (res) {
      ElMessage.success('归档成功')
      getList()
    }
  })
}

// 新增
const add = (type) => {
  weeklyDetailsRef.value.openDrawer(type)
}

// 发布
const publish = async (id) => {
  ElMessageBox.confirm('是否发布？', '发布信息提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    autofocus: false
  }).then(async () => {
    const formData = new FormData()
    formData.append('id', id)
    // 自己实现上传，并得到图片 url alt href
    axios.defaults.withCredentials = true
    axios
      .post(PATH_URL + publishApi(), formData, {
        headers: {
          Authorization: token,
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((res) => {
        if (res) {
          ElMessage.success('发布信息成功')
          getList()
        }
      })
  })
}

// 删除
const del = () => {}

const handle = () => {}
</script>
<style lang="less">
.project-overflow-drawer {
  .el-card {
    border: 0 !important;
  }
}
</style>
