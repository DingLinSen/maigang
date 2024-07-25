<script setup lang="ts">
import { Error } from '@/components/Error'
import { usePermissionStore } from '@/store/modules/permission'
import { useRouter } from 'vue-router'

const { push } = useRouter()

const permissionStore = usePermissionStore()
var path = ''
const routePath = (arr) => {
  if (arr[0].path.indexOf('/') != -1) {
    path += arr[0].path
  } else {
    if (path != '/') {
      path += '/' + arr[0].path
    } else {
      path += arr[0].path
    }
  }
  arr.forEach((item, index) => {
    if (item.children && !index) {
      routePath(item.children)
    }
  })
}

routePath(permissionStore.addRouters)

const errorClick = () => {
  push(path)
}
</script>

<template>
  <Error type="500" @error-click="errorClick" />
</template>
