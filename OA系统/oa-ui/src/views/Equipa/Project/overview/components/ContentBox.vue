<template>
  <ContentWrap
    :isShowtitle="false"
    :class="shadow ? 'chart_query_noshadow' : 'satistics_menu-contentWrap'"
  >
    <div>
      <div
        class="2xl:h-[51px] 2xl:leading-[51px] h-[40px] leading-[38px] border-b-1 border-[#EEF0F2]"
      >
        <slot name="search"></slot>
        <slot name="header"></slot>
      </div>
      <div>
        <slot name="content"></slot>
      </div>
    </div>
  </ContentWrap>
</template>

<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
defineProps({
  shadow: {
    type: Boolean,
    default: false
  }
})
</script>

<style>
.satistics_menu-contentWrap {
  margin-bottom: 10px !important;
}
.satistics_menu-contentWrap .el-card__body {
  padding: 0 !important;
}
</style>

<style lang="less">
.chart_query_noshadow {
  margin: 0 !important;
  box-shadow: none !important;
  border: 0 !important;
  .el-card__body {
    padding: 0 !important;
  }
}
</style>
