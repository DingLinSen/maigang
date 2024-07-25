<!--培育项目信息-->
<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Segmentation } from '@/components/Segmentation'
import moment from 'moment'
import {
  getProjectStatusLabel,
  purchaseMethod,
  predictSignedOdds,
  projectPhasesCondition
} from '../../config/config'
import { ImplementForm } from '../../components'
import { getExportApproval } from '@/api/project/Implement'

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

const purchaseText = computed(() => {
  return (status: string) => {
    let a = ''
    purchaseMethod.forEach((v: any) => {
      if (status == v.value) {
        a = v.label
      }
    })
    return a
  }
})

const projectPhasesText = computed(() => {
  return (status: string) => {
    let a = ''
    projectPhasesCondition.forEach((v: any) => {
      if (status == v.value) {
        a = v.label
      }
    })
    return a
  }
})

const predictSigneText = computed(() => {
  return (status: string) => {
    let a = ''
    predictSignedOdds.forEach((v: any) => {
      if (status == v.value) {
        a = v.label
      }
    })
    return a
  }
})

// 导出
const exprot = async () => {
  await getExportApproval(props.detailsData.pid)
}

//是否显示立项表
const implementFormFlag = ref(false)

//开关立项表
const implementFormClick = () => {
  implementFormFlag.value = !implementFormFlag.value
}

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
            <div class="flex" style="align-items: center">
              <p class="name-p mr-2"> 项目名称：</p>
              <p class="p-ellipsis flex-1 truncate text-left" :title="detailsData.projectTitle">
                {{ detailsData.projectTitle || '--' }}
              </p>
            </div>
          </ElCol>
          <ElCol :span="8">
            <div class="flex">
              <p class="name-p mr-2"> 申请时间：</p>
              <p class="flex-1 truncate text-left">
                {{
                  detailsData.createTime
                    ? moment(detailsData.createTime).format('YYYY-MM-DD')
                    : '--'
                }}
              </p>
            </div>
          </ElCol>

          <ElCol :span="8">
            <div class="flex">
              <p class="name-p mr-2"> 预计合同金额：</p>
              <p class="flex-1 truncate text-left">
                {{
                  (detailsData.predictContractMoney
                    ? detailsData.predictContractMoney + '万元'
                    : '--') || '--'
                }}
              </p>
            </div>
          </ElCol>
          <ElCol :span="8">
            <div class="flex">
              <p class="name-p mr-2"> 负责人：</p>
              <p class="flex-1 truncate text-left">
                {{ detailsData.principalPersonName ? detailsData.principalPersonName : '--' }}
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
                      ? 'primary'
                      : detailsData.status === '1'
                      ? 'primary'
                      : detailsData.status === '2'
                      ? 'success'
                      : detailsData.status === '3'
                      ? 'danger'
                      : detailsData.status === '4' || detailsData.status === '8'
                      ? 'success'
                      : detailsData.status === '5'
                      ? 'info'
                      : detailsData.status === '6'
                      ? 'primary'
                      : detailsData.status === '7' || detailsData.status === '10'
                      ? 'warning'
                      : detailsData.status === '9'
                      ? 'warning'
                      : 'danger'
                  "
                  :effect="detailsData.status === '9' ? 'dark' : ''"
                >
                  {{ getProjectStatusLabel('2', detailsData.status) }}
                </el-tag>
              </div>
            </div>
          </ElCol>
          <ElCol :span="8">
            <div class="flex">
              <p class="name-p mr-2"> 预计采购方式：</p>
              <p class="flex-1 truncate text-left">
                {{ purchaseText(detailsData.purchaseMethod) || '--' }}
              </p>
            </div>
          </ElCol>
          <ElCol :span="8">
            <div class="flex">
              <p class="name-p mr-2"> 项目目前阶段：</p>
              <p class="flex-1 truncate text-left">
                {{ projectPhasesText(detailsData.projectPhasesCondition) || '--' }}
              </p>
            </div>
          </ElCol>
          <ElCol :span="8">
            <div class="flex">
              <p class="name-p mr-2"> 项目内容：</p>
              <p class="p-ellipsis flex-1 truncate text-left" :title="detailsData.projectContent">
                {{ detailsData.projectContent || '--' }}
              </p>
            </div>
          </ElCol>
          <ElCol :span="8">
            <div class="flex">
              <p class="name-p mr-2"> 预计签约几率：</p>
              <p class="flex-1 truncate text-left">
                {{ predictSigneText(detailsData.predictSignedOdds) || '--' }}
              </p>
            </div>
          </ElCol>
          <ElCol :span="8">
            <div class="flex">
              <P class="name-p mr-2"> 客户名称：</P>
              <p
                :title="
                  detailsData.customerName ? detailsData.customerName : detailsData.lastUserName
                "
                class="flex-1 truncate text-left p-ellipsis"
              >
                {{
                  detailsData.customerName
                    ? detailsData.customerName
                    : detailsData.lastUserName || '--'
                }}
              </p>
            </div>
          </ElCol>
          <ElCol :span="8"></ElCol>
          <ElCol :span="24">
            <div class="flex">
              <P class="name-p mr-2"> 项目立项表：</P>
              <div class="flex items-center">
                <p class="cursor-pointer text-blue-500" @click="implementFormClick()">{{
                  implementFormFlag ? '点击关闭项目立项表' : '点击打开项目立项表'
                }}</p>
                <el-button
                  v-hasPermi="'project:implement:export'"
                  type="primary"
                  class="ml-2 segmentation"
                  @click="exprot"
                  >导出项目立项表</el-button
                >
              </div>
            </div>
            <ImplementForm v-if="implementFormFlag" :detailsData="detailsData" />
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
