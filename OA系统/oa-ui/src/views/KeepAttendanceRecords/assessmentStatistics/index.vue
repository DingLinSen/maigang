<template>
  <div>
    <List v-if="isAuth('keepAttend:details:dept')" />
    <OwnAppraiseDetails v-else />
    <LimitDailog routerName="assessmentStatistics" />
  </div>
</template>
<script setup lang="ts">
import { isAuth } from '@/utils/is' // 鉴权
import OwnAppraiseDetails from './ownAppraiseDetails.vue'
import List from './list.vue'
import { LimitDailog } from '@/views/Components/limit'

defineOptions({
  name: 'AssessmentStatistics'
})
</script>
