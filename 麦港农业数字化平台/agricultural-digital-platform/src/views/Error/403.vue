<script setup lang="ts">
import { Error } from '@/components/Error'
// import { usePermissionStore } from '@/store/modules/permission'
import { useRouter } from 'vue-router'
import { useCookies } from 'vue3-cookies'
import { useCache } from '@/hooks/web/useCache'
import { useAppStore } from '@/store/modules/app'
const { cookies } = useCookies()
const { wsCache } = useCache()
const appStore = useAppStore()
const router = useRouter()

// const permissionStore = usePermissionStore()

const errorClick = () => {
  // push(permissionStore.addRouters[0]?.path as string)
  cookies.set('Admin-Token', '', 0)
  cookies.set('Admin-Expires-In', '')
  wsCache.set(appStore.getToken, '')
  wsCache.set(appStore.getExpires, '')
  wsCache.clear()
  router.push('/login')
}
</script>

<template>
  <Error type="403" @error-click="errorClick" />
</template>
