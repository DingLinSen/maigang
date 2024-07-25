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
import { getBannerContentListApi, delBannerContentApi } from '@/api/bannerContent'
import { BannerContentForm } from './components/index'

defineOptions({
  name: 'BannerContent'
})

const { register, tableObject, methods } = useTable<any>({
  getListApi: getBannerContentListApi,
  delListApi: delBannerContentApi,
  response: {
    list: 'rows',
    total: 'total',
    key: 'id'
  }
})

const { getList, setSearchParams } = methods

getList()

const postFormRef = ref<ComponentRef<typeof BannerContentForm>>()
useEmitt({
  name: 'getBannerList',
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
    formatter: (row: Recordable) => {
      return h('span', row.title ? row.title : '--')
    }
  },
  {
    field: 'coverUrl',
    minWidth: '120px',
    label: '封面',
    showOverflowTooltip:false
  },
  {
    field: 'linkAddress',
    minWidth: '320px',
    label: '链接地址',
    formatter: (row: Recordable) => {
      return h('span', row.coverUrl ? row.coverUrl : '--')
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
  console.log(row)

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
  postCode: undefined,
  postName: undefined,
  status: undefined
})
const chooseListAll = ref([])
//搜索
const setSearchParamsSub = (param: Recordable) => {
  chooseListAll.value = []
  params.postCode = param.postCode ? param.postCode : undefined
  params.postName = param.postName ? param.postName : undefined
  params.status = param.status ? param.status : undefined
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
  <!-- <ContentWrap class="mt-7px mb-10px">
    <Search
      ref="searchRef"
      :schema="allSchemas.searchSchema"
      :chooseListAll="chooseListAll"
      @search="setSearchParamsSub"
      @reset="setSearchParamsSub"
      v-if="isAuth('system:post:query')"
    />
  </ContentWrap> -->
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
      :height="700"
      :footerHeight="true"
      :align="'center'"
      :selection="false"
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
      </template>
    </Table>
  </ContentWrap>
  <Dialog v-model="dialogVisible" :modalClass="'file-prview-img'" width="50%" :title="'图片预览'">
    <img class="preview_img" w-full :src="dialogImageUrl" alt="图片预览" />
  </Dialog>
  <BannerContentForm title="Banner内容" ref="postFormRef" @get-banner-list="getList()" />
</template>
<style scoped>
.coverUrl {
  height: 100px;
  width: 100px;
  cursor: pointer;
  margin: 0 auto;
}
.preview_img {
  margin: 0 auto;
}
</style>
