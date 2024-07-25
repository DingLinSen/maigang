<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { propTypes } from '@/utils/propTypes'

const emit = defineEmits(['closeBigImg'])
const props = defineProps({
  ifImgShow: propTypes.bool.def(false),
  imgSrc: propTypes.string.def(''),
  imgSite: propTypes.object.def({
    height: 0,
    width: 0
  })
})

const height = ref<any>(0)
const width = ref<any>(0)

const cssVar = computed(() => {
  const _site = {
    '--height': height.value,
    '--width': width.value
  }
  return _site
})

watch(
  () => props.ifImgShow,
  (val: boolean) => {
    if (val) {
      const _H = document.body.offsetHeight ?? 0 //容器高度
      const _W = document.body.offsetWidth ?? 0 //容器宽度

      const V = _H / props.imgSite.height > _W / props.imgSite.width //容器和图片的宽高比，是否高比大于宽比

      height.value = V ? null : '90vh'
      width.value = V ? '90vw' : null
    }
  },
  {
    immediate: true
  }
)

const getClose = () => {
  emit('closeBigImg')
}
</script>
<template>
  <div class="img-view" @click="getClose" :style="cssVar" v-show="props.ifImgShow">
    <div class="img-layer">
      <img :src="props.imgSrc" alt="图片地址错误" />
    </div>
  </div>
</template>

<style lang="less" scoped>
.img-view {
  .img-layer {
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 100000; //保证是容器内最大的z-index
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.7);
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      height: var(--height);
      width: var(--width);
    }
  }
}
</style>