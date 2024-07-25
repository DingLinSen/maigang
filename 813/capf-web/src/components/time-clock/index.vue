<template>
  <span>
    {{ nowTime }}
  </span>
</template>
<script>
export default {
  data() {
    return {
      nowTime: this.formatWeekDate(new Date()),
      timeInterval: null
    }
  },
  mounted() {
    this.intervalTime()
  },
  methods: {
    intervalTime() {
      const _this = this
      this.timeInterval = setInterval(() => {
        _this.nowTime = this.formatWeekDate(new Date())
      }, 1000)
    }
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  }
}
</script>
