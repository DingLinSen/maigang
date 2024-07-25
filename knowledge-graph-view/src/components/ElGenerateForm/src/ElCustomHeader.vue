<template>
  <ElHeader class="btn-bar">
    <slot></slot>
    <ElButton v-if="$attrs.uploadJson" type="text" @click="$emit('uploadJson')">
      <template #icon>
        <Icon icon="ep:bottom" />
        <!-- <SvgIcon iconClass="upload" /> -->
      </template>
      导入JSON
    </ElButton>
    <ElButton v-if="$attrs.clearable" type="text" @click="$emit('clearable')">
      <template #icon>
        <Icon icon="ep:circle-close" />
        <!-- <SvgIcon iconClass="clearable" /> -->
      </template>
      清空
    </ElButton>
    <ElButton v-if="$attrs.preview" type="text" @click="$emit('preview')">
      <template #icon>
        <Icon icon="ep:view" />
        <!-- <SvgIcon iconClass="preview" /> -->
      </template>
      预览
    </ElButton>
    <ElButton v-if="$attrs.generateJson" type="text" @click="$emit('generateJson')">
      <template #icon>
        <Icon icon="ant-design:file-unknown-outlined" />
        <!-- <SvgIcon iconClass="generate-json" /> -->
      </template>
      生成JSON
    </ElButton>
    <ElButton v-if="$attrs.generateCode" type="text" @click="$emit('generateCode')">
      <template #icon>
        <Icon icon="ant-design:file-text-outlined" />
        <!-- <SvgIcon iconClass="generate-code" /> -->
      </template>
      生成代码
    </ElButton>
  </ElHeader>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import {
  ElMessage,
  ElContainer,
  ElMain,
  ElAside,
  ElHeader,
  ElDialog,
  ElButton,
  ElTabs,
  ElTabPane,
  ElAlert
} from 'element-plus'
// import SvgIcon from '@/components/SvgIcon.vue'

export default defineComponent({
  name: 'CustomHeader',
  components: {
    // SvgIcon,
    ElHeader,
    ElButton
  },
  emits: ['uploadJson', 'clearable', 'preview', 'generateJson', 'generateCode'],
  setup(props) {
    return {}
  }
})
</script>
