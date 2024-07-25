<script setup lang="ts">
import { ElDropdown, ElDropdownMenu, ElDropdownItem, ElMessageBox, ElMessage } from 'element-plus'
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
// 获取cookies
const { cookies } = useCookies()
const { t } = useI18n()

const { wsCache } = useCache()

const { replace, push } = useRouter()

const loginOut = () => {
  ElMessageBox.confirm(t('common.loginOutMessage'), t('common.reminder'), {
    confirmButtonText: t('common.ok'),
    cancelButtonText: t('common.cancel'),
    type: 'warning'
  })
    .then(async () => {
      const res = await loginOutApi()
      if (res) {
        wsCache.clear()

        tagsViewStore.delAllViews()

        resetRouter() // 重置静态路由表
        ElMessage.success('退出登录成功')
        cookies.remove('access_token')
        cookies.remove('TGC')
        cookies.remove('user_info')
        cookies.remove('refresh_token')
        cookies.remove('Admin-Expires-In')
        wsCache.set(appStore.getUserInfo, null)
        wsCache.clear()
        replace('/login')
      }
    })
    .catch((error) => {
      console.log(error)
    })
}

const nickName = computed(() => appStore.getUserNickName)
const getUserInfo = computed(() => appStore.getUserInfo)
const userName = ref<string>(wsCache.get('userInfo').name)
const avatar = ref<string>(wsCache.get('userInfo').avatar)

const toDocument = () => {
  // nextTick(() => {
  replace('/user/profile')
  // })
}
useEmitt({
  name: 'avator',
  callback: (type: string) => {
    if (type === 'img') {
      avatar.value = wsCache.get('userInfo').avatar
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
</script>

<template>
  <ElDropdown :class="prefixCls" trigger="click">
    <div class="flex items-center">
      <span>
        <img
          v-if="avatar && avatar !== ''"
          :src="avatar"
          alt=""
          class="w-[calc(var(--logo-height)-25px)] rounded-[50%]" />
        <img
          v-else
          src="@/assets/imgs/avatar.jpg"
          alt=""
          class="w-[calc(var(--logo-height)-25px)] rounded-[50%]"
      /></span>

      <span class="<lg:hidden text-14px pl-[5px] text-[var(--top-header-text-color)]">{{
        wsCache.get('userInfo') ? wsCache.get('userInfo').nickName : null
      }}</span>
    </div>
    <template #dropdown>
      <ElDropdownMenu>
        <ElDropdownItem>
          <div @click="loginOut">{{ t('common.loginOut') }}</div>
        </ElDropdownItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>
</template>
