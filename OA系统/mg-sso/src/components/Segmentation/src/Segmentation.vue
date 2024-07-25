<script setup lang="ts">
import { propTypes } from '@/utils/propTypes'
defineProps({
  title: propTypes.string.def('')
})
</script>

<template>
  <section class="py-4 px-4 bg-white mb-4">
    <div class="flex justify-between content-center h-10 border-dashed border-b-1">
      <p class="text-15px font-500 pt-1 segmentation-title">{{ title }}</p>
      <div class="text-16px font-700 pb-2">
        <slot name="button"></slot>
      </div>
    </div>
    <div class="pt-4">
      <slot name="content"></slot>
    </div>
  </section>
</template>
<style lang="less" scoped>
.segmentation-title {
  font-family: Alibaba PuHuiTi M;
}
</style>
