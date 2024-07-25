<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
const url = import.meta.env.VITE_BPMN_URL
onMounted(() => {
  // window.open('https://miyuesc.github.io/process-designer-v2/')
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
:deep(iframe) {
  .grip-tips {
    display: none;
  }
}
</style>