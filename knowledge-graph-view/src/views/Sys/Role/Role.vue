<script setup lang="ts">
import { RoleForm, UserTable, Write } from './components/index'
import { Dialog } from '@/components/Dialog'
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { useI18n } from '@/hooks/web/useI18n'
import { ElButton, ElMessageBox, ElSwitch, ElPopover, ElMessage } from 'element-plus'
import { Table } from '@/components/Table'
import {
  getRoleListApi,
  delRoleListApi,
  chageRoleStatusApi,
  dataScopeApi,
  getRoleDeptListApi,
  exportRoleListApi
} from '@/api/role'
import { useTable } from '@/hooks/web/useTable'
import { RoleData, DeptTreeData } from '@/api/role/types'
import { getCurrentInstance, h, nextTick, reactive, ref, unref } from 'vue'
import { useEmitt } from '@/hooks/web/useEmitt'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { TableColumn } from '@/types/table'
import { FormSchema } from '@/types/form'
import type { Tree } from './components/Tree'
import moment from 'moment'
import { isAuth } from '@/utils/is'

defineOptions({
  name: 'Role'
})

const { proxy } = getCurrentInstance() as any
const { sys_normal_disable } = proxy.useDict('sys_normal_disable')

const { register, tableObject, methods } = useTable<RoleData>({
  getListApi: getRoleListApi,
  delListApi: delRoleListApi,
  response: {
    list: 'rows', // 接口返回字段
    total: 'total'
  }
})

const { getList, setSearchParams } = methods

getList()

const roleFormRef = ref<ComponentRef<typeof RoleForm>>()

const { emitter } = useEmitt({
  name: 'getList',
  callback: (type: string) => {
    if (type === 'add') {
      tableObject.currentPage = 1
    }
    getList()
  }
})

const { t } = useI18n()

const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'id',
    label: '序号',
    minWidth: '70px',
    table: {
      show: true
    },
    formatter: (row: Recordable) => {
      return h('span', row.id ? row.id : '--')
    }
  },
  {
    field: 'roleName',
    label: '角色名称',
    search: {
      show: true,
      label: undefined,
      componentProps: {
        placeholder: '角色名称筛选',
        style: 'width: 196px'
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
      show: true,
      componentProps: {
        placeholder: '权限字符筛选',
        style: 'width: 196px'
      }
    },
    formatter: (row: Recordable) => {
      return h('span', row.roleKey ? row.roleKey : '--')
    }
  },
  {
    field: 'roleSort',
    label: '显示顺序',
    formatter: (row: Recordable) => {
      return h('span', String(row.roleSort) ? String(row.roleSort) : '--')
    }
  },
  {
    field: 'status',
    label: '角色状态',
    formatter: (row: Recordable, __: TableColumn, cellValue: string) => {
      return h(
        ElSwitch,
        {
          modelValue: cellValue === '0' ? true : false,
          //   style: '--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949',
          onClick: () => {
            switchChange(row)
          }
        },
        () => (cellValue === '0' ? true : false)
      )
    },
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        placeholder: '角色状态筛选',
        style: 'width: 196px',
        options: sys_normal_disable
      }
    }
  },
  {
    field: 'createTime',
    minWidth: '120px',
    label: '创建时间',
    search: {
      show: true,
      component: 'DatePicker',
      componentProps: {
        type: 'daterange',
        startPlaceholder: '创建开始时间',
        endPlaceholder: '创建结束时间'
      }
    },
    formatter: (row: Recordable) => {
      return h('span', row.createTime ? row.createTime : '--')
    }
  },
  {
    field: 'action',
    showOverflowTooltip: false,
    minWidth: '180px',
    fixed: 'right',
    label: '操作'
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)

//添加
const AddAction = () => {
  roleFormRef.value.openDrawer('add')
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
const ElDialogFef = ref()
//table操作栏按钮事件
const action = (row: RoleData, type: string) => {
  if (type === 'permission') {
    if (row.dataScope === '2') {
    }
    tableObject.currentRow = row
    dialogVisible.value = true
    ElDialogFef.value.isFullscreen = false
    getRoleDeptTreeData(row)
  } else if (type === 'user') {
    userTableRef.value.openDrawer(row.roleId.toString())
  } else {
    roleFormRef.value.openDrawer(type, row.roleId)
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
    type: 'warning',
    autofocus: false
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

//导出
const exportForm = async () => {
  if (tableObject.tableList.length === 0) {
    ElMessage.warning('查询无数据, 无需导出数据')
    return
  }
  exLoading.value = true
  await exportRoleListApi(params)
  exLoading.value = false
}

//分配数据权限
let treedata: DeptTreeData[] = []

//获取分配数据权限
const getRoleDeptTreeData = async (row: RoleData) => {
  const res = await getRoleDeptListApi(row.roleId + '')
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
  })
}

//已选择的部门Id
const deptIds = ref<number[]>([])

//部门勾选事件
const deptCheckChange = (data: Tree, status: any) => {
  deptIds.value = status.checkedKeys
  setMenuTreeData()
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
}

const params = reactive<Recordable>({
  roleName: '',
  roleKey: '',
  status: '',
  beginTime: '',
  endTime: ''
})

//搜索
const setSearchParamsSub = (param: Recordable) => {
  let beginTime = param.createTime ? moment(param.createTime[0]).format('YYYYMMDD') : ''
  let endTime = param.createTime ? moment(param.createTime[1]).format('YYYYMMDD') : ''
  params.roleName = param.roleName ? param.roleName : ''
  params.roleKey = param.roleKey ? param.roleKey : ''
  params.status = param.status ? param.status : ''
  params.beginTime = beginTime
  params.endTime = endTime

  setSearchParams(params)
}

// 是否显示筛选窗口
const isShowCell = ref(false)

// 筛选列
const showCell = () => {
  isShowCell.value = !isShowCell.value
}
</script>

<template>
  <ContentWrap :isShowtitle="false">
    <Table
      v-model:pageSize="tableObject.pageSize"
      v-model:currentPage="tableObject.currentPage"
      :columns="allSchemas.tableColumns"
      :data="tableObject.tableList"
      :loading="tableObject.loading"
      :isShowCell="isShowCell"
      :header-align="'center'"
      :cotentAlign="'center'"
      :pagination="{
        total: tableObject.total
      }"
    >
      <template #operateBtnLeft>
        <Search
          v-if="isAuth('system:role:query')"
          :schema="allSchemas.searchSchema"
          @search="setSearchParamsSub"
          @reset="setSearchParamsSub"
        />
      </template>
      <template #operateBtnRight>
        <ElButton class="no-bg-button" @click="AddAction" plain v-hasPermi="'system:role:add'">
          <template #icon>
            <Icon :size="14" icon="svg-icon:addBut" />
          </template>
          新增
        </ElButton>

        <ElButton
          :loading="exLoading"
          class="no-bg-button"
          @click="exportForm()"
          plain
          v-hasPermi="'system:role:export'"
        >
          <template #icon>
            <Icon :size="14" icon="svg-icon:exportBut" />
          </template>
          导出
        </ElButton>
        <ElButton
          :loading="delLoading"
          class="no-bg-button"
          @click="delData(null, true)"
          plain
          v-hasPermi="'system:role:remove'"
        >
          <template #icon>
            <Icon :size="14" icon="svg-icon:deleteBut" />
          </template>
          删除
        </ElButton></template
      >
      <template #id="{ $index }">
        <span>{{
          $index + 1 + tableObject.pageSize * (tableObject.currentPage - 1)
        }}</span></template
      >
      <template #action="{ row }">
        <ElButton
          class="btn-default"
          @click="action(row, 'edit')"
          :text="true"
          size="small"
          v-if="!row.admin && isAuth('system:role:edit')"
        >
          编辑
        </ElButton>
        <!-- <ElButton type="success" @click="action(row, 'see')" :text="true">
          <Icon icon="ep:warning" class="mr-5px" />详情
        </ElButton> -->
        <ElButton
          class="btn-default"
          @click="delData(row, false)"
          :text="true"
          size="small"
          v-if="!row.admin && isAuth('system:role:remove')"
        >
          删除
        </ElButton>
        <ElPopover>
          <template #reference>
            <ElButton
              class="btn-default"
              :text="true"
              size="small"
              v-if="!row.admin && isAuth('system:role:more')"
            >
              更多
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
        </ElPopover>
      </template>
    </Table>
  </ContentWrap>

  <RoleForm title="角色" ref="roleFormRef" />

  <UserTable ref="userTableRef" />

  <Dialog
    ref="ElDialogFef"
    v-model="dialogVisible"
    title="分配数据权限"
    @closed="closePermissionDialog"
  >
    <Write ref="writeRef" :form-schema="fromSchemas" :current-row="tableObject.currentRow" />

    <template #footer>
      <ElButton type="primary" :loading="sureLoading" @click="permissionSure"> 确定 </ElButton>
      <ElButton @click="dialogVisible = false">取消</ElButton>
    </template>
  </Dialog>
</template>
