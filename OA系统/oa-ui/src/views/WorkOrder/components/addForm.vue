<script setup lang="ts">
import { ref, onMounted, nextTick, watch, inject } from 'vue'
import { ElButton, ElMessage, ElForm, ElFormItem, ElDatePicker } from 'element-plus'
import { propTypes } from '@/utils/propTypes'

const props = defineProps({
  title: propTypes.string.def(''),
  modelValue: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: true
  }
})

// 新增表单
const addFormFlag = ref(false)

// 开启
const openForm = (flag) => {
  addFormFlag.value = flag
}

defineExpose({
  openForm
})
</script>

<template>
  <section class="pr-2 bg-white application-addform w-full">
    <div class="flex justify-between mb-[6px] items-center w-full bg-[#EDEEF0] h-44px">
      <p class="font-2xl article-addform-title">{{ title }}</p>
      <div class="text-15px text-[#00A0E9] flex items-center items-end" v-if="disabled">
        <p class="flex items-end items-center cursor-pointer mr-20px" @click="openForm(true)">
          <img class="mr-7px" src="@/assets/imgs/icon/add_bar_icon.png" />
          <span>添加</span>
        </p>
      </div>
    </div>
    <div class="w-full bg-[#F5F6F7]">
      <div>
        <slot name="table"></slot>
      </div>
      <div class="bg-[#F5F6F7] py-20px" v-if="addFormFlag">
        <div class="bg-[#fff] py-[16px] mx-15px px-20px"> <slot name="content"></slot></div>
      </div>
    </div>
  </section>
</template>
<style lang="less" scoped>
.article-addform-title {
  padding-left: 10px;
  font-size: 16px;
  font-weight: 600;
  color: #333333;
}
</style>

<style>
.application-addform .addform-sub {
  margin-right: 14px !important;
}
</style>
