<template>
  <Dialog
    ref="elDialogRef"
    class="market-dialog"
    v-model="dialogFlag"
    title="商品兑换"
    :maxHeight="'auto'"
    @toggle-full="toggleFull"
    @closed="resetFormAfterClose"
  >
    <div class="flex w-full">
      <div class="left-form-class">
        <!-- :style="{ height: divHeight + 'px' }" -->
        <div>
          <!-- height: divHeight - 90 + 'px' -->
          <Swiper
            :style="{
              '--swiper-navigation-color': '#fff',
              '--swiper-pagination-color': '#fff'
            }"
            :spaceBetween="10"
            :thumbs="{ swiper: thumbsSwiper }"
            :modules="modules"
            class="mySwiper2"
            :navigation="true"
          >
            <SwiperSlide v-for="(item, index) of ruleForm.files" :key="index">
              <div class="img-wrap">
                <img class="img" :src="item" @error="setBannerImage"/>
              </div>
            </SwiperSlide>
          </Swiper>
          <Swiper
            @swiper="setThumbsSwiper"
            :spaceBetween="10"
            :slidesPerView="5"
            :freeMode="true"
            :observer="true"
            :observeParents="true"
            :watchSlidesProgress="true"
            :modules="modules"
            class="mySwiper"
          >
            <SwiperSlide v-for="(item, index) of ruleForm.files" :key="index">
              <div class="img-wrap">
                <img class="img" :src="item" @error="setBannerImage"/>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
      <div class="right-form-class flex">
        <div class="right-close-class">
          <div style="margin: auto"> </div>
          <div class="pl-[5px] pr-[5px] cursor-pointer" @click="closeDialog">
            <Icon class="is-hover z-10 mt-5px" icon="svg-icon:close_icon_dialog" :size="14" />
          </div>
        </div>

        <p class="goods-name">{{ ruleForm.name }}</p>
        <p class="goods-price" v-if="ruleForm.cash"
          >￥<span>{{ ruleForm.cash }}</span>
        </p>
        <!-- <p class="goods-desc">
          非分销场景下，指平台活动（不含分销场景的活动）预热期（若无预热期，则为爆发期）前的商品销售价格；（2）分销场景下，专指分销活动预热期（若无预热期，则为爆发期）前的商品销售价格。
          前述价格未计算平台发放的各种采购津贴、跨店券、红包等优惠。
        </p> -->
        <p class="goods-quantity" v-if="pageFlag == 'exchange'">
          数量
          <el-input-number
            v-model="quantity"
            :min="1"
            :max="100"
            :step="1"
            :step-strictly="true"
            class="input-class"
          />
        </p>

        <div class="button-wrap" v-if="pageFlag == 'exchange'">
          <el-button class="dialog-btn-sure exchange-button" :loading="loading" @click="exchange">
            兑换
          </el-button>
        </div>
      </div>
    </div>
    <ExchangeSuccess
      ref="exchangeSuccessRef"
      @cancel-click="closeDialog"
      @sure-click="toExchangeRecord"
    />
  </Dialog>
</template>
<script setup lang="ts">
import { ref, nextTick, reactive, computed } from 'vue'
import { propTypes } from '@/utils/propTypes'
import { useValidator } from '@/hooks/web/useValidator'
import { FormSchema } from '@/types/form'
import { Dialog } from '@/components/Dialog'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'
import { FreeMode, Navigation, Thumbs } from 'swiper'
import { useEmitt } from '@/hooks/web/useEmitt'
import { useAppStore } from '@/store/modules/app'
import { ElMessage } from 'element-plus'
import { ExchangeSuccess } from '../Form'
import { useRouter } from 'vue-router'
import { getGoodsDetailApi, exchangeGoodsApi } from '@/api/point'

const router = useRouter()

const appStore = useAppStore()
// 视窗高度
const documentClientHeight = computed(() => appStore.getDocumentClientHeight)
const modules = [Thumbs, FreeMode, Navigation]

const quantity = ref<number>(1)

const thumbsSwiper = ref<any>(null)

const setThumbsSwiper = (swiper: any) => {
  nextTick()
  thumbsSwiper.value = swiper
}

const { emitter } = useEmitt({
  name: 'window',
  callback: (type: string) => {
    if (type === 'resize') {
      resetHeight()
    }
  }
})

const divHeight = ref<number>(300)
//弹窗
const elDialogRef = ref()
const resetHeight = () => {
  if (elDialogRef.value.isFullscreen) {
    divHeight.value = documentClientHeight.value - 58 - 80
  } else {
    divHeight.value = (documentClientHeight.value - 58 - 80) * 0.7 - 10
  }
}

//全屏
const toggleFull = (isFull: boolean) => {
  if (isFull) {
    divHeight.value = documentClientHeight.value - 58 - 80
  } else {
    divHeight.value = (documentClientHeight.value - 58 - 80) * 0.7 - 10
  }
}

// 弹窗的开启和关闭
const dialogFlag = ref<any>(false)
const detailsId = ref<string>('')
const pageFlag = ref<string>('see')
//打开drawer并初始化
const openDrawer = (id: string, flag: string) => {
  dialogFlag.value = true
  elDialogRef.value.isFullscreen = false
  nextTick()
  quantity.value = 1
  pageFlag.value = flag
  detailsId.value = id
  getDetailsData()
}

const ruleForm = ref<any>({
  name: '',
  cash: '',
  coverUrl: '',
  pictureUrl: '',
  files: []
})
//查询详情
const getDetailsData = async () => {
  if (detailsId.value) {
    await getGoodsDetailApi(detailsId.value)
      .then((res) => {
        if (res) {
          let files = res.data.files
          ruleForm.value.name = res.data.name ? res.data.name : ''
          ruleForm.value.cash = res.data.cash ? res.data.cash : ''
          ruleForm.value.coverUrl = res.data.coverUrl ? res.data.coverUrl : ''
          ruleForm.value.files = []
          ruleForm.value.files.push(ruleForm.value.coverUrl)
          if (files && files.length) {
            files.forEach((element: any) => {
              ruleForm.value.files.push(element.url)
            })
          }
        }
      })
      .catch(() => {})
      .finally(() => {
        setTimeout(() => {
          if (thumbsSwiper.value && thumbsSwiper.value.visibleSlides.length) {
            thumbsSwiper.value.visibleSlides[0].setAttribute(
              'class',
              'swiper-slide swiper-slide-visible swiper-slide-thumb-active'
            )
          }
        }, 200)
      })
  }
}

//关闭
const closeDialog = () => {
  dialogFlag.value = false
}
//清空表单
const resetForm = () => {
  ruleForm.value = {
    name: '',
    cash: '',
    coverUrl: '',
    pictureUrl: '',
    files: []
  }
}
//关闭后清空
const resetFormAfterClose = () => {
  dialogFlag.value = false
  if (elDialogRef.value) {
    elDialogRef.value.isFullscreen = false
  }
  thumbsSwiper.value = null
  resetForm()
}
//兌換
const exchangeSuccessRef = ref()
const loading = ref<boolean>(false)
const exchange = async () => {
  setTimeout(async () => {
    if (quantity.value) {
      loading.value = true
      let params = {
        shopId: detailsId.value,
        num: quantity.value
      }
      await exchangeGoodsApi(params)
        .then((res: any) => {
          if (res) {
            emitter.emit('exchangeRecord', 'refresh')
            exchangeSuccessRef.value.openDrawer()
          }
        })
        .catch(() => {})
        .finally(() => {
          setTimeout(() => {
            loading.value = false
          }, 200)
        })
    } else {
      ElMessage.warning('请输入兑换的数量')
    }
  }, 200)
}

//跳转兑换记录
const toExchangeRecord = () => {
  closeDialog()
  router.push({
    name: 'ExchangeRecord'
  })
}

const setBannerImage = async (e: any) => {
  const avatar = await import('@/assets/imgs/default_pic3.png')
  e.target.src = avatar.default
}

defineExpose({
  openDrawer
})
</script>
<style lang="less" scoped>
.left-form-class {
  width: 60%;
  padding: 22px;
}

.right-form-class {
  width: 40%;
  display: flex;
  flex-direction: column;
  padding-left: 33px;
  padding-right: 10px;
  padding-bottom: 40px;
  overflow-y: auto;
  background: white;
}

.swiper {
  width: 100%;
  height: 100%;
}

.swiper-slide {
  text-align: center;
  font-size: 18px;
  background: #fff;

  /* Center slide text vertically */
  display: -webkit-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  -webkit-justify-content: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  -webkit-align-items: center;
  align-items: center;
}

.swiper {
  width: 100%;
  height: 100%;
  margin-left: auto;
  margin-right: auto;
}

.swiper-slide {
  background-size: cover;
  background-position: center;
}

.mySwiper2 {
  height: 58vh;
  width: 100%;
  border-radius: 12px;
}

.mySwiper {
  margin-top: 14px;
  width: 100%;
  height: 100px;
  box-sizing: border-box;
  margin-top: 10px;
}

.swiper-cover {
  position: absolute;
  width: 100%;
  height: 30%;
  background-color: rgba(0, 0, 0, 0.6);
  bottom: 0%;
  right: 0%;
  z-index: 100;
}

.swipercover-bottom {
  margin-left: 10%;
  width: 100%;
  height: 70%;
}

.mySwiper .swiper-slide {
  width: 100%;
  height: 100%;
  opacity: 0.4;
  border-radius: 4%;
}

.mySwiper .swiper-slide-thumb-active {
  opacity: 1;
}

.swiper-pagination-clickable .swiper-pagination-bullet {
  cursor: auto;
}

.button-wrap {
  text-align: center;
  margin-top: auto;
}

.goods-name {
  margin-top: 15px;
  font-size: 26px;
  font-weight: 600;
  width: 100%;
  color: #222222;
  line-height: 28px;
}

.goods-price {
  margin-top: 1vh;
  font-size: 16px;
  font-weight: 600;
  width: 100%;
  color: #ffb200;
  span {
    font-size: 22px;
  }
}

.img-wrap {
  display: block;
  padding: 15px 10px;
  background: white;
  border-radius: 4px;
  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    -webkit-user-select: none;
    -moz-user-select: none;
    -o-user-select: none;
    user-select: none;
  }
}
.right-close-class {
  margin-top: 15px;
  margin-right: 20px;
  display: flex;
}
.goods-desc {
  margin-top: 1.5vh;
  font-size: 14px;
  font-weight: 400;
  color: #555555;
  line-height: 26px;
}
.goods-quantity {
  margin-top: 1vh;
  height: 35px;
  font-size: 15px;
  font-weight: 200;
  font-family: Alibaba PuHuiTi B;
  color: #444444;
  line-height: 35px;
  .input-class {
    margin-left: 10px;
    width: 120px;
  }
}
.exchange-button {
  width: 16vw;
}
</style>

<style lang="less">
.swiper-button-prev {
  color: #ececec;
}
.swiper-button-next {
  color: #ececec;
}
.market-dialog {
  .el-dialog__header {
    display: none;
  }
  .el-dialog__body {
    background: #eff1f4 !important;
    padding: 0px !important;
  }
}
</style>