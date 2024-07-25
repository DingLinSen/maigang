<script setup lang="ts">
import { h, nextTick, reactive, ref, watch } from 'vue'
import { ElTag } from 'element-plus'
import { Search } from '@/components/Search'
import { Table, TableExpose } from '@/components/Table'
import { useTable } from '@/hooks/web/useTable'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'

import { TableColumn } from '@/types/table'
import { getRoleAllUserListApi } from '@/api/role'

import { AuthUserData } from '@/api/role/types'

const props = defineProps({
  roleId: {
    type: String,
    default: () => ''
  }
})

const tableRef = ref<TableExpose>()

const selectIds = reactive<string[]>([])

// const { emitter } = useEmitt({
//   name: 'tableList',
//   callback: (type: string) => {
//     if (type === 'refresh') {
//       nextTick(() => {
//         const elTable = unref(tableRef)?.elTableRef
//         elTable?.clearSelection()
//         tableObject.tableList.map(async (item) => {
//           if (selectIds && selectIds.length > 0 && selectIds.indexOf(item.userId) > -1) {
//             elTable?.toggleRowSelection(item, true)
//           } else {
//             elTable?.toggleRowSelection(item, false)
//           }
//         })
//       })
//     }
//   }
// })

const { register, tableObject, methods } = useTable<AuthUserData>({
  getListApi: getRoleAllUserListApi,
  response: {
    list: 'rows',
    total: 'total'
  }
})

const { setSearchParams } = methods

const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'userName',
    label: '用户名称',
    minWidth: '120px',
    search: {
      show: true,
      componentProps: {
        clearable: false
      }
    },
    formatter: (row: Recordable) => {
      return h('span', row.userName ? row.userName : '--')
    }
  },
  {
    field: 'nickName',
    minWidth: '100px',
    label: '用户昵称',
    formatter: (row: Recordable) => {
      return h('span', row.nickName ? row.nickName : '--')
    }
  },
  {
    field: 'email',
    minWidth: '120px',
    label: '邮箱',
    formatter: (row: Recordable) => {
      return h('span', row.email ? row.email : '--')
    }
  },
  {
    field: 'phonenumber',
    label: '手机号码',
    minWidth: '120px',
    search: {
      show: true,
      componentProps: {
        clearable: false
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
    formatter: (_: Recordable, __: TableColumn, cellValue: string) => {
      return h(
        ElTag,
        {
          type: cellValue === '0' ? '' : 'danger'
        },
        () => (cellValue === '0' ? '正常' : '停用')
      )
    }
  },
  {
    field: 'createTime',
    minWidth: '140px',
    label: '创建时间',
    formatter: (row: Recordable) => {
      return h('span', row.createTime ? row.createTime : '--')
    }
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)

const getAllSelections = async () => {
  const { getSelections } = methods
  const selections: AuthUserData[] = await getSelections()
  return selections
}

const selectAll = (selection: Recordable[]) => {
  if (selection.length > 0) {
    selection.map((item) => {
      if (selectIds.indexOf(item.userId) < 0) {
        selectIds.push(item.userId)
      }
    })
  } else {
    tableObject.tableList.map((item) => {
      if (selectIds.indexOf(item.userId) > -1) {
        selectIds.splice(selectIds.indexOf(item.userId), 1)
      }
    })
  }
}

const selectOne = (selection: Recordable[], _: Recordable) => {
  selectAll(selection)
}

const dialogHeight = ref(400)
const isDialogFull = ref(false)

const openDialog = (roleId: String) => {
  params.roleId = roleId
  setSearchParams(params)
}

const resetTableHeight = (isFull: boolean) => {
  isDialogFull.value = isFull
  resetTableHeights(isDialogFull.value)
}

const resetTableHeights = (isFull: boolean) => {
  nextTick(() => {
    if (isFull) {
      setTimeout(() => {
        const dialogBody = document.querySelector('.el-dialog__body')
        if (dialogBody) {
          dialogHeight.value = dialogBody.clientHeight - 160
        }
      }, 100)
    } else {
      dialogHeight.value = 400
    }
  })
}

const params = reactive<Recordable>({
  roleId: '',
  userName: '',
  phonenumber: ''
})

//搜索
const setSearchParamsSub = (param: Recordable) => {
  params.userName = param.userName ? param.userName : ''
  params.phonenumber = param.phonenumber ? param.phonenumber : ''
  setSearchParams(params)
}

watch(
  () => props.roleId,
  (roleId) => {
    if (!roleId) return
    openDialog(roleId)
  },
  {
    deep: true,
    immediate: true
  }
)

defineExpose({
  selectIds,
  getAllSelections,
  resetTableHeight
})
</script>
<template>
  <Search
    :schema="allSchemas.searchSchema"
    @search="setSearchParamsSub"
    @reset="setSearchParamsSub"
  />
  <Table
    ref="tableRef"
    v-model:pageSize="tableObject.pageSize"
    v-model:currentPage="tableObject.currentPage"
    :columns="allSchemas.tableColumns"
    :data="tableObject.tableList"
    :loading="tableObject.loading"
    :border="true"
    :header-align="'center'"
    :align="'center'"
    :pagination="{
      total: tableObject.total
    }"
    :height="dialogHeight"
    @select-all="selectAll"
    @select="selectOne"
    @register="register"
  />
</template>
<style lang="less" scoped>
:deep(.el-scrollbar__bar is-vertical) {
  display: none !important;
}
</style>
