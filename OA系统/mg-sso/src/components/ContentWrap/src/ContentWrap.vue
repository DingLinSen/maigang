<script setup lang="ts">
import { ElCard, ElTooltip } from 'element-plus'
import { propTypes } from '@/utils/propTypes'
import { useDesign } from '@/hooks/web/useDesign'

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('content-wrap')

defineProps({
  title: propTypes.string.def(''),
  message: propTypes.string.def(''),
  Showtitle: propTypes.string.def(''),
  isShowtitle: propTypes.bool.def(true)
})
</script>

<template>
  <ElCard :class="[prefixCls]" shadow="never" class="isShadow">
    <template v-if="title" #header>
      <div class="flex items-center">
        <span class="text-16px font-700">{{ title }}</span>
        <ElTooltip v-if="message" effect="dark" placement="right">
          <template #content>
            <div class="max-w-200px">{{ message }}</div>
          </template>
          <Icon class="ml-5px" icon="bi:question-circle-fill" :size="14" />
        </ElTooltip>
      </div>
    </template>

    <!-- 内容 -->

    <div>
      <div v-if="isShowtitle" class="ContentWrapTitle">
        <!-- <div>{{ Showtitle }}</div> -->
        <p
          style="
            font-family: Alibaba PuHuiTi M;
            font-weight: 500;
            font-size: 16px;
            line-height: 36px;
          "
          >{{ Showtitle }}</p
        >
        <slot name="ContentWrapTitle"></slot>
      </div>

      <slot></slot>
    </div>
  </ElCard>
</template>
<style lang="less" scoped>
.isShadow {
  box-shadow: 0px 3px 4px 0px rgba(31, 31, 31, 0.2);
}
.ContentWrapTitle {
  margin-bottom: 17px;
  padding-bottom: 11px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #eef0f2;
}
// :deep(.el-loading-mask) {
//   top: 15px;
//   right: 8px;
//   bottom: 8px;
//   left: 12px;
// }
</style>
