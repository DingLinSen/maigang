<template>
  <div class="operation">
    <Version></Version>
    <div class="platform" v-if="powerFlag" @click="push({ path: '/Tag' })"
      ><Icon icon="svg-icon:set_icon"
    /></div>
    <ElDropdown popper-class="message-box" trigger="click" :teleported="false">
      <div class="personal"
        ><Icon icon="svg-icon:notice_icon" />
        <p class="bubble iconBubble" v-show="navData[0].messageNum > 0">{{
          navData[0].messageNum > 99 ? '99+' : navData[0].messageNum
        }}</p>
        <!-- <div class="message-list">
        <div>
          <p  v-for="(item, index) in navData" :key="index">{{
            item.name
          }}</p>
          <p @click="push({ path: '/message' })" class="see-all"
            ><span>查看全部</span><span>&gt;</span></p
          >
        </div>
      </div> -->
      </div>
      <template #dropdown>
        <ElDropdownMenu>
          <ElDropdownItem
            v-for="(item, index) in navData"
            :key="index"
            @click="toMessage(item.messageType)"
          >
            <div
              class="message-list"
              v-if="item.messageType != 2 || (powerFlag && item.messageType == 2)"
              ><span>{{ item.name }}</span>
              <span
                ><b class="bubble" v-show="item.messageNum > 0">{{
                  item.messageNum > 99 ? '99+' : item.messageNum
                }}</b></span
              ></div
            >
          </ElDropdownItem>
        </ElDropdownMenu>
      </template>
    </ElDropdown>
    <div><UserInfo class="cursor-pointer"></UserInfo></div>

    <!-- <ElDropdown :class="prefixCls" trigger="click" :teleported="false">
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
    </ElDropdown> -->
  </div>
</template>

<script setup lang="ts">
import { Version } from '@/components/Version'
import { ElDropdown, ElDropdownMenu, ElDropdownItem, ElMessageBox } from 'element-plus'
import { reactive, ref, nextTick, watch, onUnmounted, toRefs, toRaw, computed } from 'vue'
import { useRouter } from 'vue-router'
import { UserInfo } from '@/components/UserInfo'
import { useCache } from '@/hooks/web/useCache'
import { useWebSocketStore } from '@/store/modules/webSocket'
import { useToMessageStore } from '@/store/modules/toMessage'

const store = useWebSocketStore()
const messageStore = useToMessageStore()

const { push } = useRouter()
const { wsCache } = useCache()
const powerFlag = ref(false)
const webSocketStoreData: any = computed(() => store.getWebSocketData)

const toMessage = (type) => {
  messageStore.setToMessageData(type)
  push('/message')
}

const navData = reactive([
  {
    messageType: 0,
    name: '全部消息',
    messageNum: webSocketStoreData.value.length
  },
  {
    messageType: 1,
    name: '审批消息',
    messageNum: webSocketStoreData.value.filter((v) => v.messageType == 1).length
  },
  {
    messageType: 2,
    name: '待办消息',
    messageNum: webSocketStoreData.value.filter((v) => v.messageType == 2).length
  },
  {
    messageType: 3,
    name: '系统消息',
    messageNum: webSocketStoreData.value.filter((v) => v.messageType == 3).length
  }
])

watch(
  () => store.getWebSocketData.length,
  (value) => {
    // console.log(store.getWebSocketData, 9999)
    navData[0].messageNum = store.getWebSocketData.length
    navData[1].messageNum = store.getWebSocketData.filter((v) => v.messageType == 1).length
    navData[2].messageNum = store.getWebSocketData.filter((v) => v.messageType == 2).length
    navData[3].messageNum = store.getWebSocketData.filter((v) => v.messageType == 3).length
  },
  {
    immediate: true
  }
)
// console.log('ccc', wsCache.get('userInfo'))
let timer = setInterval(() => {
  console.log(1111, wsCache.get('userInfo'), 'RightHead组件')
  if (wsCache.get('userInfo')) {
    clearInterval(timer)
    if (
      wsCache.get('userInfo').roles.some((v) => v.roleKey == 'admin' || v.roleKey == 'manager') ||
      wsCache.get('userInfo').admin
    ) {
      powerFlag.value = true
    } else {
      powerFlag.value = false
    }
  }
}, 100)

// watch(
//   () => bendiUserInfo,
//   (val: any) => {
//     console.log(wsCache.get('userInfo'), 22222)
//     if (wsCache.get('userInfo')) {

//     }
//   },
//   { deep: true, immediate: true }
// )
</script>

<style scoped lang="less">
.operation {
  height: var(--top-tool-height);
  position: fixed;
  right: 0;
  display: flex;
  margin-right: 16px;
  display: flex;
  align-items: center;
  z-index: 50;

  .platform,
  .personal {
    cursor: pointer;
    width: 36px;
    height: 36px;
    border-radius: 6px;
    display: flex;
    justify-content: center;
    align-items: center;
    :deep(svg) {
      overflow: visible !important;
    }
  }

  .platform {
    margin-right: 1.92px;
    :deep(.el-icon) {
      font-size: 20px !important;
    }
  }
  .personal {
    margin-right: 9.9994px;
    :deep(.el-icon) {
      font-size: 20px !important;
    }
  }

  .platform:hover,
  .personal:hover {
    background: #e7f8ff;
  }
  .more {
    margin-right: 0 !important;
  }

  .personal {
    position: relative;
  }
  .personal:hover {
    .message-list {
      display: block;
    }
  }
  .message-list {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: Microsoft YaHei;
    font-weight: 400;
    font-size: 14px;
    color: #222222;
    line-height: 12px;
    padding: 15px 0;
    border-bottom: 1px solid #f2f2f2;
  }
  .see-all {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.bubble {
  padding: 0 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  // width: 14px;
  height: 14px;
  background: #ff5967;
  border-radius: 7px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  font-size: 10px;
  color: #ffffff;
  line-height: 80px;
}
.iconBubble {
  position: absolute;
  left: 20px;
  top: 0;
}
:deep(.message-box .el-dropdown__list) {
  overflow: hidden;
  width: 150px;
  background: #ffffff;
  box-shadow: 0px 0px 6px 0px rgba(46, 46, 46, 0.07);
  border-radius: 6px;
}
:deep(.message-box .el-dropdown-menu__item) {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}
:deep(.el-dropdown-menu) {
  padding: 0 !important;
}
</style>
