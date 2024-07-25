<template>
  <div class="statistics">
    <StatisticsMenu />
    <div class="flex mt-[14px]">
      <div class="statistics_left">
        <div class="statistics_box">
          <TopSearch :hotSearchList="hotSearchList" />
          <Ranking :topFiveList="topFiveList" />
        </div>
      </div>
      <StatisticsList />
    </div>
  </div>
  <LimitDailog routerName="statistics" />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import StatisticsMenu from './components/statisticsMenu.vue'
import TopSearch from './components/topSearch.vue'
import Ranking from './components/ranking.vue'
import StatisticsList from './components/statisticsList.vue'
import { getDataStartListApi } from '@/api/school/statistics'
import { LimitDailog } from '@/views/Components/limit'

defineOptions({
  name: 'Statistics'
})

const topFiveList = ref([])
const hotSearchList = ref([])
const getDataStartList = async () => {
  const res = await getDataStartListApi()
  topFiveList.value = res.data.top5List
  hotSearchList.value = res.data.hotSearchList
}
getDataStartList()
</script>

<style scoped>
.statistics {
  height: 100%;
}
.statistics_left {
  width: 30%;
}
</style>
