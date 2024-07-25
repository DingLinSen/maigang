<script setup lang="ts">
import { ref, onMounted } from 'vue'
const url = import.meta.env.VITE_CUSTOM_CHART_URL
onMounted(() => {})
const isImg = ref(true)
</script>

<template>
  <template v-if="isImg">
    <div class="img-content">
      <div class="img-con">
        <img src="@/assets/imgs/situation/业务监管态势.jpg" alt="">
      </div>
      <ElButton type="primary" class="pz-btn" @click="isImg = false"> 自定义配置 </ElButton>
    </div>
  </template>
  <template v-else>
    <div class="frame-con">
      <ElButton type="primary" class="pz-btn" @click="isImg = true"> 返回 </ElButton>
      <iframe :src="url" class="iframe"></iframe>
    </div>
  </template>
</template>

<style lang="less" scoped>
.iframe {
  width: 100%;
  height: calc(100vh - 120px);
}
.frame-con{
  position: relative;
  .pz-btn {
    position: absolute;
    right: 10px;
    top: 10px;
  }
}
.img-content {
  // background-image: url('@/assets/imgs/situation/业务监管态势.jpg');
  // background-position: center;
  // background-repeat: no-repeat;
  // background-size: 100% 100%;
  width: 100%;
  height: calc(100vh - 120px);
  position: relative;
  overflow: hidden;
  .img-con{
    height: 100%;
    overflow-y: scroll;
  }
  img{
    width: 100%;
  }
  .pz-btn {
    position: absolute;
    right: 10px;
    top: 10px;
  }
}
</style>
