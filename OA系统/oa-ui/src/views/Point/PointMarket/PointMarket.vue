<!-- 积分商城首页 -->
<template>
  <div :style="{ height: height }" class="classroom-wrap">
    <div ref="selWrap" class="sel-wrap">
      <div v-if="isAuth('point:market:query')" class="sel-left">
        <el-input
          v-model="searchParams.goodsName"
          placeholder="商品名称查询"
          :maxlength="30"
          class="input-class"
        />
        <el-button class="ml-[10px]" type="primary" @click="initData">查询</el-button>
        <el-button class="ml-[8px]" plain @click="reset">重置</el-button>
      </div>
      <div class="sel-right">
        <span v-if="isAuth('point:market:add')" @click="addGoods"> 添加商品 </span>
      </div>
    </div>
    <div :style="{ height: contentHeight }" class="classroom-content-wrap">
      <div v-if="goodsArray.length" class="mt-[12px]">
        <div class="ivu-row">
          <div v-for="(item, index) in goodsArray" :key="index" class="ivu-col">
            <div class="col-box">
              <div
                class="img-box-sub"
                :class="isAuth('point:market:edit') ? 'img-box' : 'img-box-sub'"
              >
                <div :class="isAuth('point:market:edit') ? 'mask' : ''">
                  <img
                    class="cover-img"
                    :src="item.coverUrl ? item.coverUrl : getBannerPicture()"
                    alt=""
                    @click="go2detail(item)"
                    @error="setBannerImage"
                  />
                </div>
                <div class="operate">
                  <div class="button-wrap" @click="editGoods(item)">
                    <img alt="" src="@/assets/imgs/icon/edit_icon.png" />
                  </div>
                  <div class="button-wrap" @click="deleteGoods(item)">
                    <img alt="" src="@/assets/imgs/icon/delete_icon.png" />
                  </div>
                </div>
              </div>

              <div class="time-box">
                <div class="w-[65%]">
                  <p class="detail-p" :title="item.name">
                    <span class="title">{{ item.name ? item.name : '--' }}</span>
                  </p>
                  <p class="mt-[5px]"
                    ><span class="price" v-if="item.cash">￥{{ item.cash }} </span>
                    <span v-else>--</span></p
                  >
                </div>

                <span class="exchange-button" @click="exchangeGoods(item)"> 兑换 </span>
              </div>
            </div>
          </div>
        </div>

        <!-- <el-row>
          <el-col
            :xs="6"
            :sm="4"
            :md="4"
            :lg="3"
            :xl="3"
            v-for="(item, index) in goodsArray"
            :key="index"
            class="ivu-col"
          >
            <div class="col-box">
              <div
                class="img-box-sub"
                :class="isAuth('point:market:edit') ? 'img-box' : 'img-box-sub'"
              >
                <div :class="isAuth('point:market:edit') ? 'mask' : ''">
                  <img
                    class="cover-img"
                    :src="item.coverUrl ? item.coverUrl : getBannerPicture()"
                    alt=""
                    @click="go2detail(item)"
                    @error="setBannerImage"
                  />
                </div>
                <div class="operate">
                  <div class="button-wrap" @click="editGoods(item)">
                    <img alt="" src="@/assets/imgs/icon/edit_icon.png" />
                  </div>
                  <div class="button-wrap" @click="deleteGoods(item)">
                    <img alt="" src="@/assets/imgs/icon/delete_icon.png" />
                  </div>
                </div>
              </div>
              <div class="time-box">
                <div class="w-[65%]">
                  <p class="detail-p" :title="item.name">
                    <span class="title">{{ item.name ? item.name : '--' }}</span>
                  </p>
                  <p class="mt-[5px]"
                    ><span class="price" v-if="item.cash">￥{{ item.cash }} </span>
                    <span v-else>--</span></p
                  >
                </div>

                <span class="exchange-button" @click="exchangeGoods(item)"> 兑换 </span>
              </div>
            </div>
          </el-col>
        </el-row> -->
      </div>
      <div v-else class="no-data">
        <div>
          <img alt="" src="@/assets/imgs/project/nodata_icon.png" />
          <p style="letter-spacing: 1px">亲，没有你想要的数据~</p>
        </div>
      </div>
    </div>
  </div>

  <GoodsForm ref="goodsFormRef" :title="goodsTitle" />
  <ExchangeGoodsForm ref="exchangeGoodsFormRef" />
</template>

<script lang="ts" setup>
import { ContentWrap } from '@/components/ContentWrap'
import { useEmitt } from '@/hooks/web/useEmitt'
import { useAppStore } from '@/store/modules/app'
import { nextTick, onMounted, reactive, ref } from 'vue'
import { isAuth } from '@/utils/is'
import { GoodsForm, ExchangeGoodsForm } from '../Form'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getPointMarketListApi, delGoodsApi } from '@/api/point'

defineOptions({
  name: 'PointMarket'
})

const getBannerPicture = () => {
  return new URL(`../../../../assets/imgs/default_pic3.png`, import.meta.url).href
}

const setBannerImage = async (e: any) => {
  const avatar = await import('@/assets/imgs/default_pic3.png')
  e.target.src = avatar.default
}

//监听刷新
useEmitt({
  name: 'pointMarket',
  callback: (type: string) => {
    if (type === 'refresh') {
      reset()
    }
  }
})

const appStore = useAppStore()

//监听窗口高度变化
useEmitt({
  name: 'window',
  callback: (type: string) => {
    if (type === 'resize') {
      resetPageHeight()
    }
  }
})
//页面高度
const height = ref('auto' as string)
const contentHeight = ref('auto' as string)
const selWrap = ref()
//重置页面高度
const resetPageHeight = () => {
  //底部高度
  let layoutContentH = 0
  const layoutContent = document.querySelector('.v-layout-content-scrollbar')
  if (layoutContent) {
    layoutContentH = layoutContent.clientHeight
  }
  let padding = 0
  const appcontent = document.getElementById('app-content')
  if (appcontent) {
    let computedStyle = getComputedStyle(appcontent, null)
    if (computedStyle) {
      padding = parseFloat(computedStyle.getPropertyValue('padding-top'))
    }
  }
  if (selWrap.value.clientHeight) {
    let computedStyle = getComputedStyle(selWrap.value, null)
    if (computedStyle) {
      padding = padding + parseFloat(computedStyle.getPropertyValue('margin-top'))
    }
  }
  const classroomContent = document.querySelector('.classroom-content-wrap')
  if (classroomContent) {
    let computedStyle = getComputedStyle(classroomContent, null)
    if (computedStyle) {
      padding = padding + parseFloat(computedStyle.getPropertyValue('margin-top'))
    }
  }
  contentHeight.value = layoutContentH - selWrap.value.clientHeight - padding - 10 + 'px'
}
onMounted(() => {
  resetPageHeight()
  reset()
})

const searchParams = reactive<Recordable>({
  goodsName: ''
})
const goodsArray = ref<any>([])
//查询商品信息
const initData = async () => {
  let param = {
    name: searchParams.goodsName ? searchParams.goodsName : null
  }
  await getPointMarketListApi(param)
    .then((res) => {
      goodsArray.value = []
      goodsArray.value = res.data && res.data.length ? res.data : []
    })
    .catch(() => {})
    .finally(() => {})
}

//重置
const reset = () => {
  searchParams.goodsName = ''
  initData()
}

//添加商品
const goodsTitle = ref<string>('添加')
const goodsFormRef = ref()
const addGoods = () => {
  goodsTitle.value = '添加'
  goodsFormRef.value.openDrawer('', 'add')
}

//编辑商品
const editGoods = (item: any) => {
  goodsTitle.value = '编辑'
  goodsFormRef.value.openDrawer(item.id, 'edit')
}

//删除商品
const deleteGoods = async (item: any) => {
  ElMessageBox.confirm('商品删除后不可恢复，是否删除该商品？', '删除提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    autofocus: false
  }).then(() => {
    delGoodsApi(item.id).then((res: any) => {
      if (res) {
        nextTick()
        ElMessage.success('商品删除成功')
        reset()
      }
    })
  })
}

//兑换
const exchangeGoodsFormRef = ref()
const exchangeGoods = (item: any) => {
  exchangeGoodsFormRef.value.openDrawer(item.id, 'exchange')
}

//商品详情
const go2detail = (item: any) => {
  exchangeGoodsFormRef.value.openDrawer(item.id, 'see')
}
</script>

<style lang="less" scoped>
.classroom-wrap {
  .sel-wrap {
    display: flex;
    margin-top: 10px;
    align-items: center;
    justify-content: space-between;
    margin-left: 14px;
    margin-right: 9px;
    font-size: 15px;
    overflow: hidden;

    .sel-left {
      display: flex;
      align-items: center;

      span {
        min-width: 55px;
        font-weight: 600;
      }

      .sel-title {
        color: #666666;
      }

      .input-class {
        width: 12vw;
        height: 36px;
        line-height: 36px;
      }
    }
  }
  .sel-right {
    span {
      display: inline-block;
      background: #00a0e9;
      color: #ffffff;
      height: 36px;
      padding: 0px 1.2vw;
      margin: 0 3px;
      line-height: 36px;
      text-align: center;
      cursor: pointer;
      font-size: 1em;
      border: 1px solid #e2e2e2;
      border-radius: 18px;
      font-family: Alibaba PuHuiTi R;
      font-weight: 400;
    }
  }
}

.classroom-content-wrap {
  padding-bottom: 10px;
  margin: 20px 10px 0px 10px;
  overflow: hidden;
  overflow-y: auto;
}

.no-data {
  height: 100%;
  display: flex;
  align-items: center;
  color: #444;
}

.no-data {
  div {
    display: grid;
    justify-content: center;
    text-align: center;
    width: 100%;

    img {
      width: 150px;
    }

    p {
      padding-top: 15px;
      font-size: 15px;
    }
  }
}

:deep(.el-input__wrapper) {
  height: 36px;
  line-height: 36px;
}

.ivu-row {
  margin: 0 !important;
  display: flex;
  flex-flow: row wrap;
  width: 100%;
}

.ivu-col {
  width: 14.2%;
  height: auto;
  margin-bottom: 15px;

  .col-box {
    margin-right: 3%;
    margin-left: 3%;
  }

  // &:nth-child(7n + 1) {
  //   .col-box {
  //     margin-left: 0 !important;
  //   }
  // }

  // &:nth-child(7n + 7) {
  //   .col-box {
  //     margin-right: 0 !important;
  //   }
  // }
  .col-box {
    height: 100%;
    overflow: hidden;
    position: relative;
    box-shadow: 0px 3px 4px 0px rgba(31, 31, 31, 0.2);
    border-radius: 4px;
    background-color: #fff;

    &:hover {
      box-shadow: 0px 0px 8px rgb(158, 159, 160);
    }

    .type-p {
      position: absolute;
      top: 10px;
      left: 10px;
      font-size: 12px;

      .type {
        display: inline-block;
        background: #0469d8;
        color: #fff;
        padding: 4px 9px 4px 9px;
        border-radius: 4px;
      }

      .select {
        background: #fe5252;
        color: #fff;
        padding: 4px 9px 4px 9px;
        margin-left: 5px;
        border-radius: 4px;
      }

      .normal {
        background-color: #e2b17c;
        color: #fff;
        margin-left: 5px;
        padding: 4px 9px 4px 9px;
        border-radius: 4px;
      }
    }

    .img-box {
      margin: 18px;
    }
    .img-box-sub {
      margin: 18px;
    }
    .mask {
      position: relative;
    }
    .mask:after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.3);
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    .mask:hover:after {
      opacity: 1;
    }
    .cover-img {
      padding: 5px;
      width: 100%;
      cursor: pointer;
      aspect-ratio: 1;
      background-color: white;
      opacity: 1;
      transition: background-color 0.3s ease;
    }
    .operate {
      top: 28px;
      right: 28px;
      position: absolute;
      opacity: 0;
      display: flex;
      font-size: 12px;
      transition: 0.3s;
      -webkit-transition: 0.5s;
      -moz-transition: 0.5s;
    }
    .img-box:hover .operate {
      opacity: 1;
    }
    .button-wrap {
      margin-left: 5px;
      width: 30px;
      height: 30px;
      background: #def5ff;
      opacity: 0.9;
      border-radius: 4px;
      img {
        margin-left: 8px;
        margin-top: 8px;
        width: 14px;
        height: 14px;
        cursor: pointer;
      }
    }

    .time-box {
      padding-left: 20px;
      padding-right: 20px;
      padding-bottom: 20px;
      display: flex;
      color: #666666;
      font-size: 15px;
      font-weight: 500;
      justify-content: space-between;
      align-items: center;
      .title {
        min-height: 16px;
        color: #333333;
        font-size: 1.5vh;
        font-weight: 600;
        line-height: 16px;
        overflow: hidden;
        display: -webkit-box;
        text-overflow: ellipsis;
        word-break: break-word;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
      }
      .price {
        margin-left: 2px;
        color: #ffb200;
        font-size: 1.7vh;
        font-weight: 600;
      }
    }
  }
}
.exchange-button {
  width: 35%;
  // height: 3.7vh;
  // line-height: 3.7vh;
  padding: 0.65vh 0vh;
  text-align: center;
  cursor: pointer;
  font-size: 1.4vh;
  border: 1px solid #e2e2e2;
  border-radius: 18px;
  font-family: Alibaba PuHuiTi R;
  font-weight: 400;
  background: #00a0e9;
  color: #ffffff;
}
</style>
