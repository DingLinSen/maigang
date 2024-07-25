<template>
  <img class="image" :src="getImageUrl(img)" />
</template>
<script setup lang="ts">
import getAssetsFile from '@/utils/pubUse'

defineProps({
  img: {
    type: String,
    required: true
  }
})

const getImageUrl = (name) => {
  return new URL(getAssetsFile(name), import.meta.url).href
}
</script>
<style lang="less" scoped>
.image {
  width: 100%;
  height: 100%;
}
</style>
