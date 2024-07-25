<template lang="html">
  <Page class="page-wrapper"
    v-if="showPage"
    :current="current"
    :placement="placement"
    :show-total="showTotal"
    :show-elevator="showElevator"
    :show-sizer="showSizer"
    :total="total"
    :page-size="pageSize"
    :page-size-opts="pageSizeOPTS"
    @on-change="pageChange"
    @on-page-size-change="pageSizeChange">

    <span>
      共 <b class="c-red">{{ total }}</b> 条信息
      <span v-if="censusNum !== null && censusNum !== '' && censusTitle !== null && censusTitle !== ''">
        , {{ censusTitle }} <b class="c-red">{{ formatterValue(censusNum) }}</b>
        <font v-if="censusUnit !== null && censusUnit !== ''">{{ censusUnit }}</font>
      </span>
    </span>
  </Page>
</template>

<script>
export default {
  data() {
    return {
      current: 1,
      pageSizeOPTS: [10, 20, 30, 40]
    }
  },
  watch: {
    'total': function() {
      if (this.total === 0) this.current = 1
    },
    'pageNo': function(val) {
      this.current = val
    }
  },
  methods: {
    formatterValue(number) {
      number = Number(number)
      if (parseInt(number) === number) {
        return number
      }
      return number.toFixed(2)
    },
    pageSizeChange(pageSize) { // 切换每页条数时的回调，返回切换后的每页条数
      this.$emit('page-size-change', pageSize)
    },
    pageChange(pageNo) { // 页码改变的回调，返回改变后的页码
      this.current = pageNo
      this.$emit('page-change', pageNo)
    }
  },
  props: {
    pageNo: {
      type: Number,
      default: 1
    },
    censusTitle: {
      default: null,
      type: String
    },
    censusNum: {
      default: null,
      type: Number
    },
    censusUnit: {
      default: null,
      type: String
    },
    placement: {
      default: 'top',
      type: String
    },
    showSizer: {
      default: true,
      type: Boolean
    },
    showElevator: {
      default: true,
      type: Boolean
    },
    showTotal: {
      default: true,
      type: Boolean
    },
    showPage: {
      default: true,
      type: Boolean
    },
    total: {
      default: 0,
      type: Number
    },
    pageSize: {
      type: Number,
      default: 20
    }
  }
}
</script>

<style lang="css">
.page-wrapper {
  padding-left: 10px;
  border-top: 1px solid #f5f5f5;
}
.ivu-page-total{
  height: 50px;
  line-height: 50px;
}
</style>
