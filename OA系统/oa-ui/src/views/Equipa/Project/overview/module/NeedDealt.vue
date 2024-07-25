<template>
  <ContentBox class="w-[32.94vw] overflow-hidden">
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center h-full nav">
          <p
            class="tab relative"
            v-for="(item, index) in selectTab"
            :key="index"
            @click="selectChange(item)"
            :class="item.type === tabType ? 'active' : ''"
            >{{ item.label }}
            <!-- :class="item.type === tabType ? 'bg-[#BABFC5]' : 'bg-[#FF333A]'" -->
            <span
              v-if="item.unread > 0"
              class="text-xs bg-[#FF333A] absolute top-5px right-[-12px] rounded-full min-w-16px p-1 h-16px text-[#fff] flex items-center justify-center"
              >{{ item.unread > 99 ? '99+' : item.unread }}</span
            >
          </p>
        </div>
        <div @click="more" class="text-sm text-[#666666] mr-[1.8vw] cursor-pointer">
          更多
          <span>></span>
        </div>
      </div>
    </template>
    <template #content>
      <div>
        <ul
          v-if="tabType === 1 && waitListData.length"
          class="2xl:px-[1.56vw] px-[14px] pt-[6px] 2xl:h-[336px] h-246px overflow-scroll"
        >
          <li
            class="2xl:h-[75px] h-[58px] border-b-1 border-[#EEEEEE] flex justify-center flex-col cursor-pointer"
            v-for="(item, index) in waitListData"
            :key="index"
            @click="backlogReadClick(item)"
          >
            <div class="flex 2xl:2xl:mb-4px mb-1px mb-1px items-center">
              <p
                class="progress-tag 2xl:h-[21px] h-18px 2xl:leading-[21px] leading-[18px] 2xl:px-[0.26vw] px-5px text-center 2xl:text-sm text-12px rounded-sm overflow-hidden truncate"
                >{{ item.noticeType }}</p
              >
              <p class="2xl:text-base text-13px ml-[0.26vw]">
                <span
                  :title="item.content"
                  class="text-[#222] block overflow-hidden w-[22vw] truncate"
                  >{{ item.content }}</span
                >
                <!-- <span class="text-[#666]">回款时间已过，请注意时间节点</span> -->
              </p>
            </div>
            <div class="text-[#838891]">
              <!-- <span class="mr-[0.99vw]"
                >状态：{{
                  item.phase == 1
                    ? '培育'
                    : item.phase == 2
                    ? '立项'
                    : item.phase == 3
                    ? '实施'
                    : item.phase == 4
                    ? '售后'
                    : '--'
                }}审批</span
              > -->
              <span class="2xl:text-14px text-12px"
                >创建时间 {{ item.createTime ? item.createTime : '--' }}</span
              >
            </div>
          </li>
          <!-- <li class="h-[75px] border-b-1 border-[#EEEEEE] flex justify-center flex-col">
            <div class="flex 2xl:mb-4px mb-1px items-center">
              <p class="sales-tag h-[21px] leading-[21px] px-[0.26vw] text-center text-sm rounded-sm"
                >售后提醒</p
              >
              <p class="text-base ml-[0.26vw]">
                <span class="text-[#222]">平阴县农业农村大数据平台项目</span>
                <span class="text-[#666]">回款时间已过，请注意时间节点</span>
              </p>
            </div>
            <div class="text-[#838891]">
              <span class="mr-[0.99vw]">状态：项目结束审批中</span>
              <span>创建时间 07-12 16:41:22</span>
            </div>
          </li>
          <li class="h-[75px] border-b-1 border-[#EEEEEE] flex justify-center flex-col">
            <div class="flex 2xl:mb-4px mb-1px items-center">
              <p
                class="collection-tag h-[21px] leading-[21px] px-[0.26vw] text-center text-sm rounded-sm"
                >回款督促</p
              >
              <p class="text-base ml-[0.26vw]">
                <span class="text-[#222]">平阴县农业农村大数据平台项目</span>
                <span class="text-[#666]">回款时间已过，请注意时间节点</span>
              </p>
            </div>
            <div class="text-[#838891]">
              <span class="mr-[0.99vw]">状态：项目结束审批中</span>
              <span>创建时间 07-12 16:41:22</span>
            </div>
          </li> -->
        </ul>
        <ul
          v-else-if="tabType === 2 && messageReminderData.length"
          class="2xl:px-[1.56vw] px-[14px] pt-[6px] 2xl:h-[336px] h-246px overflow-scroll"
        >
          <li
            class="2xl:h-[75px] h-[58px] border-b-1 border-[#EEEEEE] flex justify-center flex-col cursor-pointer"
            v-for="(item, index) in messageReminderData"
            :key="index"
            @click="messageRead(item.historyId, index, item)"
          >
            <div class="flex 2xl:mb-4px mb-1px items-center">
              <p
                :class="
                  item.noticeFlag == 1
                    ? 'progress-tag'
                    : item.noticeFlag == 2
                    ? 'sales-tag'
                    : item.noticeFlag == 3
                    ? 'collection-tag'
                    : ''
                "
                class="progress-tag 2xl:h-[21px] h-18px 2xl:leading-[21px] leading-[18px] 2xl:px-[0.26vw] px-5px text-center 2xl:text-sm text-12px rounded-sm overflow-hidden truncate"
              >
                {{ item.noticeType }}
                <!--                {{-->
                <!--                  item.noticeFlag == 1-->
                <!--                    ? '进展提醒'-->
                <!--                    : item.noticeFlag == 2-->
                <!--                    ? item.phase == 1-->
                <!--                      ? '培育消息'-->
                <!--                      : item.phase == 2-->
                <!--                      ? '立项消息'-->
                <!--                      : item.phase == 3-->
                <!--                      ? '实施消息'-->
                <!--                      : item.phase == 4-->
                <!--                      ? '售后消息'-->
                <!--                      : item.phase == 5-->
                <!--                      ? '自研消息'-->
                <!--                      : '&#45;&#45;'-->
                <!--                    : item.noticeFlag == 3-->
                <!--                    ? '回款督促'-->
                <!--                    : '&#45;&#45;'-->
                <!--                }}-->
              </p>
              <p class="2xl:text-base text-13px ml-[0.26vw]">
                <span
                  :title="item.content"
                  class="text-[#222] block overflow-hidden w-[22vw] truncate"
                  >{{ item.content }}</span
                >
                <!-- <span class="text-[#666]">回款时间已过，请注意时间节点</span> -->
              </p>
            </div>
            <div class="text-[#838891]">
              <!-- <span class="mr-[0.99vw]"
                >状态：{{
                  item.phase == 1
                    ? '培育'
                    : item.phase == 2
                    ? '立项'
                    : item.phase == 3
                    ? '实施'
                    : item.phase == 4
                    ? '售后'
                    : '--'
                }}审批</span
              > -->
              <span class="2xl:text-14px text-12px"
                >创建时间 {{ item.createTime ? item.createTime : '--' }}</span
              >
            </div>
          </li>
        </ul>
        <ul
          v-else-if="tabType === 3 && itemFileListData.length"
          class="2xl:px-[1.56vw] px-[14px] pt-[6px] 2xl:h-[336px] h-246px overflow-scroll"
        >
          <li
            class="2xl:h-[75px] h-[58px] border-b-1 border-[#EEEEEE] flex justify-center flex-col"
            v-for="(item, index) in itemFileListData"
            :key="index"
          >
            <div class="flex 2xl:mb-4px mb-1px items-center">
              <p
                class="bg-[#FFE7E8] 2xl:h-[21px] h-18px 2xl:leading-[21px] leading-[18px] px-[0.26vw] text-center text-[#FF565C] 2xl:text-sm text-12px rounded-sm"
                >项目文件</p
              >
              <p
                class="2xl:text-base text-13px ml-[0.26vw] flex-1 overflow-hidden flex justify-between"
              >
                <span
                  :title="item.projectTitle"
                  class="text-[#222] font-blod block overflow-hidden w-[23vw] truncate"
                  >{{ item.projectTitle }}</span
                >
                <span
                  class="text-blue-500 2xl:text-sm text-12px flex-1 cursor-pointer"
                  @click="
                    downloadFile(
                      item.filePath,
                      /\/([^/]+)$/.exec(item.filePath)[0].replace('/', '')
                    )
                  "
                  >下载</span
                >
              </p>
            </div>
            <div class="text-[#838891]">
              <span class="mr-[0.99vw] 2xl:text-14px text-12px"
                >创建人 {{ item.createByName ? item.createByName : '--' }}</span
              >
              <span class="2xl:text-14px text-12px"
                >创建时间 {{ item.createTime ? item.createTime : '--' }}</span
              >
            </div>
          </li>
        </ul>
        <div
          class="2xl:px-[1.56vw] px-[14px] pt-[6px] 2xl:h-[336px] h-246px overflow-scroll flex justify-center items-center"
          v-else
        >
          <NoData />
        </div>
      </div>
      <!--    待办事宜  -->
      <WaitList ref="waitListRef" />
      <!--    消息提醒  -->
      <MessageReminder ref="messageReminderRef" @all-read="allRead" />
      <!--    项目文件  -->
      <ItemFileList ref="itemFileListRef" />
    </template>
  </ContentBox>
</template>

<script setup lang="ts">
import getAssetsFile from '@/utils/pubUse'
import { ref, inject, watch } from 'vue'
import { downloadFile } from '@/utils/index'
import { ContentBox } from '../components'
import NoData from '@/views/Components/NoData.vue'
import WaitList from '../list/WaitList.vue'
import MessageReminder from '../list/MessageReminder.vue'
import ItemFileList from '../list/ItemFileList.vue'
import { filesApi, backlogReadApi, readApi } from '@/api/project/overview'
import { useRouter } from 'vue-router'
import { useWebSocketStore } from '@/store/modules/webSocket'

const props = defineProps({
  messageData: { type: Array, default: [] }
})

const { push } = useRouter()
const waitListRef = ref()
const messageReminderRef = ref()
const itemFileListRef = ref()

const tabType = ref(1)
const waitListData = ref<any>([])
const messageReminderData = ref<any>([])
const itemFileListData = ref<any>([])

const store = useWebSocketStore()
// const messageData: any = inject('messageData')
const selectTab = ref([
  {
    type: 1,
    label: '待办事宜',
    valye: 10,
    unread: 0
  },
  {
    type: 2,
    label: '消息提醒',
    valye: 20,
    unread: 0
  },
  {
    type: 3,
    label: '项目文件',
    valye: 12,
    unread: 0
  }
])

const allRead = () => {
  messageData.value = []
  messageReminderData.value = messageData.value.filter((v) => {
    return v.flag === '1'
  })
  selectTab.value[1].unread = messageReminderData.value.length
}

// 去重
const uniqueArrayObjects = (arr, prop) => {
  const uniqueSet = new Set()
  const uniqueArr = Array.from(arr).filter((item) => {
    const propValue = item[prop]
    if (!uniqueSet.has(propValue)) {
      uniqueSet.add(propValue)
      return true
    }
    return false
  })
  return uniqueArr
}

watch(
  () => props.messageData.length,
  (value) => {
    messageReminderData.value = props.messageData.filter((v) => {
      return v.flag === '1'
    })

    selectTab.value[1].unread = messageReminderData.value.length
    waitListData.value = props.messageData.filter((v) => {
      return v.flag === '2'
    })

    waitListData.value = uniqueArrayObjects(waitListData.value, 'pid')
    selectTab.value[0].unread = waitListData.value.length

    // let link: any = document.querySelector('link[rel*="icon"]') || document.createElement('link')
    // link.type = 'image/x-icon'
    // link.rel = 'shortcut icon'

    // let publicSrc =
    //   'ico/' + (waitListData.value.length < 11 ? waitListData.value.length : 11) + '.ico'
    // link.href = getAssetsFile(publicSrc)
  },
  { immediate: true }
)
const init = async () => {
  let res = await filesApi()
  if (res && res.rows) {
    itemFileListData.value = res.rows
  }
}

init()

//代办
const backlogReadClick = async (info) => {
  if (info.phase == 1) {
    push({ name: 'Cultivate', query: { pid: info.pid } })
  } else if (info.phase == 2) {
    push({ name: 'Implement', query: { pid: info.pid } })
  } else if (info.phase == 3) {
    let type = ''
    if (info.content) {
      type = info.content.indexOf('补充', info.content.length - '补充'.length) !== -1 ? '1' : '0'
    }
    push({ name: 'Ssxm', query: { pid: info.pid, status: info.status, type: type } })
  } else if (info.phase == 4) {
    push({ name: 'AfterSales', query: { pid: info.pid, status: info.status } })
  } else if (info.phase == 5) {
    push({ name: 'Scientific', query: { pid: info.pid } })
  }
  // push({ path: '' })
  // let res = await backlogReadApi({ pid: info.pid })
}
// 消息
const messageRead = async (messageId, index, info) => {
  if (info.phase == 1) {
    push({ name: 'Cultivate', query: { messagepid: info.pid } })
  } else if (info.phase == 2) {
    push({ name: 'Implement', query: { messagepid: info.pid } })
  } else if (info.phase == 3) {
    let type = ''
    if (info.content) {
      type = info.content.indexOf('补充', info.content.length - '补充'.length) !== -1 ? '1' : '0'
    }
    push({ name: 'Ssxm', query: { pid: info.pid, status: info.status, type: type } })
  } else if (info.phase == 4) {
    push({ name: 'AfterSales', query: { messagepid: info.pid, status: info.status } })
  } else if (info.phase == 5) {
    push({ name: 'Scientific', query: { messagepid: info.pid } })
  }
  let res = await readApi({ messageId: messageId })
  if (res) {
    // messageReminderData.value.splice(index, '1')
    // selectTab.value[1].unread = messageReminderData.value.length
  }
}

// tab
const selectChange = (e) => {
  tabType.value = e.type
}

const more = () => {
  if (tabType.value == 1) {
    //待办事宜
    waitListRef.value.openDrawer()
  } else if (tabType.value == 2) {
    //消息提醒
    messageReminderRef.value.openDrawer()
  } else if (tabType.value == 3) {
    //项目文件
    itemFileListRef.value.openDrawer()
  }
}
</script>

<style lang="less" scoped>
.nav p {
  font-size: 16px;
  margin: 0 13px;
  padding: 0 5px;
  font-family: Alibaba PuHuiTi M;
  font-weight: 400;
  color: #333333;
  cursor: pointer;
}

.nav .active {
  border-bottom: 2px solid #00a0e9;
}

ul li {
  &:last-child {
    border: 0;
  }
}

// 进展提醒
.progress-tag {
  background: #fff0eb;
  color: #ff6b3b;
}

// 回款督促
.collection-tag {
  background: #ffe7e8;
  color: #ff565c;
}

// 售后消息
.sales-tag {
  background: #dbf0fd;
  color: #00a0e9;
}

@media screen and (max-width: 1536px) {
  .nav p {
    font-size: 14px !important;
    margin: 0 5px;
    padding: 0 12px;
  }
}
</style>
