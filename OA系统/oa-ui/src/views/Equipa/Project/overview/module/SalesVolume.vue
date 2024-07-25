<template>
  <ContentBox class="overflow-hidden" :shadow="true">
    <template #header>
      <div class="flex items-center h-full nav">
        <p
          class="tab relative"
          v-for="(item, index) in selectTab"
          :key="index"
          @click="selectChange(item)"
          :class="item.type === tabType ? 'active' : ''"
          >{{ item.label }}
        </p>
      </div>
    </template>
    <template #content>
      <!-- 销售额 -->
      <SaleEcharts v-if="tabType === 1" :salesVolume="salesVolume" />
      <!-- 项目统计 -->
      <VitalEcharts v-else :typeProportion="typeProportion" />
    </template>
  </ContentBox>
</template>

<script setup lang="ts">
import { ContentBox } from '@/views/Equipa/Project/overview/components'
import { SaleEcharts, VitalEcharts } from './SalesVolumeEcharts'
import { ref } from 'vue'
const tabType = ref(1)

const props = defineProps({
  salesVolume: {
    type: Array,
    default: []
  },
  typeProportion: {
    type: Array,
    default: []
  }
})

const selectTab = ref([
  {
    type: 1,
    label: '销售额'
  },
  {
    type: 2,
    label: '项目统计'
  }
])
// tab
const selectChange = (e) => {
  tabType.value = e.type
}
</script>

<style lang="less" scoped>
.nav p {
  font-size: 16px;
  margin: 0 13px;
  padding: 0 5px;
  font-family: Alibaba PuHuiTi M;
  font-weight: 400;
  color: #333333;
  cursor: pointer;
}
.nav .active {
  border-bottom: 2px solid #00a0e9;
}

ul li {
  &:last-child {
    border: 0;
  }
}

@media screen and (max-width: 1536px) {
  .nav p {
    font-size: 14px !important;
    padding: 0 15px;
  }
}
</style>
