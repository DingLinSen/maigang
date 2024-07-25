<template>
  <div class="content-notice-wrap-class h-full">
    <div class="flex">
      <p
        v-for="(item, index) in props.labelArray"
        :key="index"
        :style="{
          color: props.labelArray.length > 1 && props.tabValue == item.value ? '#00A0E9' : '#333333'
        }"
        class="title-item-class relative"
        @click="tabsChange(item)"
        >{{ item.name }}
        <span
          v-if="(item.value == 'message' && messageNum) || (item.value == 'todo' && todoNum)"
          :class="
            props.labelArray.length > 1 && props.tabValue == item.value
              ? 'unread-gray-class'
              : 'unread-red-class'
          "
        >
          <!--          {{ props.contentArray.todo.length }}-->
          {{
            item.value == 'message'
              ? messageNum > 99
                ? '99+'
                : messageNum
              : todoNum > 99
              ? '99+'
              : todoNum
          }}
        </span>
      </p>
      <span style="margin: auto"> </span>
      <span
        v-if="
          (props.tabValue == 'rank' && isAuth('point:rank:more')) ||
          (props.tabValue != 'rank' && props.isMore)
        "
        class="more-text-class"
        @click="more"
        >更多
        <Icon :size="12" class="mb-[1px]" icon="ep:arrow-right-bold" style="color: #777777" />
      </span>
    </div>
    <div class="card-content mt-[0.8em] h-[25em]">
      <div class="card-class my-[0.25em] h-full">
        <div class="overflow-hidden h-full">
          <!-- 消息提醒 -->
          <div v-if="props.tabValue === 'message'" class="h-full flex items-center">
            <div class="w-full h-full">
              <ul class="ul-class">
                <li
                  v-for="(item, index) in messageList"
                  :key="index"
                  class="h-[5em] flex justify-center border-b-1 border-[#EEEEEE] flex-col cursor-pointer"
                  :class="index > messageList.length - 2 ? 'border-b-0' : 'border-b-1'"
                  @click="messageClick(item, index)"
                >
                  <div class="li-class">
                    <img :src="getImgList(item.type + `.png`)" class="w-[2.25em] h-[2.25em]" />
                    <div class="w-full grid px-[0.88em]">
                      <span class="w-full li-item-title-class">{{ item.name }}</span>
                      <span
                        class="w-full li-item-desc-class"
                        v-if="item.content && item.content.length"
                        >{{ item.content[item.content.length - 1].content }}</span
                      >
                    </div>
                    <span class="unread-red-li-class" v-if="item.content && item.content.length">{{
                      item.content.length > 99 ? '99+' : item.content.length
                    }}</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <!-- 待办事宜 -->
          <div v-else-if="props.tabValue === 'todo'" class="h-full flex items-center">
            <div class="w-full h-full">
              <ul class="ul-class">
                <li
                  v-for="(item, index) in todoList"
                  :key="index"
                  class="h-[5em] flex justify-center flex-col cursor-pointer"
                  @click="todoClick(item)"
                >
                  <div class="li-class h-full">
                    <img :src="getImgList(item.type + `.png`)" class="w-[2.25em] h-[2.25em]" />
                    <div
                      class="w-full flex px-[0.88em] border-b-1 border-[#EEEEEE] li-class h-full relative"
                      :class="index > todoList.length - 2 ? 'border-b-0' : 'border-b-1'"
                    >
                      <div class="grid w-full mr-[80px]">
                        <span class="w-full li-item-title-class">{{ item.name }}</span>
                        <p
                          v-if="item.content && item.content.length"
                          :title="item.content[item.content.length - 1].content"
                          class="w-full li-item-desc-class"
                          >{{ item.content[item.content.length - 1].content }}</p
                        >
                      </div>
                      <div class="flex li-todo-class" v-if="item.content && item.content.length">
                        <span class="li-todo-num-class">{{
                          item.content.length > 99 ? '99+' : item.content.length
                        }}</span>
                        <span>条待办 </span>
                        <Icon
                          :size="12"
                          class="mt-[3px]"
                          icon="ep:arrow-right-bold"
                          style="color: #00a0e9"
                        />
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <!-- 公告通知 -->
          <div
            v-else-if="props.tabValue === 'notice' && props.contentArray.notice.length"
            class="h-full flex items-center"
          >
            <ul class="ul-class">
              <li
                v-for="(item, index) in props.contentArray.notice"
                :key="index"
                :class="
                  index < props.contentArray.notice.length - 1
                    ? ['border-b-1', 'border-[#EEEEEE]']
                    : ''
                "
                class="h-[5em] flex justify-center flex-col cursor-pointer"
                @click="noticeClick(item)"
              >
                <div class="li-class">
                  <div class="w-full">
                    <div class="flex">
                      <span v-if="index == 0" class="latest-class"> 最新</span>
                      <p :title="item.title" class="ellipsis-line news-title-class">
                        {{ item.title || '--' }}
                      </p>
                    </div>
                    <span class="news-date-class">{{ item.updateDate || '--' }}</span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <!-- 新闻动态 -->
          <div
            v-else-if="props.tabValue === 'news' && props.contentArray.news.length"
            class="h-full flex items-center"
          >
            <ul class="ul-class">
              <li
                v-for="(item, index) in props.contentArray.news"
                :key="index"
                :class="
                  index < props.contentArray.news.length - 1
                    ? ['border-b-1', 'border-[#EEEEEE]']
                    : ''
                "
                class="h-[5em] flex justify-center flex-col cursor-pointer"
                @click="newsClick(item)"
              >
                <div class="li-class">
                  <div class="w-full">
                    <div class="flex">
                      <span v-if="index == 0" class="latest-class"> 最新</span>
                      <p :title="item.title" class="ellipsis-line news-title-class">
                        {{ item.title || '--' }}
                      </p>
                    </div>
                    <span class="news-date-class">{{ item.pubTime || '--' }}</span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <!-- 积分排行 -->
          <div v-else-if="props.tabValue === 'rank' && props.contentArray.rank" class="h-full">
            <div
              class="point-rank"
              :style="{
                height: props.contentArray.rank.loginUser ? '15.5em' : '15em'
              }"
            >
              <div class="top-2">
                <div class="user-info-wrap">
                  <p class="rank-text"> TOP 2 </p>
                  <p class="user-name">
                    {{
                      props.contentArray.rank.tops && props.contentArray.rank.tops.length > 1
                        ? props.contentArray.rank.tops[1].userName
                        : ''
                    }}
                  </p>
                  <p class="user-post">
                    {{
                      props.contentArray.rank.tops && props.contentArray.rank.tops.length > 1
                        ? props.contentArray.rank.tops[1].postName
                        : ''
                    }}
                  </p>
                  <p class="user-point">
                    {{
                      props.contentArray.rank.tops && props.contentArray.rank.tops.length > 1
                        ? props.contentArray.rank.tops[1].fraction
                        : ''
                    }}
                  </p>
                </div>
                <img
                  class="avatar-class"
                  :src="
                    props.contentArray.rank.tops && props.contentArray.rank.tops.length > 1
                      ? props.contentArray.rank.tops[1].avatar
                      : ''
                  "
                  @error="setDefaultImage"
                />
                <img class="rank-icon" src="@/assets/imgs/home/second_icon.png" />
              </div>
              <div class="top-1">
                <div class="user-info-wrap">
                  <p class="rank-text"> TOP 1 </p>
                  <p class="user-name">
                    {{
                      props.contentArray.rank.tops && props.contentArray.rank.tops.length
                        ? props.contentArray.rank.tops[0].userName
                        : ''
                    }}
                  </p>
                  <p class="user-post">
                    {{
                      props.contentArray.rank.tops && props.contentArray.rank.tops.length
                        ? props.contentArray.rank.tops[0].postName
                        : ''
                    }}
                  </p>
                  <p class="user-point">
                    {{
                      props.contentArray.rank.tops && props.contentArray.rank.tops.length
                        ? props.contentArray.rank.tops[0].fraction
                        : ''
                    }}
                  </p>
                </div>
                <img
                  class="avatar-class"
                  :src="
                    props.contentArray.rank.tops && props.contentArray.rank.tops.length
                      ? props.contentArray.rank.tops[0].avatar
                      : ''
                  "
                  @error="setDefaultImage"
                />
                <img class="rank-icon" src="@/assets/imgs/home/first_icon.png" />
              </div>
              <div class="top-3">
                <div class="user-info-wrap">
                  <p class="rank-text"> TOP 3 </p>
                  <p class="user-name">
                    {{
                      props.contentArray.rank.tops && props.contentArray.rank.tops.length > 2
                        ? props.contentArray.rank.tops[2].userName
                        : ''
                    }}
                  </p>
                  <p class="user-post">
                    {{
                      props.contentArray.rank.tops && props.contentArray.rank.tops.length > 2
                        ? props.contentArray.rank.tops[2].postName
                        : ''
                    }}
                  </p>
                  <p class="user-point">
                    {{
                      props.contentArray.rank.tops && props.contentArray.rank.tops.length > 2
                        ? props.contentArray.rank.tops[2].fraction
                        : ''
                    }}
                  </p>
                </div>
                <img
                  class="avatar-class"
                  :src="
                    props.contentArray.rank.tops && props.contentArray.rank.tops.length > 2
                      ? props.contentArray.rank.tops[2].avatar
                      : ''
                  "
                  @error="setDefaultImage"
                />
                <img class="rank-icon" src="@/assets/imgs/home/third_icon.png" />
              </div>
            </div>
            <div class="point-mine" v-if="props.contentArray.rank.loginUser">
              <span class="self-text">我</span>

              <img
                class="avatar-self-class"
                :src="
                  props.contentArray.rank.loginUser ? props.contentArray.rank.loginUser.avatar : ''
                "
                @error="setDefaultImage"
              />

              <span class="self-name-text">
                {{
                  props.contentArray.rank.loginUser.userName
                    ? props.contentArray.rank.loginUser.userName
                    : ''
                }}
              </span>

              <span class="self-post-text" :title="props.contentArray.rank.loginUser.postName">
                {{
                  props.contentArray.rank.loginUser.postName
                    ? props.contentArray.rank.loginUser.postName
                    : ''
                }}
              </span>
              <span style="margin: auto"> </span>
              <div class="rank-wrap">
                <span class="self-rank-text">
                  {{
                    props.contentArray.rank.loginUser.id
                      ? props.contentArray.rank.loginUser.id +
                        '/' +
                        props.contentArray.rank.loginUser.num
                      : ''
                  }}
                </span>

                <span class="self-rank-text">
                  {{
                    String(props.contentArray.rank.loginUser.fraction)
                      ? props.contentArray.rank.loginUser.fraction + '分'
                      : ''
                  }}
                </span>
                <span class="self-rank-text">
                  {{
                    String(props.contentArray.rank.loginUser.cash)
                      ? props.contentArray.rank.loginUser.cash + '￥'
                      : ''
                  }}
                </span></div
              >
            </div>
            <ul
              class="ul-class-sub"
              v-if="props.contentArray.rank.tops.length > 3 && !props.contentArray.rank.loginUser"
              ><li
                v-for="(item, index) in props.contentArray.rank.tops.slice(
                  3,
                  props.contentArray.rank.tops.length
                )"
                :key="index"
                :class="index > 1 ? 'border-b-0' : 'border-b-1'"
                class="h-[2.5em] flex justify-center border-b-1 border-[#EEEEEE] flex-col cursor-pointer"
              >
                <div class="li-class">
                  <!-- <img
                    v-if="index === 0"
                    src="@/assets/imgs/icon/one.png"
                    class="rank-img 2xl:w-[2.3vh] 2xl:h-[2.7vh]"
                  />
                  <img
                    v-if="index === 1"
                    src="@/assets/imgs/icon/two.png"
                    class="rank-img 2xl:w-[2.3vh] 2xl:h-[2.7vh]"
                  />
                  <img
                    v-if="index === 2"
                    src="@/assets/imgs/icon/three.png"
                    class="rank-img 2xl:w-[2.3vh] 2xl:h-[2.7vh]"
                  /> -->
                  <div class="w-[2.5em] w-[2.2em] li-class">
                    <div class="dot-div"></div> <span class="rank-num">{{ index + 4 }}</span>
                    <div class="dot-div"></div
                  ></div>
                  <div class="w-full px-[0.88em]">
                    <span class="w-full li-item-title-class-sub">{{ item.userName }}</span>
                    <span class="w-full li-item-role-class-sub" v-if="item.postName">{{
                      item.postName
                    }}</span>
                  </div>
                  <div class="flex items-center">
                    <span class="point">{{ item.fraction ? item.fraction : '0' }}</span
                    ><span class="point-unit">分</span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div
            v-else
            class="px-[1.56vw] pt-[6px] h-full overflow-scroll flex justify-center items-center"
          >
            <NoData />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'
import {
  PropType,
  computed,
  unref,
  ref,
  watch,
  provide,
  onMounted,
  nextTick,
  getCurrentInstance
} from 'vue'
import NoData from '@/views/Components/NoData.vue'
import { useEmitt } from '@/hooks/web/useEmitt'
import { useRouter } from 'vue-router'
import { Logo } from '@/components/Logo'
import router from '@/router'
import { messageReadApi } from '@/api/project/overview'
import { isAuth } from '@/utils/is' // 鉴权
import { useCache } from '@/hooks/web/useCache'

//登录人信息
const { wsCache } = useCache()
const userInfo = ref<[]>(wsCache.get('userInfo').roles)
//是否是综合部负责人或者综合部普通员工
const isSpecial = ref<boolean>(
  JSON.stringify(userInfo).indexOf('人力资源部负责人') > 0 ||
    JSON.stringify(userInfo).indexOf('综合部普通员工') > 0
)
console.log('isSpecial==>', isSpecial.value)
const { push } = useRouter()
// 获取本地图片资源
const getImgList = (url) => {
  nextTick()
  return new URL(`../../../assets/messageImg/${url}`, import.meta.url).href
}
const props = defineProps({
  isMore: propTypes.bool.def(false),
  tabValue: propTypes.string.def(''),
  labelArray: propTypes.array.def([]),
  contentArray: propTypes.object.def({}),
  height: propTypes.number.def(300)
})
const MessageData = ref<any>({})
const TodoData = ref<any>({})
const messageNum = ref<any>()
const todoNum = ref<any>()
const tabHeightStyle = computed(() => {
  return {
    height: `${props.height - 24}px`
  }
})

const messageList: any = ref([])

watch(
  props.contentArray,
  (value) => {
    messageList.value = []
    messageNum.value = 0
    let project: any = []
    let meeting: any = []
    let month: any = []
    let quest: any = []
    let leave: any = []
    let business: any = []
    let overtime: any = []
    let goOut: any = []
    let supplies: any = []
    let items: any = []
    let chapter: any = []
    let purchase: any = []
    let archives: any = []
    let expire: any = []
    let entry: any = []
    let classroom: any = []
    let feedback: any = []
    let leavePostpone: any = []
    let overtimeTask: any = []
    let settlement: any = []
    let point: any = []
    let exchange: any = []
    let empower: any = []
    let customer: any = []
    value.message.forEach((item) => {
      if (item.type == '项目管理') {
        project.push(item)
      } else if (item.type == '会议通知') {
        meeting.push(item)
      } else if (item.type == '月度考核') {
        month.push(item)
      } else if (item.type == '任务消息提醒') {
        quest.push(item)
      } else if (item.type == '请假申请') {
        leave.push(item)
      } else if (item.type == '出差申请') {
        business.push(item)
      } else if (item.type == '加班申请') {
        overtime.push(item)
      } else if (item.type == '外出申请') {
        goOut.push(item)
      } else if (item.type == '物资外借') {
        supplies.push(item)
      } else if (item.type == '物品领用') {
        items.push(item)
      } else if (item.type == '用章申请') {
        chapter.push(item)
      } else if (item.type == '采购申请') {
        purchase.push(item)
      } else if (item.type == '个人档案') {
        archives.push(item)
      } else if (item.type == '到期提醒') {
        expire.push(item)
      } else if (item.type == '入职申请') {
        entry.push(item)
      } else if (item.type == '麦港课堂考核培训') {
        classroom.push(item)
      } else if (item.type == '意见反馈') {
        feedback.push(item)
      } else if (item.type == '调休顺延申请') {
        leavePostpone.push(item)
      } else if (item.type == '加班任务') {
        overtimeTask.push(item)
      } else if (item.type == '加班结算') {
        settlement.push(item)
      } else if (item.type == '积分申报') {
        point.push(item)
      } else if (item.type == '积分兑换') {
        exchange.push(item)
      } else if (item.type == '授权申请') {
        empower.push(item)
      } else if (item.type == '客户管理') {
        customer.push(item)
      }
    })
    messageList.value.push({ name: '麦港课堂考核培训', type: 'classroom', content: classroom })
    messageList.value.push({ name: '会议通知', type: 'meeting', content: meeting })
    messageList.value.push({ name: '请假申请', type: 'leave', content: leave })
    messageList.value.push({ name: '物资外借', type: 'supplies', content: supplies })
    messageList.value.push({ name: '物品领用', type: 'items', content: items })
    messageList.value.push({ name: '月度考核', type: 'month', content: month })
    messageList.value.push({ name: '任务消息提醒', type: 'quest', content: quest })
    messageList.value.push({ name: '项目管理', type: 'project', content: project })
    if (business.length > 0) {
      messageList.value.push({ name: '出差申请', type: 'business', content: business })
    }
    if (overtime.length > 0) {
      messageList.value.push({ name: '加班申请', type: 'overtime', content: overtime })
    }
    if (goOut.length > 0) {
      messageList.value.push({ name: '外出申请', type: 'goOut', content: goOut })
    }
    if (chapter.length > 0) {
      messageList.value.push({ name: '用章申请', type: 'chapter', content: chapter })
    }
    if (purchase.length > 0) {
      messageList.value.push({ name: '采购申请', type: 'purchase', content: purchase })
    }
    if (archives.length > 0) {
      messageList.value.push({ name: '个人档案', type: 'archives', content: archives })
    }
    if (expire.length > 0) {
      messageList.value.push({ name: '到期提醒', type: 'expire', content: expire })
    }
    if (entry.length > 0) {
      messageList.value.push({ name: '入职申请', type: 'entry', content: entry })
    }
    if (feedback.length > 0) {
      messageList.value.push({ name: '意见反馈', type: 'feedback', content: feedback })
    }
    if (leavePostpone.length > 0) {
      messageList.value.push({ name: '调休顺延申请', type: 'postpone', content: leavePostpone })
    }
    if (overtimeTask.length > 0) {
      messageList.value.push({ name: '加班任务', type: 'overtimeTask', content: overtimeTask })
    }
    if (settlement.length > 0) {
      messageList.value.push({ name: '加班结算', type: 'settlement', content: settlement })
    }
    if (point.length > 0) {
      messageList.value.push({ name: '积分申报', type: 'point', content: point })
    }
    if (exchange.length > 0) {
      messageList.value.push({ name: '积分兑换', type: 'exchange', content: exchange })
    }
    if (empower.length > 0) {
      messageList.value.push({ name: '授权申请', type: 'empower', content: empower })
    }
    if (customer.length > 0) {
      messageList.value.push({ name: '客户管理', type: 'customer', content: customer })
    }
    messageList.value.sort((a: any, b: any) => {
      return b.content.length - a.content.length
    })
    if (messageList.value.length > 5) {
      let tempArray: any = []
      messageList.value.forEach((element: any) => {
        if (tempArray.length < 5 || element.content.length > 0) {
          tempArray.push(element)
        }
      })
      messageList.value = tempArray
    }
    messageList.value.forEach((element: any) => {
      messageNum.value = messageNum.value + element.content.length
    })
  },
  { immediate: true }
)

const todoList: any = ref([])
watch(
  props.contentArray,
  (value) => {
    todoList.value = []
    todoNum.value = 0
    let todoProject: any = []
    let todoMonth: any = []
    let todoQuest: any = []
    let todoLeave: any = []
    let todoBusiness: any = []
    let todoOvertime: any = []
    let todoGoOut: any = []
    let todoSupplies: any = []
    let todoItems: any = []
    let todoChapter: any = []
    let todoArchives: any = []
    let todoEntry: any = []
    let todoProcure: any = []
    let feedback: any = []
    let leavePostpone: any = []
    let overtimeTask: any = []
    let settlement: any = []
    let point: any = []
    let exchange: any = []
    let empower: any = []
    let customer: any = []
    value.todo.forEach((item) => {
      if (item.type == '项目管理') {
        todoProject.push(item)
      } else if (item.type == '月度考核') {
        todoMonth.push(item)
      } else if (item.type == '任务待办') {
        todoQuest.push(item)
      } else if (item.type == '入职申请审批') {
        todoEntry.push(item)
      } else if (item.type == '个人档案审批') {
        todoArchives.push(item)
      } else if (item.type == '用章申请') {
        todoChapter.push(item)
      } else if (item.type == '物品领用') {
        todoItems.push(item)
      } else if (item.type == '物资外借') {
        todoSupplies.push(item)
      } else if (item.type == '外出申请') {
        todoGoOut.push(item)
      } else if (item.type == '加班申请') {
        todoOvertime.push(item)
      } else if (item.type == '请假申请') {
        todoLeave.push(item)
      } else if (item.type == '出差申请') {
        todoBusiness.push(item)
      } else if (item.type == '采购申请') {
        todoProcure.push(item)
      } else if (item.type == '意见反馈审批') {
        feedback.push(item)
      } else if (item.type == '调休顺延申请') {
        leavePostpone.push(item)
      } else if (item.type == '加班任务') {
        overtimeTask.push(item)
      } else if (item.type == '加班结算') {
        settlement.push(item)
      } else if (item.type == '积分申报') {
        point.push(item)
      } else if (item.type == '积分兑换') {
        exchange.push(item)
      } else if (item.type == '授权申请') {
        empower.push(item)
      } else if (item.type == '客户管理') {
        customer.push(item)
      }
    })
    todoList.value.push({ name: '项目管理', type: 'todoProject', content: todoProject })
    todoList.value.push({ name: '请假申请', type: 'todoLeave', content: todoLeave })
    todoList.value.push({ name: '物资外借', type: 'todoSupplies', content: todoSupplies })
    todoList.value.push({ name: '物品领用', type: 'todoItems', content: todoItems })
    todoList.value.push({ name: '月度考核', type: 'todoMonth', content: todoMonth })
    if (todoQuest.length > 0) {
      todoList.value.push({ name: '任务待办', type: 'todoQuest', content: todoQuest })
    }
    if (todoEntry.length > 0) {
      todoList.value.push({ name: '入职申请审批', type: 'todoEntry', content: todoEntry })
    }
    if (todoArchives.length > 0) {
      todoList.value.push({ name: '个人档案审批', type: 'todoArchives', content: todoArchives })
    }
    if (todoChapter.length > 0) {
      todoList.value.push({ name: '用章申请', type: 'todoChapter', content: todoChapter })
    }
    if (todoGoOut.length > 0) {
      todoList.value.push({ name: '外出申请', type: 'todoGoOut', content: todoGoOut })
    }
    if (todoOvertime.length > 0) {
      todoList.value.push({ name: '加班申请', type: 'todoOvertime', content: todoOvertime })
    }
    if (todoBusiness.length > 0) {
      todoList.value.push({ name: '出差申请', type: 'todoBusiness', content: todoBusiness })
    }
    if (todoProcure.length > 0) {
      todoList.value.push({ name: '采购申请', type: 'todoProcure', content: todoProcure })
    }
    if (feedback.length > 0) {
      todoList.value.push({ name: '意见反馈审批', type: 'todoFeedback', content: feedback })
    }
    if (leavePostpone.length > 0) {
      todoList.value.push({ name: '调休顺延申请', type: 'todoPostpone', content: leavePostpone })
    }
    if (overtimeTask.length > 0) {
      todoList.value.push({ name: '加班任务', type: 'todoOvertimeTask', content: overtimeTask })
    }
    if (settlement.length > 0) {
      todoList.value.push({ name: '加班结算', type: 'todoSettlement', content: settlement })
    }
    if (point.length > 0) {
      todoList.value.push({ name: '积分申报', type: 'todoPoint', content: point })
    }
    if (exchange.length > 0) {
      todoList.value.push({ name: '积分兑换', type: 'toExchange', content: exchange })
    }
    if (empower.length > 0) {
      todoList.value.push({ name: '授权申请', type: 'todoEmpower', content: empower })
    }
    if (customer.length > 0) {
      todoList.value.push({ name: '客户管理', type: 'todoCustomer', content: customer })
    }
    todoList.value.sort((a: any, b: any) => {
      return b.content.length - a.content.length
    })
    if (todoList.value.length > 5) {
      let tempArray: any = []
      todoList.value.forEach((element: any) => {
        if (tempArray.length < 5 || element.content.length > 0) {
          tempArray.push(element)
        }
      })
      todoList.value = tempArray
    }
    todoList.value.forEach((element: any) => {
      todoNum.value = todoNum.value + element.content.length
    })
  },
  { immediate: true }
)

const emit = defineEmits(['tabsChange', 'itemClick'])

onMounted(() => {})

const more = () => {
  if (props.tabValue == 'news') {
    push({ name: 'CompanyNews' })
  } else if (props.tabValue == 'notice') {
    push({ name: 'CompanyNotice' })
  } else if (props.tabValue == 'rank') {
    push({ name: 'PointRank' })
  }
}

const tabsChange = (item: any) => {
  if (props.labelArray.length > 1) {
    emit('tabsChange', item.value)
  }
}
//消息提醒点击
const messageClick = async (item: any, index: number) => {
  if (item.content.length == 0) {
    return
  }
  if (item.name == '项目管理') {
    if (isSpecial.value) {
      readMessage(item, index, 'ProjectRemind')
    } else {
      push({
        name: 'Overview'
      })
    }
  } else if (item.name == '月度考核') {
    readMessage(item, index, 'Monthly')
  } else if (item.name == '会议通知') {
    readMessage(item, index, 'MeetingAppointment')
  } else if (item.name == '任务消息提醒') {
    readMessage(item, index, 'Task')
  } else if (item.name == '请假申请') {
    readMessage(item, index, 'MyOrder')
  } else if (item.name == '出差申请') {
    readMessage(item, index, 'MyOrder')
  } else if (item.name == '加班申请') {
    readMessage(item, index, 'MyOrder')
  } else if (item.name == '外出申请') {
    readMessage(item, index, 'MyOrder')
  } else if (item.name == '物资外借') {
    readMessage(item, index, 'MyOrder')
  } else if (item.name == '物品领用') {
    readMessage(item, index, 'MyOrder')
  } else if (item.name == '用章申请') {
    readMessage(item, index, 'MyOrder')
  } else if (item.name == '采购申请') {
    readMessage(item, index, 'MyOrder')
  } else if (item.name == '个人档案') {
    readMessage(item, index, 'Dossier')
  } else if (item.name == '到期提醒') {
    readMessage(item, index, 'ExpirationReminder')
  } else if (item.name == '入职申请') {
    readMessage(item, index, 'Induction')
  } else if (item.name == '麦港课堂考核培训') {
    readMessage(item, index, 'ClassRoom')
  } else if (item.name == '意见反馈') {
    feedbackMessageClick(item, index)
  } else if (item.name == '调休顺延申请') {
    readMessage(item, index, 'MyOrder')
  } else if (item.name == '加班任务') {
    readMessage(item, index, 'MyOrder')
  } else if (item.name == '加班结算') {
    readMessage(item, index, 'Settlement')
  } else if (item.name == '积分申报') {
    readMessage(item, index, 'PointManage')
  } else if (item.name == '积分兑换') {
    readMessage(item, index, 'ExchangeRecord')
  } else if (item.name == '授权申请') {
    readMessage(item, index, 'AuthorizeManage')
  } else if (item.name == '客户管理') {
    readMessage(item, index, 'Customer')
  }
}

const readMessage = async (item: any, index: number, routerName: string) => {
  feedbackMessageClick(item, index)
  if (routerName) {
    push({ name: routerName })
  }
}
//建议反馈的点击事件
const feedbackMessageClick = async (item: any, index: number) => {
  let arr: any = []
  item.content.forEach((item) => {
    arr.push(item.historyId)
  })
  await messageReadApi(arr)
  messageList.value.splice(index, 1)
  if (messageList.value.length < 5) {
    let message = JSON.stringify(messageList.value)
    if (message.indexOf('麦港课堂考核培训') == -1) {
      messageList.value.push({ name: '麦港课堂考核培训', type: 'classroom', content: [] })
    } else if (message.indexOf('会议通知') == -1) {
      messageList.value.push({ name: '会议通知', type: 'meeting', content: [] })
    } else if (message.indexOf('请假申请') == -1) {
      messageList.value.push({ name: '请假申请', type: 'leave', content: [] })
    } else if (message.indexOf('物资外借') == -1) {
      messageList.value.push({ name: '物资外借', type: 'supplies', content: [] })
    } else if (message.indexOf('物品领用') == -1) {
      messageList.value.push({ name: '物品领用', type: 'items', content: [] })
    }
  }
  messageNum.value = 0
  messageList.value.forEach((element: any) => {
    messageNum.value = messageNum.value + element.content.length
  })
}
//待办事宜点击
const todoClick = (item: any) => {
  if (item.content.length == 0) {
    return
  }
  if (item.name == '项目管理') {
    push({
      name: 'Overview'
    })
  } else if (item.name == '月度考核') {
    push({
      name: 'MonthlyAssessment'
    })
  } else if (item.name == '任务待办') {
    push({
      name: 'Task'
    })
  } else if (item.name == '入职申请审批') {
    push({
      name: 'EmployManage'
    })
  } else if (item.name == '麦港课堂考核培训') {
    push({
      name: 'ClassRoom'
    })
  } else if (item.name == '个人档案审批') {
    push({
      name: 'PersonalFileManage'
    })
  }
  // else if (item.name == '到期提醒') {
  //   push({
  //     name: 'ExpirationReminder'
  //   })
  // }
  else if (item.name == '用章申请') {
    push({
      name: 'OrderApprove'
    })
  } else if (item.name == '物品领用') {
    push({
      name: 'OrderApprove'
    })
  } else if (item.name == '物资外借') {
    push({
      name: 'OrderApprove'
    })
  } else if (item.name == '外出申请') {
    push({
      name: 'OrderApprove'
    })
  } else if (item.name == '加班申请') {
    push({
      name: 'OrderApprove'
    })
  } else if (item.name == '请假申请') {
    push({
      name: 'OrderApprove'
    })
  } else if (item.name == '出差申请') {
    push({
      name: 'OrderApprove'
    })
  } else if (
    item.name == '采购申请' &&
    (item.content[item.content.length - 1].content.includes('审批') ||
      item.content[item.content.length - 1].content.includes('归档'))
  ) {
    push({
      name: 'OrderApprove'
    })
  } else if (
    item.name == '采购申请' &&
    item.content[item.content.length - 1].content == '采购申请待采购'
  ) {
    push({
      name: 'MyOrder'
    })
  } else if (item.name == '意见反馈审批') {
    push({
      name: 'Feedback'
    })
  } else if (item.name == '调休顺延申请') {
    push({
      name: 'OrderApprove'
    })
  } else if (item.name == '加班任务') {
    push({
      name: 'OrderApprove'
    })
  } else if (item.name == '加班结算') {
    push({
      name: 'Settlement'
    })
  } else if (item.name == '积分申报') {
    push({
      name: 'PointManage'
    })
  } else if (item.name == '积分兑换') {
    push({
      name: 'ExchangeRecord'
    })
  } else if (item.name == '授权申请') {
    push({ name: 'AuthorizeManage' })
  } else if (item.name == '客户管理') {
    push({ name: 'Customer' })
  }
}
//公告通知点击
const noticeClick = (item: any) => {
  emit('itemClick', 'news', item)
}
//新闻动态点击
const newsClick = (item: any) => {
  emit('itemClick', 'news', item)
}

const setDefaultImage = async (e: any) => {
  const avatar = await import('@/assets/imgs/home/tx_icon.png')
  e.target.src = avatar.default
}
</script>

<style lang="less" scoped>
.content-notice-wrap-class {
  // height: 40vh;
  width: 32.8%;
}

.title-item-class {
  font-size: 16px;
  font-family: Alibaba PuHuiTi M;
  font-weight: 500;
  color: #333333;
  margin-left: 10px;
  margin-right: 20px;
  cursor: pointer;
}

.unread-red-class {
  background: #ff333a;
  height: 18px;
  position: absolute;
  font-size: 11px;
  text-align: center;
  padding-left: 6px;
  padding-right: 6px;
  font-family: Arial;
  font-weight: 400;
  color: #ffffff;
  line-height: 18px;
  border-radius: 9px;
  top: -7px;
  left: 60px;
}

.unread-gray-class {
  background: #babfc5;
  height: 18px;
  position: absolute;
  font-size: 11px;
  text-align: center;
  padding-left: 6px;
  padding-right: 6px;
  font-family: Arial;
  font-weight: 400;
  color: #ffffff;
  line-height: 18px;
  border-radius: 9px;
  top: -7px;
  left: 60px;
}

.more {
  height: 18px;
  width: 60px;
  line-height: 18px;
  font-size: 14px;
  color: #777777;
  font-family: Alibaba PuHuiTi R;
  font-weight: bold;
  cursor: pointer;
  vertical-align: middle;
}

.card-class {
  width: 100%;
  height: 100%;
  background: #ffffff;
  box-shadow: 0px 3px 4px 0px rgba(31, 31, 31, 0.2);
  border-radius: 4px;
}

.ul-class {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding-left: 20px;
  padding-right: 20px;
}

.li-class {
  display: flex;
  justify-content: center;
  align-items: center;
}

.unread-red-li-class {
  background: #ff333a;
  height: 18px;
  text-align: center;
  font-size: 11px;
  padding-left: 6px;
  padding-right: 6px;
  font-family: Arial;
  font-weight: 400;
  color: #ffffff;
  line-height: 18px;
  border-radius: 9px;
}

.li-item-title-class {
  font-size: 15px;
  font-family: Alibaba PuHuiTi M;
  font-weight: 500;
  color: #222222;
}

.li-item-desc-class {
  font-size: 14px;
  font-family: Alibaba PuHuiTi R;
  font-weight: 400;
  color: #666666;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.li-item-role-class {
  font-size: 12px;
  margin-left: 5px;
  font-family: Alibaba PuHuiTi R;
  font-weight: 400;
  padding-left: 2px;
  padding-right: 2px;
  color: #51b3e0;
  border: 1px solid #97cbe3;
  border-radius: 4px;
}

.li-todo-class {
  position: absolute;
  right: 0px;
  color: #00a0e9;
  font-size: 14px;
  font-family: Alibaba PuHuiTi R;
  font-weight: 400;
  text-decoration: underline;
}

.li-todo-num-class {
  // font-size: 16px;
  // font-family: Alibaba PuHuiTi M;
  // font-weight: 500;
  // text-decoration: underline;
  // margin-top: -3px;
}

.ellipsis-line {
  overflow: hidden;
  flex: 1;
  width: 23vw;
  display: block;
  text-overflow: ellipsis; //文本溢出显示省略号
  white-space: nowrap; //文本不会换行
}

.news-title-class {
  font-size: 14px;
  font-family: Alibaba PuHuiTi M;
  font-weight: 500;
  color: #222222;
}

.latest-class {
  width: 42px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  background: rgba(255, 82, 82, 0.15);
  font-size: 14px;
  font-family: Alibaba PuHuiTi M;
  font-weight: 500;
  color: #ff5252;
  margin-right: 5px;
  border-radius: 4px;
}

.news-date-class {
  font-size: 14px;
  font-family: Alibaba PuHuiTi R;
  font-weight: 400;
  color: #777777;
}

.more-text-class {
  display: flex;
  font-size: 14px;
  line-height: 14px;
  font-family: Alibaba PuHuiTi R;
  font-weight: 400;
  color: #777777;
  margin-right: 5px;
  margin-top: 2px;
  cursor: pointer;
  justify-content: center;
  justify-items: center;
  align-items: center;

  .el-icon {
    font-size: 12px !important;
  }
}

.rank-num {
  font-size: 15px;
  font-family: Alibaba PuHuiTi R;
  font-weight: 400;
  color: #222222;
}
.dot-div {
  width: 3px;
  height: 3px;
  background: #848586;
  border-radius: 1.5px;
  margin-left: 1px;
  margin-right: 1px;
}
.point {
  font-size: 16px;
  font-family: Alibaba PuHuiTi M;
  font-weight: 500;
  color: #ffb200;
}
.point-unit {
  font-size: 11px;
  font-family: Alibaba PuHuiTi R;
  font-weight: 400;
  color: #999999;
  text-align: center;
  margin-left: 3px;
  margin-top: 3px;
}
.point-rank {
  margin-left: 1.2vw;
  margin-right: 1.2vw;
  display: flex;
  height: 68%;
}
.point-mine {
  margin-left: 1.3vw;
  margin-right: 1.3vw;
  margin-top: 1.19em;
  height: 4.19em;
  background: #f6f6f8;
  border-radius: 0.63rem;
  display: flex;
  align-items: center;
  .self-text {
    margin-left: 5%;
    font-size: 1em;
    font-family: Alibaba PuHuiTi B;
    font-weight: 500;
    color: #222222;
  }
  .avatar-self-class {
    width: 2.5em;
    height: 2.5em;
    border-radius: 50%;
    margin-left: 2%;
    object-fit: cover;
  }
  .self-name-text {
    font-size: 1em;
    margin-left: 2%;
    font-family: Alibaba PuHuiTi B;
    font-weight: 500;
    color: #222222;
  }

  .self-post-text {
    flex: 1;
    font-size: 0.88em;
    margin-left: 2%;
    font-family: Alibaba PuHuiTi M;
    font-weight: 400;
    color: #666666;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .self-rank-text {
    font-size: 1em;
    text-align: center;
    font-family: Alibaba PuHuiTi B;
    font-weight: 500;
    color: #ffb200;
    margin-right: 1em;
  }
  .rank-wrap {
    display: flex;
    margin-right: 1%;
  }
}

.top-2 {
  flex: 1;
  margin-top: 2.7em;
  position: relative;
  .user-info-wrap {
    position: absolute;
    width: 100%;
    top: 1.31em;
    bottom: 0px;
    background: linear-gradient(180deg, #d9e5f0 0%, rgba(217, 229, 240, 0) 100%);
    border-radius: 10px;
    .rank-text {
      margin-top: 1.2em;
      width: 100%;
      text-align: center;
      font-size: 1.88em;
      font-family: Alibaba PuHuiTi H;
      font-weight: 800;
      font-style: italic;
      color: #000000;
      background: linear-gradient(180deg, #b7c5d5 0%, rgba(218, 224, 235, 0) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
}

.top-1 {
  flex: 1;
  margin-top: 1.5em;
  margin-left: 0.8vw;
  margin-right: 0.8vw;
  position: relative;
  .user-info-wrap {
    position: absolute;
    width: 100%;
    top: 1.31em;
    bottom: 0px;
    background: linear-gradient(180deg, #fff4c4 0%, rgba(253, 242, 181, 0) 100%);
    border-radius: 10px;
    .rank-text {
      margin-top: 1.2em;
      width: 100%;
      text-align: center;
      font-size: 1.88em;
      font-family: Alibaba PuHuiTi H;
      font-weight: 800;
      font-style: italic;
      color: #000000;
      background: linear-gradient(180deg, #ffdb92 0%, rgba(255, 231, 167, 0) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
}

.top-3 {
  flex: 1;
  margin-top: 2.7em;
  position: relative;
  .user-info-wrap {
    position: absolute;
    width: 100%;
    top: 1.31em;
    bottom: 0px;
    background: linear-gradient(180deg, #f6e6d0 0%, rgba(246, 231, 210, 0) 100%);
    border-radius: 10px;
    .rank-text {
      margin-top: 1.2em;
      width: 100%;
      text-align: center;
      font-size: 1.88em;
      font-family: Alibaba PuHuiTi H;
      font-weight: 800;
      font-style: italic;
      color: #000000;
      background: linear-gradient(180deg, #e5bfa3 0%, rgba(248, 218, 198, 0) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
}

.ul-class-sub {
  padding-left: 1.3vw;
  padding-right: 1.3vw;
  margin-top: 0px;
  overflow-y: auto;
}
.li-item-title-class-sub {
  font-size: 15px;
  font-family: Alibaba PuHuiTi M;
  font-weight: 500;
  color: #222222;
}
.li-item-role-class-sub {
  font-size: 12px;
  margin-left: 5px;
  font-family: Alibaba PuHuiTi R;
  font-weight: 400;
  padding-left: 2px;
  padding-right: 2px;
  color: #51b3e0;
  border: 1px solid #97cbe3;
  border-radius: 4px;
}
.avatar-class {
  position: absolute;
  width: 3.5em;
  height: 3.5em;
  border: 2px solid white;
  left: 50%;
  margin-left: -1.75em;
  border-radius: 50%;
  object-fit: cover;
}

.rank-icon {
  position: absolute;
  width: 1.5em;
  height: 1.5em;
  left: 50%;
  margin-left: 0.75em;
  top: -0.6em;
}

.user-name {
  width: 100%;
  height: 1.2em;
  line-height: 1.2em;
  margin-top: -0.3em;
  text-align: center;
  font-size: 1em;
  font-family: Alibaba PuHuiTi B;
  font-weight: 500;
  color: #222222;
  overflow: hidden; /* 确保超出容器的文本被裁剪 */
  white-space: nowrap; /* 确保文本在一行内显示 */
  text-overflow: ellipsis; /* 使用省略号表示文本溢出 */
}
.user-post {
  width: 100%;
  margin-top: 0.1em;
  height: 1.5em;
  line-height: 1.5em;
  text-align: center;
  font-size: 0.88em;
  font-family: Alibaba PuHuiTi M;
  font-weight: 400;
  color: #666666;
}

.user-point {
  width: 100%;
  height: 1.5em;
  margin-top: -0.1em;
  line-height: 1.5em;
  text-align: center;
  font-size: 1.75em;
  font-family: Impact;
  font-weight: 400;
  color: #ffb200;
}

// @media screen and (max-width: 1436px) {
//   .ul-class-sub {
//     padding-left: 1.3vw;
//     padding-right: 1.3vw;
//     margin-top: 5px;
//     overflow-y: auto;
//   }
//   .ul-class {
//     padding-left: 14px;
//     padding-right: 14px;
//   }
//   .title-item-class {
//     font-size: 14px;
//   }
//   .latest-class {
//     width: 30px;
//     height: 18px;
//     font-size: 12px;
//   }
//   .ellipsis-line {
//     font-size: 13px;
//   }
//   .news-date-class {
//     font-size: 12px;
//   }

//   .more-text-class {
//     margin-top: 0;
//     font-size: 12px;
//   }

//   .unread-gray-class,
//   .unread-red-class,
//   .unread-red-li-class {
//     font-size: 9px;
//     // width: 16px;
//     height: 14px;
//     padding: 0 3px;
//     // padding: 0px;
//     display: flex;
//     justify-content: center;
//     align-items: center;
//   }
//   .card-content {
//     height: 255px !important;
//   }
//   .li-todo-num-class {
//     font-size: 16px;
//     line-height: 20px;
//   }
//   .li-class {
//     line-height: 18px;
//     img {
//       width: 28px;
//       height: 28px;
//     }
//     .li-item-title-class {
//       font-size: 13px;
//     }
//     .li-item-desc-class,
//     .li-todo-class {
//       font-size: 12px;
//     }
//   }
//   .content-notice-wrap-class {
//     height: auto;
//   }
//   .rank-img {
//     width: 16px !important;
//     height: 20px !important;
//   }

//   .rank-num {
//     font-size: 12px;
//     font-family: Alibaba PuHuiTi R;
//     font-weight: 400;
//     color: #222222;
//   }
//   .dot-div {
//     width: 2px;
//     height: 2px;
//     background: #848586;
//     border-radius: 1px;
//     margin-left: 1.3px;
//     margin-right: 1.3px;
//   }

//   .li-item-role-class {
//     font-size: 10px;
//     margin-left: 5px;
//     font-family: Alibaba PuHuiTi R;
//     font-weight: 400;
//     padding-left: 2px;
//     padding-right: 2px;
//     color: #51b3e0;
//     border: 1px solid #97cbe3;
//     border-radius: 3px;
//   }

//   // .point {
//   //   font-size: 15px;
//   //   font-family: Alibaba PuHuiTi M;
//   //   font-weight: 500;
//   //   color: #ffb200;
//   // }
//   // .point-unit {
//   //   font-size: 9px;
//   //   font-family: Alibaba PuHuiTi R;
//   //   font-weight: 400;
//   //   color: #999999;
//   //   margin-left: 2px;
//   //   margin-top: 1px;
//   // }
//   // .top-1 {
//   //   margin-top: 5px;
//   // }
//   // .top-2 {
//   //   margin-top: 3.2%;
//   // }
//   // .top-3 {
//   //   margin-top: 3.2%;
//   // }
//   .top-2 {
//     flex: 1;
//     margin-top: 3.2%;
//     position: relative;
//     .user-info-wrap {
//       position: absolute;
//       width: 100%;
//       top: 2.2vh;
//       bottom: 0px;
//       background: linear-gradient(180deg, #d9e5f0 0%, rgba(217, 229, 240, 0) 100%);
//       border-radius: 10px;
//       .rank-text {
//         margin-top: 3.7vh;
//         width: 100%;
//         text-align: center;
//         font-size: 2.3vh;
//         line-height: 2.6vh;
//         font-family: Alibaba PuHuiTi H;
//         font-weight: 800;
//         font-style: italic;
//         color: #000000;
//         background: linear-gradient(180deg, #b7c5d5 0%, rgba(218, 224, 235, 0) 100%);
//         -webkit-background-clip: text;
//         -webkit-text-fill-color: transparent;
//       }
//     }
//   }

//   .top-1 {
//     flex: 1;
//     margin-top: 5px;
//     margin-left: 0.8vw;
//     margin-right: 0.8vw;
//     position: relative;
//     .user-info-wrap {
//       position: absolute;
//       width: 100%;
//       top: 2vh;
//       bottom: 0px;
//       background: linear-gradient(180deg, #fff4c4 0%, rgba(253, 242, 181, 0) 100%);
//       border-radius: 10px;
//       .rank-text {
//         margin-top: 3.7vh;
//         width: 100%;
//         text-align: center;
//         font-size: 2.3vh;
//         line-height: 2.6vh;
//         font-family: Alibaba PuHuiTi H;
//         font-weight: 800;
//         font-style: italic;
//         color: #000000;
//         background: linear-gradient(180deg, #ffdb92 0%, rgba(255, 231, 167, 0) 100%);
//         -webkit-background-clip: text;
//         -webkit-text-fill-color: transparent;
//       }
//     }
//   }

//   .top-3 {
//     flex: 1;
//     margin-top: 3.2%;
//     position: relative;
//     .user-info-wrap {
//       position: absolute;
//       width: 100%;
//       top: 2vh;
//       bottom: 0px;
//       background: linear-gradient(180deg, #f6e6d0 0%, rgba(246, 231, 210, 0) 100%);
//       border-radius: 10px;
//       .rank-text {
//         margin-top: 3.7vh;
//         width: 100%;
//         text-align: center;
//         font-size: 2.3vh;
//         line-height: 2.6vh;
//         font-family: Alibaba PuHuiTi H;
//         font-weight: 800;
//         font-style: italic;
//         color: #000000;
//         background: linear-gradient(180deg, #e5bfa3 0%, rgba(248, 218, 198, 0) 100%);
//         -webkit-background-clip: text;
//         -webkit-text-fill-color: transparent;
//       }
//     }
//   }

//   .point-mine {
//     margin-left: 1.3vw;
//     margin-right: 1.3vw;
//     margin-top: 2vh;
//     height: 19%;
//     background: #f6f6f8;
//     border-radius: 10px;
//     display: flex;
//     align-items: center;
//     .self-text {
//       margin-left: 3%;
//       font-size: 1.8vh;
//       font-family: Alibaba PuHuiTi B;
//       font-weight: 500;
//       color: #222222;
//     }
//     .avatar-self-class {
//       width: 4vh;
//       height: 4vh;
//       border-radius: 50%;
//       margin-left: 2%;
//     }
//     .self-name-text {
//       font-size: 1.8vh;
//       margin-left: 2%;
//       font-family: Alibaba PuHuiTi B;
//       font-weight: 500;
//       color: #222222;
//     }

//     .self-post-text {
//       // width: 25%;
//       flex: 1;
//       font-size: 1.6vh;
//       margin-left: 2%;
//       font-family: Alibaba PuHuiTi M;
//       font-weight: 400;
//       color: #666666;
//       white-space: nowrap; /* 不换行 */
//       overflow: hidden; /* 超出部分隐藏 */
//       text-overflow: ellipsis;
//     }

//     .self-rank-text {
//       font-size: 1.8vh;
//       flex: 1;
//       text-align: center;
//       font-family: Alibaba PuHuiTi B;
//       font-weight: 500;
//       color: #ffb200;
//     }

//     .rank-wrap {
//       display: flex;
//       // width: 37%;
//       // margin-right: 3%;
//     }
//   }
// }
</style>
