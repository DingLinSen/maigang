<script setup lang="ts">
import { useRouter } from 'vue-router'
const { push } = useRouter()
const reutnHome = () => {
  push({ path: '/change' })
}
</script>

<template>
  <div class="retun-home">
    <span @click="reutnHome">返回系统跳转页面</span>
  </div>
</template>
<style lang="less" scoped>
.retun-home {
  cursor: pointer;
  font-size: 16px;
}
.retun-home:hover {
  text-decoration: underline;
  color: #00a0e9;
}
</style>
