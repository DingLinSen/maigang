<script setup lang="ts">
import pageError from '@/assets/svgs/404.svg'
import networkError from '@/assets/svgs/500.svg'
import noPermission from '@/assets/svgs/403.svg'
import { propTypes } from '@/utils/propTypes'
import { useI18n } from '@/hooks/web/useI18n'
import { ElButton } from 'element-plus'

interface ErrorMap {
  url: string
  message: string
  buttonText: string
}

const { t } = useI18n()

const errorMap: {
  [key: string]: ErrorMap
} = {
  '404': {
    url: pageError,
    message: t('error.pageError'),
    buttonText: t('error.returnToHome')
  },
  '500': {
    url: networkError,
    message: t('error.networkError'),
    buttonText: t('error.returnToHome')
  },
  '403': {
    url: noPermission,
    message: t('error.noPermission'),
    buttonText: t('error.returnToHome')
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
  <div class="flex justify-center h-full">
    <div class="text-center absolute top-1/2 transform -translate-y-1/2">
      <img width="350" class="mb-4" src="../../../assets/imgs/state_icon.png" alt="" />
      <div class="text-[#333333] text-2xl mb-2">您访问的网页找不到了</div>
      <div class="text-14px text-[var(--el-color-info)]"
        >很抱歉，您要访问的页面不存在，或者没有访问权限</div
      >
      <div class="mt-20px">
        <ElButton type="primary" @click="btnClick">回到首页</ElButton>
      </div>
    </div>
  </div>
</template>
