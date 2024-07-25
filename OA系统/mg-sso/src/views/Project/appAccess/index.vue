<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { h, reactive, ref, onMounted } from 'vue'
import { Table } from '@/components/Table'
import { ElDialog, ElImage } from 'element-plus'
import { Icon } from '@/components/Icon'
import { useTable } from '@/hooks/web/useTable'
import { require } from '@/useImageUrl'
import { Search } from '@/components/Search'
import { useI18n } from '@/hooks/web/useI18n'
import getAssetsFile from '@/utils/pubUse' // 引入图片路径
import { TableColumn } from '@/types/table'
import { applicationAccessList, deleteAccessList, getDataById } from '@/api/applicationManage'
import { useEmitt } from '@/hooks/web/useEmitt'
import { accessType } from '@/api/applicationManage/types'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import appAccessForm from './components/appAccessForm.vue'
//图片弹框
const photoDialog = ref(false)
// 应用信息弹框
const appInfo = ref(false)
let ApplicationFormRef = ref<ComponentRef<typeof appAccessForm>>()
// 展示图片地址
const photoUrl = ref('')
const { t } = useI18n()
//删除
const delLoading = ref(false)
const appInfoForm = reactive<Recordable>({
  id: null,
  appDesc: '',
  icon: '',
  defaultRedirectUri: '',
  owner: '',
  name: '',
  uriList: [],
  enabled: '',
  publiced: '',
  createTime: ''
})
let params = reactive<Recordable>({
  id: '',
  enabled: null,
  name: '',
  publiced: null
})
// 获取列表
const { register, tableObject, methods } = useTable<accessType>({
  getListApi: applicationAccessList,
  delListApi: deleteAccessList,
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
    label: '数据id',
    minWidth: '80px',
    formatter: (row: any, __: TableColumn) => {
      return h('span', row.id ? row.id : '--')
    }
  },
  {
    field: 'roleName',
    label: '角色',
    minWidth: '180px',
    search: {
      show: true,
      componentProps: {
        style: 'width: 196px',
        placeholder: '角色'
      }
    },
    formatter: (row: any, __: TableColumn) => {
      return h('span', row.roleName ? row.roleName : '--')
    }
  },
  {
    field: 'relation',
    label: '是否可登录',
    minWidth: '180px',
    formatter: (row: any, __: TableColumn) => {
      return h(
        'span',
        {
          style: {
            color:
              String(row.relation) === '1'
                ? '#008052'
                : String(row.relation) === '2'
                ? '#FF0000'
                : '#999999'
          }
        },
        row.relation
          ? String(row.relation) === '1'
            ? '允许登录'
            : String(row.relation) === '2'
            ? '禁止登录'
            : '跟随应用配置决定是否可以登录'
          : '--'
      )
    }
  },
  {
    field: 'appName',
    label: '应用',
    minWidth: '200px',
    search: {
      show: true,
      componentProps: {
        style: 'width: 196px',
        placeholder: '应用'
      }
    }
  },
  {
    field: 'createTime',
    label: '记录创建时间',
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
const photo = (type, val) => {
  // 根据type是否为true来判断是否为列表中直接点击
  if (type) {
    appInfoForm.name = val.appName
    photoUrl.value = val.appIcon
  } else {
    appInfoForm.name = val.name
    photoUrl.value = val.icon
  }

  photoDialog.value = true
}
// 查询方法
const setSearchParamsSub = (param) => {
  params.roleName = param.roleName ? param.roleName : ''
  params.appName = param.appName ? param.appName : ''
  setSearchParams(params)
}
//删除方法
const deleteAllData = async (row: accessType | null, multiple: boolean) => {
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
// 获取应用详细数据
const applicationinfo = async (val) => {
  await getDataById(val.appId).then((res) => {
    if (res && res.data) {
      const data = res.data
      appInfoForm.id = data.id
      appInfoForm.icon = data.icon
      appInfoForm.defaultRedirectUri = data.defaultRedirectUri
      appInfoForm.enabled = data.enabled ? '启用' : '禁用'
      appInfoForm.publiced = data.publiced ? '公开应用' : '私有应用'
      appInfoForm.owner = data.owner
      appInfoForm.appDesc = data.appDesc
      appInfoForm.name = data.name
      appInfoForm.uriList = data.uriList
      appInfoForm.createTime = data.createTime
    }
  })
  appInfo.value = true
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
      <template #appName="{ row }">
        <div class="app-info">
          <img class="name-img" :src="row.appIcon" @click="photo(true, row)" />
          <span class="app-info" @click="applicationinfo(row)">{{ row.appName }}</span>
        </div>
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
  <ElDialog
    v-model="appInfo"
    ref="elDialog"
    :title="`应用名称 ${appInfoForm.name}`"
    class="el-app-info"
  >
    <div class="app-info-item">
      <span class="item-field">应用id:</span>
      <span class="item-field-value">{{ appInfoForm.id }}</span>
    </div>
    <div class="app-info-item">
      <span class="item-field">负责人:</span>
      <span class="item-field-value">{{ appInfoForm.owner }}</span>
    </div>
    <div class="app-info-item">
      <span class="item-field">应用图标:</span>
      <img
        class="info-item-img"
        style="cursor: pointer"
        :src="appInfoForm.icon"
        @click="photo(false, appInfoForm)"
      />
    </div>
    <div class="app-info-item">
      <span class="item-field">应用介绍:</span>
      <span class="item-field-value">{{ appInfoForm.appDesc }}</span>
    </div>
    <div class="app-info-item">
      <span class="item-field">允许授权的url:</span>
      <div class="url-item">
        <span :title="item" v-for="(item, index) in appInfoForm.uriList" :key="index">{{
          item
        }}</span>
      </div>
    </div>
    <div class="app-info-item">
      <span class="item-field">默认url:</span>
      <span class="item-field-value">{{ appInfoForm.defaultRedirectUri }}</span>
    </div>
    <div class="app-info-item">
      <span class="item-field">应用状态:</span>
      <span class="item-field-value">{{ appInfoForm.enabled }}</span>
    </div>
    <div class="app-info-item">
      <span class="item-field">是否公开:</span>
      <span class="item-field-value">{{ appInfoForm.publiced }}</span>
    </div>
    <div class="app-info-item">
      <span class="item-field">创建时间:</span>
      <span class="item-field-value">{{ appInfoForm.createTime }}</span>
    </div>
  </ElDialog>
  <ElDialog
    v-model="photoDialog"
    ref="elDialog"
    width="25%"
    align-center
    draggable
    title="应用图标"
  >
    <ElImage class="search-icon" :src="photoUrl" fit="contain" />
  </ElDialog>
  <appAccessForm ref="ApplicationFormRef" />
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
.app-info {
  text-align: left;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.el-app-info {
  min-width: 500px;
  .app-info-item {
    margin-bottom: 1rem;
    word-break: break-all;
    .url-item {
      width: 70%;
      display: inline-block;
      span {
        display: block;
        font-size: 18px;
        line-height: 30px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    .item-field {
      display: inline-block;
      font-size: 18px;
      line-height: 30px;
      width: 25%;
      text-align: right;
      white-space: nowrap;
      margin-right: 20px;
      vertical-align: top;
    }
    .item-field-value {
      display: inline-block;
      font-size: 18px;
      line-height: 30px;
      width: 70%;
      text-align: left;
    }
  }
}
.app-info {
  color: 18px;
  font-weight: 600;
  color: #409eff;
  cursor: pointer;
}
.search-icon {
  display: block;
  width: 25rem;
  height: 25rem;
  margin: 0 auto;
}
.info-item-img {
  width: 5rem;
  height: 5rem;
  display: inline-block;
}
</style>
