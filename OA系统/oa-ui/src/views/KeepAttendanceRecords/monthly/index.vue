<template>
  <ContentWrap Showtitle="工作月报">
    <template #ContentWrapTitle>
      <div>
        <ElButton class="btn-add" @click="add('add')" plain v-hasPermi="'monthly:list:add'">
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
      :columns="allSchemas.tableColumns"
      :header-align="'center'"
      :selection="false"
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
          v-hasPermi="'monthly:list:query'"
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
            row.status != 1 &&
            row.status != 5 &&
            row.status != 2 &&
            wsCache.get('userInfo').nickName == row.createByName
          "
          @click="action('edit', row.id)"
          >编辑
        </ElButton>
        <ElButton
          class="btn-default"
          v-hasPermi="'monthly:list:delect'"
          :text="true"
          size="small"
          v-if="row.status == 0 && wsCache.get('userInfo').nickName == row.createByName"
          @click="delData(row, false)"
          >删除
        </ElButton>
        <!-- <ElButton
          class="btn-default"
          :text="true"
          size="small"
          v-if="row.status <= 4"
          v-hasPermi="'monthly:list:publish'"
          @click="publish(row.id)"
          >发布
        </ElButton> -->
      </template>
    </Table>
    <MonthlyDetails ref="monthlyDetailsRef" />
  </ContentWrap>
  <LimitDailog routerName="monthly" />
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
import { getListApi, deleteByIdApi, publishApi } from '@/api/assessment/monthly'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import moment from 'moment'
import MonthlyDetails from './monthlyDetails.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { LimitDailog } from '@/views/Components/limit'

import axios from 'axios'
import { useAppStoreWithOut } from '@/store/modules/app'
import { useCache } from '@/hooks/web/useCache'
import { config } from '@/config/axios/config'

defineOptions({
  name: 'Monthly'
})

const { base_url } = config
const appStore = useAppStoreWithOut()
const PATH_URL = base_url[import.meta.env.VITE_API_BASEPATH]
const { wsCache } = useCache()
const token = wsCache.get(appStore.getToken)

const monthlyDetailsRef = ref()
const params = reactive<any>({
  assessmentTime: '',
  deptId: ''
})

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
    userData.value = data
    userData.value.reverse()
    filiteDeptData.value = res.data.map((v) => {
      return {
        value: v.deptId,
        label: v.deptName
      }
    })
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

const ElFormRef = ref()
// 存放表格的数据
const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'index',
    label: '序号',
    minWidth: '60px'
  },
  {
    field: 'assessmentTime',
    label: '月份',
    minWidth: '100px',
    table: {
      show: true
    },
    formatter: (row: any) => {
      return h('span', row.assessmentTime ? moment(row.assessmentTime).format('YYYY-MM') : '--')
    },
    search: {
      value: moment(new Date()).format('YYYY-MM'),
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
    table: {
      show: false
    },
    field: 'deptId',
    label: '部门',
    width: '120px',
    formatter: (row: any) => {
      return h('span', row.deptName ? row.deptName : '--')
    },
    search: {
      show: false,
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
    field: 'status',
    label: '当前状态',
    minWidth: '100px',
    formatter: (row: any) => {
      return h(
        'span',
        row.status == 0
          ? '未提交'
          : row.status == 1
          ? '总结已提交'
          : row.status == 2
          ? '已考核'
          : row.status == 3
          ? '计划被驳回'
          : row.status == 4
          ? '考核中'
          : row.status == 5
          ? '计划已提交'
          : row.status == 6
          ? '总结被驳回'
          : '--'
      )
    }
  },
  {
    field: 'plannedTime',
    label: '计划通过时间',
    minWidth: '140px',
    formatter: (row: any) => {
      return h(
        'span',
        row.plannedTime ? moment(row.plannedTime).format('YYYY-MM-DD HH:mm:ss') : '--'
      )
    }
  },
  {
    field: 'approvalTime',
    label: '总结通过时间',
    minWidth: '140px',
    formatter: (row: any) => {
      return h(
        'span',
        row.approvalTime && row.status == 2
          ? moment(row.approvalTime).format('YYYY-MM-DD HH:mm:ss')
          : '--'
      )
    }
  },
  {
    field: 'leaderDeductionSummation',
    label: '扣分',
    minWidth: '100px',
    formatter: (row: any) => {
      return h('span', row.leaderDeductionSummation ? row.leaderDeductionSummation : '--')
    }
  },
  {
    field: 'createTime',
    label: '创建时间',
    minWidth: '140px',
    formatter: (row: any) => {
      return h('span', row.createTime ? moment(row.createTime).format('YYYY-MM-DD HH:mm:ss') : '--')
    }
  },
  {
    field: 'action',
    fixed: 'right',
    minWidth: '180px',
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
    assessmentTime: moment(new Date()).format('YYYY-MM')
  }
})
const { getList, setSearchParams } = methods
//打开drawer并初始化

getList()

provide('getList', getList)
//搜索
const setSearchParamsSub = (param: any) => {
  params.assessmentTime = param.assessmentTime
    ? moment(new Date(param.assessmentTime)).format('YYYY-MM')
    : ''
  params.deptId = param.deptId ? param.deptId : ''
  setSearchParams(params)
}
// 重置
const reset = (param: any) => {
  unref(ElFormRef).setValues({ assessmentTime: '' })
  params.assessmentTime = ''
  params.deptId = ''
  setSearchParams(params)
}

// 查看
const action = (type, id) => {
  monthlyDetailsRef.value.openDrawer(type, id)
}

// 新增
const add = (type) => {
  monthlyDetailsRef.value.openDrawer(type)
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

const handle = () => {}
</script>
<style lang="less">
.project-overflow-drawer {
  .el-card {
    border: 0 !important;
  }
}
</style>
