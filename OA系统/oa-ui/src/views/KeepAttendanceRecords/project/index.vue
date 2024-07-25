<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { ElButton, ElMessageBox, ElMessage } from 'element-plus'
import { Table } from '@/components/Table'
import { useTable } from '@/hooks/web/useTable'
import { h, reactive, ref } from 'vue'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { TableColumn } from '@/types/table'
import moment from 'moment'
import { isAuth } from '@/utils/is' // 鉴权
import { LimitDailog } from '@/views/Components/limit'
import { FormSchema } from '@/types/form'
import { getAllUserListApi } from '@/api/user' // 获取所有用户
import { getAllDeptListApi } from '@/api/sys/dept' // 获取所有部门
import { listToTree } from '@/utils/tree'
import { getNoticeListApi, readApi, allReadApi } from '@/api/project/overview'

defineOptions({
  name: 'ProjectRemind'
})
//部门数据
let deptData = ref<any>([])
//人员数据
const userData = ref<any>([])
//部门人员整合后的数据
const principalTree = ref<any>([])
//获取所有用户
const getAllUserlist = async () => {
  try {
    const res = await getAllDeptListApi({})
    const { data } = await getAllUserListApi({})
    deptData.value = res.data
    userData.value = data
    userData.value.reverse()
    getprincipalTree()
    return data
  } catch (error) {
  }
}

const getprincipalTree = async () => {
  if (deptData.value.length) {
    deptData.value.forEach((deptItem: any) => {
      userData.value.forEach((userItem: any) => {
        if (deptItem.deptId === userItem.deptId) {
          deptItem.children.push({
            deptId: userItem.userId,
            deptName: userItem.nickName
          })
        }
      })
    })
    principalTree.value = listToTree(deptData.value, {
      id: 'deptId',
      children: 'children',
      pid: 'parentId'
    })
  }
}

getAllUserlist()

const { register, tableObject, methods } = useTable<any>({
  getListApi: getNoticeListApi,
  response: {
    list: 'rows',
    total: 'total'
  }
})

const { getList, setSearchParams } = methods

getList()

//列表属性
const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'index',
    label: '序号',
    minWidth: '80px'
  },
  {
    field: 'noticeFlag',
    label: '消息分类',
    minWidth: '100px',
    formatter: (row: any) => {
      return h(
        'span',
        row.noticeFlag == 1
          ? '提醒'
          : row.noticeFlag == 2
          ? '消息'
          : row.noticeFlag == 3
          ? '督促'
          : '--'
      )
    },
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        style: 'width: 196px',
        options: [
          {
            value: 1,
            label: '提醒'
          },
          {
            value: 2,
            label: '消息'
          },
          {
            value: 3,
            label: '督促'
          }
        ],
        placeholder: '消息分类筛选'
      }
    }
  },
  {
    field: 'noticeType',
    label: '消息类型',
    minWidth: '100px',
    formatter: (row: any) => {
      return h('span', row.noticeType ? row.noticeType : '--')
    }
  },
  {
    field: 'projectTitle',
    label: '项目名称',
    minWidth: '120px',
    formatter: (row: any) => {
      return h('span', row.projectTitle ? row.projectTitle : '--')
    }
  },
  {
    field: 'content',
    label: '消息内容',
    minWidth: '220px',
    formatter: (row: any) => {
      return h('span', row.content ? row.content : '--')
    }
  },
  {
    field: 'principalPersonName',
    label: '当前负责人',
    minWidth: '80px',
    formatter: (row: any) => {
      return h('span', row.principalPersonName ? row.principalPersonName : '--')
    },
    search: {
      show: true,
      component: 'Cascader',
      componentProps: {
        placeholder: '负责人筛选',
        filterable: true,
        options: principalTree,
        style: 'width: 11vw',
        props: {
          label: 'deptName',
          value: 'deptId'
        }
      }
    }
  },
  {
    field: 'isRead',
    label: '是否已读',
    minWidth: '80px',
    formatter: (row: any) => {
      return h('span', row.isRead == '1' ? '已读' : row.isRead == '0' ? '未读' : '--')
    },
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        style: 'width: 196px',
        options: [
          {
            value: '0',
            label: '未读'
          },
          {
            value: '1',
            label: '已读'
          }
        ],
        placeholder: '状态筛选'
      }
    }
  },
  {
    field: 'createTime',
    label: '时间',
    minWidth: '120px',
    formatter: (row: any) => {
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

//查询参数
const params = reactive<Recordable>({
  noticeFlag: '',
  isRead: '',
  principalPersonName: ''
})

//搜索
const setSearchParamsSub = (param: Recordable) => {
  params.noticeFlag = param.noticeFlag ? param.noticeFlag : null
  params.isRead = param.isRead ? param.isRead : null
  params.principalPersonName = param.principalPersonName
    ? param.principalPersonName[param.principalPersonName.length - 1]
    : null
  setSearchParams(params)
}

//全部已读
const allhandle = async () => {
  ElMessageBox.confirm('是否要全部已读?', '确认提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    autofocus: false
  })
    .then(async () => {
      let res = await allReadApi({})
      if (res) {
        ElMessage.success({
          message: '全部已读成功!'
        })
        setSearchParams(params)
      }
    })
    .catch(() => {})
}

// 处理
const handle = async (info: any) => {
  let res = await readApi({ messageId: info.messageId })
  if (res) {
    info.isRead = '1'
  }
}
</script>

<template>
  <ContentWrap Showtitle="项目考核">
    <Table
      v-model:pageSize="tableObject.pageSize"
      v-model:currentPage="tableObject.currentPage"
      :columns="allSchemas.tableColumns"
      :data="tableObject.tableList"
      :loading="tableObject.loading"
      :border="true"
      :selection="false"
      :isShowCell="isShowCell"
      :header-align="'center'"
      :cotentAlign="'center'"
      :pagination="{
        total: tableObject.total
      }"
      @register="register"
    >
      <template #operateBtnLeft>
        <Search
          v-if="isAuth('project:remind:query')"
          :schema="allSchemas.searchSchema"
          @search="setSearchParamsSub"
          @reset="setSearchParamsSub"
        />
      </template>
      <template #operateBtnRight>
        <div class="mr-[10px]" v-if="isAuth('project:remind:read')">
          <ElButton class="btn-add" @click="allhandle(null, 'add')" plain> 全部已读 </ElButton>
        </div>
      </template>
      <template #index="{ $index }">
        <span>{{
          $index + 1 + tableObject.pageSize * (tableObject.currentPage - 1)
        }}</span></template
      >
      <template #action="{ row }">
        <ElButton
          class="btn-default"
          :text="true"
          size="small"
          @click="handle(row)"
          v-if="row.isRead == 0 && isAuth('project:remind:read')"
          >已读
        </ElButton>
      </template>
    </Table>
  </ContentWrap>
  <LimitDailog routerName="ProjectRemind" />
</template>
