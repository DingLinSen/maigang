<template>
  <ContentWrap :isShowtitle="false" class="satistics_menu-contentWrap">
    <section class="satistics_menu_main_sub h-[110px] flex items-center px-[1.04vw]">
      <div class="satistics_menu_content flex">
        <div class="img_item flex w-[33.3vw]">
          <img alt="" src="@/assets/imgs/school/fa_icon.png" />
          <div class="ml-5px" style="margin-top: -3px">
            <span class="text-2xl font-bold ml-5px">{{ menuData.product.productCount }}</span>
            <p class="product_text">产品方案</p>
          </div>
        </div>
        <div class="download-item w-[33.3vw]">
          <div class="download-number">
            <p
              >下载: <span class="text-xl font-bold">{{ menuData.product.downloadCount }}</span
              >人次</p
            >
          </div>
          <span class="view_details" @click="handleDetail('产品方案')"> 查看详情> </span>
        </div>
        <div class="download-item flex w-[33.3vw] ml-1.56vw mt-16px">
          <div>
            <div>
              <p
                >浏览: <span class="text-xl font-bold">{{ menuData.product.viewCount }}</span
                >人次</p
              >
            </div>
          </div>
        </div>
      </div>
      <div class="satistics_menu_content flex">
        <div class="img_item flex w-[33.3vw]">
          <img alt="" src="@/assets/imgs/school/zs_icon.png" />
          <div class="ml-5px" style="margin-top: -3px">
            <span class="text-2xl font-bold ml-5px">{{ menuData.industry.industryCount }}</span>
            <p class="product_text">行业知识</p>
          </div>
        </div>
        <div class="download-item w-[33.3vw]">
          <div class="download-number">
            <p
              >下载: <span class="text-xl font-bold">{{ menuData.industry.downloadCount }}</span
              >人次</p
            >
          </div>
          <span class="view_details" @click="handleDetail('行业知识')"> 查看详情> </span>
        </div>
        <div class="download-item flex w-[33.3vw] ml-1.56vw mt-16px">
          <div>
            <div>
              <p
                >浏览: <span class="text-xl font-bold">{{ menuData.industry.viewCount }}</span
                >人次</p
              >
            </div>
          </div>
        </div>
      </div>
      <div class="satistics_menu_content flex">
        <div class="img_item flex w-[33.3vw]">
          <img alt="" src="@/assets/imgs/school/kt_icon.png" />
          <div class="ml-5px" style="margin-top: -3px">
            <span class="text-2xl font-bold ml-5px">{{ menuData.course.courseCount }}</span>
            <p class="product_text">培训课堂</p>
          </div>
        </div>
        <div class="download-item w-[33.3vw]">
          <div class="download-number">
            <p
              >浏览: <span class="text-xl font-bold">{{ menuData.course.viewCount }}</span
              >人次</p
            >
          </div>
          <span class="view_details" @click="handleDetail('培训课堂')"> 查看详情> </span>
        </div>
        <div class="download-item flex w-[33.3vw] ml-1.56vw mt-16px">
          <div>
            <div>
              <p
                >点赞: <span class="text-xl font-bold">{{ menuData.course.likeCount }}</span
                >人次</p
              >
            </div>
          </div>
        </div>
      </div>
    </section>
  </ContentWrap>
  <!--  统计详情  -->
  <StatisticsDetailList ref="StatisticsDetailListRef" @change-get-detail-and-list="resetList" />
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { ContentWrap } from '@/components/ContentWrap'
import StatisticsDetailList from './statisticsDetailList.vue'
import { getDataStartListApi } from '@/api/school/statistics'

const menuData = ref({
  product: {},
  industry: {},
  course: {}
})
const StatisticsDetailListRef = ref<any>()

// 获取头部卡片的信息
const getMenuData = async () => {
  const res = await getDataStartListApi()
  menuData.value = res.data
}
onMounted(() => {
  getMenuData()
})
// 查看统计详情
const handleDetail = (moduleName: string) => {
  StatisticsDetailListRef.value.openDrawer(moduleName)
}
</script>

<style lang="less" scoped>
:deep(.satistics_menu_main_sub) {
  padding: 0 !important;
}

:deep(.el-card__body) {
  padding: 0 20px !important;
}

.satistics_menu_content {
  overflow: hidden;
  border-radius: 4px;
  // width: 27.6vw;
  height: 84px;
  margin-right: 10px;
  cursor: pointer;

  &:last-child {
    margin-right: 0;
    background: #ecf9f4;
    border: 1px solid #7bd2ff;

    .img_item {
      margin: 19px 0 19px 21px;
      border-right: 1px solid #c3f2df;

      img {
        margin-top: 5px;
        width: 36px;
        height: 36px;
      }
    }

    .download-item {
      margin: 18px 0 19px 30px;

      .download-number {
        border-right: 1px solid #c3f2df;
      }

      .view_details {
        color: #1db378;
      }
    }
  }

  &:nth-child(1) {
    background: #eff8fc;
    border: 1px solid #7bd2ff;

    .img_item {
      margin: 19px 0 19px 21px;
      border-right: 1px solid #ccedfd;

      img {
        margin-top: 5px;
        width: 36px;
        height: 36px;
      }
    }

    .download-item {
      margin: 18px 0 19px 30px;

      .download-number {
        border-right: 1px solid #ccedfd;
      }

      .view_details {
        color: #00a0e9;
      }
    }
  }

  &:nth-child(2) {
    background: #fdf9ec;
    border: 1px solid #f5cd57;

    .img_item {
      margin: 19px 0 19px 21px;
      border-right: 1px solid #ffedb9;

      img {
        margin-top: 5px;
        width: 36px;
        height: 36px;
      }
    }

    .download-item {
      margin: 18px 0 19px 30px;

      .download-number {
        border-right: 1px solid #ffedb9;
      }

      .view_details {
        color: #eaaf00;
      }
    }
  }
}
// @media screen and (max-width: 1430px) {
//   .satistics_menu_content {
//     overflow: hidden;
//     border-radius: 4px;
//     // width: 27.6vw;
//     height: 70px;
//     margin-right: 10px;
//     cursor: pointer;

//     &:last-child {
//       margin-right: 0;
//       background: #ecf9f4;
//       border: 1px solid #7bd2ff;

//       .img_item {
//         padding-right: 2px;
//         margin: 10px 0 10px 5px;
//         border-right: 1px solid #c3f2df;

//         img {
//           margin-top: 5px;
//           width: 30px;
//           height: 30px;
//         }
//       }

//       .download-item {
//         margin: 5px 0 10px 5px;
//         font-size: 12px;
//         .download-number {
//           border-right: 1px solid #c3f2df;
//         }

//         .view_details {
//           color: #1db378;
//         }
//       }
//     }

//     &:nth-child(1) {
//       background: #eff8fc;
//       border: 1px solid #7bd2ff;

//       .img_item {
//         padding-right: 2px;
//         margin: 10px 0 10px 5px;
//         border-right: 1px solid #ccedfd;

//         img {
//           margin-top: 5px;
//           width: 30px;
//           height: 30px;
//         }
//       }

//       .download-item {
//         margin: 5px 0 10px 5px;
//         font-size: 12px;
//         .download-number {
//           border-right: 1px solid #ccedfd;
//         }

//         .view_details {
//           color: #00a0e9;
//         }
//       }
//     }

//     &:nth-child(2) {
//       background: #fdf9ec;
//       border: 1px solid #f5cd57;

//       .img_item {
//         padding-right: 2px;
//         margin: 10px 0 10px 5px;
//         border-right: 1px solid #ffedb9;

//         img {
//           margin-top: 5px;
//           width: 30px;
//           height: 30px;
//         }
//       }

//       .download-item {
//         margin: 5px 0 10px 5px;
//         font-size: 12px;
//         .download-number {
//           border-right: 1px solid #ffedb9;
//         }

//         .view_details {
//           color: #eaaf00;
//         }
//       }
//     }
//   }
// }
</style>
