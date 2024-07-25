<script lang="tsx">
import { defineComponent, computed, onMounted, onUnmounted, ref, nextTick, watch } from 'vue'
// import { Icon } from 'element-plus'
import { Collapse } from '@/components/Collapse'
// import { LocaleDropdown } from '@/components/LocaleDropdown'
// import { SizeDropdown } from '@/components/SizeDropdown'
// import { Menu } from '@/components/Menu'
import { Breadcrumb } from '@/components/Breadcrumb'
import { UserInfo } from '@/components/UserInfo'
import { useAppStore } from '@/store/modules/app'
import { useDesign } from '@/hooks/web/useDesign'
import { useCache } from '@/hooks/web/useCache'
// import router from '@/router'
import Socket from '@/socket/index'

// const PATH_URL =
//   window.location.hostname === 'localhost'
//     ? import.meta.env.VITE_WS_BASE_URL
//     : `ws://${window.location.host}/api` || import.meta.env.VITE_WS_BASE_URL
const { wsCache } = useCache()
const { getPrefixCls, variables } = useDesign()

const prefixCls = getPrefixCls('tool-header')

const appStore = useAppStore()

// 面包屑
const breadcrumb = computed(() => appStore.getBreadcrumb)

// 折叠图标
const hamburger = computed(() => appStore.getHamburger)

// 全屏图标
const screenfull = computed(() => appStore.getScreenfull)

// 尺寸图标
// const size = computed(() => appStore.getSize)

// 布局
const layout = computed(() => appStore.getLayout)

// 多语言图标
// const locale = computed(() => appStore.getLocale)
// const linkTo = () => {
//   router.push('/VideoLargeScreen')
// }
let userInfo = wsCache.get(appStore.getUserInfo)

const isShowNotice = ref(false)
const content = ref('')
const openCallback = (_: any) => {}

const nickName = computed(() => appStore.getUserNickName)

const messageCallback = (res: any) => {
  const data = res ? JSON.parse(res) : { content: '1,', batchId: '' }
  content.value = data.content
  isShowNotice.value = true
}
const closeCallback = (_: any) => {
  // console.log('closeCallback==>', res)
}
const errorCallback = (res: any) => {
  // console.log('errorCallback==>', res)
}

// const socketParams = {
//   url: PATH_URL + `/message-center/ws/oa?Authorization=${wsCache.get('Admin-Token')}`,
//   reconnectLimit: 6,
//   isInReconnect: true,
//   openCallback: openCallback,
//   messageCallback: messageCallback,
//   closeCallback: closeCallback,
//   errorCallback: errorCallback
// }

// let socket = new Socket(socketParams)
// watch(
//   () => nickName.value,
//   (_: string) => {
//     userInfo = wsCache.get(appStore.getUserInfo)
//     nextTick(() => {
//       let token = wsCache.get('Admin-Token')
//       if (token) {
//         socketParams.url = PATH_URL + `/message-center/ws/oa?Authorization=${token}`
//         if (!socket || !socket.webSocket) {
//           socket = new Socket(socketParams)
//         }
//       }
//     })
//   },
//   {
//     immediate: true
//   }
// )

// onUnmounted(() => {
//   if (socket) {
//     socket.close()
//   }
// })

export default defineComponent({
  name: 'ToolHeader',
  setup() {
    return () => (
      <div
        id={`${variables.namespace}-tool-header`}
        class={[
          prefixCls,
          'h-[var(--top-tool-height)] relative px-[var(--top-tool-p-x)] flex items-center justify-between',
          'dark:bg-[var(--el-bg-color)]'
        ]}
      >
        {layout.value !== 'top' ? (
          <div class="h-full flex items-center">
            {hamburger.value && layout.value !== 'cutMenu' ? (
              <Collapse class="hover-trigger" color="var(--top-header-text-color)"></Collapse>
            ) : undefined}
            {breadcrumb.value ? <Breadcrumb class="<md:hidden"></Breadcrumb> : undefined}
          </div>
        ) : undefined}
        <div class="h-full flex items-center">
          <UserInfo class="hover-trigger"></UserInfo>
        </div>
      </div>

      // {size.value ? (
      //   <SizeDropdown class="hover-trigger" color="var(--top-header-text-color)"></SizeDropdown>
      // ) : undefined}
      // {locale.value ? (
      //   <LocaleDropdown
      //     class="hover-trigger"
      //     color="var(--top-header-text-color)"
      //   ></LocaleDropdown>
      // ) : undefined}
    )
  }
})
</script>

<style lang="less" scoped>
@prefix-cls: ~'@{namespace}-tool-header';

.@{prefix-cls} {
  transition: left var(--transition-time-02);
}
</style>
