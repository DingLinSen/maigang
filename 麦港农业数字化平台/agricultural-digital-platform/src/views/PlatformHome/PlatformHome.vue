<template>
  <div class="platform_box">
    <div class="platform_content">
      <div class="platform_header">
        <div class="platform_header_left">
          <div class="platform_icon"></div>
          <div class="platform_nav">
            <div class="platform_nav_btn active">综合首页</div>
            <div class="platform_nav_btn">市场监测</div>
            <div class="platform_nav_btn">农事指导</div>
          </div>
        </div>
        <div class="platform_header_right">
          <div class="platform_header_weather">
            <img style="height: 0.34rem" src="@/assets/imgs/platformHome/weather_icon.png" alt="" />
            <span style="font-size: 0.18rem; margin-left: 0.12rem; margin-top: 0.05rem">28℃</span
            ><span style="font-size: 0.14rem; margin-left: 0.09rem; margin-top: 0.05rem"
              >局部多云</span
            >
          </div>
          <div class="platform_time">
            <div class="day">2023/05/15星期四</div>
            <div class="time">15:36:18</div>
          </div>
          <div class="right_btn">
            <div class="top_right_btn_long" @click="goBackground">
              <img src="@/assets/imgs/platformHome/manage_icon.png" alt="" />
              <span>后台管理</span>
            </div>
            <div class="top_right_btn_short" @click="loginOut">
              <img src="@/assets/imgs/platformHome/quit_icon.png" alt="" />
              <span>退出</span>
            </div>
          </div>
        </div>
        <div class="platform_warning_box">
          <div class="platform_warning">
            <img src="@/assets/imgs/platformHome/warning_icon.png" alt="" />
            <span
              >中央气象台预计，8月29日14时至30日14时，黑龙江东部、吉林东部、江苏东南部、上海、浙江南部、福、浙江南部</span
            >
          </div>
          <div class="platform_warning_btn" @click="handleWarning">
            <span>预警信息</span>
          </div>
        </div>
      </div>
    </div>
    <div class="platform_center">
      <img src="@/assets/imgs/platformHome/index_bg@2x.png" alt="" />
    </div>
    <div class="shed_box"> A区2号棚 </div>
    <div class="platform_left">
      <div class="park_list">
        <div @click="handlePark(0)" class="park_item" :class="parkIndex == 0 ? 'active' : ''">
          园区总览
        </div>
        <div @click="handlShed(1)" class="park_item" :class="parkIndex == 1 ? 'active' : ''">
          A区1号棚
        </div>
        <div @click="handlShed(2)" class="park_item" :class="parkIndex == 2 ? 'active' : ''">
          A区2号棚
        </div>
        <div @click="handlShed(3)" class="park_item" :class="parkIndex == 3 ? 'active' : ''">
          A区3号棚
        </div>
        <div @click="handlShed(4)" class="park_item" :class="parkIndex == 4 ? 'active' : ''">
          A区4号棚
        </div>
        <div @click="handlShed(5)" class="park_item" :class="parkIndex == 5 ? 'active' : ''">
          A区5号棚
        </div>
        <div @click="handlShed(6)" class="park_item" :class="parkIndex == 6 ? 'active' : ''">
          B区1号棚
        </div>
        <div @click="handlShed(7)" class="park_item" :class="parkIndex == 7 ? 'active' : ''">
          B区2号棚
        </div>
        <div @click="handlShed(8)" class="park_item" :class="parkIndex == 8 ? 'active' : ''">
          B区3号棚
        </div>
        <div @click="handlShed(9)" class="park_item" :class="parkIndex == 9 ? 'active' : ''">
          B区4号棚
        </div>
        <div @click="handlShed(10)" class="park_item" :class="parkIndex == 10 ? 'active' : ''">
          B区5号棚
        </div>
      </div>
    </div>
    <div class="platform_right">
      <div class="overview_title">
        <span>设备总览</span>
      </div>
      <div class="platform_device">
        <div class="platform_device_left">
          <span>总设备<span class="platform_device_num">108</span>台</span>
        </div>
        <div class="platform_device_icon"></div>
      </div>
      <div class="platform_online_device">
        <div class="online_device">
          <div class="online_device_left">
            <img src="@/assets/imgs/platformHome/online_icon.png" alt="" />
          </div>
          <div class="online_device_right">
            <div class="online_device_num">88 <span>台</span></div>
            <div class="online_device_text">在线设备</div>
          </div>
        </div>
        <div class="online_device">
          <div class="online_device_left">
            <img src="@/assets/imgs/platformHome/not_online_icon.png" alt="" />
          </div>
          <div class="online_device_right">
            <div class="not_online_device_num">88 <span>台</span></div>
            <div class="online_device_text">在线设备</div>
          </div>
        </div>
      </div>
      <div class="device_operate_box">
        <div class="device_name">设备名称</div>
        <div class="device_operate"> 操作</div>
        <div class="device_operate_right">模式 </div>
      </div>
      <div class="device_box">
        <div class="device_operate_item" v-for="item in 4" :key="item">
          <div class="device_name">卷帘设备1</div>
          <div class="device_operate_right">
            <div class="device_operate">
              <span>升</span>
              <span>停</span>
              <span class="active">降</span>
            </div>
            <div class="device_operate_mode">
              <span class="active">自动</span>
              <span>手动</span>
            </div>
          </div>
        </div>
        <div class="device_operate_item" v-for="item in 4" :key="item">
          <div class="device_name">水肥设备1</div>
          <div class="device_operate_right">
            <div class="device_operate_switch">
              <ElSwitch
                v-model="deviceStatus"
                inline-prompt
                active-text="开启"
                inactive-text="关闭"
                width=".58rem"
              />
            </div>
            <div class="device_operate_mode">
              <span class="active">自动</span>
              <span>手动</span>
            </div>
          </div>
        </div>
        <div class="device_operate_item">
          <div class="device_name">视频监控</div>
          <div class="device_operate_right">
            <div class="device_operate_view"> 点击查看 >> </div>
          </div>
        </div>
        <div class="device_operate_item" v-for="item in 3" :key="item">
          <div class="device_name">气象设备1</div>
          <div class="device_operate_right">
            <div class="device_operate_switch">
              <ElSwitch
                v-model="deviceStatus"
                inline-prompt
                active-text="开启"
                inactive-text="关闭"
                width=".58rem"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="platform_bottom">
      <div class="platform_bottom_box">
        <div v-if="isPark" class="bottom_box_title">园区总览 </div>
        <div v-if="!isPark" class="bottom_box_title">A区1号棚 </div>
        <div class="bottom_box_content">
          <div class="bottom_content_left">
            <div class="monitor"></div>
            <div class="monitor_list">
              <div class="monitor_item" v-for="item in 5" :key="item"> 视频监控1 </div>
            </div>
          </div>
          <div class="monitor_text" v-if="isPark">
            2017年，农业农村部、财政部贯彻落实党中央、国务院关于建设现代农业产业园、培育农业农村发展新动能的决策部署，按照“一年有起色、两年见成效、四年成体系”的总体安排和“先创后认、边创边认、以创为主”的工作要求，启动并批准创建国家现代农业产业园。一年多来，各地坚持“姓农、务农、为农、兴农”建园宗旨，加强创建指导，加大政策支持，推进规模化种养基地建设，促进一二三产融合发展，建成了一批产业特色鲜明、要素高度集聚、设施装备先进、生产方式绿色、经济效益显著、示范带动有力的国家现代农业产业园。
            成为了引领农业农村现代化的排头兵、乡村产业兴旺的新样板。农、为农、兴农”建园宗旨，加强创建指导，加大政策支持，推进规模化种养基地建设。，促进一二三产融合发展，建成了一批产业特色鲜明、要素高度集聚、设施装备先进、生产方式绿色、经济效益显著、示范带动有力的国家现代农业产业园，成为了引领农业农村现代化的排头兵、乡村产业兴旺的新样板。
          </div>
          <template v-if="!isPark">
            <div class="monitor_crop">
              <div class="crop_title">
                <span>种植作物：<span style="color: #21e1ad">黄瓜</span></span>
              </div>
              <div class="crop_text">
                葫芦科黄瓜属一年生攀援草本植物，茎部细长和糙硬毛；叶片呈宽卵状心形或裂片三角形；花呈微柔毛黄白色；果实长圆形或圆柱形熟时黄绿色；种子呈狭卵形白色；花果期为夏季。黄瓜是汉朝张骞出使西域时带回来的，后赵王朝的建立者石勒，一律严禁出现“胡”字，胡瓜更名为黄瓜。
              </div>
            </div>
            <div class="monitor_environment">
              <div class="environment_title">
                <span>生长环境：<span style="color: #21e1ad">生长阶段（50天/生长期）</span></span>
              </div>
              <div class="environment_list">
                <div class="environment_item" v-for="item in 8" :key="item">
                  <img src="@/assets/imgs/platformHome/环境温度_icon.png" alt="" />
                  <div class="environmen_text">
                    <span class="environmen_text_value"
                      >30.5 <span style="font-size: 0.12rem; color: #fff">℃</span></span
                    >
                    <p style="font-size: 0.14rem; color: #fff">环境温度</p>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
  <ElDialog class="warning_dialog" v-model="dialogTableVisible" title="预警信息">
    <Search
      ref="searchRef"
      :schema="allSchemas.searchSchema"
      :chooseListAll="chooseListAll"
      @search="setSearchParamsSub"
      @reset="setSearchParamsSub"
    />
    <Table
      :stripe="false"
      class="warning_table"
      :isShowFilter="false"
      :height="600"
      :columns="allSchemas.tableColumns"
      :data="gridData"
      :border="true"
      :keyTable="'id'"
      :chooseListAll="chooseListAll"
      :header-align="'center'"
      :align="'center'"
      :pagination="{
        total: 10
      }"
    >
      <template #action="{ row }">
        <span class="edit">编辑</span>
        <span class="del">删除</span>
      </template>
    </Table>
  </ElDialog>
</template>
<script setup lang="ts">
import { ref, h, reactive } from 'vue'
import { ElSwitch, ElDialog, ElInput, ElTable, ElMessageBox } from 'element-plus'
import { Table } from '@/components/Table'
import { useTable } from '@/hooks/web/useTable'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { TableColumn } from '@/types/table'
import { useRouter } from 'vue-router'
import { useI18n } from '@/hooks/web/useI18n'
import { loginOutApi } from '@/api/login'
import { useCache } from '@/hooks/web/useCache'
import { useTagsViewStore } from '@/store/modules/tagsView'
import { resetRouter } from '@/router'

const { replace } = useRouter()
const { t } = useI18n()
const { wsCache } = useCache()
const tagsViewStore = useTagsViewStore()
const goBackground = () => {
  replace('/home')
}
const loginOut = () => {
  ElMessageBox.confirm(t('common.loginOutMessage'), t('common.reminder'), {
    confirmButtonText: t('common.ok'),
    cancelButtonText: t('common.cancel'),
    type: 'warning',
    autofocus: false,
    confirmButtonClass: 'quit-btn'
  })
    .then(async () => {
      const res = await loginOutApi().catch(() => {})
      if (res) {
        wsCache.clear()
        tagsViewStore.delAllViews()
        // resetRouter() // 重置静态路由表
        replace('/login')
      }
    })
    .catch(() => {})
}
const deviceStatus = ref<boolean>(true)
const dialogTableVisible = ref<boolean>(false)
const searchValue = ref<string>('')

// const { register, tableObject, methods } = useTable<any>({
//   getListApi: getPlantListApi,
//   delListApi: delPlantApi,
//   response: {
//     list: 'rows',
//     total: 'total',
//     key: 'id'
//   }
// })

// const { getList, setSearchParams } = methods

// getList()
const isPark = ref(true)
const parkIndex = ref(0)
const handlePark = (index) => {
  isPark.value = true
  parkIndex.value = index
}
const handlShed = (index) => {
  isPark.value = false
  parkIndex.value = index
}
const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'userId',
    label: '序号',
    type: 'index',
    fixed: 'left'
  },
  {
    field: 'categoryName',
    minWidth: '1.8rem',
    label: '类别',
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        style: 'width:2rem;' //宽度
      }
    },
    formatter: (row: Recordable) => {
      return h('span', row.categoryName ? row.categoryName : '--')
    }
  },
  {
    field: 'classificationName',
    minWidth: '1.8rem',
    label: '作物分类',
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        style: 'width:2rem;' //宽度
      }
    },
    formatter: (row: Recordable) => {
      return h('span', row.classificationName ? row.classificationName : '--')
    }
  },
  {
    field: 'selectTypeName',
    minWidth: '1.8rem',
    label: '作物种类',
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        style: 'width:2rem;' //宽度
      }
    },
    formatter: (row: Recordable) => {
      return h('span', row.selectTypeName ? row.selectTypeName : '--')
    }
  },
  {
    field: 'action',
    width: '1.8rem',
    label: '操作',
    fixed: 'right'
  }
])
const { allSchemas } = useCrudSchemas(crudSchemas)

const gridData = [
  {
    date: '2016-05-02',
    name: 'John Smith',
    address: 'No.1518,  Jinshajiang Road, Putuo District'
  },
  {
    date: '2016-05-04',
    name: 'John Smith',
    address: 'No.1518,  Jinshajiang Road, Putuo District'
  },
  {
    date: '2016-05-01',
    name: 'John Smith',
    address: 'No.1518,  Jinshajiang Road, Putuo District'
  },
  {
    date: '2016-05-03',
    name: 'John Smith',
    address: 'No.1518,  Jinshajiang Road, Putuo District'
  }
]
const handleWarning = () => {
  dialogTableVisible.value = true
}
const params = reactive<Recordable>({
  categoryName: undefined,
  classificationName: undefined,
  selectTypeName: undefined
})
const chooseListAll = ref([])
//搜索
const setSearchParamsSub = (param: Recordable) => {
  chooseListAll.value = []
  params.categoryName = param.categoryName ? param.categoryName : undefined
  params.classificationName = param.classificationName ? param.classificationName : undefined
  params.selectTypeName = param.selectTypeName ? param.selectTypeName : undefined
  // setSearchParams(params)
}
</script>
<style lang="less">
.el-overlay {
  z-index: 9999 !important;
}
.el-select__popper {
  border: none !important;
}
.el-select-dropdown {
  background-color: #0c614a;
  color: #fff !important;
  font-size: 0.14rem;
  padding: 0.08rem 0.12rem;
  .el-select-dropdown__item {
    color: #fff;
    background-color: #0c614a;
    &:hover {
      background-color: #0c614a;
    }
  }
}
.edit {
  color: #19c194;
  cursor: pointer;
}
.del {
  color: #ff5757;
  margin-left: 0.1rem;
  cursor: pointer;
}
.warning_dialog {
  background: #142b29 !important;
  .el-dialog__title {
    color: #fff !important;
  }
  .el-dialog__close {
    color: #fff !important;
  }
  .el-dialog__body {
    color: #fff !important;
    padding: 0.05rem 0.2rem !important;
  }
  .warning_dialog_search {
    display: flex;
    .search_inp {
      width: 3rem;
      height: 0.36rem;
      border: 0.01rem solid #15aa82 !important;
      border-radius: 0.04rem;
      outline: none;
      .el-input__wrapper {
        background: #0c614a !important;
        .el-input__inner {
          color: #fff !important;
        }
      }
    }
    .dialog_search {
      width: 0.93rem;
      height: 0.36rem;
      background: #15aa82;
      border-radius: 0.04rem;
      margin-left: 0.1rem;
      line-height: 0.36rem;
      text-align: center;
      color: #fff;
      cursor: pointer;
    }
    .dialog_reset {
      width: 0.93rem;
      height: 0.36rem;
      border: 0.01rem solid #15aa82;
      border-radius: 0.04rem;
      margin-left: 0.1rem;
      line-height: 0.36rem;
      text-align: center;
      color: #fff;
      cursor: pointer;
    }
  }
}
.warning_table {
  background-color: #142b29 !important ;
  --el-table-border-color: #142b29 !important;
  // 去掉最下面的那一条线
  ::before {
    height: 0rem !important;
  }
  th.el-table__cell.is-leaf {
    /* 移除默认边框 */
    border: none;
  }
  td.el-table__cell {
    /* 移除默认边框 */
    border: none;
  }
  color: #fff !important;
  margin-top: 0.1rem;
  .el-checkbox__inner {
    background-color: #0c614a !important;
    border: 0.01rem solid #15aa82 !important;
  }
  // .el-table__body tr:hover > td {
  //   background-color: #0b4636 !important;
  // }
  .el-table__body td.el-table__cell {
    background-color: #142b29 !important;
  }
  .el-pagination {
    --el-pagination-button-disabled-color: #fff !important;
    --el-pagination-button-disabled-bg-color: none !important;
    .el-input__inner {
      color: #fff !important;
    }
    .el-pagination__jump {
      color: #fff !important;
    }
    .el-pager li {
      color: #fff !important;
      background: #15aa82 !important;
    }
    .el-pagination__total {
      color: #ffffff !important;
    }
    .el-input__wrapper {
      background-color: #0c614a !important;
      color: #fff !important;
      box-shadow: none;
    }
  }
}
.warning_table tr {
  background-color: #142b29 !important;
  border: none !important;
}
.warning_table th {
  color: #baffe2 !important;
  background: #0b4636 !important;
}
</style>
<style lang="less" scoped>
.platform_center {
  img {
    width: 100%;
  }
}
.platform_box {
  position: relative;
  height: 100%;
  .platform_content {
    position: relative;
    &::after {
      position: absolute;
      content: '';
      display: block;
      top: 0;
      left: 0;
      width: 100vw;
      height: 1.4rem;
      background-image: url('@/assets/imgs/platformHome/top_bg.png');
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }
  }
  .platform_header {
    z-index: 9999;
    position: relative;
    display: flex;
    justify-content: space-between;
    .platform_header_left {
      display: flex;
      .platform_icon {
        margin-top: 0.2rem;
        margin-left: 0.31rem;
        width: 4.01rem;
        height: 0.32rem;
        background-image: url('@/assets/imgs/platformHome/logo_icon.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }
      .platform_nav {
        margin-top: 0.16rem;
        margin-left: 0.49rem;
        display: flex;
        .platform_nav_btn {
          font-size: 0.16rem;
          cursor: pointer;
          font-style: italic;
          color: #fff;
          text-align: center;
          line-height: 0.42rem;
          width: 1.53rem;
          height: 0.42rem;
          background-image: url('@/assets/imgs/platformHome/nav_unselected_bg.png');
          background-repeat: no-repeat;
          margin-right: 0.05rem;
          background-size: 100% 100%;
        }
        .active {
          background-image: url('@/assets/imgs/platformHome/nav_selected_bg.png');
          background-repeat: no-repeat;
          background-size: 100% 100%;
        }
      }
    }
    .platform_header_right {
      display: flex;
      margin-left: 3.2rem;
      .platform_header_weather {
        display: flex;
        align-items: center;
        margin-top: 0.16rem;
        color: #fff;
        // padding-right: .16rem;
        &::after {
          content: '';
          display: block;
          width: 0.01rem;
          height: 0.22rem;
          margin-top: 0.05rem;
          background: #fcf8d3;
          border: 0.02rem solid #36797c;
          margin-left: 0.16rem;
        }
      }
      .platform_time {
        margin-left: 0.16rem;
        display: flex;
        align-items: center;
        margin-top: 0.2rem;
        color: #fff;
        .day {
          font-size: 0.14rem;
        }
        .time {
          font-size: 0.2rem;
          margin-left: 0.16rem;
        }
      }
      .right_btn {
        display: flex;
        align-items: center;
        margin-top: 0.15rem;
        margin-left: 0.19rem;
        .top_right_btn_long {
          cursor: pointer;
          display: flex;
          align-items: center;
          width: 0.96rem;
          height: 0.37rem;
          background-image: url('@/assets/imgs/platformHome/btn_long_bg.png');
          background-repeat: no-repeat;
          background-size: 100% 100%;

          color: #fff;
          img {
            margin-left: 0.1rem;
            margin-right: 0.03rem;
            width: 0.16rem;
            height: 0.16rem;
          }
          span {
            font-size: 0.14rem;
          }
        }
        .top_right_btn_short {
          cursor: pointer;
          margin-left: 0.08rem;
          margin-right: 0.2rem;
          display: flex;
          align-items: center;
          width: 0.7rem;
          height: 0.37rem;
          background-image: url('@/assets/imgs/platformHome/btn_short_bg.png');
          background-repeat: no-repeat;
          background-size: 100% 100%;

          color: #fff;
          img {
            margin-left: 0.1rem;
            margin-right: 0.03rem;
            width: 0.16rem;
            height: 0.16rem;
          }
          span {
            font-size: 0.14rem;
          }
        }
      }
    }
    .platform_warning_box {
      display: flex;
      font-size: 0.16rem;

      .platform_warning {
        color: #fff;
        text-align: center;
        position: absolute;
        top: 1rem;
        left: 50%;
        transform: translate(-70%, -50%);
        margin: auto;
        width: 9.31rem;
        height: 0.41rem;
        line-height: 0.41rem;
        background-image: url('@/assets/imgs/platformHome/prohibit_bg.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;

        img {
          display: inline-block;
          width: 0.4rem;
        }
      }
      .platform_warning_btn {
        cursor: pointer;
        color: #fff;
        text-align: center;
        position: absolute;
        top: 1rem;
        left: 75%;
        transform: translate(-75%, -50%);
        margin: auto;
        width: 1.2rem;
        height: 0.41rem;
        line-height: 0.41rem;
        background-image: url('@/assets/imgs/platformHome/prohibit_btn.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;

        img {
          display: inline-block;
        }
      }
    }
  }
  .shed_box {
    font-size: 0.16rem;
    cursor: pointer;
    text-align: center;
    line-height: 0.28rem;
    position: absolute;
    top: 50%;
    left: 25%;
    transform: translate(-50%, -50%);
    color: #fff;
    width: 1rem;
    height: 0.28rem;
    background-size: 100% 100%;
    background-image: url('@/assets/imgs/platformHome/map_bt_bg.png');
    background-repeat: no-repeat;
    &:hover {
      background-size: 100% 100%;
      background-image: url('@/assets/imgs/platformHome/map_bt_hover_bg.png');
    }
  }
  .platform_left {
    position: absolute;
    left: 0;
    top: 0.7rem;
    width: 2.07rem;
    height: 100%;
    background-size: 100% 100%;
    background-image: url(/src/assets/imgs/platformHome/left_bg.png);
    background-repeat: no-repeat;
    .park_list {
      overflow: overlay;
      height: 60%;
      z-index: 999;
      color: #fff;
      position: absolute;
      top: 0.4rem;
      left: 0.32rem;
      .park_item {
        padding-left: 0.1rem;
        font-size: 0.18rem;
        cursor: pointer;
        margin-top: 0.2rem;
        text-align: center;
        line-height: 0.42rem;
        width: 1.6rem;
        height: 0.42rem;
        background-size: 100% 100%;
        background-image: url('@/assets/imgs/platformHome/navleft_unselected_bg.png');
        background-repeat: no-repeat;
      }
      .active {
        font-size: 0.2rem;
        padding-left: 0.5rem;
        width: 2.02rem;
        background-size: 100% 100%;
        background-image: url('@/assets/imgs/platformHome/navleft_selected_bg.png');
        background-size: 100% 100%;

        background-repeat: no-repeat;
      }
    }
  }
  .platform_right {
    position: absolute;
    right: 0;
    top: 0;
    width: 4.61rem;
    height: 100%;
    background-image: url('@/assets/imgs/platformHome/right_bg.png');
    background-size: 100% 100%;
    font-size: 0.18rem;
    background-repeat: no-repeat;
    z-index: 99;
    .overview_title {
      font-size: 0.18rem;
      color: #fff;
      line-height: 0.36rem;
      padding-left: 0.4rem;
      margin-left: 0.23rem;
      margin-top: 0.85rem;
      width: 3.97rem;
      height: 0.36rem;
      background-image: url('@/assets/imgs/platformHome/bt_bg.png');
      background-size: 100% 100%;

      background-repeat: no-repeat;
    }
    .platform_device {
      display: flex;
      margin-left: 0.4rem;
      margin-top: 0.4rem;
      width: 3.89rem;
      height: 0.49rem;
      background-image: url('@/assets/imgs/platformHome/device_bg.png');
      background-size: 100% 100%;

      background-repeat: no-repeat;
      .platform_device_left {
        text-align: center;
        color: #fff;
        margin-left: 0.53rem;
        width: 1.91rem;
        height: 0.25rem;
        line-height: 0.25rem;
        background-image: url('@/assets/imgs/platformHome/num_bg.png');
        background-size: 100% 100%;

        background-repeat: no-repeat;
        .platform_device_num {
          font-size: 0.3rem;
          color: #00fab2;

          font-weight: bold;
        }
      }
      .platform_device_icon {
        margin-top: -0.15rem;
        margin-left: 0.14rem;
        width: 0.91rem;
        height: 0.6rem;
        background-image: url('@/assets/imgs/platformHome/device_all_icon.png');
        background-size: 100% 100%;

        background-repeat: no-repeat;
        margin-bottom: 0.17rem;
      }
    }
    .platform_online_device {
      margin-left: 0.4rem;
      margin-top: 0.05rem;
      display: flex;
      .online_device {
        display: flex;
        align-items: center;
        width: 1.91rem;
        height: 0.99rem;
        background: linear-gradient(0deg, #096f5f 0%, #072626 100%);
        opacity: 0.8;
        border-radius: 0.06rem;
        margin: 0 0.04rem;
        .online_device_left {
          margin-left: 0.25rem;
          margin-right: 0.12rem;
          img {
            width: 0.57rem;
          }
        }
        .online_device_num {
          width: 0.77rem;
          height: 0.27rem;
          background: #0f5e3e;
          opacity: 0.5;
          text-align: center;
          color: #00fab2;
          font-size: 0.18rem;
          border-left: 0.02rem solid #00fab1;
          border-right: 0.02rem solid #00fab1;
          font-weight: bold;
          span {
            font-size: 0.14rem;
            font-weight: normal;
          }
        }
        .not_online_device_num {
          width: 0.77rem;
          height: 0.27rem;
          background: #566660;
          opacity: 0.5;
          text-align: center;
          color: #c5c5c5;
          font-size: 0.18rem;
          border-left: 0.02rem solid #e6e6e6;
          border-right: 0.02rem solid #e6e6e6;
          font-weight: bold;
        }
        .online_device_text {
          text-align: center;
          color: #fff;
          font-size: 0.14rem;
          margin-top: 0.07rem;
        }
      }
    }
    .device_operate_box {
      margin-top: 0.24rem;
      margin-left: 0.4rem;
      width: 3.9rem;
      height: 0.38rem;
      border: 0.01rem solid;
      border-image: linear-gradient(0deg, #007e60, #22d4aa) 10 10;
      background: linear-gradient(0deg, #014d3c 0%, #0f3937 100%);
      border-radius: 0.04rem;
      color: #94dcc7;
      display: flex;
      align-items: center;
      justify-content: space-around;
    }
    .device_box {
      height: 50%;
      overflow: overlay;

      .device_operate_item {
        margin-top: 0.08rem;
        margin-left: 0.4rem;
        width: 3.9rem;
        height: 0.38rem;
        border-left: 0.03rem solid #16874f;
        border-right: 0.03rem solid #16874f;
        background: #12433b;
        border-radius: 0.02rem;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .device_name {
          z-index: 999;
          text-align: center;
          line-height: 0.38rem;
          width: 1.06rem;
          height: 0.38rem;
        }
        .device_operate_right {
          flex: 1;
          display: flex;
          justify-content: space-around;
          .device_operate_view {
            cursor: pointer;
            text-align: center;
            line-height: 0.26rem;
            color: #2addad;
            width: 2.55rem;
            height: 0.26rem;
            border: 0.01rem solid #02774c;
            border-radius: 0.04rem;
          }
          .device_operate {
            width: 1.2rem;
            line-height: 0.26rem;
            height: 0.26rem;
            background: rgba(15, 55, 55, 0.9);
            border: 0.01rem solid #02774c;
            border-left: none;
            border-radius: 0.04rem;
            display: flex;
            align-items: center;
            justify-content: space-between;

            span {
              height: 100%;
              cursor: pointer;
              flex: 1;
              text-align: center;
              display: inline-block;
              border-left: 0.01rem solid #02774c;
              font-size: 0.14rem;
            }
            .active {
              background: #15aa82;
            }
          }
          .device_operate_switch {
            width: 1.2rem;
            height: 0.26rem;
            text-align: center;
            // font-size: 0.14rem;

            :deep(.el-switch) {
              height: 0.32rem;
              .el-switch__core {
                height: 0.2rem;
                // min-width: 0.4rem;
                .el-switch__inner {
                  height: 0.16rem;
                  padding: 0 calc(0.16rem + 0.02rem) 0 0.04rem;
                  .is-text {
                    font-size: 0.12rem;
                    overflow: visible;
                  }
                }
                .el-switch__action {
                  left: calc(100% - 0.17rem);
                  width: 0.16rem;
                  height: 0.16rem;
                }
              }
            }
          }
          .device_operate_mode {
            width: 1.2rem;
            line-height: 0.26rem;
            height: 0.26rem;
            background: rgba(15, 55, 55, 0.9);
            border: 0.01rem solid #02774c;
            border-left: none;
            border-radius: 0.04rem;
            display: flex;
            align-items: center;
            justify-content: space-between;

            span {
              height: 100%;
              cursor: pointer;
              flex: 1;
              text-align: center;
              display: inline-block;
              border-left: 0.01rem solid #02774c;
              font-size: 0.14rem;
            }
            .active {
              background: #15aa82;
            }
          }
        }
      }
    }
  }
  .platform_bottom {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 19.19rem;
    height: 2.85rem;
    background-image: url('@/assets/imgs/platformHome/bottom_bg.png');
    background-size: 100% 100%;

    background-repeat: no-repeat;
    .platform_bottom_box {
      z-index: 9999;
      margin-top: 0.5rem;
      margin-left: 0.32rem;
      width: 14.34rem;
      height: 2.2rem;
      background: linear-gradient(0deg, #061b1d 0%, rgba(6, 27, 29, 0) 100%);
      // opacity: 0.6;
      .bottom_box_title {
        width: 3.97rem;
        height: 0.36rem;
        background-image: url('@/assets/imgs/platformHome/bt_bg.png');
        background-size: 100% 100%;
        font-size: 0.18rem;
        background-repeat: no-repeat;
        color: #fff;
        padding-left: 0.4rem;
        line-height: 0.36rem;
      }
      .bottom_box_content {
        display: flex;
        // justify-content: space-between;
        .bottom_content_left {
          display: flex;
          .monitor {
            width: 2.82rem;
            height: 1.48rem;
          }
          .monitor_list {
            .monitor_item {
              cursor: pointer;
              font-size: 0.14rem;
              text-align: center;
              width: 0.83rem;
              height: 0.34rem;
              line-height: 0.34rem;
              color: #fff;
              background-image: url('@/assets/imgs/platformHome/monitor_unselected_btn.png');
              background-size: 100% 100%;

              background-repeat: no-repeat;
              margin: 0.01rem 0;
            }
            .active {
              background-image: url('@/assets/imgs/platformHome/monitor_selected_btn.png');
              background-size: 100% 100%;

              background-repeat: no-repeat;
            }
          }
        }
        .monitor_text {
          width: 11rem;
          color: #fff;
          margin-left: 0.2rem;
          font-size: 0.14rem;
          line-height: 0.28rem;
        }
        .monitor_crop {
          width: 3.1rem;
          margin-left: 0.2rem;
          .crop_title {
            color: #fff;
            width: 3.09rem;
            height: 0.33rem;
            background-image: url('@/assets/imgs/platformHome/zw_bt_bg.png');
            background-size: 100% 100%;
            font-size: 0.18rem;
            background-repeat: no-repeat;
            padding-left: 0.3rem;
            line-height: 0.33rem;
          }
          .crop_text {
            font-size: 0.14rem;
            color: #fff;
            margin-top: 0.12rem;
          }
        }
        .monitor_environment {
          width: 6.59rem;
          height: 0.33rem;
          margin-left: 0.2rem;
          .environment_title {
            color: #fff;
            width: 6.59rem;
            height: 0.33rem;
            background-image: url('@/assets/imgs/platformHome/zw_btlong_bg.png');
            background-size: 100% 100%;
            font-size: 0.18rem;
            background-repeat: no-repeat;
            padding-left: 0.3rem;
            line-height: 0.33rem;
          }
          .environment_list {
            width: 6.59rem;
            margin-top: 0.1rem;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;

            .environment_item {
              width: 1.5rem;
              height: 0.64rem;
              background-image: url('@/assets/imgs/platformHome/environment_bg.png');
              background-size: 100% 100%;
              font-size: 0.18rem;

              background-repeat: no-repeat;
              margin-bottom: 0.06rem;
              padding-top: 0.11rem;
              padding-left: 0.12rem;
              display: flex;
              img {
                width: 0.32rem;
                height: 0.32rem;
                margin-right: 0.1rem;
              }
              .environmen_text {
                margin-top: -0.06rem;
                .environmen_text_value {
                  color: #00fab2;
                  font-weight: bold;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
