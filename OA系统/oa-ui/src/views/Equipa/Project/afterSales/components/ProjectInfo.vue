<!--培育项目信息-->
<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Segmentation } from '@/components/Segmentation'
import moment from 'moment'
import { getProjectStatusLabel } from '../../config/config'
import { AfterSalesPlanForm } from '../../components'
import { getExportAfterSales } from '@/api/project/afterSales'

const props = defineProps({
  detailsData: {
    type: Object,
    default: {}
  }
})

const nameOverflow = (name: string, length: number) => {
  let nextName = ''
  if (name && name.length) {
    if (name.length > length) {
      nextName = name.slice(0, length) + '...'
    } else {
      nextName = name
    }
  } else {
    nextName = ''
  }
  return nextName
}
// 导出
const exprot = async () => {
  await getExportAfterSales(props.detailsData.pid)
}

//是否显示立项表
const implementFormFlag = ref(false)

//开关立项表
const implementFormClick = () => {
  implementFormFlag.value = !implementFormFlag.value
}

const getAfterSalePersonName = () => {
  let userName = '--'
  if (props.detailsData.afterSaleType === '1') {
    userName = props.detailsData.salesManagerName
  } else {
    if (props.detailsData.afterSalePersonName) {
      userName = props.detailsData.afterSalePersonName
    } else {
      userName = '售后技术服务组'
    }
  }
  return userName
}

//关闭项目实施确认表
const colseDataForm = () => {
  implementFormFlag.value = false
}

defineExpose({
  colseDataForm
})
</script>
<template>
  <Segmentation title="项目信息" class="projectDebriefing">
    <template #content>
      <div class="ml-[15px]">
        <ElRow :gutter="16" style="text-align: center" justify="space-between" class="top-row-sub">
          <ElCol :span="8">
            <div class="flex">
              <p class="name-p mr-2"> 项目编号：</p>
              <p class="sub-title flex-1 truncate text-left" :title="detailsData.itemNumber">
                {{ detailsData.itemNumber || '--' }}
              </p>
            </div>
          </ElCol>
          <ElCol :span="8">
            <div class="flex">
              <p class="name-p mr-2"> 项目名称：</p>
              <p
                class="sub-title flex-1 truncate text-left p-ellipsis"
                :title="detailsData.projectTitle"
              >
                {{ detailsData.projectTitle || '--' }}
              </p>
            </div>
          </ElCol>
          <ElCol :span="8">
            <div class="flex">
              <p class="name-p mr-2"> 用户名称：</p>
              <p
                class="sub-title flex-1 truncate text-left p-ellipsis"
                :title="detailsData.ownerName"
              >
                {{ detailsData.ownerName || '--' }}
              </p>
            </div>
          </ElCol>
          <ElCol :span="8">
            <div class="flex">
              <p class="name-p mr-2"> 售后期限：</p>
              <p class="flex-1 truncate text-left">
                {{ (detailsData.afterSaleDate ? detailsData.afterSaleDate : '--') || '--' }}
              </p>
            </div>
          </ElCol>
          <ElCol :span="8">
            <div class="flex">
              <p class="name-p mr-2"> 售后截至时间：</p>
              <p class="flex-1 truncate text-left">
                {{
                  detailsData.afterSaleDeadline
                    ? moment(detailsData.afterSaleDeadline).format('YYYY-MM-DD')
                    : '--'
                }}
              </p>
            </div>
          </ElCol>
          <ElCol :span="8">
            <div class="flex">
              <p class="name-p mr-2"> 巡检开始时间：</p>
              <p class="flex-1 truncate text-left">
                {{
                  detailsData.pollingDate
                    ? moment(detailsData.pollingDate).format('YYYY-MM-DD')
                    : '--'
                }}
              </p>
            </div>
          </ElCol>
          <ElCol :span="8">
            <div class="flex">
              <p class="name-p mr-2"> 销售经理：</p>
              <p class="flex-1 truncate text-left" :title="detailsData.salesManagerName">
                {{ nameOverflow(detailsData.salesManagerName, 15) || '--' }}
              </p>
            </div>
          </ElCol>
          <ElCol :span="8">
            <div class="flex">
              <p class="name-p mr-2"> 售后负责人：</p>
              <p class="flex-1 truncate text-left" :title="detailsData.afterSalePersonName">
                {{ getAfterSalePersonName() || '--' }}
              </p>
            </div>
          </ElCol>
          <ElCol :span="8">
            <div class="flex">
              <p class="name-p mr-2"> 状态：</p>
              <div class="flex-1 truncate text-left">
                <el-tag
                  class="mt-1"
                  :type="
                    detailsData.status === '0'
                      ? 'success'
                      : detailsData.status === '1'
                      ? 'primary'
                      : detailsData.status === '2'
                      ? 'success'
                      : detailsData.status === '3' || detailsData.status === '6'
                      ? 'info'
                      : detailsData.status === '4'
                      ? 'warning'
                      : detailsData.statu === '5'
                      ? 'danger'
                      : 'danger'
                  "
                >
                  <!-- 1实施转售后审批中，2售后中，3项目结束，4项目结束审批中 -->
                  {{ getProjectStatusLabel('4', detailsData.status) || '--' }}
                </el-tag>
              </div>
            </div>
          </ElCol>
          <ElCol :span="8">
            <div class="flex">
              <p class="name-p mr-2"> 验收时间：</p>
              <p class="flex-1 truncate text-left">
                {{
                  detailsData.acceptDate
                    ? moment(detailsData.acceptDate).format('YYYY-MM-DD')
                    : '--'
                }}
              </p>
            </div>
          </ElCol>
          <ElCol :span="8">
            <div class="flex">
              <p class="name-p mr-2"> 回款日期：</p>
              <p class="flex-1 truncate text-left">
                {{
                  detailsData.paymentDate
                    ? moment(detailsData.paymentDate).format('YYYY-MM-DD')
                    : '--'
                }}
              </p>
            </div>
          </ElCol>
          <ElCol :span="8">
            <div class="flex">
              <p class="name-p mr-2"> 项目结束时间：</p>
              <p class="flex-1 truncate text-left">
                {{ detailsData.endTime ? moment(detailsData.endTime).format('YYYY-MM-DD') : '--' }}
              </p>
            </div></ElCol
          >
          <ElCol :span="8">
            <div class="flex">
              <p class="name-p mr-2"> 售后服务要求：</p>
              <p class="flex-1 truncate text-left p-ellipsis" :title="detailsData.afterSaleRequire">
                {{ detailsData.afterSaleRequire || '--' }}
              </p>
            </div>
          </ElCol>
          <ElCol :span="8">
            <div class="flex">
              <p class="name-p mr-2"> 售后服务目的：</p>
              <p :title="detailsData.afterSalePurpose" class="p-ellipsis flex-1 truncate text-left">
                {{ detailsData.afterSalePurpose || '--' }}
              </p>
            </div>
          </ElCol>
          <ElCol :span="8">
            <div class="flex">
              <p class="name-p mr-2"> 售后服务计划：</p>
              <p :title="detailsData.afterSalePlan" class="p-ellipsis flex-1 truncate text-left">
                {{ detailsData.afterSalePlan || '--' }}
              </p>
            </div>
          </ElCol>

          <ElCol :span="24">
            <div class="flex">
              <P class="name-p mr-2"> 项目售后计划书：</P>
              <div class="flex items-center">
                <p class="cursor-pointer text-blue-500" @click="implementFormClick()">{{
                  implementFormFlag ? '点击关闭项目售后计划书' : '点击打开项目售后计划书'
                }}</p>
                <el-button
                  v-hasPermi="'project:sh:export'"
                  type="primary"
                  class="ml-2 segmentation"
                  @click="exprot"
                  >导出项目售后计划书</el-button
                >
              </div>
            </div>
            <AfterSalesPlanForm :detailsData="detailsData" v-if="implementFormFlag" />
          </ElCol>
        </ElRow>
      </div>
    </template>
  </Segmentation>
</template>

<style lang="less">
.name-p {
  font-family: 'Alibaba PuHuiTi R';
  color: #888888;
  font-size: 15px;
  flex-wrap: nowrap !important;
}
.name-p mr-2 {
  color: #888888;
  font-size: 15px;
}
.sub-title {
  font-family: 'Alibaba PuHuiTi R';
  font-size: 15px;
  color: #000000;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
.top-row-sub {
  // border-bottom: 1px solid rgba(217, 221, 231, 0.8);
  margin: 0 0px !important;
  // padding: 15px 0 20px 0;

  p {
    font-size: 14px !important;
    line-height: 32px;
  }
}

@media screen and (min-width: 1366px) {
  .p-ellipsis {
    width: 66%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: left;
  }
}
@media screen and (min-width: 1400px) {
  .p-ellipsis {
    width: 74%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: left;
  }
}
</style>
