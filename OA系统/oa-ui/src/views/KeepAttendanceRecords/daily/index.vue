<template>
  <ContentWrap Showtitle="工作日报">
    <template #ContentWrapTitle>
      <div>
        <ElButton class="btn-add" @click="add('add')" plain v-hasPermi="'daily:list:add'">
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
          v-hasPermi="'daily:list:query'"
        />
      </template>
      <template #index="{ $index }">
        <span>{{
          $index + 1 + tableObject.pageSize * (tableObject.currentPage - 1)
        }}</span></template
      >
      <template #workDescribe="{ row }">
        <el-popover :width="600" placement="top">
          <template #reference>
            <div v-if="row.details.length" class="text-left">
              <p class="truncate" v-for="(item, index) in row.details" :key="index"
                >{{ index + 1 }}、{{ item.workDescribe }}</p
              >
            </div>
            <div v-else>--</div>
          </template>
          <template #default>
            <div class="max-h-140px overflow-auto text-12px leading-20px">
              <div v-if="row.details.length" class="text-left">
                <p v-for="(item, index) in row.details" :key="index"
                  >{{ index + 1 }}、{{ item.workDescribe }}</p
                >
              </div>
              <div v-else>--</div>
            </div>
          </template>
        </el-popover>
      </template>
      <template #action="{ row }">
        <ElButton class="btn-default" :text="true" size="small" @click="action('see', row.id)"
          >查看
        </ElButton>
        <ElButton
          class="btn-default"
          v-if="
            new Date().getDate() == new Date(row.createTime).getDate() &&
            wsCache.get('userInfo').nickName == row.createByName
          "
          :text="true"
          size="small"
          @click="action('edit', row.id)"
          >编辑
        </ElButton>
        <ElButton
          class="btn-default"
          v-hasPermi="'daily:list:delect'"
          v-if="
            new Date().getDate() == new Date(row.createTime).getDate() &&
            wsCache.get('userInfo').nickName == row.createByName
          "
          :text="true"
          size="small"
          @click="delData(row, false)"
          >删除
        </ElButton>
      </template>
    </Table>
    <DailyDetails ref="dailyDetailsRef" />
  </ContentWrap>
  <LimitDailog routerName="daily" />
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
import { getListApi, deleteByIdApi } from '@/api/assessment/daily'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import moment from 'moment'
import { isAuth } from '@/utils/is'
import DailyDetails from './dailyDetails.vue'
import { useCache } from '@/hooks/web/useCache'
import { LimitDailog } from '@/views/Components/limit'
const { wsCache } = useCache()
const dailyDetailsRef = ref()
const params = reactive<any>({
  workDate: '',
  createBy: ''
})

defineOptions({
  name: 'Daily'
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
    field: 'workDate',
    label: '时间',
    minWidth: '100px',
    table: {
      show: true
    },
    formatter: (row: any) => {
      return h('span', row.workDate ? moment(row.workDate).format('YYYY-MM-DD') : '--')
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
    field: 'title',
    label: '日报标题',
    minWidth: '120px',
    formatter: (row: any) => {
      return h('span', row.title ? row.title : '--')
    }
  },
  {
    field: 'workDescribe',
    label: '内容描述',
    minWidth: '180px',
    formatter: (row: any) => {
      return h('span', row.workDescribe ? row.workDescribe : '--')
    },
    showOverflowTooltip: false
  },
  {
    field: 'createBy',
    label: '创建人',
    minWidth: '100px',
    formatter: (row: any) => {
      return h('span', row.createByName ? row.createByName : '--')
    },
    search: {
      show: isAuth('daily:list:screen'),
      component: 'Cascader',
      componentProps: {
        placeholder: '创建人筛选',
        filterable: true,
        options: principalTree,
        style: 'width: 196px',
        props: {
          label: 'deptName',
          value: 'deptId'
        }
      }
    }
  },
  {
    field: 'deptName',
    label: '部门',
    minWidth: '100px',
    formatter: (row: any) => {
      return h('span', row.deptName ? row.deptName : '--')
    }
  },
  {
    field: 'action',
    fixed: 'right',
    minWidth: '135px',
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
    workDate: moment(new Date()).format('YYYY-MM')
  }
  // props: {
  //   workDate: moment(new Date()).format('YYYY-MM')
  // }
})
const { getList, setSearchParams } = methods
//打开drawer并初始化

getList()

const ElTableRef = ref()
const ElFormRef = ref()
provide('getList', getList)
//搜索
const setSearchParamsSub = (param: any) => {
  params.workDate = param.workDate ? moment(param.workDate).format('YYYY-MM') : ''
  params.createBy = param.createBy ? param.createBy[param.createBy.length - 1] : ''
  setSearchParams(params)
}
// 重置
const reset = (param: any) => {
  unref(ElFormRef).setValues({ workDate: '' })
  params.workDate = ''
  params.createBy = ''
  setSearchParams(params)
}
// 查看
const action = (type, id) => {
  dailyDetailsRef.value.openDrawer(type, id)
}

// 新增
const add = (type) => {
  dailyDetailsRef.value.openDrawer(type)
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
</script>
<style lang="less">
.project-overflow-drawer {
  .el-card {
    border: 0 !important;
  }
}
</style>
