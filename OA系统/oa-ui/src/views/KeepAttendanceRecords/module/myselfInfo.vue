<template>
  <ContentWrap :isShowtitle="false" class="nomargin-contentWrap">
    <div v-if="minWidth" class="bg-[#fff] h-177px pt-20px">
      <div class="info flex items-center mb-17px">
        <div class="w-60px h-60px rounded-full overflow-hidden ml-[1.04vw]">
          <img src="@/assets/imgs/avatar.jpg" />
        </div>
        <div class="ml-[0.89vw] w-[10.22vw] pr-[0.2vw] kq-user">
          <p class="text-xl truncate kq-user-name" :title="infoUserName ? infoUserName : '--'">{{
            infoUserName ? infoUserName : '--'
          }}</p>
          <p class="text-[#888888] truncate" :title="infoDept ? infoDept : '--'">{{
            infoDept ? infoDept : '--'
          }}</p>
        </div>
      </div>
      <div class="pl-[0.73vw]">
        <div class="flex mb-8px">
          <p
            class="2xl:py-2px 2xl:px-4px py-1px px-1px text-[#fff] rounded text-sm mr-[0.36vw] text-base-title"
            >调休</p
          >
          <p class="text-base text-base-info text-[#333333]"
            >剩余
            <span class="math-date">{{
              detailsData.surplusLeave ? detailsData.surplusLeave : '0'
            }}</span>
            小时 换算为
            <span class="math-date">
              {{
                detailsData.surplusLeave
                  ? Math.round((Number(detailsData.surplusLeave) / 7) * 100) / 100
                  : 0
              }}
            </span>
            天</p
          >
        </div>
        <div class="flex">
          <p
            class="2xl:py-2px 2xl:px-4px py-1px px-1px text-[#fff] rounded text-sm mr-[0.36vw] text-base-title"
            >年假</p
          >
          <p class="text-base text-base-info text-[#333333]"
            >剩余
            <span class="math-date">{{
              detailsData.surplusYearLeave ? detailsData.surplusYearLeave : '0'
            }}</span>
            小时 换算为
            <span class="math-date">
              {{
                detailsData.surplusYearLeave
                  ? Math.round((Number(detailsData.surplusYearLeave) / 7) * 100) / 100
                  : 0
              }}
            </span>
            天</p
          >
        </div>
      </div>
    </div>
    <div v-else class="bg-[#fff]">
      <div class="hidden md:hidden 2xl:flex items-center h-110px">
        <div class="info flex justify-between items-center">
          <div class="w-60px h-60px rounded-full overflow-hidden ml-[1.04vw]">
            <img src="@/assets/imgs/avatar.jpg" />
          </div>
          <div class="ml-[0.89vw] w-[6.22vw] border-r-1 pr-[0.2vw]">
            <p class="text-xl truncate" :title="infoUserName ? infoUserName : '--'">{{
              infoUserName ? infoUserName : ''
            }}</p>
            <p class="truncate" :title="infoDept ? infoDept : '--'">{{
              infoDept ? infoDept : '--'
            }}</p>
          </div>
        </div>
        <div class="compensatory_leave flex justify-between items-center">
          <div
            class="w-38px h-38px rounded-full overflow-hidden ml-[0.625vw] text-[#fff] bg-[#008EE4] leading-[38px] text-center"
          >
            调休
          </div>
          <div class="ml-[0.31vw] w-[6.99vw] text-sm">
            <p
              class="truncate"
              :title="'剩余' + (detailsData.surplusLeave ? detailsData.surplusLeave : '0') + '小时'"
              >剩余
              <span class="math-date">{{
                detailsData.surplusLeave ? detailsData.surplusLeave : '0'
              }}</span>
              小时</p
            >
            <p
              class="truncate"
              :title="
                '换算为' +
                (detailsData.surplusLeave
                  ? Math.round((Number(detailsData.surplusLeave) / 7) * 100) / 100
                  : '0') +
                '天'
              "
              >换算为
              <span class="math-date">{{
                detailsData.surplusLeave
                  ? Math.round((Number(detailsData.surplusLeave) / 7) * 100) / 100
                  : '0'
              }}</span
              >天</p
            >
          </div>
        </div>
        <div class="annual_leave flex justify-between items-center">
          <div
            class="w-38px h-38px rounded-full overflow-hidden ml-[0.625vw] text-[#fff] bg-[#008EE4] leading-[38px] text-center"
          >
            年假
          </div>
          <div class="ml-[0.31vw] w-[6.62vw] text-sm">
            <p
              class="truncate"
              :title="
                '剩余' +
                (detailsData.surplusYearLeave ? detailsData.surplusYearLeave : '0') +
                '小时'
              "
              >剩余
              <span class="math-date">
                {{ detailsData.surplusYearLeave ? detailsData.surplusYearLeave : '0' }} </span
              >小时</p
            >
            <p
              class="truncate"
              :title="
                '换算为' +
                (detailsData.surplusYearLeave
                  ? Math.round((Number(detailsData.surplusYearLeave) / 7) * 100) / 100
                  : '0') +
                '天'
              "
              >换算为
              <span class="math-date">
                {{
                  detailsData.surplusYearLeave
                    ? Math.round((Number(detailsData.surplusYearLeave) / 7) * 100) / 100
                    : '0'
                }}</span
              >
              天</p
            >
          </div>
        </div>
      </div>
      <!-- 小屏幕 -->
      <div class="flex md:flex 2xl:hidden items-center h-110px">
        <div class="info flex justify-between items-center">
          <div class="w-52px h-52px rounded-full overflow-hidden ml-[1.31vw]">
            <img src="@/assets/imgs/avatar.jpg" />
          </div>
          <div class="ml-[0.89vw] max-w-[6.62vw] border-r-1 pr-[1vw]">
            <p class="text-xl truncate" :title="infoUserName ? infoUserName : '--'">{{
              infoUserName ? infoUserName : ''
            }}</p>
            <p class="truncate text-sm" :title="infoDept ? infoDept : '--'">{{
              infoDept ? infoDept : '--'
            }}</p>
          </div>
          <div class="pl-[1.04vw]">
            <div class="flex mb-8px">
              <p class="py-1px px-1px text-[#fff] rounded text-sm mr-[0.36vw] text-base-title"
                >调休</p
              >
              <p class="text-base text-base-info text-[#333333] text-sm"
                >剩余
                <span class="math-date">{{
                  detailsData.surplusLeave ? detailsData.surplusLeave : '0'
                }}</span>
                小时 换算为
                <span class="math-date">
                  {{
                    detailsData.surplusLeave
                      ? Math.round((Number(detailsData.surplusLeave) / 7) * 100) / 100
                      : 0
                  }}
                </span>
                天</p
              >
            </div>
            <div class="flex">
              <p class="py-1px px-1px text-[#fff] rounded text-sm mr-[0.36vw] text-base-title"
                >年假</p
              >
              <p class="text-base text-base-info text-[#333333] text-sm"
                >剩余
                <span class="math-date">{{
                  detailsData.surplusYearLeave ? detailsData.surplusYearLeave : '0'
                }}</span>
                小时 换算为
                <span class="math-date">
                  {{
                    detailsData.surplusYearLeave
                      ? Math.round((Number(detailsData.surplusYearLeave) / 7) * 100) / 100
                      : 0
                  }}
                </span>
                天</p
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </ContentWrap>
</template>

<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { ref, inject, watch } from 'vue'

const props = defineProps({
  detailsData: {
    type: Object,
    default: ref({
      deptName: '',
      surplusLeave: '',
      surplusYearLeave: ''
    })
  },
  infoUserName: {
    type: String,
    default: ''
  },
  infoDept: {
    type: String,
    default: ''
  },
  minWidth: {
    type: Boolean,
    default: false
  }
})
</script>
<style lang="less" scoped>
.kq-user {
  .kq-user-name {
    font-family: Alibaba PuHuiTi;
    font-size: 1.1rem;
    font-weight: 500;
  }
}
.text-base-title {
  // font-size: 0.9rem;
  font-size: 12px;
  font-family: Alibaba PuHuiTi M;
  font-weight: 500;
  color: #ffffff;
  background: linear-gradient(0deg, #008ee4 0%, #009fff 100%);
}
.text-base-info {
  line-height: 1.4rem;
  font-size: 0.965rem;
  font-weight: 400;
  font-family: Alibaba PuHuiTi R;
}
.math-date {
  color: #00a0e9;
  font-family: Alibaba PuHuiTi M;
  font-size: 1.15rem;
}
</style>
