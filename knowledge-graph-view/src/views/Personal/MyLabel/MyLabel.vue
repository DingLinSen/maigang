<template>
  <div class="upload_table">
    <Breadcrumbs>
      <template #rightContent>
        <ElButton class="no-bg-button" @click="AddAction(null)">
          <template #icon>
            <Icon :size="14" icon="svg-icon:addBut" />
          </template>
          新增
        </ElButton>
      </template>
    </Breadcrumbs>
    <div>
      <Table
        :emptyText="'暂无数据'"
        v-model:pageSize="tableObject.pageSize"
        v-model:currentPage="tableObject.currentPage"
        :border="false"
        :selectionWidth="16"
        :columns="allSchemas.tableColumns"
        :data="tableObject.tableList"
        :loading="tableObject.loading"
        cotentAlign="left"
        headerAlign="left"
        @sort-change="achange"
        :statisticsList="true"
        :index="true"
        :selection="false"
        :height="defaultHeight"
        :isShowFilter="false"
        :cell-class-name="showColor"
        :choose-list-all="selectionList"
        @cell-mouse-enter="handleCell"
        @cell-mouse-leave="handleCell"
        @register="register"
        :pagination="{
          total: tableObject.total
        }"
      >
        <template #action="{ row }">
          <div class="flex justify-center">
            <ElButton
              v-if="isAuth('system:tag:edit')"
              class="btn-default"
              :text="true"
              size="small"
              @click="AddAction(row)"
            >
              编辑
            </ElButton>
            <ElButton
              v-if="isAuth('system:tag:remove')"
              class="btn-default"
              :text="true"
              size="small"
              @click="delData(row, false)"
            >
              删除
            </ElButton>
          </div>
        </template>
      </Table>
    </div>
    <TagForm ref="TagFormRef" @emitSuccess="emitSuccess" />
  </div>
</template>
<script setup lang="ts">
import { h, reactive, ref, nextTick, onMounted, computed, provide } from 'vue'
import Breadcrumbs from '../components/Breadcrumbs.vue'
import { useEmitt } from '@/hooks/web/useEmitt'
import { Table } from '@/components/Table'
import { Icon } from '@/components/Icon'
import { isAuth } from '@/utils/is'
import { useTable } from '@/hooks/web/useTable'
import { tagListApi, delKonwledgApi, taegptyApi } from '@/api/classification/tagManagement'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import TagForm from './components/TagForm.vue'
const TagFormRef = ref()
// 左侧树形数据
const treedata = ref<DeptTreeData>([])
const getOverViewWrapper = (dom: string): number => {
  let topH = 0
  const checkboxWrapper = document.querySelector(dom)
  if (checkboxWrapper) {
    topH = checkboxWrapper.clientHeight
  }
  return topH
}
const getPadding = (dom: string): number => {
  let topH = 0
  const checkboxWrapper = document.querySelector(dom)
  if (checkboxWrapper) {
    topH =
      parseFloat(getComputedStyle(checkboxWrapper).paddingBottom) +
      parseFloat(getComputedStyle(checkboxWrapper).paddingTop) +
      parseFloat(getComputedStyle(checkboxWrapper).marginBottom) +
      parseFloat(getComputedStyle(checkboxWrapper).marginTop)
  }
  return topH
}
const selectionList = ref([])
const defaultHeight = ref<number>(0)
const resetTableHeight = () => {
  const documentClientHeight = getOverViewWrapper('body')
  const overView = getOverViewWrapper('.v-tool-header')
  const tagsHeight: any = getOverViewWrapper('.tags-view-cont')
  // const tagsViewCont: any = document.querySelector('.tags-view-cont')

  const toolHeaderPadding = getPadding('.v-tool-header')
  const uploadTablePadding = getPadding('.upload_table')
  const tagsViewContMargin = getPadding('.tags-view-cont')
  const elPaginationHeight = getOverViewWrapper('.el-pagination')
  const elPaginationPadding = getPadding('.el-pagination')
  const overViewWrapper = getOverViewWrapper('#tags-view-cont')
  nextTick(() => {
    defaultHeight.value =
      documentClientHeight -
      overView -
      tagsHeight -
      elPaginationHeight -
      elPaginationPadding -
      overViewWrapper -
      tagsViewContMargin -
      uploadTablePadding -
      toolHeaderPadding
  })
}
useEmitt({
  name: 'window',
  callback: (type: string) => {
    if (type === 'resize') {
      resetTableHeight()
    }
  }
})

const delLoading = ref(false)
const delData = async (row: TableData | null, multiple: boolean) => {
  tableObject.currentRow = row
  const { delList, getSelections } = methods
  const selections = await getSelections()
  console.log(
    selections.map((v) => v.id),
    [tableObject.currentRow?.id as string]
  )

  delLoading.value = true
  await delList(
    multiple ? selections.map((v) => v.id) : [tableObject.currentRow?.id as string],
    multiple
  ).finally(() => {
    delLoading.value = false
  })
}

const dataList = ref([])
const kist = ref([])

const getDeptTreeList = async () => {
  try {
    const res: any = await taegptyApi()

    if (res) {
      kist.value = res.data
    }

    dataList.value = res.data
      .filter((v) => {
        return v.parentId != 0 && v.status == 1
      })
      .map((v) => {
        return {
          value: v.id,
          label: v.tagTypeName
        }
      })
    // const { data } = await getAllUserListApi({})
    let arr: any = []

    res.data.forEach((v) => {
      let obj = {}

      if (v.parentId != 0) {
      } else {
        obj = {
          id: v.id,
          label: v.tagTypeName,
          children: []
        }
        arr.push(obj)
      }
    })

    arr.forEach((j, index) => {
      res.data.forEach((v) => {
        if (j.id == v.parentId) {
          arr[index].children.push({
            id: v.id,
            label: v.tagTypeName
          })
        }
      })
    })
    treedata.value = arr
  } catch (err) {
    console.log(err)
  }
}
provide('treedata', treedata)
provide('kist', kist)
getDeptTreeList()

const AddAction = (row) => {
  getDeptTreeList()
  if (row) {
    TagFormRef.value.openDrawer('edit', row.id)
  } else {
    TagFormRef.value.openDrawer('add', '')
  }
}

const { register, tableObject, methods } = useTable<TableData>({
  getListApi: tagListApi,
  delListApi: delKonwledgApi,
  response: {
    list: 'rows',
    total: 'total'
  }
})

// 表格列
const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'name',
    label: '标签名',
    minWidth: '250px',
    table: {
      show: true
    },
    search: {
      show: true,
      componentProps: {
        placeholder: '标签名称筛选',
        style: 'width: 196px'
      }
    },
    formatter: (row: Recordable) => {
      return h('span', row.name ? row.name : '--')
    }
  },
  {
    field: 'tagTypeName',
    label: '标签类别',
    minWidth: '250px',
    table: {
      show: true
    },
    formatter: (row: Recordable) => {
      return h('span', row.tagTypeName ? row.tagTypeName : '--')
    }
  },
  {
    field: 'createByName',
    label: '创建人',
    minWidth: '60px',
    table: {
      show: true
    },
    formatter: (row: Recordable) => {
      return h('span', row.createByName ? row.createByName : '--')
    }
  },

  {
    field: 'createTime',
    minWidth: '120px',
    label: '创建时间',
    sortable: 'custom',
    table: {
      show: true
    },
    formatter: (row: Recordable) => {
      return h('span', row.createTime ? row.createTime : '--')
    }
  },

  {
    field: 'totalCites',
    minWidth: '60px',
    label: '引用次数',
    sortable: 'custom',
    table: {
      show: true
    },
    formatter: (row: Recordable) => {
      return h('span', row.totalCites ? row.totalCites : '--')
    }
  },
  {
    field: 'action',
    minWidth: '120px',
    showOverflowTooltip: false,
    table: {
      show: true
    },
    headerAlign: 'center',
    fixed: 'right',
    label: '操作'
  }
])
const { allSchemas } = useCrudSchemas(crudSchemas)

const achange = (e) => {
  let data = {}
  if (e.order) {
    data = {
      orderByColumn: e.prop,
      isAsc: e.order
    }
  }
  setSearchParams(data)
}
const { getList, setSearchParams } = methods
const handleCell = (row) => {
  row.show = !row.show
}

const showColor = ({ row }) => {
  console.log(selectionList.value, 888)
  const checkIdList = selectionList.value.map((item) => item.id)
  if (checkIdList.includes(row.id)) {
    return 'heli'
  }
}

const emitSuccess = () => {
  getList()
}
getList()
onMounted(() => {
  resetTableHeight()
})
</script>
<style lang="less">
.customPopper {
  width: 120px !important;
  min-width: 120px !important;
}
</style>
<style scoped lang="less">
.upload_table {
  padding: 20px;
}
.operationBtn {
  li {
    padding: 0 0 0 8px;
    cursor: pointer;
    margin: 8px 0;
  }
}

.title_box {
  padding-right: 20px;
  display: flex;
  justify-content: space-between;
  .title_name {
    min-width: 200px;
    text-align: left;
  }
}
</style>
