<script setup lang="ts">
import { Icon } from '@/components/Icon'
import { propTypes } from '@/utils/propTypes'
import { useDesign } from '@/hooks/web/useDesign'
import { useEmitt } from '@/hooks/web/useEmitt'
import { useCache } from '@/hooks/web/useCache'
import { onMounted, ref, watch } from 'vue'
import { getNewVersionDetailApi } from '@/api/version' //获取当前最新发布版本

const { emitter } = useEmitt()
const { wsCache } = useCache()

//当前版本信息详情
const versionDetails = async () => {
  isRead.value = false
  emitter.emit('version', 'open')
}

//版本信息
const versionInfo = ref<any>(null)
// versionInfo.value = wsCache.get('version')

//是否已读
const isRead = ref<boolean>(true)

const getCurrentVersionInfo = async () => {
  await getNewVersionDetailApi().then((res) => {
    if (res) {
      wsCache.set('version', res.data)
      if (res.data) {
        versionInfo.value = res.data
      } else {
        versionInfo.value = null
      }

      if (versionInfo.value) {
        isRead.value = versionInfo.value.readFlag == '1' ? false : true
      }
    }
  })
}

onMounted(() => {
  getCurrentVersionInfo()
  if (versionInfo.value) {
    isRead.value = versionInfo.value.readFlag == '1' ? false : true
  }
})

watch(
  () => wsCache.get('version'),
  (val: any) => {
    // console.log('version===>', wsCache.get('version'))
    if (val) {
      versionInfo.value = val
      isRead.value = versionInfo.value.readFlag == '1' ? false : true
    }
  },
  { deep: true, immediate: true }
)
</script>

<template>
  <div class="version-top" @click="versionDetails" v-if="versionInfo">
    <div class="version-info">
      <span class="version-text"
        >当前版本：{{
          versionInfo && versionInfo.versionNumber ? versionInfo.versionNumber : '--'
        }}</span
      >
      <div class="notification" v-if="isRead"> </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.version-top {
  display: flex;
  cursor: pointer;
}
.version-info {
  border-radius: 15px;
  padding: 4px 12px;
  display: flex;
}
.version-info:hover {
  background: #e7f8ff;
}
.version-text {
  font-size: 12px;
  font-family: Alibaba PuHuiTi R;
  font-weight: 400;
  color: #191919;
}
.notification {
  width: 6px;
  height: 6px;
  background: #ff2323;
  margin-left: 2px;
  border-radius: 50%;
  z-index: 1;
}
</style>
