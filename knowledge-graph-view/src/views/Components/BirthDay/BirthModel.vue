<template>
  <div class="modal-mask" v-if="showModel">
    <div class="relative">
      <div class="modal-container">
        <span class="text-one-class">亲爱的：</span>
        <p style="text-align: center"
          ><span class="text-two-class">&nbsp;今天是你的生日， </span></p
        >
        <p style="text-align: center"
          ><span class="text-two-class">&nbsp;公司全体同仁衷心祝福你生日快乐！ </span></p
        >
        <p style="text-align: center"
          ><span class="text-two-class"
            >&nbsp;感谢你在自己的工作岗位上兢兢业业，默默奉献！
          </span></p
        >
        <p style="text-align: center"
          ><span class="text-two-class">&nbsp;在今后的日子里， </span></p
        >
        <p style="text-align: center"
          ><span class="text-two-class">&nbsp;希望你再接再厉， </span></p
        >
        <p style="text-align: center"
          ><span class="text-two-class">&nbsp;获得更多的快乐和更大的成长！ </span></p
        >
      </div>
      <span class="button-class" @click="close">收下祝福~</span>
      <img class="close-class" src="@/assets/imgs/home/close_icon.png" @click="close" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { propTypes } from '@/utils/propTypes'

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
  emit('update:modelValue', false)
}
</script>

<style lang="less" scoped>
.close-class {
  position: absolute;
  width: 28px;
  height: 28px;
  right: -14px;
  top: 158px;
  cursor: pointer;
}
.modal-mask {
  z-index: 99999;
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
.modal-container {
  display: grid;
  width: 477px;
  height: 570px;
  margin-bottom: 25px;
  padding-bottom: 120px;
}
.button-class {
  background: #f25d7b;
  border-radius: 22px;
  margin-left: 138px;
  align-items: center;
  padding: 11px 60px;
  font-size: 15px;
  font-family: Alibaba PuHuiTi R;
  font-weight: 400;
  color: #ffffff;
  cursor: pointer;
}
.text-one-class {
  margin-top: 210px;
  width: 100%;
  padding-left: 51px;
  font-size: 16px;
  font-family: Alibaba PuHuiTi M;
  font-weight: 500;
  color: #333333;
}
.text-two-class {
  position: relative;
  text-align: center;
  font-size: 15px;
  font-family: Alibaba PuHuiTi R;
  font-weight: 400;
  color: #333333;
  padding-bottom: 5px;
  border-bottom: 1px dashed #ffcfc0;
}
</style>
