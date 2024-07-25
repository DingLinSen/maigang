<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { h, reactive, ref, onMounted, unref } from 'vue'
import { Table } from '@/components/Table'
import { ElSwitch, ElDialog, ElMessageBox, ElMessage, ElImage } from 'element-plus'
import { Icon } from '@/components/Icon'
import { useTable } from '@/hooks/web/useTable'
import getAssetsFile from '@/utils/pubUse'
import { Search } from '@/components/Search'
import { useI18n } from '@/hooks/web/useI18n'
import { TableColumn } from '@/types/table'
import { applicationList, deleteList, getDataUpdate } from '@/api/applicationManage'
import { useEmitt } from '@/hooks/web/useEmitt'
import { SsoManageType } from '@/api/applicationManage/types'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import ssoManageForm from './components/ssoManageForm.vue'
//图片弹框
const photoDialog = ref(false)
let ApplicationFormRef = ref<ComponentRef<typeof ssoManageForm>>()
// 展示图片地址
const photoUrl = ref('')
const appImgTitle = ref('')
const { t } = useI18n()
// loding 效果
// 导出 导入
const exLoading = ref(false)
//删除
const delLoading = ref(false)
let params = reactive<Recordable>({
  id: '',
  enabled: null,
  name: '',
  publiced: null
})
// 获取列表
const { register, tableObject, methods } = useTable<SsoManageType>({
  getListApi: applicationList,
  delListApi: deleteList,
  response: {
    list: 'data.list', // 接口返回字段
    total: 'total'
  }
})
const { getList, setSearchParams } = methods
// 表格字段
const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'id',
    label: '应用id',
    minWidth: '80px',
    formatter: (row: any, __: TableColumn) => {
      return h('span', row.id ? row.id : '--')
    },
    search: {
      show: true,
      componentProps: {
        style: 'width: 196px',
        placeholder: '应用id'
      }
    }
  },
  {
    field: 'name',
    label: '应用名称',
    minWidth: '180px',
    search: {
      show: true,
      componentProps: {
        style: 'width: 196px',
        placeholder: '应用名称'
      }
    }
  },
  {
    field: 'appDesc',
    label: '应用介绍',
    minWidth: '180px',
    formatter: (row: any, __: TableColumn) => {
      return h('span', row.appDesc ? row.appDesc : '--')
    }
  },
  {
    field: 'allowUrl',
    label: '允许授权的url',
    minWidth: '200px',
    showOverflowTooltip: false
  },
  {
    field: 'defaultRedirectUri',
    label: '默认url',
    minWidth: '180px',
    // align: 'left',
    formatter: (row: any, __: TableColumn) => {
      return h(
        'span',
        {
          style: {
            color: 'rgba(0,128,0,1)'
          }
        },
        row.defaultRedirectUri ? row.defaultRedirectUri : '--'
      )
    }
  },
  {
    field: 'enabled',
    label: '应用状态',
    minWidth: '120px',
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        options: [
          {
            label: '启用',
            value: '1'
          },
          {
            label: '禁用',
            value: '2'
          }
        ],
        placeholder: '应用状态'
      }
    }
  },
  {
    field: 'publiced',
    label: '是否公开',
    minWidth: '120px',
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        options: [
          {
            label: '公开',
            value: '1'
          },
          {
            label: '私有',
            value: '2'
          }
        ],
        placeholder: '是否公开'
      }
    },
    formatter: (row: any, __: TableColumn) => {
      return h(
        'span',
        {
          style: {
            color: row.publiced ? 'rgba(0,0,255,1)' : 'rgba(119,119,119,1)'
          }
        },
        row.publiced ? '公开应用' : '私有应用'
      )
    }
  },
  {
    field: 'createTime',
    label: '创建时间',
    minWidth: '180px',
    formatter: (row: any, __: TableColumn) => {
      return h('span', row.createTime ? row.createTime : '--')
    }
  },
  {
    field: 'action',
    label: '操作',
    width: '220',
    fixed: 'right'
  }
])
// 展示图标
const photo = (val) => {
  console.log(val, photoUrl.value)
  photoUrl.value = val.icon
  appImgTitle.value = val.name
  photoDialog.value = true
}
// 重置数据调佣查询
const resetData = () => {
  let params = {
    action: undefined,
    enabled: '',
    id: '',
    name: '',
    publiced: ''
  }
  setSearchParamsSub(params)
}

// 查询方法
const setSearchParamsSub = (param) => {
  params.id = param.id ? param.id : ''
  params.name = param.name ? param.name : ''
  params.enabled = param.enabled ? (param.enabled === '1' ? true : false) : null
  params.publiced = param.publiced ? (param.publiced === '1' ? true : false) : null
  setSearchParams(params)
}
//删除方法
const deleteAllData = async (row: SsoManageType | null, multiple: boolean) => {
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
// 列表中方法
const action = (val: any, type: string) => {
  if (type === 'delete') {
    setTimeout(() => {
      deleteAllData(val, false)
    }, 100)
  } else {
    ApplicationFormRef.value?.openDrawer(type, val?.id)
  }
}
// 子组件调用父组件方法
useEmitt({
  name: 'getRampInfoList',
  callback: (type: string) => {
    if (type === 'add') {
      tableObject.currentPage = 1
    }
    getList()
  }
})
// 改变值
const handleChange = async (val) => {
  let params = val
  let res = await getDataUpdate(params)
  if (res.message === 'OK') {
    resetData()
    ElMessage.success(params.enabled === true ? '启用成功' : '禁用成功')
  } else {
    ElMessage.error('操作失败')
  }
}
// 初始化列表
onMounted(() => {
  getList()
})
// 过滤表格中哪些可以查询
const { allSchemas } = useCrudSchemas(crudSchemas)
</script>

<template>
  <ContentWrap>
    <template #ContentWrapTitle>
      <div class="operation-button-container">
        <ElButton class="btn-add" @click="action('', 'add')" plain v-hasPermi="'system:dept:add'">
          <template #icon>
            <Icon :size="14" icon="svg-icon:addBut" />
          </template>
          新增
        </ElButton>
        <ElButton
          :loading="delLoading"
          class="btn-other"
          @click="deleteAllData(null, true)"
          plain
          v-hasPermi="'system:role:remove'"
        >
          <template #icon>
            <Icon :size="14" icon="svg-icon:deleteBut" />
          </template>
          删除
        </ElButton>
      </div>
    </template>
    <Table
      v-model:pageSize="tableObject.pageSize"
      v-model:currentPage="tableObject.currentPage"
      :columns="allSchemas.tableColumns"
      :data="tableObject.tableList"
      :loading="tableObject.loading"
      :border="true"
      :headerAlign="'center'"
      :cotentAlign="'center'"
      ref="tableRef"
      :pagination="{
        total: tableObject.total
      }"
      @register="register"
    >
      <template #operateBtnLeft>
        <Search
          :schema="allSchemas.searchSchema"
          @search="setSearchParamsSub"
          @reset="setSearchParamsSub"
        />
      </template>
      <template #name="{ row }">
        <div style="text-align: left" class="app-name">
          <img class="name-img" :src="row.icon" @click="photo(row)" />
          <span>{{ row.name }}</span>
        </div>
      </template>
      <template #allowUrl="{ row }">
        <span :title="item" class="allow-url" v-for="(item, index) in row.uriList" :key="index">
          {{ item }}</span
        >
      </template>
      <template #enabled="{ row }">
        <ElSwitch v-model="row.enabled" @change="handleChange(row)" />
        <span style="margin-left: 5px; color: rgba(153, 153, 153, 1); font-size: 14px">{{
          row.enabled ? '启用' : '禁用'
        }}</span>
      </template>

      <template #action="{ row }">
        <ElButton type="primary" @click="action(row, 'edit')" :text="true" class="btn-default">
          编辑
        </ElButton>
        <ElButton type="primary" @click="action(row, 'see')" :text="true" class="btn-default">
          查看
        </ElButton>
        <ElButton type="danger" class="btn-default" @click="action(row, 'delete')" text
          >删除</ElButton
        >
      </template>
    </Table>
  </ContentWrap>
  <ElDialog v-model="photoDialog" title="应用图标" ref="elDialog" width="27%">
    <ElImage class="search-icon" :src="photoUrl" fit="contain" />
  </ElDialog>
  <ssoManageForm ref="ApplicationFormRef" />
</template>

<style lang="less" scoped>
.name-img {
  display: inline-block;
  height: 2.25rem;
  width: 2.25rem;
  margin-right: 5px;
  cursor: pointer;
  vertical-align: middle;
}
.app-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.allow-url {
  display: block;
  color: #008000;
  overflow: hidden;
  padding: 0 0.5rem;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 14px !important;
}
.search-icon {
  display: block;
  width: 25rem;
  height: 25rem;
  margin: 0 auto;
  text-align: center;
}
</style>
