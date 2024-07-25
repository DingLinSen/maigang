<template>
  <ContentWrap :isShowtitle="false" class="satistics_menu-contentWrap">
    <section class="satistics_menu_main_sub 2xl:h-[110px] h-77px flex items-center px-20px">
      <div
        class="satistics_menu_content 2xl:h-77px h-54px border-1"
        :class="index === 0 ? 'w-[25%]' : 'w-[20%]'"
        v-for="(item, index) in satisticsData"
        :key="index"
        @click="handle(item)"
      >
        <div v-if="index !== 0" class="flex items-center h-full px-[1.35vw]">
          <div class="mr-[0.73vw]">
            <img class="2xl:w-[44px] 2xl:h-[44px] w-[32px] h-[32px]" :src="getImgUrl(item)" />
          </div>
          <div class="flex flex-col justify-center leading-16px">
            <p class="text-[#272727] 2xl:text-14px mb-4px">{{ item.label }}</p>
            <p
              ><span class="text-[#1F2D3D] text-xl font-bold">{{ item.value }}</span
              ><span class="text-12px ml-[0.38vw]">个</span></p
            >
          </div>
        </div>
        <div v-else class="flex items-center h-full justify-between bg-[#E1F1FF] px-[1.35vw]">
          <div class="flex items-center">
            <div class="mr-[0.73vw]">
              <img
                class="2xl:w-[34px] 2xl:h-[34px] w-[28px] h-[28px]"
                src="@/assets/imgs/project/all_project_icon.png"
              />
            </div>
            <div class="flex flex-col justify-center leading-16px">
              <p class="text-[#272727] 2xl:text-14px mt-1 mb-4px">总项目</p>
              <p><span class="text-12px text-[#555555]">数量统计</span></p>
            </div>
          </div>
          <div>
            <span class="text-[#1F2D3D] 2xl:text-26px text-20px font-bold">{{ item.value }}</span>
            <span class="text-sm ml-[0.38vw]">个</span>
          </div>
        </div>
      </div>
    </section>
  </ContentWrap>
</template>

<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { countApi } from '@/api/project/overview'

import { inject, ref } from 'vue'
import { useRouter } from 'vue-router'

const { push } = useRouter()

const getImgUrl = (info) => {
  if (info.phase == 1) {
    return new URL(`@/assets/imgs/project/project_icon_p.png`, import.meta.url).href
  } else if (info.phase == 2) {
    return new URL(`@/assets/imgs/project/project_icon_l.png`, import.meta.url).href
  } else if (info.phase == 3) {
    return new URL(`@/assets/imgs/project/project_icon_s.png`, import.meta.url).href
  } else if (info.phase == 4) {
    return new URL(`@/assets/imgs/project/project_icon_h.png`, import.meta.url).href
  } else if (info.phase == 5) {
    return new URL(`@/assets/imgs/project/project_icon_k.png`, import.meta.url).href
  } else {
    return new URL(`@/assets/imgs/project/project_icon_w.png`, import.meta.url).href
  }
}
defineProps({
  cultivateCount: {
    type: Object,
    default: null
  },
  isActive: {
    type: String,
    default: ''
  }
})

const satisticsData = ref<any>([])
satisticsData.value = [
  {
    label: '总项目',
    value: '--',
    phase: '',
    img: 'all_project_icon.png'
  },
  {
    label: '培育项目',
    value: '--',
    phase: 1
  },
  {
    label: '立项项目',
    value: '--',
    phase: 2
  },
  {
    label: '实施项目',
    value: '--',
    phase: 3
  },
  {
    label: '售后项目',
    value: '--',
    phase: 4
  },
  {
    label: '自研项目',
    value: '--',
    phase: 5
  },
  {
    label: '完成项目',
    value: '--',
    phase: ''
  }
]
// satisticsData.value.fill()

const init = async () => {
  let res = await countApi()
  if (res && res.data) {
    satisticsData.value = [
      {
        label: '总项目',
        value: res.data.zxm,
        phase: ''
      },
      {
        label: '培育项目',
        value: res.data.hatch,
        phase: 1
      },
      {
        label: '立项项目',
        value: res.data.approval,
        phase: 2
      },
      {
        label: '实施项目',
        value: res.data.implement,
        phase: 3
      },
      {
        label: '售后项目',
        value: res.data.afterSales,
        phase: 4
      },
      {
        label: '自研项目',
        value: res.data.scientific,
        phase: 5
      },
      {
        label: '完成项目',
        value: res.data.end,
        phase: ''
      }
    ]
    // satisticsData.value = res.data
  }
}

const handle = async (info) => {
  if (info.phase == 1) {
    push({ name: 'Cultivate' })
  } else if (info.phase == 2) {
    push({ name: 'Implement' })
  } else if (info.phase == 3) {
    push({ name: 'Ssxm' })
  } else if (info.phase == 4) {
    push({ name: 'AfterSales' })
  } else if (info.phase == 5) {
    push({ name: 'Scientific' })
  }
}

init()

const changeitemCount = inject('changeitemCount')
</script>

<style lang="less" scoped>
.satistics_menu_content {
  overflow: hidden;
  border-radius: 4px;
  font-family: Alibaba PuHuiTi M;
  margin-left: 0.52vw;
  cursor: pointer;
  &:first-child {
    margin-left: 0;
    cursor: default;
  }
  &:last-child {
    cursor: default;
  }
}
</style>

<style>
.satistics_menu-contentWrap {
  margin-bottom: 10px !important;
}
.satistics_menu-contentWrap .el-card__body {
  padding: 0 !important;
}
</style>
