<script setup lang="ts">
import { ElDropdown, ElDropdownMenu, ElDropdownItem, ElMessageBox } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import { useCache } from '@/hooks/web/useCache'
import { resetRouter } from '@/router'
import { useRouter } from 'vue-router'
import { loginOutApi } from '@/api/login'
import { useCookies } from 'vue3-cookies'
import { useDesign } from '@/hooks/web/useDesign'
import { useTagsViewStore } from '@/store/modules/tagsView'
import { computed, ref, watch, nextTick } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { useEmitt } from '@/hooks/web/useEmitt'
import { removeRoken } from '@/utils/removeRoken'
const tagsViewStore = useTagsViewStore()

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('user-info')

const { cookies } = useCookies()
const { t } = useI18n()

const { wsCache } = useCache()
const loginClientId = import.meta.env.VITE_WS_BASE_CLIENTID
const loginUrl = import.meta.env.VITE_WS_BASE_LOGIN_URL
const { replace, push } = useRouter()

const loginOut = () => {
  ElMessageBox.confirm(t('common.loginOutMessage'), t('common.reminder'), {
    confirmButtonText: t('common.ok'),
    cancelButtonText: t('common.cancel'),
    type: 'warning',
    autofocus: false
  })
    .then(async () => {
      const res = await loginOutApi()
      // debugger
      if (res) {
        removeRoken()
        tagsViewStore.delAllViews()

        resetRouter() // 重置静态路由表
        // replace('/login')
        // push({ path: '/login' })
      }
    })
    .catch((error) => {
      console.log(error)
    })
}

const nickName = computed(() => appStore.getUserNickName)
const getUserInfo = computed(() => appStore.getUserInfo)
const userName = ref<string>('')
const avatar = ref<string>('')

const toDocument = () => {
  nextTick(() => {
    replace('/Personal')
  })
}
useEmitt({
  name: 'avator',
  callback: (type: string) => {
    if (type === 'img') {
      avatar.value =
        wsCache.get('userInfo') && wsCache.get('userInfo').avatar
          ? wsCache.get('userInfo').avatar
          : ''
    }
  }
})
const appStore = useAppStore()

watch(
  () => nickName.value,
  (nickName: string) => {
    userName.value = nickName
  },
  {
    immediate: true
  }
)
// console.log(wsCache.get('userInfo'), 11111)
// watch(
//   () => wsCache.get('userInfo'),
//   (val: any) => {
//     console.log(wsCache.get('userInfo'), 88585588)
//     if (val) {
//       userName.value = val.nickName
//       avatar.value = val.avatar
//     }
//   },
//   { deep: true, immediate: true }
// )

let timer = setInterval(() => {
  console.log('img', wsCache.get('userInfo'))
  if (wsCache.get('userInfo')) {
    userName.value = wsCache.get('userInfo').nickName
    avatar.value = wsCache.get('userInfo').avatar
    clearInterval(timer)
  }
  console.log('1111233', wsCache.get('userInfo'))
}, 500)

const setDefaultImage = async (e: any) => {
  const avatar = await import('@/assets/imgs/avatar.jpg')
  e.target.src = avatar.default
}
</script>

<template>
  <ElDropdown :class="prefixCls" trigger="click" :teleported="false">
    <div class="flex items-center">
      <span>
        <img
          v-if="avatar && avatar !== ''"
          :src="avatar"
          alt=""
          @error="setDefaultImage"
          class="w-[28px] rounded-[50%]" />
        <img v-else src="@/assets/imgs/avatar.jpg" alt="" class="w-[28px] rounded-[50%]"
      /></span>

      <span class="<lg:hidden text-14px pl-[5px] text-[var(--top-header-text-color)]">{{
        userName
      }}</span>
      <div class="more"><Icon icon="svg-icon:home_more_icon" /></div>
    </div>
    <template #dropdown>
      <ElDropdownMenu>
        <ElDropdownItem @click="toDocument">
          <div>个人中心</div>
        </ElDropdownItem>
        <ElDropdownItem divided @click="loginOut">
          <div>{{ t('common.loginOut') }}</div>
        </ElDropdownItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>
</template>

<style scoped lang="less">
.more {
  cursor: pointer;
  width: 36px;
  height: 36px;
  border-radius: 6px;
  display: flex;
  margin-top: 3px;
  margin-left: 7px;
  // justify-content: center;
  align-items: center;
  :deep(.el-icon) {
    font-size: 16px !important;
  }
}
</style>
