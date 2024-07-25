<template>
  <section>
    <div class="home">
      <RightHead />
      <div class="header-title">
        <h4></h4>
        <h3>知识图谱系统</h3>
      </div>
      <div class="content">
        <div>
          <div class="content-search">
            <el-input
              placeholder="请输入搜索关键词"
              v-model="searchKey"
              class="input-select"
              @keydown.enter="go2Search"
            />
            <div class="btn push-button" @click="go2Search">
              <Icon class="mr-4px" icon="svg-icon:home_search_icon" />
              搜索
            </div>
            <div class="btn up-btn push-button" @click="isShowUpload(true)">
              <Icon class="mr-4px" icon="svg-icon:home_upload_icon" />
              上传文件
            </div>
          </div>
          <!-- <ul class="content-list">
            <li
              v-for="(item, index) in listData"
              :key="index"
              :class="activeRef == item.value ? 'active' : ''"
              @click="changeActive(item.value)"
            >
              {{ item.label }}</li
            >
          </ul> -->
        </div>
        <div class="header-documents-number">
          <div class="all">
            <h3>总文档数</h3>
            <ul>
              <li
                v-for="(item, index) in homeData.fileTotal.toLocaleString()"
                :key="index"
                :class="item == ',' ? 'point' : 'number'"
              >
                {{ item }}
              </li>
            </ul>
            <!-- <p class="tip">本月更新 268 份文档</p> -->
          </div>
          <div class="frame">
            <div>
              <p>{{ homeData.viewTotal.toLocaleString() }}</p>
              <p>本月浏览</p>
            </div>
            <div>
              <p>{{ homeData.downloadTotal.toLocaleString() }}</p>
              <p>本月下载</p>
            </div>
          </div>
        </div>
      </div>
      <div class="copyright"
        >Copyright @ www.mgdaas.com, All Rights Reserved. 山东麦港数据系统有限公司
      </div>
      <!-- <div class="animated animate-slide-in-right animate-duration-3000 bg-red-500 w-50px"
        >1111</div
      > -->
    </div>
    <UserForm title="上传图片" ref="userFormRef" />
    <Upload v-if="uploadFlag" @is-show-upload="isShowUpload" />
  </section>
</template>
<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { RightHead } from '@/components/RightHead'
import UserForm from './components/UserForm.vue'
import Upload from '@/views/Personal/components/Upload.vue'
import { ElInput } from 'element-plus'
import { ref } from 'vue'
import { getHomeTotalApi } from '@/api/home'
import router from '@/router'
import { Base64 } from 'js-base64'
import CryptoJS from 'crypto-js'

const homeData = ref({
  fileTotal: 0,
  viewTotal: 0,
  downloadTotal: 0
})
const uploadFlag = ref(false)
const isShowUpload = (val) => {
  uploadFlag.value = val
}
const activeRef = ref('1')
const userFormRef = ref<ComponentRef<typeof UserForm>>()
const listData = ref([
  {
    label: '全部',
    value: '1'
  },
  {
    label: '文档',
    value: '2'
  },
  {
    label: '图片',
    value: '3'
  },
  {
    label: '视频',
    value: '4'
  },
  {
    label: '音频',
    value: '5'
  },
  {
    label: '作者',
    value: '6'
  }
])
const initHome = async () => {
  let res = await getHomeTotalApi()
  if (res && res.data) {
    homeData.value = res.data
  }
  // homeData.value.fileTotal = 19988289
  console.log(res)
}
initHome()
//搜索
const searchKey = ref<string>('')
const go2Search = () => {
  if (!searchKey.value) {
    ElMessage.warning('请输入关键词')
    return
  } else if (
    searchKey.value &&
    searchKey.value.length > 0 &&
    searchKey.value.indexOf(' ') !== -1 &&
    String(searchKey.value).trim() === ''
  ) {
    ElMessage.warning('不能输入纯空格')
  } else {
    const { href } = router.resolve({
      path: `/Search/searchResult/${encodeURIComponent(
        CryptoJS.AES.encrypt(searchKey.value, '888888').toString()
      ).replaceAll('%', '*')}`
    })
    window.open(href, '_blank')
  }
}
</script>
<style scoped lang="less">
section {
  overflow: auto;
  height: 100vh;
  background: url('@/assets/imgs/home/bg.png');
  background-size: cover;
}
.home {
  position: relative;
  height: 100vh;
}
.header-title {
  padding-top: 146px;
  display: flex;
  align-items: center;
  justify-content: center;
  h4 {
    width: 49.0003px;
    height: 49.0003px;
    margin-right: 13.0003px;
    background: url('@/assets/imgs/home/logo.png');
    background-size: 100% 100%;
  }
  h3 {
    font-family: Microsoft YaHei;
    font-weight: bold;
    font-size: 36px;
    color: #222222;
    line-height: 80px;
  }
}
.content-search {
  margin: 30px auto 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 944.0006px;
  height: 50.0006px;
}
.content-list {
  margin: 15.9994px auto 0;
  width: 944.0006px;
  display: flex;
  align-items: center;
  li {
    cursor: pointer;
    width: 99.9994px;
    height: 36px;
    border-radius: 6px;
    text-align: center;
    line-height: 36px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    font-size: 15.9994px;
    transition: 0.5s;
  }
  .active {
    line-height: 34px;
    color: #00a0e9;
    border: 1px solid #00a0e9;
    transition: 0.5s;
  }
}
.header-documents-number {
  margin-top: 80.0006px;
  display: flex;
  flex-direction: column;
  align-items: center;
  .all {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 513.9994px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    font-size: 15.9994px;
    color: #666666;
    h3 {
      font-family: Microsoft YaHei;
      font-weight: 400;
      font-size: 26.0006px;
      color: #333333;
    }
    ul {
      padding: 12px 0 14.0006px;
      display: flex;
      li {
        width: 43.0003px;
        height: 73.0003px;
        font-family: Arial;
        font-weight: bold;
        line-height: 73.0003px;
        text-align: center;
        font-size: 26.0006px;
        color: #00a0e9;
      }
      .number {
        background: url('@/assets/imgs/home/num_bg.png');
        background-size: 100% 100%;
      }
      .point {
        width: 18px;
      }
    }
    .tip {
      font-family: Microsoft YaHei;
      font-weight: 400;
      font-size: 15.9994px;
      color: #666666;
      margin-bottom: 30px;
      text-align: center;
    }
    margin-bottom: 30px;
  }
  .frame {
    display: flex;
    padding: 15.001px 0px;
    width: 513.9994px;
    border-radius: 9.9994px;
    border: 1.0003px solid #d9e9f5;
    div {
      flex: 1;
      border-right: 1.0003px solid #d9e9f5;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      &:last-child {
        border-right: 0;
      }
      p {
        text-align: center;
        &:nth-child(1) {
          font-family: Arial;
          font-weight: 400;
          font-size: 24px;
          color: #00a0e9;
        }
        &:nth-child(2) {
          font-family: Microsoft YaHei;
          font-weight: 400;
          font-size: 15.9994px;
          color: #888888;
        }
      }
    }
  }
  .my-points {
    padding-top: 39.9994px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    font-size: 15.9994px;
    color: #666666;
    span {
      margin-left: 4.9997px;
      font-size: 24px !important;
      color: #00a0e9 !important;
    }
  }
}
.copyright {
  padding-top: 220px;
  width: 100%;
  text-align: center;
  margin: 0 auto;
  padding-bottom: 20px;
  // position: absolute;
  // bottom: 27.9994px;
  // left: 50%;
  // transform: translateX(-50%);
}
:deep(.btn) {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 160px !important;
  height: 50px !important;
  margin-left: -2px;
  background: #00a0e9;
  border-radius: 0px 6px 6px 0px !important;
  font-family: Microsoft YaHei;
  font-weight: 400;
  font-size: 16px;
  color: #fefefe;
  cursor: pointer;
  z-index: 9;
  &:nth-child(1) {
    border-left: 0 !important;
  }
}
:deep(.up-btn) {
  margin-left: 14px;
  border-radius: 6px 6px 6px 6px !important;
}
:deep(.input-select) {
  height: 50px !important;
}
:deep(.input-select .el-input__wrapper) {
  border-radius: 6px 0px 0px 6px;
  border: 1px solid rgba(46, 46, 46, 0.07);
  padding-left: 20px !important;
  box-shadow: 0px 0px 6px 0px rgba(46, 46, 46, 0.07);
}
:deep(.input-select .el-input__wrapper:hover) {
  background: #ffffff;
  box-shadow: 0px 0px 6px 0px rgba(46, 46, 46, 0.07);
  border-radius: 6px 0px 0px 6px;
  border: 1px solid #00a0e9;
}
:deep(.input-select .el-input__wrapper input::placeholder) {
  font-family: Microsoft YaHei;
  font-weight: 400;
  font-size: 16px;
  color: #999999;
  line-height: 80px;
}
:deep(.input-select .el-input__wrapper:hover) {
  box-shadow: 0px 0px 6px 0px rgba(46, 46, 46, 0.15);
}
</style>