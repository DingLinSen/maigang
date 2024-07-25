<template>
  <Dialog
    ref="TagsDialogRef"
    width="80%"
    v-model="TagsDialogVisible"
    title="选择标签"
    @closed="closed"
    class="tagDialog"
  >
    <Table
      ref="multipleTableRef"
      v-model:pageSize="tableObject.pageSize"
      v-model:currentPage="tableObject.currentPage"
      border
      stripe
      :columns="allSchemas.tableColumns"
      :isShowCell="isShowCell"
      :isShowFilter="false"
      :data="tableObject.tableList"
      :loading="tableObject.loading"
      :cotentAlign="tableObject.align"
      :headerAlign="tableObject.headerAlign"
      :choose-list-all="selectionList"
      :pagination="{
        total: tableObject.total
      }"
      @register="register"
    >
      <template #operateBtnLeft>
        <Search
          ref="searchRef"
          :schema="allSchemas.searchSchema"
          @reset="setSearchParamsSub"
          @search="setSearchParamsSub"
        />
      </template>
      <template #operateBtnRight>
        <ElButton class="btn-add" plain @click="openAddTagsDialog">
          <template #icon>
            <Icon :size="14" icon="svg-icon:addBut" />
          </template>
          新增
        </ElButton>
      </template>
      <template #tagsTop>
        <div class="check-list">
          <div class="item-list">
            <div class="check-item" v-for="(item, index) in selectionList" :key="item">
              <div class="check-name">
                {{ item.name }}
              </div>
              <span style="font-size: 18px; cursor: pointer" @click="handleClose(index)">×</span>
            </div>
            <div class="close-all" @click="closeAll" v-if="selectionList.length">清空</div>
          </div>
        </div>
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
    </Table>
    <template #footer>
      <div class="footer">
        <el-button type="primary" :loading="loading" @click="save">确定</el-button>
        <el-button @click="back">取消</el-button>
      </div>
    </template>
    <Dialog ref="AddTagsDialogRef" v-model="AddTagsDialogVisible" title="新增标签">
      <Form :schema="schema" ref="formRef">
        <template #status>
          <el-radio v-model="radio" label="1">启用</el-radio>
          <el-radio v-model="radio" label="2">禁用</el-radio>
        </template>
      </Form>
      <template #footer>
        <div class="footer">
          <el-button type="primary" :loading="loading" @click="saveAddTagsDialog">确定</el-button>
          <el-button @click="backAddTagseDialog">取消</el-button>
        </div>
      </template>
    </Dialog>
  </Dialog>
</template>
<script setup lang="ts">
import { h, reactive, ref, unref, nextTick, watch } from 'vue'
import { Table } from '@/components/Table'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { Search } from '@/components/Search'
import { Dialog } from '@/components/Dialog'
import { Form } from '@/components/Form'
import { FormSchema } from '@/types/form'
import { updateTagsApi } from '@/api/personal/myUpload'
import { useTable } from '@/hooks/web/useTable'
import { useValidator } from '@/hooks/web/useValidator'
import { ElMessage } from 'element-plus'
import {
  tagListAllApi,
  delKonwledgApi,
  tagAddApi,
  taegptyApi
} from '@/api/classification/tagManagement'
import { setIndex } from '@/components/Table/src/helper'
// 引入表单校验
const { required } = useValidator()
const emit = defineEmits(['handleTag', 'resetPage'])
const props = defineProps({
  isDetail: {
    type: Boolean,
    default: false
  },
  detailId: {
    type: String,
    default: ''
  }
})
const loading = ref<boolean>(false)
const formRef = ref()
const searchRef = ref()
// 标签弹窗默认关闭
const TagsDialogVisible = ref<boolean>(false)
// 新增标签弹窗默认关闭
const AddTagsDialogVisible = ref<boolean>(false)
const { register, tableObject, methods, elTableRef } = useTable({
  getListApi: tagListAllApi,
  delListApi: delKonwledgApi,
  response: {
    list: 'rows',
    total: 'total'
  }
})
const { getList, setSearchParams, getSelections } = methods
const kist = ref([])
const radio = ref('1')
const params = reactive<any>({
  name: ''
})
const selectList = ref()
const getDeptTreeList = async () => {
  try {
    const res: any = await taegptyApi()
    if (res) {
      kist.value = res.data
    }
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
    selectList.value = arr
  } catch (err) {
    console.log(err)
  }
}
getDeptTreeList()
const getElTagLabel = (value: string): string => {
  let label = '--'
  kist.value.forEach((item: any) => {
    if (Number(value) === Number(item.id)) {
      label = item.tagTypeName
    }
  })
  return label
}
// 清空
const closeAll = () => {
  selectionList.value = []
  nextTick()
  tableObject.tableList.forEach((item: any) => {
    let delItem = selectionList.value.find((ele) => ele.id == item.id)
    setTimeout(() => {
      elTableRef.value?.toggleRowSelection(delItem, false)
    }, 200)
  })
}
// 删除选中的
const handleClose = (index) => {
  nextTick()
  let delItem = tableObject.tableList.find((item: any) => item.id == selectionList.value[index].id)
  setTimeout(() => {
    elTableRef.value?.toggleRowSelection(delItem, false)
  }, 200)
  selectionList.value.splice(index, 1)
}
// 存放表格的数据
const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'id',
    label: '序号',
    width: '80px'
  },
  {
    field: 'name',
    label: '标签名称',
    minWidth: '240px',
    formatter: (row: Recordable) => {
      return h('span', row.name ? row.name : '--')
    },
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        style: 'width: 196px',
        placeholder: '请输入标签名'
      }
    }
  },
  {
    field: 'tagTypeName',
    label: '标签分类',
    minWidth: '100px',
    formatter: (row: Recordable) => {
      return h('span', row.tagTypeName ? row.tagTypeName : '--')
    }
  },
  {
    field: 'createByName',
    label: '创建人',
    minWidth: '80px'
    // formatter: (row: Recordable) => {
    //   return h('span', row.title ? row.title : '--')
    // }
  },
  {
    field: 'createTime',
    label: '创建时间',
    minWidth: '120px'
    // formatter: (row: Recordable) => {
    //   return h('span', row.title ? row.title : '--')
    // }
  },
  {
    field: 'totalCites',
    label: '引用次数',
    minWidth: '100px'
    // formatter: (row: Recordable) => {
    //   return h('span', row.title ? row.title : '--')
    // }
  }
])
// 表单的数据
const schema = reactive<FormSchema[]>([
  {
    field: 'name',
    label: '标签名称',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      maxlength: 20,
      clearable: false
    },
    formItemProps: {
      // 表单校验
      rules: [required()]
    }
  },
  {
    field: 'tagTypeId', // key
    label: '标签分类', // label
    colProps: {
      // 所占col
      span: 24
    },
    component: 'Cascader',
    componentProps: {
      placeholder: '请选择标签分类',
      filterable: true,
      options: [],
      popperClass: 'tagpor',
      props: {
        checkStrictly: true,
        label: 'label',
        value: 'id'
      },
      style: 'width:100%;' //宽度
    },
    formItemProps: {
      // 表单校验
      rules: [required()]
    }
  }
  // {
  //   field: 'status',
  //   label: '状态',
  //   colProps: {
  //     span: 24
  //   }
  // }
])
const { allSchemas } = useCrudSchemas(crudSchemas)
//搜索
const setSearchParamsSub = (param: Recordable) => {
  params.name = param.name ? param.name : null
  setSearchParams(params)
}
const multipleTableRef = ref<any>()
const selectionList = ref<any>([])
// 打开弹出框
const openDialog = async (data) => {
  await nextTick(() => {
    if (unref(searchRef)) {
      unref(searchRef).setValues({
        name: ''
      })
    }
  })
  selectionList.value = []
  if (data && data.length) {
    data.forEach((item: any) => {
      selectionList.value.push({
        id: item.id,
        name: item.tagTypeName
      })
    })
  }
  setSearchParamsSub({ name: '' })
  TagsDialogVisible.value = true
}
const tagList = ref<any>([])
// 点击确认
const save = async () => {
  tagList.value = []
  if (selectionList.value && selectionList.value.length) {
    if (props.isDetail) {
      selectionList.value.forEach((item) => {
        tagList.value.push({
          id: item.id
        })
      })
      updateTagsApi({
        id: props.detailId,
        tagTypeList: tagList.value
      }).then(() => {
        ElMessage.success('标签调整成功')
        emit('resetPage')
        TagsDialogVisible.value = false
      })
    } else {
      selectionList.value.forEach((item) => {
        tagList.value.push({
          id: item.id,
          tagTypeName: item.name
        })
      })
      emit('handleTag', tagList.value)
      TagsDialogVisible.value = false
    }
  } else {
    ElMessage.warning('请选择数据')
  }
}
// 点击新增弹窗
const openAddTagsDialog = () => {
  AddTagsDialogVisible.value = true
  nextTick(() => {
    unref(formRef)?.setSchema([
      {
        field: 'tagTypeId',
        path: 'componentProps.options',
        value: selectList.value
      }
    ])
  })
}
// 点击确定
const saveAddTagsDialog = async () => {
  //表单验证
  const form = unref(formRef)
  const elFormRef = form?.getElFormRef()
  await elFormRef?.validate(async (isValid) => {
    if (isValid) {
      loading.value = true
      let data = form?.formModel as any
      data.name = data.name ? data.name : ''
      if (Array.isArray(data.tagTypeId)) {
        data.tagTypeId = data.tagTypeId ? data.tagTypeId[data.tagTypeId.length - 1] : ''
      } else {
        data.tagTypeId = data.tagTypeId || data.tagTypeId == 0 ? data.tagTypeId : ''
      }
      data.tagTypeName = getElTagLabel(data.tagTypeId)
      await addUser(data)
    }
  })
}
//新增
const addUser = async (data: any) => {
  const res = await tagAddApi(data)
    .catch(() => {})
    .finally(() => {
      setTimeout(() => {
        loading.value = false
      }, 200)
    })
  if (res) {
    ElMessage.success('保存信息成功')
    AddTagsDialogVisible.value = false
    await getList()
  }
}
// 点击返回
const back = () => {
  TagsDialogVisible.value = false
}
const backAddTagseDialog = () => {
  AddTagsDialogVisible.value = false
}
const closed = () => {
  selectionList.value = []
}
// 传递给父组件的方法
defineExpose({
  openDialog
})
</script>
<style lang="less">
.tagDialog {
  .el-dialog__body {
    padding-bottom: 10px !important;
  }
}
</style>
<style scoped>
.close-all {
  position: absolute;
  right: 20px;
  top: 10px;
  color: #00a0e9;
  cursor: pointer;
}
.check-list {
  position: relative;
  width: 100%;
  border: 1px solid #e2e2e2;
  border-bottom: none;
  padding: 8px;
  min-height: 50px;
}
.item-list {
  width: 95%;
  display: flex;
  flex-wrap: wrap;
}
.check-item {
  background: #e6e6e6;
  margin: 2px 6px;
  padding: 4px 6px;
  display: flex;
  align-items: center;
}
.check-name {
  max-width: 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: 10px;
}
</style>