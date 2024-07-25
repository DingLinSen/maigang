<script setup lang="ts">
import { PropType, ref } from 'vue'
import moment from 'moment'

const props = defineProps({
  flowDatas: {
    type: Array as PropType<any[]>,
    default: () => []
  }
})

const getRoleName = (roleName: any): string => {
  if (roleName) {
    let roleArray = roleName.split(',')
    if (roleArray.length > 0) {
      return roleArray[0]
    } else {
      return roleName
    }
  } else {
    return '--'
  }
}
</script>
<template>
  <div class="w-full table mt-[20px]" v-for="(item, index) in flowDatas" :key="item.id">
    <div class="table-row w-full h-full">
      <div class="right-left-class">
        <div
          class="right-icon-class"
          :style="{
            background:
              item.step === '已驳回'
                ? '#FF6464'
                : item.step === '待审核' ||
                  item.step === '待归档' ||
                  item.step === '待领取' ||
                  item.step === '待采购'
                ? '#00A0E9'
                : '#02BB00'
          }"
        >
          <img
            src="@/assets/imgs/order/examine_icon.png"
            class="right-icon-apply-class"
            v-show="
              item.step === '已通过' ||
              item.step === '已驳回' ||
              item.step === '待归档' ||
              item.step === '待审核' ||
              item.step === '待领取' ||
              item.step === '待采购' ||
              item.step === '已采购' ||
              item.step === '已领取'
            "
          />
          <img
            src="@/assets/imgs/order/file_icon.png"
            class="right-icon-apply-class"
            v-show="item.step === '已归档' || item.step === '归档'"
          />
          <img
            src="@/assets/imgs/order/user_icon.png"
            class="right-icon-apply-class"
            v-show="!item.step || item.step === '提出申请' || item.step === '补充'"
          />
        </div>
        <img
          src="@/assets/imgs/order/pass_icon.png"
          class="right-icon-status-class"
          v-show="
            item.step === '已通过' ||
            item.step === '已采购' ||
            item.step === '已领取' ||
            item.step === '提出申请' ||
            item.step === '已归档'
          "
        />
        <img
          src="@/assets/imgs/order/wait_icon.png"
          class="right-icon-status-class"
          v-show="
            item.step === '待审核' ||
            item.step === '待归档' ||
            item.step === '待领取' ||
            item.step === '待采购'
          "
        />
        <img
          src="@/assets/imgs/order/reject_icon.png"
          class="right-icon-status-class"
          v-show="item.step === '已驳回'"
        />
        <div class="right-line-class" v-show="index !== flowDatas.length - 1"> </div>
      </div>
      <div class="right-apply-info-class">
        <span
          class="right-name-class inline-block w-[60%]"
          :title="getRoleName(item.roleName) + '：' + item.createByName"
          >{{ getRoleName(item.roleName) + '：' + item.createByName }}</span
        >
        <span class="right-date-class">{{
          item.createTime ? moment(item.createTime).format('MM-DD HH:mm:ss') : ''
        }}</span>
        <div>
          <span
            class="right-status-class"
            :style="{
              color:
                item.step === '已驳回'
                  ? '#FF6464'
                  : item.step === '待审核' ||
                    item.step === '待归档' ||
                    item.step === '待领取' ||
                    item.step === '待采购'
                  ? '#00A0E9'
                  : '#02bb00'
            }"
            >{{ item.step ? item.step : '提出申请' }}</span
          ></div
        >
        <div v-if="item.explain" class="right-reason-class">{{ item.explain }}</div>
        <div v-else class="h-[20px]"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.right-left-class {
  width: 44px;
  display: table-cell;
  height: 0px;
}
.right-icon-class {
  width: 36px;
  height: 36px;
  background: #02bb00;
  border-radius: 50%;
}

.right-icon-apply-class {
  width: 18px;
  height: 18px;
  margin: 9px;
  display: inline;
}

.right-icon-status-class {
  width: 16px;
  height: 16px;
  margin-top: -14px;
  margin-left: 22px;
}
.right-apply-info-class {
  width: 90%;
  display: table-cell;
  vertical-align: middle;
  min-height: 80px;
  padding-left: 10px;
}

.right-name-class {
  color: #444444;
  font-size: 14px;
  font-family: 'Alibaba PuHuiTi R';
  font-weight: 400;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.right-date-class {
  color: #888888;
  font-size: 14px;
  font-family: 'Alibaba PuHuiTi R';
  font-weight: 400;
  float: right;
}
.right-status-class {
  color: #02bb00;
  font-size: 14px;
  font-family: 'Alibaba PuHuiTi R';
  font-weight: 400;
  top: 30px;
}

.right-reason-class {
  width: 100%;
  margin-top: 10px;
  color: #444444;
  font-size: 14px;
  font-family: 'Alibaba PuHuiTi R';
  font-weight: 400;
  background: #f5f6f7;
  padding: 13px 15px;
  border-radius: 8px;
  word-break: break-word;
}

.right-line-class {
  width: 1px;
  background: #eeeeee;
  height: 100%;
  margin-left: 17.5px;
}
</style>
