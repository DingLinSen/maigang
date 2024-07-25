<script setup lang="ts">
import { inject } from 'vue'
import { Segmentation } from '@/components/Segmentation'
import moment from 'moment'
import { EllipsisText } from '@/components/EllipsisText'
//详情数据
const detailsData = inject<any>('detailsData')
defineOptions({
  name: 'ProjectInfo'
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
              <p class="p-ellipsis-ky flex-1 truncate text-left" :title="detailsData.projectTitle">
                {{ detailsData.projectTitle || '--' }}
              </p>
            </div>
          </ElCol>
          <ElCol :span="8">
            <div class="flex">
              <p class="name-p mr-2"> 项目类型：</p>
              <p class="sub-title flex-1 truncate text-left">
                {{
                  detailsData.type === '1'
                    ? '新产品研发项目'
                    : detailsData.type === '2'
                    ? '技术攻关项目'
                    : detailsData.type === '3'
                    ? '技改项目'
                    : '--'
                }}
              </p>
            </div>
          </ElCol>
          <ElCol :span="8">
            <div class="flex">
              <p class="name-p mr-2"> 申请时间：</p>
              <p class="sub-title flex-1 truncate text-left" :title="detailsData.createTime">
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
                    detailsData.status === '1'
                      ? 'primary'
                      : detailsData.status === '2'
                      ? 'success'
                      : detailsData.status === '3'
                      ? 'warning'
                      : detailsData.status === '4'
                      ? 'warning'
                      : detailsData.status === '5'
                      ? 'danger'
                      : detailsData.status === '6'
                      ? 'success'
                      : detailsData.status === '7'
                      ? 'info'
                      : detailsData.status === '8'
                      ? 'danger'
                      : 'danger'
                  "
                  :effect="
                    detailsData.status === '4' ||
                    detailsData.status === '8' ||
                    detailsData.status === '6'
                      ? 'dark'
                      : ''
                  "
                >
                  {{
                    detailsData.status === '1'
                      ? '自研审批中'
                      : detailsData.status === '2'
                      ? '进展中'
                      : detailsData.status === '3'
                      ? '状态变更审批中'
                      : detailsData.status === '4'
                      ? '负责人变更审批中'
                      : detailsData.status === '5'
                      ? '结题审批中'
                      : detailsData.status === '6'
                      ? '已结题'
                      : detailsData.status === '7'
                      ? '已终止'
                      : detailsData.status === '8'
                      ? '已暂停'
                      : '--'
                  }}
                </el-tag>
              </div>
            </div>
          </ElCol>
          <ElCol :span="24">
            <div class="flex">
              <p class="name-p mr-2"> 立项目的：</p>
              <EllipsisText :value="detailsData.approvalReason" class="ellipsis-ky" />
              <!-- <p
                class="p-ellipsis-ky flex-1 truncate text-left"
                :title="detailsData.approvalReason"
              >
                {{ detailsData.approvalReason || '--' }}
              </p> -->
            </div>
          </ElCol>
          <ElCol :span="24">
            <div class="flex">
              <p class="name-p mr-2"> 项目方案：</p>
              <EllipsisText :value="detailsData.projectPlan" class="ellipsis-ky" />
              <!-- <p class="p-ellipsis-ky flex-1 truncate text-left" :title="detailsData.projectPlan">
                {{ detailsData.projectPlan || '--' }}
              </p> -->
            </div>
          </ElCol>
          <ElCol :span="8">
            <div class="flex">
              <p class="name-p mr-2"> 预期经济效益：</p>
              <p
                class="p-ellipsis-ky flex-1 truncate text-left"
                :title="detailsData.economicBenefits"
              >
                {{ detailsData.economicBenefits || '--' }}
              </p>
            </div>
          </ElCol>

          <ElCol :span="8">
            <div class="flex">
              <p class="name-p mr-2"> 创新点：</p>
              <p class="p-ellipsis-ky flex-1 truncate text-left" :title="detailsData.innovatePoint">
                {{ detailsData.innovatePoint || '--' }}
              </p>
            </div>
          </ElCol>
          <ElCol :span="8">
            <div class="flex">
              <p class="name-p mr-2"> 项目主要参与人：</p>
              <p class="p-ellipsis-ky flex-1 truncate text-left" :title="detailsData.participants">
                {{ detailsData.participants || '--' }}
              </p>
            </div>
          </ElCol>

          <ElCol :span="8">
            <div class="flex">
              <p class="name-p mr-2"> 项目起止时间及阶段划分：</p>
              <p
                class="p-ellipsis-ky-sub flex-1 truncate text-left"
                :title="detailsData.timeAndPhase"
              >
                {{ detailsData.timeAndPhase || '--' }}
              </p>
            </div>
          </ElCol>
          <ElCol :span="8">
            <div class="flex">
              <p class="name-p mr-2"> 研究成果及形式：</p>
              <p class="p-ellipsis-ky flex-1 truncate text-left" :title="detailsData.achievement">
                {{ detailsData.achievement || '--' }}
              </p>
            </div>
          </ElCol>
          <ElCol :span="8"></ElCol>
        </ElRow>
      </div>
    </template>
  </Segmentation>
</template>

<style lang="less" scoped>
.ellipsis-ky {
  flex: 1;
  padding-top: 5.5px;
  padding-bottom: 5px;
}
</style>
<style lang="less">
.name-p {
  font-family: 'Alibaba PuHuiTi R';
  color: #888888;
  font-size: 15px;
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

.p-ellipsis-ky {
  width: 64%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
}
.p-ellipsis-ky-sub {
  width: 62%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
}
</style>
