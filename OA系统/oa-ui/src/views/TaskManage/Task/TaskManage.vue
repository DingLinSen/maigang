<script lang="ts" setup>
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { ElButton, ElMessageBox, ElTag, ElMessage, ElForm } from 'element-plus'
import { Table } from '@/components/Table'
import {
  getTaskListApi,
  delTaskListApi,
  completeTaskApi,
  getExecutorListApi,
  receiveOrRefuseTaskApi
} from '@/api/task'
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
import { getAllUserListApi } from '@/api/user' // 获取所有用户
import { getAllDeptListApi } from '@/api/sys/dept' // 获取所有部门
import { listToTree } from '@/utils/tree'
import { taskStatus, delayStatus } from './Form/config'
import { useCache } from '@/hooks/web/useCache'
import { TaskForm } from './Form'
import { Dialog } from '@/components/Dialog'
import { useValidator } from '@/hooks/web/useValidator'
import { FileUpload } from '@/components/FileUpload' // 文件上传组件
import incompleteIcon from '@/assets/imgs/task/state_icon1.png'
import toBeAcceptedIcon from '@/assets/imgs/task/state_icon2.png'
import completedIcon from '@/assets/imgs/task/state_icon3.png'
import dismissedIcon from '@/assets/imgs/task/state_icon4.png'
import rejectedIcon from '@/assets/imgs/task/state_icon5.png'
import archivedIcon from '@/assets/imgs/task/state_icon6.png'
import { LimitDailog } from '@/views/Components/limit'
import { useRoute } from 'vue-router'

defineOptions({
  name: 'Task'
})
type Callback = (error?: string | Error | undefined) => void

const { required, notSpace } = useValidator()
const { wsCache } = useCache()
const loginUserId = ref<string>(wsCache.get('userInfo').userId) // 登录用户id

onMounted(() => {
  getAllUserlist()
  getExecutorList()
})

const deptData = ref<any>([])
const deptArray = ref<any>([])
const userData = ref<any>([])
const principalTree = ref<any>([])
provide('principalTree', principalTree)
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

const { register, tableObject, methods } = useTable<any>({
  getListApi: getTaskListApi,
  delListApi: delTaskListApi,
  response: {
    list: 'rows',
    total: 'total'
  }
})

const getDelayStatus = (status: string) => {
  let statusStr = '--'
  delayStatus.forEach((element: any) => {
    if (status == element.value) {
      statusStr = element.label
    }
  })
  return statusStr
}

const getTaskStatus = (status: string) => {
  let statusStr = '--'
  taskStatus.forEach((element: any) => {
    if (status == element.value) {
      statusStr = element.label
    }
  })
  return statusStr
}

//执行人集合
const executorList = ref<any>([])

const getExecutorList = async () => {
  let res = await getExecutorListApi()
  executorList.value = []
  if (res && res.data) {
    res.data.forEach((item: any) => {
      executorList.value.push({ value: item.userId, label: item.name })
    })
  }
}

const { getList, setSearchParams } = methods

getList()

useEmitt({
  name: 'taskManage',
  callback: (type: string) => {
    if (type === 'add') {
      tableObject.currentPage = 1
    }
    getExecutorList()
    getList()
  }
})

const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'index',
    headerAlign: 'center',
    cotentAlign: 'center',
    label: '序号',
    minWidth: '70px',
    formatter: (row: Recordable, __: TableColumn, cellValue: string, index: number) => {
      let itemIndex = index + 1 + tableObject.pageSize * (tableObject.currentPage - 1)
      return h('span', itemIndex)
    }
  },
  {
    field: 'title',
    label: '任务标题',
    minWidth: '170px',
    search: {
      show: true,
      componentProps: {
        style: 'width: 9.5vw',
        placeholder: '任务标题筛选'
      }
    },
    formatter: (row: Recordable) => {
      return h('span', row.title ? row.title : '--')
    }
  },
  {
    field: 'mgTaskMilestoneDos',
    label: '里程碑',
    minWidth: '190px',
    formatter: (row: Recordable, __: TableColumn, cellValue: string) => {
      let value = row.mgTaskMilestoneDos
      if (value && value.length > 0) {
        let milestoneTitle = ''
        value.forEach((item: any, index: number) => {
          milestoneTitle = milestoneTitle
            ? milestoneTitle + '<p>' + (index + 1) + '、' + item.milestoneTitle + ';</p>'
            : '<p>' + (index + 1) + '、' + item.milestoneTitle + '；</p>'
        })
        return h('div', [
          h('div', {
            class: ['title-div'],
            style: {
              width: '100%'
            },

            innerHTML: milestoneTitle // 渲染html内容
          })
        ])
      } else {
        return h('span', '--')
      }
    }
  },
  {
    field: 'createUserName',
    label: '指派人',
    minWidth: '90px',
    formatter: (row: Recordable, __: TableColumn, cellValue: string) => {
      return h('span', cellValue ? cellValue : '--')
    }
  },
  {
    field: 'executorName',
    minWidth: '90px',
    label: '执行人',
    formatter: (row: Recordable) => {
      return h('span', row.executorName ? row.executorName : '--')
    },
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        style: 'width: 9.5vw',
        options: executorList,
        filterable: true,
        placeholder: '执行人筛选'
      }
    }
  },
  {
    field: 'createTime',
    minWidth: '100px',
    label: '创建时间',
    formatter: (row: Recordable) => {
      return h('span', row.createTime ? moment(row.createTime).format('YYYY-MM-DD') : '--')
    },
    search: {
      show: true,
      component: 'DatePicker',
      componentProps: {
        style: 'width: 9.5vw',
        filterable: true,
        type: 'date',
        format: 'YYYY-MM-DD',
        placeholder: '创建时间筛选'
      }
    }
  },
  {
    field: 'deadline',
    minWidth: '100px',
    label: '截止时间',
    formatter: (row: Recordable) => {
      return h('span', row.deadline ? moment(row.deadline).format('YYYY-MM-DD') : '--')
    },
    search: {
      show: true,
      component: 'DatePicker',
      componentProps: {
        style: 'width: 9.5vw',
        filterable: true,
        type: 'date',
        format: 'YYYY-MM-DD',
        placeholder: '截止时间筛选'
      }
    }
  },
  {
    field: 'completionDate',
    minWidth: '100px',
    label: '完成时间',
    formatter: (row: Recordable) => {
      return h('span', row.completionDate ? moment(row.completionDate).format('YYYY-MM-DD') : '--')
    }
  },
  {
    field: 'delay',
    minWidth: '90px',
    label: '延误状态',
    formatter: (row: Recordable) => {
      return h(
        'span',
        {
          class: [row.delay == 0 ? 'normal-class' : 'delay-class']
        },
        getDelayStatus(String(row.delay))
      )
    },
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        style: 'width: 9.5vw',
        options: delayStatus,
        filterable: true,
        placeholder: '延误状态筛选'
      }
    }
  },
  {
    field: 'status',
    minWidth: '100px',
    label: '任务状态',
    formatter: (row: Recordable) => {
      return h(
        'div',
        {
          class: [
            row.status == 0
              ? 'incomplete-class'
              : row.status == 1
              ? 'completed-class'
              : row.status == 3
              ? 'to-be-accepted-class'
              : row.status == 4
              ? 'rejected-class'
              : row.status == 5
              ? 'dismissed-class'
              : row.status == 6
              ? 'archived-class'
              : 'incomplete-class'
          ]
        },
        [
          h('img', {
            class: 'img-cell-class',
            src:
              row.status == 0
                ? incompleteIcon
                : row.status == 1
                ? completedIcon
                : row.status == 3
                ? toBeAcceptedIcon
                : row.status == 4
                ? rejectedIcon
                : row.status == 5
                ? dismissedIcon
                : row.status == 6
                ? archivedIcon
                : incompleteIcon
          }),
          h('span', { style: 'margin-left: 2px;' }, getTaskStatus(String(row.status)))
        ]
      )
    },
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        style: 'width: 9.5vw',
        options: taskStatus,
        filterable: true,
        placeholder: '任务状态筛选'
      }
    }
  },
  {
    field: 'action',
    showOverflowTooltip: false,
    className: 'actionRegion',
    minWidth: '300px',
    fixed: 'right',
    label: '操作'
  }
])

const cellStyle = ({ row, column, rowIndex, columnIndex }) => {
  if (column.className == 'actionRegion') {
    nextTick(() => {
      let arr = []
      Array.from(document.querySelectorAll('.actionRegion .cell')).forEach((element) => {
        arr.push(element.children.length)
      })
      column.minWidth = Math.max.apply(null, arr) * 50 + 30
    })
  }
}
const tableShow = ref(false)
const route = useRoute()
watch(
  () => route,
  () => {
    if (route.name == 'Task') {
      nextTick()
      tableShow.value = true
    } else {
      tableShow.value = false
    }
  },
  { immediate: true, deep: true }
)

const { allSchemas } = useCrudSchemas(crudSchemas)

//删除加载
const delLoading = ref(false)

//删除
const delData = async (row: any | null, multiple: boolean) => {
  tableObject.currentRow = row
  const { delList, getSelections } = methods
  const selections = await getSelections()
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

const taskFormRef = ref<ComponentRef<typeof TaskForm>>()

//table操作栏按钮事件
const action = (row: any, type: string) => {
  taskFormRef.value.openDrawer(type, row ? row.id : '')
}

const params = reactive<Recordable>({
  title: null,
  executor: null,
  createTime: null,
  deadline: null,
  delay: null,
  status: null,
  createUser: null,
  connectUser: null
})

//搜索
const restSearchParams = (param: Recordable) => {
  isMyTask.value = true
  showExecutor()
  params.createUser = null
  params.connectUser = null
  params.title = param.title ? param.title : null
  params.executor = param.executorName ? param.executorName : null
  params.createTime = param.createTime ? moment(param.createTime).format('YYYY-MM-DD') : null
  params.deadline = param.deadline ? moment(param.deadline).format('YYYY-MM-DD') : null
  params.delay = param.delay ? param.delay : null
  params.status = param.status ? param.status : null
  nextTick(() => {
    searchRef.value.setValues({ executorName: null })
  })
  setSearchParamsSub(params)
}

const setSearchParamsSub = (param: Recordable) => {
  params.title = param.title ? param.title : null
  params.executor = param.executorName ? param.executorName : null
  params.createTime = param.createTime ? moment(param.createTime).format('YYYY-MM-DD') : null
  params.deadline = param.deadline ? moment(param.deadline).format('YYYY-MM-DD') : null
  params.delay = param.delay ? param.delay : null
  params.status = param.status ? param.status : null
  if (!isMyTask.value) {
    params.executor = loginUserId.value
  }
  setSearchParams(params)
}
//指派给我/全部任务
const findLastIndex = (array: any, cb) => {
  if (!Array.isArray(array)) {
    return -1
  }
  if (array.length === 0) {
    return -1
  }
  for (var i = array.length - 1; i >= 0; i--) {
    const item = array[i]
    if (cb.call(null, item, i, array)) {
      return i
    }
  }
  return -1
}
const isMyTask = ref<boolean>(true)
const searchRef = ref()
//右上角我的任务/由我创建
const selPersonalTask = (index: number) => {
  if (index === 1) {
    // 我的任务。全部任务
    isMyTask.value = !isMyTask.value
    params.createUser = null
    params.connectUser = null
    nextTick(() => {
      searchRef.value.setValues({ executorName: null })
    })
    if (!isMyTask.value) {
      hiddenExecutor()
    } else {
      showExecutor()
    }
    setSearchParamsSub(params)
  } else if (index === 2) {
    // 由我创建
    isMyTask.value = true
    showExecutor()
    params.createUser = loginUserId.value
    params.connectUser = null
    nextTick(() => {
      searchRef.value.setValues({ executorName: null })
    })
    setSearchParamsSub(params)
  } else if (index === 3) {
    isMyTask.value = true
    showExecutor()
    params.createUser = null
    params.connectUser = loginUserId.value
    nextTick(() => {
      searchRef.value.setValues({ executorName: null })
    })
    setSearchParamsSub(params)
  }
}

//隐藏执行人选择框
const hiddenExecutor = () => {
  let lastIndex = findLastIndex(
    allSchemas.searchSchema,
    (item: any) => item.field === 'executorName'
  )
  if (lastIndex > -1) {
    allSchemas.searchSchema.splice(lastIndex, 1)
  }
}

//显示执行人选择框
const showExecutor = () => {
  let lastIndex = findLastIndex(
    allSchemas.searchSchema,
    (item: any) => item.field === 'executorName'
  )
  if (lastIndex == -1) {
    change(1, {
      field: 'executorName',
      component: 'Select',
      componentProps: {
        style: 'width: 196px',
        options: executorList,
        filterable: true,
        placeholder: '执行人筛选'
      }
    })
  }
}
const change = (index: number, value: any) => {
  allSchemas.searchSchema.splice(index, 0, value)
}
const ruleForm = ref<any>({
  reason: '',
  rejected: '',
  finishCondition: '',
  filePath: ''
})
//表单验证规则
const rules = reactive({
  reason: [
    { required: true, message: '请输入拒绝理由', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  rejected: [
    { required: true, message: '请输入驳回理由', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  finishCondition: [
    { required: true, message: '请输入完成情况', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ]
})
//驳回任务
const sureLoading = ref<boolean>(false)
const rowData = ref<any>()
const rejectedFormRef = ref<ComponentRef<typeof ElForm>>()
const rejectedModel = ref<boolean>(false)
const openRejectedDailog = (row: any) => {
  resetForm()
  rejectedModel.value = true
  rowData.value = row
}
const handleRejected = async () => {
  //表单验证
  if (!rejectedFormRef.value) return
  await rejectedFormRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      sureLoading.value = true
      const params = {
        status: '5',
        taskId: rowData.value.id,
        reason: ruleForm.value.rejected
      }
      const res = await receiveOrRefuseTaskApi(params)
      if (res) {
        rejectedModel.value = false
        sureLoading.value = false
        nextTick()
        ElMessage.success('成功驳回任务')
        tableObject.currentPage = 1
        getList()
      }
    }
  })
}

//拒绝任务
const refusedFormRef = ref<ComponentRef<typeof ElForm>>()
const refusedModel = ref<boolean>(false)
const openRefusedDailog = (row: any) => {
  resetForm()
  refusedModel.value = true
  rowData.value = row
}
const handleRefused = async () => {
  //表单验证
  if (!refusedFormRef.value) return
  await refusedFormRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      sureLoading.value = true
      const params = {
        status: '4',
        taskId: rowData.value.id,
        reason: ruleForm.value.reason
      }
      const res = await receiveOrRefuseTaskApi(params)
      if (res) {
        refusedModel.value = false
        sureLoading.value = false
        nextTick()
        ElMessage.success('成功拒绝任务')
        tableObject.currentPage = 1
        getList()
      }
    }
  })
}

const closePermissionDialog = () => {
  resetForm()
}
const resetForm = () => {
  sureLoading.value = false
  ruleForm.value = {
    reason: '',
    rejected: '',
    filePath: ''
  }
}

//接受任务
const accpetTask = (row: any) => {
  ElMessageBox.confirm('确定接受选中的任务信息？', '确认接受任务操作', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    autofocus: false
  }).then(async () => {
    const params = {
      status: '0',
      taskId: row.id
    }
    const res = await receiveOrRefuseTaskApi(params)
    if (res) {
      nextTick()
      ElMessage.success('成功接受任务')
      tableObject.currentPage = 1
      getList()
    }
  })
}

//归档
const archiveTask = (row: any) => {
  ElMessageBox.confirm('确定归档选中的任务信息？', '确认归档任务操作', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    autofocus: false
  }).then(async () => {
    const params = {
      status: '6',
      taskId: row.id
    }
    const res = await receiveOrRefuseTaskApi(params)
    if (res) {
      nextTick()
      ElMessage.success('成功归档任务信息')
      tableObject.currentPage = 1
      getList()
    }
  })
}

//完成
const completeModel = ref<boolean>(false)
const completeFormRef = ref<ComponentRef<typeof ElForm>>()
const openCompleteDailog = (row: any) => {
  resetForm()
  rowData.value = row
  completeModel.value = true
}
const handleComplete = async () => {
  if (!completeFormRef.value) return
  await completeFormRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      sureLoading.value = true
      const params = {
        status: '1',
        id: rowData.value.id,
        updateUser: rowData.value.updateUser,
        finishCondition: ruleForm.value.finishCondition ? ruleForm.value.finishCondition : '',
        filePath: ruleForm.value.filePath ? ruleForm.value.filePath : '',
        fileName: ruleForm.value.filePath ? getFileName(ruleForm.value.filePath) : ''
      }
      const res = await completeTaskApi(params)
      if (res) {
        nextTick()
        sureLoading.value = false
        completeModel.value = false
        ElMessage.success('成功更改任务状态信息')
        tableObject.currentPage = 1
        getList()
      }
    }
  })
}

// 获取文件名称
const getFileName = (name: string) => {
  if (name && name.lastIndexOf('/') > -1) {
    return name.slice(name.lastIndexOf('/') + 1)
  } else {
    return ''
  }
}
</script>

<template>
  <ContentWrap Showtitle="任务管理">
    <template #ContentWrapTitle>
      <div>
        <ElButton v-hasPermi="'task:task:add'" class="btn-add" plain @click="action(null, 'add')">
          <template #icon>
            <Icon :size="14" icon="svg-icon:addBut" />
          </template>
          新增
        </ElButton>
        <ElButton
          v-hasPermi="'task:task:query'"
          class="exportBtn"
          plain
          @click="selPersonalTask(1)"
        >
          <template #icon>
            <Icon :size="14" icon="svg-icon:zp_icon" />
          </template>
          {{ isMyTask ? '指派给我' : '全部任务' }}
        </ElButton>

        <ElButton
          v-hasPermi="'task:task:query'"
          class="exportBtn"
          plain
          @click="selPersonalTask(2)"
        >
          <template #icon>
            <Icon :size="14" icon="svg-icon:yw_icon" />
          </template>
          由我创建
        </ElButton>
        <ElButton
          v-hasPermi="'task:task:query'"
          class="exportBtn"
          plain
          @click="selPersonalTask(3)"
        >
          <template #icon>
            <Icon :size="14" icon="svg-icon:yw_icon" />
          </template>
          我参与的
        </ElButton>
      </div>
    </template>

    <Table
      v-if="tableShow"
      v-model:currentPage="tableObject.currentPage"
      v-model:pageSize="tableObject.pageSize"
      :border="true"
      :selection="false"
      :isShowFilter="true"
      :columns="allSchemas.tableColumns"
      :cotentAlign="'center'"
      :data="tableObject.tableList"
      :header-align="'center'"
      :loading="tableObject.loading"
      :pagination="{
        total: tableObject.total
      }"
      :cell-style="cellStyle"
      @register="register"
    >
      <template #operateBtnLeft>
        <Search
          v-if="isAuth('task:task:query')"
          ref="searchRef"
          :schema="allSchemas.searchSchema"
          @reset="restSearchParams"
          @search="setSearchParamsSub"
        />
      </template>
      <template #action="{ row }">
        <ElButton
          v-if="
            isAuth('task:task:edit') &&
            (loginUserId === row.createUser ||
              (loginUserId === row.executor &&
                row.mgTaskMilestoneDos.length > 0 &&
                row.status !== 3 &&
                row.status !== 4)) &&
            row.status !== 1 &&
            row.status !== 6
          "
          :text="true"
          class="btn-default"
          @click="action(row, 'edit')"
        >
          编辑
        </ElButton>
        <ElButton
          v-if="isAuth('task:task:remove') && loginUserId === row.createUser && row.status !== 6"
          :text="true"
          class="btn-default"
          size="small"
          @click="delData(row, false)"
        >
          删除
        </ElButton>
        <ElButton
          v-if="isAuth('task:task:refuse') && loginUserId == row.executor && row.status === 3"
          :text="true"
          class="btn-default"
          @click="openRefusedDailog(row)"
        >
          拒绝
        </ElButton>
        <ElButton
          v-if="isAuth('task:task:accept') && loginUserId == row.executor && row.status === 3"
          :text="true"
          class="btn-default"
          @click="accpetTask(row)"
        >
          接受
        </ElButton>
        <ElButton
          v-if="
            isAuth('task:task:complete') &&
            loginUserId == row.executor &&
            (row.status === 0 || row.status === 5)
          "
          :text="true"
          class="btn-default"
          @click="openCompleteDailog(row)"
        >
          完成
        </ElButton>
        <ElButton
          v-if="isAuth('task:task:reject') && loginUserId == row.createUser && row.status === 1"
          :text="true"
          class="btn-default"
          @click="openRejectedDailog(row)"
        >
          驳回
        </ElButton>
        <ElButton
          v-if="isAuth('task:task:archive') && loginUserId === row.createUser && row.status === 1"
          :text="true"
          class="btn-default"
          @click="archiveTask(row)"
        >
          归档
        </ElButton>
        <ElButton
          v-if="isAuth('task:task:see')"
          :text="true"
          class="btn-default"
          @click="action(row, 'see')"
        >
          详情
        </ElButton>
      </template>
    </Table>
  </ContentWrap>
  <TaskForm ref="taskFormRef" />
  <Dialog
    v-model="rejectedModel"
    :maxHeight="'auto'"
    :width="'35%'"
    title="确认驳回任务操作"
    @closed="closePermissionDialog"
  >
    <el-form
      ref="rejectedFormRef"
      :model="ruleForm"
      :rules="rules"
      class="demo-ruleForm"
      label-position="top"
      label-width="100px"
    >
      <el-row>
        <el-col :span="24">
          <el-form-item label="驳回理由" prop="rejected">
            <el-input
              v-model="ruleForm.rejected"
              :autosize="{ minRows: 4 }"
              maxlength="200"
              placeholder="请输入驳回理由"
              type="textarea"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <ElButton :loading="sureLoading" type="primary" @click="handleRejected()"> 确认</ElButton>
      <ElButton @click="rejectedModel = false">取消</ElButton>
    </template>
  </Dialog>
  <Dialog
    v-model="refusedModel"
    :maxHeight="'auto'"
    :width="'35%'"
    title="确认拒绝任务操作"
    @closed="closePermissionDialog"
  >
    <el-form
      ref="refusedFormRef"
      :model="ruleForm"
      :rules="rules"
      class="demo-ruleForm"
      label-position="top"
      label-width="100px"
    >
      <el-row>
        <el-col :span="24">
          <el-form-item label="拒绝理由" prop="reason">
            <el-input
              v-model="ruleForm.reason"
              :autosize="{ minRows: 4 }"
              maxlength="200"
              placeholder="请输入拒绝理由"
              type="textarea"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <ElButton :loading="sureLoading" type="primary" @click="handleRefused()"> 确认</ElButton>
      <ElButton @click="refusedModel = false">取消</ElButton>
    </template>
  </Dialog>

  <Dialog
    v-model="completeModel"
    :maxHeight="'auto'"
    :width="'35%'"
    title="确认更改任务状态操作"
    @closed="closePermissionDialog"
  >
    <el-form
      ref="completeFormRef"
      :model="ruleForm"
      :rules="rules"
      class="demo-ruleForm"
      label-position="top"
      label-width="100px"
    >
      <el-row>
        <el-col :span="24">
          <el-form-item label="完成情况" prop="finishCondition">
            <el-input
              v-model="ruleForm.finishCondition"
              :autosize="{ minRows: 4 }"
              maxlength="200"
              placeholder="请输入完成情况"
              type="textarea"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="成果文档" prop="filePath">
            <div
              style="
                width: 100%;
                display: flex;
                vertical-align: middle;
                line-height: normal;
                align-items: center;
              "
            >
              <FileUpload
                v-model:modelValue="ruleForm.filePath"
                :fileType="[
                  'pdf',
                  'doc',
                  'docx',
                  'png',
                  'jpg',
                  'jpeg',
                  'xls',
                  'xlsx',
                  'zip',
                  'rar'
                ]"
                :limit="10"
                class="w-full"
              />
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <ElButton :loading="sureLoading" type="primary" @click="handleComplete()"> 确认</ElButton>
      <ElButton @click="completeModel = false">取消</ElButton>
    </template>
  </Dialog>
  <LimitDailog routerName="Task" />
</template>
<style lang="less" scoped>
:deep(.el-loading-mask) {
  top: 0px !important;
  width: 100% !important;
  left: 0px !important;
}

:deep(.title-div) {
  text-align: left;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  display: -webkit-box;
  margin-top: 5px;
  margin-bottom: 3px;
  overflow: hidden;

  p {
    line-height: 24px;
    padding: 1px 0;
  }
}

:deep(.delay-class) {
  margin: auto;
  font-size: 14px;
  font-family: Alibaba PuHuiTi R;
  font-weight: 400;
  color: #ffffff;
  padding: 5px 10px;
  background: #ff565c;
  border-radius: 2px;
}

:deep(.normal-class) {
  margin: auto;
  font-size: 14px;
  font-family: Alibaba PuHuiTi R;
  font-weight: 400;
  color: #222222;
}

:deep(.img-cell-class) {
  width: 13px;
  height: 13px;
}

:deep(.incomplete-class) {
  margin: auto;
  width: 70px;
  height: 26px;
  display: flex;
  background: #e8f8ff;
  border-radius: 2px;
  padding: 0px 6px;
  font-size: 14px;
  font-family: Alibaba PuHuiTi R;
  font-weight: 400;
  color: #00a0e9;
  align-items: center;
}

:deep(.to-be-accepted-class) {
  margin: auto;
  width: 70px;
  height: 26px;
  display: flex;
  background: #fff0eb;
  border-radius: 2px;
  padding: 0px 6px;
  font-size: 14px;
  font-family: Alibaba PuHuiTi R;
  font-weight: 400;
  color: #ff6b3b;
  align-items: center;
}

:deep(.completed-class) {
  margin: auto;
  width: 70px;
  height: 26px;
  display: flex;
  background: #e9f6ef;
  border-radius: 2px;
  padding: 0px 6px;
  font-size: 14px;
  font-family: Alibaba PuHuiTi R;
  font-weight: 400;
  color: #21a974;
  align-items: center;
}

:deep(.rejected-class) {
  margin: auto;
  width: 70px;
  height: 26px;
  display: flex;
  background: #ffe7e8;
  border-radius: 2px;
  padding: 0px 6px;
  font-size: 14px;
  font-family: Alibaba PuHuiTi R;
  font-weight: 400;
  color: #ff565c;
  align-items: center;
}

:deep(.dismissed-class) {
  margin: auto;
  width: 70px;
  height: 26px;
  display: flex;
  background: #e5e7eb;
  border-radius: 2px;
  padding: 0px 6px;
  font-size: 14px;
  font-family: Alibaba PuHuiTi R;
  font-weight: 400;
  color: #4e5569;
  align-items: center;
}

:deep(.archived-class) {
  margin: auto;
  width: 70px;
  height: 26px;
  display: flex;
  background: #ebebeb;
  padding: 0px 6px;
  border-radius: 2px;
  font-size: 14px;
  font-family: Alibaba PuHuiTi R;
  font-weight: 400;
  color: #878787;
  align-items: center;
}
:deep(.actionRegion .cell) {
  /* flex: 1; */
  display: inline-block !important;
  white-space: nowrap !important;
  padding: 6px !important;
}
</style>
