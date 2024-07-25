<script lang="tsx">
import CryptoJS from 'crypto-js'
import { defineComponent, computed, ref, watch } from 'vue'
import { Collapse } from '@/components/Collapse'
import { LocaleDropdown } from '@/components/LocaleDropdown'
import { SizeDropdown } from '@/components/SizeDropdown'
import { UserInfo } from '@/components/UserInfo'
import { RightHead } from '@/components/RightHead'
import { Screenfull } from '@/components/Screenfull'
import { Version } from '@/components/Version'
import { Breadcrumb } from '@/components/Breadcrumb'
import { useAppStore } from '@/store/modules/app'
import { useDesign } from '@/hooks/web/useDesign'
import router from '@/router'
import { Menu } from '@/components/Menu'
import { useCache } from '@/hooks/web/useCache'
import { useRoute } from 'vue-router'
import { Base64 } from 'js-base64'
import { ElMessage } from 'element-plus'

const route = useRoute()
const searchValue = ref<any>()
const { wsCache } = useCache()
const powerFlag = ref(false)
console.log(wsCache.get('userInfo'), 999)
if (wsCache.get('userInfo')) {
  if (
    wsCache.get('userInfo').roles.some((v) => v.roleKey == 'admin' || v.roleKey == 'manager') ||
    wsCache.get('userInfo').admin
  ) {
    powerFlag.value = true
  } else {
    powerFlag.value = false
  }
}
const { getPrefixCls, variables } = useDesign()
const prefixCls = getPrefixCls('tool-header')
const appStore = useAppStore()
console.log(powerFlag.value, 8888)
// 面包屑
const breadcrumb = computed(() => appStore.getBreadcrumb)
// 折叠图标
const hamburger = computed(() => appStore.getHamburger)
// 全屏图标
const screenfull = computed(() => appStore.getScreenfull)
// 尺寸图标
const size = computed(() => appStore.getSize)
// 布局
const layout = computed(() => appStore.getLayout)
// 多语言图标
const locale = computed(() => appStore.getLocale)
export default defineComponent({
  name: 'ToolHeader',
  setup() {
    watch(
      () => route,
      () => {
        searchValue.value = ''
      },
      { immediate: true, deep: true }
    )
    return () => (
      <div
        id={`${variables.namespace}-tool-header`}
        class={[
          prefixCls,
          'h-[var(--top-tool-smal-screen-height)] 2xl:h-[var(--top-tool-height)] relative px-[var(--top-tool-p-x)] flex items-center justify-between',
          'dark:bg-[var(--el-bg-color)]'
        ]}
      >
        {layout.value !== 'top' ? (
          <div class="h-full flex items-center top_search">
            <el-input
              placeholder="请输入搜索关键词"
              class="layout-select"
              vModel={searchValue.value}
              onKeyup={(event: KeyboardEvent) => {
                if (event.key === 'Enter') {
                  handleSearch()
                }
              }}
            />
            <Icon icon="svg-icon:search_icon" class="search_icon" />{' '}
            {hamburger.value && layout.value !== 'cutMenu' ? <div></div> : undefined}
          </div>
        ) : undefined}
        <div class="h-full flex items-center">
          {/* {screenfull.value ? (
            <Screenfull class="hover-trigger" color="var(--top-header-text-color)"></Screenfull>
          ) : undefined} */}{' '}
          {size.value ? null : undefined} {locale.value ? null : undefined}{' '}
          {/* { {powerFlag.value ? (
            <p onClick={linkTo} class="mr-3 flex items-center justify-center">
              <Icon
                icon="svg-icon:set_icon"
                class="mr-8px"
                size="20"
                style="cursor: pointer;color:#fff;"
              />
            </p>
          ) : undefined}
          <p onClick={linkToGr} class="mr-1 flex items-center justify-center">
            <Icon
              icon="svg-icon:notice_icon"
              class="mr-8px"
              size="20"
              syle="cursor: pointer;color:#fff;"
            />
          </p>
          <UserInfo class="hover-trigger"></UserInfo>} */}{' '}
          <RightHead />
        </div>
      </div>
    )
  }
})
const handleSearch = () => {
  if (!searchValue.value) {
    ElMessage.warning('请输入关键词')
    return
  } else if (
    searchValue.value &&
    searchValue.value.length > 0 &&
    searchValue.value.indexOf(' ') !== -1 &&
    String(searchValue.value).trim() === ''
  ) {
    ElMessage.warning('不能输入纯空格')
  } else {
    const { href } = router.resolve({
      path: `/Search/searchResult/${encodeURIComponent(
        CryptoJS.AES.encrypt(searchValue.value, '888888').toString()
      ).replaceAll('%', '*')}`
    })
    window.open(href, '_blank')
  }
}
const linkTo = (path) => {
  let routeUrl = router.resolve({
    path: '/Tag'
  })
  window.open(routeUrl.href, '_self')
}
const linkToGr = (path) => {
  let routeUrl = router.resolve({
    path: '/message'
  })
  window.open(routeUrl.href, '_self')
}
</script>
<style lang="less" scoped>
@prefix-cls: ~'@{namespace}-tool-header';
.@{prefix-cls} {
  transition: left var(--transition-time-02);
}
:deep(.input-select .el-input__wrapper input::placeholder) {
  font-family: Microsoft YaHei;
  font-weight: 400;
  font-size: 14px;
  color: #999999;
  line-height: 80px;
}
:deep(.layout-select) {
  width: 401px;
  height: 38px;
  // background: #f1f2f4;
  border-radius: 6px;
  .el-input__wrapper {
    box-shadow: none;
    border: 1px solid #f1f2f4 !important;
    background: #f1f2f4;
    border-radius: 6px;
    background: #f1f2f4;
  }
  .el-input__wrapper:hover {
    background: #f1f2f4;
    border-radius: 6px;
    border: 1px solid #00a0e9 !important;
  }
  .el-input__inner {
    border: 0 !important;
    padding-left: 25px;
  }
}
.layout-select-isleft {
  margin-left: 22px;
}
.top_search {
  position: relative;
  // padding-left: 15px;
}
:deep(.el-icon) {
  font-size: 14px !important;
}
.search_icon {
  position: absolute;
  left: 14px;
  top: 50%;
  z-index: 1;
  transform: translateY(-50%);
}
</style>
