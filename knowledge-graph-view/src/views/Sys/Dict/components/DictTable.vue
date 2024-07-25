<script setup lang="ts">
import { DictDialog } from './index'
import { Search } from '@/components/Search'
import { ElButton, ElMessageBox, ElTooltip, ElTag, ElMessage } from 'element-plus'
import { Table } from '@/components/Table'
import { useTable } from '@/hooks/web/useTable'
import {
  getDictDataListApi,
  delDictDataListApi,
  getDictOptionApi,
  exportDictDataListApi,
  saveDictDataApi,
  editDictDataApi
} from '@/api/dict'
import { getCurrentInstance, h, nextTick, reactive, ref, unref } from 'vue'
import { propTypes } from '@/utils/propTypes'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { TableColumn } from '@/types/table'
import { DrawerWrap } from '@/components/DrawerWrap'
import { Dialog } from '@/components/Dialog'
import { DictData, DictTypeData } from '@/api/dict/types'
import { ComponentOptions } from '@/types/components'
import { FormSchema } from '@/types/form'
import { useEmitt } from '@/hooks/web/useEmitt'
// import { indent } from 'vue-types/dist/utils'

const { proxy } = getCurrentInstance() as any

const { sys_normal_disable } = proxy.useDict('sys_normal_disable')

const isShow = ref<boolean>(false)

const { register, tableObject, methods } = useTable<DictTypeData>({
  getListApi: getDictDataListApi,
  delListApi: delDictDataListApi,
  response: {
    list: 'rows',
    total: 'total'
  }
})

const detailsId = ref<string>('')

const { getList, setSearchParams } = methods
const nameOverflow = (name: string, length: number) => {
  let nextName = ''
  if (name && name.length) {
    if (name.length > length) {
      nextName = name.slice(0, length) + '...'
    } else {
      nextName = name
    }
  } else {
    nextName = ''
  }
  return nextName
}
const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'dictCode',
    label: '字典编码',
    minWidth: '120px'
  },
  {
    field: 'dictLabel',
    minWidth: '120px',
    label: '字典标签',
    showOverflowTooltip: false,
    search: {
      show: true
    },
    formatter: (row: Recordable, __: TableColumn, cellValue: string) => {
      let listClass = row.listClass
      return listClass
        ? h(
            ElTooltip,
            {
              content: cellValue
            },
            [
              // cellValue,
              h(
                ElTag,
                {
                  type:
                    listClass === 'success'
                      ? 'success'
                      : listClass === 'warning'
                      ? 'warning'
                      : listClass === 'info'
                      ? 'info'
                      : listClass === 'danger'
                      ? 'danger'
                      : '',
                  class: ['dict-cotent']
                },
                [cellValue]
              )
            ]
          )
        : null
    }
  },
  {
    field: 'dictValue',
    minWidth: '120px',
    label: '字典键值',
    formatter: (row: Recordable) => {
      return h('span', row.dictValue ? row.dictValue : '--')
    }
  },
  {
    field: 'dictSort',
    label: '字典排序',
    minWidth: '100px',
    formatter: (row: Recordable) => {
      return h('span', row.dictSort ? row.dictSort : '--')
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
    },
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        options: sys_normal_disable
      }
    }
  },
  {
    field: 'remark',
    minWidth: '220px',
    label: '备注',
    formatter: (row: Recordable) => {
      return h('span', row.remark ? row.remark : '--')
    }
  },
  {
    field: 'createTime',
    minWidth: '160px',
    label: '创建时间',
    formatter: (row: Recordable) => {
      return h('span', row.createTime ? row.createTime : '--')
    }
  },
  {
    field: 'action',
    minWidth: '180px',
    label: '操作'
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)

const dialogTitle = ref<string>('')

const drawerWrap = ref<ComponentRef<typeof DrawerWrap>>()

//打开drawer并初始化
const openDrawer = (type: string) => {
  detailsId.value = type
  drawerWrap.value.isShow = true
  getOptionSelectData()
}

let typeOptions: ComponentOptions[] = []

//字典名称
const getOptionSelectData = async () => {
  const res = await getDictOptionApi()
  if (res && res.data) {
    let menuTempArray: any = []
    res.data.map((item: any) => {
      menuTempArray.push({ value: item.dictType, label: item.dictName })
    })
    typeOptions = menuTempArray
    setDictTypeSelectValue()
    getDetailsData()
  }
}

const searchRef = ref<ComponentRef<typeof Search>>()

//给菜单树赋值
const setDictTypeSelectValue = () => {
  unref(searchRef).setSchema([
    {
      field: 'dictType',
      path: 'componentProps.options',
      value: typeOptions
    }
  ])
  unref(searchRef).setValues({
    dictType: detailsId.value
  })
}

const getDetailsData = async () => {
  const param = await unref(searchRef).getFormData()
  params.dictType = param.dictType ? param.dictType : ''
  params.dictLabel = param.dictLabel ? param.dictLabel : ''
  params.status = param.status ? param.status : ''
  setSearchParams(params)
}

const params = reactive<Recordable>({
  dictType: detailsId.value,
  dictLabel: '',
  status: ''
})

//搜索
const setSearchParamsSub = (param: Recordable) => {
  params.dictType = param.dictType ? param.dictType : detailsId.value
  params.dictLabel = param.dictLabel ? param.dictLabel : ''
  params.status = param.status ? param.status : ''
  setSearchParams(params)
}

const resetSearchParamsSub = (param: Recordable) => {
  unref(searchRef).setValues({
    dictType: detailsId.value
  })
  params.dictType = detailsId.value
  params.dictLabel = ''
  params.status = ''
  setSearchParams(params)
}

//关闭drawer
const closeDrawer = () => {
  drawerWrap.value.isShow = false
}

//字典数据弹框
//字典数据新增的dictType
const dictType = ref<string>('')

const dictDialogRef = ref<ComponentRef<typeof DictDialog>>()

const dialogVisible = ref(false)

const ElDialogFef = ref()

const sureLoading = ref(false)

//保存数据
const dictDataSure = async () => {
  //表单验证
  const form = unref(unref(dictDialogRef).formRef)
  const elFormRef = form?.getElFormRef()
  await elFormRef?.validate(async (isValid) => {
    if (isValid) {
      sureLoading.value = true
      let data = form?.formModel as DictTypeData
      if (data.dictCode && dictType) {
        editDict(data)
      } else {
        data.dictCode = ''
        addDict(data)
      }
    }
  })
}

//新增字典
const editDict = async (data: DictTypeData) => {
  const res = await editDictDataApi(data).finally(() => {
    setTimeout(() => {
      sureLoading.value = false
    }, 200)
  })
  if (res) {
    ElMessage.success('保存信息成功')
    dialogVisible.value = false
    getList()
  }
}

//新增字典
const addDict = async (data: DictTypeData) => {
  const res = await saveDictDataApi(data).finally(() => {
    setTimeout(() => {
      sureLoading.value = false
    }, 200)
  })
  if (res) {
    ElMessage.success('保存信息成功')
    dialogVisible.value = false
    getList()
  }
}

// 是否显示筛选窗口
const isShowCell = ref(false)

// 筛选列
const showCell = () => {
  isShowCell.value = !isShowCell.value
}

const exLoading = ref(false)

const closeDialog = () => {
  document.getElementsByTagName('body')[0].className = ''
  document.getElementsByTagName('body')[0].style.width = '100%'
}

const schema = reactive<FormSchema[]>([
  {
    field: 'dictType',
    // label: '字典名称',
    component: 'Select',
    componentProps: {
      placeholder: '字典名称筛选',
      clearable: false,
      options: unref(typeOptions)
    }
  },
  {
    field: 'dictLabel',

    // label: '字典标签',
    component: 'Input',
    componentProps: {
      placeholder: '字典标签筛选'
    }
  },
  {
    field: 'status',
    // label: '状态',
    component: 'Select',
    componentProps: {
      placeholder: '状态筛选',
      options: sys_normal_disable
    }
  }
])

//添加字典数据
const AddAction = () => {
  dictType.value = params.dictType
  tableObject.currentRow = null
  dialogVisible.value = true
  ElDialogFef.value.isFullscreen = false
  dialogTitle.value = '字典数据新增'
  document.getElementsByTagName('body')[0].style.width = '100%'
}

//table操作栏按钮事件
const action = (row: DictTypeData, type: string) => {
  if (type === 'edit') {
    dictType.value = ''
    tableObject.currentRow = row
    dialogVisible.value = true
    ElDialogFef.value.isFullscreen = false
    dialogTitle.value = '字典数据编辑'
    document.getElementsByTagName('body')[0].style.width = '100%'
  }
}

//导出
const exportForm = async () => {
  if (tableObject.tableList.length === 0) {
    ElMessage.warning('查询无数据, 无需导出数据')
    return
  }
  exLoading.value = true
  await exportDictDataListApi(params)
  exLoading.value = false
}

//删除
const delLoading = ref(false)
const delData = async (row: DictTypeData | null, multiple: boolean) => {
  tableObject.currentRow = row
  const { delList, getSelections } = methods
  const selections = await getSelections()
  delLoading.value = true
  await delList(
    multiple ? selections.map((v) => v.dictCode) : [tableObject.currentRow?.dictCode as string],
    multiple
  ).finally(() => {
    delLoading.value = false
  })
}

defineExpose({
  isShow,
  openDrawer
})
</script>

<template>
  <DrawerWrap title="字典数据" :isShow="isShow" ref="drawerWrap">
    <template #content>
      <Search
        ref="searchRef"
        :schema="schema"
        :model="params"
        @search="setSearchParamsSub"
        @reset="resetSearchParamsSub"
      />

      <div></div>
      <Table
        v-model:pageSize="tableObject.pageSize"
        v-model:currentPage="tableObject.currentPage"
        :columns="allSchemas.tableColumns"
        :data="tableObject.tableList"
        :loading="tableObject.loading"
        :border="true"
        :header-align="'center'"
        :cotentAlign="'center'"
        :pagination="{
          total: tableObject.total
        }"
        :isShowCell="isShowCell"
        :isDrawer="true"
        @register="register"
      >
        <template #operateBtnLeft>
          <div class="mb-10px">
            <ElButton class="btn-add" type="primary" @click="AddAction" plain>
              <Icon icon="ep:plus" class="mr-5px" />
              新增
            </ElButton>

            <ElButton
              class="btn-other"
              :loading="exLoading"
              type="warning"
              @click="exportForm()"
              plain
            >
              <template #icon>
                <Icon :size="14" icon="svg-icon:exportBut" />
              </template>
              导出
            </ElButton>

            <ElButton :loading="delLoading" class="btn-other" @click="delData(null, true)" plain>
              <template #icon>
                <Icon :size="14" icon="svg-icon:deleteBut" />
              </template>
              删除
            </ElButton>
          </div>
        </template>
        <template #action="{ row }">
          <ElButton
            v-hasPermi="['system:user:remove']"
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

          <!--                    <ElButton type="primary" @click="action(row, 'edit')" :text="true" size="small">-->
          <!--                        <Icon icon="ep:edit" class="mr-5px"/>-->
          <!--                        编辑-->
          <!--                    </ElButton>-->
          <!--                    <ElButton type="danger" @click="delData(row, false)" :text="true" size="small">-->
          <!--                        <Icon icon="ep:delete" class="mr-5px"/>-->
          <!--                        删除-->
          <!--                    </ElButton>-->
        </template>
      </Table>
    </template>
  </DrawerWrap>

  <Dialog ref="ElDialogFef" v-model="dialogVisible" :title="dialogTitle" @closed="closeDialog">
    <DictDialog ref="dictDialogRef" :current-row="tableObject.currentRow" :dict-type="dictType" />

    <template #footer>
      <ElButton type="primary" :loading="sureLoading" @click="dictDataSure"> 确定</ElButton>
      <ElButton @click="dialogVisible = false">取消</ElButton>
    </template>
  </Dialog>
</template>

<style lang="less">
.dict-cotent {
  max-width: 100%;
  .el-tag__content {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
