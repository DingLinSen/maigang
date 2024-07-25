<template>
  <div class="modal-mask" v-if="showModel">
    <div class="relative">
      <div> <img src="@/assets/imgs/home/pic.png" class="h-[85vh]" /> </div>
      <div class="click-area-class left-area-class" @click="go2HighGrowth('left')"></div>
      <div class="click-area-class right-area-class" @click="go2HighGrowth('right')"></div>
      <img class="close-class" src="@/assets/imgs/home/close_icon.png" @click="close" />
    </div>
  </div>
</template>
  
<script setup lang="ts">
import { useEmitt } from '@/hooks/web/useEmitt'
import { ref, watch, nextTick } from 'vue'
import { propTypes } from '@/utils/propTypes'
import { useRouter } from 'vue-router'

const router = useRouter()

const { emitter } = useEmitt()

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue: propTypes.bool.def(false)
})
const showModel = ref<boolean>(false)
// 监听窗口变化
watch(
  () => props.modelValue,
  (value: boolean) => {
    showModel.value = value
  },
  {
    immediate: true
  }
)

const close = () => {
  showModel.value = false
  emit('update:modelValue', false)
}

const go2HighGrowth = (type: string) => {
  const url = window.location.hash
  switch (type) {
    case 'left':
      if (url.indexOf('CompanyNotice') > -1) {
        emitter.emit('companyNotice', '100')
      } else {
        router.push({
          name: 'CompanyNotice',
          // query: { id: '100' },
          state: { id: '153' }
        })
      }
      break
    case 'right':
      if (url.indexOf('CompanyNotice') > -1) {
        emitter.emit('companyNotice', '153')
      } else {
        router.push({
          name: 'CompanyNotice',
          // query: { id: '153' },
          state: { id: '153' }
        })
      }
      break
  }
  close()
}
</script>
  
<style lang="less" scoped>
.close-class {
  position: absolute;
  width: 28px;
  height: 28px;
  right: 35px;
  top: 80px;
  cursor: pointer;
}
.modal-mask {
  z-index: 101;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
}

.click-area-class {
  background: transparent;
  position: absolute;
  cursor: pointer;
}
.left-area-class {
  width: 13vh;
  height: 11vh;
  top: 38vh;
  left: 20vh;
}
.right-area-class {
  width: 14vh;
  height: 11vh;
  top: 38vh;
  right: 18vh;
}
</style>