<script setup lang="ts">
import { ref, onMounted } from 'vue'

onMounted(() => {})
const vfdRef = ref(null)
</script>

<template>
  <ContentWrap>
    <div class="form-create">
      <v-form-designer ref="vfdRef"></v-form-designer>
    </div>
  </ContentWrap>
</template>
<style lang="less">
body {
  margin: 0; /* 如果页面出现垂直滚动条，则加入此行CSS以消除之 */
}
.form-create {
  height: calc(100vh - 120px);
}
.el-container {
  height: 100%;
  .el-scrollbar.container-scroll-bar{
    height: 100% !important;
  }
  .main-header {
    display: none;
  }
  .color-svg-icon {
    display: inline-block;
  }
  .el-container.center-layout-container {
    min-width: auto;
  }
}
</style>