<template>
  <ContentWrap Showtitle="积分排行">
    <Table
      ref="tableRef"
      class="rank-class"
      v-model:pageSize="tableObject.pageSize"
      v-model:currentPage="tableObject.currentPage"
      :columns="allSchemas.tableColumns"
      :data="tableObject.tableList"
      :loading="tableObject.loading"
      :border="false"
      :selection="false"
      :isShowCell="isShowCell"
      :header-align="'center'"
      :cotentAlign="'center'"
      :pagination="{
        total: tableObject.total
      }"
      @sort-change="tableSortChange"
      @register="register"
    >
      <template #operateBtnLeft>
        <div class="flex">
          <span
            :class="params.type ? 'normal-button-class' : 'selected-button-class'"
            @click="typeChange('')"
            >累计</span
          >
          <span
            :class="params.type == '1' ? 'selected-button-class' : 'normal-button-class'"
            @click="typeChange('1')"
            >年度</span
          >
          <span
            :class="params.type == '2' ? 'selected-button-class' : 'normal-button-class'"
            @click="typeChange('2')"
            >季度</span
          >
          <span
            :class="params.type == '3' ? 'selected-button-class' : 'normal-button-class'"
            @click="typeChange('3')"
            >月度</span
          >
        </div>
      </template>
      <template #operateBtnRight>
        <div class="mr-[10px]" v-if="isAuth('point:rank:export')">
          <ElButton class="other exportBtn" @click="exportForm()" plain :loading="exLoading">
            <template #icon> <Icon :size="14" icon="svg-icon:exportBut" /> </template>
            导出
          </ElButton>
        </div>
      </template>
      <template #index="{ $index }">
        <div class="li-class">
          <img
            v-if="$index + 1 + tableObject.pageSize * (tableObject.currentPage - 1) === 1"
            src="@/assets/imgs/icon/one.png"
            class="rank-img 2xl:w-[2.3vh] 2xl:h-[2.7vh]"
          />
          <img
            v-if="$index + 1 + tableObject.pageSize * (tableObject.currentPage - 1) === 2"
            src="@/assets/imgs/icon/two.png"
            class="rank-img 2xl:w-[2.3vh] 2xl:h-[2.7vh]"
          />
          <img
            v-if="$index + 1 + tableObject.pageSize * (tableObject.currentPage - 1) === 3"
            src="@/assets/imgs/icon/three.png"
            class="rank-img 2xl:w-[2.3vh] 2xl:h-[2.7vh]"
          />
          <div
            v-if="$index + 1 + tableObject.pageSize * (tableObject.currentPage - 1) > 3"
            class="li-class"
          >
            <div class="dot-div"></div>
            <span class="rank-num">{{
              $index + 1 + tableObject.pageSize * (tableObject.currentPage - 1)
            }}</span>
            <div class="dot-div"></div
          ></div>
        </div>
      </template>
    </Table>
  </ContentWrap>
</template>
  <script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Table } from '@/components/Table'
import { useTable } from '@/hooks/web/useTable'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { TableColumn } from '@/types/table'
import { h, nextTick, onMounted, reactive, ref } from 'vue'
import { getPoinRankListApi, exportPointRankApi } from '@/api/point'
import moment from 'moment'
import { isAuth } from '@/utils/is' // 鉴权
import { ElMessage } from 'element-plus'

defineOptions({
  name: 'PointRank'
})

const { register, tableObject, methods } = useTable<any>({
  getListApi: getPoinRankListApi,
  response: {
    list: 'rows',
    total: 'total'
  }
})

const { getList, setSearchParams } = methods

//查询参数
const params = reactive<Recordable>({
  type: '1'
})

const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'index',
    label: '排名',
    minWidth: '60px'
  },
  {
    field: 'userName',
    minWidth: '100px',
    label: '姓名',
    formatter: (row: Recordable) => {
      return h('span', row.userName ? row.userName : '--')
    }
  },
  {
    field: 'postName',
    minWidth: '100px',
    label: '职务',
    formatter: (row: Recordable) => {
      return h(
        'span',
        {
          class: 'li-item-role-class'
        },
        row.postName ? row.postName : '--'
      )
    }
  },
  // {
  //   field: 'basicFraction',
  //   minWidth: '120px',
  //   label: '基础分',
  //   formatter: (row: Recordable) => {
  //     return h('p', [
  //       h(
  //         'span',
  //         {
  //           class: 'point'
  //         },
  //         row.basicFraction ? row.basicFraction : '0'
  //       ),
  //       h(
  //         'span',
  //         {
  //           class: 'point-unit'
  //         },
  //         '分'
  //       )
  //     ])
  //   }
  // },
  // {
  //   field: 'driftFraction',
  //   minWidth: '120px',
  //   label: '浮动分',
  //   formatter: (row: Recordable) => {
  //     return h('p', [
  //       h(
  //         'span',
  //         {
  //           class: 'point'
  //         },
  //         row.driftFraction ? row.driftFraction : '0'
  //       ),
  //       h(
  //         'span',
  //         {
  //           class: 'point-unit'
  //         },
  //         '分'
  //       )
  //     ])
  //   }
  // },
  {
    field: 'fraction',
    minWidth: '120px',
    label: '积分',
    formatter: (row: Recordable) => {
      return h('p', [
        h(
          'span',
          {
            class: 'point'
          },
          params.type == '2' || params.type == '3'
            ? row.driftFraction
              ? row.driftFraction
              : '0'
            : row.fraction
            ? row.fraction
            : '0'
        ),
        h(
          'span',
          {
            class: 'point-unit'
          },
          '分'
        )
      ])
    }
  }
  // {
  //   field: 'cash',
  //   minWidth: '120px',
  //   label: '现金价值',
  //   formatter: (row: Recordable) => {
  //     return h(
  //       'span',
  //       {
  //         class: 'point'
  //       },
  //       row.cash ? row.cash : '0'
  //     )
  //   }
  // }
  // {
  //   table: { show: false },
  //   field: 'createTime',
  //   minWidth: '120px',
  //   label: '申请时间',
  //   formatter: (row: Recordable) => {
  //     return h('span', row.createTime ? moment(row.createTime).format('YYYY-MM-DD') : '--')
  //   },
  //   search: {
  //     show: true,
  //     component: 'DatePicker',
  //     componentProps: {
  //       class: 'date-class',
  //       style: 'width: 16vw',
  //       type: 'date',
  //       format: 'YYYY-MM-DD',
  //       placeholder: '截止时间'
  //     }
  //   }
  // }
])
const { allSchemas } = useCrudSchemas(crudSchemas)

//累计 年度 季度 月度类型筛选
const tableRef = ref()
const typeChange = (value: string) => {
  params.type = value
  if (value) {
    let indexSub = -1
    allSchemas.tableColumns.find((item, index) => {
      if (item.field == 'cash') {
        indexSub = index
      }
    })
    if (indexSub > -1) {
      allSchemas.tableColumns.splice(indexSub, 1)
    }
  } else {
    let result = allSchemas.tableColumns.some((item: any) => item.field == 'cash')
    if (!result) {
      allSchemas.tableColumns.push({
        field: 'cash',
        minWidth: '120px',
        label: '现金价值',
        formatter: (row: Recordable) => {
          return h(
            'span',
            {
              class: 'point'
            },
            row.cash ? row.cash : '0'
          )
        }
      })
    }
  }
  setSearchParams(params)
}

setSearchParams(params)

// //搜索
// const setSearchParamsSub = (param: Recordable) => {
//   params.type = param.type
//   setSearchParams(params)
// }

//导出
const exLoading = ref<boolean>(false)
const exportForm = async () => {
  if (tableObject.tableList.length === 0) {
    ElMessage.warning('查询无数据, 无需导出数据')
    return
  }
  exLoading.value = true
  await exportPointRankApi(params)
  exLoading.value = false
}
</script>
    
<style lang="less" scoped>
.li-class {
  display: flex;
  justify-content: center;
  align-items: center;
}
.rank-num {
  font-size: 14px;
  font-family: Alibaba PuHuiTi R;
  font-weight: 400;
  color: #222222;
}
.dot-div {
  width: 3px;
  height: 3px;
  background: #848586;
  border-radius: 1.5px;
  margin-left: 1px;
  margin-right: 1px;
}
</style>
<style lang="less">
.li-item-role-class {
  font-size: 12px;
  margin-left: 5px;
  font-family: Alibaba PuHuiTi R;
  font-weight: 400;
  padding-left: 4px;
  padding-right: 4px;
  color: #51b3e0;
  border: 1px solid #97cbe3;
  border-radius: 4px;
}
.point {
  font-size: 20px;
  font-family: Alibaba PuHuiTi M;
  font-weight: 500;
  color: #ffb200;
}
.point-unit {
  font-size: 12px;
  font-family: Alibaba PuHuiTi R;
  font-weight: 400;
  color: #999999;
  margin-left: 3px;
}

.normal-button-class {
  padding: 6px 16px;
  margin-right: 8px;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  font-size: 15px;
  font-family: Alibaba PuHuiTi R;
  color: #666666;
  border-radius: 2px;
  cursor: pointer;
}

.selected-button-class {
  padding: 6px 16px;
  margin-right: 8px;
  background: #e0f5ff;
  border: 1px solid #00a0e9;
  font-size: 15px;
  font-family: Alibaba PuHuiTi R;
  color: #00a0e9;
  border-radius: 2px;
  cursor: pointer;
}

@media screen and (max-width: 1536px) {
  .point {
    font-size: 18px;
    font-family: Alibaba PuHuiTi M;
    font-weight: 500;
    color: #ffb200;
  }
  .point-unit {
    font-size: 9px;
    font-family: Alibaba PuHuiTi R;
    font-weight: 400;
    color: #999999;
    margin-left: 2px;
    margin-top: 1px;
  }
}
</style>

<style lang="less">
.rank-class {
  .el-table--default .el-table__cell {
    padding: 12px 0;
  }
}
.date-class {
  .el-input__wrapper {
    width: 93%;
  }
}
</style>