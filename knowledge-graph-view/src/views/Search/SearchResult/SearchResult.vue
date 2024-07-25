<template>
  <div class="search-result-wrap">
    <div class="search-input-wrap">
      <el-input
        placeholder="请输入关键词"
        v-model="searchParams.keyword"
        class="input-select"
        @keydown.enter="search"
      />
      <div class="search-btn-class" @click="search">
        <img src="@/assets/imgs/search_icon.png" class="search-img-class" />
        <span class="search-text-class">搜索</span>
      </div>
    </div>
    <div class="result-list-class" v-loading="loading">
      <div class="result-header-class">
        <span class="result-total-class">
          为您找到相关结果约
          <span class="result-total-number"> {{ formatNumber(total) }}</span> 个， 搜索用时 (<span
            >{{ searchTime }}</span
          >秒)
        </span>
        <div class="action-btn-class">
          <span
            :class="searchParams.orderBy == 'default' ? 'selected-btn-class' : 'normal-btn-class'"
            @click="useNormalSort"
            >默认排序
          </span>
          <div
            :class="searchParams.orderBy != 'default' ? 'selected-btn-class' : 'normal-btn-class'"
            class="time-sort-class"
            @click="useTimeIncSort()"
          >
            按时间排序
            <div class="sort-desc-class">
              <div
                :class="
                  searchParams.orderBy == 'asc' ? 'triangle-up-selected' : 'triangle-up-normal'
                "
              ></div>
              <div
                :class="
                  searchParams.orderBy == 'desc' ? 'triangle-down-selected' : 'triangle-down-normal'
                "
              ></div>
            </div>
          </div>
        </div>
      </div>
      <div class="result-list-wrap">
        <div class="result-list-content" :style="{ height: listViewHeight }">
          <div v-if="searchData.length">
            <div v-for="(item, index) in searchData" :key="index" class="result-item-wrap">
              <div class="item-top">
                <WordHighlighter
                  :query="keyWordStr"
                  :textToHighlight="item.type == 'file' ? item.fileName : item.title"
                  :splitBySpace="true"
                  highlightClass="highlight-class"
                  wrapperClass="item-title-class"
                  :title="item.type == 'file' ? item.fileName : item.title"
                  @click="itemClick(item)"
                />
                <span class="item-file" v-if="item.type == 'file'" @click.stop="go2MainDoc(item)"
                  >查看主文档</span
                >
              </div>
              <div class="item-bottom">
                <span>知识分类：</span>
                <WordHighlighter
                  :query="keyWordStr"
                  :textToHighlight="item.knowledgeName"
                  :splitBySpace="true"
                  highlightClass="highlight-class"
                  wrapperClass="item-desc-class"
                  :title="item.knowledgeName"
                />
                <div class="line-class"></div>
                <span>作者：{{ item.author }}</span>
                <div class="line-class"></div>
                <span>创建时间：{{ item.createTime }}</span>
                <div class="line-class" v-if="item.type == 'title'"></div>
                <span v-if="item.type == 'title'"
                  >阅读数：{{ item.viewNum ? item.viewNum : '0' }}</span
                >
              </div>
            </div>
          </div>
          <NoData v-else />
        </div>
      </div>
      <div class="footer-wrap">
        <el-pagination
          v-model:current-page="searchParams.pageNum"
          v-model:page-size="searchParams.pageSize"
          :hideOnSinglePage="false"
          :page-sizes="[10, 20, 30, 40, 50, 100]"
          :pager-count="7"
          :total="total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useEmitt } from '@/hooks/web/useEmitt'
import { ElMessage } from 'element-plus'
import { onMounted, reactive, ref, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import WordHighlighter from 'vue-word-highlighter'
import { searchApi, updateViewNumApi } from '@/api/search/index'
import { Base64 } from 'js-base64'
import { useRouter } from 'vue-router'
import CryptoJS from 'crypto-js'

const router = useRouter()
const route = useRoute()
const loading = ref<boolean>(false)
useEmitt({
  name: 'window',
  callback: (type: string) => {
    if (type === 'resize') {
      resetListViewHeight()
    }
  }
})
//搜索结果
const searchData = ref<any>([])
const keyWordStr = ref<any>()
//查询参数
const searchParams = reactive<Recordable>({
  pageNum: 1,
  pageSize: 10,
  keyword: '',
  orderBy: 'default',
  orderField: 'createTime'
})
// 格式化数字串
const formatNumber = (val: number) => {
  const valTemp = val.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
  return valTemp
}
//搜索耗时
const searchTime = ref<number>()
// 搜索结果的总条数
const total = ref<any>(1)
//使用默认排序查询
const useNormalSort = () => {
  searchParams.orderBy = 'default'
  search()
}
//使用时间排序查询
const useTimeIncSort = () => {
  searchParams.orderBy =
    searchParams.orderBy == 'asc' ? 'desc' : searchParams.orderBy == 'desc' ? 'asc' : 'asc'
  search()
}
//搜索
const search = async () => {
  if (!searchParams.keyword) {
    ElMessage.warning('请输入关键词')
    return
  } else if (
    searchParams.keyword &&
    searchParams.keyword.length > 0 &&
    searchParams.keyword.indexOf(' ') !== -1 &&
    String(searchParams.keyword).trim() === ''
  ) {
    ElMessage.warning('不能输入纯空格')
  } else {
    loading.value = true
    let str = searchParams.keyword.split('')
    keyWordStr.value = str.join(' ')
    localStorage.setItem('keyword', searchParams.keyword)
    const res = await searchApi(searchParams)
    if (res) {
      loading.value = false
      searchData.value = res.data.data
      total.value = res.data.total
      searchTime.value = res.data.searchTime
    } else {
      loading.value = false
    }
  }
}
//每页展示数量改变
const handleSizeChange = (value: number) => {
  searchParams.pageSize = value
  searchParams.pageNum = 1
  search()
}
//页数改变
const handleCurrentChange = (value: number) => {
  searchParams.pageNum = value
  search()
}
//重置请求
const resetSearch = () => {
  searchParams.orderBy = ''
  searchParams.pageNum = 1
  searchParams.pageSize = 10
  searchParams.keyword = ''
  search()
}
onMounted(() => {
  resetListViewHeight()
})
//计算搜索结果列表的高度
const listViewHeight = ref<string>('300px')
const resetListViewHeight = () => {
  nextTick()
  setTimeout(() => {
    let headerH = 0
    const pageHeader = document.querySelector('.page-header')
    if (pageHeader && pageHeader.clientHeight) {
      headerH = pageHeader.clientHeight
    }
    let contentPadding = 0
    const pageContent = document.querySelector('.search-result-wrap')
    if (pageContent && pageContent.clientHeight) {
      let computedStyle = getComputedStyle(pageContent, null)
      if (computedStyle) {
        contentPadding = parseFloat(computedStyle.getPropertyValue('padding-top')) * 2 + 2
      }
    }
    let searchH = 0
    const searchWrap = document.querySelector('.search-input-wrap')
    if (searchWrap && searchWrap.clientHeight) {
      searchH = searchWrap.clientHeight
    }
    let listViewTop = 0
    const resultWrap = document.querySelector('.result-list-class')
    if (resultWrap && resultWrap.clientHeight) {
      let computedStyle = getComputedStyle(resultWrap, null)
      if (computedStyle) {
        listViewTop = parseFloat(computedStyle.getPropertyValue('margin-top'))
      }
    }
    let listViewHeaderH = 0
    const totalWrap = document.querySelector('.result-total-class')
    if (totalWrap && totalWrap.clientHeight) {
      listViewHeaderH = totalWrap.clientHeight
    }
    let listViewFooterH = 0
    const footerWrap = document.querySelector('.footer-wrap')
    if (footerWrap && footerWrap.clientHeight) {
      listViewFooterH = footerWrap.clientHeight
      let computedStyle = getComputedStyle(footerWrap, null)
      if (computedStyle) {
        listViewFooterH =
          listViewFooterH + parseFloat(computedStyle.getPropertyValue('margin-top')) * 2 + 2
      }
    }
    let paddingH = 0
    const listView = document.querySelector('.result-list-wrap')
    if (listView && listView.clientHeight) {
      let computedStyle = getComputedStyle(listView, null)
      if (computedStyle) {
        paddingH = parseFloat(computedStyle.getPropertyValue('padding-top')) * 2 + 2
      }
    }
    listViewHeight.value =
      document.body.clientHeight -
      headerH -
      contentPadding -
      searchH -
      listViewTop -
      listViewHeaderH -
      listViewFooterH -
      paddingH +
      'px'
  }, 200)
}
//item点击事件
const itemClick = async (item: any) => {
  if (item.type == 'file') {
    const viteUrl = import.meta.env.VITE_UPLOAD_URL
    // 打开新窗口
    window.open(viteUrl + '/onlinePreview?url=' + encodeURIComponent(Base64.encode(item.fileUrl)))
    await updateViewNumApi({ titleId: item.titleId })
  } else {
    const { href } = router.resolve({
      path: `/myDetail/${item.titleId}`
    })
    window.open(href, '_blank')
  }
}
//查看主文档
const go2MainDoc = async (item: any) => {
  const { href } = router.resolve({
    path: `/myDetail/${item.titleId}`
  })
  window.open(href, '_blank')
}
//监听传值
watch(
  () => route,
  () => {
    if (route.name == 'SearchResult') {
      if (route.params.keyword) {
        let keyWord: string = route.params.keyword as string
        let str = CryptoJS.AES.decrypt(decodeURIComponent(keyWord.replaceAll('*', '%')), '888888')
        searchParams.keyword = str.toString(CryptoJS.enc.Utf8)
        search()
      }
    }
  },
  { immediate: true, deep: true }
)
//监听传值
// watch(
//   () => searchParams.keyword,
//   () => {
//     if (searchParams.keyword != '') {
//       let str = searchParams.keyword.split('')
//       keyWordStr.value = str.join(' ')
//       console.log('keyWordStr=>', keyWordStr.value)
//     }
//   },
//   { immediate: true, deep: true }
// )
</script>
<style lang="less" scoped>
:deep(.el-input .el-input__wrapper:hover) {
  box-shadow: 0px 0px 6px 0px rgba(46, 46, 46, 0.07) !important;
  border-radius: 6px 0px 0px 6px !important;
  border: 1px solid #00a0e9 !important;
}
.search-result-wrap {
  width: 100%;
  height: 100%;
  background: #f4f4f4;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-top: 35px;
  padding-bottom: 40px;
  padding-left: 18%;
  padding-right: 18%;
}
.search-input-wrap {
  display: flex;
  height: 50px;
  .input-select {
    flex: 1;
    height: 50px !important;
    background: #ffffff;
    box-shadow: 0px 0px 6px 0px rgba(46, 46, 46, 0.07);
    border-radius: 6px 0px 0px 6px;
    .el-input__wrapper {
      border-radius: 0px !important;
    }
  }
  .search-btn-class {
    width: 120px;
    height: 50px;
    background: #00a0e9;
    border-radius: 0px 6px 6px 0px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    .search-img-class {
      width: 14px;
      height: 14px;
      justify-items: center;
      margin-top: 18px;
    }
    .search-text-class {
      font-family: Microsoft YaHei;
      font-weight: 400;
      font-size: 16px;
      color: #fefefe;
      margin-left: 5px;
      line-height: 50px;
    }
  }
  .search-btn-class:hover {
    background: rgba(0, 160, 233, 0.8) !important;
  }
}
.result-list-class {
  flex: 1;
  background: #ffffff;
  border-radius: 2px;
  margin-top: 35px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .result-header-class {
    height: 60px;
    margin-left: 40px;
    margin-right: 40px;
    border-bottom: 1px solid #f1f2f4;
    display: flex;
    .result-total-class {
      flex: 1;
      font-family: Microsoft YaHei;
      font-weight: 400;
      font-size: 14px;
      color: #333333;
      line-height: 60px;
      .result-total-number {
        color: #00a0e9;
      }
    }
    .action-btn-class {
      margin-top: 12px;
      height: 36px;
      display: flex;
    }
  }
  .result-list-wrap {
    border-bottom: 1px solid #f1f2f4;
    //padding: 5px;
    .result-list-content {
      width: 100%;
      overflow-y: auto;
    }
  }
}
.normal-btn-class {
  font-family: Microsoft YaHei;
  font-weight: 400;
  font-size: 14px;
  color: #333333;
  line-height: 36px;
  height: 36px;
  padding: 0px 14px;
  background: #ffffff;
  border-radius: 0px;
  cursor: pointer;
}
.selected-btn-class {
  font-family: Microsoft YaHei;
  font-weight: 400;
  font-size: 14px;
  background: #e7f8ff;
  border-radius: 6px;
  color: #00a0e9;
  line-height: 36px;
  height: 36px;
  padding: 0px 14px;
  cursor: pointer;
}
.time-sort-class {
  display: flex;
  margin-left: 5px;
}
.sort-desc-class {
  height: 12px;
  display: flex;
  margin-left: 5px;
  margin-top: 12px;
  flex-direction: column;
  justify-content: space-between;
}
.triangle-up-normal {
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 6px solid #969aa2;
}
.triangle-up-selected {
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 6px solid #00a0e9;
}
.triangle-down-normal {
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid #969aa2;
}
.triangle-down-selected {
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid #00a0e9;
}
.footer-wrap {
  margin-top: 10px;
  margin-bottom: 10px;
  padding-top: 8px;
  padding-right: 20px;
  padding-bottom: 8px;
  text-align: center;
  display: flex;
  justify-content: end;
  background: #fff;
  font-size: 15px;
  color: #222222;
}
.result-item-wrap {
  padding: 30px 35px;
  border-bottom: 1px solid #f1f2f4;
  //cursor: pointer;
  //margin: 0 2px;
}
//.result-item-wrap:hover {
//  border-radius: 6px;
//  background: #f1f2f4;
//  border-right: 6px;
//  margin: 0 2px;
//}
.no-data {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .no-data-cotent-wrap {
    text-align: center;
    .no-data-text-class {
      margin-top: 5px;
      font-size: 16px;
      color: #999999;
    }
  }
}
.item-title-class {
  max-width: 800px;
  font-weight: 400;
  font-size: 22px;
  color: #00a0e9;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  &:hover {
    color: #0db3ff !important;
    text-decoration-line: underline !important;
  }
  &:active {
    color: #0092d4 !important;
    text-decoration-line: underline !important;
  }
}
.item-bottom {
  display: flex;
  width: 100%;
  margin-top: 5px;
  font-size: 14px;
  color: #666666;
  align-items: center;
}
.item-top {
  display: flex;
  width: 100%;
  align-items: center;
}
.item-file {
  width: 92px;
  height: 24px;
  border-radius: 6px;
  border: 1px solid #00a0e9;
  font-family: Microsoft YaHei;
  font-weight: 400;
  font-size: 14px;
  text-align: center;
  color: #00a0e9;
  margin-left: 10px;
  cursor: pointer;
  &:hover {
    border-radius: 6px;
    border: 1px solid #99d9f6;
    color: #0db3ff;
  }
  &:active {
    border-radius: 6px;
    color: #0092d4;
    border: 1px solid #00a0e9;
  }
}
.item-desc-class {
  font-size: 14px;
  color: #666666;
  max-width: 600px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  //&:hover {
  //  color: #0db3ff;
  //  text-decoration-line: underline !important;
  //}
  //&:active {
  //  color: #0092d4 !important;
  //  text-decoration-line: underline !important;
  //}
}
.line-class {
  width: 1px;
  height: 12px;
  background: #dedede;
  margin-left: 10px;
  margin-right: 10px;
}
:deep(.input-select .el-input__wrapper) {
  border-radius: 6px 0px 0px 6px;
  border: 0 !important;
  box-shadow: 0px 0px 6px 0px rgba(46, 46, 46, 0.07);
}
</style>
<style lang="less">
.highlight-class {
  color: #ee2222 !important;
  background-color: transparent !important;
}
.input-select {
  .el-input__wrapper {
    // border-radius: 0px !important;
  }
}
.page-wrap {
  .el-pagination.is-background .el-pager li {
    background-color: transparent !important;
    font-size: 15px !important;
    color: #222222 !important;
  }
  .el-pagination.is-background .el-pager li.is-active {
    background-color: #00a0e9 !important;
    font-size: 15px !important;
    color: #ffffff !important;
  }
  .el-pagination.is-background .btn-prev {
    background-color: transparent !important;
  }
  .el-pagination.is-background .btn-next {
    background-color: transparent !important;
  }
  .el-pagination__total {
    font-size: 15px !important;
    color: #222222 !important;
  }
  .el-pagination .el-input__inner {
    font-size: 15px !important;
    color: #222222 !important;
  }
  .el-pagination__jump {
    font-size: 15px !important;
    color: #222222 !important;
  }
}
</style>