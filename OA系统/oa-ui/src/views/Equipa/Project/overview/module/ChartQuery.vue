<template>
  <ContentWrap :isShowtitle="false" class="satistics_menu-contentWrap chart-query-contentWrap">
    <div class="2xl:h-[51px] h-46px flex items-end">
      <div class="ml-[1.04vw] mr-[0.89vw]">
        <el-date-picker
          style="width: 10.21vw"
          v-model="param.year"
          @change="init"
          value-format="YYYY"
          format="YYYY"
          type="year"
          placeholder="请选择年份"
        />
      </div>
      <div class="mr-[0.89vw]">
        <el-select
          filterable
          class="w-[10.21vw]"
          clearable
          v-model="param.projectType"
          @change="init"
          placeholder="请选择项目类型"
        >
          <el-option
            v-for="item in project_types"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div>
        <el-cascader
          filterable
          class="w-[10.21vw]"
          @change="init"
          clearable
          v-model="param.principalPerson"
          placeholder="请选择项目负责人"
          :props="{
            label: 'deptName',
            value: 'deptId'
          }"
          :options="principalTree"
        />
      </div>
    </div>
    <div class="flex">
      <Effect class="pr-[0.68vw] w-[30%]" :effect="effect" />
      <TypeProportion :typeProportion="typeProportion" class="pr-[0.68vw] w-[30%]" />
      <SalesVolume :salesVolume="salesVolume" :typeProportion="typeProportion" class="flex-1" />
    </div>
    <!-- <div class="block 2xl:hidden">
      <div class="flex">
        <Effect class="pr-[0.68vw]" :effect="effect" />
        <TypeProportion :typeProportion="typeProportion" class="pr-[0.68vw]" />
      </div>
      <div class="pl-[0.5vw]">
        <SalesVolume :salesVolume="salesVolume" :typeProportion="typeProportion" />
      </div>
    </div> -->
  </ContentWrap>
</template>

<script setup lang="ts">
import { ref, getCurrentInstance, inject } from 'vue'
import { ContentWrap } from '@/components/ContentWrap'
import { topApi } from '@/api/project/overview'
import TypeProportion from './TypeProportion.vue'
import SalesVolume from './SalesVolume.vue'
import Effect from './Effect.vue'

const { proxy } = getCurrentInstance() as any
const project_types = [
  {
    label: '农业农村',
    value: 0
  },
  {
    label: '铁路交通',
    value: 1
  },
  {
    label: '军工',
    value: 2
  },
  {
    label: '其他',
    value: 3
  },
  {
    label: '自研',
    value: 4
  }
]

const principalTree = inject('principalTree')

const chartQueryData = ref<any>()
const effect = ref([])
const salesVolume = ref([])
const typeProportion = ref([])
const param = ref<any>({
  year: '',
  projectType: '',
  principalPerson: ''
})

const init = async () => {
  let res = await topApi({
    year: param.value.year,
    projectType: param.value.projectType,
    principalPerson: param.value.principalPerson ? param.value.principalPerson[1] : ''
  })
  if (res && res.data) {
    chartQueryData.value = res.data
    effect.value = res.data.top
    salesVolume.value = res.data.types
    typeProportion.value = res.data.yearCount
  }
}

init()
// getAllUserlist()
</script>

<style lang="less">
.satistics_menu-contentWrap {
  margin-bottom: 10px !important;
}
.satistics_menu-contentWrap .el-card__body {
  padding: 0 !important;
}
// .chart-query-contentWrap {
//   .el-select {
//     margin: 0 !important;
//   }
// }
</style>
