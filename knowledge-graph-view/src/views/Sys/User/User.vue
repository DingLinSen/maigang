<script setup lang="ts">
import UserForm from './components/UserForm.vue'
import { Dialog } from '@/components/Dialog'
import PassWord from './components/PassWord.vue'
import RoleTable from './components/RoleTable.vue'
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { useI18n } from '@/hooks/web/useI18n'
import type { DeptTreeData, UserData } from '@/api/user/types'
import { isAuth } from '@/utils/is'
import moment from 'moment'
import { ElButton, ElMessageBox, ElMessage, ElRow, ElTag, ElCol } from 'element-plus'
import { Table } from '@/components/Table'
import { Tree } from '@/components/Tree'
// import { getTableListApi, delTableListApi } from '@/api/table'
import {
  getUserListApi,
  delUserListApi,
  getUserDeptListApi,
  exportUserListApi,
  resetPassWord,
  chageUserStatusApi
} from '@/api/user'
import { useValidator } from '@/hooks/web/useValidator'
import { useTable } from '@/hooks/web/useTable'
import { TableData } from '@/api/table/types'
import { useAppStore } from '@/store/modules/app'
import { h, reactive, ref, unref, nextTick, onMounted, computed } from 'vue'
import { useEmitt } from '@/hooks/web/useEmitt'
import { FormSchema } from '@/types/form'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { TableColumn } from '@/types/table'

defineOptions({
  name: 'User'
})

const addAuth = ref(['example:dialog:delete'])
const cellAlgin = ref({
  textAlign: 'center'
})
const UserId = ref<any>()
const appStore = useAppStore()

// 视窗高度
const documentClientHeight = computed(() => appStore.getDocumentClientHeight)

const { required } = useValidator()

// 左侧树形数据
const treedata = ref<DeptTreeData>([])

const PassWordRef = ref<ComponentRef<typeof PassWord>>()

//确定
const sureLoading = ref(false)

const { register, tableObject, methods } = useTable<TableData>({
  getListApi: getUserListApi,
  delListApi: delUserListApi,
  response: {
    list: 'rows',
    total: 'total'
  }
})

const { getList, setSearchParams } = methods

// 获取部门树
const getDeptTreeList = async () => {
  try {
    const res = await getUserDeptListApi({ status: '0' }).finally(() => {
      delLoading.value = false
    })
    treedata.value = res.data
  } catch (err) {
    console.log(err)
  }
}

getDeptTreeList()
getList()

//导出加载
const exLoading = ref(false)
const deptId = ref()
const params = reactive<Recordable>({
  deptId: undefined,
  userName: '',
  phonenumber: '',
  status: ''
  // params: paramsMap
})

//搜索
const setSearchParamsSub = (param: Recordable) => {
  let beginTime = param.createTime ? moment(param.createTime[0]).format('YYYYMMDD') : ''
  let endTime = param.createTime ? moment(param.createTime[1]).format('YYYYMMDD') : ''
  // const params = beginTime ? { params: { beginTime: beginTime, endTime: endTime } } : {}
  // paramsSub = Object.assign({}, {
  //   roleName: param.roleName ? param.roleName : '',
  //   rolekey: param.rolekey ? param.rolekey : '',
  //   status: param.status ? param.status : ''
  // })
  console.log('params', params)
  params.beginTime = beginTime
  params.endTime = endTime
  params.deptId = deptId.value
  params.userName = param.userName ? param.userName : ''
  params.phonenumber = param.phonenumber ? param.phonenumber : ''
  params.status = param.status ? param.status : ''
  // paramsSub.params = beginTime ? { beginTime: beginTime, endTime: endTime } : null
  setSearchParams(params)
}

const userFormRef = ref<ComponentRef<typeof UserForm>>()

const { emitter } = useEmitt({
  name: 'getList',
  callback: (type: string) => {
    if (type === 'add') {
      tableObject.currentPage = 1
    }
    getList()
  }
})

useEmitt({
  name: 'window',
  callback: (type: string) => {
    if (type === 'resize') {
      resetTableHeight()
    }
  }
})

//搜索项
const searchRef = ref()
const defaultHeight = ref<number>(0)
const resetTableHeight = () => {
  const overView = getOverViewWrapper('.overView')
  const overViewWrapper = getOverViewWrapper('#v-tags-view')
  const footer = getOverViewWrapper('.v-footer')
  const trigger = getOverViewWrapper('.hover-trigger-view')
  console.log(documentClientHeight.value)
  nextTick(() => {
    defaultHeight.value =
      documentClientHeight.value - overViewWrapper - overView - trigger - footer - 84 - 10
  })
}
const getOverViewWrapper = (dom: string): number => {
  let topH = 0
  const checkboxWrapper = document.querySelector(dom)
  if (checkboxWrapper) {
    topH = checkboxWrapper.clientHeight
  }
  return topH
}
const { t } = useI18n()

// 是否显示筛选窗口
const isShowCell = ref(false)

// 表格列
const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'userId',
    label: '用户编号',
    minWidth: '70px',
    table: {
      show: true
    },
    formatter: (row: Recordable) => {
      return h('span', row.userId ? row.userId : '--')
    }
  },
  {
    field: 'userName',
    label: '用户名',
    minWidth: '100px',
    table: {
      show: true
    },
    search: {
      show: true,
      componentProps: {
        placeholder: '用户名筛选',
        style: 'width: 196px'
      }
    },
    formatter: (row: Recordable) => {
      return h('span', row.userName ? row.userName : '--')
    }
  },
  {
    field: 'nickName',
    label: '用户昵称',
    minWidth: '100px',
    table: {
      show: true
    },
    search: {
      show: false,
      componentProps: {
        placeholder: '用户昵称筛选'
      }
    },
    formatter: (row: Recordable) => {
      return h('span', row.nickName ? row.nickName : '--')
    }
  },
  {
    field: 'deptName',
    label: '部门',
    minWidth: '100px',
    table: {
      show: true
    },
    search: {
      show: false,
      componentProps: {
        placeholder: '部门筛选'
      }
    },
    formatter: (row: Recordable) => {
      return h('span', row.dept.deptName ? row.dept.deptName : '--')

      // let val:String = row.deptName

      // if(!row.deptName || row.deptName=== undefined || row.deptName=== null || row.deptName ==='' ){
      //   val = '--'
      // }

      // return h(ElLink ,{

      // } , val)
    }
  },
  {
    field: 'phonenumber',
    label: '手机号码',
    minWidth: '110px',
    table: {
      show: true
    },
    search: {
      show: true,
      componentProps: {
        style: 'width: 196px',
        placeholder: '手机号码筛选'
      }
    },
    formatter: (row: Recordable) => {
      return h('span', row.phonenumber ? row.phonenumber : '--')
    }
  },
  {
    field: 'status',
    label: '状态',
    minWidth: '80px',
    table: {
      show: true
    },
    formatter: (row: Recordable, __: TableColumn, cellValue: string) => {
      return h(
        ElTag,
        {
          type: cellValue === '0' ? 'success' : cellValue === '1' ? 'error' : 'danger'
        },
        () => (cellValue === '0' ? '正常' : '停用')
      )
    },
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        placeholder: '状态筛选',
        options: [
          {
            label: '正常',
            value: 0
          },
          {
            label: '停用',
            value: 1
          }
        ]
      }
    }
  },
  {
    field: 'createTime',
    minWidth: '120px',
    label: '创建时间',
    table: {
      show: true
    },
    search: {
      show: true,
      component: 'DatePicker',
      componentProps: {
        type: 'daterange', // 组件type属性+
        format: 'YYYY-MM-DD',
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
    minWidth: '180px',
    showOverflowTooltip: false,
    table: {
      show: true
    },
    fixed: 'right',
    label: '操作'
  }
])

// 重置密码表单项
const fromSchemas = reactive<FormSchema[]>([
  {
    field: 'password',
    label: '新密码',
    component: 'Input',
    componentProps: {
      // disabled: true
    },
    colProps: {
      span: 24
    },
    formItemProps: {
      // 表单校验
      rules: [required()]
    }
  }
])
const { allSchemas } = useCrudSchemas(crudSchemas)

// 筛选列
const showCell = () => {
  isShowCell.value = !isShowCell.value
}

const AddAction = () => {
  userFormRef.value.openDrawer('add', '')
}
const treeTitle = ref('')
// 全部树形图返回数据
const changeAlltree = (val: any, name: any) => {
  deptId.value = val
  treeTitle.value = name
  getDeptTreeList()
  // params = ob
  searchRef.value.getFormData().then((result: any) => setSearchParamsSub(result))
}
// 树形图返回数据
const TreeClick = (val: any, name: any) => {
  deptId.value = val
  treeTitle.value = name
  searchRef.value.getFormData().then((result: any) => setSearchParamsSub(result))
  // params = ob
}
const visible = ref(false)

//删除加载
const delLoading = ref(false)

// 删除
const delData = async (row: TableData | null, multiple: boolean) => {
  console.log(row)

  tableObject.currentRow = row
  const { delList, getSelections } = methods
  const selections = await getSelections()
  console.log(selections)
  console.log(selections)

  delLoading.value = true
  await delList(
    multiple ? selections.map((v) => v.userId) : [tableObject.currentRow?.userId as string],
    multiple
  ).finally(() => {
    delLoading.value = false
  })
}

// 分配角色
const roleTableRef = ref<ComponentRef<typeof RoleTable>>()
//table操作栏按钮事件
const action = (row: TableData, type: string) => {
  if (type === 'resetPwd') {
    UserId.value = row.userId
    tableObject.currentRow = row
    dialogVisible.value = true
  } else if (type === 'role') {
    roleTableRef.value.openDrawer(row.userId)
  } else {
    userFormRef.value.openDrawer(type, row.userId)
  }
}

//重置密码dialog
const dialogVisible = ref(false)

//关闭用户密码dialog
const closePermissionDialog = () => {
  // deptIds.value = []
}

//确认重置密码
const resetPwdSure = async () => {
  const password = unref(PassWordRef)

  const elFormRef = password?.elFormRef
  // await elFormRef?.validate(async (isValid) => {
  //   console.log(isValid)
  //   if (isValid) {
  // const data = (await password?.getFormData()) as UserData
  sureLoading.value = true
  const res = await resetPassWord({ userId: UserId.value, password: '123456' })
    .catch(() => {})
    .finally(() => {
      sureLoading.value = false
    })
  if (res) {
    ElMessage.success('重置密码成功')
    dialogVisible.value = false
    getList()
  }
  //   }
  // })
}

//导出
const exportForm = async () => {
  if (tableObject.tableList.length === 0) {
    ElMessage.warning('查询无数据, 无需导出数据')
    return
  }
  exLoading.value = true
  await exportUserListApi(params)
  exLoading.value = false
}

const switchChange = (row: Recordable) => {
  if (row.admin) {
    ElMessage.error('禁止修改超级管理员用户的状态')
    return
  }
  let msg = ''
  let title = ''
  if (row.status === '0') {
    title = '用户停用提示'
    msg = '确认要停用"' + row.userName + '"用户吗？'
  } else {
    title = '用户启用提示'
    msg = '确认要启用"' + row.userName + '"用户吗？'
  }
  ElMessageBox.confirm(msg, title, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    autofocus: false
  }).then(async () => {
    const params = {
      userId: row.userId,
      status: row.status === '0' ? '1' : '0'
    }
    const res = await chageUserStatusApi(params)
    if (res) {
      nextTick()
      ElMessage.success(row.status === '0' ? '停用成功' : '启用成功')
      row.status = row.status === '0' ? '1' : '0'
      // getList()
    }
  })
}

// 注册
onMounted(() => {
  resetTableHeight()
})
</script>

<template>
  <section>
    <!-- :style="{ height: defaultHeight + 'px' }" -->
    <ContentWrap :isShowtitle="false">
      <ElRow :gutter="24" style="margin-left: 0; margin-right: 0">
        <ElCol :xl="3" :lg="3" :md="5" :sm="6" :xs="6" style="padding-right: 0; padding-left: 0">
          <Tree
            :data="treedata"
            :maxHeight="defaultHeight"
            @tree="TreeClick"
            @all-tree-data="changeAlltree"
          />
        </ElCol>

        <!-- 右侧内容区域 -->
        <ElCol :xl="21" :lg="21" :md="19" :sm="18" :xs="18" style="padding-right: 0">
          <!-- <template #ContentWrapTitle>
          
          </template> -->

          <Table
            v-model:pageSize="tableObject.pageSize"
            v-model:currentPage="tableObject.currentPage"
            :columns="allSchemas.tableColumns"
            :isShowCell="isShowCell"
            :isShowFilter="true"
            :height="defaultHeight + 40"
            :data="tableObject.tableList"
            :loading="tableObject.loading"
            :cotentAlign="tableObject.align"
            :headerAlign="tableObject.headerAlign"
            :pagination="{
              total: tableObject.total
            }"
            @register="register"
          >
            <template #operateBtnLeft>
              <Search
                ref="searchRef"
                v-if="isAuth('system:user:query')"
                :schema="allSchemas.searchSchema"
                @search="setSearchParamsSub"
                @reset="setSearchParamsSub"
              />
            </template>
            <template #operateBtnRight>
              <div class="operation-button-container flex">
                <!-- <ElButton class="btn-add" v-hasPermi="'system:user:add'" @click="AddAction" plain>
                  <template #icon>
                    <Icon :size="14" icon="svg-icon:addBut" />
                  </template>
                  新增
                </ElButton> -->

                <ElButton
                  :loading="exLoading"
                  class="other exportBtn mr-2"
                  v-hasPermi="['system:user:export']"
                  @click="exportForm()"
                  plain
                >
                  <template #icon>
                    <Icon :size="14" icon="svg-icon:exportBut" />
                  </template>
                  导出
                </ElButton>
                <!-- <ElButton
                  :loading="delLoading"
                  v-hasPermi="['system:user:remove']"
                  class="btn-other mr-2"
                  @click="delData(null, true)"
                  plain
                >
                  <template #icon>
                    <Icon :size="14" icon="svg-icon:deleteBut" />
                  </template>
                  删除
                </ElButton> -->
              </div>
            </template>
            <template #action="{ row }">
              <ElButton
                v-hasPermi="'system:user:edit'"
                v-if="!row.admin"
                class="btn-default"
                :text="true"
                size="small"
                @click="action(row, 'edit')"
              >
                编辑
              </ElButton>
              <ElButton
                v-hasPermi="['system:user:remove']"
                v-if="!row.admin"
                class="btn-default"
                :text="true"
                size="small"
                @click="delData(row, false)"
              >
                删除
              </ElButton>
              <!-- <ElPopover>
                <template #reference>
                  <ElButton
                    v-hasPermi="['system:user:more']"
                    class="btn-default"
                    :text="true"
                    size="small"
                    v-show="!row.admin"
                  >
                    更多
                  </ElButton>
                </template>
                <div>
                  <div class="justify-center">
                    <ElButton
                      @click="action(row, 'resetPwd')"
                      :text="true"
                      size="small"
                      class="w-[100%]"
                    >
                      <Icon icon="ep:circle-check" class="mr-5px" />
                      重置密码
                    </ElButton>
                  </div>
                  <div class="justify-center mt-5px">
                    <ElButton
                      @click="action(row, 'role')"
                      :text="true"
                      size="small"
                      class="w-[100%]"
                    >
                      <Icon icon="ep:user" class="mr-5px" />
                      分配角色
                    </ElButton>
                  </div>
                </div>
              </ElPopover> -->
            </template>
          </Table>
          <UserForm title="用户" ref="userFormRef" />
        </ElCol>
      </ElRow>

      <!-- 重置密码  -->
      <Dialog
        v-model="dialogVisible"
        :maxHeight="'auto'"
        title="重置密码"
        @closed="closePermissionDialog"
      >
        确定重置当前用户密码?
        <!-- <PassWord ref="PassWordRef" :formSchema="fromSchemas" :currentRow="tableObject.currentRow" /> -->

        <template #footer>
          <ElButton type="primary" :loading="sureLoading" @click="resetPwdSure"> 确定</ElButton>
          <ElButton @click="dialogVisible = false">取消</ElButton>
        </template>
      </Dialog>

      <!-- 分配角色 -->
      <RoleTable @select-role="register" ref="roleTableRef" />
    </ContentWrap>
  </section>
</template>
