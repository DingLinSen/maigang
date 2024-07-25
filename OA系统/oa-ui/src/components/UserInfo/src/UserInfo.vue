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
        wsCache.set(appStore.getUserInfo, null)
        wsCache.clear()
        cookies.remove('access_token')
        cookies.remove('TGC')
        cookies.remove('refresh_token')
        cookies.remove('Admin-Expires-In')
        tagsViewStore.delAllViews()

        resetRouter() // 重置静态路由表
        let href = encodeURIComponent(window.location.href)
        window.location.href =
          loginUrl + '?clientId=' + loginClientId + '&redirectUri=' + href + '&logout=true'
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
  // nextTick(() => {
  replace('/user/profile')
  // })
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

watch(
  () => wsCache.get('userInfo'),
  (val: any) => {
    if (val) {
      userName.value = val.nickName
      avatar.value = val.avatar
    }
  },
  { deep: true, immediate: true }
)

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
          class="w-[calc(var(--logo-height)-25px)] rounded-[50%]" />
        <img
          v-else
          src="@/assets/imgs/avatar.jpg"
          alt=""
          class="w-[calc(var(--logo-height)-25px)] rounded-[50%]"
      /></span>

      <span class="<lg:hidden text-14px pl-[5px] text-[var(--top-header-text-color)]">{{
        userName
      }}</span>
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
