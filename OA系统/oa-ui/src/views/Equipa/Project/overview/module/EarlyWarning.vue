<template>
  <ContentBox class="w-[53.125vw]">
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center h-full nav">
          <p
            class="tab relative"
            v-for="(item, index) in selectTab"
            :key="index"
            @click="selectChange(item)"
            :class="item.type === tabType ? 'active' : ''"
            >{{ item.label }}
            <!-- <span
              v-if="item.unread && item.unread > 0"
              :class="item.type === tabType ? 'bg-[#BABFC5]' : 'bg-[#FF333A]'"
              class="text-xs absolute top-6px right-[-4px] rounded-full w-16px h-16px text-[#fff] flex items-center justify-center"
              >{{ item.unread > 99 ? 99 : item.unread }}</span
            > -->
          </p>
        </div>
        <div @click="more" class="text-sm text-[#666666] mr-[1.8vw] cursor-pointer">
          更多
          <span>></span>
        </div>
      </div>
    </template>
    <template #content>
      <div v-if="tabType === 1 && projectData.length">
        <div
          class="hidden 2xl:block px-[1.09vw] pt-[17px] h-full h-[300px] overflow-hidden mb-36px"
        >
          <el-table
            class="flie-table warm-table"
            :data="projectData"
            height="320"
            header-align="center"
            align="center"
          >
            <el-table-column align="center" width="80" label="序号" prop="date">
              <template #default="scope"
                ><span>{{ scope.$index || scope.$index == 0 ? scope.$index + 1 : '--' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="项目编号" width="140" prop="itemNumber">
              <template #default="scope"
                ><span>{{ scope.row.itemNumber ? scope.row.itemNumber : '--' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="项目名称" width="200" prop="projectTitle" class="">
              <template #default="scope"
                ><p class="overflow-hidden w-full h-20px">
                  <span
                    :title="scope.row.projectTitle"
                    class="text-[#222] block overflow-hidden h-20px max-w-150px truncate"
                    >{{ scope.row.projectTitle }}</span
                  >
                  <!--              {{-->
                  <!--                scope.row.projectTitle ? scope.row.projectTitle : '&#45;&#45;'-->
                  <!--              }}-->
                </p>
              </template>
            </el-table-column>
            <el-table-column label="当前阶段" width="100" prop="phase">
              <template #default="scope">
                <span>{{
                  scope.row.phase == '1'
                    ? '培育'
                    : scope.row.phase == '2'
                    ? '立项'
                    : scope.row.phase == '3'
                    ? '实施'
                    : scope.row.phase == '4'
                    ? '售后'
                    : scope.row.phase == '5'
                    ? '自研'
                    : '--'
                }}</span>
              </template>
            </el-table-column>
            <el-table-column width="auto" label="当前最新进展" prop="pmProgressList">
              <template #default="scope"
                ><span
                  :title="
                    scope.row.pmProgressList.length ? scope.row.pmProgressList[0].content : '--'
                  "
                  class="truncateTwo text-[#222] block overflow-hidden"
                  >{{
                    scope.row.pmProgressList.length ? scope.row.pmProgressList[0].content : '--'
                  }}</span
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div
          class="2xl:hidden block px-[1.09vw] 2xl:pt-[17px] pt-10px h-full h-[270px] overflow-hidden mb-36px"
        >
          <el-table
            class="flie-table warm-table"
            :data="projectData"
            height="218"
            header-align="center"
            align="center"
          >
            <el-table-column align="center" width="70" label="序号" prop="date">
              <template #default="scope"
                ><span>{{ scope.$index || scope.$index == 0 ? scope.$index + 1 : '--' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="项目编号" width="140" prop="itemNumber">
              <template #default="scope"
                ><span>{{ scope.row.itemNumber ? scope.row.itemNumber : '--' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="项目名称" width="110" prop="projectTitle" class="">
              <template #default="scope"
                ><p class="overflow-hidden w-full h-20px">
                  <span
                    :title="scope.row.projectTitle"
                    class="text-[#222] block overflow-hidden h-20px max-w-150px truncate"
                    >{{ scope.row.projectTitle }}</span
                  >
                  <!--              {{-->
                  <!--                scope.row.projectTitle ? scope.row.projectTitle : '&#45;&#45;'-->
                  <!--              }}-->
                </p>
              </template>
            </el-table-column>
            <el-table-column label="当前阶段" width="80" prop="phase">
              <template #default="scope">
                <span>{{
                  scope.row.phase == '1'
                    ? '培育'
                    : scope.row.phase == '2'
                    ? '立项'
                    : scope.row.phase == '3'
                    ? '实施'
                    : scope.row.phase == '4'
                    ? '售后'
                    : scope.row.phase == '5'
                    ? '自研'
                    : '--'
                }}</span>
              </template>
            </el-table-column>
            <el-table-column width="auto" label="当前最新进展" prop="pmProgressList">
              <template #default="scope"
                ><span
                  :title="
                    scope.row.pmProgressList.length ? scope.row.pmProgressList[0].content : '--'
                  "
                  class="truncateTwo text-[#222] block overflow-hidden"
                  >{{
                    scope.row.pmProgressList.length ? scope.row.pmProgressList[0].content : '--'
                  }}</span
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div v-else-if="tabType === 2 && warnListData.length">
        <div
          class="hidden 2xl:block px-[1.09vw] pt-[17px] h-full h-[300px] overflow-hidden mb-36px"
        >
          <el-table
            class="flie-table warm-table"
            :data="warnListData"
            height="320"
            header-align="center"
            align="center"
          >
            <el-table-column align="center" width="70" label="序号" prop="date">
              <template #default="scope"
                ><span>{{ scope.$index || scope.$index == 0 ? scope.$index + 1 : '--' }}</span>
              </template>
            </el-table-column>
            <el-table-column width="240" label="项目名称" prop="projectTitle" class="">
              <template #default="scope"
                ><p class="overflow-hidden w-full h-20px">
                  <span
                    :title="scope.row.projectTitle"
                    class="text-[#222] block overflow-hidden h-20px max-w-220px truncate"
                    >{{ scope.row.projectTitle }}</span
                  >
                  <!--              {{-->
                  <!--                scope.row.projectTitle ? scope.row.projectTitle : '&#45;&#45;'-->
                  <!--              }}-->
                </p>
              </template>
            </el-table-column>
            <el-table-column width="120" label="负责人" prop="principalPersonName">
              <template #default="scope"
                ><span>{{
                  scope.row.principalPersonName ? scope.row.principalPersonName : '--'
                }}</span>
              </template>
            </el-table-column>
            <el-table-column width="auto" label="预警事项" prop="content">
              <template #default="scope"
                ><span
                  :title="scope.row.content ? scope.row.content : '--'"
                  class="truncateTwo text-[#222] block overflow-hidden"
                  >{{ scope.row.content ? scope.row.content : '--' }}</span
                >
              </template>
            </el-table-column>
          </el-table></div
        >
        <div class="block 2xl:hidden px-[1.09vw] pt-10px h-full h-[300px] overflow-hidden mb-36px">
          <el-table
            class="flie-table warm-table"
            :data="warnListData"
            height="218"
            header-align="center"
            align="center"
          >
            <el-table-column align="center" width="70" label="序号" prop="date">
              <template #default="scope"
                ><span>{{ scope.$index || scope.$index == 0 ? scope.$index + 1 : '--' }}</span>
              </template>
            </el-table-column>
            <el-table-column width="240" label="项目名称" prop="projectTitle" class="">
              <template #default="scope"
                ><p class="overflow-hidden w-full h-20px">
                  <span
                    :title="scope.row.projectTitle"
                    class="text-[#222] block overflow-hidden h-20px max-w-220px truncate"
                    >{{ scope.row.projectTitle }}</span
                  >
                  <!--              {{-->
                  <!--                scope.row.projectTitle ? scope.row.projectTitle : '&#45;&#45;'-->
                  <!--              }}-->
                </p>
              </template>
            </el-table-column>
            <el-table-column width="120" label="负责人" prop="principalPersonName">
              <template #default="scope"
                ><span>{{
                  scope.row.principalPersonName ? scope.row.principalPersonName : '--'
                }}</span>
              </template>
            </el-table-column>
            <el-table-column width="auto" label="预警事项" prop="content">
              <template #default="scope"
                ><span
                  :title="scope.row.content ? scope.row.content : '--'"
                  class="truncateTwo text-[#222] block overflow-hidden"
                  >{{ scope.row.content ? scope.row.content : '--' }}</span
                >
              </template>
            </el-table-column>
          </el-table></div
        >
      </div>

      <div
        class="2xl:px-[1.56vw] px-[14px] pt-[6px] h-[336px] overflow-scroll flex justify-center items-center"
        v-else
      >
        <NoData />
      </div>
      <!--      项目统计  -->
      <ItemStatisticsList ref="itemStatisticsListRef" />
      <!--      预警事项  -->
      <ForewarningList ref="forewarningListRef" />
    </template>
  </ContentBox>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ContentBox } from '@/views/Equipa/Project/overview/components'
import ItemStatisticsList from '../list/ItemStatisticsList.vue'
import NoData from '@/views/Components/NoData.vue'
import ForewarningList from '../list/ForewarningList.vue'
import { getProjectListApi, getProjectWarnListApi } from '@/api/project/overview'

const tabType = ref(1)
const itemStatisticsListRef = ref()
const forewarningListRef = ref()

const projectData = ref([])
const warnListData = ref([])
const more = () => {
  if (tabType.value == 1) {
    //待办事宜
    itemStatisticsListRef.value.openDrawer()
  } else if (tabType.value == 2) {
    //消息提醒
    forewarningListRef.value.openDrawer()
  }
}

// tab
const selectChange = (e) => {
  tabType.value = e.type
}

const init = async () => {
  let res = await getProjectListApi()
  if (res && res.rows) {
    projectData.value = res.rows
  }

  let resWarn = await getProjectWarnListApi()
  if (resWarn && resWarn.rows) {
    warnListData.value = resWarn.rows
  }
}

init()
const selectTab = ref([
  {
    type: 1,
    label: '项目统计',
    valye: 10,
    unread: 0
  },
  {
    type: 2,
    label: '预警事项',
    valye: 20,
    unread: 12
  }
])
</script>

<style lang="less" scoped>
.warm-table{
  width: 100%; font-size: 14px;
}
.nav p {
  font-size: 16px;
  margin: 0 13px;
  padding: 0 5px;
  font-family: Alibaba PuHuiTi M;
  font-weight: 400;
  color: #333333;
  cursor: pointer;
}

.nav .active {
  border-bottom: 2px solid #00a0e9;
  z-index: 2;
}

ul li {
  &:last-child {
    border: 0;
  }
}
.truncateTwo {
  overflow: hidden;
  -webkit-line-clamp: 2;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}

@media screen and (max-width: 1536px) {
  .nav p {
    font-size: 14px !important;
    margin: 0 5px;
    padding: 0 12px;
  }
  .truncateTwo {
    line-height: 15px;
  }

  :deep(.flie-table .el-table__row .el-table__cell),
  :deep(.flie-table thead .el-table__cell) {
    height: 33px !important;
    padding: 6px 0 !important;
  }
  :deep(.flie-table thead .el-table__cell) {
    font-size: 13px !important;
  }
  :deep(.flie-table .el-table--default .cell),
  :deep(.flie-table thead .el-table__cell) {
    padding: 0 !important;
  }
}
</style>
