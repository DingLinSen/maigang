<template>
  <section class="induction">
    <!-- <div class="my-2">
      <Title title="个人档案" />
    </div> -->
    <Form />
  </section>
  <LimitDailog routerName="dossier" />
</template>
<script setup lang="ts">
import Form from './components/Form.vue'
import { LimitDailog } from '@/views/Components/limit'
defineOptions({
  name: 'Dossier'
})
</script>

<style lang="less"></style>
