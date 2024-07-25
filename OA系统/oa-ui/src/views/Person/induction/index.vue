<template>
  <div class="induction">
    <!-- <div class="my-2">
      <Title title="入职申请" />
    </div> -->
    <Form />
  </div>
  <LimitDailog routerName="induction" />
</template>
<script setup lang="ts">
import Form from './components/Form.vue'
import { LimitDailog } from '@/views/Components/limit'

defineOptions({
  name: 'Induction'
})

</script>

<style lang="less"></style>
