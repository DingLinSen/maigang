<template>
  <mars-dialog :visible="true" right="10" top="10">
    <a-space>
      <mars-button @click="createMap">创建地图</mars-button>
      <mars-button @click="destroyMap">销毁地图</mars-button>
    </a-space>
  </mars-dialog>
</template>

<script lang="ts" setup>
import { useWidget } from "@mars/widgets/common/store/widget"
import * as mapWork from "./map.js"
const { activate, disableAll } = useWidget()

const emits = defineEmits(["updateMap"])

// 创建地图
const createMap = () => {
  window._mapInstance = mapWork.createMap()
  emits("updateMap") // 更新  \App.vue

  activate("tools-button")
}
// 销毁地图
const destroyMap = () => {
  disableAll()
  mapWork.destroyMap()
}
</script>
