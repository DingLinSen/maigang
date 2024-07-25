<script setup lang="ts">
import { SatisticsMenu, NeedDealt, EarlyWarning, ChartQuery } from './module'
import Socket from '@/socket/index'
import { useCache } from '@/hooks/web/useCache'
import { ref, provide, computed, watch } from 'vue'
import {
  userSelectByPmApi // 获取所有用户
} from '@/api/user'
import {
  getAllDeptListApi // 获取所有部门
} from '@/api/sys/dept'
import { listToTree } from '@/utils/tree'
import { LimitDailog } from '@/views/Components/limit'
import { useWebSocketStore } from '@/store/modules/webSocket'

defineOptions({
  name: 'Overview'
})

const PATH_URL = import.meta.env.VITE_WS_BASE_URL

const { wsCache } = useCache()
const deptData = ref<any>([])
const userData = ref<any>([])
const principalTree = ref<any>([])
const messageData = ref<any>([])

// provide('messageData', messageData)

//获取所有用户
const getAllUserlist = async () => {
  try {
    let params = {
      pageSize: 999999,
      pageNum: 1
    }
    const res = await getAllDeptListApi({})
    const { data } = await userSelectByPmApi({})
    deptData.value = res.data
    userData.value = data

    getprincipalTree()

    return data
  } catch (error) {
    console.log(error)
  }
}

const getprincipalTree = async () => {
  if (deptData.value.length) {
    deptData.value.forEach((deptItem: any) => {
      userData.value.forEach((userItem: any) => {
        if (deptItem.deptId === userItem.deptId) {
          deptItem.children.push({
            deptId: userItem.userId,
            deptName: userItem.nickName
          })
        }
      })
    })

    deptData.value = deptData.value.filter((v) => {
      return v.children.length
    })
    principalTree.value = listToTree(deptData.value, {
      id: 'deptId',
      children: 'children',
      pid: 'parentId'
    })
  }
}

getAllUserlist()
provide('principalTree', principalTree)

const store = useWebSocketStore()
const messageArray = computed(() => store.getWebSocketData)

watch(
  () => messageArray.value.length,
  (val: any) => {
    if (val) {
      messageData.value = messageArray.value.filter((item: any) => item.type == '项目管理')
    } else {
      messageData.value = []
    }
  },
  { deep: true, immediate: true }
)
</script>

<template>
  <div>
    <header>
      <SatisticsMenu />
    </header>

    <section class="pb-20px">
      <div class="flex h-297px 2xl:h-386px">
        <NeedDealt class="mr-[0.73vw] w-[40%]" :messageData="messageData"/>
        <EarlyWarning class="flex-1" />
      </div>
      <ChartQuery />
    </section>
    <LimitDailog routerName="overview" />
  </div>
</template>
