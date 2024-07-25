<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ElDropdown, ElDropdownMenu, ElDropdownItem, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import { useI18n } from '@/hooks/web/useI18n'
import { useCache } from '@/hooks/web/useCache'
import { useEmitt } from '@/hooks/web/useEmitt'
import { useDesign } from '@/hooks/web/useDesign'
import { useTagsViewStore } from '@/store/modules/tagsView'
import { useAppStore } from '@/store/modules/app'
import { usePermissionStore } from '@/store/modules/permission'
import { resetRouter } from '@/router'

import { loginOutApi } from '@/api/login'

const tagsViewStore = useTagsViewStore()

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('user-info')

const { t } = useI18n()

const { wsCache } = useCache()

const { replace, push } = useRouter()
const permissionStore = usePermissionStore()

const loginOut = () => {
  ElMessageBox.confirm(t('common.loginOutMessage'), t('common.reminder'), {
    confirmButtonText: t('common.ok'),
    cancelButtonText: t('common.cancel'),
    type: 'warning',
    autofocus: false,
    confirmButtonClass: 'quit-btn'
  })
    .then(async () => {
      const res = await loginOutApi().catch(() => {})
      if (res) {
        wsCache.clear()
        tagsViewStore.delAllViews()
        // resetRouter() // 重置静态路由表
        replace('/login')
      }
    })
    .catch(() => {})
}

const userName = ref<string>(wsCache.get('userInfo').nickName)
const avatar = ref<string>(wsCache.get('userInfo').avatar)
const toDocument = () => {
  if (permissionStore.routers.find((s) => s.name === 'UserProfile')) {
    push('/user/profile')
  }
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
let userInfo = wsCache.get(appStore.getUserInfo)
const nickName = computed(() => appStore.getUserNickName)
// let userAvatar = computed(() => appStore.getAvatar)
watch(
  () => nickName.value,
  (nickName: string) => {
    userName.value = nickName
  },
  {
    immediate: true
  }
)
// watch(
//   () => userAvatar.value,
//   (avatar: string) => {
//     userAvatar.value = avatar
//   },
//   {
//     immediate: true
//   }
// )
watch(
  () => userInfo,
  (user: any) => {
    userInfo = user
  },
  {
    immediate: true
  }
)
</script>

<template>
  <ElDropdown
    :class="[prefixCls, 'hover-trigger', 'user-info-dropdown']"
    trigger="click"
    :teleported="false"
  >
    <div class="flex items-center">
      <img
        v-if="avatar"
        :src="avatar"
        alt=""
        class="w-[calc(var(--logo-height)-25px)] rounded-[50%]"
      />
      <img
        v-else
        src="@/assets/imgs/avatar.jpg"
        alt=""
        class="w-[calc(var(--logo-height)-25px)] rounded-[50%]"
      />
      <div class="<lg:hidden text-14px pl-[5px] text-[var(--top-header-text-color)]">
        <p>{{ userName || userInfo.nickName }}</p>
        <p class="pt-[5px] text-12px">{{ userInfo.dept?.deptName }}</p>
      </div>
    </div>

    <template #dropdown>
      <ElDropdownMenu :append-to-body="false">
        <ElDropdownItem>
          <div @click="toDocument">个人中心</div>
        </ElDropdownItem>
        <ElDropdownItem divided>
          <div @click="loginOut">{{ t('common.loginOut') }}</div>
        </ElDropdownItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>
  <div
    class="flex items-center hover-trigger pr-10px text-14px text-[var(--top-header-text-color)]"
    @click="loginOut"
  >
    <img
      class="mr-5px w-[calc(var(--logo-height)-34px)]"
      src="@/assets/imgs/icons/logout.png"
      alt=""
    />
    退出
  </div>
</template>

<style lang="less">
.user-info-dropdown {
  .el-popper {
    max-width: 100px !important;
  }
  position: relative;
  .el-dropdown__popper {
    position: absolute !important;
    top: 53px !important;
    left: 20px !important;
  }
  .el-popper__arrow {
    left: 40px !important;
  }
}
</style>
