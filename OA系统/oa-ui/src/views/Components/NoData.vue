<template>
  <div class="no-data">
    <div style="text-align: center">
      <img src="@/assets/imgs/project/nodata_icon.png" alt="" />
      <p class="no-data-text-class">暂无数据</p>
    </div>
  </div>
</template>
<script setup lang="ts"></script>

<style lang="less" scoped>
.no-data {
  height: 100%;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.no-data-text-class {
  font-size: 15px;
  color: #888888;
  line-height: 30px;
}
</style>
