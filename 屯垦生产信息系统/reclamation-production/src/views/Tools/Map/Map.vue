<script setup lang="ts">
import { onMounted } from 'vue'

const url = '/static/map-dynamic/Map.html'
onMounted(() => {
  
})
</script>

<template>
  <iframe :src="url" class="iframe"></iframe>
</template>

<style lang="less">
.iframe {
  width: 100%;
  height: calc(100vh - 120px);
}
</style>
