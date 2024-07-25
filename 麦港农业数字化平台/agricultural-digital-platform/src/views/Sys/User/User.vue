<script setup lang="ts">
import { h, reactive, ref, unref, nextTick, onActivated, onMounted } from 'vue'
import { ElButton, ElMessageBox, ElMessage, ElSwitch } from 'element-plus'
import { Dialog } from '@/components/Dialog'
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Table } from '@/components/Table'
import { Tree } from '@/components/Tree'
import { isAuth } from '@/utils/is'
import { useAppStore } from '@/store/modules/app'
import { TableColumn } from '@/types/table'
import { useEmitt } from '@/hooks/web/useEmitt'
import { useTable } from '@/hooks/web/useTable'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'

import RoleTable from './components/RoleTable.vue'
import UserForm from './components/UserForm.vue'
import {
  getUserListApi,
  delUserListApi,
  getUserDeptListApi,
  exportUserListApi,
  chageUserStatusApi,
  batchChangeDeptApi,
  batchResetPassWord
} from '@/api/user'
import { TableData } from '@/api/table/types'

defineOptions({
  name: 'User'
})
useEmitt({
  name: 'getUserList',
  callback: (type: string) => {
    if (type === 'add') {
      tableObject.currentPage = 1
    }
    getList()
  }
})
const appStore = useAppStore()
const defaultHeight = ref(appStore.getDocumentClientHeight - 140)
// const addAuth = ref(['example:dialog:delete'])
// const cellAlgin = ref({
//   textAlign: 'center'
// })
// const appStore = useAppStore()
// const ClientHeight = ref(appStore.documentClientHeight)
// let TableClientHeight = ClientHeight.value * 0.6

// const { required } = useValidator()

// 左侧树形数据
const treedata = ref<any>([])

// const PassWordRef = ref<ComponentRef<typeof PassWord>>()

//确定
const sureLoading = ref(false)

const { register, tableObject, methods } = useTable<TableData>({
  getListApi: getUserListApi,
  delListApi: delUserListApi,
  response: {
    list: 'rows',
    total: 'total',
    key: 'userId'
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
    ElMessage.error('服务器错误')
  }
}

getDeptTreeList()
getList()
onActivated(() => {
  getDeptTreeList()
})
//导出加载
const exLoading = ref(false)
const deptId = ref()
const params = reactive<Recordable>({
  deptId: undefined,
  userName: undefined,
  nickName: undefined,
  phonenumber: undefined,
  status: undefined
})
const chooseListAll = ref<any>([])
const searchParamInit = (param) => {
  params.deptId = param.deptId || null
  params.userName = param.userName || undefined
  params.nickName = param.nickName || undefined
  params.phonenumber = param.phonenumber || undefined
  params.status = param.status || undefined
  return params
}
//搜索
const setSearchParamsSub = (param: Recordable) => {
  chooseListAll.value = []

  setSearchParams(searchParamInit(param))
}
// 重置
const resetSearchParams = (param: any) => {
  chooseListAll.value = []
  param.deptId = null
  setSearchParams(searchParamInit(param))
}

const userFormRef = ref<ComponentRef<typeof UserForm>>()

// 表格列
const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'userId',
    label: '序号',
    type: 'index',
    fixed: 'left'
  },
  {
    field: 'userName',
    label: '用户名称',
    table: {
      show: true
    },
    search: {
      show: true,
      componentProps: {
        clearable: true,
        style: 'width:200px;' //宽度
      }
    },
    formatter: (row: Recordable) => {
      return h('span', row.userName ? row.userName : '--')
    }
  },
  {
    field: 'nickName',
    label: '姓名',
    table: {
      show: true
    },
    search: {
      show: true,
      componentProps: {
        style: 'width:200px;' //宽度
      }
    },
    formatter: (row: Recordable) => {
      return h('span', row.nickName ? row.nickName : '--')
    }
  },
  // {
  //   field: 'deptName',
  //   label: '所属部门',
  //   table: {
  //     show: true
  //   },
  //   search: {
  //     show: false
  //   },
  //   formatter: (row: Recordable) => {
  //     return h('span', row.dept?.deptName ? row.dept.deptName : '--')
  //   }
  // },
  // {
  //   field: 'postNames',
  //   label: '岗位',
  //   table: {
  //     show: true
  //   },
  //   search: {
  //     show: false
  //   },
  //   formatter: (row: Recordable) => {
  //     return h('span', row.postNames ? row.postNames.join(',') : '--')
  //   }
  // },
  // {
  //   field: 'phonenumber',
  //   label: '手机号码',
  //   table: {
  //     show: true
  //   },
  //   search: {
  //     show: true
  //   },
  //   formatter: (row: Recordable) => {
  //     return h('span', row.phonenumber ? row.phonenumber : '--')
  //   }
  // },
  {
    field: 'status',
    label: '用户状态',
    table: {
      show: true
    },
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
        options: [
          {
            label: '正常',
            value: '0'
          },
          {
            label: '停用',
            value: '1'
          }
        ]
      }
    }
  },
  {
    field: 'createByName',
    label: '创建人',
    table: {
      show: true
    },
    search: {
      show: false
    },
    formatter: (row: Recordable) => {
      return h('span', row.createByName ? row.createByName : '--')
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
      show: false,
      component: 'DatePicker',
      componentProps: {
        type: 'daterange', // 组件type属性+
        format: 'YYYY-MM-DD'
      }
    },
    formatter: (row: Recordable) => {
      return h('span', row.createTime ? row.createTime : '--')
    }
  },
  {
    field: 'action',
    width: '160px',
    table: {
      show: true
    },
    fixed: 'right',
    label: '操作'
  }
])

// 重置密码表单项
// const fromSchemas = reactive<FormSchema[]>([
//   {
//     field: 'password',
//     label: '新密码',
//     component: 'Input',
//     componentProps: {
//       // disabled: true
//     },
//     colProps: {
//       span: 24
//     },
//     formItemProps: {
//       // 表单校验
//       rules: [required()]
//     }
//   }
// ])
const { allSchemas } = useCrudSchemas(crudSchemas)
const addAction = () => {
  nextTick(() => {
    userFormRef.value?.openDrawer('add', '', deptId.value)
  })
}

// 树形图返回数据
const TreeClick = async (val: any) => {
  deptId.value = val.id
  const param: any = await unref(searchRef)?.getFormData()
  param.deptId = val.id
  setSearchParamsSub(param)
}

//删除加载
const delLoading = ref(false)

// 删除
const delData = async (row: TableData | null, multiple: boolean) => {
  tableObject.currentRow = row
  const { delList } = methods
  // const selections = await getSelections()
  const selections = chooseListAll

  delLoading.value = true
  await delList(
    multiple ? selections.value.map((v) => v.userId) : [tableObject.currentRow?.userId as string],
    multiple
  ).finally(() => {
    delLoading.value = false
  })
}

// 分配角色
const roleTableRef = ref<ComponentRef<typeof RoleTable>>()
//table操作栏按钮事件
const action = (row: TableData, type: string) => {
  switch (type) {
    case 'resetPwd':
      tableObject.currentRow = row
      dialogVisible.value = true
      chooseListAll.value = [row]
      break
    case 'role':
      roleTableRef.value?.openDrawer(row.userId)
      break
    default:
      nextTick(() => {
        userFormRef.value?.openDrawer(type, row.userId)
      })
      break
  }
}

//重置密码dialog
const dialogVisible = ref(false)

//关闭用户密码dialog
const closePermissionDialog = () => {
  // deptIds.value = []
}
const resetPwdModal = () => {
  if (!chooseListAll.value.length) {
    ElMessage.warning('请选择需要重置密码的数据')
    return
  }
  dialogVisible.value = true
}
//确认重置密码
const resetPwdSure = async () => {
  let data: any = []
  chooseListAll.value.map((item) => {
    data.push({ ...item, password: 'abc123!@#' })
  })
  sureLoading.value = true
  const res = await batchResetPassWord(data)
    .catch(() => {})
    .finally(() => {
      sureLoading.value = false
    })
  if (res) {
    ElMessage.success('重置密码成功')
    dialogVisible.value = false
    chooseListAll.value = []
    getList()
  }
  // const password = unref(PassWordRef)
  // const elFormRef = password?.elFormRef
  // await elFormRef?.validate(async (isValid) => {
  //   if (isValid) {
  //     const data = (await password?.getFormData()) as UserData
  //     sureLoading.value = true
  //     const res = await resetPassWord(data)
  //       .catch(() => {})
  //       .finally(() => {
  //         sureLoading.value = false
  //       })
  //     if (res) {
  //       ElMessage.success('重置密码成功')
  //       dialogVisible.value = false
  //       getList()
  //     }
  //   }
  // })
}

// 调整部门
const changeDeptVisible = ref(false)
const deptChange = () => {
  if (!chooseListAll.value.length) {
    ElMessage.warning('请选择需要调整部门的数据')
    return
  }
  changeDeptVisible.value = true
}
const selectDeptId = ref()
const deptSelect = (val: any) => {
  selectDeptId.value = val.id
}

const deptTreeLoading = ref(false)
// 调整部门确认
const deptChangeQuery = async () => {
  const params = {
    deptId: selectDeptId.value,
    userIds: chooseListAll.value.map((v) => v.userId).join(',')
  }
  deptTreeLoading.value = true
  const res = await batchChangeDeptApi(params)
    .catch(() => {})
    .finally(() => {
      deptTreeLoading.value = false
    })
  if (res) {
    chooseListAll.value = []
    ElMessage.success('调整部门成功')
    changeDeptVisible.value = false
    getList()
  }
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
  await exportUserListApi(param)
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
    type: 'warning'
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
    }
  })
}

// const customSort = () => {}
const isShowLeft = ref(true)
const showLeftChange = (val) => {
  isShowLeft.value = val
}
const selectionChange = () => {}
const dragDom = ref()
const treeWidth = ref(260)
// 左侧树形图拖动
const initTree = () => {
  //拉伸(右边)效果不想要可以注释
  const treeContainner = dragDom.value.treeContainner
  const resizeElR = dragDom.value.wResize
  // const resizeElR = document.createElement('div')
  // if (dragDom.value) {
  //   treeContainner.appendChild(resizeElR)
  // }

  let minWidth = 200
  let maxWidth = 400
  //在弹窗右侧加上一个10px的控制块
  resizeElR.style.cursor = 'w-resize'
  resizeElR.style.position = 'absolute'
  resizeElR.style.height = '100%'
  resizeElR.style.width = '10px'
  resizeElR.style.right = '0px'
  resizeElR.style.top = '0px'
  //鼠标拉伸弹窗
  resizeElR.onmousedown = (e) => {
    const elW = treeContainner.clientWidth
    const EloffsetLeft = treeContainner.offsetLeft
    // 记录初始x位置
    const clientX = e.clientX
    document.onmousemove = function (e) {
      e.preventDefault() // 移动时禁用默认事件
      //右侧鼠标拖拽位置
      if (clientX > EloffsetLeft + elW - 10) {
        //往左拖拽
        if (clientX > e.clientX) {
          if (treeContainner.clientWidth < minWidth) {
          } else {
            treeWidth.value = elW - (clientX - e.clientX)
          }
        }
        //往右拖拽
        if (clientX < e.clientX) {
          if (treeContainner.clientWidth > maxWidth) {
          } else {
            treeWidth.value = elW + (e.clientX - clientX)
          }
        }
      }
    }
    //拉伸结束
    document.onmouseup = function () {
      document.onmousemove = null
      document.onmouseup = null
    }
  }
}
onMounted(() => {
  nextTick(() => {
    setTimeout(() => {
      initTree()
    }, 500)
  })
})
</script>

<template>
  <!-- <el-container class="flex-bteween">
    <Tree
      ref="dragDom"
      class="mt-7px"
      :defaultHeight="defaultHeight"
      :title="'组织机构'"
      :expandOnClickNode="false"
      :width="treeWidth + 'px'"
      :data="treedata"
      :expendAll="true"
      :isShowLeft="isShowLeft"
      @tree="TreeClick"
      @is-show-left-change="showLeftChange"
    />
    <div
      :style="{
        width: isShowLeft ? `calc(100% - ${treeWidth}px)` : '100%'
      }"
    > -->
  <ContentWrap class="mt-7px mb-10px">
    <Search
      ref="searchRef"
      v-if="isAuth('system:user:query')"
      :schema="allSchemas.searchSchema"
      :chooseListAll="chooseListAll"
      @search="setSearchParamsSub"
      @reset="resetSearchParams"
    />
  </ContentWrap>
  <ContentWrap>
    <Table
      v-model:pageSize="tableObject.pageSize"
      v-model:currentPage="tableObject.currentPage"
      :columns="allSchemas.tableColumns"
      :data="tableObject.tableList"
      :loading="tableObject.loading"
      :align="tableObject.align"
      :headerAlign="tableObject.headerAlign"
      :border="true"
      :keyTable="'userId'"
      :chooseListAll="chooseListAll"
      :pagination="{
        total: tableObject.total
      }"
      @update:selection="selectionChange"
      @register="register"
    >
      <template #operateBtnLeft>
        <ElButton type="primary" v-hasPermi="'system:user:add'" @click="addAction">
          <Icon icon="ep:plus" class="mr-5px" />
          新增
        </ElButton>

        <ElButton
          v-hasPermi="['system:user:resetPwd']"
          type="primary"
          @click="resetPwdModal()"
          plain
        >
          <Icon icon="ep:circle-check" class="mr-5px" />
          重置密码
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
        <!-- <ElButton
          type="primary"
          v-hasPermi="['system:user:adjustDept']"
          @click="deptChange()"
          plain
        >
          <Icon icon="ep:refresh-right" class="mr-5px" />
          调整部门
        </ElButton> -->
        <ElButton
          :loading="delLoading"
          v-hasPermi="['system:user:remove']"
          @click="delData(null, true)"
          class="btn-default"
        >
          <Icon icon="ep:delete" class="mr-5px" />
          删除
        </ElButton>

        <!-- <ElButton
                type="primary"
                v-hasPermi="['system:user:customSort']"
                @click="customSort()"
                plain
              >
                <Icon icon="ep:list" class="mr-5px" />
                自定义排序
              </ElButton> -->
      </template>
      <template #action="{ row }">
        <ElButton
          v-hasPermi="'system:user:edit'"
          v-show="!row.admin"
          type="text"
          :text="true"
          @click="action(row, 'edit')"
        >
          编辑
        </ElButton>
        <!-- <ElButton v-if="!row.admin" type="primary" :text="true" @click="action(row, 'see')">
                详情
              </ElButton> -->
        <ElButton
          v-hasPermi="['system:user:remove']"
          v-show="!row.admin"
          type="text"
          :text="true"
          @click="delData(row, false)"
        >
          删除
        </ElButton>
        <!-- <ElPopover>
                <template #reference>
                  <ElButton
                    v-hasPermi="['system:user:more']"
                    type="success"
                    :text="true"
                    size="small"
                    v-show="!row.admin"
                  >
                    <Icon icon="ep:d-arrow-right" class="mr-5px" />
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
                    <ElButton @click="action(row, 'role')" :text="true" size="small" class="w-[100%]">
                      <Icon icon="ep:user" class="mr-5px" />
                      分配角色
                    </ElButton>
                  </div>
                </div>
              </ElPopover> -->
      </template>
    </Table>
  </ContentWrap>
  <!-- </div>
  </el-container> -->

  <!-- 调整部门  -->
  <Dialog
    v-model="changeDeptVisible"
    modal-class="dept-tree"
    :fullscreen="false"
    :maxHeight="'auto'"
    title="调整部门"
  >
    <div class="">
      <Tree
        :title="''"
        :isShowExpend="false"
        :width="'300px'"
        :defaultHeight="600"
        :data="treedata"
        :expendAll="true"
        @tree="deptSelect"
      />
    </div>

    <template #footer>
      <ElButton type="primary" :loading="deptTreeLoading" @click="deptChangeQuery"> 确定</ElButton>
      <ElButton @click="changeDeptVisible = false">取消</ElButton>
    </template>
  </Dialog>
  <!-- 重置密码  -->
  <Dialog
    v-model="dialogVisible"
    :maxHeight="'80px'"
    title="重置密码"
    @closed="closePermissionDialog"
  >
    <!-- <PassWord ref="PassWordRef" :formSchema="fromSchemas" :currentRow="tableObject.currentRow" /> -->
    <p>确认重置密码？</p>
    <template #footer>
      <ElButton type="primary" :loading="sureLoading" @click="resetPwdSure"> 确定</ElButton>
      <ElButton @click="dialogVisible = false">取消</ElButton>
    </template>
  </Dialog>
  <UserForm title="用户" ref="userFormRef" @get-user-list="getList()" />
  <!-- 分配角色 -->
  <RoleTable @select-role="register" ref="roleTableRef" />
</template>
<style lang="less" scoped>
// .expend-lr {
//   position: absolute;
//   top: -20px;
//   background: #ccc;
//   cursor: pointer;
// }

.dept-tree {
  .el-dialog .el-dialog__body {
    padding: 0 20px;
  }

  .tree-container {
    .tree-main {
      padding: 0 10px;
    }
  }
}
</style>
