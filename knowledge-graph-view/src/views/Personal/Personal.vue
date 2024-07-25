<template>
  <div class="personal">
    <NavLeft @is-show-upload="isShowUpload" />
    <section>
      <ToolHeader />
      <router-view />
    </section>
  </div>
  <Upload v-if="uploadFlag" @is-show-upload="isShowUpload" />
</template>
<script setup lang="ts">
import NavLeft from './components/NavLeft.vue'
import ToolHeader from '@/layout/components/ToolHeader.vue'
import Upload from '@/views/Personal/components/Upload.vue'
import { ref } from 'vue'

const uploadFlag = ref(false)
const isShowUpload = (val) => {
  uploadFlag.value = val
}
</script>
<style scoped lang="less">
:deep(.layout-select) {
  margin-left: 22px;
}
:deep(.search_icon) {
  padding-top: 23px;
  position: absolute;
  left: 36px;
  top: 50%;
  z-index: 1;
  transform: translateY(-50%);
}
.personal {
  display: flex;
}
section {
  width: calc(100% - var(--left-personal-menu-width));
}
:deep(.el-table) {
  // th,
  // td {
  tr th {
    font-family: Microsoft YaHei;
    font-weight: 400;
    font-size: 14px;
    color: #444444;
    background: #fff !important;
    border-bottom: 1px solid #f1f2f4 !important;
  }
  td {
    svg {
      fill: #999999;
    }
    svg:hover {
      fill: #0db3ff;
    }
    svg:active {
      fill: #0092d4;
    }
    .wenIcon {
      svg {
        fill: rgb(0, 160, 233);
      }
    }
  }
  // }
}
:deep(.heli) {
  background: #00a0e9 !important;
  color: #fff !important;
  .el-checkbox__inner::after {
    border: 2px solid #00a0e9;
    border-left: 0;
    border-top: 0;
  }
  .el-checkbox__inner {
    background: #fff !important;
  }
  svg {
    fill: #ffffff !important;
  }
  .text-active:hover {
    color: #fff;
  }
}
:deep(.top_search .el-input) {
  margin-top: 23px;
}
</style>
