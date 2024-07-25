<script setup lang="ts">
import { propTypes } from '@/utils/propTypes'
defineProps({
  title: propTypes.string.def(''),
  isShowtitle: propTypes.bool.def(true)
})
</script>

<template>
  <section class="pb-[2vh] bg-white mb-[10px]">
    <div
      class="flex justify-between content-center h-[5vh] border-dashed border-b-1"
      v-if="isShowtitle"
    >
      <p class="text-15px font-500 pt-1 segmentation-title ml-4">{{ title }}</p>
      <div class="button-right-class">
        <slot name="button"></slot>
      </div>
    </div>
    <div class="pt-4 mx-4">
      <slot name="content"></slot>
    </div>
  </section>
</template>
<style lang="less" scoped>
.segmentation-title {
  font-family: Alibaba PuHuiTi B;
  color: #333333;
  height: 5vh;
  line-height: 5vh;
}
.button-right-class {
  line-height: 4.5vh;
  font-size: 16px;
  margin-right: 1rem;
  font-weight: 700;
}
</style>
