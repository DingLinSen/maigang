<script setup lang="ts">
import { ElCard, ElButton, ElDrawer } from 'element-plus'
import { propTypes } from '@/utils/propTypes'
import { useDesign } from '@/hooks/web/useDesign'
import { useEmitt } from '@/hooks/web/useEmitt'
import { ref, onMounted } from 'vue'

const { emitter } = useEmitt()

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('content-detail-wrap')
const emit = defineEmits(['closeDrawerWrap'])

const props = defineProps({
  title: propTypes.string.def(''),
  isShowBack: propTypes.bool.def(true)
})

const closeDrawerSub = () => {
  emitter.emit('drawer', 'closed')
  emit('closeDrawerWrap')
}

const isShow = ref<boolean>(false)
defineExpose({
  isShow
})
</script>

<template>
  <div class="my-drawer">
    <ElDrawer
      v-model="isShow"
      :show-close="false"
      size="100%"
      :lock-scroll="false"
      ref="drawerContent"
      @closed="closeDrawerSub"
    >
      <!-- <template #header="{ close }">
        <div
          :class="[
            `${prefixCls}-header`,
            'flex border-bottom-1 h-50px items-center text-center bg-white pr-10px'
          ]"
        >
          <div v-if="isShowBack" :class="[`${prefixCls}-header__back`, 'flex pl-10px pr-10px ']">
            <ElButton @click="close"> <Icon icon="ep:arrow-left" class="mr-5px" />返回 </ElButton>
          </div>

          <div :class="[`${prefixCls}-header__title`, 'flex flex-1  justify-center']">
            <label class="text-16px font-700">{{ title }}</label>
          </div>

          <div :class="[`${prefixCls}-header__right`, 'flex  pl-10px pr-10px']">
            <slot name="right"></slot>
          </div>
        </div>
      </template> -->

      <template #header="{ close }">
        <div
          :class="[`${prefixCls}-header`, 'h-14 flex items-center text-center pl-14px line-class']"
        >
          <div :class="[`${prefixCls}-header__title`, 'flex flex-1  justify-start']">
            <label class="text-16px font-500">{{ title }}</label>
          </div>

          <div
            :class="[`${prefixCls}-header__back`, 'flex  justify-end cursor-pointer']"
            @click="close"
          >
            <Icon icon="ic:outline-close" class="drawer-close mr-5px" />
          </div>

          <div :class="[`${prefixCls}-header__right`, 'flex  pl-10px pr-10px']">
            <slot name="right"></slot>
          </div>
        </div>
      </template>

      <!-- <ElCard :class="[`${prefixCls}-body`, 'mb-20px']" shadow="never"> -->
      <div class="content-wrap">
        <slot name="content"></slot>
      </div>

      <div>
        <slot name="footer"></slot>
      </div>
      <!-- </ElCard> -->
    </ElDrawer>
  </div>
</template>

<style lang="less" scoped>
:deep(.v-content-detail-wrap-header__back) {
  .drawer-close{
    font-size: 18px !important;
  }
  .el-icon {
    .drawer-close {
      font-size: 18px !important;
    }
  }
}
.content-wrap {
  min-height: 300px;
}
.my-drawer {
  // padding: 20px;

  :deep(.el-overlay) {
    position: absolute !important;
    top: 20px !important;
    left: 11px !important;
    right: 8px;
    bottom: 620px !important;
  }
  :deep(.el-loading-mask) {
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
  :deep(.el-drawer__header) {
    padding: 0px;
    margin-bottom: 0px;
  }
  :deep(.v-content-wrap) {
    box-shadow: 0px 3px 4px 0px rgba(31, 31, 31, 0.2);
  }

  // 弹出层底部样式 编辑新增页面
  .demo-drawer-footer {
    padding: 0;
    width: 100%;
    height: 50px;
    margin-top: 50px;
    margin-bottom: 30px;
    padding: 10px 15px;
    text-align: center;
  }
}
.el-button {
  border-radius: 2px;
}
.line-class {
  border-bottom: 1px solid #eff1f4 !important;
}
@media screen and (max-width: 1435px) {
  .my-drawer {
    // padding: 20px;
    :deep(.el-overlay) {
      position: absolute !important;
      top: 10px !important;
      left: 11px !important;
      right: 8px;
      bottom: 20px;
      box-shadow: 0px 3px 9px 0px rgba(31, 31, 31, 0.2);
    }
  }
}
</style>
<style lang="less">
.my-drawer {
  .el-overlay {
    z-index: 98 !important;
  }
}
</style>
