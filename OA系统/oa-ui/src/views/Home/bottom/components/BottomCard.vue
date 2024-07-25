<template>
  <div class="content-notice-wrap-class">
    <div class="flex">
      <p class="title-item-class relative">{{ props.title }} </p>
      <span style="margin: auto"> </span>
      <span class="more-text-class" @click="more"
        >更多
        <Icon :size="12" class="mb-[1px]" style="color: #777777" icon="ep:arrow-right-bold" />
      </span>
    </div>
    <div class="h-[16.88em] mt-[0.8em]">
      <div class="card-class">
        <slot name="content"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { propTypes } from '@/utils/propTypes'
import { ref, onMounted } from 'vue'
import { useEmitt } from '@/hooks/web/useEmitt'

const props = defineProps({
  title: propTypes.string.def('')
})
const emit = defineEmits(['moreClick'])
const more = () => {
  emit('moreClick')
}
onMounted(() => {})
</script>

<style lang="less" scoped>
.content-notice-wrap-class {
  width: 32.8%;
  height: 100%;
}

.title-item-class {
  font-size: 16px;
  font-family: Alibaba PuHuiTi M;
  font-weight: 500;
  color: #333333;
  margin-left: 10px;
}

// @media screen and (max-width: 1536px) {
//   .title-item-class {
//     font-size: 14px;
//   }
//   .more-text-class {
//     margin-top: 0;
//   }
// }

.card-class {
  width: 100%;
  height: 100%;
  background: #ffffff;
  box-shadow: 0px 3px 4px 0px rgba(31, 31, 31, 0.2);
  border-radius: 4px;
}
.more-text-class {
  display: flex;
  font-size: 14px;
  font-family: Alibaba PuHuiTi R;
  font-weight: 400;
  color: #777777;
  margin-right: 5px;
  margin-top: 2px;
  cursor: pointer;
  justify-content: center;
  justify-items: center;
  align-items: center;

  .el-icon {
    font-size: 12px !important;
  }
}
</style>
