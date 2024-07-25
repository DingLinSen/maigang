<script setup lang="ts">
import { ElCard, ElButton, ElDrawer } from 'element-plus'
import { propTypes } from '@/utils/propTypes'
import { useDesign } from '@/hooks/web/useDesign'
import { useEmitt } from '@/hooks/web/useEmitt'
import { ref, onMounted } from 'vue'

const { emitter } = useEmitt()

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('content-detail-wrap')

const props = defineProps({
  title: propTypes.string.def(''),
  customClass: propTypes.string.def(''),
  appendToBody: propTypes.bool.def(false)
})

const closeDrawerSub = () => {
  emitter.emit('drawer', 'closed')
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
      :append-to-body="appendToBody"
      :custom-class="customClass"
      class="drawer-wrap-details"
      :lock-scroll="true"
      ref="drawerContent"
      @closed="closeDrawerSub"
    >
      <template #header="{ close }">
        <div :class="[`${prefixCls}-header`, 'h-14 flex items-center text-center pl-14px']">
          <div :class="[`${prefixCls}-header__title`, 'flex flex-1  justify-start']">
            <label class="text-16px font-500">{{ title }}</label>
          </div>

          <div
            :class="[`${prefixCls}-header__back`, 'flex  justify-end cursor-pointer']"
            @click="close"
          >
            <Icon icon="ic:outline-close" class="mr-5px" />
          </div>

          <div :class="[`${prefixCls}-header__right`, 'flex  pl-10px pr-10px']">
            <slot name="right"></slot>
          </div>
        </div>
      </template>

      <ElCard :class="[`${prefixCls}-body`, 'mb-20px el-card-details']" shadow="never">
        <div style="min-height: 300px">
          <slot name="content"></slot>
        </div>

        <div>
          <slot name="footer"></slot>
        </div>
      </ElCard>
    </ElDrawer>
  </div>
</template>

<style lang="less" scoped>
:deep(.drawer-wrap-details) {
  background: #eff1f4;
  .el-drawer__header {
    background: white;
    margin: 0;
    padding: 0;
  }

  box-shadow: 0px 3px 4px 0px rgba(31, 31, 31, 0.2);
  .el-card-details {
    // overflow: visible !important;
    border: 0;
  }
  .el-card-details .el-card__body {
    margin: 0;
    padding: 0;
    background: #eff1f4 !important;
  }
}
.my-drawer {
  // padding: 20px;
  :deep(.el-overlay) {
    position: absolute !important;
    top: 19px !important;
    left: 11px !important;
    right: 8px;
    bottom: 20px;
    box-shadow: 0px 3px 9px 0px rgba(31, 31, 31, 0.2);
  }
  :deep(.el-drawer__header) {
    padding: 0px;
    font-family: 'Alibaba PuHuiTi M';
    // font-weight: 500;
    // font-size: 16px;
    color: #333333;
    margin-bottom: 0px;
  }
  :deep(.el-drawer__body) {
    padding: 15px;
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
</style>
