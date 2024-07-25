<template>
  <div class="nav-left">
    <h3 class="cursor-pointer" @click="push({ name: 'Home' })"
      ><img
        src="@/assets/imgs/logo.png"
        class="w-[calc(var(--logo-width))] h-[calc(var(--top-tool-smal-screen-height)-34px)] 2xl:h-[calc(var(--logo-height)-34px)] mr-5px"
      />知识图谱系统
    </h3>
    <button @click="upload" class="upload_btn">
      <Icon icon="svg-icon:upload_icon" class="mr-10px icon-size" />
      上传
    </button>
    <div class="nav-list">
      <router-link
        active-class="active"
        v-for="(item, index) in navList"
        :key="index"
        :to="{ name: item.url }"
      >
        <Icon
          :icon="`svg-icon:nav_icon${index + 1}`"
          class="mr-15px icon-size"
          :color="activeIndex == index ? '#00A0E9' : '#7c878e'"
        />
        <p>{{ item.name }}</p>
      </router-link>
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Icon } from '@/components/Icon'
import { useRouter } from 'vue-router'
import { usePermissionStore } from '@/store/modules/permission'

const { push } = useRouter()
const permissionStore = usePermissionStore()
const emit = defineEmits(['isShowUpload'])
const activeIndex = ref<number>(0)
const navList = reactive([
  {
    url: 'MyUpload',
    name: '我的上传'
  },
  {
    url: 'MyDownload',
    name: '我的下载'
  },
  {
    url: 'MyShare',
    name: '我的分享'
  },
  {
    url: 'ShareWithMe',
    name: '与我共享'
  },
  {
    url: 'MyCollection',
    name: '我的收藏'
  },
  // {
  //   url: 'MyLike',
  //   name: '我的点赞'
  // },
  {
    url: 'MyBrowse',
    name: '我的浏览'
  },
  {
    url: 'MyLabel',
    name: '我的标签'
  },
  {
    url: 'MyGroup',
    name: '我的群组'
  },
  {
    url: 'RecycleBin',
    name: '回收站'
  }
])
console.log(permissionStore, 'permissionStore')
// 上传文件
const upload = () => {
  emit('isShowUpload', true)
}
</script>
<style scoped lang="less">
.icon-size {
  font-size: 16px !important;
}
.nav-left {
  width: var(--left-personal-menu-width);
  background: #f4f4f4;
  height: 100vh;
  padding: 0 25px;
  font-size: 14px;
  h3 {
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: Microsoft YaHei;
    font-weight: bold;
    font-size: 26px;
    color: #222222;
    line-height: 80px;
  }
  .upload_btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 190px;
    height: 40px;
    background: #00a0e9;
    border-radius: 6px;
    color: #fff;
  }
  .upload_btn:hover {
    background: rgba(0, 160, 233, 0.8) !important;
  }
  .nav-list {
    width: 190px;
    height: 76vh;
    overflow-y: auto;
    overflow-x: hidden;
    padding-top: 10px;
    // text-align: center;
    // margin: 5px 0;
    &:nth-last-child(2) {
      padding: 20px 0;
      border-top: 1px solid #e5e5e5;
      border-bottom: 1px solid #e5e5e5;
    }
    .active {
      color: #00a0e9;
      background: #e2eef3;
      .el-icon {
        color: #00a0e9;
      }
    }
    a {
      display: flex;
      align-items: center;
      margin-top: 6px;
      padding-left: 22px;
      width: 190px;
      height: 40px;
      line-height: 40px;
      border-radius: 6px;
      cursor: pointer;
      .el-icon {
        color: #7c878e;
      }
      p {
        margin-top: 2px;
      }
      &:hover {
        color: #00a0e9;
        background: #e2eef3;
        .el-icon {
          color: #00a0e9;
        }
      }
      &:nth-child(2) {
        margin-bottom: 40px;
        position: relative;
        &::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -20px;
          width: 192px;
          height: 1px;
          background: #e5e5e5;
        }
      }
      &:nth-child(7) {
        position: relative;
        margin-bottom: 40px;
        &::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -20px;
          width: 192px;
          height: 1px;
          background: #e5e5e5;
        }
      }
    }
  }
}
</style>