<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import type { DeptTreeData } from '@/api/user/types'
import { isAuth } from '@/utils/is'
import { ElButton } from 'element-plus'
import { Table } from '@/components/Table'
import { tagListApi, delKonwledgApi, taegptyApi } from '@/api/classification/tagManagement'
import { useTable } from '@/hooks/web/useTable'
import { TableData } from '@/api/table/types'
import { useAppStore } from '@/store/modules/app'
import { h, reactive, ref, nextTick, onMounted, computed, provide } from 'vue'
import { useEmitt } from '@/hooks/web/useEmitt'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import TagForm from './components/TagForm.vue'

defineOptions({
  name: 'Tag'
})

const appStore = useAppStore()

const TagFormRef = ref()

// 视窗高度
const documentClientHeight = computed(() => appStore.getDocumentClientHeight)

// 左侧树形数据
const treedata = ref<DeptTreeData>([])

const { register, tableObject, methods } = useTable<TableData>({
  getListApi: tagListApi,
  delListApi: delKonwledgApi,
  response: {
    list: 'rows',
    total: 'total'
  }
})

const { getList, setSearchParams } = methods
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
getList()

//导出加载
const deptId = ref()
const params = reactive<Recordable>({
  name: null
  // params: paramsMap
})

//搜索
const setSearchParamsSub = (param: Recordable) => {
  params.name = param.name ? param.name : null
  setSearchParams(params)
}

const { emitter } = useEmitt({
  name: 'getTagList',
  callback: (type: string) => {
    if (type === 'add') {
      tableObject.currentPage = 1
    }
    dataList.value = []
    getDeptTreeList()
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
    field: 'name',
    label: '标签名称',
    minWidth: '100px',
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
    field: 'tagTypeId',
    label: '标签分类',
    minWidth: '100px',
    table: {
      show: true
    },
    formatter: (row: Recordable) => {
      return h('span', row.tagTypeId ? getElTagLabel(row.tagTypeId) : '--')
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
    minWidth: '120px',
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
    minWidth: '180px',
    showOverflowTooltip: false,
    table: {
      show: true
    },
    fixed: 'right',
    label: '操作'
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)

const AddAction = (row) => {
  getDeptTreeList()
  if (row) {
    TagFormRef.value.openDrawer('edit', row.id)
  } else {
    TagFormRef.value.openDrawer('add', '')
  }
}

//删除加载
const delLoading = ref(false)

// 删除
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
const getElTagLabel = (value: string): string => {
  let label = '--'
  kist.value.forEach((item: any) => {
    if (Number(value) === Number(item.id)) {
      label = item.tagTypeName
    }
  })
  return label
}

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

// 注册
onMounted(() => {
  resetTableHeight()
})
</script>

<template>
  <section>
    <ContentWrap :isShowtitle="false">
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
        @sort-change="achange"
        @register="register"
      >
        <template #operateBtnLeft>
          <Search
            ref="searchRef"
            v-if="isAuth('system:tag:query')"
            :schema="allSchemas.searchSchema"
            @search="setSearchParamsSub"
            @reset="setSearchParamsSub"
          />
        </template>
        <template #operateBtnRight>
          <ElButton
            class="no-bg-button"
            v-hasPermi="'system:tag:add'"
            @click="AddAction(null)"
            plain
          >
            <template #icon>
              <Icon :size="14" icon="svg-icon:addBut" />
            </template>
            新增
          </ElButton>
        </template>
        <template #id="{ $index }">
          <span>{{
            $index + 1 + tableObject.pageSize * (tableObject.currentPage - 1)
          }}</span></template
        >
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
          <ElButton
            v-if="isAuth('system:tag:edit')"
            class="btn-default"
            :text="true"
            size="small"
            @click="AddAction(row)"
          >
            编辑
          </ElButton>
          <!-- <ElButton v-if="!row.admin" type="success" :text="true" @click="action(row, 'see')">
                            详情
                          </ElButton> -->
          <ElButton
            v-if="isAuth('system:tag:remove')"
            class="btn-default"
            :text="true"
            size="small"
            @click="delData(row, false)"
          >
            删除
          </ElButton>
        </template>
      </Table>
    </ContentWrap>

    <TagForm ref="TagFormRef" />

    <!-- 分配角色 -->
    <RoleTable @select-role="register" ref="roleTableRef" />
  </section>
</template>
