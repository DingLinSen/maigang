<script setup lang="ts">
const props = defineProps({
  progressStatus: {
    type: String,
    default: ''
  }
})
</script>
<template>
  <div
    :class="
      progressStatus == '3'
        ? 'remind-class remind-text-long-class'
        : progressStatus === '1' || progressStatus === '2'
        ? 'remind-class remind-text-class'
        : progressStatus === '-1' || progressStatus === '-2' || progressStatus === '-3'
        ? 'remind-class remind-text-short-class'
        : ''
    "
  >
    <img
      class="img-cell-class"
      v-if="progressStatus && progressStatus !== '0'"
      src="@/assets/imgs/task/state_icon5.png"
    />
    <span class="content-class">
      {{
        progressStatus === '1'
          ? '有新进展'
          : progressStatus === '2'
          ? '有待处理'
          : progressStatus === '3'
          ? '有新进展和待处理'
          : progressStatus === '-1'
          ? '里程碑1'
          : progressStatus === '-2'
          ? '里程碑2'
          : progressStatus === '-3'
          ? '里程碑3'
          : '--'
      }}
    </span>
  </div>
</template>
<style lang="less" scoped>
.content-class {
  margin-left: 2px;
}
.remind-class {
  margin: auto;
  height: 26px;
  font-size: 13px;
  display: flex;
  background: #ffe7e8;
  border-radius: 2px;
  padding: 4px 6px;
  color: #ff565c;
  align-items: center;
}
.img-cell-class {
  width: 13px;
  height: 13px;
}
.remind-text-class {
  width: 82px;
}
.remind-text-long-class {
  width: 140px;
}
.remind-text-short-class {
  width: 74px;
}
@media screen and (max-width: 1536px) {
  .remind-text-class {
    width: 78px;
  }
  .remind-text-long-class {
    width: 130px;
  }
  .remind-text-short-class {
    width: 72px;
  }
}
</style>