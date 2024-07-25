<script setup lang="ts">
import pageError from '@/assets/imgs/404_icon.png'
import networkError from '@/assets/svgs/500.svg'
import noPermission from '@/assets/svgs/403.svg'
import { propTypes } from '@/utils/propTypes'
import { useI18n } from '@/hooks/web/useI18n'
import { ElButton } from 'element-plus'
interface ErrorMap {
  url: string
  message: string
  buttonText: string
  tipMessage: string
}

const { t } = useI18n()

const errorMap: {
  [key: string]: ErrorMap
} = {
  '404': {
    url: pageError,
    message: '您访问的网页找不到了',
    tipMessage: '很抱歉，您要访问的页面不存在，或者没有访问权限',
    buttonText: '返回登录'
  },
  '500': {
    url: networkError,
    message: t('error.networkError'),
    tipMessage: '很抱歉，您要访问的页面不存在，或者没有访问权限',
    buttonText: '返回登录'
  },
  '403': {
    url: noPermission,
    message: t('error.noPermission'),
    tipMessage: '很抱歉，您要访问的页面不存在，或者没有访问权限',
    buttonText: '返回登录'
  }
}

const props = defineProps({
  type: propTypes.string.validate((v: string) => ['404', '500', '403'].includes(v)).def('404')
})

const emit = defineEmits(['errorClick'])

const btnClick = () => {
  emit('errorClick', props.type)
}
</script>

<template>
  <div class="h-full flex items-center justify-center">
    <div class="text-center">
      <img width="350" class="error-img" :src="errorMap[type].url" alt="" />
      <div class="mt-40px text-24px color-333 font-weight">{{ errorMap[type].message }}</div>
      <div class="mt-20px text-16px color-333">{{ errorMap[type].tipMessage }}</div>
      <div class="mt-20px">
        <ElButton type="primary" @click="btnClick">{{ errorMap[type].buttonText }}</ElButton>
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
.error-img {
  margin-top: -10vh;
}
.font-weight {
  font-weight: bold;
}
.color-333 {
  color: #333;
}
</style>
