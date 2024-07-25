<!--
  * 项目管理-科研项目-统计
 -->
<template>
  <ContentWrap :isShowtitle="false" class="satistics_menu-contentWrap">
    <section class="satistics_menu_main h-[7.86em] flex items-center px-[1.43em]">
      <!-- 实施中 -->
      <div
        class="satistics_menu_content border-1"
        @click="changeitemCount('jzz', '2')"
        :class="isActive === 'jzz' ? 'active' : ''"
      >
        <p class="satistics_menu_text">数量统计</p>
        <div class="flex items-center justify-between h-[4em]">
          <p class="satistics_menu_num">
            进展中<span>{{ cultivateCount.jzz }}</span
            >个
          </p>
          <p class="satistics_menu_img">
            <Icon class="icon-form" icon="svg-icon:xz_icon" />
          </p>
        </div>
      </div>
      <!-- 审批中 -->
      <div
        class="satistics_menu_content border-1"
        @click="changeitemCount('spz', '-3')"
        :class="isActive === 'spz' ? 'active' : ''"
      >
        <p class="satistics_menu_text">数量统计</p>
        <div class="flex items-center justify-between h-[4em]">
          <p class="satistics_menu_num">
            审批中<span>{{ cultivateCount.spz }}</span
            >个
          </p>
          <p class="satistics_menu_img">
            <Icon class="icon-form" icon="svg-icon:xz_icon" />
          </p>
        </div>
      </div>
      <!-- 结束终止 -->
      <div
        class="satistics_menu_content border-1"
        @click="changeitemCount('jszz', '-1')"
        :class="isActive === 'jszz' ? 'active' : ''"
      >
        <p class="satistics_menu_text">数量统计</p>
        <div class="flex items-center justify-between h-[4em]">
          <p class="satistics_menu_num">
            结束终止<span>{{ cultivateCount.jszz }}</span
            >个
          </p>
          <p class="satistics_menu_img">
            <Icon class="icon-form" icon="svg-icon:xz_icon" />
          </p>
        </div>
      </div>
      <!-- 实施总项目 -->
      <div
        class="satistics_menu_content border-1"
        :class="isActive === 'zxm' ? 'active' : ''"
        @click="changeitemCount('zxm', '')"
      >
        <p class="satistics_menu_text">数量统计</p>
        <div class="flex items-center justify-between h-[4em]">
          <p class="satistics_menu_num">
            自研总项目<span>{{ cultivateCount.zxm }}</span
            >个
          </p>
          <p class="satistics_menu_img">
            <Icon class="icon-form" icon="svg-icon:xz_icon" />
          </p>
        </div>
      </div>
    </section>
  </ContentWrap>
</template>

<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { inject } from 'vue'
defineProps({
  cultivateCount: {
    type: Object,
    default: null
  },
  isActive: {
    type: String,
    default: ''
  }
})

const changeitemCount = inject('changeitemCount')
</script>

<style lang="less" scoped>
.satistics_menu_content {
  overflow: hidden;
  border-radius: 4px;
  width: 25%;
  height: 5.5em;
  margin-right: 1em;
  cursor: pointer;
  &:last-child {
    margin-right: 0;
  }

  &:nth-child(1) {
    border-color: #b1e5c4;
    .satistics_menu_text {
      background: #73c791;
    }
    .icon-form {
      color: #73c791;
    }
  }
  &:nth-child(2) {
    border-color: #ffd3c4;
    .satistics_menu_text {
      background: #ffa486;
    }
    .icon-form {
      color: #ffa486;
    }
  }

  &:nth-child(3) {
    border-color: #c5dff2;
    .satistics_menu_text {
      background: #b5b5b5;
    }
    .icon-form {
      color: #b5b5b5;
    }
  }
  &:nth-child(4) {
    border-color: #63c9f7;
    .satistics_menu_text {
      background: #2daee9;
    }
    .icon-form {
      color: #2daee9;
    }
  }
}

.satistics_menu_content.active {
  box-shadow: 0px 3px 8px 0px rgba(31, 31, 31, 0.2);
  .satistics_menu_img {
    display: block;
  }
}
.satistics_menu_text {
  height: 1.5em;
  color: #fff;
  padding-left: 0.71em;
  line-height: 1.5em;
  font-size: 1em;
  background: #ffa486;
}
.satistics_menu_num {
  color: #272727;
  margin-left: 1.14em;
  font-size: 1em;
  span {
    font-size: 2.14em;
    font-weight: bold;
    padding: 0 4px;
    color: #1f2d3d;
  }
}
.satistics_menu_img {
  width: 1.71em;
  height: 1.71em;
  border-radius: 50%;
  margin-right: 1.36em;
  display: none;
  .icon-form {
    width: 100%;
    height: 100%;
    font-size: 1.51em !important;
  }
}
@media screen and (max-width: 1536px) {
  .satistics_menu_text {
    font-size: 13px !important;
  }
  .satistics_menu_num {
    font-size: 13px !important;
  }
}
</style>

<style>
.satistics_menu-contentWrap {
  margin-bottom: 10px !important;
}
.satistics_menu-contentWrap .el-card__body {
  padding: 0 !important;
}
</style>
