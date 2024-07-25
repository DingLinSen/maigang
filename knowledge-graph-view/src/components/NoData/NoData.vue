<template>
  <div
    class="no-data"
    :class="heigth ? 'h-[' + Math.round(heigth) + 'px]' : 'h-full'"
    :style="heigth ? 'height:' + Math.round(heigth) + 'px' : 'height:100%'"
  >
    <div style="text-align: center">
      <img v-if="src" :src="src" />
      <img v-else src="@/assets/imgs/no_data.png" />
      <p>暂无数据</p>
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  heigth?: number
  src?: string
}>()
</script>

<style lang="less" scoped>
.no-data {
  // height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: 149px;
    height: 111px;
    margin-bottom: 18px;
  }
  p {
    font-family: Microsoft YaHei;
    font-weight: 400;
    font-size: 16px;
    color: #999999;
    line-height: 28px;
  }
}
</style>
