<template>
  <ContentWrap :isShowtitle="false" class="nomargin-contentWrap">
    <div
      class="2xl:h-122px h-102px flex justify-between items-center px-[1.04vw] bg-[#fff] cursor-pointer"
    >
      <div
        @click="handle(item.type)"
        class="h-68px flex flex-col rounded justify-center cursor=pointer bg-[#F7F8FA] w-[7.03vw] pl-[0.73vw] apply_module"
        v-for="(item, index) in aoolyTextData"
        :Key="index"
      >
        <p>{{ item.label }}</p>
        <p class="text-sm text-[#888]">去申请></p>
      </div>
    </div>
  </ContentWrap>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ContentWrap } from '@/components/ContentWrap'
import { useRouter } from 'vue-router'

const { push } = useRouter()

const aoolyTextData = ref([
  {
    label: '请假申请',
    type: 1
  },
  {
    label: '出差申请',
    type: 2
  },
  {
    label: '加班申请',
    type: 3
  },
  {
    label: '外出申请',
    type: 4
  }
])

const handle = (type) => {
  push({ name: 'Application', query: { type: type } })
}
</script>

<style scoped lang="less">
.apply_module {
  margin-right: 0.78vw;
  position: relative;
  &:last-child {
    margin-right: 0 !important;
  }
  &::after {
    content: '';
    position: absolute;
    display: block;
    width: 3px;
    height: 34px;
    background: #00a0e9;
    transform: translateY(-50%);
    left: 0;
    top: 50%;
    border-radius: 2px;
  }
}
</style>
