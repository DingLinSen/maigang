<template>
  <!--  考勤顶部卡片  -->
  <section>
    <div class="h-60px flex justify-between satistics_menu_main">
      <div class="statistics_item w-28.22vw h-full flex items-center pl-22px">
        <p>
          <Icon class="mr-10px avatar" icon="svg-icon:total_people_icon" />
          参与考勤总人数<span class="text-3xl font-bold ml-10px mr-4px">{{
            statisData.num ? statisData.num : '0'
          }}</span
          >人
        </p>
      </div>
      <div class="statistics_item w-28.22vw mx-15px h-full flex items-center pl-22px">
        <p>
          <Icon class="mr-10px avatar" icon="svg-icon:normal_people_icon" />
          昨日考勤正常人数<span class="text-3xl font-bold ml-10px mr-4px">{{
            statisData.normalNum ? statisData.normalNum : '0'
          }}</span
          >人
        </p>
      </div>
      <div class="statistics_item w-28.22vw h-full flex items-center pl-22px">
        <p>
          <Icon class="mr-10px avatar" icon="svg-icon:abnormal_people_icon" />
          昨日考勤异常人数<span class="text-3xl font-bold ml-10px mr-4px">{{
            statisData.abnormalNum ? statisData.abnormalNum : '0'
          }}</span
          >人
        </p>
      </div>
    </div>
    <!-- 表格  -->
    <div class="table_content mt-14px w-full">
      <div class="table_title h-58px pl-20px"> 考勤统计</div>
      <div class="pt-20px px-20px pb-20px table_wrap">
        <Table
          v-model:currentPage="tableObject.currentPage"
          v-model:pageSize="tableObject.pageSize"
          :border="true"
          :columns="allSchemas.tableColumns"
          :cotentAlign="'center'"
          :data="tableObject.tableList"
          :header-align="'center'"
          :index="true"
          :loading="tableObject.loading"
          :pagination="{
            total: tableObject.total
          }"
          @register="register"
        >
          <template #operateBtnLeft>
            <Search
              v-hasPermi="'keepAttend:list:query'"
              :schema="allSchemas.searchSchema"
              @reset="setSearchParamsSub"
              @search="setSearchParamsSub"
            />
          </template>
          <template #operateBtnRight>
            <ElButton
              v-hasPermi="'keepAttend:list:setting'"
              class="btn-other exportBtn"
              plain
              @click="setupClick()"
            >
              <template #icon>
                <Icon :size="14" icon="svg-icon:set_icon" />
              </template>
              考勤设置
            </ElButton>
            <ElButton
              v-hasPermi="'keepAttend:list:exportSenior'"
              class="btn-other exportBtn"
              plain
              @click="exportSenior()"
            >
              <template #icon>
                <Icon :size="14" icon="svg-icon:exportBut" />
              </template>
              部门-导出
            </ElButton>
            <ElButton
              v-hasPermi="'keepAttend:list:export'"
              class="btn-other exportBtn"
              plain
              @click="exportForm()"
            >
              <template #icon>
                <Icon :size="14" icon="svg-icon:exportBut" />
              </template>
              列表-导出
            </ElButton>
          </template>
          <template #filesTop>
            <div class="table_top h-40px flex items-center">
              <div class="px-20px">
                <p>
                  <Icon class="mr-10px clocking" icon="svg-icon:kq_icon" />
                  考勤月份：<span class="month">{{ params.clockinMonth }}月</span>
                </p>
              </div>
              <div>
                <p>
                  <span class="pl-20px" style="border-left: 1px solid #dbdbdb">本月出勤率：</span
                  ><span class="month"
                    >{{ statisData.attendanceChance ? statisData.attendanceChance : '0' }}%</span
                  >
                </p>
              </div>
            </div>
          </template>
          <template #id="{ $index }">
            <span>
              {{ $index + 1 + tableObject.pageSize * (tableObject.currentPage - 1) }}
            </span>
          </template>
          <template #action="{ row }">
            <ElButton :text="true" class="btn-default" size="small" @click="openDialog(row)"
              >详情
            </ElButton>
            <!-- <ElButton class="btn-default" :text="true" size="small" @click="delData(row, false)"
              >年假清零
            </ElButton> -->
          </template>
        </Table>
      </div>
      <attendanceSettings ref="attendanceSettingsRef" title="考勤设置" />
      <AppraiseDetails ref="appraiseDetailsRef" />
    </div>
  </section>
</template>

<script lang="ts" setup>
import { h, reactive, ref } from 'vue'
import attendanceSettings from './attendanceSettings.vue'
import AppraiseDetails from './appraiseDetails.vue'
import { Table } from '@/components/Table'
import { getAllDeptListApi } from '@/api/sys/dept' // 获取所有部门
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import moment from 'moment'
import { useTable } from '@/hooks/web/useTable'
import {
  getIndexCountApi,
  getIndexListApi,
  getIndexExport,
  getDetailsDeptExport
} from '@/api/assessment/statistics'
import { Search } from '@/components/Search'

let params = {
  deptId: '',
  clockinMonth: moment(new Date()).format('M'),
  clockinYear: moment(new Date()).format('YYYY')
}
const attendanceSettingsRef = ref()
const appraiseDetailsRef = ref()

const filiteDeptData = ref<any>([])
const statisData = ref<any>({
  abnormalNum: 0,
  attendanceChance: 0,
  normalNum: 0,
  num: 0
})
const getAllUserlist = async () => {
  let data = await getIndexCountApi(params)
  if (data && data.data) {
    statisData.value = data.data
  }
  try {
    const res = await getAllDeptListApi({})
    if (res && res.data.length) {
      filiteDeptData.value = res.data.map((v) => {
        return {
          value: v.deptId,
          label: v.deptName
        }
      })
    }
  } catch (error) {
    console.log(error)
  }
}
getAllUserlist()
// 存放表格的数据
const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'id',
    label: '序号',
    fixed: 'left',
    minWidth: '60px'
  },
  {
    field: 'deptId',
    label: '部门',
    fixed: 'left',
    minWidth: '130px',
    formatter: (row: any) => {
      return h('span', row.deptName ? row.deptName : '--')
    },
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        placeholder: '部门筛选',
        style: 'width: 196px',
        filterable: true,
        options: filiteDeptData
      }
    }
  },
  {
    field: 'clockinDate',
    table: {
      show: false
    },
    search: {
      value: moment(new Date()).format('YYYY-MM'),
      show: true,
      component: 'DatePicker',
      componentProps: {
        clearable: false,
        type: 'month',
        style: 'width: 196px;margin-top:-4px',
        placeholder: '选择年月'
      }
    }
  },
  {
    field: 'userName',
    label: '姓名',
    fixed: 'left',
    minWidth: '100px',
    formatter: (row: any) => {
      return h('span', row.userName ? row.userName : '--')
    }
  },
  {
    field: 'realTime',
    label: '实到(时)',
    minWidth: '100px',
    formatter: (row: any) => {
      return h('span', row.realTime ? row.realTime : 0)
    }
  },
  {
    field: 'restOvertime',
    label: '公休加班(天)',
    minWidth: '120px',
    formatter: (row: any) => {
      return h('span', row.restOvertime ? row.restOvertime : 0)
    }
  },
  {
    field: 'moveLeave',
    label: '公休(天)',
    minWidth: '100px',
    formatter: (row: any) => {
      return h('span', row.moveLeave ? row.moveLeave : 0)
    }
  },
  {
    field: 'surplusLeave',
    label: '剩余公休(天)',
    minWidth: '120px',
    formatter: (row: any) => {
      return h('span', row.surplusLeave ? row.surplusLeave : 0)
    }
  },
  {
    field: 'thingLeave',
    label: '事假(天)',
    minWidth: '100px',
    formatter: (row: any) => {
      return h('span', row.thingLeave ? row.thingLeave : 0)
    }
  },
  {
    field: 'illLeave',
    label: '病假(天)',
    minWidth: '100px',
    formatter: (row: any) => {
      return h('span', row.illLeave ? row.illLeave : 0)
    }
  },
  {
    field: 'yearLeave',
    label: '年假(天)',
    minWidth: '100px',
    formatter: (row: any) => {
      return h('span', row.yearLeave ? row.yearLeave : 0)
    }
  },
  {
    field: 'surplusYearLeave',
    label: '剩余年假(天)',
    minWidth: '120px',
    formatter: (row: any) => {
      return h('span', row.surplusYearLeave ? row.surplusYearLeave : 0)
    }
  },
  {
    field: 'loseLeave',
    label: '丧假(天)',
    minWidth: '100px',
    formatter: (row: any) => {
      return h('span', row.loseLeave ? row.loseLeave : 0)
    }
  },
  {
    field: 'evection',
    label: '出差(天)',
    minWidth: '100px',
    formatter: (row: any) => {
      return h('span', row.evection ? row.evection : 0)
    }
  },
  {
    field: 'egress',
    label: '外出(天)',
    minWidth: '100px',
    formatter: (row: any) => {
      return h('span', row.egress ? row.egress : 0)
    }
  },
  {
    field: 'late',
    label: '迟到(次)',
    minWidth: '100px',
    formatter: (row: any) => {
      return h('span', row.late ? row.late : 0)
    }
  },
  {
    field: 'premature',
    label: '早退(次)',
    minWidth: '100px',
    formatter: (row: any) => {
      return h('span', row.premature ? row.premature : 0)
    }
  },
  {
    field: 'absenteeism',
    label: '旷工(次)',
    minWidth: '100px',
    formatter: (row: any) => {
      return h('span', row.absenteeism ? row.absenteeism : 0)
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
const { register, tableObject, methods } = useTable<AnnouncementData>({
  getListApi: getIndexListApi,
  response: {
    list: 'rows',
    total: 'total'
  },
  defaultParams: params
})
const { getList, setSearchParams } = methods

const openDialog = (row) => {
  let data = {
    userId: row.userId,
    clockinMonth: params.clockinMonth,
    clockinYear: params.clockinYear
  }
  appraiseDetailsRef.value.openDrawer(data, row.userName, row.deptName)
}

//搜索
const setSearchParamsSub = (param: any) => {
  // params.clockinMonth = '9'
  // params.clockinYear = '2023'
  params.deptId = param.deptId ? param.deptId : ''
  params.clockinMonth = param.clockinDate
    ? new Date(param.clockinDate).getMonth() + 1
    : moment(new Date()).format('M')
  params.clockinYear = param.clockinDate
    ? new Date(param.clockinDate).getFullYear()
    : moment(new Date()).format('YYYY')

  getAllUserlist()
  setSearchParams(params)
}
getList()

const exportForm = async () => {
  let data = {
    clockinMonth: params.clockinMonth,
    clockinYear: params.clockinYear,
    deptId: params.deptId
  }
  let res = await getIndexExport(data)
}
const exportSenior = async () => {
  let data = {
    clockinMonth: params.clockinMonth,
    clockinYear: params.clockinYear,
    deptId: params.deptId
  }
  let res = await getDetailsDeptExport(data)
}

const setupClick = () => {
  attendanceSettingsRef.value.openDrawer()
}
</script>

<style lang="less" scoped>
:deep(.el-tooltip__trigger) {
  margin-bottom: 0 !important;
}

.statistics_item {
  background-color: #ffffff;
  box-shadow: 0px 3px 4px 0px rgba(31, 31, 31, 0.2);
  border-radius: 2px;
}

.avatar {
  font-size: 28px !important;
  vertical-align: middle;
}

.table_content {
  background-color: #ffffff;
  box-shadow: 0px 3px 4px 0px rgba(31, 31, 31, 0.2);
  border-radius: 4px;
}

.table_title {
  background-color: #ffffff;
  font-family: Alibaba PuHuiTi R;
  line-height: 58px;
  border-bottom: 1px solid #eef0f2;
  color: #333333;
  font-weight: 500;
}

.table_top {
  background: #f4fcff;
  margin-bottom: 14px;
}

.clocking {
  vertical-align: middle;
}

.month {
  font-size: 17px;
  color: #00a0e9;
  font-weight: 600;
}
</style>
