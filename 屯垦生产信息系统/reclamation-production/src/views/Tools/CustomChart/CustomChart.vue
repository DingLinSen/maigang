<script setup lang="ts">
import { onMounted } from 'vue'

const url = import.meta.env.VITE_CUSTOM_CHART_URL
onMounted(() => {})
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
