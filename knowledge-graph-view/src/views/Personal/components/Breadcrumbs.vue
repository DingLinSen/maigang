<script setup lang="ts">
import { onMounted, watch, computed, unref, ref, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useDesign } from '@/hooks/web/useDesign'
import { Icon } from '@/components/Icon'

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('tags-view')

const { currentRoute, push, replace, route } = useRouter()

const routers = computed(() => permissionStore.getRouters)

const menuData = ref([])

menuData.value = currentRoute.value.meta.title

// 初始化tag
onMounted(() => {})

watch(
  () => currentRoute.value,
  () => {
    menuData.value = currentRoute.value.meta.title
  }
)
</script>

<template>
  <div class="tags-view-cont">
    <div
      :id="prefixCls"
      :class="prefixCls"
      class="flex w-full relative bg-[#fff] dark:bg-[var(--el-bg-color)] !h-[calc(100%-var(--tags-view-height))]"
    >
      <div class="tag-item"
        ><span class="tag-item-text">个人中心 > </span
        ><span class="tag-item-aciive">{{ menuData }}</span></div
      >
      <slot name="rightContent"> </slot>
    </div>
  </div>
</template>

<style lang="less" scoped>
.operation_btn {
  display: flex;
  margin-right: 20px;
  div {
    cursor: pointer;
    padding: 6px 20px;
    color: #00a0e9;
    border: 1px solid #00a0e9;
    border-right: none;
    span {
      margin-left: 5px;
    }
    &:last-child {
      border-right: 1px solid #00a0e9 !important;
      border-top-right-radius: 10%;
      border-bottom-right-radius: 10%;
    }
    &:first-child {
      border-top-left-radius: 10%;
      border-bottom-left-radius: 10%;
    }
  }
}
#v-tags-view {
  // padding-left: 15px;
  background: #ffffff;
  align-items: center;
  justify-content: space-between;
}
.tag-item {
  .tag-item-text {
    color: #999999;
  }
  .tag-item-aciive {
    // cursor: pointer;
    font-weight: 400;
    font-size: 14px;
    color: #666666;
    // &:hover {
    //   font-weight: 400;
    //   font-size: 14px;
    //   color: #0db3ff;
    //   text-decoration-line: underline;
    // }
    // &:active {
    //   font-weight: 400;
    //   font-size: 14px;
    //   color: #0092d4;
    // }
  }
  line-height: var(--tags-view-height) !important;
  height: var(--tags-view-height) !important;
  font-family: Microsoft YaHei;
  font-weight: 400;
  font-size: 14px;
  color: #666666 !important;
}
.tags-view-cont {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  // padding-left: 11px;
  // padding-right: 7px;
}
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
      height: calc(~'100% - 1px');
      border-right: 1px solid var(--tags-view-border-color);
      border-left: 1px solid var(--tags-view-border-color);
      content: '';
    }
  }

  &__item {
    position: relative;
    top: 2px;
    height: calc(~'100% - 4px');
    padding-right: 30px;
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
        top: 50%;
        right: 15px;
        width: 12px;
        height: 12px;
        display: block;
      }
    }
  }

  &__item:not(.is-active) {
    &:hover {
      color: var(--el-color-primary);

      .@{prefix-cls}__item--close {
        position: absolute;
        top: 50%;
        right: 15px;
        width: 12px;
        height: 12px;
        background: url(@/assets/imgs/icon/close_icon.png) no-repeat center;
        background-size: 100% 100%;

        :deep(span) {
          color: var(--el-color-white) !important;
        }
      }
    }
  }

  &__item.is-active {
    color: rgba(34, 34, 34, 1);
    font-family: 'Alibaba PuHuiTi M';
    // color: var(--el-color-white);
    // background-color: var(--el-color-primary);
    // border: 1px solid var(--el-color-primary);
    &:hover {
      color: var(--el-color-primary);
    }

    .@{prefix-cls}__item--close {
      position: absolute;
      top: 53%;
      // transform: translateY(-50%);
      right: 15px;
      width: 12px;
      height: 12px;
      background: url(@/assets/imgs/icon/close_icon.png) no-repeat center;
      background-size: 100% 100%;

      :deep(span) {
        color: var(--el-color-white) !important;
      }
    }
  }

  &__item.is-active::before {
    content: '';
    width: 100%;
    height: 4px;
    background-color: #00a0e9;
    z-index: 999;
    position: absolute;
    top: 0px;
    left: 0px;
    display: inline-block;
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
        }
      }
    }
  }
}

:deep(.v-tags-view__item) {
  height: 100% !important;
  top: 0px !important;
  border: none !important;
  border-radius: 0px 0px 0px 2px;
  border-right: 1px solid #e4ebf1 !important;
  font-size: 15px;
  font-weight: 400;
  color: #222222;
}

:deep(.el-icon) {
  font-size: 16px !important;
  svg {
    color: #00a0e9;
  }
}

:deep(.el-button) {
  background: #ffffff !important;
  border-radius: 6px !important;
  border: 1px solid rgba(0, 160, 233, 0.5) !important;
  // opacity: 0.5 !important;
  span {
    color: #00a0e9;
  }
}
</style>
