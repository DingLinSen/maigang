<script setup lang="ts">
import { ElCard, ElButton, ElDrawer } from 'element-plus'
import { propTypes } from '@/utils/propTypes'
import { useDesign } from '@/hooks/web/useDesign'
import { useEmitt } from '@/hooks/web/useEmitt'
import { ref } from 'vue'

const { emitter } = useEmitt()

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('content-detail-wrap')

const props = defineProps({
  title: propTypes.string.def('')
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
      :lock-scroll="true"
      ref="drawerContent"
      @closed="closeDrawerSub"
    >
      <template #header="{ close }">
        <div
          :class="[
            `${prefixCls}-header`,
            'flex border-bottom-1 h-50px items-center text-center bg-white pr-10px'
          ]"
        >
          <div :class="[`${prefixCls}-header__back`, 'flex pl-10px pr-10px ']">
            <ElButton @click="close"> <Icon icon="ep:arrow-left" class="mr-5px" />返回 </ElButton>
          </div>

          <div :class="[`${prefixCls}-header__title`, 'flex flex-1  justify-center']">
            <label class="text-16px font-700">{{ title }}</label>
          </div>

          <div :class="[`${prefixCls}-header__right`, 'flex  pl-10px pr-10px']">
            <slot name="right"></slot>
          </div>
        </div>
      </template>

      <ElCard :class="[`${prefixCls}-body`, 'mb-20px']" shadow="never">
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
.my-drawer {
  // padding: 20px;
  :deep(.el-overlay) {
    position: absolute !important;
    /*top: 20px !important;*/
    /*left: 20px !important;*/
    /*right: 20px;*/
    /*bottom: 20px;*/
  }
  :deep(.el-drawer__header) {
    padding: 0px;
    margin-bottom: 0px;
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
