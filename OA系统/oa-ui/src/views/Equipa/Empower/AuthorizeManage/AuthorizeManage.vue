<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { ElButton, ElMessageBox, ElTag, ElMessage } from 'element-plus'
import { Table } from '@/components/Table'
import { useTable } from '@/hooks/web/useTable'
import { getCurrentInstance, h, reactive, ref, onMounted, computed } from 'vue'
import { useEmitt } from '@/hooks/web/useEmitt'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { TableColumn } from '@/types/table'
import moment from 'moment'
import { isAuth } from '@/utils/is' // 鉴权
import { useCache } from '@/hooks/web/useCache'
import { LimitDailog } from '@/views/Components/limit'
import { FormSchema } from '@/types/form'
import { getAllUserListApi } from '@/api/user' // 获取所有用户
import { getAllDeptListApi } from '@/api/sys/dept' // 获取所有部门
import { listToTree } from '@/utils/tree'
import {
  getAuthorizeManageListApi,
  delAuthorizeManageListApi,
  authAuthorizeManageApi,
  publishAuthorizeManageApi,
  withdrawAuthorizeManageApi,
  downloadAuthorizeApi
} from '@/api/empower'
import { AuthorizeApplyForm, ServerReportForm, AuthorizeDetailForm } from '../Form'

defineOptions({
  name: 'AuthorizeManage'
})

useEmitt({
  name: 'authorize',
  callback: (type: string) => {
    if (type === 'refresh') {
      tableObject.currentPage = 1
    }
    getList()
  }
})

//部门数据
let deptData = ref<any>([])
const filiteDeptData = ref<any>([])
//人员数据
const userData = ref<any>([])
//部门人员整合后的数据
const principalTree = ref<any>([])
//获取所有用户
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

const { wsCache } = useCache()
const loginUserId = ref<string>(wsCache.get('userInfo').userId) // 登录用户id
const isLeader = computed(() => {
  let flag = false
  if (wsCache.get('userInfo')) {
    if (wsCache.get('userInfo').dept.leader == wsCache.get('userInfo').userId) {
      flag = true
    }
  }
  return flag
})

const { register, tableObject, methods } = useTable<any>({
  getListApi: getAuthorizeManageListApi,
  delListApi: delAuthorizeManageListApi,
  response: {
    list: 'rows',
    total: 'total'
  }
})

const { getList, setSearchParams } = methods

getList()
const { emitter } = useEmitt()
useEmitt({
  name: 'authorize',
  callback: (type: string) => {
    if (type === 'refresh') {
      tableObject.currentPage = 1
    }
    getList()
  }
})

//平台名称集合
const platformArray = ref<any>([{ value: '1', label: '测试' }])
// 状态 1未发布 2待审核 3部门经理已审核 4研发负责人已审核 5总经理已审核 6已驳回
const projectStatus = ref<any>([
  {
    label: '未发布',
    value: '1'
  },
  {
    label: '待审核',
    value: '2'
  },
  {
    label: '审核中',
    value: '3'
  },
  {
    label: '已审核',
    value: '5'
  },
  {
    label: '已驳回',
    value: '6'
  }
])

//列表属性
const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'index',
    label: '序号',
    minWidth: '55px'
  },
  {
    field: 'systemName',
    minWidth: '120px',
    label: '平台名称',
    formatter: (row: Recordable) => {
      return h('span', row.systemName ? row.systemName : '--')
    },
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        placeholder: '平台名称筛选',
        style: 'width: 11vw'
      }
    }
  },
  {
    field: 'type',
    label: '类型',
    minWidth: '60px',
    formatter: (row: Recordable, __: TableColumn, cellValue: string) => {
      return h(
        'span',
        row.type === 'agriculture_projects'
          ? '农业'
          : row.type === 'railway_projects'
          ? '铁路'
          : row.type === 'military_projects'
          ? '军工'
          : row.type === 'other_projects'
          ? '其他'
          : '--'
      )
    }
  },
  {
    field: 'punter',
    label: '客户名称',
    minWidth: '120px',
    formatter: (row: Recordable, __: TableColumn, cellValue: string) => {
      return h('span', row.punter ? row.punter : '--')
    }
  },
  {
    field: 'days',
    minWidth: '120px',
    label: '授权期限（天）',
    formatter: (row: Recordable) => {
      return h('span', row.days ? row.days : '--')
    }
  },
  {
    field: 'status',
    label: '状态',
    minWidth: '100px',
    formatter: (row: Recordable, __: TableColumn, cellValue: string) => {
      return h(
        ElTag,
        {
          type:
            cellValue === '1'
              ? 'info'
              : cellValue === '2'
              ? 'warning'
              : cellValue === '3' || cellValue === '4'
              ? 'success'
              : cellValue === '6'
              ? 'danger'
              : cellValue === '5'
              ? 'primary'
              : 'danger'
        },
        () =>
          cellValue === '1'
            ? '未发布'
            : cellValue === '2'
            ? '待审核'
            : cellValue === '3' || cellValue === '4'
            ? '审核中'
            : cellValue === '6'
            ? '已驳回'
            : cellValue === '5'
            ? '已审核'
            : '--'
      )
    },
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        placeholder: '状态筛选',
        style: 'width: 11vw',
        filterable: true,
        options: projectStatus
      }
    }
  },
  {
    field: 'createByName',
    minWidth: '90px',
    label: '申请人',
    formatter: (row: Recordable) => {
      return h('span', row.createByName ? row.createByName : '--')
    },
    search: {
      show: true,
      component: 'Cascader',
      componentProps: {
        placeholder: '申请人筛选',
        filterable: true,
        options: principalTree,
        style: 'width: 11vw',
        props: {
          label: 'deptName',
          value: 'deptId'
        }
      }
    }
  },
  {
    field: 'createTime',
    minWidth: '160px',
    label: '申请时间',
    formatter: (row: Recordable) => {
      return h('span', row.createTime ? moment(row.createTime).format('YYYY-MM-DD HH:mm:ss') : '--')
    },
    search: {
      show: true,
      component: 'DatePicker',
      componentProps: {
        style: 'width:16vw',
        type: 'daterange', // 组件type属性+
        format: 'YYYY-MM-DD',
        startPlaceholder: '开始时间',
        endPlaceholder: '结束时间'
      }
    }
  },
  {
    field: 'auditByName',
    minWidth: '90px',
    label: '审核人',
    formatter: (row: Recordable) => {
      return h('span', row.auditByName ? row.auditByName : '--')
    }
  },
  {
    field: 'auditTime',
    minWidth: '160px',
    label: '审核时间',
    formatter: (row: Recordable) => {
      return h('span', row.auditTime ? moment(row.auditTime).format('YYYY-MM-DD HH:mm:ss') : '--')
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

//查询参数
const params = reactive<Recordable>({
  systemName: '',
  status: '',
  createBy: '',
  createStartTime: '',
  createEndTime: ''
})

//搜索
const setSearchParamsSub = (param: Recordable) => {
  params.systemName = param.systemName ? param.systemName : null
  params.status = param.status ? param.status : null
  params.createBy = param.createByName ? param.createByName[param.createByName.length - 1] : null
  params.createStartTime = param.createTime
    ? moment(param.createTime[0]).format('YYYY-MM-DD') + ' 00:00:00'
    : null
  params.createEndTime = param.createTime
    ? moment(param.createTime[1]).format('YYYY-MM-DD') + ' 23:59:59'
    : null
  setSearchParams(params)
}

//详情
const authorizeApplyFormRef = ref<ComponentRef<typeof AuthorizeApplyForm>>()
const serverReportFormRef = ref<ComponentRef<typeof ServerReportForm>>()
const authorizeDetailFormRef = ref<ComponentRef<typeof AuthorizeDetailForm>>()
const action = (row: any, type: string) => {
  if (type == 'add') {
    authorizeApplyFormRef.value.openDrawer('', type)
  } else if (type == 'server') {
    serverReportFormRef.value.openDrawer(row,type)
  } else if (type == 'see') {
    if (row.status == '1') {
      authorizeApplyFormRef.value.openDrawer(row.id, type)
    } else {
      authorizeDetailFormRef.value.openDrawer(row.id, type)
    }
  } else if (type == 'approve') {
    authorizeDetailFormRef.value.openDrawer(row.id, type)
  } else if (type == 'edit') {
    authorizeApplyFormRef.value.openDrawer(row.id, type)
  } else if (type == 'release') {
    releaseApply(row.id)
  } else if (type == 'approve') {
    authorizeDetailFormRef.value.openDrawer(row.id, type)
  } else if (type == 'withdraw') {
    withdrawApply(row.id)
  } else if (type == 'download') {
    downloadFile(row)
  } else if (type == 'serverAgain') {
    serverReportFormRef.value.openDrawer(row,type)
  } 
}

//下载授权文件
const downloadFile = async (row: any) => {
  if (row.fileUrl) {
    await downloadAuthorizeApi(row.fileUrl, row.systemName)
  } else {
    ElMessage.error('未找到授权文件')
  }
}

//发布
const releaseApply = async (val: any) => {
  const res = await publishAuthorizeManageApi({ id: val })
  if (res) {
    ElMessage.success('发布信息成功')
    getList()
  }
}

//撤回
const withdrawApply = async (val: any) => {
  const res = await withdrawAuthorizeManageApi({ id: val })
  if (res) {
    ElMessage.success('撤回申请成功')
    getList()
  }
}

//删除
const delData = async (row: any, multiple: boolean) => {
  tableObject.currentRow = row
  const { delList, getSelections } = methods
  const selections = await getSelections()
  await delList(
    multiple ? selections.map((v) => v.id) : [tableObject.currentRow?.id as string],
    multiple
  )
}

//判断当前登录人是否是平台实施人员
const checkImplement = (row: any) => {
  if (row.users) {
    let flag = row.users.some((v: any) => {
      return v.userId == loginUserId.value
    })
    return flag
  } else {
    return false
  }
}
</script>

<template>
  <ContentWrap Showtitle="授权管理">
    <Table
      v-model:pageSize="tableObject.pageSize"
      v-model:currentPage="tableObject.currentPage"
      :columns="allSchemas.tableColumns"
      :data="tableObject.tableList"
      :loading="tableObject.loading"
      :border="true"
      :selection="false"
      :isShowCell="isShowCell"
      :header-align="'center'"
      :cotentAlign="'center'"
      :pagination="{
        total: tableObject.total
      }"
      @register="register"
    >
      <template #operateBtnLeft>
        <Search
          v-if="isAuth('authorize:manage:query')"
          :schema="allSchemas.searchSchema"
          @search="setSearchParamsSub"
          @reset="setSearchParamsSub"
        />
      </template>
      <template #operateBtnRight>
        <div class="mr-[10px]" v-if="isAuth('authorize:manage:apply')">
          <ElButton class="btn-add" @click="action(null, 'add')" plain>
            <template #icon> <Icon :size="14" icon="svg-icon:addBut" /> </template>
            授权申请
          </ElButton>
        </div>
      </template>
      <template #index="{ $index }">
        <span>{{
          $index + 1 + tableObject.pageSize * (tableObject.currentPage - 1)
        }}</span></template
      >
      <template #action="{ row }">
        <ElButton
          class="btn-default"
          :text="true"
          @click="action(row, 'see')"
          v-if="isAuth('authorize:manage:detail')"
        >
          详情
        </ElButton>
        <ElButton
          class="btn-default"
          :text="true"
          @click="action(row, 'edit')"
          v-if="
            isAuth('authorize:manage:edit') &&
            (row.status === '1' || row.status === '6') &&
            loginUserId == row.createBy
          "
        >
          编辑
        </ElButton>
        <ElButton
          class="btn-default"
          :text="true"
          @click="action(row, 'release')"
          v-if="isAuth('authorize:manage:edit') && row.status == '1' && loginUserId == row.createBy"
        >
          发布
        </ElButton>
        <ElButton
          class="btn-default"
          :text="true"
          @click="action(row, 'approve')"
          v-if="isAuth('authorize:manage:audit') && row.audit"
        >
          审核
        </ElButton>
        <ElButton
          class="btn-default"
          :text="true"
          @click="delData(row, false)"
          v-if="
            isAuth('authorize:manage:delete') &&
            (row.status == '1' || row.status == '6') &&
            loginUserId == row.createBy
          "
        >
          删除
        </ElButton>
        <ElButton
          class="btn-default"
          :text="true"
          @click="action(row, 'withdraw')"
          v-if="
            isAuth('authorize:manage:withdraw') && row.status === '2' && loginUserId == row.createBy
          "
        >
          撤回
        </ElButton>

        <ElButton
          class="btn-default"
          :text="true"
          @click="action(row, 'server')"
          v-if="
            isAuth('authorize:manage:authorize') &&
            row.status === '5' &&
            !row.fileUrl &&
            (checkImplement(row) || loginUserId == row.createBy)
          "
        >
          生成授权
        </ElButton>

        <ElButton
          class="btn-default"
          :text="true"
          @click="action(row, 'download')"
          v-if="
            isAuth('authorize:manage:download') &&
            row.status === '5' &&
            row.fileUrl &&
            (checkImplement(row) || loginUserId == row.createBy)
          "
        >
          下载
        </ElButton>

        <ElButton
          class="btn-default"
          :text="true"
          @click="action(row, 'serverAgain')"
          v-if="
            isAuth('authorize:manage:authorize') &&
            row.status === '5' &&
            row.fileUrl &&
            (checkImplement(row) || loginUserId == row.createBy)
          "
        >
          重新授权
        </ElButton>
      </template>
    </Table>
  </ContentWrap>
  <AuthorizeApplyForm ref="authorizeApplyFormRef" title="授权申请" />
  <AuthorizeDetailForm ref="authorizeDetailFormRef" title="授权申请" />
  <ServerReportForm ref="serverReportFormRef" />
  <LimitDailog routerName="Feedback" />
</template>
