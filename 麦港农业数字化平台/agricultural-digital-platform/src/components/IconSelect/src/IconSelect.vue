<script setup lang="ts">
import { ElInput } from 'element-plus'
import { ref } from 'vue'
import icons from './RequireIcons'
import { useEmitt } from '@/hooks/web/useEmitt'

const iconName = ref('')
const iconList = ref(icons)

const { emitter } = useEmitt()

const filterIcons = () => {
  iconList.value = icons
  if (iconName.value) {
    iconList.value = icons.filter((item) => item.indexOf(iconName.value) !== -1)
  }
}

const selectedIcon = (name: string) => {
  emitter.emit('selected', name)
  document.body.click()
}

const reset = () => {
  iconName.value = ''
  iconList.value = icons
}

defineExpose({
  reset
})
</script>

<template>
  <div class="icon-body">
    <ElInput
      v-model="iconName"
      style="position: relative"
      placeholder="请输入图标名称"
      @clear="filterIcons"
      @input="filterIcons"
    >
      <template #suffix><Icon icon="ep:search" style="height: 32px; width: 16px" /></template>
    </ElInput>
    <div class="icon-list">
      <div v-for="(item, index) in iconList" :key="index" @click="selectedIcon(item)">
        <Icon :icon="'svg-icon:' + item" style="height: 30px; width: 16px" class="mr-5px"/>
        <span>{{ item }}</span>
      </div>
    </div>
  </div>
</template>

<style lang='less' scoped>
.icon-body {
  width: 100%;
  padding: 10px;
  .icon-list {
    height: 300px;
    overflow-y: auto;
    margin-top: 10px;
    div {
      height: 35px;
      line-height: 35px;
      cursor: pointer;
      width: 33%;
      float: left;
    }
    span {
      display: inline-block;
      vertical-align: -10px;
      fill: currentColor;
      overflow: hidden;
    }
  }
}
</style>  