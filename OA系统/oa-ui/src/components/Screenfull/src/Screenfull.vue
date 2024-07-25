<script setup lang="ts">
import { Icon } from '@/components/Icon'
import { useFullscreen } from '@vueuse/core'
import { propTypes } from '@/utils/propTypes'
import { useDesign } from '@/hooks/web/useDesign'

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('screenfull')

defineProps({
  color: propTypes.string.def('')
})

const { toggle, isFullscreen } = useFullscreen()

const toggleFullscreen = () => {
  toggle()
}
</script>

<template>
  <div :class="prefixCls" @click="toggleFullscreen">
    <Icon :icon="isFullscreen ? 'svg-icon:ss_icon' : 'svg-icon:qp_icon'" :color="color" />
  </div>
</template>
<style lang="less" scoped>
.v-screenfull {
  .el-icon {
    font-size: 18px !important;
  }
}
</style>
