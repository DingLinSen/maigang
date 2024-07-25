<script setup lang="ts">
import { h, reactive, ref, nextTick } from 'vue'
import { ElButton, ElSwitch, ElMessage, ElMessageBox } from 'element-plus'
import { Dialog } from '@/components/Dialog'
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Table } from '@/components/Table'
import { useTable } from '@/hooks/web/useTable'
import { useEmitt } from '@/hooks/web/useEmitt'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { isAuth } from '@/utils/is'
import { getImageContentListApi, delImageContentApi } from '@/api/imageContent'
import { ImageContentForm } from './components/index'

defineOptions({
  name: 'ImageContent'
})

const { register, tableObject, methods } = useTable<any>({
  getListApi: getImageContentListApi,
  delListApi: delImageContentApi,
  response: {
    list: 'rows',
    total: 'total',
    key: 'id'
  }
})

const { getList, setSearchParams } = methods

getList()

const postFormRef = ref<ComponentRef<typeof ImageContentForm>>()
useEmitt({
  name: 'getImageList',
  callback: (type: string) => {
    if (type === 'add') {
      tableObject.currentPage = 1
    }
    getList()
  }
})

const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'title',
    minWidth: '180px',
    label: '标题',
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        style: 'width:200px;' //宽度
      }
    },
    formatter: (row: Recordable) => {
      return h('span', row.title ? row.title : '--')
    }
  },
  {
    field: 'coverUrl',
    minWidth: '120px',
    label: '封面',
    showOverflowTooltip: false
  },
  {
    field: 'content',
    minWidth: '180px',
    label: '文章内容',
    formatter: (row: Recordable) => {
      // (/[]|[&nbsp;]/g, '')
      return h('span', row.content ? row.content.replace(/<[^>]+>|[&nbsp;]/g, '') : '--')
    }
  },
  {
    field: 'uploadByName',
    minWidth: '180px',
    label: '上传人',
    formatter: (row: Recordable) => {
      return h('span', row.uploadByName ? row.uploadByName : '--')
    }
  },
  {
    field: 'uploadTime',
    minWidth: '180px',
    label: '添加时间',
    formatter: (row: Recordable) => {
      return h('span', row.uploadTime ? row.uploadTime : '--')
    }
  },
  {
    field: 'action',
    width: '180px',
    label: '操作',
    fixed: 'right'
  }
])
const { allSchemas } = useCrudSchemas(crudSchemas)

//添加
const addAction = () => {
  nextTick(() => {
    postFormRef.value?.openDrawer('add', '')
  })
}

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
    multiple
  ).finally(() => {
    delLoading.value = false
  })
}

//table操作栏按钮事件
const action = (row: any, type: string) => {
  nextTick(() => {
    postFormRef.value?.openDrawer(type, row.id)
  })
}
const searchRef = ref<ComponentRef<typeof Search>>()

const params = reactive<Recordable>({
  title: undefined
})
const chooseListAll = ref([])
//搜索
const setSearchParamsSub = (param: Recordable) => {
  chooseListAll.value = []
  params.title = param.title ? param.title : undefined
  setSearchParams(params)
}
const dialogVisible = ref(false)
const dialogImageUrl = ref()
const filePreview = (val) => {
  dialogVisible.value = true
  dialogImageUrl.value = val
}
</script>

<template>
  <ContentWrap class="mt-7px mb-10px">
    <Search
      ref="searchRef"
      :schema="allSchemas.searchSchema"
      :chooseListAll="chooseListAll"
      @search="setSearchParamsSub"
      @reset="setSearchParamsSub"
      v-if="isAuth('system:post:query')"
    />
  </ContentWrap>
  <ContentWrap>
    <Table
      v-model:pageSize="tableObject.pageSize"
      v-model:currentPage="tableObject.currentPage"
      :columns="allSchemas.tableColumns"
      :data="tableObject.tableList"
      :loading="tableObject.loading"
      :border="true"
      :keyTable="'id'"
      :chooseListAll="chooseListAll"
      :header-align="'center'"
      :align="'center'"
      :pagination="{
        total: tableObject.total
      }"
      @register="register"
    >
      <template #operateBtnLeft>
        <ElButton type="primary" @click="addAction">
          <Icon icon="ep:plus" class="mr-5px" />新增</ElButton
        >
      </template>
      <template #coverUrl="{ row }">
        <div class="coverUrl" @click="filePreview(row.coverUrl)"><img :src="row.coverUrl" /> </div>
      </template>
      <template #action="{ row }">
        <ElButton type="text" @click="action(row, 'edit')" :text="true"> 编辑 </ElButton>
        <ElButton type="text" @click="delData(row, false)" :text="true"> 删除 </ElButton>
        <ElButton type="text" @click="action(row, 'see')" :text="true"> 详情 </ElButton>
      </template>
    </Table>
  </ContentWrap>
  <Dialog v-model="dialogVisible" :modalClass="'file-prview-img'" width="50%" :title="'图片预览'">
    <img class="preview_img" w-full :src="dialogImageUrl" alt="图片预览" />
  </Dialog>
  <ImageContentForm title="图文内容" ref="postFormRef" @get-image-list="getList()" />
</template>
<style scoped>
.coverUrl {
  width: 100px;
  height: 100px;
  cursor: pointer;
  margin: 0 auto;
}
.preview_img {
  margin: 0 auto;

}
</style>
