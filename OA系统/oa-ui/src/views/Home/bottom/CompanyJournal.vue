<template>
  <BottomCard title="公司期刊" @moreClick="more">
    <template #content>
      <div class="periodical-wrap-class">
        <div v-if="journalList.length" class="w-full periodical-wrap-class-div">
          <div class="item-wrap-class" v-for="(item, index) in journalList" :key="index">
            <span
              :class="
                index == 0
                  ? 'first-item-class'
                  : index == 1
                  ? 'second-item-class'
                  : index == 2
                  ? 'third-item-class'
                  : 'other-item-class'
              "
              >{{ index + 1 }}
            </span>
            <p class="record-content-class" :title="item.title" @click="itemClick(item)"
              >{{ item.title }}
            </p>
            <div
              class="periodli-link"
              @click="downloadFileSub(item)"
              v-show="item.filePath !== null && item.filePath !== '' && item.filePath !== 'null'"
            >
            </div>
          </div>
        </div>
        <div
          class="px-[1.56vw] pt-[6px] h-full overflow-scroll flex justify-center items-center w-full"
          v-else
        >
          <NoData />
        </div>
      </div>
    </template>
  </BottomCard>
</template>
<script setup lang="ts">
import moment from 'moment'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { BottomCard } from './components'
import { useRouter } from 'vue-router'
import { downloadFile } from '@/utils/index'
import { getCompanyJournalList } from '@/api/CulturaEmpresarial/periodical'
import NoData from '@/views/Components/NoData.vue'

const emit = defineEmits(['itemClick'])
const { push } = useRouter()
onMounted(() => {
  getList()
})

const more = () => {
  push({ name: 'CompanyPeriodical' })
}
const journalList = ref<any>([])

const itemClick = (item: any) => {
  emit('itemClick', item)
}

const fileNext = (path: any) => {
  let extension = ''
  if (path) {
    extension = path.substring(path.lastIndexOf('.') + 1)
  }
  return extension
}
//下载
const downloadFileSub = (row: any) => {
  downloadFile(row.filePath, row.title + '.' + fileNext(row.filePath))
}

const getList = async () => {
  let params = {
    pageNum: 1,
    pageSize: 6
  }
  const res = await getCompanyJournalList(params)
  if (res && res.rows) {
    journalList.value = res.rows
  } else {
    journalList.value = []
  }
}
</script>

<style lang="less" scoped>
.periodical-wrap-class {
  width: 100%;
  height: 100%;
  padding-left: 12px;
  padding-right: 12px;
  overflow-y: auto;
  display: flex;
  align-items: center;
}
.item-wrap-class {
  width: 100%;
  height: 2.57em;
  display: flex;
  align-items: center;
  justify-content: center;
  .periodli-link {
    background: url('@/assets/imgs/home/download_icon.png') no-repeat center;
    width: 18px;
    margin-left: 10px;
    margin-right: 12px;
    height: 100%;
    cursor: pointer;
  }
}
// @media screen and (max-width: 1536px) {
//   .item-wrap-class {
//     height: 32px;
//   }
//   .periodical-wrap-class {
//     padding: 0 9px;
//   }
//   .first-item-class,
//   .second-item-class,
//   .third-item-class,
//   .other-item-class {
//     margin-left: 5px !important;
//   }
// }
.item-wrap-class:hover {
  background: #f6f6f8;
  border-radius: 4px;
  color: #00a0e9;
  .periodli-link {
    background: url('@/assets/imgs/home/xz_icon.png') no-repeat center;
  }
}
.first-item-class {
  width: 1.43em;
  height: 1.43em;
  background: #ffe5e5;
  border-radius: 4px;
  text-align: center;
  line-height: 1.43em;
  font-size: 14px;
  margin-left: 12px;
  font-family: Alibaba PuHuiTi M;
  font-weight: 500;
  color: #ff5252;
}

.second-item-class {
  width: 1.43em;
  height: 1.43em;
  background: #fff1e1;
  border-radius: 4px;
  text-align: center;
  line-height: 1.43em;
  margin-left: 12px;
  font-size: 14px;
  font-family: Alibaba PuHuiTi M;
  font-weight: 500;
  color: #f99427;
}

.third-item-class {
  width: 1.43em;
  height: 1.43em;
  background: #fff5de;
  border-radius: 4px;
  text-align: center;
  margin-left: 12px;
  line-height: 1.43em;
  font-size: 14px;
  font-family: Alibaba PuHuiTi M;
  font-weight: 500;
  color: #f9bb2d;
}
.other-item-class {
  width: 1.43em;
  height: 1.43em;
  background: #eeeeee;
  border-radius: 4px;
  text-align: center;
  line-height: 1.43em;
  font-size: 14px;
  margin-left: 12px;
  font-family: Alibaba PuHuiTi M;
  font-weight: 500;
  color: #999999;
}

.record-content-class {
  flex: 1;
  height: 2.37em;
  line-height: 2.37em;
  font-size: 14px;
  font-family: Alibaba PuHuiTi R;
  font-weight: 400;
  color: #222222;
  margin-left: 10px;
  margin-right: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
}

.record-content-class:hover {
  color: #00a0e9;
}

@media (min-width: 1536px) and (max-width: 1919px) {
  // .periodical-wrap-class-div {
  //   margin-top: 15px;
  // }
  // .item-wrap-class {
  //   height: 32px;
  // }
}
</style>
