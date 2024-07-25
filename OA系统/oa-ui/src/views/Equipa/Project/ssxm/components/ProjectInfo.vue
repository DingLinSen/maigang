<!--培育项目信息-->
<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Segmentation } from '@/components/Segmentation'
import moment from 'moment'
import { getProjectStatusLabel } from '../../config/config'
import { EstablishForm } from '../../components'
import { getExportImplementation } from '@/api/project/ssxm'

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
  await getExportImplementation(props.detailsData.pid)
}

//是否显示立项表
const implementFormFlag = ref(false)

//开关立项表
const implementFormClick = () => {
  implementFormFlag.value = !implementFormFlag.value
}

//关闭项目实施确认表
const colseDataForm = () => {
  implementFormFlag.value = false
}

const getLastUserUnit = (): string => {
  let label: string = '--'
  if (props.detailsData.directCustomerId) {
    if (props.detailsData.projectAffiliation == '1') {
      label = props.detailsData.directCustomerName ? props.detailsData.directCustomerName : '--'
    } else {
      label = props.detailsData.finalCustomerName ? props.detailsData.finalCustomerName : '--'
    }
  } else {
    label = props.detailsData.lastUserUnit ? props.detailsData.lastUserUnit : '--'
  }

  return label
}

const getContractSignUnit = () => {
  let label: string = '--'
  if (props.detailsData.directCustomerId) {
    label = props.detailsData.directCustomerName ? props.detailsData.directCustomerName : '--'
  } else {
    label = props.detailsData.contractSignUnit ? props.detailsData.contractSignUnit : '--'
  }
  return label
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
              <p class="p-ellipsis flex-1 truncate text-left" :title="detailsData.projectTitle">
                {{ detailsData.projectTitle || '--' }}
              </p>
            </div>
          </ElCol>
          <ElCol :span="8">
            <div class="flex">
              <p class="name-p mr-2"> 合同金额：</p>
              <p class="flex-1 truncate text-left">
                {{
                  (detailsData.contractMoney ? detailsData.contractMoney + '万元' : '--') || '--'
                }}
              </p>
            </div>
          </ElCol>
          <ElCol :span="8">
            <div class="flex">
              <p class="name-p mr-2"> 预计验收时间：</p>
              <p class="flex-1 truncate text-left">
                {{
                  detailsData.predictAcceptDate
                    ? moment(detailsData.predictAcceptDate).format('YYYY-MM-DD')
                    : '--'
                }}
              </p>
            </div>
          </ElCol>
          <ElCol :span="8">
            <div class="flex">
              <p class="name-p mr-2"> 项目经理：</p>
              <p
                :title="detailsData.projectManagerName"
                class="p-ellipsis flex-1 truncate text-left"
              >
                {{ detailsData.projectManagerName || '--' }}
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
                      : detailsData.status === '3'
                      ? 'info'
                      : detailsData.status === '4' || detailsData.status === '6'
                      ? 'warning'
                      : detailsData.status === '5'
                      ? 'danger'
                      : 'danger'
                  "
                >
                  <!-- 0培育审批中，1进展中，2结束转立项审批中，3结束转立项，4结束终止审批中，5结束终止 -->

                  {{ getProjectStatusLabel('3', detailsData.status) || '--' }}
                </el-tag>
              </div>
            </div>
          </ElCol>
          <ElCol :span="8">
            <div class="flex">
              <p class="name-p mr-2"> 所属行业：</p>
              <p class="flex-1 truncate text-left">
                {{
                  detailsData.projectType === '0'
                    ? '农业农村'
                    : detailsData.projectType === '1'
                    ? '铁路交通'
                    : detailsData.projectType === '2'
                    ? '军工'
                    : detailsData.projectType === '3'
                    ? '其他'
                    : '--'
                }}
              </p>
            </div>
          </ElCol>
          <ElCol :span="8">
            <div class="flex">
              <p class="name-p mr-2"> 最终用户名称：</p>
              <p class="p-ellipsis flex-1 truncate text-left" :title="getLastUserUnit()">
                {{ getLastUserUnit() }}
              </p>
            </div>
          </ElCol>
          <ElCol :span="8">
            <div class="flex">
              <p class="name-p mr-2"> 合同签订单位：</p>
              <p class="p-ellipsis flex-1 truncate text-left" :title="getContractSignUnit()">
                {{ getContractSignUnit() }}
              </p>
            </div>
          </ElCol>
          <ElCol :span="8">
            <div class="flex">
              <p class="name-p mr-2"> 合同签订日期：</p>
              <p class="flex-1 truncate text-left">
                {{
                  detailsData.contractSignDate
                    ? moment(detailsData.contractSignDate).format('YYYY-MM-DD')
                    : '--'
                }}
              </p>
            </div>
          </ElCol>
          <ElCol :span="8">
            <div class="flex">
              <p class="name-p mr-2"> 项目合同编号：</p>
              <p class="p-ellipsis flex-1 truncate text-left" :title="detailsData.contractNumber">
                {{ detailsData.contractNumber || '--' }}
              </p>
            </div>
          </ElCol>
          <ElCol :span="8"> </ElCol>
          <ElCol :span="24">
            <div class="flex">
              <P class="name-p mr-2"> 项目实施确认表：</P>
              <div class="flex items-center">
                <p class="cursor-pointer text-blue-500" @click="implementFormClick()">{{
                  implementFormFlag ? '点击关闭项目实施确认表' : '点击打开项目实施确认表'
                }}</p>
                <el-button
                  v-hasPermi="'project:ssxm:export'"
                  type="primary"
                  class="ml-2 segmentation"
                  @click="exprot"
                  >导出项目实施确认表</el-button
                >
              </div>
            </div>
            <EstablishForm :detailsData="detailsData" v-if="implementFormFlag" />
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
