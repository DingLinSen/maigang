<script setup lang="ts">
import { propTypes } from '@/utils/propTypes'
defineProps({
  title: propTypes.string.def('')
})
</script>
<template>
  <div>
    <h3 class="flex bg-whilt">
      <span class="block h-8 w-2 bg-blue-400"></span>
      <span class="pl-4 text-xl leading-8">{{ title }}</span>
    </h3>
  </div>
</template>
