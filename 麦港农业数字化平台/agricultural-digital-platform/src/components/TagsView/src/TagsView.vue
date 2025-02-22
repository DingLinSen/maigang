<script setup lang="ts">
// 关于导航栏进行修改，
import { onMounted, watch, computed, unref, ref, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import type { RouteLocationNormalizedLoaded, RouterLinkProps } from 'vue-router'
import { usePermissionStore } from '@/store/modules/permission'
import { useTagsViewStore } from '@/store/modules/tagsView'
import { useAppStore } from '@/store/modules/app'
import { useI18n } from '@/hooks/web/useI18n'
import { filterAffixTags } from './helper'
import { ContextMenu, ContextMenuExpose } from '@/components/ContextMenu'
import { useDesign } from '@/hooks/web/useDesign'
import { useTemplateRefsList } from '@vueuse/core'
import { ElScrollbar } from 'element-plus'
import { useScrollTo } from '@/hooks/event/useScrollTo'

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('tags-view')

const { t } = useI18n()

const { currentRoute, push, replace } = useRouter()

const windowWidth = ref(window.innerWidth)

const isCheckPage = ref(false)

const permissionStore = usePermissionStore()

const routers = computed(() => permissionStore.getRouters)

const tagsViewStore = useTagsViewStore()

const visitedViews = computed(() => tagsViewStore.getVisitedViews)

const affixTagArr = ref<RouteLocationNormalizedLoaded[]>([])

const appStore = useAppStore()
const oldWeidth = ref(0) // 记录没有切换按钮前的宽度，用来切换按钮隐藏时做为对比数据
const tagsViewIcon = computed(() => appStore.getTagsViewIcon)
const oneIsCheck = ref(false)
// 初始化tag
const initTags = () => {
  affixTagArr.value = filterAffixTags(unref(routers))
  for (const tag of unref(affixTagArr)) {
    // Must have tag name
    if (tag.name) {
      tagsViewStore.addVisitedView(tag)
    }
  }
}

const selectedTag = ref<RouteLocationNormalizedLoaded>()

// 新增tag
const addTags = () => {
  const { name } = unref(currentRoute)
  if (name) {
    selectedTag.value = unref(currentRoute)
    tagsViewStore.addView(unref(currentRoute))
  }
  return false
}

// 关闭选中的tag
const closeSelectedTag = (view: RouteLocationNormalizedLoaded) => {
  if (view?.meta?.affix) return
  tagsViewStore.delView(view)
  if (isActive(view)) {
    toLastView()
  }
}

// 关闭全部
const closeAllTags = () => {
  tagsViewStore.delAllViews()
  toLastView()
}

// 关闭其他
const closeOthersTags = () => {
  tagsViewStore.delOthersViews(unref(selectedTag) as RouteLocationNormalizedLoaded)
}

// 重新加载
const refreshSelectedTag = async (view?: RouteLocationNormalizedLoaded) => {
  if (!view) return
  tagsViewStore.delCachedView()
  const { path, query } = view
  await nextTick()
  replace({
    path: '/redirect' + path,
    query: query
  })
}

// 关闭左侧
const closeLeftTags = () => {
  tagsViewStore.delLeftViews(unref(selectedTag) as RouteLocationNormalizedLoaded)
}

// 关闭右侧
const closeRightTags = () => {
  tagsViewStore.delRightViews(unref(selectedTag) as RouteLocationNormalizedLoaded)
}

// 跳转到最后一个
const toLastView = () => {
  const visitedViews = tagsViewStore.getVisitedViews
  const latestView = visitedViews.slice(-1)[0]
  if (latestView) {
    push(latestView)
  } else {
    let url = ''
    let routerList: any = permissionStore.getAddRouters[0]
    if (routerList && routerList.children?.length > 0) {
      url = `${routerList.path === '/' ? '' : routerList.path}/${routerList.children[0].path}`
      if (routerList.children.find((s) => s.isDefaultHidden)) {
        let list = routerList.children.find((s) => !s.isDefaultHidden)
        url = `${list.path}`
      }
    } else {
      url = routerList.path
    }
    if (unref(currentRoute).path === url || unref(currentRoute).path === routerList.redirect) {
      addTags()
      return
    }
    // You can set another route
    push(url)
  }
}

// 滚动到选中的tag
const moveToCurrentTag = async () => {
  await nextTick()
  for (const v of unref(visitedViews)) {
    if (v.fullPath === unref(currentRoute).path) {
      moveToTarget(v)
      if (v.fullPath !== unref(currentRoute).fullPath) {
        tagsViewStore.updateVisitedView(unref(currentRoute))
      }

      break
    }
  }
}

const tagLinksRefs = useTemplateRefsList<RouterLinkProps>()

const moveToTarget = (currentTag: RouteLocationNormalizedLoaded) => {
  const wrap$ = unref(scrollbarRef)?.wrapRef
  let firstTag: Nullable<RouterLinkProps> = null
  let lastTag: Nullable<RouterLinkProps> = null

  const tagList = unref(tagLinksRefs)
  // find first tag and last tag
  if (tagList.length > 0) {
    firstTag = tagList[0]
    lastTag = tagList[tagList.length - 1]
  }
  if ((firstTag?.to as RouteLocationNormalizedLoaded).fullPath === currentTag.fullPath) {
    // 直接滚动到0的位置
    const { start } = useScrollTo({
      el: wrap$!,
      position: 'scrollLeft',
      to: 0,
      duration: 500
    })
    start()
  } else if ((lastTag?.to as RouteLocationNormalizedLoaded).fullPath === currentTag.fullPath) {
    // 滚动到最后的位置
    const { start } = useScrollTo({
      el: wrap$!,
      position: 'scrollLeft',
      to: wrap$!.scrollWidth - wrap$!.offsetWidth,
      duration: 500
    })
    start()
  } else {
    // find preTag and nextTag
    const currentIndex: number = tagList.findIndex(
      (item) => (item?.to as RouteLocationNormalizedLoaded).fullPath === currentTag.fullPath
    )
    const tgsRefs = document.getElementsByClassName(`${prefixCls}__item`)

    const prevTag = tgsRefs[currentIndex - 1] as HTMLElement
    const nextTag = tgsRefs[currentIndex + 1] as HTMLElement

    // the tag's offsetLeft after of nextTag
    const afterNextTagOffsetLeft = nextTag.offsetLeft + nextTag.offsetWidth + 4

    // the tag's offsetLeft before of prevTag
    const beforePrevTagOffsetLeft = prevTag.offsetLeft - 4

    if (afterNextTagOffsetLeft > unref(scrollLeftNumber) + wrap$!.offsetWidth) {
      const { start } = useScrollTo({
        el: wrap$!,
        position: 'scrollLeft',
        to: afterNextTagOffsetLeft - wrap$!.offsetWidth,
        duration: 500
      })
      start()
    } else if (beforePrevTagOffsetLeft < unref(scrollLeftNumber)) {
      const { start } = useScrollTo({
        el: wrap$!,
        position: 'scrollLeft',
        to: beforePrevTagOffsetLeft,
        duration: 500
      })
      start()
    }
  }
}

// 是否是当前tag
const isActive = (route: RouteLocationNormalizedLoaded): boolean => {
  return route.path === unref(currentRoute).path
}

// 所有右键菜单组件的元素
const itemRefs = useTemplateRefsList<ComponentRef<typeof ContextMenu & ContextMenuExpose>>()

// 右键菜单装填改变的时候
const visibleChange = (visible: boolean, tagItem: RouteLocationNormalizedLoaded) => {
  if (visible) {
    for (const v of unref(itemRefs)) {
      const elDropdownMenuRef = v.elDropdownMenuRef
      if (tagItem.fullPath !== v.tagItem.fullPath) {
        elDropdownMenuRef?.handleClose()
      }
    }
  }
}

// elscroll 实例
const scrollbarRef = ref<ComponentRef<typeof ElScrollbar>>()

const overflowRef = ref()
const routerInfoRef = ref()
// 保存滚动位置
const scrollLeftNumber = ref(0)

const scroll = ({ scrollLeft }) => {
  scrollLeftNumber.value = scrollLeft as number
}

// 移动到某个位置
const move = (to: number) => {
  const wrap$ = unref(scrollbarRef)?.wrapRef
  const { start } = useScrollTo({
    el: wrap$!,
    position: 'scrollLeft',
    to: unref(scrollLeftNumber) + to,
    duration: 500
  })
  start()
}
// 获取导航栏高度
const initNavigation = (val: Boolean) => {
  nextTick(() => {
    let scrollWidth = 0
    routerInfoRef.value.forEach((item) => {
      scrollWidth += item.offsetWidth + 25
    })
    // 用来判断当前操作是否会让切换按钮出现
    if (scrollWidth >= oldWeidth.value) {
      isCheckPage.value = true
      if (!oneIsCheck.value) {
        oneIsCheck.value = true
        if (val) {
          nextTick(() => {
            move(500)
          })
        }
      }
    } else {
      isCheckPage.value = false
      if (oneIsCheck.value) {
        oneIsCheck.value = false
      }
    }
  })
}
onMounted(() => {
  initTags()
  addTags()
  initNavigation(false)
  window.addEventListener('resize', () => {
    windowWidth.value = window.innerWidth
  })
  // 获取Scrollbar的宽度
  oldWeidth.value = overflowRef.value.clientWidth
})
watch(
  () => routerInfoRef.value,
  () => {
    initNavigation(true)
  },
  { deep: true }
)
watch(
  () => currentRoute.value,
  () => {
    addTags()
    moveToCurrentTag()
  }
)
watch(
  () => windowWidth.value,
  () => {
    oldWeidth.value = overflowRef.value.clientWidth
    initNavigation(false)
  }
)
</script>

<template>
  <div
    :id="prefixCls"
    :class="prefixCls"
    class="flex w-full relative mt-55px bg-[#fff] dark:bg-[var(--el-bg-color)] h-45px"
  >
    <span
      v-if="isCheckPage"
      :class="`${prefixCls}__tool`"
      class="w-[var(--tags-view-height)] h-[var(--tags-view-height)] text-center leading-45px cursor-pointer"
      @click="move(-200)"
    >
      <Icon
        icon="ep:d-arrow-left"
        :color="appStore.getIsDark ? 'var(--el-text-color-regular)' : '#333'"
      />
    </span>
    <div class="overflow-hidden flex-1" ref="overflowRef">
      <div class="scrollbar-content h-full" ref="scrollbarContent">
        <ElScrollbar ref="scrollbarRef" class="h-full" @scroll="scroll">
          <div class="flex h-full">
            <ContextMenu
              :ref="itemRefs.set"
              v-for="item in visitedViews"
              :key="item.fullPath"
              :tag-item="item"
              :class="[
                `${prefixCls}__item`,
                item?.meta?.affix ? `${prefixCls}__item--affix` : '',
                {
                  'is-active': isActive(item)
                }
              ]"
              @visible-change="visibleChange"
              :schema="[
                {
                  icon: 'ant-design:sync-outlined',
                  label: t('common.reload'),
                  disabled: selectedTag?.fullPath !== item.fullPath,
                  command: () => {
                    refreshSelectedTag(item)
                  }
                },
                {
                  icon: 'ant-design:close-outlined',
                  label: t('common.closeTab'),
                  disabled: !!visitedViews?.length && selectedTag?.meta.affix,
                  command: () => {
                    closeSelectedTag(item)
                  }
                },
                {
                  divided: true,
                  icon: 'ant-design:vertical-right-outlined',
                  label: t('common.closeTheLeftTab'),
                  disabled:
                    !!visitedViews?.length &&
                    (item.fullPath === visitedViews[0].fullPath ||
                      selectedTag?.fullPath !== item.fullPath),
                  command: () => {
                    closeLeftTags()
                  }
                },
                {
                  icon: 'ant-design:vertical-left-outlined',
                  label: t('common.closeTheRightTab'),
                  disabled:
                    !!visitedViews?.length &&
                    (item.fullPath === visitedViews[visitedViews.length - 1].fullPath ||
                      selectedTag?.fullPath !== item.fullPath),
                  command: () => {
                    closeRightTags()
                  }
                },
                {
                  divided: true,
                  icon: 'ant-design:tag-outlined',
                  label: t('common.closeOther'),
                  disabled: selectedTag?.fullPath !== item.fullPath,
                  command: () => {
                    closeOthersTags()
                  }
                },
                {
                  icon: 'ant-design:line-outlined',
                  label: t('common.closeAll'),
                  command: () => {
                    closeAllTags()
                  }
                }
              ]"
            >
              <div>
                <router-link :ref="tagLinksRefs.set" :to="{ ...item }" custom v-slot="{ navigate }">
                  <div
                    @click="navigate"
                    ref="routerInfoRef"
                    class="h-full flex justify-center items-center whitespace-nowrap pl-10px"
                  >
                    <Icon
                      v-if="
                        item?.matched &&
                        item?.matched[1] &&
                        item?.matched[1]?.meta?.icon1 &&
                        tagsViewIcon
                      "
                      :icon="item?.matched[1]?.meta?.icon"
                      :size="12"
                      class="mr-5px"
                    />
                    {{ t(item?.meta?.title as string) }}
                    <Icon
                      :class="`${prefixCls}__item--close`"
                      color="#333"
                      icon="ant-design:close-outlined"
                      :size="12"
                      @click.prevent.stop="closeSelectedTag(item)"
                    />
                  </div>
                </router-link>
              </div>
            </ContextMenu>
          </div>
        </ElScrollbar>
      </div>
    </div>
    <span
      v-if="isCheckPage"
      :class="`${prefixCls}__tool`"
      class="w-[var(--tags-view-height)] h-[var(--tags-view-height)] text-center leading-45px cursor-pointer"
      @click="move(200)"
    >
      <Icon
        icon="ep:d-arrow-right"
        :color="appStore.getIsDark ? 'var(--el-text-color-regular)' : '#333'"
      />
    </span>
    <span
      :class="`${prefixCls}__tool`"
      class="w-[var(--tags-view-height)] h-[var(--tags-view-height)] text-center leading-45px cursor-pointer"
      @click="refreshSelectedTag(selectedTag)"
    >
      <Icon
        icon="ant-design:reload-outlined"
        :color="appStore.getIsDark ? 'var(--el-text-color-regular)' : '#333'"
      />
    </span>
    <ContextMenu
      trigger="click"
      :schema="[
        {
          icon: 'ant-design:sync-outlined',
          label: t('common.reload'),
          command: () => {
            refreshSelectedTag(selectedTag)
          }
        },
        {
          icon: 'ant-design:close-outlined',
          label: t('common.closeTab'),
          disabled: !!visitedViews?.length && selectedTag?.meta.affix,
          command: () => {
            closeSelectedTag(selectedTag!)
          }
        },
        {
          divided: true,
          icon: 'ant-design:vertical-right-outlined',
          label: t('common.closeTheLeftTab'),
          disabled: !!visitedViews?.length && selectedTag?.fullPath === visitedViews[0].fullPath,
          command: () => {
            closeLeftTags()
          }
        },
        {
          icon: 'ant-design:vertical-left-outlined',
          label: t('common.closeTheRightTab'),
          disabled:
            !!visitedViews?.length &&
            selectedTag?.fullPath === visitedViews[visitedViews.length - 1].fullPath,
          command: () => {
            closeRightTags()
          }
        },
        {
          divided: true,
          icon: 'ant-design:tag-outlined',
          label: t('common.closeOther'),
          command: () => {
            closeOthersTags()
          }
        },
        {
          icon: 'ant-design:line-outlined',
          label: t('common.closeAll'),
          command: () => {
            closeAllTags()
          }
        }
      ]"
    >
      <span
        :class="`${prefixCls}__tool`"
        class="w-[var(--tags-view-height)] h-[var(--tags-view-height)] text-center leading-45px cursor-pointer block"
      >
        <Icon
          icon="ant-design:setting-outlined"
          :color="appStore.getIsDark ? 'var(--el-text-color-regular)' : '#333'"
        />
      </span>
    </ContextMenu>
  </div>
</template>

<style lang="less" scoped>
@prefix-cls: ~'@{namespace}-tags-view';

.@{prefix-cls} {
  :deep(.@{elNamespace}-scrollbar__view) {
    height: 100%;
  }

  &__tool {
    position: relative;

    &:hover {
      :deep(span) {
        color: var(--el-color-black) !important;
      }
    }

    &:after {
      position: absolute;
      top: 1px;
      left: 0;
      width: 100%;
      height: calc(~'100% - 3px');
      // border-right: 1px solid var(--tags-view-border-color);
      border-left: 1px solid var(--tags-view-border-color);
      content: '';
    }
  }

  &__item {
    position: relative;
    top: 2px;
    height: calc(~'100% - 4px');
    padding-right: 25px;
    margin-left: 4px;
    font-size: 12px;
    cursor: pointer;
    border: 1px solid #d9d9d9;

    &--close {
      position: absolute;
      top: 50%;
      right: 5px;
      display: none;
      transform: translate(0, -50%);
    }
    &:not(.@{prefix-cls}__item--affix):hover {
      .@{prefix-cls}__item--close {
        display: block;
      }
    }
  }

  &__item:not(.is-active) {
    &:hover {
      color: var(--el-color-primary);
    }
  }

  &__item.is-active {
    color: var(--el-color-white);
    background-color: var(--el-color-primary);
    border: 1px solid var(--el-color-primary);
    .@{prefix-cls}__item--close {
      :deep(span) {
        color: var(--el-color-white) !important;
        &:hover {
          color: #333333 !important;
        }
      }
    }
  }
}

.dark {
  .@{prefix-cls} {
    &__tool {
      &:hover {
        :deep(span) {
          color: #fff !important;
        }
      }

      &:after {
        border-right: 1px solid var(--el-border-color);
        border-left: 1px solid var(--el-border-color);
      }
    }

    &__item {
      position: relative;
      top: 2px;
      height: calc(~'100% - 4px');
      padding-right: 25px;
      font-size: 12px;
      cursor: pointer;
      border: 1px solid var(--el-border-color);
    }

    &__item:not(.is-active) {
      &:hover {
        color: var(--el-color-primary);
      }
    }

    &__item.is-active {
      color: var(--el-color-white);
      background-color: var(--el-color-primary);
      .@{prefix-cls}__item--close {
        :deep(span) {
          color: var(--el-color-white) !important;
          &:hover {
            color: #333333 !important;
          }
        }
      }
    }
  }
}
</style>
