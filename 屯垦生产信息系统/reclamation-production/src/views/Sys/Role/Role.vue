<script setup lang="ts">
import { getCurrentInstance, h, nextTick, reactive, ref, unref } from 'vue'
import { ElButton, ElMessageBox, ElSwitch, ElMessage } from 'element-plus'

import { Dialog } from '@/components/Dialog'
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Table } from '@/components/Table'
import {
  getRoleListApi,
  delRoleListApi,
  chageRoleStatusApi,
  dataScopeApi,
  getRoleDeptListApi,
  exportRoleListApi
} from '@/api/role'
import { RoleData, DeptTreeData } from '@/api/role/types'
import moment from 'moment'
import { isAuth } from '@/utils/is'
import { useTable } from '@/hooks/web/useTable'
import { useEmitt } from '@/hooks/web/useEmitt'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { TableColumn } from '@/types/table'
import { FormSchema } from '@/types/form'
import type { Tree } from './components/Tree'
import { RoleForm, UserTable, Write } from './components/index'

defineOptions({
  name: 'Role'
})

const { proxy } = getCurrentInstance() as any

const { register, tableObject, methods } = useTable<RoleData>({
  getListApi: getRoleListApi,
  delListApi: delRoleListApi,
  response: {
    list: 'rows', // 接口返回字段
    total: 'total',
    key: 'roleId'
  }
})

const { getList, setSearchParams } = methods

getList()

const roleFormRef = ref<ComponentRef<typeof RoleForm>>()
useEmitt({
  name: 'getRoleList',
  callback: (type: string) => {
    if (type === 'add') {
      tableObject.currentPage = 1
    }
    getList()
  }
})

const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'roleId',
    label: '序号',
    width: '60px',
    fixed: 'left',
    type: 'index'
  },
  {
    field: 'roleName',
    label: '角色名称',
    search: {
      show: true,
      componentProps: {
        style: 'width:200px;' //宽度
      }
    },
    formatter: (row: Recordable) => {
      return h('span', row.roleName ? row.roleName : '--')
    }
  },
  {
    field: 'roleKey',
    label: '权限字符',
    search: {
      show: false
    },
    formatter: (row: Recordable) => {
      return h('span', row.roleKey ? row.roleKey : '--')
    }
  },
  {
    field: 'roleSort',
    label: '显示顺序',
    formatter: (row: Recordable) => {
      return h('span', row.roleSort ? row.roleSort : '--')
    }
  },
  {
    field: 'createTime',
    minWidth: '120px',
    label: '创建时间',
    search: {
      show: false,
      component: 'DatePicker',
      componentProps: {
        type: 'daterange'
      }
    },
    formatter: (row: Recordable) => {
      return h('span', row.createTime ? row.createTime : '--')
    }
  },
  {
    field: 'action',
    width: '300px',
    label: '操作',
    fixed: 'right'
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)

//添加
const addAction = () => {
  nextTick(() => {
    roleFormRef.value?.openDrawer('add')
  })
}

//删除加载
const delLoading = ref(false)
//导出加载
const exLoading = ref(false)
//数据权限dialog
const dialogVisible = ref(false)
//确定
const sureLoading = ref(false)

//删除
const delData = async (row: RoleData | null, multiple: boolean) => {
  tableObject.currentRow = row
  const { delList, getSelections } = methods
  const selections = await getSelections()
  delLoading.value = true
  await delList(
    multiple ? selections.map((v) => v.roleId) : [tableObject.currentRow?.roleId as string],
    multiple
  ).finally(() => {
    delLoading.value = false
  })
}
//分配用户
const userTableRef = ref<ComponentRef<typeof UserTable>>()

//table操作栏按钮事件
const action = (row: RoleData, type: string) => {
  if (type === 'permission') {
    deptIds.value = []
    unref(writeRef)?.setSchema([
      {
        field: 'deptIds',
        path: 'componentProps.defaultCheckedKeys',
        value: deptIds.value
      }
    ])
    tableObject.currentRow = row
    dialogVisible.value = true
    getRoleDeptTreeData(row)
  } else if (type === 'user') {
    userTableRef.value?.openDrawer(row.roleId.toString())
  } else {
    nextTick(() => {
      roleFormRef.value?.openDrawer(type, row.roleId)
    })
  }
}

//角色启用和停用切换
const switchChange = (row: Recordable) => {
  if (row.admin) {
    ElMessage.error('禁止修改超级管理员角色的状态')
    return
  }
  let msg = ''
  let title = ''
  if (row.status === '0') {
    title = '角色停用提示'
    msg = '确认要停用"' + row.roleName + '"角色吗？'
  } else {
    title = '角色启用提示'
    msg = '确认要启用"' + row.roleName + '"角色吗？'
  }
  ElMessageBox.confirm(msg, title, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const params = {
      roleId: row.roleId,
      status: row.status === '0' ? '1' : '0'
    }
    const res = await chageRoleStatusApi(params)
    if (res) {
      nextTick()
      ElMessage.success(row.status === '0' ? '停用成功' : '启用成功')
      row.status = row.status === '0' ? '1' : '0'
      // getList()
    }
  })
}
const searchRef = ref<ComponentRef<typeof Search>>()
//导出
const exportForm = async () => {
  if (tableObject.tableList.length === 0) {
    ElMessage.warning('查询无数据, 无需导出数据')
    return
  }
  const param = await unref(searchRef)?.getFormData()
  exLoading.value = true
  await exportRoleListApi(param)
  exLoading.value = false
}

//分配数据权限
let treedata: DeptTreeData[] = []

//获取分配数据权限
const getRoleDeptTreeData = async (row: RoleData) => {
  const param = {
    id: row.roleId + '',
    status: '0'
  }
  const res = await getRoleDeptListApi(param)
  if (res) {
    deptIds.value = res.data.checkedKeys
    treedata = res.data.menus
    if (row.dataScope === '2') {
      setDeptTreeShow(false)
    } else {
      setDeptTreeShow(true)
    }
    setMenuTreeData()
  }
}

const writeRef = ref<ComponentRef<typeof Write>>()

//FormItem显示隐藏
const setDeptTreeShow = (value: boolean) => {
  nextTick(() => {
    unref(writeRef)?.setSchema([
      {
        field: 'deptIds',
        path: 'hidden',
        value: value
      }
    ])
  })
}

const setMenuTreeData = () => {
  nextTick(() => {
    unref(writeRef)?.setSchema([
      {
        field: 'deptIds',
        path: 'componentProps.data',
        value: treedata
      },
      {
        field: 'deptIds',
        path: 'componentProps.defaultCheckedKeys',
        value: deptIds.value
      }
    ])
    // unref(writeRef)?.setProps({
    //   deptIds: deptIds.value
    // })
  })
}

//已选择的部门Id
const deptIds = ref<number[]>([])

//部门勾选事件
const deptCheckChange = (_: Tree, status: any) => {
  deptIds.value = status.checkedKeys
}

//权限范围选择事件
const dataScopeChange = (val: string) => {
  if (val === '2') {
    setDeptTreeShow(false)
  } else {
    setDeptTreeShow(true)
  }
}

const fromSchemas = reactive<FormSchema[]>([
  {
    field: 'roleName',
    label: '角色名称',
    component: 'Input',
    componentProps: {
      disabled: true
    },
    colProps: {
      span: 24
    }
  },
  {
    field: 'roleKey',
    label: '权限字符',
    component: 'Input',
    componentProps: {
      disabled: true
    },
    colProps: {
      span: 24
    }
  },
  {
    field: 'dataScope',
    label: '权限范围',
    component: 'Select',
    colProps: {
      span: 24
    },
    componentProps: {
      onChange: dataScopeChange,
      options: [
        {
          label: '全部数据权限',
          value: '1'
        },
        {
          label: '自定数据权限',
          value: '2'
        },
        {
          label: '本部门数据权限',
          value: '3'
        },
        {
          label: '本部门及以下数据权限',
          value: '4'
        },
        {
          label: '仅本人数据权限',
          value: '5'
        }
      ],
      style: 'width:100%;',
      clearable: false
    }
  },
  {
    field: 'deptIds',
    label: '数据权限',
    component: 'Tree',
    hidden: true,
    colProps: {
      span: 24
    },
    componentProps: {
      onCheck: deptCheckChange,
      style: 'width:100%;',
      showCheckbox: true,
      data: treedata,
      nodeKey: 'id',
      defaultCheckedKeys: deptIds.value
    }
  }
])

//确认修改数据权限
const permissionSure = async () => {
  const write = unref(writeRef)
  const data = (await write?.getFormData()) as RoleData
  data.deptIds = deptIds.value
  sureLoading.value = true
  const res = await dataScopeApi(data)
    .catch(() => {})
    .finally(() => {
      sureLoading.value = false
    })
  if (res) {
    ElMessage.success('修改成功')
    dialogVisible.value = false
    getList()
  }
  // const param = Object.assign(data, { deptIds: deptIds.value })
}

//关闭数据权限dialog
const closePermissionDialog = () => {
  deptIds.value = []
  unref(writeRef)?.setSchema([
    {
      field: 'deptIds',
      path: 'hidden',
      value: true
    }
  ])
}

const params = reactive<Recordable>({
  roleName: undefined,
  rolekey: undefined,
  status: undefined,
  beginTime: undefined,
  endTime: undefined
})
const chooseListAll = ref([])
//搜索
const setSearchParamsSub = (param: Recordable) => {
  chooseListAll.value = []
  let beginTime = param.createTime ? moment(param.createTime[0]).format('YYYYMMDD') : undefined
  let endTime = param.createTime ? moment(param.createTime[1]).format('YYYYMMDD') : undefined
  params.roleName = param.roleName ? param.roleName : undefined
  params.rolekey = param.rolekey ? param.rolekey : undefined
  params.status = param.status ? param.status : undefined
  params.beginTime = beginTime
  params.endTime = endTime
  setSearchParams(params)
}
</script>

<template>
  <ContentWrap class="mt-7px mb-10px">
    <Search
      v-if="isAuth('system:role:query')"
      ref="searchRef"
      :schema="allSchemas.searchSchema"
      :chooseListAll="chooseListAll"
      @search="setSearchParamsSub"
      @reset="setSearchParamsSub"
    />
  </ContentWrap>
  <ContentWrap>
    <Table
      v-model:pageSize="tableObject.pageSize"
      v-model:currentPage="tableObject.currentPage"
      :columns="allSchemas.tableColumns"
      :data="tableObject.tableList"
      :loading="tableObject.loading"
      :border="true"
      :header-align="'center'"
      :align="'center'"
      :keyTable="'roleId'"
      :chooseListAll="chooseListAll"
      :pagination="{
        total: tableObject.total
      }"
      @register="register"
    >
      <template #operateBtnLeft>
        <ElButton type="primary" @click="addAction" v-hasPermi="'system:role:add'">
          <Icon icon="ep:plus" class="mr-5px" />新增
        </ElButton>
        <ElButton
          :loading="exLoading"
          type="primary"
          @click="exportForm()"
          plain
          v-hasPermi="'system:role:export'"
        >
          <Icon icon="ep:bottom" class="mr-5px" />导出
        </ElButton>
        <ElButton
          class="btn-default"
          :loading="delLoading"
          @click="delData(null, true)"
          plain
          v-hasPermi="'system:role:remove'"
        >
          <Icon icon="ep:delete" class="mr-5px" />删除
        </ElButton>
      </template>
      <template #action="{ row }">
        <ElButton
          type="text"
          @click="action(row, 'edit')"
          :text="true"
          v-show="!row.admin && isAuth('system:role:edit')"
        >
          编辑
        </ElButton>
        <ElButton type="text" @click="action(row, 'see')" :text="true"> 查看 </ElButton>
        <ElButton
          @click="delData(row, false)"
          type="text"
          :text="true"
          v-show="!row.admin && isAuth('system:role:remove')"
        >
          删除
        </ElButton>
        <ElButton
          type="text"
          @click="action(row, 'permission')"
          :text="true"
          v-show="!row.admin && isAuth('system:role:dataLimit')"
        >
          数据权限
        </ElButton>
        <!-- <ElButton
          type="primary"
          @click="action(row, 'user')"
          :text="true"
          size="small"
          v-show="!row.admin && isAuth('system:role:assignUser')"
        >
          <Icon icon="ep:user" class="mr-5px" />分配用户
        </ElButton> -->
        <!-- <ElPopover>
          <template #reference>
            <ElButton
              type="success"
              :text="true"
              size="small"
              v-show="!row.admin && isAuth('system:role:more')"
            >
              <Icon icon="ep:d-arrow-right" class="mr-5px" />更多
            </ElButton>
          </template>
          <div>
            <div class="justify-center">
              <ElButton
                @click="action(row, 'permission')"
                :text="true"
                size="small"
                class="w-[100%]"
              >
                <Icon icon="ep:circle-check" class="mr-5px" />数据权限
              </ElButton>
            </div>
            <div class="justify-center mt-5px">
              <ElButton @click="action(row, 'user')" :text="true" size="small" class="w-[100%]">
                <Icon icon="ep:user" class="mr-5px" />分配用户
              </ElButton>
            </div>
          </div>
        </ElPopover> -->
      </template>
    </Table>
  </ContentWrap>
  <RoleForm title="角色" ref="roleFormRef" @getRoleList="getList()" />

  <UserTable ref="userTableRef" />

  <Dialog v-model="dialogVisible" title="分配数据权限" @closed="closePermissionDialog">
    <Write ref="writeRef" :form-schema="fromSchemas" :current-row="tableObject.currentRow" />

    <template #footer>
      <ElButton type="primary" :loading="sureLoading" @click="permissionSure"> 确定 </ElButton>
      <ElButton @click="dialogVisible = false">取消</ElButton>
    </template>
  </Dialog>
</template>
