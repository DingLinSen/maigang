<script lang="tsx">
import { computed, defineComponent, unref, PropType, ref } from 'vue'
import { ElMenu, ElScrollbar } from 'element-plus'
import { useAppStore } from '@/store/modules/app'
import { usePermissionStore } from '@/store/modules/permission'
import { useRenderMenuItem } from './components/useRenderMenuItem'
import { useRouter } from 'vue-router'
import { isUrl } from '@/utils/is'
import { useDesign } from '@/hooks/web/useDesign'
import { LayoutType } from '@/types/layout'
import { HighGrowthDialog } from '@/views/Home/dialog'

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('menu')
const appStore = useAppStore()
// 菜单折叠
const collapse = computed(() => appStore.getCollapse)

export default defineComponent({
  name: 'Menu',
  props: {
    menuSelect: {
      type: Function as PropType<(index: string) => void>,
      default: undefined
    }
  },
  setup(props) {
    const appStore = useAppStore()

    const layout = computed(() => appStore.getLayout)

    const { push, currentRoute } = useRouter()

    const permissionStore = usePermissionStore()

    const menuMode = computed((): 'vertical' | 'horizontal' => {
      // 竖
      const vertical: LayoutType[] = ['classic', 'topLeft', 'cutMenu']

      return 'vertical'

      // if (vertical.includes(unref(layout))) {
      //   return 'vertical'
      // } else {
      //   return 'horizontal'
      // }
    })

    const routers = computed(() => {
      console.log(permissionStore.getMenuTabRouters, permissionStore.getRouters, 98)
      return unref(layout) === 'cutMenu'
        ? permissionStore.getMenuTabRouters
        : permissionStore.getRouters
    })

    const uniqueOpened = computed(() => appStore.getUniqueOpened)

    const activeMenu = computed(() => {
      const { meta, path } = unref(currentRoute)

      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu as string
      }
      return path
    })

    const menuSelect = (index: string) => {
      if (props.menuSelect) {
        props.menuSelect(index)
      }

      // 自定义事件
      if (index.toLocaleLowerCase().startsWith('http')) {
        index = decodeURIComponent(index)
        window.open(index)
      } else {
        push(index)
      }
    }

    const renderMenuWrap = () => {
      if (unref(layout) === 'top') {
        return renderMenu()
      } else {
        return <ElScrollbar>{renderMenu()}</ElScrollbar>
      }
    }

    //高成长弹框
    const growthVisible = ref(false)
    const openHighGrowth = () => {
      growthVisible.value = true
    }

    const renderMenu = () => {
      return (
        <div class={[{ 'over-collapse': !collapse.value }, 'menu-boyder']}>
          <ElMenu
            defaultActive={unref(activeMenu)}
            mode={unref(menuMode)}
            collapse={false}
            uniqueOpened={unref(layout) === 'top' ? false : unref(uniqueOpened)}
            backgroundColor="#F4F4F4"
            textColor="var(--left-menu-text-color)"
            activeTextColor="var(--left-menu-text-active-color)"
            onSelect={menuSelect}
            unique-opened
          >
            {{
              default: () => {
                const { renderMenuItem } = useRenderMenuItem(unref(menuMode))
                return renderMenuItem(unref(routers))
              }
            }}
          </ElMenu>
          {!unref(collapse) ? (
            <div class="menu-footer">
              {/* <div class="footer-content core-values 2xl:w-200px 2xl:h-72px w-156px h-56px"></div>
              <div
                class="footer-content develop 2xl:w-200px 2xl:h-72px w-156px h-56px"
                onClick={openHighGrowth}
              ></div> */}
              <HighGrowthDialog v-model={growthVisible.value} />
            </div>
          ) : null}
        </div>
      )
    }
    return () => (
      <div>
        <div
          id={prefixCls}
          class={[
            `${prefixCls} ${prefixCls}__${unref(menuMode)}`,
            'h-[100%] overflow-hidden flex-col bg-[#F4F4F4] w-[var(--left-menu-max-smal-screen-width)] 2xl:w-[var(--left-menu-max-width)]'
          ]}
        >
          {renderMenuWrap()}
        </div>
      </div>
    )
  }
})
</script>

<style lang="less" scoped>
@prefix-cls: ~'@{namespace}-menu';
.menu-boyder {
  height: 100%;
  position: relative;
  background: #f4f4f4;
  padding-top: 5px;
  .menu-footer {
    position: absolute;
    // bottom: 20px;
    left: 0px;
    height: auto;
    width: 100%;
    .footer-content {
      margin: 0 auto;
    }
    .core-values {
      background: url('@/assets/imgs/nav_pic1.png');
      background-size: 100% 100%;
    }
    .develop {
      cursor: pointer;
      background: url('@/assets/imgs/nav_pic2.png');
      background-size: 100% 100%;
    }
  }
}
:deep(.el-menu--vertical) {
  height: 96%;

  li:nth-child(1) {
    font-family: Alibaba PuHuiTi M;
  }
}
.is-active--after {
  position: absolute;
  top: 0;
  right: 0;
  width: 4px;
  height: 100%;
  background-color: var(--el-color-primary);
  content: '';
}

.@{prefix-cls} {
  position: relative;
  transition: width var(--transition-time-02);

  &:after {
    // position: absolute;
    // top: 0;
    // right: 0;
    // height: 100%;
    // border-left: 1px solid var(--left-menu-border-color);
    // content: '';
  }
  :deep(.@{elNamespace}-menu) {
    width: 100% !important;
    border-right: none;
    .el-sub-menu__title {
      background-color: #f4f4f4;
      .v-menu__title {
        font-family: Alibaba PuHuiTi M;
        font-size: 15px !important;
      }
      .el-sub-menu__icon-arrow {
        right: 21px !important;
        font-size: 14px;
        color: #000;
      }
    }
    .el-menu--inline {
      //子级未选中样式
      .el-menu-item {
        font-family: Alibaba PuHuiTi R !important;
        height: 42px !important;
        font-size: 14px !important;
        line-height: 42px !important;
        color: #001a2c !important;
        .v-menu__title {
          padding-left: 10px;
          position: relative;
        }
        .v-menu__title::after {
          content: '';
          width: 4px;
          height: 4px;
          top: 0px;
          bottom: 0;
          left: 0px;
          margin: auto;
          background-color: rgba(177, 187, 205, 1);
          border-radius: 50%;
          display: inline-block;
          position: absolute;
        }
      }
      .el-menu-item.is-active {
        .v-menu__title::after {
          background-color: rgba(255, 255, 255, 1) !important;
        }
      }
      // 子级选中字体样式
      .is-active {
        color: #ffffff !important;
        font-family: Alibaba PuHuiTi B !important;
      }
    }
    // 设置选中时子标题的颜色
    .is-active {
      & > .@{elNamespace}-sub-menu__title {
        color: var(--left-menu-text-active-color) !important;
        font-family: Alibaba PuHuiTi M;
      }
    }

    // 设置子菜单悬停的高亮和背景色
    .@{elNamespace}-sub-menu__title,
    .@{elNamespace}-menu-item {
      &:hover {
        // color: var(--left-menu-text-active-color) !important;
        // background-color: #fff;
      }
    }

    // 设置选中时的高亮背景和高亮颜色
    .@{elNamespace}-sub-menu.is-active,
    .@{elNamespace}-menu-item.is-active {
      position: relative;
      background-color: rgba(0, 160, 233, 1);
      color: #fff;
      // &:hover {
      //   color: #fff !important;
      // }
      .v-menu__title {
        position: relative;
      }
    }
    // 设置子菜单的背景颜色
    .@{elNamespace}-menu {
      .@{elNamespace}-sub-menu__title,
      .@{elNamespace}-menu-item:not(.is-active) {
        background-color: #f4f4f4 !important;
      }
    }
  }

  // 折叠时的最小宽度
  :deep(.@{elNamespace}-menu--collapse) {
    width: var(--left-menu-min-width);

    & > .is-active,
    & > .is-active > .@{elNamespace}-sub-menu__title {
      position: relative;
      background-color: var(--left-menu-collapse-bg-active-color) !important;

      &:after {
        .is-active--after;
      }
    }
  }

  // 折叠动画的时候，就需要把文字给隐藏掉
  :deep(.horizontal-collapse-transition) {
    // transition: 0s width ease-in-out, 0s padding-left ease-in-out, 0s padding-right ease-in-out !important;
    .@{prefix-cls}__title {
      display: none;
    }
  }

  // 水平菜单
  &__horizontal {
    height: calc(~'var(--top-tool-height)') !important;

    :deep(.@{elNamespace}-menu--horizontal) {
      height: calc(~'var(--top-tool-height)');
      border-bottom: none;
      // 重新设置底部高亮颜色
      & > .@{elNamespace}-sub-menu.is-active {
        .@{elNamespace}-sub-menu__title {
          border-bottom-color: var(--el-color-primary) !important;
        }
      }

      .@{elNamespace}-menu-item.is-active {
        position: relative;

        &:after {
          display: none !important;
        }
      }

      .@{prefix-cls}__title {
        /* stylelint-disable-next-line */
        max-height: calc(~'var(--top-tool-height) - 2px') !important;
        /* stylelint-disable-next-line */
        line-height: calc(~'var(--top-tool-height) - 2px');
      }
    }
  }
}
:deep(.el-menu-item) {
  line-height: 47px;
  height: 47px;
  padding-left: 22px !important;
  .el-icon {
    font-size: 14px !important;
  }
}
:deep(.el-sub-menu) {
  .el-sub-menu__title {
    line-height: 47px;
    height: 47px;
    padding-left: 22px !important;
  }
  .el-icon {
    font-size: 14px !important;
  }
}
</style>

<style lang="less">
@prefix-cls: ~'@{namespace}-menu-popper';

.is-active--after {
  position: absolute;
  top: 0;
  right: 0;
  width: 4px;
  height: 100%;
  background-color: var(--el-color-primary);
  content: '';
}

.@{prefix-cls}--vertical,
.@{prefix-cls}--horizontal {
  // 设置选中时子标题的颜色
  .is-active {
    & > .el-sub-menu__title {
      color: var(--left-menu-text-active-color) !important;
    }
  }

  // 设置子菜单悬停的高亮和背景色
  .el-sub-menu__title,
  .el-menu-item {
    // &:hover {
    //   color: var(--left-menu-text-active-color) !important;
    //   background-color: #f4f4f4 !important;
    // }
  }

  // 设置选中时的高亮背景
  .el-menu-item.is-active {
    position: relative;
    background-color: var(--left-menu-bg-active-color) !important;

    // &:hover {
    //   background-color: var(--left-menu-bg-active-color) !important;
    // }

    &:after {
      .is-active--after;
    }
  }
}
.over-collapse {
  .el-menu--vertical {
    overflow-y: auto;
  }
}

.el-icon.el-sub-menu__icon-arrow {
  svg {
    display: none !important;
  }
  &::after {
    content: '';
    background: url('../../../assets/imgs/icon/xl_icon.png') center no-repeat;
    width: 1em;
    height: 1em;
  }
}

//二级菜单
.menu-boyder > ul > li > ul > li span {
  margin-left: 5px;
}

//三级菜单
.menu-boyder > ul > li > ul > li > ul > li > span {
  margin-left: 10px;
}

// @media screen and (max-width: 1536px) {
//   #v-menu .el-menu-item,
//   #v-menu .el-sub-menu__title,
//   #v-menu .el-menu .el-menu--inline .el-menu-item {
//     height: 36px !important;
//   }
//   #v-menu .v-menu__title {
//     font-size: 13px !important;
//   }
//   #v-menu .el-sub-menu .el-sub-menu__title {
//     padding-left: 10px !important;
//   }

//   #v-menu .el-menu-item {
//     padding-left: 10px !important;
//   }
//   .el-sub-menu .el-sub-menu__title .v-icon,
//   #v-menu .el-menu-item .v-icon {
//     margin-right: 10px !important;
//     font-size: 14px !important;
//   }

//   .menu-boyder > ul > li > ul > li span {
//     margin-left: 0px !important;
//   }

//   //三级菜单
//   .menu-boyder > ul > li > ul > li > ul > li > span {
//     margin-left: 0px !important;
//   }
// }
</style>
