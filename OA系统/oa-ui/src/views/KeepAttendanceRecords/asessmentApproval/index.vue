<template>
  <ContentWrap>
    <template #ContentWrapTitle>
      <div>
        <ElButton
          class="btn-add"
          @click="action(null, 'add')"
          plain
          v-hasPermi="'person:rewardPunManage:add'"
        >
          <template #icon>
            <Icon :size="14" icon="svg-icon:addBut" />
          </template>
          新增
        </ElButton>
      </div>
    </template>
    <!-- 表格 -->
    <Table
      :isShowFilter="true"
      :border="true"
      ref="ElTableRef"
      v-model:pageSize="tableObject.pageSize"
      v-model:currentPage="tableObject.currentPage"
      :data="tableObject.tableList"
      :loading="tableObject.loading"
      :columns="allSchemas.tableColumns"
      :header-align="'center'"
      :cotentAlign="'center'"
      :height="'62vh'"
      :pagination="{
        total: tableObject.total
      }"
      @register="register"
    >
      <template #operateBtnLeft>
        <Search :schema="allSchemas.searchSchema" @search="setSearchParamsSub" @reset="reset" />
      </template>
      <template #index="{ $index }">
        <span>{{
          $index + 1 + tableObject.pageSize * (tableObject.currentPage - 1)
        }}</span></template
      >
      <template #action="{ row }">
        <ElButton
          v-if="row.isRead == 0"
          class="btn-default"
          :text="true"
          size="small"
          @click="handle()"
          >处理
        </ElButton>
      </template>
    </Table>
  </ContentWrap>
</template>
<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { ref, reactive, h } from 'vue'
import { Table } from '@/components/Table'
import { Search } from '@/components/Search'
import { useTable } from '@/hooks/web/useTable'
import { getBacklogListApi } from '@/api/project/overview'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import moment from 'moment'
import { useRouter } from 'vue-router'

const params = reactive<any>({
  isRead: '',
  projectTitle: ''
})

// 存放表格的数据
const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'index',
    label: '序号',
    minWidth: '80px'
  },
  {
    field: 'projectTitle',
    label: '项目名称',
    minWidth: '120px',
    formatter: (row: Recordable) => {
      return h('span', row.projectTitle ? row.projectTitle : '--')
    },
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        style: 'width: 196px',
        placeholder: '请输入项目名称'
      }
    }
  },
  {
    field: 'applyUserName',
    label: '申请人',
    minWidth: '140px',
    formatter: (row: Recordable) => {
      return h('span', row.applyUserName ? row.applyUserName : '--')
    }
  },
  {
    field: 'noticeType',
    label: '项目状态',
    minWidth: '80px',
    formatter: (row: Recordable) => {
      return h('span', row.noticeType ? row.noticeType : '--')
    }
  },
  {
    field: 'isRead',
    label: '是否处理',
    minWidth: '80px',
    formatter: (row: Recordable) => {
      return h('span', row.isRead == '1' ? '已处理' : row.isRead == '0' ? '未处理' : '--')
    },
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        style: 'width: 196px',
        options: [
          {
            value: '',
            label: '全部'
          },
          {
            value: '0',
            label: '未处理'
          },
          {
            value: '1',
            label: '已处理'
          }
        ],
        placeholder: '状态筛选'
      }
    }
  },
  {
    field: 'content',
    label: '申请内容',
    minWidth: '180px',
    formatter: (row: Recordable) => {
      return h('span', row.content ? row.content : '--')
    }
  },
  {
    field: 'createTime',
    label: '时间',
    minWidth: '120px',
    formatter: (row: Recordable) => {
      return h('span', row.createTime ? moment(row.createTime).format('YYYY-MM-DD') : '--')
    }
  },
  {
    field: 'action',
    fixed: 'right',
    minWidth: '120px',
    label: '操作',
    showOverflowTooltip: false
  }
])
const { allSchemas } = useCrudSchemas(crudSchemas)
const { register, tableObject, methods } = useTable<any>({
  getListApi: getBacklogListApi,
  response: {
    list: 'rows',
    total: 'total'
  }
})
const { getList, setSearchParams } = methods
//打开drawer并初始化

getList()
//搜索
const setSearchParamsSub = (param: any) => {
  params.isRead = param.isRead ? param.isRead : ''
  params.projectTitle = param.projectTitle ? param.projectTitle : ''
  setSearchParams(params)
}
// 重置
const reset = (param: any) => {
  params.isRead = ''
  params.projectTitle = ''
  setSearchParams(params)
}

const handle = () => {}
</script>
<style lang="less">
.project-overflow-drawer {
  .el-card {
    border: 0 !important;
  }
}
</style>
