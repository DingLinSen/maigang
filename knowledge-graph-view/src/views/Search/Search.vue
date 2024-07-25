<template>
  <div class="page-wrap">
    <div
      style="z-index: 99"
      class="page-header flex z-10 relative items-center bg-[var(--top-header-bg-color)] border-solid border-[var(--top-tool-border-color)] dark:border-[var(--el-border-color)]"
    >
      <Logo
        class="hover-trigger !pr-15px w-[var(--left-menu-max-smal-screen-width)] 2xl:w-[var(--left-menu-max-width)]"
        style="z-index: 22"
      ></Logo>

      <ToolHeader class="flex-1"></ToolHeader>
    </div>
    <section>
      <router-view />
    </section>
  </div>
</template>
<script setup lang="ts">
import ToolHeader from '@/layout/components/ToolHeader.vue'
import { Logo } from '@/components/Logo'
</script>

<style lang="less" scoped>
.page-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

section {
  width: 100%;
  flex: 1;
}
:deep(.top_search .el-input) {
  display: none;
}
:deep(.top_search) {
  visibility: hidden;
}
</style>
