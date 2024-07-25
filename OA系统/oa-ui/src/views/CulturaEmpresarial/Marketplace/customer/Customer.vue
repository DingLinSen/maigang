<template>
  <ContentWrap Showtitle="客户管理">
    <template #ContentWrapTitle>
      <div>
        <ElButton
          class="btn-add"
          v-if="isAuth('Marketplace:customer:add')"
          @click="action('add', null)"
          plain
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
      :pagination="{
        total: tableObject.total
      }"
      @register="register"
    >
      <template #operateBtnLeft>
        <Search
          v-if="isAuth('Marketplace:customer:query')"
          :schema="allSchemas.searchSchema"
          @search="setSearchParamsSub"
          @reset="setSearchParamsSub"
        />
      </template>
      <template #id="{ $index }">
        <span>
          {{ $index + 1 + tableObject.pageSize * (tableObject.currentPage - 1) }}
        </span>
      </template>
      <template #action="{ row }">
        <ElButton
          v-if="isAuth('Marketplace:customer:edit') && loginUserId == row.createBy"
          class="btn-default"
          :text="true"
          size="small"
          @click="action('edit', row)"
          >编辑
        </ElButton>
        <ElButton
          class="btn-default"
          :text="true"
          size="small"
          v-if="isAuth('Marketplace:customer:detail')"
          @click="action('see', row)"
          >详情
        </ElButton>
        <ElButton
          class="btn-default"
          :text="true"
          size="small"
          v-if="isAuth('Marketplace:customer:del')"
          @click="delData(row, false)"
          >删除
        </ElButton>

        <ElButton
          class="btn-default"
          :text="true"
          size="small"
          v-if="
            isAuth('Marketplace:customer:audit') && row.status == '1' && loginUserId == row.auditBy
          "
          @click="action('audit', row)"
          >审核
        </ElButton>
        <ElButton
          class="btn-default"
          :text="true"
          size="small"
          v-if="isAuth('Marketplace:customer:log')"
          @click="action('log', row)"
          >审批日志
        </ElButton>
      </template>
    </Table>
    <CustomerForm ref="customerFormRef" @refresh-table="resetList" />
    <!-- 审批日志 -->
    <AduitRecordTable :pid="pidValue" :visible="dialogVisible" @closed="closeDialog" />
    <!-- 弹出框 -->
    <LimitDailog routerName="Customer" />
  </ContentWrap>
</template>
<script setup lang="ts">
import {
  ref,
  reactive,
  h,
  unref,
  getCurrentInstance,
  provide,
  onMounted,
  ComponentOptions
} from 'vue'
import { ContentWrap } from '@/components/ContentWrap'
import { Table } from '@/components/Table'
import { TableColumn } from '@/types/table'
import { useEmitt } from '@/hooks/web/useEmitt'
import { Search } from '@/components/Search'
import { useTable } from '@/hooks/web/useTable'
import { delCustomerListApi, getCustomerListApi } from '@/api/customer'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { ElButton, ElTag, ElMessage, CascaderProps } from 'element-plus'
import moment from 'moment'
import { isAuth } from '@/utils/is'
import { LimitDailog } from '@/views/Components/limit'
import { projectStatus, getProjectStatusLabel } from './config/config'
import { getProvinceApi, getCityApi } from '@/api/person/induction'
import { userSelectByPmApi } from '@/api/user' // 获取所有用户
import { getAllDeptListApi } from '@/api/sys/dept' // 获取所有部门
import { listToTree } from '@/utils/tree'
import { CustomerForm, AduitRecordTable } from './components'
import { useCache } from '@/hooks/web/useCache'

defineOptions({
  name: 'Customer'
})

const { wsCache } = useCache()
const loginUserId = ref<string>(wsCache.get('userInfo').userId) // 登录用户id
const { proxy } = getCurrentInstance() as any
//客户性质
const { customer_nature } = proxy.useDict('customer_nature')
provide('customer_nature', customer_nature)

// //客户类别
// const { customer_category } = proxy.useDict('customer_category')
// provide('customer_category', customer_category)
// const getCategoryLabel = (value: string) => {
//   let label = ''
//   customer_category.value.forEach((element: any) => {
//     if (element.value == value) {
//       label = element.label
//     }
//   })
//   return label
// }
// //行业类型
// const { industry_type } = proxy.useDict('industry_type')
// provide('industry_type', industry_type)
//获取省
const provinceData = ref<ComponentOptions[]>([])
const getProvinceData = async () => {
  let res = await getProvinceApi()
  if (res) {
    provinceData.value = []
    res.data.forEach((element: any) => {
      provinceData.value.push({
        value: element.code,
        label: element.province,
        leaf:
          element.code == 110000 ||
          element.code == 120000 ||
          element.code == 500000 ||
          element.code == 310000,
        id: element.id
      })
    })
  }
}
provide('provinceData', provinceData)
const getProvinceName = (value: any) => {
  let label = ''
  provinceData.value.forEach((element: any) => {
    if (element.value == value) {
      label = element.label
    }
  })
  return label
}

//省市懒加载
const props: CascaderProps = {
  lazy: true,
  async lazyLoad(node, resolve) {
    const { level, data } = node
    if (level == 0) {
      resolve(provinceData.value)
    } else {
      let nodes: any = []
      if (data) {
        let res = await getCityApi(data?.id)
        res.data.forEach((element: any) => {
          nodes.push({
            value: element.code,
            label: element.city,
            leaf: true,
            id: element.id
          })
        })
      }
      resolve(nodes)
    }
  }
}

const params = reactive<any>({
  customerName: '',
  province: '',
  city: '',
  category: '',
  createBy: '',
  status: ''
})
const principalTree = ref<any>([])
//获取所有用户
const getAllUserlist = async () => {
  try {
    const res = await getAllDeptListApi({})
    const { data } = await userSelectByPmApi({})
    let deptData = res.data
    let userData = data
    userData.map((item: any, index: number) => {
      if (item.nickName === '张保国' && item.postStr === '董事长') {
        userData.unshift(userData.splice(index, 1)[0])
      }
    })
    getprincipalTree(deptData, userData)
  } catch (error) {}
}
const getprincipalTree = async (deptData: any, userData: any) => {
  if (deptData.length) {
    deptData.forEach((deptItem: any) => {
      userData.forEach((userItem: any) => {
        if (deptItem.deptId === userItem.deptId) {
          deptItem.children.push({
            deptId: userItem.userId,
            deptName: userItem.nickName
          })
        }
      })
    })

    deptData = deptData.filter((v) => {
      return v.children.length
    })
    principalTree.value = listToTree(deptData, {
      id: 'deptId',
      children: 'children',
      pid: 'parentId'
    })
  }
}
// 存放表格的数据
const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'customerName',
    label: '客户名称',
    minWidth: '280px',
    formatter: (row: Recordable) => {
      return h('span', row.customerName ? row.customerName : '--')
    },
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        maxlength: 200,
        style: 'width: 10vw',
        placeholder: '客户名称筛选'
      }
    }
  },
  {
    field: 'province',
    label: '所属区域',
    minWidth: '120px',
    table: { show: false },
    search: {
      show: true,
      component: 'Cascader',
      componentProps: {
        style: 'width: 10vw',
        options: provinceData,
        props: props,
        placeholder: '所属区域筛选'
      }
    }
  },
  // {
  //   field: 'category',
  //   label: '客户类别',
  //   minWidth: '100px',
  //   formatter: (row: Recordable) => {
  //     return h('span', row.category || '--')
  //   },
  //   search: {
  //     show: true,
  //     component: 'Select',
  //     componentProps: {
  //       style: 'width: 10vw',
  //       options: customer_category,
  //       placeholder: '客户类别筛选'
  //     }
  //   }
  // },
  // {
  //   field: 'type',
  //   label: '行业类型',
  //   minWidth: '120px',
  //   formatter: (row: Recordable) => {
  //     return h('span', row.type || '--')
  //   }
  // },
  {
    field: 'nature',
    label: '客户性质',
    minWidth: '120px',
    formatter: (row: Recordable) => {
      return h('span', row.nature || '--')
    }
  },
  {
    field: 'province',
    label: '所属区域',
    minWidth: '220px',
    formatter: (row: Recordable) => {
      if (row.city) {
        let id = ''
        provinceData.value.find((item: any) => {
          if (item.value == row.province) {
            id = item.id
          }
        })
        if (id) {
          getCityApi(id).then((res) => {
            res.data.forEach((element: any) => {
              if (element.code == row.city) {
                row.location = getProvinceName(row.province) + '/' + element.city
              }
            })
          })
        }
      }
      return h('span', row.city ? row.location : getProvinceName(row.province))
    }
  },
  {
    field: 'status',
    label: '状态',
    minWidth: '145px',
    formatter: (row: Recordable, __: TableColumn, cellValue: string) => {
      return h(
        ElTag,
        {
          type:
            cellValue === '1'
              ? 'primary'
              : cellValue === '2'
              ? 'success'
              : cellValue === '3'
              ? 'danger'
              : 'warning'
        },
        () => getProjectStatusLabel(cellValue) || '--'
      )
    },
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        placeholder: '状态筛选',
        style: 'width: 9.2vw',
        filterable: true,
        options: projectStatus
      }
    }
  },
  {
    field: 'createByName',
    label: '负责人',
    minWidth: '100px',
    formatter: (row: Recordable) => {
      return h('span', row.createByName ? row.createByName : '--')
    },
    search: {
      show: true,
      component: 'Cascader',
      componentProps: {
        placeholder: '负责人筛选',
        filterable: true,
        options: principalTree,
        style: 'width: 9.2vw',
        props: {
          label: 'deptName',
          value: 'deptId'
        }
      }
    }
  },
  {
    field: 'updateTime',
    label: '更新时间',
    minWidth: '160px',
    formatter: (row: Recordable) => {
      return h('span', row.updateTime ? moment(row.updateTime).format('YYYY-MM-DD HH:mm') : '--')
    }
  },
  {
    field: 'action',
    fixed: 'right',
    minWidth: '240px',
    label: '操作',
    showOverflowTooltip: false
  }
])
const { allSchemas } = useCrudSchemas(crudSchemas)
const { register, tableObject, methods } = useTable<any>({
  getListApi: getCustomerListApi,
  delListApi: delCustomerListApi,
  response: {
    list: 'rows',
    total: 'total'
  }
})
const { getList, setSearchParams } = methods
getList()
//搜索
const setSearchParamsSub = (param: any) => {
  params.customerName = param.customerName ? param.customerName : null
  params.status = param.status ? param.status : null
  params.province = param.province ? param.province[0] : null
  params.city =
    param.province && param.province.length > 1 ? param.province[param.province.length - 1] : null
  // params.category = param.category ? getCategoryLabel(param.category) : null
  params.createBy = param.createByName ? param.createByName[param.createByName.length - 1] : null
  setSearchParams(params)
}

// 删除/批量删除
const delData = async (row: any, flag: boolean) => {
  tableObject.currentRow = row
  const { delList, getSelections } = methods
  const selections = await getSelections()
  await delList(
    flag ? selections.map((v) => v.id) : [tableObject.currentRow?.id as unknown as string],
    flag,
    true,
    false
  ).finally(() => {})
}
// 更新表格
const resetList = () => {
  tableObject.currentPage = 1
  getList()
}

const customerFormRef = ref<ComponentRef<typeof CustomerForm>>()
const pidValue = ref<string>('')
const dialogVisible = ref<boolean>(false)
//操作
const action = (flag: string, row: any) => {
  if (flag == 'add') {
    //新增
    customerFormRef.value.openDialog(flag, '')
  } else if (flag == 'edit') {
    //编辑
    customerFormRef.value.openDialog(flag, row.id)
  } else if (flag == 'audit') {
    //审核
    customerFormRef.value.openDialog(flag, row.id)
  } else if (flag == 'see') {
    //查看
    customerFormRef.value.openDialog(flag, row.id)
  } else if (flag == 'log') {
    //审批日志
    pidValue.value = String(row.id)
    dialogVisible.value = true
  }
}

// 弹窗关闭
const closeDialog = () => {
  dialogVisible.value = false
}

onMounted(() => {
  getProvinceData()
  getAllUserlist()
})
</script>
<style lang="less" scoped>
.top {
  display: flex;
  justify-content: space-between;
}
</style>
