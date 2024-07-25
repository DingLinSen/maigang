<script setup lang="ts">
import { Dialog } from '@/components/Dialog'
import { Form } from '@/components/Form'
import { Search } from '@/components/Search'
import { useI18n } from '@/hooks/web/useI18n'
import { isAuth } from '@/utils/is'
import { ElButton, ElMessage, ElTag, ElMessageBox } from 'element-plus'
import { Table } from '@/components/Table'
import {
  todoListApi,
  delKonwledgApi,
  editKonwledgApi,
  batchOperatorApi
} from '@/api/classification/knowledge'

import { useValidator } from '@/hooks/web/useValidator'
import { useTable } from '@/hooks/web/useTable'
import { TableData } from '@/api/table/types'
import { useAppStore } from '@/store/modules/app'
import { h, reactive, ref, unref, nextTick, onMounted, computed, provide } from 'vue'
import { useEmitt } from '@/hooks/web/useEmitt'
import { FormSchema } from '@/types/form'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { TableColumn } from '@/types/table'
import KnowledgeTodoForm from './components/KnowledgeTodoForm.vue'
import { useCache } from '@/hooks/web/useCache'

defineOptions({
  name: 'User'
})

type a = {
  modelValue: number
}

const props = withDefaults(defineProps<a>(), {
  modelValue: 0
})

const emit = defineEmits<{
  (e: 'update:modelValue', data: number): void
}>()
const appStore = useAppStore()
const KnowledgeTodoFormRef = ref()
// 视窗高度
const documentClientHeight = computed(() => appStore.getDocumentClientHeight)

const { required, notSpace } = useValidator()

const params = reactive<Recordable>({
  knowledgeName: null,
  status: 0
  // params: paramsMap
})
const { register, tableObject, methods } = useTable<TableData>({
  getListApi: todoListApi,
  delListApi: delKonwledgApi,
  response: {
    list: 'rows',
    total: 'total'
  },
  defaultParams: params
})

const dataList = ref([])
const getDeptTreeList = async () => {
  try {
    const res = await todoListApi({
      pageNum: 1,
      pageSize: 9999
    })

    emit('update:modelValue', res.rows.filter((v) => v.status == 0).length)

    dataList.value = res.rows
      .filter((v) => {
        return v.parentId == 0
      })
      .map((v) => {
        return {
          value: v.id,
          label: v.knowledgeName
        }
      })

    dataList.value.unshift({
      value: 0,
      label: '无'
    })

    console.log(dataList.value)
  } catch (err) {
    console.log(err)
  }
}
provide('dataList', dataList)
getDeptTreeList()

const { getList, setSearchParams } = methods

getList()

const { wsCache } = useCache()
//搜索
const setSearchParamsSub = (param: Recordable) => {
  params.status = param.status || param.status === 0 ? param.status : null
  params.knowledgeName = param.knowledgeName ? param.knowledgeName : null
  setSearchParams(params)
}

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
    field: 'knowledgeName',
    label: '知识分类',
    minWidth: '100px',
    table: {
      show: true
    },
    search: {
      show: true,
      componentProps: {
        placeholder: '分类名称筛选',
        style: 'width: 196px'
      }
    },
    formatter: (row: Recordable) => {
      return h('span', row.knowledgeName ? row.knowledgeName : '--')
    }
  },
  {
    field: 'parentId',
    label: '父分类',
    minWidth: '100px',
    table: {
      show: true
    },
    formatter: (row: Recordable) => {
      return h('span', row.parentId ? getElTagLabel(row.parentId) : '--')
    }
  },
  {
    field: 'status',
    label: '审核状态',
    minWidth: '80px',
    table: {
      show: true
    },
    search: {
      value: 0,
      show: true,
      component: 'Select',
      componentProps: {
        style: 'width: 196px',
        options: [
          {
            label: '待审核',
            value: 0
          },
          {
            label: '已审核',
            value: 1
          },
          {
            label: '已驳回',
            value: -1
          }
        ],
        placeholder: '审核状态筛选',
        filterable: true
      }
    },
    formatter: (row: Recordable, __: TableColumn, cellValue: string) => {
      return h(
        ElTag,
        {
          type: cellValue == '0' ? 'warning' : cellValue == 1 ? 'success' : 'error'
        },
        () => (cellValue == 0 ? '待审核' : cellValue == 1 ? '已审核' : '已驳回')
      )
    }
  },
  {
    field: 'createByName',
    label: '创建人',
    minWidth: '110px',
    table: {
      show: true
    },
    formatter: (row: Recordable) => {
      return h('span', row.createByName ? row.createByName : '--')
    }
  },
  {
    field: 'auditUserName',
    label: '审核人',
    minWidth: '110px',
    table: {
      show: true
    },
    formatter: (row: Recordable) => {
      return h(
        'span',
        row.auditUserName && (row.status == 1 || row.status == -1) ? row.auditUserName : '--'
      )
    }
  },
  {
    field: 'updateTime',
    minWidth: '120px',
    label: '更新时间',
    table: {
      show: true
    },
    formatter: (row: Recordable) => {
      return h('span', row.updateTime ? row.updateTime : '--')
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

// 表单项
const schema = reactive<FormSchema[]>([
  {
    field: 'backReason', // key
    label: '驳回原因', // label
    component: 'Input', // 使用组件
    colProps: {
      // 所占col
      span: 24
    },
    componentProps: {
      disabled: false,
      //组件配置
      type: 'textarea',
      style: 'width:100%;', //宽度
      maxlength: 500, //最大输入长度
      autosize: true,
      controlsPosition: 'right'
    },
    formItemProps: {
      // 表单校验
      rules: [
        required(),
        {
          validator: (rule: any, value: string, callback: Callback) =>
            notSpace(value, callback, '不能输入纯空格'),
          trigger: 'blur'
        }
      ]
    }
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)

const AddAction = (row) => {
  KnowledgeTodoFormRef.value.openDrawer('', row.id)
}

const dialogVisible = ref(false)
const dialogId = ref()
const dialogClick = (row) => {
  dialogId.value = row.id
  dialogVisible.value = true
}

const getElTagLabel = (value: string): string => {
  let label = ''
  unref(dataList).map((item: any) => {
    if (Number(value) === Number(item.value)) {
      label = item.label
    }
  })
  return label
}

const bohuiIds: any = ref([])
// 批量
const piliang = async (row: any, status: number) => {
  tableObject.currentRow = row
  const { delList, getSelections } = methods
  const selections = await getSelections()

  if (selections.length == 0) {
    ElMessage.warning('请选择数据！')
    return
  }

  if (selections.some((v) => v.status == 1 || v.status == -1)) {
    ElMessage.warning('存在已审批的数据，请重新选择！')
    return
  }
  // 判断是否是批量操作
  if (status == -1) {
    bohuiIds.value = selections.map((v) => {
      return v.id
    })
    dialogVisible.value = true
  } else {
    ElMessageBox.confirm('是否批量通过？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      autofocus: false
    }).then(async () => {
      const ids = selections.map((v) => {
        return v.id
      })
      const data = {
        ids: ids,
        status: 1,
        auditUserId: wsCache.get('userInfo').userId,
        auditUserName: wsCache.get('userInfo').nickName
      }
      piliangEdit(data)
    })
  }
}

const sureClick = async (row) => {
  ElMessageBox.confirm('是否通过？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    autofocus: false
  }).then(async () => {
    const data = {
      status: 1,
      ids: [row.id],
      auditUserId: wsCache.get('userInfo').userId,
      auditUserName: wsCache.get('userInfo').nickName
    }
    piliangEdit(data)
  })
}

const formRef = ref()
const sureLoading = ref(false)
const resetPwdSure = async () => {
  const form = unref(formRef)
  const elFormRef = form?.getElFormRef()
  await elFormRef?.validate(async (isValid) => {
    if (isValid) {
      let data = form?.formModel as any
      if (bohuiIds.value.length > 0) {
        data.ids = bohuiIds.value
        data.status = -1
        data.auditUserId = wsCache.get('userInfo').userId
        data.auditUserName = wsCache.get('userInfo').nickName
        data.backReason = data.backReason ? data.backReason : ''
        piliangEdit(data)
      } else {
        data.status = -1
        data.ids = [dialogId.value]
        data.auditUserId = wsCache.get('userInfo').userId
        data.auditUserName = wsCache.get('userInfo').nickName
        data.backReason = data.backReason ? data.backReason : ''
        sureLoading.value = true
        piliangEdit(data)
      }
    }
  })
}

const piliangEdit = async (data) => {
  const res = await batchOperatorApi(data)
    .catch(() => {})
    .finally(() => {
      sureLoading.value = false
    })
  if (res) {
    if (data.status == 1) {
      ElMessage.success('审核通过')
    } else {
      ElMessage.success('驳回成功')
      dialogVisible.value = false
    }
    emit('update:modelValue', props.modelValue - 1)
    selectionList.value = []
    getList()
  }
}

// const bohui = async (data) => {
//   const res = await editKonwledgApi(data)
//     .catch(() => {})
//     .finally(() => {
//       sureLoading.value = false
//     })
//   if (res) {
//     ElMessage.success('驳回成功')
//     dialogVisible.value = false
//     getList()
//   }
// }
const selectionList = ref([])
// const tonggu = async (data) => {
//   const res = await editKonwledgApi(data)
//     .catch(() => {})
//     .finally(() => {})
//   if (res) {
//     ElMessage.success('审核通过')
//     getList()
//   }
// }

// 注册
onMounted(() => {
  resetTableHeight()
})
</script>

<template>
  <section>
    <Table
      v-model:pageSize="tableObject.pageSize"
      v-model:currentPage="tableObject.currentPage"
      :columns="allSchemas.tableColumns"
      :isShowCell="isShowCell"
      :isShowFilter="true"
      :choose-list-all="selectionList"
      :height="defaultHeight"
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
          v-if="isAuth('system:knowledgeClass:query')"
          :schema="allSchemas.searchSchema"
          @search="setSearchParamsSub"
          @reset="setSearchParamsSub"
        />
      </template>
      <template #id="{ $index }">
        <span>{{
          $index + 1 + tableObject.pageSize * (tableObject.currentPage - 1)
        }}</span></template
      >
      <template #operateBtnRight>
        <ElButton
          class="no-bg-button"
          v-hasPermi="'system:user:add'"
          @click="piliang(null, 1)"
          plain
        >
          批量通过
        </ElButton>
        <ElButton
          class="no-bg-button"
          v-hasPermi="'system:user:add'"
          @click="piliang(null, -1)"
          plain
        >
          <!-- <template #icon>
            <Icon :size="14" icon="svg-icon:addBut" />
          </template> -->
          批量驳回
        </ElButton>
      </template>
      <template #status="{ row }">
        <div class="audit-state">
          <p v-if="row.status == 0" class="wait">
            <Icon :size="14" icon="svg-icon:state_icon2" />
            <span>待审核</span>
          </p>
          <p v-else-if="row.status == 1" class="pass">
            <Icon :size="14" icon="svg-icon:state_icon1" />
            <span>已审核</span>
          </p>
          <p v-else-if="row.status == -1" class="reject">
            <Icon :size="14" icon="svg-icon:state_icon5" />
            <span>已驳回</span>
          </p>
          <p v-else>--</p>
        </div>
      </template>
      <template #action="{ row }">
        <ElButton class="btn-default" :text="true" size="small" @click="AddAction(row)">
          详情
        </ElButton>
        <!-- <ElButton v-if="!row.admin" type="success" :text="true" @click="action(row, 'see')">
                            详情
                          </ElButton> -->
        <ElButton
          v-if="isAuth('system:knowledgeClass:pass') && row.status == 0"
          class="btn-default"
          :text="true"
          size="small"
          @click="sureClick(row)"
        >
          通过
        </ElButton>
        <ElButton
          v-if="isAuth('system:knowledgeClass:pass') && row.status == 0"
          class="btn-default"
          :text="true"
          size="small"
          @click="dialogClick(row)"
        >
          驳回
        </ElButton>
      </template>
    </Table>

    <KnowledgeTodoForm ref="KnowledgeTodoFormRef" />
    <Dialog
      v-model="dialogVisible"
      :maxHeight="'auto'"
      title="驳回原因"
      @closed="closePermissionDialog"
    >
      <Form ref="formRef" :schema="schema" class="userForm"> </Form>
      <template #footer>
        <ElButton type="primary" :loading="sureLoading" @click="resetPwdSure"> 确定</ElButton>
        <ElButton @click="dialogVisible = false">取消</ElButton>
      </template>
    </Dialog>
  </section>
</template>
